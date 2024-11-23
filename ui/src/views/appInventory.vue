<template>
    <div style="position: relative;height: 100%;overflow: hidden;">
        <el-skeleton :loading="loading" animated>
            <template #template>
                <div class="product-skeleton">
                    <el-skeleton-item variant="text" style="width: 90%" />
                    <el-skeleton-item variant="text" style="width: 80%" />
                    <el-skeleton-item variant="text" style="width: 50%" />
                </div>
            </template>
            <el-tabs v-model="tabName" class="product-tabs" type="border-card" tabPosition="left">
                <el-tab-pane v-for="(item, index) of products" :name="item.name" :key="index">
                    <template #label>
                        <span>{{ item.label }}</span>
                    </template>
                    <template #default>
                        <div class="product-list">
                            <div v-for="(product, sIndex) of Object.values(item.children)" :key="sIndex"
                                class="product-li"
                                :style="product.checked === false ? 'background-color: var(--el-color-danger-light-3)' : ''">
                                <div class="product-name">{{ product.productName }}</div>
                                <div class="product-row">
                                    <div class="order-quantity">
                                        <div style="padding-right: 10px;">{{ product.standard }}</div>
                                        <el-input-number v-model="product.orderQuantity" :min="0"
                                            @change="orderChange(product)" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
                </el-tab-pane>
            </el-tabs>
        </el-skeleton>

        <cart v-show="!loading" flag="inventory" :orderMap="orderMap" @orderDetailChange="orderDetailChange" @sumbit="getInventory"></cart>
    </div>
</template>

<script setup>
import cart from '../components/cart.vue'
import { ref, onMounted, unref } from 'vue';
import { checkInventoryRepeated } from '../request/inventory';
import { classifyDict, classifySort } from '../request/dict';

let loading = ref(true)
let orderMap = ref({})
const products = ref([])

// 購物車項目改變
function orderDetailChange(product) {
    setOrderMap(product)
    setProductView(product)
}

// 加購
function orderChange(product) {
    setOrderMap(product)
}

// 添加到訂單Map
function setOrderMap(product) {
    const productId = product.productId
    orderMap.value[productId] = unref(product)
}

// 回顯已存在的訂單
function setProductView(product) {
    const target = products.value.find(item => item.name === (product.classify));
    target.children[product.productId].orderQuantity = product.orderQuantity
    target.children[product.productId].id = product.id
}

// 獲取本月盤點明細
async function getInventory() {
    await checkInventoryRepeated().then(res => {
        if (res.success) {
            getProducts(res.product)
            getInventoryDetail(res.inventory)
        }
    })
}

// 獲取產品列表
function getProducts(product) {
    product.forEach(item => {
        const classify = item.classify;
        const classifyName = classifyDict[item.classify]
        if (!products.value[classify]) {
            products.value[classify] = {
                name: classify,
                label: classifyName,
                children: {}
            }
        }
        products.value[classify].children[item.productId] = {
            ...item,
            orderQuantity: 0,
            orderMode: 0
        }
    });
    products.value = products.value
        .sort((a, b) => classifySort.indexOf(a.name) - classifySort.indexOf(b.name))
        .filter(item => Object.keys(item.children).length);

}

// 獲取當天已存在的訂單
async function getInventoryDetail(inventory) {
    for (let item of inventory) {
        setOrderMap(item)
        setProductView(item)
    }
}

const tabName = ref('')
onMounted(async () => {
    await getInventory()
    tabName.value = products.value[0].name
    loading.value = false
})

</script>

<style>
.product-row {
    display: flex;
    justify-content: flex-end;
    align-items: center;
}

.product-tabs {
    height: calc(100vh - 105px);
    overflow: hidden;
}

.product-li {
    padding: 10px;
    background-color: #fff;
    border-bottom: rgba(0, 0, 0, 0.1) 1px solid;
}

.product-list {
    padding-right: 10px;
    width: 100%;
    height: calc(100vh - 130px);
    overflow-y: scroll;
}

.product-skeleton {
    padding: 10px;
    height: calc(100vh - 150px);
    background-color: #fff;
}

.order-quantity {
    padding: 10px 0;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 5px;
}

.el-tabs__item {
    --el-tabs-header-height: 50px;
}
</style>