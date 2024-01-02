<template>
  <div>
    <el-card class="Ktable-container">
      <Ktable ref='KtableRef2' isExpand :columns="columns" :operations="operations" :params="params"
        :getList="getOrderList" :searchFormColumns="searchFormColumns" :customBtn="[]" :expandHeader="{}"
        :expandColumns="{}" :products="products"></Ktable>
    </el-card>
    <el-dialog v-model="orderDetailShow" title="訂單明細" width="90%" style="height:80vh;position: relative;" top="10vh">
      <template #header="{ titleId, titleClass }">
      <div class="my-header">
        <span :id="titleId" :class="titleClass">訂單明細</span>
        <el-icon class="refresh" :class="loading ? 'is-loading' : ''">
          <Refresh v-show="!loading" @click="refreshList"/>
          <Loading v-show="loading"/>
        </el-icon>
      </div>
    </template>
      <orderDetailList :data="currentRow" :params="ODparams" @refreshList="refreshList" :products="products"></orderDetailList>
    </el-dialog>
  </div>
</template>
<script setup>
import orderDetailList from '../components/orderDetailList.vue';
import { getProductList } from '../request/products';
import { getShopList } from '../request/shops'
import { getOrderList } from '../request/orders';
import { departmentDict, orderStateDict } from '../request/dict';
import { exportExcel } from '../utils/export';
import Ktable from '../components/table.vue';
import { ref, onMounted , computed } from 'vue';
import { getStorge } from '../utils/auth'

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
// order tabel
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
const columns = [
  { props: 'status', label: '訂單狀態', formatter: orderStateFormatter },
  { props: 'shopName', label: '落單門店', width: 250 },
  { props: 'department', label: '落單部門', formatter: departmentFormatter },
  { props: 'orderUserName', label: '落單人' , width: 220 , formatter: (row, column) => row[column.property].join(',')},
  { props: 'updateDate', label: '落單時間', width: 200 }
]
const operations = {
  width: 240,
  size: "small",
  children: [
    { type: "primary", name: '編輯', onClick: showDetailHandle, icon: 'Edit' , hide:userInfo.value.auth !== -1},
    { type: "success", name: '導出', onClick: exportOrderExcel, icon: 'Edit' , disabled:(row)=>row.status === 0 , hide:userInfo.value.auth !== -1}
  ]
}
const params = {
  size: 20,
  page: 1,
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
    hide:userInfo.value.auth !== -1
  }
])
fatchShopList()

function exportOrderExcel(index, row) {
  const today = new Date().toLocaleDateString()
  const shipping = [
    [row.shopCode,row.shopName,today],
    ['貨品編號', '貨品名稱', '數量/重量', '單位','包裝規格'],
    // assuming `row.children` is an array of objects
    ...row.children.map(item => [
      item.productCode,
      item.productName,
      item.assignQuantity,
      item.unit,
      item.standard,
    ])
  ];
  const delivery = [
  ['落單門店:'+row.shopName,'落單人:'+row.orderUserName,'','落單時間:'+row.updateDate],
    ['貨品名稱', '數量/重量', '單位','備注'],
    // assuming `row.children` is an array of objects
    ...row.children.map(item => [
      item.productName,
      item.assignQuantity,
      item.unit,
      item.remark
    ])
  ]
  exportExcel(today + row.shopName + '出貨表', shipping)
  exportExcel(today + row.shopName + '送貨單', delivery)
}

// order detail tabel
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
    row.children.forEach(item => item.disabled = true)
    currentRow.value = row
  }
}

// jsonForm
const editFormModel = ref({})
const editFormColumns = ref([
  {
    type: 'select',
    prop: 'productCode',
    label: '產品編號:',
    options: [],
    disabled: true,
    change:productChange
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

function productChange(productCode){
  let product = products.value.find(item => item.productCode === productCode)
  editFormModel.value.productName = product.productName
}

let loading = ref(false)
async function refreshList(){
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

onMounted(() => {
  getProducts()
})

</script>
<style>
.input-short {
  padding-right: 2px;
  width: 75%;
}
.my-header{
  display: flex;
  gap: 10px;
  align-items: center;
}
.refresh{
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
  color: var(--el-color-primary);
}
</style>