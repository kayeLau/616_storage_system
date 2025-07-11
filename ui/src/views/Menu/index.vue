<template>
    <div>
        <el-tabs v-model="tabsValue" class="ktable-tabs" type="card">
            <el-tab-pane key="" label="菜品">
                <el-card class="menu-container">
                    <Ktable ref='KtableRef' :columns="columns" :operations="operations" :params="params"
                        :getList="readMenu" :searchFormColumns="searchFormColumns" :customBtn="customBtn"></Ktable>
                </el-card>
            </el-tab-pane>
            <el-tab-pane key="" label="口味">
                <tasteOptions></tasteOptions>
            </el-tab-pane>
        </el-tabs>
        <el-drawer v-model="jsonFormShow" title="菜品資料" direction="rtl" :style="{ minWidth: '300px' }">
            <jsonForm :formModel="editFormModel" :formColumns="editFormColumns" :rules="editFormRules"
                :comfireCallBack="JsonFormComfireCallBack" @sumbitSuccess="refreshList"></jsonForm>
        </el-drawer>
    </div>
</template>
<script setup>
import { readMenu, updateMenu, createMenu } from '../../request/menu'
import { menuClassifyDict, disable, dictToOptions } from '../../request/dict'
import Ktable from '../../components/table.vue'
import jsonForm from '../../components/jsonForm.vue'
import tasteOptions from './tasteOptions.vue'
import { ref } from 'vue'
import { exportExcel } from '../../utils/export'

const KtableRef = ref()

//#region Edit
let JsonFormComfireCallBack = ref(() => { })
let jsonFormShow = ref(false)
const editFormModel = ref({})
const editFormColumns = ref([
    {
        type: 'input',
        prop: 'foodCode',
        label: '產品編號:',
    },
    {
        type: 'input',
        prop: 'name',
        label: '產品名稱:',
    },
    {
        type: 'select',
        prop: 'classify',
        label: '類別:',
        options: dictToOptions(menuClassifyDict)
    },
    {
        type: 'select',
        prop: 'options',
        label: '口味定制:',
        options: []
    },
    {
        type: 'input',
        prop: 'price',
        label: '價格:',
    },
    {
        type: 'input',
        prop: 'introduce',
        label: '簡介:',
    },
    {
        type: 'input',
        prop: 'comboId',
        label: '套餐:',
    },
    {
        type: 'select',
        prop: 'disable',
        label: '狀態:',
        options: dictToOptions(disable)
    },
])
const editFormRules = {
    foodCode: [
        { required: true, message: '請輸入產品編號', trigger: 'blur' },
    ],
    name: [
        { required: true, message: '請輸入產品名稱', trigger: 'blur' },
    ],
    classify: [
        { required: true, message: '請選擇雪房號碼', trigger: 'blur' },
    ],
    price: [
        { required: true, message: '請選擇分類', trigger: 'blur' },
    ],
    introduce: [
        { required: true, message: '請選擇負責部門', trigger: 'blur' },
    ],
    disable: [
        { required: true, message: '請選擇展示狀態', trigger: 'blur' },
    ],
}
//#endregion

//#region Tabel
const classifyFormatter = (row, column) => {
    let cell = row[column.property]
    return menuClassifyDict[cell]
}

const disableFormatter = (row, column) => {
    let cell = row[column.property]
    let color = cell === 1 ? 'var(--el-color-danger)' : 'var(--el-color-success)'
    return `<span style='color:${color}'>${disable[cell]}<span>`
}

const columns = [
    { props: 'disable', label: '狀態', formatter: disableFormatter, width: 60 },
    // { props: 'foodCode', label: '菜品編號', width: 80 },
    { props: 'name', label: '菜品名稱', width: 130 },
    { props: 'classify', label: '分類', formatter: classifyFormatter, width: 120 },
    { props: 'price', label: '價格', width: 80 },
    { props: 'introduce', label: '簡介', width: 150 },
    { props: 'updateDate', label: '修改時間', width: 200 }
]
const operations = {
    width: 200,
    size: "small",
    children: [
        { type: "primary", name: '編輯', icon: 'Edit', onClick: editHandle },
        { btnType: "popconfirm", type: "danger", name: '删除', icon: 'Delete', onClick: deleteHandle }
    ]
}
const params = {
    size: 20,
    page: 1,
    disable: '0'
}
const searchFormColumns = [
    {
        type: 'input',
        prop: 'productName',
        label: '產品名稱:',
    },
    {
        type: 'select',
        prop: 'classify',
        label: '分類:',
        options: dictToOptions(classifyFormatter)
    },
    {
        type: 'select',
        prop: 'disable',
        label: '狀態:',
        options: dictToOptions(disable)
    },
]

const customBtn = [
    {
        type: 'button',
        btnType: 'success',
        label: '新增',
        icon: 'CirclePlus',
        onClick: createHandle
    },
    {
        type: 'button',
        btnType: 'success',
        label: '導出',
        icon: 'Printer',
        onClick: exportMenuExcel
    },
]

function refreshList() {
    KtableRef.value.fatchList()
    jsonFormShow.value = !jsonFormShow.value
}

function createHandle() {
    editFormModel.value = {}
    JsonFormComfireCallBack.value = createMenu
    editFormColumns.value[0].disabled = false
    jsonFormShow.value = !jsonFormShow.value
}

function editHandle(index, row) {
    editFormModel.value = {
        ...row,
        classify: String(row.classify),
        disable: String(row.disable),
    }
    JsonFormComfireCallBack.value = updateMenu
    editFormColumns.value[0].disabled = true
    jsonFormShow.value = !jsonFormShow.value
}

function deleteHandle(index, row) {
    updateMenu({ id: row.id, disable: 2 }).then(res => {
        if (res.success) {
            KtableRef.value.fatchList()
        }
    })
}
function exportMenuExcel() {
    readMenu({ size: 999, page: 1 }).then(res => {
        if (res.success) {
            let jsonData = []
            jsonData = res.data.map(item => {
                return [
                    disable[item.disable],
                    item.productId,
                    item.productCode,
                    item.productName,
                    menuClassifyDict[item.classify],
                    item.standard,
                    item.unit,
                    item.updateDate,
                ]
            })
            jsonData.unshift(['狀態', '產品Id', '產品編號', '產品名稱', '分類 ', '雪房號碼', '負責部門', '規格', '單位', '匯總', '修改時間'])
            const menu = {
                sheetNames: '產品',
                jsonData
            }
            exportExcel({ exportDate: [menu] })
        }
    })
}
//#endregion
</script>
<style>
.menu-container {
    height: 75vh;
    border-top-left-radius: 0;
}

.upload-demo {
    display: flex;
}

.el-upload-list__item .el-upload-list__item-info {
    width: 100%;
}
</style>