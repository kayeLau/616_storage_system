<template>
    <div style="position: relative;">
        <div class="tool-bar"></div>
        <el-tabs v-model="tabName" class="product-tabs" type="border-card">
            <el-tab-pane v-for="(item,index) of products" :label="item.label" :name="item.name" :key="index">
                <el-skeleton :loading="loading" animated>
                    <template #template>
                        <div class="product-list">
                            <el-skeleton-item variant="text" style="width: 80%" />
                            <el-skeleton-item variant="text" style="width: 50%" />
                        </div>
                    </template>
                    <template #default>
                        <div class="product-list">
                            <div v-for="(product,sIndex) of Object.values(item.children)" :key="sIndex" class="product-li">
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
        <cart :orderMap="orderMap" @orderDetailChange="orderDetailChange"></cart>
    </div>
</template>
<script setup>
import cart from '../components/cart.vue'
import { ref, onMounted } from 'vue';
import { getProductList } from '../request/products';
import { checkOrderRepeated } from '../request/orders';
const tabName = ref('dry')
let loading = ref(true)
let orderMap = ref({})
const products = ref([
    {
        name: 'dry',
        label: '干貨',
        children: {}
    },
    {
        name: 'freeseFirst',
        label: '一號雪房',
        children: {}
    },
    {
        name: 'freeseThree',
        label: '三號雪房',
        children: {}
    },
    {
        name: 'freeseFour',
        label: '四號雪房',
        children: {}
    },
    {
        name: 'freeseFive',
        label: '五號雪房',
        children: {}
    },
])

function orderDetailChange(product){
    setOrderMap(product)
    setProductListView(product)
}

function setOrderMap(product){
    let productCode = product.productCode
    orderMap.value[productCode] = product
}

function setProductListView(product){
    for(let i = 0;i < products.value.length;i++){
        // let target = products.value[i].children[product.productCode]
        if(products.value[i].children[product.productCode]){
            products.value[i].children[product.productCode] = product
        }
        
    }
}

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
                products.value[freezersNum].children[item.productCode] = {
                    ...item,
                    orderQuantity:0,
                    orderMode:0
                }
            });
        }
        loading.value = false
    })
}

function checkExistOrder(){
    checkOrderRepeated().then(res => {
        if(res.success && res.resource && res.resource.children.length){
            res.resource.children.forEach(item => {
                setOrderMap(item)
                setProductListView(item)
            })
        }
    })
}

onMounted(() => {
    getProducts()
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
</style>