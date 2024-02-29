<template>
    <div style="position: relative;">
        <div class="tool-bar"></div>
        <el-tabs v-model="tabName" class="product-tabs" type="border-card">
            <el-tab-pane v-for="(item, index) of products" :label="item.label" :name="item.name" :key="index">
                <el-skeleton :loading="loading" animated>
                    <template #template>
                        <div class="product-list">
                            <el-skeleton-item variant="text" style="width: 80%" />
                            <el-skeleton-item variant="text" style="width: 50%" />
                        </div>
                    </template>
                    <template #default>
                        <div class="product-list">
                            <div v-for="(product, sIndex) of Object.values(item.children)" :key="sIndex" class="product-li">
                                <div class="product-name">{{ product.productName }}</div>
                                <div class="order-quantity">
                                    <el-input-number v-model="product.orderQuantity" :min="0"
                                        @change="setOrderMap(product)" /><span style="padding-left: 10px;">{{ product.unit
                                        }}</span>
                                </div>
                                <!-- <div>{{ product.standard }}</div> -->
                            </div>
                        </div>
                    </template>
                </el-skeleton>
            </el-tab-pane>
        </el-tabs>
        <cart :orderMap="orderMap" @orderDetailChange="orderDetailChange"></cart>
    </div>
</template>
<script setup>
import cart from '../components/cart.vue'
import { ref, onMounted } from 'vue';
import { getProductList } from '../request/products';
import { checkOrderRepeated } from '../request/orders';
import { classifyDict } from '../request/dict';
let loading = ref(true)
let orderMap = ref({})
const products = ref([])

function orderDetailChange(product) {
    setOrderMap(product)
    setProductListView(product)
}

function setOrderMap(product) {
    const productId = product.productId
    orderMap.value[productId] = product
}

function setProductListView(product) {
    const target = products.value.find(item => item.name === product.classify);
    target.children[product.productId] = product

    const promptNum = 0
    if (product.prompt) {
        products.value[promptNum].children[product.productId] = product
    }
}

// 獲取產品列表
async function getProducts() {
    const params = {
        size: 999,
        page: 1
    }
    await getProductList(params).then(res => {
        if (res.success) {
            res.resource.forEach(item => {
                const classify = item.classify;
                const classifyName = classifyDict[classify]
                if (!products.value[classify]) {
                    products.value[classify] = {
                        name: classify,
                        label: classifyName,
                        children: {}
                    }
                }
                if (item.prompt) {
                    products.value[0].children[item.productId] = {
                        ...item,
                        orderQuantity: 0,
                        orderMode: 0
                    }
                } else {
                    products.value[classify].children[item.productId] = {
                        ...item,
                        orderQuantity: 0,
                        orderMode: 0
                    }
                }
            });
            products.value = products.value.filter(item => Object.keys(item.children).length)

        }
        loading.value = false
    })
}
const tabName = ref(1)

function checkExistOrder() {
    checkOrderRepeated().then(res => {
        if (res.success && res.resource.children) {
            res.resource.children.forEach(item => {
                setOrderMap(item)
                setProductListView(item)
            })
        }
    })
}

onMounted(async () => {
    await getProducts()
    checkExistOrder()
})

</script>
<style>
@media only screen and (max-width: 960px) {
    .product-list {
        height: calc(100vh - 130px) !important;
    }

    .product-list::-webkit-scrollbar {
        width: 0 !important;
    }
}

.product-name {
    font-weight: 500;
}

.product-tabs {
    height: 100%;
}

.product-li {
    padding: 10px;
    height: 65px;
    background-color: #fff;
    border-bottom: rgba(0, 0, 0, 0.1) 1px solid;
}

.product-list {
    padding-right: 10px;
    width: 100%;
    height: calc(100vh - 180px);
    overflow-y: scroll;
}

.order-quantity {
    float: right;
}
</style>