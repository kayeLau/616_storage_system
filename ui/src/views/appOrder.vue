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
                            <div v-for="(product, sIndex) of Object.values(item.children)" :key="sIndex"
                                class="product-li">
                                <div class="product-name">{{ product.productName }}</div>
                                <div class="product-row">
                                    <div class="product-standard">{{ product.standard }}</div>
                                    <div class="order-quantity">
                                        <el-input-number v-model="product.orderQuantity" :min="0"
                                            @change="orderChange(product)" /><span style="padding-left: 10px;">{{ product.unit }}</span>
                                    </div>
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
import { classifyDict , classifySort } from '../request/dict';
import { createWs , getWs } from '../utils/ws';
import { getStorge } from '../utils/auth';

let loading = ref(true)
let orderMap = ref({})
const products = ref([
    {
        name: 0,
        label: "必點",
        children: {}
    }
])

// 購物車項目改變
function orderDetailChange(product) {
    setOrderMap(product)
    setProductListView(product)
    sendOrderWs()
}

// 加購
function orderChange(product) {
    setOrderMap(product)
    sendOrderWs()
}

function setOrderMap(product) {
    const productId = product.productId
    orderMap.value[productId] = product
}

function setProductListView(product) {
    const target = products.value.find(item => item.name === (product.classify + 1));
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
                const classify = item.classify + 1;
                const classifyName = classifyDict[item.classify]
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
            products.value = products.value
            .sort((a,b) => classifySort.indexOf(a.name) - classifySort.indexOf(b.name))
            .filter(item => Object.keys(item.children).length)

        }
        loading.value = false
    })
}
const tabName = ref('')

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
// ws
function sendOrderWs() {
    const userInfo = JSON.parse(getStorge('userInfo'))
    const ws = getWs()
    ws.send(JSON.stringify({
        shopId: userInfo.shopId,
        auth: userInfo.auth,
        orderList: Object.values(orderMap.value).filter(item => item.orderQuantity !== 0)
    }))
}

function syncOrder(message){
    const userInfo = JSON.parse(getStorge('userInfo'))
    if(message.shopId === userInfo.shopId && message.auth === userInfo.auth){
        console.log(message.orderList)
        message.orderList.forEach(item => {
            setOrderMap(item)
            setProductListView(item)
        })
    }
}

//接收 Server 發送的訊息
function setWebsocket() {
    const token = getStorge('token')
    const ws = createWs(token)
    ws.addEventListener('message', (event) => {
        const message = JSON.parse(event.data);
        console.log('收到消息：', message);
        syncOrder(message)
    });
}
setWebsocket()

onMounted(async () => {
    await getProducts()
    tabName.value = products.value[0].name
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
.product-row{
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.product-standard{
    color: #ccc
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