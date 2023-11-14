<template>
  <div>
    <el-card class="Ktable-container">
      <Ktable isExpand :columns="columns" :operations="operations" :params="params" :getList="getOrderList"
        :searchFormColumns="searchFormColumns" :customBtn="[]" :expandHeader="expandHeader" :expandColumns="expandColumns"
        :products="products"></Ktable>
    </el-card>
    <el-dialog v-model="orderDetailShow" title="訂單明細" width="90%" style="height:80vh;position: relative;" top="10vh">
      <Ktable :columns="ODcolumns" :operations="ODoperations" :params="params" :getList="getOrderListDetail"
        :searchFormColumns="[]" :customBtn="ODcustomBtn" isSelection :isIndex="false"></Ktable>
      <el-drawer v-model="jsonFormShow" title="店舖資料" direction="rtl">
        <jsonForm :formModel="editFormModel" :formColumns="editFormColumns" :comfireCallBack="JsonFormComfireCallBack"
          @sumbitSuccess="refreshList"></jsonForm>
      </el-drawer>
    </el-dialog>
  </div>
</template>
<script setup>
// import { createAdditionOrderItem } from '../request/orders';
// import { ElMessage  } from 'element-plus'
import jsonForm from '../components/jsonForm.vue';
import { getProductList } from '../request/products';
import { getOrderList } from '../request/orders';
import { departmentDict, orderStateDict, orderMode } from '../request/dict';
import Ktable from '../components/table.vue';
import { ref, onMounted } from 'vue';

// order tabel
const departmentFormatter = (row, column) => {
  let cell = row[column.property]
  return departmentDict[cell]
}
const orderStateFormatter = (row, column) => {
  let cell = row[column.property]
  let color = cell === 0 ? 'var(--el-color-danger)' : 'var(--el-color-success)'
  return `<span style='color:${color}'>${ orderStateDict[cell] }<span>`
}
const columns = [
  { props: 'status', label: '訂單狀態', formatter: orderStateFormatter },
  { props: 'orderShopName', label: '落單門店' },
  { props: 'department', label: '落單部門', formatter: departmentFormatter },
  { props: 'orderUserName', label: '落單人' },
  { props: 'updateDate', label: '落單時間', width: 250 }
]
const operations = {
  width: 120,
  size: "small",
  children: [
    { type: "primary", name: '編輯訂單', onClick: showDetailHandle, icon: 'Edit' },
  ]
}
const params = {
  size: 20,
  page: 1,
}
const searchFormColumns = [
  {
    type: 'datePicker',
    prop: 'updateDate',
    label: '下單時間:',
  }
]

// order detail tabel
let currentRow = ref({})
const orderModeFormatter = (row, column) => {
  let cell = row[column.property]
  return orderMode[cell]
}
const ODcolumns = [
  { props: 'productCode', label: '產品編號' },
  { props: 'productName', label: '產品名稱' },
  { props: 'orderQuantity', label: '下單數量', formatter: (row, column) => row[column.property] + row.unit },
  { props: 'assignQuantity', label: '分配數量', formatter: (row, column) => row[column.property] + row.unit },
  { props: 'orderMode', label: '下單模式', formatter: orderModeFormatter },
  { props: 'updateDate', label: '修改時間' },
]
const ODoperations = {
  width: 120,
  size: "small",
  children: [
    { type: "primary", name: '分配', onClick: editHandle, icon: 'Coin', show: (row) => row.type !== 'additem' },
  ]
}
const ODcustomBtn = [
  {
    type: 'success',
    label: '新增',
    icon: 'CirclePlus',
    onClick: addOrderItem
  },
  {
    type: 'primary',
    label: '按下單數量分配',
    icon: 'Coin',
    onClick: addOrderItem
  }
]

async function getOrderListDetail() {
  return {
    resource: currentRow.value.children,
    total: currentRow.value.children.length,
    success: true
  }
}

let orderDetailShow = ref(false)
function showDetailHandle(index, row) {
  currentRow.value = row
  orderDetailShow.value = !orderDetailShow.value
}

// jsonForm
const jsonFormShow = ref(false)
const editFormModel = ref({})
const editFormColumns = ref([
  {
    type: 'select',
    prop: 'productCode',
    label: '產品編號:',
    options: [],
    disabled:true
  },
  {
    type: 'input',
    prop: 'productName',
    label: '產品名稱:',
    disabled:true
  },
  {
    type: 'input',
    prop: 'orderQuantity',
    label: '下單數量:',
  },
  {
    type: 'input',
    prop: 'assignQuantity',
    label: '分配數量:',
  },
  {
    type: 'input',
    prop: 'orderMode',
    label: '分配數量:',
    disabled:true
  },
])

function editHandle(index, row){
  editFormColumns.value[2].unit = row.unit
  editFormColumns.value[3].unit = row.unit
  editFormModel.value = row
  jsonFormShow.value = !jsonFormShow.value
}

function addOrderItem() {
  let newItem = { type: 'additem', productCode: "", productName: "", orderQuantity: '', assignQuantity: '', unit: "", updateDate: '', orderMode: 1 }
  currentRow.value.children.unshift(newItem)
}

// function setOrderItem(index) {
//   let productCode = currentRow.value.children[index].productCode
//   let product = products.value.find(item => item.productCode === productCode)
//   currentRow.value.children[index].productName = product.productName
//   currentRow.value.children[index].unit = product.unit
// }

// function submitAdditionOrderItem(){
//     let orderList = newOrderItems.value.filter(item => item.productCode)
//     if(!orderList.length){
//         ElMessage ({ type: 'warning', message: '新增項目為空' })
//         return
//     }
//     let data = {
//         orderList
//     }
//     createAdditionOrderItem(data).then(res => {
//         if(res.success){
//             emit("refresh")
//             ElMessage ({ type: 'success', message: '提交成功' })
//         }else{
//             ElMessage ({ type: 'error', message: '提交失敗' })
//         }
//     })
// }



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
      console.log(productsOption)
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
</style>