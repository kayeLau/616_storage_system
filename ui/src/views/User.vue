<template>
    <div>
        <el-card class="Ktable-container">
            <Ktable ref='KtableRef' :columns="columns" :operations="operations" :params="params" :getList="getUsersList"
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
import { getShopList, getPartitionList, createPartition, deletePartitionItem } from '../request/shops'
import { getUsersList, register, updateUserInfo, deleteUser } from '../request/users'
import { authDict, dictToOptions } from '../request/dict'
import Ktable from '../components/table.vue'
import jsonForm from '../components/jsonForm.vue'
import { ref } from 'vue'

const authOptions = dictToOptions(authDict)
const KtableRef = ref()
const JsonFormRef = ref()

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
        prop: 'partition',
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
        default:
            editFormColumns.value[3].remove = false;
            editFormColumns.value[4].remove = true;
    }
}

// 獲取分區分店字典
async function getPartitionItems() {
    await getPartitionList().then(res => {
        if (res.success) {
            editFormColumns.value[4].options = res.resource.map(item => {
                return {
                    label: item.partitionName,
                    value: item.id
                }
            })
        }
    })
}
getPartitionItems()
async function fatchShopList() {
    await getShopList({ size: 999, page: 1 }).then(res => {
        if (res.success) {
            editFormColumns.value[3].options = res.resource.map(item => {
                return {
                    label: item.shopName,
                    value: item.shopId
                }
            })
        }
    })
}
fatchShopList()

function deleteSelectItem(partitionId) {
    deletePartitionItem({ id: partitionId }).then(res => {
        if (res.success) {
            JsonFormRef.value.resetFields(['partition'])
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

// 增刪查改
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
    JsonFormComfireCallBack.value = updateUserInfo
    authChange(editFormModel.value.auth)
    editFormColumns.value[0].disabled = true
    editFormColumns.value[1].disabled = true
    jsonFormShow.value = !jsonFormShow.value
}

function deleteHandle(index, row) {
    deleteUser({ id: row.id }).then(res => {
        if (res.success) {
            KtableRef.value.fatchList()
        }
    })
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
const searchFormColumns = [
    {
        type: 'select',
        prop: 'auth',
        label: '用戶角色:',
        options: authOptions
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