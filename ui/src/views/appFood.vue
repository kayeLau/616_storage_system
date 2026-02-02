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
                                    <!-- <div class="product-standard">{{ product.standard }}</div> -->
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

        <cart v-show="!loading" :flag="flag" :orderMap="orderMap" @orderDetailChange="orderDetailChange"
            @submit="submitOrder">
        </cart>
    </div>
</template>

<script setup>
import cart from '../components/cart.vue'
import { ref, onMounted, unref, defineEmits, defineProps } from 'vue';
import { readProduct } from '../request/products';
import { checkOrderRepeated } from '../request/orders';
import { classifyDict, classifySort } from '../request/dict';
import { useRouter } from 'vue-router';
const router = useRouter()

const porps = defineProps({
    flag: {
        type: String,
        default: "order"
    }
})
const emit = defineEmits(['setActiveMenu'])
let loading = ref(true)
let orderMap = ref({})
const PRODUCTS = porps.flag === 'order' ? [
    {
        name: 0,
        label: "必點",
        children: {}
    }
] : [];
const products = ref(PRODUCTS)

// 購物車項目改變
function orderDetailChange(product) {
    setMustOrderChecked(product)
    setOrderMap(product)
    setProductListView(product)
}

// 加購
function orderChange(product) {
    setMustOrderChecked(product)
    setOrderMap(product)
}

// 添加到訂單Map
function setOrderMap(product) {
    const productId = product.productId
    orderMap.value[productId] = unref(product)
}

function setMustOrderChecked(product) {
    if (product.checked === false) {
        product.checked = true
    }
}

// 回顯已存在的訂單
function setProductListView(product) {
    const promptNum = 0
    if (product.prompt && porps.flag === 'order') {
        products.value[promptNum].children[product.productId] = product
    } else {
        const target = products.value.find(item => item.name === (product.classify));
        target.children[product.productId] = product
    }
}

// 獲取產品列表
async function getProducts() {
    const params = {
        size: 999,
        page: 1
    }
    await readProduct(params).then(res => {
        if (res.success) {
            res.data.forEach(item => {
                const classify = item.classify;
                const classifyName = classifyDict[item.classify]
                if (!products.value[classify]) {
                    products.value[classify] = {
                        name: classify,
                        label: classifyName,
                        children: {}
                    }
                }

                // 必點
                if (item.prompt && porps.flag === "order") {
                    const _item = {
                        ...item,
                        orderQuantity: null,
                        orderMode: 0,
                        checked: false
                    }
                    products.value[0].children[item.productId] = _item
                    orderMap.value[item.productId] = _item
                } else {
                    products.value[classify].children[item.productId] = {
                        ...item,
                        orderQuantity: 0,
                        orderMode: 0
                    }
                }
            });
            products.value = products.value
                .sort((a, b) => classifySort.indexOf(a.name) - classifySort.indexOf(b.name))
                .filter(item => Object.keys(item.children).length);
        }
    })
}

const tabName = ref('')

// 獲取當天已存在的訂單
async function checkExistOrder() {
    await checkOrderRepeated().then(res => {
        if (res.success && res.data) {
            res.data.children.forEach(item => {
                setOrderMap(item)
                setProductListView(item)
            })
        }
    })
}

async function submitOrder() {
    const path = '/order';
    await checkExistOrder()
    router.push({ path })
    emit('setActiveMenu', path.substring(1))
}

onMounted(async () => {
    await getProducts()
    tabName.value = products.value[0].name
    await checkExistOrder()
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