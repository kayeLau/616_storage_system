import { readSettingTimeRange } from '../utils';
import AppDataSource from '../data-source';
import { Order } from '../entity/Order';
import { Product } from '../entity/Product';
import { Shop } from '../entity/Shop';
import { optionsGenerater } from './common/base_model';
import { readOrderDetail, createOrderDetail, getOrderDetailStatus } from './orderDetail_model'
const orderRepository = AppDataSource.getRepository(Order);


// 根據orderCode groupby訂單, 并輸出各分店每天最後一筆訂單
async function getOrderAndGroupBy(options, size, page) {
    const { conditions, parameters } = optionsGenerater(options, "order");
    const orderDateRange = await readSettingTimeRange();
    const orderDateStr = orderDateRange[0].substring(0, 10);
    const subQuery = orderRepository
        .createQueryBuilder("subOrder")
        .select('subOrder.orderCode', 'orderCode')
        .addSelect('MAX(subOrder.orderIndex)', 'maxOrderIndex')
        .groupBy('subOrder.orderCode')

    const total = await orderRepository
        .createQueryBuilder("order")
        .where(conditions.join(" AND "), parameters)
        .innerJoin(`(${subQuery.getQuery()})`, "maxOrders", "maxOrders.orderCode = order.orderCode AND maxOrders.maxOrderIndex = order.orderIndex")
        .getCount();

    const query = orderRepository
        .createQueryBuilder("order")
        .select([
            'order.id AS id',
            'order.orderCode AS orderCode',
            'order.orderUserId AS orderUserId',
            'order.orderUserName AS orderUserName',
            'order.orderShopId AS orderShopId',
            'order.department AS department',
            "DATE_FORMAT(order.createDate, '%Y-%m-%d %H:%i:%S') AS createDate",
            "DATE_FORMAT(order.updateDate, '%Y-%m-%d %H:%i:%S') AS updateDate",
            "DATE_FORMAT(order.orderDate, '%Y-%m-%d ') AS orderDate",
            "IF(order.orderDate = '" + orderDateStr + "',1,0) AS isToday",
            'order.orderIndex AS orderIndex',
            'order.state AS state',
            'shop.shopName AS shopName',
            'shop.shopCode AS shopCode'
        ])
        .where(conditions.join(" AND "), parameters)
        .innerJoin(`(${subQuery.getQuery()})`, "maxOrders", "maxOrders.orderCode = order.orderCode AND maxOrders.maxOrderIndex = order.orderIndex")
        .innerJoin(Shop, 'shop', 'order.orderShopId = shop.shopId')
        .orderBy("order.updateDate", "DESC")
        .offset((page - 1) * size)
        .limit(size)

    return query.getRawMany().then(result => {
        return {
            success: true,
            data: result,
            total
        }
    })
}

// 獲取訂單
export async function readOrder(options, size, page) {
    return getOrderAndGroupBy(options, size, page).then((result) => {
        return {
            success: true,
            data: result.data.map(item => {
                item.children = []
                return item
            }),
            total: result.total
        };
    })
}

// 創建訂單
export async function createOrder(data) {
    const existingOrder = await orderRepository
        .createQueryBuilder('order')
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
        return {
            status: 0,
            orderId: newOrder.id, // 訂單ID
            productId: item.productId,
            orderQuantity: item.orderQuantity,
            orderMode: item.orderMode,
            remark: item.remark,
            lastEditBy: data.orderUserName // 最後修改人ID
        }
    })
    await createOrderDetail(orderList);
    return { success: true }
}

// 檢查重複訂單
export async function checkOrderRepeated(options) {
    const { conditions, parameters } = optionsGenerater(options, "order");
    const existingOrder = await orderRepository
        .createQueryBuilder('order')
        .where(conditions.join('AND'), parameters)
        .orderBy("order.orderIndex", "DESC")
        .getOne()

    if (existingOrder) {
        const year = options.orderDate.substring(0,4)
        return readOrderDetail(existingOrder.id, year).then(result => {
            return {
                success: true,
                data: {
                    ...existingOrder,
                    children: result.data
                }
            }
        })
    } else {
        return { success: true, data: null, msg: "當前沒有訂單" }
    }
}

// 設置訂單狀態
export async function setOrderState(orderId: string,  year?: number) {
    const orderState = await getOrderDetailStatus(orderId, year).then(res => {
        if (res.success) {
            return Number(res.data) === 0 ? 1 : 0
        }
    })

    return orderRepository
        .createQueryBuilder()
        .update(Order)
        .set({ state: orderState })
        .where("order.id = :id", { id: orderId })
        .execute()
        .then(() => { return { success: true } })
        .catch((err) => {
            return Promise.reject({ success: false, message: err.message })
        })
}

// 導出匯總表
export async function exportOrder(options, size, page, summaryProductIdsMap, shopsList) {
    const order = await getOrderAndGroupBy(options, size, page)
    const summaryProductIds = Object.keys(summaryProductIdsMap)
    const orderDetail = order.data.map((item) => {
        const year = item.orderDate.substring(0,4)
        return readOrderDetail(item.id, year).then(res => {
            let index = shopsList.indexOf(item.shopName)
            summaryProductIds.forEach(summaryProductId => {
                let target = res.data.find(item => item.productId === Number(summaryProductId))
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

// 查看歷史訂單
export async function readHistoryOrder(options, size, page) {
    const total = await orderRepository
        .createQueryBuilder("order")
        .where('order.orderCode = :orderCode', { orderCode: options.orderCode })
        .getCount();

    return orderRepository
        .createQueryBuilder("order")
        .select([
            'order.id AS id',
            'order.orderCode AS orderCode',
            'order.orderUserId AS orderUserId',
            'order.orderUserName AS orderUserName',
            'order.orderShopId AS orderShopId',
            'order.department AS department',
            "DATE_FORMAT(order.createDate, '%Y-%m-%d %H:%i:%S') AS createDate",
            "DATE_FORMAT(order.updateDate, '%Y-%m-%d %H:%i:%S') AS updateDate",
            'order.orderIndex AS orderIndex',
            "DATE_FORMAT(order.orderDate, '%Y-%m-%d ') AS orderDate",
            'order.state AS state',
            'shop.shopName AS shopName'
        ])
        .where('order.orderCode = :orderCode', { orderCode: options.orderCode })
        .innerJoin(Shop, 'shop', 'order.orderShopId = shop.shopId')
        .orderBy("order.orderIndex", "DESC")
        .skip((page - 1) * size)
        .take(size)
        .getRawMany()
        .then((result) => {
            return {
                data: result.map(item => {
                    item.children = []
                    return item
                }),
                success: true,
                total
            }
        })
        .catch((err) => {
            return Promise.reject({ success: false, message: err.message })
        })
}

