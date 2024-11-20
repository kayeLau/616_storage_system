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
                <div class="cart-right" @click='jumpToOrderComfire' :style="cartBtnColor">{{ comfireWord }}</div>
            </div>
        </div>
        <Transition name="side-in">
            <div class="detail-box" v-show="detailBoxSwitch">
                <div class="order-list">
                    <div v-for="(product, index) of orderList" :key="index" class="order-item">
                        <div class="product-name" style="flex: 1;">{{ product.productName }}</div>
                        <div style="color: #cfcfcf;font-size: 14px;padding-right: 8px;">{{ product.standard }}</div>
                        <div>
                            <!-- <el-icon @click="emitOrderDetailChange(product, true)">
                            <CirclePlusFilled />
                        </el-icon> -->
                            {{ product.orderQuantity }}
                            <!-- <el-icon @click="emitOrderDetailChange(product, false)">
                            <RemoveFilled />
                        </el-icon> -->
                        </div>
                    </div>
                </div>
            </div>
        </Transition>
        <div class="cart-cover" v-show="detailBoxSwitch" @click="detailBoxSwitch = !detailBoxSwitch"></div>
        <el-drawer v-model="drawerSwitch" direction="ltr" :z-index="120" :withHeader="false" size="100%"
            :style="comfireBgColor">
            <div class=" order-comfirm">
                <div class="arrow-left" @click="drawerSwitch = !drawerSwitch"><el-icon>
                        <ArrowLeftBold />
                    </el-icon>返回</div>
                <el-card>
                    <h1>{{ userInfo.shopName }}</h1>
                    <div>{{ userInfo.name }}</div>
                </el-card>

                <div class="order-list" style="height: 60vh;">
                    <div v-for="(product, index) of orderList" :key="index" class="order-item"
                        :style="product.orderQuantity === null ? 'background-color: var(--el-color-danger-light-7)' : ''">
                        <div style="width: 80%;">
                            <div class="product-name">{{ product.productCode }} - {{ product.productName }}</div>
                            <div class="product-standard">{{ product.standard }}</div>
                        </div>
                        <div style="width: 20%;text-align: end;">{{ product.orderQuantity }}{{ product.unit }}</div>
                    </div>
                </div>

                <el-button round type="primary" @click="comfireHandle" class="comfire-btn" :disabled="submitDisabled"
                    :style="cartBtnColor">確定{{ comfireWord }}</el-button>
            </div>
        </el-drawer>
    </div>
</template>
<script setup>
import { defineProps, computed, ref , defineEmits } from 'vue';
import { getStorge } from '../utils/auth';
import { createOrder } from '../request/orders';
import { createInventory } from '../request/inventory';
import { ElMessage, ElMessageBox } from 'element-plus';

const userInfo = computed(() => {
    let user = getStorge('userInfo')
    return user ? JSON.parse(user) : {}
})

const props = defineProps({
    orderMap: Object,
    flag: String
})

const emits = defineEmits(['sumbit'])

const orderList = computed(() => {
    return Object.values(props.orderMap)
        .filter(item => item.orderQuantity !== 0 || item.checked === true || item.prompt === 1)
        .sort((a,b) => a.classify - b.classify )
})

const comfireWord = computed(() => {
    return props.flag === 'order' ? '落單' : '盤點'
})

const comfireBgColor = computed(() => {
    return {
        background: props.flag === 'order' ? 'linear-gradient(var(--el-color-primary) 0%, #f2f6fc 50%)'
            : 'linear-gradient(var(--el-color-warning) 0%, #f2f6fc 50%)'
    }
})

const cartBtnColor = computed(() => {
    return {
        backgroundColor: !orderList.value.length ? '#ccc' :
            props.flag === 'order' ? 'var(--el-color-primary)' :
                props.flag === 'inventory' ? 'var(--el-color-warning)' :
                    ''
    }
})

let detailBoxSwitch = ref(false)
let drawerSwitch = ref(false)

function jumpToOrderComfire() {
    if (orderList.value.length > 0) {
        drawerSwitch.value = !drawerSwitch.value
    }
}

let submitDisabled = ref(false)
async function comfireHandle() {
    submitDisabled.value = true
    if (props.flag === 'order') {
        await comfireOrder()
    } else if (props.flag === 'inventory') {
        await comfireInventory()
    }
    submitDisabled.value = false
    emits('sumbit')
}


async function comfireOrder() {
    if (!verifySubmit()) {
        ElMessageBox.confirm(
            '訂單中存在錯誤的產品數量,請檢查',
            'Warning',
            {
                showCancelButton: false,
                confirmButtonText: '確定',
                type: 'warning',
            }
        )
        return
    }
    const _orderList = orderList.value.map(item => {
        return {
            orderId:item.orderId,
            productId:item.productId,
            orderQuantity:item.orderQuantity,
            assignQuantity:item.assignQuantity,
            orderMode:item.orderMode,
            remark:item.remark,
        }
    })
    await createOrder({ orderList:_orderList }).then(res => {
        if (res.success) {
            ElMessage({ type: 'success', message: '提交成功' })
            drawerSwitch.value = false
        } else {
            ElMessage({ type: 'error', message: '提交失敗' })
        }
    })
}

async function comfireInventory() {
    const inventoryList = orderList.value.map(item => {
        return {
            id:item.id,
            productId: item.productId,
            orderQuantity: item.orderQuantity,
        }
    })
    await createInventory({ inventoryList }).then(res => {
        if (res.success) {
            ElMessage({ type: 'success', message: '提交成功' })
            drawerSwitch.value = false
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
.cart-bar {
    height: 45px;
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
    border-left: #ccc 1px solid;
    color: var(--el-color-primary);
    box-shadow: 0 0 5px #ccc;
}

.cart-right {
    height: 100%;
    width: 30%;
    color: #fff;
    box-shadow: 0 0 5px #ccc;
    text-align: center;
    line-height: 45px;
    font-weight: 600;
    font-size: 20px;
}

.detail-box {
    overflow: scroll;
    padding: 10px;
    box-sizing: border-box;
    position: absolute;
    background-color: #fff;
    bottom: 0;
    width: 100%;
    height: 70vh;
    z-index: 99;
    border-top-right-radius: 10px;
    border-top-left-radius: 10px;
}

.order-list {
    flex: 1;
    background-color: #fff;
    border-radius: 15px;
    border: 3px solid var(--el-card-border-color);
    overflow-y: scroll;
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
    padding: 10px 10px;
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

.comfire-btn {
    border: none;
}
</style>