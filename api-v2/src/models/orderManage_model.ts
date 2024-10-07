import { readSettingTimeRange } from '../utils';
import AppDataSource from '../data-source';
import { Order } from '../entity/Order';
import { OrderDetail } from '../entity/OrderDetail';
import { Product } from '../entity/Product';
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
        .where(conditions.join(" AND "), parameters)
        .innerJoin(`(${subQuery.getQuery()})`, "maxOrders", "maxOrders.orderCode = order.orderCode AND maxOrders.maxOrderIndex = order.orderIndex")
        .leftJoin("order.shop", "shop")
        .orderBy("order.updateDate", "DESC")
        .skip((page - 1) * size)
        .take(size)
        .getMany();

    return results;
}

// 獲取訂單
export async function readOrder(options, size, page) {
    return getOrderAndGroupBy(options, size, page)
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
        .getRawMany();
}

// 如有修改訂單,沒有則創建訂單
export async function createOrder(data) {
    const existingOrder = await orderRepository
        .createQueryBuilder()
        .select('MAX(order.lastOrder)', 'lastOrder')
        .where("order.orderCode = :orderCode", { orderCode: data.orderCode })
        .getOne()
    console.log(existingOrder)
    const newOrder = orderRepository.create({
        state: 0,
        orderUserId: data.orderUserId,
        orderUserName: data.orderUserName,
        orderShopId: data.orderShopId,
        department: data.department,
        orderDate: data.orderDate,
        orderCode: data.orderCode,
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
    return { ...newOrder, success: true };
}
