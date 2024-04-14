<template>
    <div class="setting">
        <!-- <div class="title">系統設定</div> -->
        <el-form ref='formRef' :model="editFormModels" label-position="left">
            <el-form-item label="截單時間" prop="lastOrder">
                <el-time-select v-model="editFormModels.lastOrder" start="01:00" step="01:00" end="23:00" size="small"
                    placeholder="請選擇時間" clearable format="HH" style="width: 300px;" @change="sumbitLastOrder" />
            </el-form-item>
            <el-form-item label="設點必點產品" prop="promptItem" align="right">
                <el-button type="primary" @click="setDialogShow(0)">編輯</el-button>
            </el-form-item>
        </el-form>
        <el-dialog v-model="dialogShow" title="分店地址" custom-class='dialog' width="70%" height="60%"
            @open="openHandler" destroy-on-close>
            <component :is='dialogComponent'></component>
        </el-dialog>
    </div>
</template>
<script setup>
import { getSettingList, updateSetting } from '../request/setting'
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus'
import promptItem from '../components/promptItem.vue'

let dialogComponent = ref(null)
let dialogShow = ref(false)
let activeComponend = 0

function openHandler() {
    switch (activeComponend) {
        case 0:
            dialogComponent.value = promptItem
            break;
        default:
            break
    }

}

function setDialogShow(num){
    activeComponend = num
    dialogShow.value = !dialogShow.value
}

//#region LastOrder
const editFormModels = ref({})

function fatchList() {
    getSettingList({ size: 999, page: 1 }).then(res => {
        if (res.success) {
            res.resource.forEach(item => {
                editFormModels.value[item.name] = item.value
            })
        }
    })
}

function sumbitLastOrder() {
    let data = {
        name: 'lastOrder',
        value: editFormModels.value.lastOrder
    }
    updateSetting(data).then(res => {
        if (res.success) {
            ElMessage({ type: 'success', message: '操作成功：資料已存入數據庫' })
            fatchList()
        } else {
            ElMessage({ type: 'error', message: '操作失败：' + res.msg })
        }
    })
}
//#endregion

onMounted(() => {
    fatchList()
})
</script>
<style>
.el-dialog__header {
    text-align: start;
}

.el-form-item__content {
    justify-content: flex-end;
}
</style>