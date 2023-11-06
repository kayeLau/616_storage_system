<template>
    <div>
        <el-card class="Ktable-container">
            <Ktable isExpand :columns="columns" :operations="operations" :params="params" :getList="getOrderList" :searchFormColumns="searchFormColumns" :customBtn="customBtn"
            :expandHeader="expandHeader" :expandColumns="expandColumns"></Ktable>
        </el-card>
    </div>
  </template>
  <script setup>
  import { getOrderList } from '../request/orders'
  import { departmentDict } from '../request/dict'
  import Ktable from '../components/table.vue'
  
  const departmentFormatter = (row , column)=>{
      let cell = row[column.property]
      console.log(cell)
      return departmentDict[cell]
  }
  
  const columns = [
    {props:'orderShopName',label:'落單門店'},
    {props:'department',label:'落單部門',formatter:departmentFormatter},
    {props:'orderUserName',label:'落單人'},
    {props:'updateDate',label:'落單時間',width:250}
  ]
  const operations = false
  const params = {
    size:20,
    page:1,
  }
  const searchFormColumns = [
  {
      type:'datePicker',
      prop:'updateDate',
      label:'下單時間:',
  }
]
  const customBtn = []
  
  </script>