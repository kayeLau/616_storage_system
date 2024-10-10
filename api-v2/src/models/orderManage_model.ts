import { readSettingTimeRange } from '../utils';
import AppDataSource from '../data-source';
import { Order } from '../entity/Order';
import { OrderDetail } from '../entity/OrderDetail';
import { Product } from '../entity/Product';
import { Shop } from '../entity/Shop';
import { optionsGenerater } from './base_model';
const orderRepository = AppDataSource.getRepository(Order);
const orderDetailRepository = AppDataSource.getRepository(OrderDetail);


// 根據orderCode groupby
async function getOrderAndGroupBy(options, size, page) {
    const { conditions, parameters } = optionsGenerater(options, "order");
    const orderDateRange = await readSettingTimeRange();
    const orderDateStr = orderDateRange[0].substring(0, 10);

    const subQuery = orderRepository
        .createQueryBuilder("subOrder")
        .select('subOrder.orderCode', 'orderCode')
        .addSelect('MAX(subOrder.orderIndex)', 'maxOrderIndex')
        .groupBy('subOrder.orderCode')

    const results = await orderRepository
        .createQueryBuilder("order")
        .select([
            'order.id AS id',
            'order.orderCode AS orderCode',
            'order.orderUserId AS orderUserId',
            'order.orderUserName AS orderUserName',
            'order.orderShopId AS orderShopId',
            'order.department AS department',
            'order.createDate AS createDate',
            'order.updateDate AS updateDate',
            'order.orderDate AS orderDate',
            'order.orderIndex AS orderIndex',
            'order.state AS state',
            'shop.shopName AS shopName'
        ])
        .where(conditions.join(" AND "), parameters)
        .innerJoin(`(${subQuery.getQuery()})`, "maxOrders", "maxOrders.orderCode = order.orderCode AND maxOrders.maxOrderIndex = order.orderIndex")
        .innerJoin(Shop, 'shop', 'order.orderShopId = shop.shopId')
        .orderBy("order.updateDate", "DESC")
        .skip((page - 1) * size)
        .take(size)
        .getRawMany();

    return results;
}

// 獲取訂單
export async function readOrder(options, size, page) {
    return getOrderAndGroupBy(options, size, page).then((result) => {
        return {
            success: true,
            data: result,
        };
    })
}

// 獲取訂單明細
export async function readOrderDetail(orderId) {
    return orderDetailRepository
        .createQueryBuilder('orderDetail')
        .select([
            'orderDetail.id AS id',
            'orderDetail.orderId AS orderId',
            'orderDetail.productId AS orderId',
            'orderDetail.orderQuantity AS orderQuantity',
            'orderDetail.assignQuantity AS assignQuantity',
            'orderDetail.updateDate AS updateDate',
            'orderDetail.orderMode AS orderMode',
            'orderDetail.status AS status',
            'orderDetail.remark AS remark',
            'orderDetail.lastEditBy AS lastEditBy',
            'product.productName AS productName'
        ])
        .innerJoin(Product, 'product', 'orderDetail.productId = product.productId')
        .where('orderDetail.orderId = :orderId', { orderId })
        .orderBy('product.productCode', 'ASC')
        .getRawMany()
        .then((result) => {
            return {
                success: true,
                data: result,
            };
        })
        .catch((err) => {
            return Promise.reject({ success: false, message: err.message })
        })
}

// 創建訂單
export async function createOrder(data) {
    const existingOrder = await orderRepository
        .createQueryBuilder()
        .select('MAX(order.orderIndex)', 'orderIndex')
        .where("order.orderCode = :orderCode", { orderCode: data.orderCode })
        .getRawOne()

    const newOrder = orderRepository.create({
        state: 0,
        orderUserId: data.orderUserId,
        orderUserName: data.orderUserName,
        orderShopId: data.orderShopId,
        department: data.department,
        orderDate: data.orderDate,
        orderCode: data.orderCode,
        orderIndex: existingOrder ? ++existingOrder.orderIndex : 0
    });
    await orderRepository.save(newOrder);
    const orderList = data.orderList.map(item => {
        return [
            data.id, // 訂單ID
            item.productId,
            item.orderQuantity,
            item.orderMode,
            data.updateDate,
            data.orderUserName // 最後修改人ID
        ]
    })
    await orderRepository.save(orderList);
    return { success: true }
}

// 倉庫追加時用
export async function createOrderDetail(orderList) {
    await orderRepository.save(orderList)
    return { success: true }
}

// 檢查重複訂單
export async function checkOrderRepeated(options) {
    const { conditions, parameters } = optionsGenerater(options, "order");
    const existingOrder = await orderRepository
        .createQueryBuilder()
        .where(conditions.join('AND'), parameters )
        .orderBy("order.orderIndex", "DESC")
        .getOne()

    if(existingOrder){
        return readOrderDetail(existingOrder.id).then(result => {
            return {
                success: true,
                data: {
                    ...existingOrder,
                    detail: { ...result.data }
                }
            }
        })
    }else{
        return { success: true , data:null , msg:"當前沒有訂單"}
    }
}

// 設置訂單細項
export function updateAssignQuantity(list, userInfo) {
    return orderDetailRepository
        .createQueryBuilder()
        .update(OrderDetail)
        .set({
            orderQuantity: () => "CASE id " +
                list.map(detail => `WHEN ${detail.id} THEN '${detail.orderQuantity === null ? null : Number(detail.orderQuantity)}'`).join(' ') +
                " END",
            assignQuantity: () => "CASE id " +
                list.map(detail => `WHEN ${detail.id} THEN '${detail.assignQuantity === null ? null : Number(detail.assignQuantity)}'`).join(' ') +
                " END",
            status: () => "CASE id " +
                list.map(detail => `WHEN ${detail.id} THEN '${userInfo.auth === 2 ? 0 : 1}'`).join(' ') +
                " END",
            remark: () => "CASE id " +
                list.map(detail => `WHEN ${detail.id} THEN '${detail.remark || '-'}'`).join(' ') +
                " END",
            lastEditBy: () => "CASE id " +
                list.map(detail => `WHEN ${detail.id} THEN '${detail.name || '-'}'`).join(' ') +
                " END"
        })
        .whereInIds(list.map(detail => detail.id))
        .execute()
        .then(() => { return { success: true } })
        .catch((err) => {
            return Promise.reject({ success: false, message: err.message })
        })
}

// 設置訂單狀態
export async function setOrderState(orderId) {
    let orderState = 0
    const incompleteOrderItem = await orderDetailRepository
        .createQueryBuilder()
        .select("COUNT(*)", "count")
        .from(OrderDetail, "orderDetail")
        .where("orderDetail.orderId = :orderId AND orderDetail.status = 0", { orderId: true })
        .getRawOne();

    if (incompleteOrderItem.length) {
        orderState = 1
    }

    return orderRepository
        .createQueryBuilder()
        .update(Order)
        .set({ state: orderState })
        .where("orderId = :orderId", { orderId })
        .execute()
        .then(() => { return { success: true } })
        .catch((err) => {
            return Promise.reject({ success: false, message: err.message })
        })
}

// 導出肉類總表
interface summaryProductItem {
    productName: string,
    freezersNum: number,
    unit: string,
    orderItems: Array<number>
}
export async function exportOrderMeat(options, size, page, summaryProductIdsMap, shopsList) {
    const order = await getOrderAndGroupBy(options, size, page)
    const summaryProductIds = Object.keys(summaryProductIdsMap)
    const orderDetail = order.map((item) => {
        return orderDetailRepository
            .createQueryBuilder()
            .innerJoin(Shop, 'shop', 'order')
            .where('orderDetail.orderId = :orderId', { orderId: item.id })
            .getMany()
            .then(res => {
                let index = shopsList.indexOf(item.shopName)
                summaryProductIds.forEach(summaryProductId => {
                    let target = res.find(item => item.productId === Number(summaryProductId))
                    summaryProductIdsMap[summaryProductId].orderItems[index] = target ? target.orderQuantity : 0
                })
            })
    })
    await Promise.all(orderDetail)
    let products = Object.values(summaryProductIdsMap) as Product[]
    products = products.sort((a, b) => a.freezersNum - b.freezersNum)
    return {
        success: true,
        data: { products, shopName: shopsList }
    }
}

