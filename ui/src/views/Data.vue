<template>
    <el-card class="Ktable-container">
        <el-tabs tab-position="right" class="demo-tabs full-height">
            <el-tab-pane label="落單" class="full-height">
                <div class="full-height flex-column-start">
                    
                    <el-form :inline="true" :model="params" class="form-inline">
                        <el-form-item label="下單時間">
                            <el-date-picker v-model="params.updateDate" type="daterange" style="width: 250px;"
                                range-separator="至" start-placeholder="開始時間" end-placeholder="結束時間" clearable
                                value-format="YYYY-MM-DD HH:mm:ss" @change="getOrderDatailSummary"
                                :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 2, 1, 23, 59, 59)]" />
                        </el-form-item>
                        <el-form-item label="落單門店">
                            <el-select v-model="params.orderShopId" clearable style="width: 120px;" placeholder="請選擇" @change="getOrderDatailSummary">
                                <el-option v-for="opt in shops" :key="opt.value" :label="opt.label" :value="opt.value" />
                            </el-select>
                        </el-form-item>
                    </el-form>

                    <echart v-if="isShowInChart" :tableData="tableData" ref="echartRef" />
                    <el-table v-else :data="tableData" class="table" header-cell-class-name="table-header">
                        <el-table-column v-for="col in columns" :key="col.props" :prop="col.props" :label="col.label"
                            :width="col.width" :formatter="col.formatter"></el-table-column>
                    </el-table>

                    <div>
                        <el-button type="primary" plain @click="switchShowWay" icon="Switch">切換</el-button>
                        <el-button type="success" plain @click="exportSummary" icon="Printer">導出匯總表</el-button>
                    </div>

                </div>
            </el-tab-pane>
            <el-tab-pane label="盤點" class="full-height">
            </el-tab-pane>
        </el-tabs>
    </el-card>
</template>
<script setup>
import { readOrderDatailSummary } from '../request/orders'
import { readShop } from '../request/shops'
import { ref } from 'vue';
import { getDefaultDateRange } from '../utils/tools';
import { exportOrderDatailSummary } from '../utils/export';
import { ElMessage } from 'element-plus'
import echart from '../components/echart.vue'

const defaultDateRange = ref(getDefaultDateRange(7))

const params = ref({
    size: 20,
    page: 1,
    orderShopId: null,
    updateDate: defaultDateRange.value,
})

const echartRef = ref(null)
const isShowInChart = ref(false)

let columns = [
    { props: 'productCode', label: '產品號碼', width: 100 },
    { props: 'productName', label: '產品名稱', width: 250 },
    { props: 'orderQuantity', label: '下單數量', width: 120, formatter: (row, column) => row[column.property] + row.unit },
    { props: 'assignQuantity', label: '分配數量', width: 120, formatter: (row, column) => row[column.property] + row.unit },
    { props: 'standard', label: '規格' }
]

// getOrderDatailSummary
const tableData = ref([])
const shops = ref([])
async function getOrderDatailSummary() {
    await readOrderDatailSummary(params.value).then(res => {
        if (res.success) {
            tableData.value = res.data
            setTimeout(() => echartRef.value.resize(), 0)
        }
    })
}

function getShop() {
    readShop({ size: 999, page: 1 }).then(res => {
        if (res.success) {
            shops.value = res.data.map(item => {
                return { label: item.shopName, value: item.shopId }
            })

        }
    })
}
getOrderDatailSummary()
getShop()

function exportSummary() {
    const { updateDate, orderShopId}= params.value
    const shop = shops.value.find(item => item.value === orderShopId)
    if (!orderShopId) {
        ElMessage({ type: 'warning', message: '請先選擇店舖' })
        return
    }
    exportOrderDatailSummary({
        updateDate,
        orderShopId,
        shopName: shop ? shop.label : '',
        size: 999,
        page: 1
    })
}

function switchShowWay() {
    isShowInChart.value = !isShowInChart.value
}

</script>
<style>
.full-height {
    height: 100%;
}

.el-tabs__content {
    height: 100%;
}

.echart-layout {
    height: calc(100%-50px);
}
</style>
