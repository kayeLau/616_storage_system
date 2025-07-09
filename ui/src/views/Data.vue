<template>
    <el-card class="Ktable-container">
        <Ktable ref='KtableRef' :columns="columns" :params="params" :getList="getOrderDatailSummary"
            :searchFormColumns="searchFormColumns" :customBtn="customBtn"></Ktable>
    </el-card>
</template>
<script setup>
import Ktable from '../components/table.vue'
import { readOrderDatailSummary } from '../request/orders'
import { readShop } from '../request/shops'
import { ref } from 'vue';
import { getDefaultDateRange } from '../utils/tools';
import { exportOrderDatailSummary } from '../utils/export';
import { ElMessage } from 'element-plus'

const defaultDateRange = ref(getDefaultDateRange(7))

const params = {
    size: 20,
    page: 1,
    updateDate: defaultDateRange.value,
}

let columns = [
    { props: 'productCode', label: '產品號碼', width: 100 },
    { props: 'productName', label: '產品名稱', width: 250 },
    { props: 'orderQuantity', label: '下單數量', width: 120, formatter: (row, column) => row[column.property] + row.unit },
    { props: 'assignQuantity', label: '分配數量', width: 120, formatter: (row, column) => row[column.property] + row.unit },
    { props: 'standard', label: '規格' }
]

// getOrderDatailSummary
async function getOrderDatailSummary(params) {
    if (!params.orderShopId) {
        return {
            success: true,
            data: []
        }
    }
    const res = await readOrderDatailSummary(params);
    return { ...res }
}

let shops = []
const searchFormColumns = [
    {
        type: 'datePicker',
        prop: 'updateDate',
        label: '下單時間:',
    },
    {
        type: 'select',
        prop: 'orderShopId',
        label: '落單門店:',
        options: readShop({ size: 999, page: 1 }).then(res => {
            if (res.success) {
                shops = res.data.map(item => {
                    return { label: item.shopName, value: item.shopId }
                })
                return shops
            }
        }),
    }
]

const customBtn = [
    {
        label: '導出匯總表',
        icon: 'Printer',
        type: 'button',
        btnType: 'success',
        onClick: () => {
            const updateDate = params.updateDate
            const orderShopId = params.orderShopId
            const shop = shops.find(item => item.value === orderShopId)
            if (!orderShopId) {
                ElMessage({ type: 'warning', message: '請先選擇店舖' })
                return
            }
            exportOrderDatailSummary({
                updateDate,
                orderShopId,
                shopName: shop ? shop.label : '',
                size:999,
                page:1
            })
        }
    }
]

</script>
