<template>
  <el-date-picker class="date-picker" v-model="params.updateDate" type="daterange" style="width: 250px;"
    range-separator="至" start-placeholder="開始時間" end-placeholder="結束時間" clearable value-format="YYYY-MM-DD HH:mm:ss"
    :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 2, 1, 23, 59, 59)]" @change="fatchOrder" />
  <div class="app-order">
    <el-scrollbar class="order-card-container">
      <el-card :class="['order-card', cardColor(item.isToday)]" v-for="(item, index) of data" :key="index">
        <div class="order-card-header">
          <h3>{{ item.shopName }}</h3>
          <div>
            <div :style="orderStateFormatter(item.state)">{{ orderStateDict[item.state] }}</div>
            <div>共{{ item.orderIndex }}次落單</div>
          </div>
        </div>
        <div class="gary-color">落單員工 : {{ item.orderUserName }}</div>
        <div class="gary-color">落單時間 : {{ item.createDate }}</div>
        <el-button class='detail-btn' icon="View" type="primary" plain @click="toOrderDetail(item.orderCode)">詳情</el-button>
        <el-button class='detail-btn' icon="Printer" type="success" plain @click="exportOrderExcel(index, item)">導出</el-button>
      </el-card>
    </el-scrollbar>
    <div class="export-float-bar">
      <el-date-picker v-model="exportDate" value-format="YYYY-MM-DD" style="width: 130px;padding-right: 12px;"/>
      <el-button class='detail-btn' type="success" plain @click="exportAllSummary(exportDate)">導出匯總表</el-button>
      <el-button class='detail-btn' type="success" plain @click="exportMeatSummary(exportDate)">導出鮮肉匯總表</el-button>
    </div>
  </div>
</template>
<script setup>
import { readOrder } from '../request/orders';
import { orderStateDict } from '../request/dict';
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { exportMeatSummary, exportAllSummary, exportOrderExcel } from '../utils/export';
const router = useRouter()

const defaultDateRange = computed(() => {
  let date = new Date()
  let endDate = date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0') + ' 23:59:59'
  date.setDate(date.getDate() - 1)
  let startDate = date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0') + ' 00:00:00'
  return [startDate, endDate]
})

const exportDate = ref()
const defaultExportDate = () => {
  let date = new Date()
  date.setDate(date.getDate() - 1)
  return date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0')
}
exportDate.value = defaultExportDate()


const params = ref({
  size: 20,
  page: 1,
  updateDate: defaultDateRange.value
})

const data = ref([])

// readOrder
async function fatchOrder() {
  await readOrder(params.value).then(res => {
    if (res.success) {
      data.value = res.data
    }
  })
}

const orderStateFormatter = (state) => {
  let color = state === 0 ? 'var(--el-color-danger)' : 'var(--el-color-success)'
  return { color: color }
}

// 表格顏色
function cardColor(isToday) {
  if (isToday === 1) {
    return 'warning-card'
  }
}

function toOrderDetail(orderCode) {
  router.push({ path: `/appOrderDetail/${orderCode}` })
}

onMounted(() => {
  fatchOrder()
})
</script>
<style>
.date-picker {
  margin-left: 10px;
}

.app-order {
  padding: 10px;
  height: 90%;
}

.order-card {
  margin-bottom: 10px;
  border-radius: 10px;
}

.el-card__body {
  --el-card-padding: 15px;
}

.order-card-header {
  display: flex;
  justify-content: space-between;
  padding-bottom: 20px;
}

.detail-btn {
  margin: 10px 0;
}

.gary-color {
  font-size: small;
  color: var(--el-text-color-placeholder);
}

.warning-card {
  background-color: var(--el-color-warning-light-9);
}
.export-float-bar{
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 5px 10px;
  background-color: var(--background-color);
  position: fixed;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
</style>