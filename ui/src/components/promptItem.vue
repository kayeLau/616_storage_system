<template>
    <div class="prompt-item-header">
        <el-select v-model="selectPromptItemCode" filterable clearable size="small">
            <el-option v-for="item in productOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <el-button type="success" icon="Plus" size="small" round style="margin-right: 10px;"
            @click="sumbitPromptItem(1)">添加</el-button>
    </div>
    <div class='prompt-items'>
        <div class="prompt-item" v-for="(item, index) of promptItems" :key="index">
            {{ item.productCode + ' ' + item.productName }}
            <el-button type="danger" icon="Delete" size="small" round
                @click="sumbitPromptItem(0, item.productId)">刪除</el-button>
        </div>
    </div>
</template>
<script setup>
import { readProduct, updateProduct } from '../request/products';
import { ref, onMounted } from 'vue';

let productOptions = ref([])
let promptItems = ref([])
let selectPromptItemCode = ref()

function getProducts() {
    const params = {
        size: 999,
        page: 1
    }
    readProduct(params).then(res => {
        productOptions.value = []
        promptItems.value = []
        if (res.success) {
            res.data.forEach(item => {
                if (item.prompt === 0) {
                    productOptions.value.push({
                        value: item.productId,
                        label: item.productCode + ' ' + item.productName
                    })
                } else {
                    promptItems.value.push(item)
                }
            })
        }
    })
}
function sumbitPromptItem(prompt, code) {
    if (prompt === 1 && !selectPromptItemCode.value) return;
    const data = {
        productId: prompt === 0 ? code : selectPromptItemCode.value,
        prompt
    }
    updateProduct(data).then(res => {
        if (res.success) {
            getProducts()
            selectPromptItemCode.value = ''
        }
    })
}

onMounted(() => {
    getProducts()
})
</script>
<style>
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

.prompt-items {
    height: calc(100% - 120px);
    overflow-y: scroll;
}

.prompt-item {
    padding: 3px 10px;
    text-align: left;
    display: flex;
    justify-content: space-between;
}

.prompt-item:hover {
    padding: 0 20px;
    background-color: var(--el-color-primary-light-9);
}
</style>