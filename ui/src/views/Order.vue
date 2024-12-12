<template>
  <div>
    <el-card class="Ktable-container">
      <Ktable ref='KtableRef2' isExpand :isIndex="false" :columns="columns" :operations="operations" :params="params"
        :tableRowClassName="tableRowClassName" :getList="readOrder" :expandChange="expandChange"
        :searchFormColumns="searchFormColumns" :customBtn="customBtn" :expandHeader="{}" :expandColumns="{}"
        :products="products" :expandRowKeys="expandRowKeys"></Ktable>
    </el-card>
    <!-- OrderDetail -->
    <el-dialog v-model="orderDetailShow" width="95%" class="dialog-body" top="5vh">
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
    <el-dialog v-model="historyDetailShow" width="95%" class="dialog-body" top="5vh" destroy-on-close
      @close="resetexpandRowKeys" title="訂單明細">
      <Ktable ref='KtableRef3' :columns="columns" isExpand :isIndex="false" :operations="null" :params="historyParams"
        :expandChange="expandChange" :getList="readHistoryOrder" :searchFormColumns="[]" :customBtn="[]"
        :expandHeader="{}" :expandColumns="{}" :expandRowKeys="expandRowKeys">
      </Ktable>
    </el-dialog>
  </div>
</template>

<script setup>
import orderDetailList from '../components/orderDetailList.vue';
import { readProduct } from '../request/products';
import { readShop } from '../request/shops'
import { readOrder, readHistoryOrder, readOrderDetail } from '../request/orders';
import { departmentDict, orderStateDict } from '../request/dict';
import { exportMeatSummary, exportAllSummary, exportOrderExcel } from '../utils/export';
import Ktable from '../components/table.vue';
import { ref, onMounted, computed } from 'vue';
import { getStorge } from '../utils/auth'
import { ElButton, ElDatePicker } from 'element-plus'
// get userinfo
const userInfo = computed(() => {
  let user = getStorge('userInfo')
  return user ? JSON.parse(user) : {}
})
// readShop
async function fatchShopList() {
  let result = []
  await readShop({ size: 999, page: 1 }).then(res => {
    if (res.success) {
      result = res.data.map(item => {
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
  { props: 'state', label: '訂單狀態', formatter: orderStateFormatter, width: 100 },
  { props: 'shopName', label: '落單門店', width: 180 },
  { props: 'department', label: '落單部門', width: 100, formatter: departmentFormatter },
  { props: 'orderUserName', label: '落單人', width: 130 },
  { props: 'orderIndex', label: '落單次數', formatter: (row, column) => row[column.property] },
  { props: 'createDate', label: '落單時間', width: 180 },
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
          }, type: "date"
        }),
        h(ElButton, { onclick: () => exportAllSummary(defaultExportDate.value), type: 'success', plain: true }, '確定')
      ])
    },
  },
  {
    type: 'popover',
    btnType: 'success',
    label: '導出鮮肉匯總表',
    icon: 'Printer',
    disabled: (row) => row.status === 0, hide: !(userInfo.value.auth === -1 || userInfo.value.auth === 3),
    render: (h) => {
      return h('div', { style: { display: 'flex', gap: '5px' } }, [
        h(ElDatePicker, {
          teleported: false, modelValue: exportDate.value,
          ['onUpdate:modelValue']: (value) => {
            exportDate.value = value
          }, type: "date"
        }),
        h(ElButton, { style: { margin: '0px' }, onclick: () => exportMeatSummary(defaultExportDate.value), type: 'success', plain: true }, '確定')
      ])
    },
  }
])

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
  readOrderDetail({ orderId: row.id }).then(res => {
    if (res.success) {
      currentRow.value = {
        orderCode: row.orderCode,
        id: row.id,
        children: res.data
      }
      orderDetailShow.value = !orderDetailShow.value
    }
  })
}

const KtableRef3 = ref()
let historyDetailShow = ref(false)
async function showHistoryHandle(index, row) {
  historyParams.value = {
    size: 99,
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
    await readOrderDetail({ orderId: row.id }).then(res => {
      if (res.success) {
        row.children = res.data
      }
    })
    expandRowKeys.value = expandRow.map(item => item.id)
  }
}
function resetexpandRowKeys() {
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
  await readOrderDetail({ orderId: currentRow.value.id }).then(res => {
    if (res.success) {
      currentRow.value.children = res.data
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
  readProduct(params).then(res => {
    if (res.success) {
      products.value = res.data
      productsOption = res.data.map(item => {
        return {
          value: item.productCode,
          label: item.productCode
        }
      })
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

.dialog-body {
  height: 85vh;
  position: relative;
}
</style>