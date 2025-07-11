<template>
    <div>
        <el-card class="menu-container">
            <Ktable ref='KtableRef' :columns="columns" :operations="operations" :params="params" :getList="readTasteOptions"
                :searchFormColumns="searchFormColumns" :customBtn="customBtn"></Ktable>
        </el-card>
    </div>
</template>
<script setup>
import { readTasteOptions , createTasteOptions } from '../../request/menu'
import { disable, dictToOptions } from '../../request/dict'
import Ktable from '../../components/table.vue'
import { ref } from 'vue'

const columns = [
    { props: 'disable', label: '狀態', width: 60 },
    { props: 'name', label: '菜品名稱', width: 130 },
    { props: 'classify', label: '分類', width: 120 },
    { props: 'price', label: '價格', width: 80 },
    { props: 'introduce', label: '簡介', width: 150 },
    { props: 'updateDate', label: '修改時間', width: 200 }
]
const operations = {
    width: 200,
    size: "small",
    children: [

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
    }
]

function createHandle() {
    editFormModel.value = {}
    JsonFormComfireCallBack.value = createTasteOptions
    jsonFormShow.value = !jsonFormShow.value
}
// function editHandle(index, row) {
//     editFormModel.value = {
//         ...row,
//         classify: String(row.classify),
//         disable: String(row.disable),
//     }
//     JsonFormComfireCallBack.value = updateMenu
//     editFormColumns.value[0].disabled = true
//     jsonFormShow.value = !jsonFormShow.value
// }

// function deleteHandle(index, row) {
//     updateMenu({ id: row.id, disable: 2 }).then(res => {
//         if (res.success) {
//             KtableRef.value.fatchList()
//         }
//     })
// }

const editFormModel = ref({})
let JsonFormComfireCallBack = ref(() => { })
let jsonFormShow = ref(false)
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