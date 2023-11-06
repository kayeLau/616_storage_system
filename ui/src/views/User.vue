<template>
    <div>
        <el-card class="Ktable-container">
            <Ktable ref='KtableRef' :columns="columns" :operations="operations" :params="params" :getList="getUsersList"
                :searchFormColumns="searchFormColumns" :customBtn="customBtn"></Ktable>
        </el-card>
        <el-drawer v-model="jsonFormShow" title="員工資料" direction="rtl">
            <jsonForm :formModel="editFormModel" :formColumns="editFormColumns" :comfireCallBack="JsonFormComfireCallBack"  @sumbitSuccess="refreshList">
            </jsonForm>
        </el-drawer>
    </div>
</template>
<script setup>
import { getShopList } from '../request/shops'
import { getUsersList, register, updateUserInfo } from '../request/users'
import { authDict, dictToOptions } from '../request/dict'
import Ktable from '../components/table.vue'
import jsonForm from '../components/jsonForm.vue'
import { ref } from 'vue'

const authOptions = dictToOptions(authDict)
const KtableRef = ref()

//edit
let JsonFormComfireCallBack = ref(() => { })
let jsonFormShow = ref(false)
let editFormModel = ref({})
const editFormColumns = ref([
    {
        type: 'input',
        prop: 'name',
        label: '用戶名稱:',
    },
    {
        type: 'input',
        prop: 'password',
        label: '用戶密碼:',
    },
    {
        type: 'select',
        prop: 'auth',
        label: '用戶角色:',
        options: authOptions
    },
    {
        type: 'select',
        prop: 'shopId',
        label: '所屬分店:',
        options: []
    },
])

async function fatchShopList() {
    let result = []
    await getShopList({ size: 999, page: 1 }).then(res => {
        if (res.success) {
            result = res.resource.map(item => {
                return { label: item.shopName, value: item.shopId }
            })
        }
    })
    editFormColumns.value[3].options = result
}
fatchShopList()

function refreshList(){
  KtableRef.value.fatchList()
  jsonFormShow.value = !jsonFormShow.value
}

function createHandle() {
    editFormModel.value = {}
    JsonFormComfireCallBack.value = register
    editFormColumns.value[0].disabled = false
    editFormColumns.value[1].disabled = false
    jsonFormShow.value = !jsonFormShow.value
}

function editHandle(index, row) {
    editFormModel.value = { ...row, auth: String(row.auth) }
    JsonFormComfireCallBack.value = updateUserInfo
    editFormColumns.value[0].disabled = true
    editFormColumns.value[1].disabled = true
    jsonFormShow.value = !jsonFormShow.value
}

// table
const authFormatter = (row, column) => {
    let cell = row[column.property]
    return authDict[cell]
}

const columns = [
    { props: 'name', label: '用戶名稱' },
    { props: 'password', label: '用戶密碼' },
    { props: 'auth', label: '用戶角色', formatter: authFormatter },
    // { props: 'shopCode', label: '商店編號' },
    { props: 'shopName', label: '所屬分店' },
    { props: 'updateDate', label: '修改時間', width: 250 }
]
const operations = {
    width: 200,
    size: "small",
    children: [
        { type: "primary", name: "編輯", onClick: editHandle, icon: 'Edit' },
        { type: "danger", name: "删除", icon: 'Delete' }
    ]
}
const params = {
    size: 10,
    page: 1
}
const searchFormColumns = [
    {
        type: 'select',
        prop: 'auth',
        label: '用戶角色:',
        options: [
            { label: '管理員', value: 0 },
            { label: '前線樓面', value: 1 },
            { label: '前線廚房', value: 2 }
        ]
    }
]
const customBtn = [
    {
        type: 'success',
        label: '新增',
        icon: 'CirclePlus',
        onClick: createHandle
    }
]

</script>