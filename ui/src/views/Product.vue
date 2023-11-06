<template>
  <div>
      <el-card class="Ktable-container">
          <Ktable ref='KtableRef' :columns="columns" :operations="operations" :params="params" :getList="getProductList" :searchFormColumns="searchFormColumns" :customBtn="customBtn"></Ktable>
      </el-card>
      <el-drawer v-model="jsonFormShow" title="店舖資料" direction="rtl">
        <jsonForm :formModel="editFormModel" :formColumns="editFormColumns" :comfireCallBack="JsonFormComfireCallBack" @sumbitSuccess="refreshList"></jsonForm>
    </el-drawer>
  </div>
</template>
<script setup>
import { getProductList , updateProduct , createProduct , deleteProduct} from '../request/products'
import { freezersNumDict , departmentDict , dictToOptions} from '../request/dict'
import Ktable from '../components/table.vue'
import jsonForm from '../components/jsonForm.vue'
import { ref } from 'vue';

const KtableRef = ref()

//edit
let JsonFormComfireCallBack = ref(() => { })
let jsonFormShow = ref(false)
const editFormModel = ref({})
const editFormColumns = ref([
  {
    type: 'input',
    prop: 'productCode',
    label: '產品編號:',
  },
  {
    type: 'input',
    prop: 'productName',
    label: '產品名稱:',
  },
  {
    type: 'select',
    prop: 'freezersNum',
    label: '雪房號碼:',
    options:dictToOptions(freezersNumDict)
  },
  {
    type: 'select',
    prop: 'department',
    label: '負責部門:',
    options:dictToOptions(departmentDict)
  },
  {
    type: 'input',
    prop: 'standard',
    label: '單位:',
  },
  {
    type: 'input',
    prop: 'unit',
    label: '規格:',
  }
])

function refreshList(){
  KtableRef.value.fatchList()
  jsonFormShow.value = !jsonFormShow.value
}

function createHandle() {
    editFormModel.value = {}
    JsonFormComfireCallBack.value = createProduct
    editFormColumns.value[0].disabled = false
    jsonFormShow.value = !jsonFormShow.value
}

function editHandle(index, row) {
    editFormModel.value = { ...row , freezersNum:String(row.freezersNum) , department:String(row.department)}
    JsonFormComfireCallBack.value = updateProduct
    editFormColumns.value[0].disabled = true
    jsonFormShow.value = !jsonFormShow.value
}

function deleteHandle(index, row){
  deleteProduct({productCode:row.productCode}).then(res => {
    if(res.success){
      refreshList()
    }
  })
}

// tabel
const freezersNumFormatter = (row , column)=>{
    let cell = row[column.property]
    return freezersNumDict[cell]
}

const departmentFormatter = (row , column)=>{
    let cell = row[column.property]
    return departmentDict[cell]
}

const columns = [
  {props:'productCode',label:'產品編號'},
  {props:'productName',label:'產品名稱'},
  {props:'freezersNum',label:'雪房號碼',formatter:freezersNumFormatter},
  {props:'department',label:'負責部門',formatter:departmentFormatter},
  {props:'standard',label:'單位'},
  {props:'unit',label:'規格'},
  {props:'updateDate',label:'修改時間',width:250}
]
const operations = {
  width:200,
  size:"small",
  children:[
      {type:"primary",name:'編輯',icon:'Edit' , onClick:editHandle},
      {type:"danger",name:'删除',icon:'Delete' , onClick:deleteHandle}
  ]
}
const params = {
  size:20,
  page:1
}
const searchFormColumns = [
  {
      type:'select',
      prop:'freezersNum',
      label:'雪房號碼:',
      options:dictToOptions(freezersNumDict)
  }
]
const customBtn = [
  {
      type:'success',
      label:'新增',
      icon:'CirclePlus',
      onClick:createHandle
  }
]

</script>