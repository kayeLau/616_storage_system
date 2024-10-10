<template>
    <div>
        <el-card class="Ktable-container">
            <Ktable ref='KtableRef' :columns="columns" :operations="operations" :params="params" :getList="readMember"
                :searchFormColumns="searchFormColumns" :customBtn="customBtn"></Ktable>
        </el-card>
        <el-drawer v-model="jsonFormShow" title="員工資料" direction="rtl">
            <jsonForm ref='JsonFormRef' :formModel="editFormModel" :formColumns="editFormColumns"
                :comfireCallBack="JsonFormComfireCallBack" :rules="editFormRules" @sumbitSuccess="refreshList"
                @addSelectItem="addSelectItem">
            </jsonForm>
        </el-drawer>
    </div>
</template>

<script setup>
import { readShop, readPartition, createPartition, deletePartition } from '../request/shops'
import { readMember, register, updateMember, deleteMember } from '../request/users'
import { authDict, dictToOptions } from '../request/dict'
import Ktable from '../components/table.vue'
import jsonForm from '../components/jsonForm.vue'
import { ref } from 'vue'

const authOptions = dictToOptions(authDict)
const KtableRef = ref()
const JsonFormRef = ref()

//#region edit
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
        options: authOptions,
        change: authChange
    },
    {
        type: 'select',
        prop: 'shopId',
        label: '所屬分店:',
        options: []
    },
    {
        type: 'select',
        prop: 'shopPartition',
        label: '所屬分區:',
        options: [],
        icon: 'DeleteFilled',
        popconfirmTitle: '是否刪除?',
        addItem: true,
        deleteSelectOptions: deleteSelectItem
    },
])
const editFormRules = {
    name: [
        { required: true, message: '請輸入用戶名', trigger: 'blur' },
    ],
    password: [
        { required: true, message: '請輸入用戶密碼', trigger: 'blur' },
    ],
    auth: [
        { required: true, message: '請選擇用戶角色', trigger: 'blur' },
    ],
    shopId: [
        { required: true, message: '請選擇所屬分店', trigger: 'blur' },
    ],
}

function authChange(auth) {
    switch (auth) {
        case '-1':
            editFormColumns.value[3].remove = true;
            editFormColumns.value[4].remove = true;
            break
        case '2':
            editFormColumns.value[3].remove = true;
            editFormColumns.value[4].remove = false;
            break
        case '3':
            editFormColumns.value[3].remove = true;
            editFormColumns.value[4].remove = true;
            break
        default:
            editFormColumns.value[3].remove = false;
            editFormColumns.value[4].remove = true;
    }
}
function deleteSelectItem(partitionId) {
    deletePartition({ id: partitionId }).then(res => {
        if (res.success) {
            JsonFormRef.value.resetFields(['shopPartition'])
            getPartitionItems()
        }
    })
}

function addSelectItem(partitionName) {
    if (!partitionName) return;
    createPartition({ partitionName }).then(res => {
        if (res.success) {
            getPartitionItems()
        }
    })
}
// #endregion

//#region table
const authFormatter = (row, column) => {
    let cell = row[column.property]
    return authDict[cell]
}

const columns = [
    // {
    //     props: 'online', label: '狀態', render: (h,row) => {
    //         const state = onlineStateDict[row.online]
    //         const stClass = row.online === 0 ? 'offline' : 'online'
    //         return h('span',{class:stClass},state)
    //     }
    // },
    { props: 'name', label: '用戶名稱' },
    // { props: 'password', label: '用戶密碼' },
    { props: 'auth', label: '用戶角色', formatter: authFormatter },
    { props: 'shopPartitionName', label: '所屬分區' },
    { props: 'shopName', label: '所屬分店', width: 250 },
    { props: 'updateDate', label: '修改時間', width: 250 }
]
const operations = {
    width: 200,
    size: "small",
    children: [
        { type: "primary", name: "編輯", onClick: editHandle, icon: 'Edit' },
        { type: "danger", name: "删除", icon: 'Delete', onClick: deleteHandle, }
    ]
}
const params = {
    size: 10,
    page: 1
}
const searchFormColumns = ref([
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
    }
])

const customBtn = [
    {
        type: 'button',
        btnType: 'success',
        label: '新增',
        icon: 'CirclePlus',
        onClick: createHandle
    }
]
//#endregion

//#region 增刪查改
function refreshList() {
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
    JsonFormComfireCallBack.value = updateMember
    authChange(editFormModel.value.auth)
    editFormColumns.value[0].disabled = true
    editFormColumns.value[1].disabled = true
    jsonFormShow.value = !jsonFormShow.value
}

function deleteHandle(index, row) {
    deleteMember({ id: row.id }).then(res => {
        if (res.success) {
            KtableRef.value.fatchList()
        }
    })
}
//#endregion

//#region dict
// 獲取分區分店字典
async function getPartitionItems() {
    await readPartition().then(res => {
        if (res.success) {
            editFormColumns.value[4].options = res.data.map(item => {
                return {
                    label: item.partitionName,
                    value: item.id
                }
            })
        }
    })
}
getPartitionItems()
// 獲取分店分店字典
async function fatchShopList() {
    await readShop({ size: 999, page: 1 }).then(res => {
        if (res.success) {
            const dict = res.data.map(item => {
                return {
                    label: item.shopName,
                    value: item.shopId
                }
            })
            editFormColumns.value[3].options = dict
            searchFormColumns.value[1].options = dict
        }
    })
}
fatchShopList()
//#endregion
</script>
<style>
.online{
    color: var(--el-color-success-light-3);
    animation: flashing 1s infinite;
}
.offline{
    color: var(--el-color-danger-light-3);
}
@keyframes flashing {
    0%{
        opacity: 50%;
    }
    50%{
        opacity: 100%;
    }
    100%{
        opacity: 50%;
    }
}
</style>