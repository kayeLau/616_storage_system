<template>
    <div class="setting">
        <el-form ref='formRef' :model="editFormModels" label-position="left">
            <el-form-item label="截單時間" prop="lastOrder">
                <el-time-select v-model="editFormModels.lastOrder" start="01:00" step="01:00" end="23:00" size="small"
                    placeholder="請選擇時間" clearable format="HH" style="width: 300px;" @change="sumbitLastOrder" />
            </el-form-item>
            <el-form-item label="提示選擇項目" prop="promptItem" align="right">
                <el-switch v-model="editFormModels.promptItem" class="setting-switch" />
                <el-card class="prompt-items-box">
                    <div class="prompt-item-header">
                        <el-select v-model="selectPromptItemCode" filterable clearable size="small">
                            <el-option v-for="item in productOptions" :key="item.value" :label="item.label"
                                :value="item.value" />
                        </el-select>
                        <el-button type="success" icon="Plus" size="small" round style="margin-right: 10px;" @click="sumbitPromptItem(1)">添加</el-button>
                    </div>
                    <div class='prompt-items' style="height: calc(100% - 34px);">
                        <div class="prompt-item" v-for="(item,index) of promptItems" :key="index">
                            {{ item.productCode + ' ' + item.productName}}
                            <el-button type="danger" icon="Delete" size="small" round @click="sumbitPromptItem(0,item.productCode)">刪除</el-button>
                        </div>
                    </div>
                </el-card>
            </el-form-item>
        </el-form>
    </div>
</template>
<script setup>
import { getSettingList, updateSetting } from '../request/setting'
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus'
import { getProductList , updateProduct } from '../request/products';

let productOptions = ref([])
let promptItems = ref([])
let selectPromptItemCode = ref()
function getProducts() {
    const params = {
        size: 999,
        page: 1
    }
    getProductList(params).then(res => {
        productOptions.value = []
        promptItems.value = []
        if (res.success) {
            res.resource.forEach(item => {
                if (item.prompt === 0) {
                    productOptions.value.push({
                        value: item.productCode,
                        label: item.productCode + ' ' + item.productName
                    })
                } else {
                    promptItems.value.push(item)
                }
            })
        }
    })
}

function sumbitPromptItem(prompt,code){
    if(prompt === 1 && !selectPromptItemCode.value)return;
    const data = {
        productCode:prompt === 0 ? code : selectPromptItemCode.value,
        prompt
    }
    updateProduct(data).then(res => {
        if(res.success){
            getProducts()
        }
    })
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
    getProducts()
})
</script>
<style>
.setting-switch {
    float: right;
}

.el-form-item__content {
    justify-content: flex-end;
}

.prompt-items-box {
    padding: 10px;
    margin-top: 10px;
    --el-card-padding: 5px;
    width: 100%;
    height: 300px;
}

.prompt-item-header {
    padding-bottom: 10px;
    width: 350px;
    display: flex;
    align-items: center;
    gap: 10px;
}
.prompt-items{
    height: calc(100% - 54px);
    overflow-y: scroll;
}

.prompt-item{
    padding: 0 10px;
    text-align: left;
    display: flex;
    justify-content: space-between;
}
.prompt-item:hover{
    padding: 0 20px;
    background-color: var(--el-color-primary-light-9);
}
</style>