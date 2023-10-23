<template>
  <div>
      <el-card class="Ktable-container">
          <Ktable :columns="columns" :operations="operations" :params="params" :getList="getShopList" :searchFormColumns="searchFormColumns" :customBtn="customBtn"></Ktable>
      </el-card>
      <bandList :dialogVisible="bandListDialogVisible" @closeDialog="manageBandProduct" :shopId="shopId"></bandList>
  </div>
</template>
<script setup>
import { getShopList } from '../request/shops'
import { shopType } from '../request/dict'
import bandList from '../components/bandList.vue'
import Ktable from '../components/table.vue'
import { ref } from 'vue';

let shopId = ref("")

const shopTypeFormatter = (row , column)=>{
    let cell = row[column.property]
    return shopType[cell]
}

const columns = [
  {props:'shopType',label:'店铺類型' , formatter:shopTypeFormatter},
  {props:'shopName',label:'店铺名称'},
  {props:'productCount',label:'產品種類'},
  {props:'updateDate',label:'修改時間',width:250}
]
const operations = {
  width:300,
  size:"small",
  children:[
      {type:"primary",name:'編輯'},
      {type:"primary",name:'管理禁售產品' , onClick:manageBandProduct},
      {type:"danger",name:'删除'}
  ]
}
const params = {
  size:10,
  page:1
}
const searchFormColumns = [
  {
      type:'select',
      prop:'shopType',
      label:'店铺類型:',
      options:[
          {label:'616牛肉火鍋專門店' , value:0 },
      ]
  }
]
const customBtn = [
  {
      type:'success',
      label:'新增',
      icon:'Plus'
  }
]

let bandListDialogVisible = ref(false)

function manageBandProduct(index,row){
  if(row && row.shopId){
    shopId.value = row.shopId
  }
  bandListDialogVisible.value = !bandListDialogVisible.value
}

</script>
<style>
.Ktable-container{
  height: 80vh;
}
</style>