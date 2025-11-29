import AppDataSource from '../data-source';
import { OrderDetailBase } from '../entity/OrderDetailBase';
import { Product } from '../entity/Product';
import { sqlValue } from './base_model'
const orderDetailRepository = AppDataSource.getRepository(OrderDetailBase).manager;

export async function getOrderDetailStatus(orderId){
    const targetYear = new Date().getFullYear();
    const tableName = `order_detail_${targetYear}`

    return await orderDetailRepository
    .createQueryBuilder()
    .from(tableName, 'orderDetail')
    .where("orderDetail.orderId = :orderId AND orderDetail.status = :status", { orderId, status: 0 })
    .getRawMany()
    .then((result) => {
        return {
            success: true,
            data: result.length,
        };
    })
    .catch((err) => {
        return Promise.reject({ success: false, message: err.message })
    })
}

// 獲取訂單明細
export async function readOrderDetail(orderId,orderDate) {
    const targetYear = orderDate || new Date().getFullYear();
    const tableName = `order_detail_${targetYear}`

    return orderDetailRepository
        .createQueryBuilder()
        .from(tableName, 'orderDetail')
        .select([
            'orderDetail.id AS id',
            'orderDetail.orderId AS orderId',
            'orderDetail.productId AS productId',
            'orderDetail.orderQuantity AS orderQuantity',
            'orderDetail.assignQuantity AS assignQuantity',
            "DATE_FORMAT(orderDetail.updateDate, '%Y-%m-%d %H:%i:%S') AS updateDate",
            'orderDetail.orderMode AS orderMode',
            'orderDetail.status AS status',
            'orderDetail.remark AS remark',
            'orderDetail.lastEditBy AS lastEditBy',
            'product.productName AS productName',
            'product.productCode AS productCode',
            'product.unit AS unit',
            'product.standard AS standard',
            'product.classify AS classify',
            'product.freezersNum AS freezersNum',
            'product.prompt AS prompt',
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

// 創建訂單明細
export async function createOrderDetail(orderList: any[], year?: number) {
    if (!orderList || orderList.length === 0) return;

    const targetYear = year ?? new Date().getFullYear();
    const tableName = `order_detail_${targetYear}`;

    const sample = orderList[0];
    const columns = Object.keys(sample)
        .filter(key => sample[key] !== undefined)
        .map(key => `\`${key}\``)
        .join(', ');

    const valuesSql = orderList
        .map(item => {
            const values = Object.keys(sample)
                .filter(key => sample[key] !== undefined)
                .map(key => {
                    const val = item[key];
                    return sqlValue(val)
                })
                .join(', ');
            return `(${values})`;
        })
        .join(', ');

    const sql = `
      INSERT INTO \`${tableName}\` 
      (${columns})
      VALUES ${valuesSql}
    `.trim();

    try {
        await orderDetailRepository.query(sql);
        return { success: true };
    } catch (err: any) {
        return Promise.reject({ success: false, message: err.message });
    }
}

// 設置訂單細項
export async function updateAssignQuantity(list: any[], userInfo: any, year?: number) {
    if (!list?.length) return { success: true };
  
    const targetYear = year ?? new Date().getFullYear();
    const tableName = `order_detail_${targetYear}`;
  
    const ids = list.map(d => d.id);
  
    // 正確生成 CASE WHEN（每欄都要這樣寫！）
    const orderQtyCases   = list.map(d => `WHEN ${d.id} THEN ${sqlValue(d.orderQuantity)}`).join(' ');
    const assignQtyCases  = list.map(d => `WHEN ${d.id} THEN ${sqlValue(d.assignQuantity)}`).join(' ');
    const statusCases     = list.map(d => `WHEN ${d.id} THEN 1`).join(' ');
    const remarkCases     = list.map(d => `WHEN ${d.id} THEN ${sqlValue(d.remark ?? '-')}`).join(' ');
    const lastEditByValue = sqlValue(userInfo.name || '-');
  
    const sql = `
      UPDATE \`${tableName}\`
      SET
        orderQuantity  = CASE \`id\` ${orderQtyCases} END,
        assignQuantity = CASE \`id\` ${assignQtyCases} END,
        status         = CASE \`id\` ${statusCases} END,
        remark         = CASE \`id\` ${remarkCases} END,
        lastEditBy     = ${lastEditByValue},
        updateDate     = CURRENT_TIMESTAMP
      WHERE id IN (${ids.join(',')})
    `.replace(/\n\s+/g, ' ').trim();
  
    try {
      await orderDetailRepository.query(sql); // 改用 manager.query！
      return { success: true };
    } catch (err: any) {
      return Promise.reject({ success: false, message: err.message });
    }
}
