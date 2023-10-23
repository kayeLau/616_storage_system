<template>
    <div>
        <el-card class="Ktable-container">
            <Ktable :columns="columns" :operations="operations" :params="params" :getList="getUsersList" :searchFormColumns="searchFormColumns" :customBtn="customBtn"></Ktable>
        </el-card>
    </div>
</template>
<script setup>
import { getUsersList } from '../request/users'
import { authDict } from '../request/dict'
import Ktable from '../components/table.vue'

const authFormatter = (row , column)=>{
    let cell = row[column.property]
    return authDict[cell]
}

const columns = [
    {props:'name',label:'用戶名稱'},
    {props:'password',label:'用戶密碼'},
    {props:'auth',label:'用戶角色',formatter:authFormatter},
    {props:'shopCode',label:'商店編號'},
    {props:'shopName',label:'商店名稱'},
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
    size:10,
    page:1
}
const searchFormColumns = [
    {
        type:'select',
        prop:'auth',
        label:'用戶角色:',
        options:[
            {label:'管理員' , value:0 },
            {label:'前線樓面' , value:1 },
            {label:'前線廚房' , value:2 }
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

</script>
<style>
.Ktable-container{
    height: 80vh;
}
</style>