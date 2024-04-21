<template>
    <div>
        <div class="cart-bar">
            <div class="cart">
                <div class="cart-left">
                    <el-badge :value="orderList.length" class="item" @click="detailBoxSwitch = !detailBoxSwitch">
                        <el-icon :size="30">
                            <ShoppingTrolley />
                        </el-icon>
                    </el-badge>
                </div>
                <div class="cart-right" @click='jumpToOrderComfire'
                    :style="{ backgroundColor: orderList.length ? '' : '#ccc' }">落单</div>
            </div>
        </div>
        <div class="detail-box" v-show="detailBoxSwitch">
            <div class="order-list">
                <div v-for="(product, index) of orderList" :key="index" class="order-item">
                    <div class="product-name" style="flex: 1;">{{ product.productName }}</div>
                    <div style="color: #cfcfcf;font-size: 14px;padding-right: 8px;">{{ product.standard }}</div>
                    <div>
                        <el-icon @click="emitOrderDetailChange(product, true)">
                            <CirclePlusFilled />
                        </el-icon>
                        {{ product.orderQuantity }}
                        <el-icon @click="emitOrderDetailChange(product, false)">
                            <RemoveFilled />
                        </el-icon>
                    </div>
                </div>
            </div>
        </div>
        <div class="cart-cover" v-show="detailBoxSwitch" @click="detailBoxSwitch = !detailBoxSwitch"></div>
        <el-drawer v-model="drawerSwitch" direction="ltr" :z-index="120" :withHeader="false" size="100%"
            style="background: linear-gradient(var(--el-color-primary) 0%, #fff 40%);">
            <div class="order-comfirm">
                <div class="arrow-left" @click="drawerSwitch = !drawerSwitch"><el-icon>
                        <ArrowLeftBold />
                    </el-icon>返回</div>
                <el-card>
                    <h1>{{ userInfo.shopName }}</h1>
                    <div>{{ userInfo.name }}</div>
                </el-card>
                <el-card>
                    <div class="order-list" style="height: 60vh;">
                        <div v-for="(product, index) of orderList" :key="index" class="order-item"  
                        :style="product.orderQuantity === null ? 'background-color: var(--el-color-danger-light-7)' : ''">
                            <div class="product-name" style="width: 50%;">{{ product.productName }}</div>
                            <div style="width: 30%;">{{ product.standard }}</div>
                            <div style="width: 20%;text-align: end;">{{ product.orderQuantity }}</div>
                        </div>
                    </div>
                </el-card>
                <el-button round style="justify-self: flex-end;" type="primary" @click="comfireOrder">確定訂單</el-button>
            </div>
        </el-drawer>
    </div>
</template>
<script setup>
import { defineProps, computed, ref, defineEmits } from 'vue';
import { getStorge } from '../utils/auth'
import { createOrder } from '../request/orders'
import { ElMessage, ElMessageBox } from 'element-plus';

const userInfo = computed(() => {
    let user = getStorge('userInfo')
    return user ? JSON.parse(user) : {}
})

const props = defineProps({
    orderMap: Object
})

const emit = defineEmits(['orderDetailChange'])
function emitOrderDetailChange(product, type) {
    let _product = { ...product }
    if (type) {
        _product.orderQuantity++
    } else {
        _product.orderQuantity--
    }
    emit('orderDetailChange', _product)
}
// const orderItems = computed(() => {
//     return Object.keys(props.orderMap).length
// })

const orderList = computed(() => {
    return Object.values(props.orderMap).filter(item => item.orderQuantity !== 0 || item.checked === true || item.prompt === 1)
})

let detailBoxSwitch = ref(false)
let drawerSwitch = ref(false)

function jumpToOrderComfire() {
    if (orderList.value.length > 0) {
        drawerSwitch.value = !drawerSwitch.value
    }
}

function comfireOrder() {
    if (!verifySubmit()) {
        ElMessageBox.confirm(
            '訂單中存在錯誤的產品數量,請檢查',
            'Warning',
            {
                showCancelButton:false,
                confirmButtonText: '確定',
                type: 'warning',
            }
        )
        return
    }
    createOrder({ orderList: orderList.value }).then(res => {
        if (res.success) {
            ElMessage({ type: 'success', message: '提交成功' })
        } else {
            ElMessage({ type: 'error', message: '提交失敗' })
        }
    })
}

function verifySubmit() {
    for (let i = 0; i < orderList.value.length; i++) {
        if (isNaN(orderList.value[i].orderQuantity) || orderList.value[i].orderQuantity === null) {
            return false
        }
    }
    return true
}

</script>
<style>
@media only screen and (min-width: 960px) {
    .detail-box {
        border-radius: 10px;
    }

    .cart-bar {
        width: 40% !important;
    }
}

.cart-bar {
    position: absolute;
    bottom: 10px;
    left: 50%;
    z-index: 100;
    transform: translateX(-50%);
    height: 40px;
    width: 80%;
    box-sizing: border-box;
}

.cart {
    height: 100%;
    width: 100%;
    display: flex;
}

.cart-left {
    padding-left: 15px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    height: 100%;
    width: 70%;
    background-color: aliceblue;
    color: var(--el-color-primary);
    box-shadow: 0 0 5px #ccc;
    border-top-left-radius: 20px;
    border-bottom-left-radius: 20px;
}

.cart-right {
    height: 100%;
    width: 30%;
    background-color: var(--el-color-primary);
    color: #fff;
    box-shadow: 0 0 5px #ccc;
    text-align: center;
    line-height: 40px;
    font-weight: 600;
    font-size: 20px;
    border-top-right-radius: 20px;
    border-bottom-right-radius: 20px;
}

.detail-box {
    padding: 10px;
    box-sizing: border-box;
    position: absolute;
    background-color: #fff;
    bottom: 0;
    width: 100%;
    height: 50vh;
    z-index: 99;
    border-top-right-radius: 10px;
    border-top-left-radius: 10px;
}

.order-list {
    overflow-y: scroll;
    height: calc(100% - 55px);
}

.cart-cover {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100%;
    background-color: rgba(73, 73, 73, 0.3);
    z-index: 50;
}

.order-item {
    padding: 5px 10px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
}

.order-comfirm {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.arrow-left {
    cursor: pointer;
    display: flex;
    align-items: center;
    font-weight: 600;
}
</style>