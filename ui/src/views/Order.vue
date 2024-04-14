<template>
  <div>
    <el-card class="Ktable-container">
      <Ktable ref='KtableRef2' isExpand :columns="columns" :operations="operations" :params="params"
        :tableRowClassName="tableRowClassName" :getList="getOrderList" :searchFormColumns="searchFormColumns"
        :customBtn="customBtn" :expandHeader="{}" :expandColumns="{}" :products="products"></Ktable>
    </el-card>

    <el-dialog v-model="orderDetailShow" width="95%" style="height:85vh;position: relative;" top="10vh">
      <template #header="{ titleId, titleClass }">
        <div class="my-header">
          <span :id="titleId" :class="titleClass">訂單明細 | {{ currentRow.shopName }}</span>
          <el-icon class="refresh" :class="loading ? 'is-loading' : ''">
            <Refresh v-show="!loading" @click="refreshList" />
            <Loading v-show="loading" />
          </el-icon>
        </div>
      </template>
      <orderDetailList :data="currentRow" :params="ODparams" @refreshList="refreshList" :products="products">
      </orderDetailList>
    </el-dialog>

  </div>
</template>

<script setup>
import orderDetailList from '../components/orderDetailList.vue';
import { getProductList } from '../request/products';
import { getShopList } from '../request/shops'
import { getOrderList, getDailyOrderStatus, postExportDailyMeetSummary } from '../request/orders';
import { departmentDict, orderStateDict , freezersNumDict } from '../request/dict';
import { exportExcel } from '../utils/export';
import Ktable from '../components/table.vue';
import { ref, onMounted, computed } from 'vue';
import { getStorge } from '../utils/auth'
import { ElButton, ElDatePicker } from 'element-plus'

const userInfo = computed(() => {
  let user = getStorge('userInfo')
  return user ? JSON.parse(user) : {}
})

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
  let cell = row[column.property].map(item => departmentDict[item]).join(',')
  return cell
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
  { props: 'status', label: '訂單狀態', formatter: orderStateFormatter },
  { props: 'shopName', label: '落單門店', width: 250 },
  { props: 'department', label: '落單部門', formatter: departmentFormatter },
  { props: 'orderUserName', label: '落單人', width: 220, formatter: (row, column) => row[column.property].join(',') },
  { props: 'updateDate', label: '落單時間', width: 200 }
]

const operations = {
  width: 240,
  size: "small",
  children: [
    { type: "primary", name: '編輯', onClick: showDetailHandle, icon: 'Edit' },
    {
      type: "success", name: '導出', onClick: exportOrderExcel, icon: 'Printer',
      disabled: (row) => row.status === 0, hide: userInfo.value.auth !== -1
    }
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
      exportExcel({ exportDate: [dailyMeetSummary], usezip: false, zipFileName: '', hpt: 40 , wpt:3 , header:'1'})
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
        products = products.filter(item => item.freezersNum === 1 || item.freezersNum === 3)
      }
      let jsonData = []
      const splitNum = Math.floor(products.length / 2)
      let rowIndex = 0
      // 產品
      products.map((product) => {
        let summary = product.orderItems.reduce((prev, acc) => prev + acc)
        if(summary > 0){
          let freezersNum = freezersNumDict[product.freezersNum]
          let jIndex = rowIndex > splitNum ? rowIndex - splitNum - 1 : rowIndex
          if (rowIndex > splitNum) {
            jsonData[jIndex] = [...jsonData[jIndex], ' ' , product.productName, freezersNum, summary, product.unit]
          } else {
            jsonData[jIndex] = [product.productName, freezersNum, summary, product.unit]
          }
          rowIndex++
        }
      })
      const header = rowIndex > splitNum ? ['產品名稱', '雪房編號', '出貨數量', '單位', ' ', '產品名稱', '雪房編號', '出貨數量', '單位'] : ['產品名稱', '雪房編號', '出貨數量', '單位']
      jsonData.unshift(header)

      const dailyMeetSummary = {
        sheetNames: today + '出貨匯總表',
        jsonData
      }
      exportExcel({ exportDate: [dailyMeetSummary] , header:'1' , hpt:30 , wpt:2.5})
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

function exportOrderExcel(index, row) {
  const date = new Date()
  const today = String(date.getDate()).padStart(2, '0') + String(date.getMonth() + 1).padStart(2, '0') + date.getFullYear()
  const todayF = String(date.getDate()).padStart(2, '0') + '/' + String(date.getMonth() + 1).padStart(2, '0') + '/' + date.getFullYear()
  const shipping = {
    sheetNames: today + row.shopName + '出貨表',
    jsonData: [
      [row.shopCode, row.shopName, '', todayF],
      ['貨品編號', '貨品名稱', '數量/重量', '單位', '包裝規格'],
      // assuming `row.children` is an array of objects
      ...row.children.map(item => [
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
      [row.shopName , row.orderUserName[0] , row.updateDate],
      ['貨品名稱', '數量/重量', '單位', '備注'],
      // assuming `row.children` is an array of objects
      ...row.children.map(item => [
        item.productName,
        item.assignQuantity,
        item.unit,
        item.remark
      ])
    ]
  }
  exportExcel({ exportDate: [shipping, delivery], usezip: true, zipFileName: String(today + row.shopName) , header:'2' , wpt:3})
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
let currentRow = ref({})

const ODparams = {
  size: 20,
  page: 1,
}

let orderDetailShow = ref(false)
let rowIndex = ref(null)
function showDetailHandle(index, row) {
  rowIndex.value = index
  orderDetailShow.value = !orderDetailShow.value
  if (orderDetailShow.value) {
    currentRow.value = row
  }
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
  let result = await KtableRef2.value.fatchList()
  let target = result.resource.find(item => item.orderCode === currentRow.value.orderCode)
  target.children.forEach(item => item.disabled = true)
  currentRow.value = target
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