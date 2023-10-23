<template>
  <div>
      <el-card class="Ktable-container">
          <Ktable :columns="columns" :operations="operations" :params="params" :getList="getProductList" :searchFormColumns="searchFormColumns" :customBtn="customBtn"></Ktable>
      </el-card>
  </div>
</template>
<script setup>
import { getProductList } from '../request/products'
import { freezersNumDict , departmentDict , dictToOptions} from '../request/dict'
import Ktable from '../components/table.vue'

const freezersNumFormatter = (row , column)=>{
    let cell = row[column.property]
    return freezersNumDict[cell]
}

const departmentFormatter = (row , column)=>{
    let cell = row[column.property]
    console.log(cell)
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
  width:160,
  size:"small",
  children:[
      {type:"primary",name:'編輯'},
      {type:"danger",name:'删除'}
  ]
}
const params = {
  size:20,
  page:1
}
const searchFormColumns = [
  {
      type:'select',
      prop:'shopType',
      label:'雪房號碼:',
      options:dictToOptions(freezersNumDict)
  }
]
const customBtn = [
  {
      type:'success',
      label:'新增',
      icon:'Plus'
  }
]

</script>
<style>
.Ktable-container{
  height: 80vh;
}
</style>