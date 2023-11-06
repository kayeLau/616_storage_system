<template>
  <div>
    <el-card class="Ktable-container">
      <Ktable ref='KtableRef' :columns="columns" :operations="operations" :params="params" :getList="getShopList"
        :searchFormColumns="searchFormColumns" :customBtn="customBtn"></Ktable>
    </el-card>
    <bandList :dialogVisible="bandListDialogVisible" @closeDialog="manageBandProduct" :shopId="shopId"></bandList>
    <el-drawer v-model="jsonFormShow" title="店舖資料" direction="rtl">
      <jsonForm :formModel="editFormModel" :formColumns="editFormColumns" :comfireCallBack="JsonFormComfireCallBack" @sumbitSuccess="refreshList"></jsonForm>
    </el-drawer>
  </div>
</template>
<script setup>
import { getShopList , updateShop , createShop } from '../request/shops'
import { shopType, dictToOptions } from '../request/dict'
import bandList from '../components/bandList.vue'
import Ktable from '../components/table.vue'
import jsonForm from '../components/jsonForm.vue'
import { ref } from 'vue';

const shopTypeOptions = dictToOptions(shopType)
let shopId = ref("")
const KtableRef = ref()

//edit
let JsonFormComfireCallBack = ref(() => { })
let jsonFormShow = ref(false)
const editFormModel = ref({})
const editFormColumns = [
  {
    type: 'select',
    prop: 'shopType',
    label: '店舖類型:',
    options: shopTypeOptions
  },
  {
    type: 'input',
    prop: 'shopName',
    label: '店舖名稱:',
  }
]

function refreshList(){
  KtableRef.value.fatchList()
}

function createHandle() {
    editFormModel.value = {}
    JsonFormComfireCallBack.value = createShop
    jsonFormShow.value = !jsonFormShow.value
}

function editHandle(index, row) {
    editFormModel.value = { ...row , shopType:String(row.shopType)}
    JsonFormComfireCallBack.value = updateShop
    jsonFormShow.value = !jsonFormShow.value
}

// table
const shopTypeFormatter = (row, column) => {
  let cell = row[column.property]
  return shopType[cell]
}

const columns = [
  { props: 'shopType', label: '店舖類型', formatter: shopTypeFormatter },
  { props: 'shopName', label: '店舖名稱' },
  // {props:'productCount',label:'產品種類'},
  { props: 'updateDate', label: '修改時間', width: 250 }
]
const operations = {
  width: 360,
  size: "small",
  children: [
    { type: "primary", name: '編輯', onClick: editHandle ,icon:'Edit'},
    { type: "warning", name: '管理禁售產品', onClick: manageBandProduct , icon:'Setting'},
    { type: "danger", name: '删除' ,icon:'Delete'}
  ]
}
const params = {
  size: 10,
  page: 1
}
const searchFormColumns = [
  {
    type: 'select',
    prop: 'shopType',
    label: '店铺類型:',
    options: shopTypeOptions
  }
]
const customBtn = [
  {
    type: 'success',
    label: '新增',
    icon: 'CirclePlus',
    onClick:createHandle
  }
]

let bandListDialogVisible = ref(false)

function manageBandProduct(index, row) {
  if (row && row.shopId) {
    shopId.value = row.shopId
  }
  bandListDialogVisible.value = !bandListDialogVisible.value
}

</script>