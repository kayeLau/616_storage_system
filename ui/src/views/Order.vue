<template>
  <div>
    <el-card class="Ktable-container">
      <Ktable ref='KtableRef2' isExpand :columns="columns" :operations="operations" :params="params"
        :tableRowClassName="tableRowClassName" :getList="getOrderList" :expandChange="expandChange"
        :searchFormColumns="searchFormColumns" :customBtn="customBtn" :expandHeader="{}" :expandColumns="{}"
        :products="products" :expandRowKeys="expandRowKeys"></Ktable>
    </el-card>
    <!-- OrderDetail -->
    <el-dialog v-model="orderDetailShow" width="95%" style="height:80vh;position: relative;" top="10vh">
      <template #header="{ titleId, titleClass }">
        <div class="my-header">
          <span :id="titleId" :class="titleClass">訂單明細 | {{ currentRow.shopName }}</span>
          <el-icon class="refresh" :class="loading ? 'is-loading' : ''">
            <Refresh v-show="!loading" @click="refreshList" />
            <Loading v-show="loading" />
          </el-icon>
        </div>
      </template>
      <orderDetailList :data="currentRow" :params="ODparams" @refreshList="refreshList" :products="products" />
    </el-dialog>
    <!-- History -->
    <el-dialog v-model="historyDetailShow" width="95%" style="height:80vh;position: relative;" top="10vh"
      destroy-on-close @close="resetexpandRowKeys">
      <Ktable ref='KtableRef3' :columns="columns" isExpand :operations="null" :params="historyParams" :expandChange="expandChange"
        :getList="postHistoryOrder" :searchFormColumns="[]" :customBtn="[]" :expandHeader="{}" :expandColumns="{}" :expandRowKeys="expandRowKeys">
      </Ktable>
    </el-dialog>
  </div>
</template>

<script setup>
import orderDetailList from '../components/orderDetailList.vue';
import { getProductList } from '../request/products';
import { getShopList } from '../request/shops'
import { getOrderList, getDailyOrderStatus, postExportDailyMeetSummary, postHistoryOrder, getOrderDetail } from '../request/orders';
import { departmentDict, orderStateDict, freezersNumDict } from '../request/dict';
import { exportExcel } from '../utils/export';
import Ktable from '../components/table.vue';
import { ref, onMounted, computed } from 'vue';
import { getStorge } from '../utils/auth'
import { ElButton, ElDatePicker } from 'element-plus'
// get userinfo
const userInfo = computed(() => {
  let user = getStorge('userInfo')
  return user ? JSON.parse(user) : {}
})
// getshopList
async function fatchShopList() {
  let result = []
  await getShopList({ size: 999, page: 1 }).then(res => {
    if (res.success) {
      result = res.resource.map(item => {
        return { label: item.shopName, value: item.shopId }
      })
    }
  })
  searchFormColumns.value[1].options = result
}
//#region order tabel
const KtableRef2 = ref()
const departmentFormatter = (row, column) => {
  let cell = row[column.property]
  return departmentDict[cell]
}
const orderStateFormatter = (row, column) => {
  let cell = row[column.property]
  let color = cell === 0 ? 'var(--el-color-danger)' : 'var(--el-color-success)'
  return `<span style='color:${color}'>${orderStateDict[cell]}<span>`
}

// 表格顏色
function tableRowClassName({ row }) {
  if (row.isToday === 1) {
    return 'warning-row'
  }
}

const columns = [
  { props: 'state', label: '訂單狀態', formatter: orderStateFormatter, width: 130 },
  { props: 'shopName', label: '落單門店' },
  { props: 'department', label: '落單部門', width: 130, formatter: departmentFormatter },
  { props: 'orderUserName', label: '落單人', width: 180 },
  { props: 'orderIndex', label: '落單次數', width: 130, formatter: (row, column) => row[column.property] + 1 },
  { props: 'createDate', label: '落單時間', width: 180 },
  // { props: 'updateDate', label: '最後更新時間', width: 180 }
]

const operations = {
  width: 360,
  size: "small",
  children: [
    { type: "primary", name: '編輯', onClick: showDetailHandle, icon: 'Edit' },
    { type: "success", name: '導出', onClick: exportOrderExcel, icon: 'Printer', hide: userInfo.value.auth !== -1 },
    { type: "warning", name: '歷史訂單', onClick: showHistoryHandle, icon: 'DocumentCopy' }
  ]
}

const defaultExportDate = computed(() => {
  let date = new Date(Date.parse(exportDate.value))
  date.setDate(date.getDate() - 1)
  return date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0')
})
const exportDate = ref(new Date())

const customBtn = ref([
  {
    type: 'popover',
    btnType: 'success',
    label: '導出匯總表',
    icon: 'Printer',
    disabled: (row) => row.status === 0, hide: !(userInfo.value.auth === -1 || userInfo.value.auth === 3),
    render: (h) => {
      return h('div', { style: { display: 'flex', gap: '5px' } }, [
        h(ElDatePicker, {
          teleported: false, modelValue: exportDate.value,
          ['onUpdate:modelValue']: (value) => {
            exportDate.value = value
            fetchDailyOrderStatus()
          }, type: "date"
        }),
        h(ElButton, { onclick: exportDailyAllSummary, type: 'success', plain: true }, '確定')
      ])
    },
  },
  {
    type: 'popover',
    btnType: 'success',
    label: '導出肉類匯總表',
    icon: 'Printer',
    disabled: (row) => row.status === 0, hide: !(userInfo.value.auth === -1 || userInfo.value.auth === 3),
    render: (h) => {
      return h('div', { style: { display: 'flex', gap: '5px' } }, [
        h(ElDatePicker, {
          teleported: false, modelValue: exportDate.value,
          ['onUpdate:modelValue']: (value) => {
            exportDate.value = value
            fetchDailyOrderStatus()
          }, type: "date"
        }),
        h(ElButton, { style: { margin: '0px' }, onclick: exportDailyMeetSummary, type: 'success', plain: true }, '確定')
      ])
    },
  },
  {
    type: 'progress',
    width: '250px',
    percentage: 0,
    disabled: (row) => row.status === 0, hide: userInfo.value.auth !== -1,
    label: '已下單門店'
  }
])

function exportDailyMeetSummary() {
  postExportDailyMeetSummary({ exportDate: defaultExportDate.value, exportType: 1 }).then(res => {
    if (res.success) {
      const date = new Date()
      const today = String(date.getDate()).padStart(2, '0') + String(date.getMonth() + 1).padStart(2, '0') + date.getFullYear()
      let shopName = res.resource.shopName
      let products = res.resource.products
      let jsonData = products.map((product) => {
        let summary = product.orderItems.reduce((prev, acc) => prev + acc) + product.unit
        let row = shopName.map((item, columnIndex) => {
          let order = product.orderItems[columnIndex]
          return order + product.unit
        })
        return [product.productName, ...row, product.productName, summary]
      })
      jsonData.unshift(['產品名稱', ...shopName, '產品名稱', '出貨總數'])

      const dailyMeetSummary = {
        sheetNames: today + '工埸鮮肉匯總表',
        jsonData
      }
      exportExcel({ exportDate: [dailyMeetSummary], usezip: false, zipFileName: '', hpt: 40, wpt: 3, header: '1' })
    }
  })
}

function exportDailyAllSummary() {
  postExportDailyMeetSummary({ exportDate: defaultExportDate.value, exportType: 0 }).then(res => {
    if (res.success) {
      const date = new Date()
      const today = String(date.getDate()).padStart(2, '0') + String(date.getMonth() + 1).padStart(2, '0') + date.getFullYear()
      let products = res.resource.products
      if (userInfo.value.auth === 3) {
        products = products.filter(item => item.freezersNum === 1 || item.freezersNum === 3 || item.freezersNum === 4)
      }
      let jsonData = []
      let rowIndex = 0
      let jindex = 0
      // 產品
      products.map((product) => {
        let summary = product.orderItems.reduce((prev, acc) => prev + acc)
        if (summary > 0) {
          let freezersNum = freezersNumDict[product.freezersNum]
          if (rowIndex % 2 === 1) {
            jsonData[jindex] = [...jsonData[jindex], ' ', product.productName, freezersNum, summary, product.unit]
            jindex++
          } else {
            jsonData[jindex] = [product.productName, freezersNum, summary, product.unit]
          }
          rowIndex++
        }
      })
      const header = rowIndex > 0 ? ['產品名稱', '雪房編號', '出貨數量', '單位', ' ', '產品名稱', '雪房編號', '出貨數量', '單位'] : ['產品名稱', '雪房編號', '出貨數量', '單位']
      jsonData.unshift(header)

      const dailyMeetSummary = {
        sheetNames: today + '出貨匯總表',
        jsonData
      }
      exportExcel({ exportDate: [dailyMeetSummary], header: '1', hpt: 30, wpt: 2.5 })
    }
  })
}

function fetchDailyOrderStatus() {
  getDailyOrderStatus({ exportDate: defaultExportDate.value }).then(res => {
    if (res.success) {
      let total = searchFormColumns.value[1].options.length
      let current = res.total
      customBtn.value[2].percentage = (current / total) * 100
    }
  })
}

async function exportOrderExcel(index, row) {
  const date = new Date()
  const today = String(date.getDate()).padStart(2, '0') + String(date.getMonth() + 1).padStart(2, '0') + date.getFullYear()
  const todayF = String(date.getDate()).padStart(2, '0') + '/' + String(date.getMonth() + 1).padStart(2, '0') + '/' + date.getFullYear()
  let children = []
  await getOrderDetail({ orderId: row.id }).then(res => {
    if (res.success) {
      children = res.resource
    }
  })
  const shipping = {
    sheetNames: today + row.shopName + '出貨表',
    jsonData: [
      [row.shopCode, row.shopName, '', todayF],
      ['貨品編號', '貨品名稱', '數量/重量', '單位', '包裝規格'],
      // assuming `row.children` is an array of objects
      ...children.map(item => [
        item.productCode,
        item.productName,
        item.assignQuantity,
        item.unit,
        item.standard,
      ])
    ]
  };

  const delivery = {
    sheetNames: today + row.shopName + '送貨單',
    jsonData: [
      [row.shopName, row.orderUserName[0], '', '', '', row.updateDate],
      ['貨品名稱', '分配數量', '單位', '下單數量', '包裝規格', '備注'],
      ...children.map(item => [
        item.productName,
        item.assignQuantity,
        item.unit,
        item.orderQuantity,
        item.standard,
        item.remark
      ])
    ]
  }
  exportExcel({ exportDate: [shipping, delivery], usezip: true, zipFileName: String(today + row.shopName), header: '2', wpt: 3 })
}
const defaultDateRange = computed(() => {
  let date = new Date()
  let endDate = date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0') + ' 23:59:59'
  date.setDate(date.getDate() - 1)
  let startDate = date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0') + ' 00:00:00'
  return [startDate, endDate]
})

const params = {
  size: 20,
  page: 1,
  updateDate: defaultDateRange.value
}

const searchFormColumns = ref([
  {
    type: 'datePicker',
    prop: 'updateDate',
    label: '下單時間:',
  },
  {
    type: 'select',
    prop: 'orderShopId',
    label: '落單門店:',
    options: [],
    hide: userInfo.value.auth !== -1
  }
])
//#endregion

//#region order detail tabel
let currentRow = ref([])

const ODparams = {
  size: 20,
  page: 1,
}

let orderDetailShow = ref(false)
function showDetailHandle(index, row) {
  getOrderDetail({ orderId: row.id }).then(res => {
    if (res.success) {
      currentRow.value = {
        orderCode: row.orderCode,
        id: row.id,
        children: res.resource
      }
      orderDetailShow.value = !orderDetailShow.value
    }
  })
}

const KtableRef3 = ref()
let historyDetailShow = ref(false)
async function showHistoryHandle(index, row) {
  historyParams.value = {
    size: 20,
    page: 1,
    orderCode: row.orderCode
  }
  resetexpandRowKeys()
  historyDetailShow.value = !historyDetailShow.value
}
let historyParams = ref({})

// 展開
let expandRowKeys = ref([])
async function expandChange(row, expandRow) {
  if (expandRow.length) {
    await getOrderDetail({ orderId: row.id }).then(res => {
      if (res.success) {
        row.children = res.resource
      }
    })
    expandRowKeys.value = expandRow.map(item => item.id)
  }
}
function resetexpandRowKeys(){
  expandRowKeys.value = []
}

//#endregion

//#region jsonForm
const editFormModel = ref({})
const editFormColumns = ref([
  {
    type: 'select',
    prop: 'productCode',
    label: '產品編號:',
    options: [],
    disabled: true,
    change: productChange
  },
  {
    type: 'input',
    prop: 'productName',
    label: '產品名稱:',
    disabled: true
  },
  {
    type: 'input',
    prop: 'orderQuantity',
    label: '下單數量:',
    disabled: true
  },
  {
    type: 'input',
    prop: 'assignQuantity',
    label: '分配數量:',
  },
  {
    type: 'input',
    prop: 'remark',
    label: '備注:',
  },
])

function productChange(productCode) {
  let product = products.value.find(item => item.productCode === productCode)
  editFormModel.value.productName = product.productName
}

let loading = ref(false)
async function refreshList() {
  loading.value = true
  await KtableRef2.value.fatchList()
  await getOrderDetail({ orderId: currentRow.value.id }).then(res => {
    if (res.success) {
      currentRow.value.children = res.resource
    }
  })
  loading.value = false
}

// 獲取產品列表
let products = ref([]) // 產品列表
let productsOption = ref([])
function getProducts() {
  const params = {
    size: 999,
    page: 1
  }
  getProductList(params).then(res => {
    if (res.success) {
      products.value = res.resource
      productsOption = res.resource.map(item => {
        return {
          value: item.productCode,
          label: item.productCode
        }
      })
      // console.log(productsOption)
      editFormColumns.value[0].options = productsOption
    } else {
      products.value = []
    }
  })
}
//#endregion
onMounted(() => {
  getProducts()
  fatchShopList()
  fetchDailyOrderStatus()
})

</script>

<style>
.input-short {
  padding-right: 2px;
  width: 75%;
}

.my-header {
  display: flex;
  gap: 10px;
  align-items: center;
}

.refresh {
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
  color: var(--el-color-primary);
}
</style>