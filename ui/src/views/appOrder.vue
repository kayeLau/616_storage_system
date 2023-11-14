<template>
    <div style="position: relative;">
        <div class="tool-bar"></div>
        <el-tabs v-model="tabName" class="product-tabs" type="border-card">
            <el-tab-pane v-for="(item,index) of product" :label="item.label" :name="item.name" :key="index">
                <el-skeleton :loading="loading" animated>
                    <template #template>
                        <el-skeleton-item variant="text" style="width: 30%" />
                        <el-skeleton-item variant="text" style="width: 30%" />
                    </template>
                    <template #default>
                        <div class="product-list">
                            <div v-for="(product,index) of item.children" :key="index" class="product-li">
                                <div class="product-name">{{ product.productName }}</div>
                                <div class="order-quantity">
                                    <el-input-number v-model="product.orderQuantity" :min="0" @change="setOrderMap(product)"/><span style="padding-left: 10px;">{{ product.unit }}</span>
                                </div>
                                <!-- <div>{{ product.standard }}</div> -->
                            </div>
                        </div>
                    </template>
                </el-skeleton>
            </el-tab-pane>
        </el-tabs>
        <cart :orderMap="orderMap"></cart>
    </div>
</template>
<script setup>
import cart from '../components/cart.vue'
import { ref, onMounted } from 'vue';
import { getProductList } from '../request/products';
const tabName = ref('dry')
let loading = ref(true)
let orderMap = ref({})
const product = ref([
    {
        name: 'dry',
        label: '干貨',
        children: []
    },
    {
        name: 'freeseFirst',
        label: '一號雪房',
        children: []
    },
    {
        name: 'freeseThree',
        label: '三號雪房',
        children: []
    },
    {
        name: 'freeseFour',
        label: '四號雪房',
        children: []
    },
    {
        name: 'freeseFive',
        label: '五號雪房',
        children: []
    },
])

// 獲取產品列表
function getProducts() {
    const params = {
        size: 999,
        page: 1
    }
    getProductList(params).then(res => {
        if (res.success) {
            res.resource.forEach(item => {
                let freezersNum = item.freezersNum > 2 ? item.freezersNum - 1 : item.freezersNum;
                product.value[freezersNum].children.push({
                    ...item,
                    orderQuantity:0,
                    orderMode:0
                })
            });
        }
        loading.value = false
    })
}

function setOrderMap(product){
    let productCode = product.productCode
    orderMap.value[productCode] = product
}

onMounted(() => {
    getProducts()
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
 .product-name{
    font-weight: 500;
 }
 .product-tabs{
    height: 100%;
 }
.product-li{
    padding: 10px;
    height: 65px;
    background-color: #fff;
    border-bottom: rgba(0,0,0,0.1) 1px solid;
}
.product-list{
    padding-right: 10px;
    width: 100%;
    height: calc(100vh - 180px);
    overflow-y: scroll;
}
.order-quantity{
    float: right;
}
.product-list::-webkit-scrollbar {
    width: 0.4em;
}

.product-list::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.2);
    border-radius: 20px;
}

.product-list::-webkit-scrollbar-thumb {
  background-color: var(--el-color-primary);
  border-radius: 20px;
  /* outline: 1px solid var(--el-color-primary); */
}
</style>