<template>
    <div class="app-order-detail">
        <div @click="goBack" class="go-back">
            <el-icon ><ArrowLeftBold /></el-icon>
            返回
        </div>
        <el-scrollbar>
            <el-collapse v-model="activeName" accordion @change="fetchOrderDetail" style="overflow: hidden;">
                <el-collapse-item class="detail-collapse" v-for="(item, index) of data" :key="index" :name="item.id">
                    <template #title>
                        <div class="detail-title" :style="detailTitleColor(item.state)">
                            <el-icon class="header-icon">
                                <info-filled />
                            </el-icon>
                            <span>第{{item.orderIndex}}次落单 {{ item.updateDate }}</span>
                        </div>
                    </template>
                    <div v-for="(item, index) of item.children" :key="'s' + index" class="detail-container">
                        <h3>{{ item.productCode }} - {{ item.productName }}</h3>
                        <div style="text-align: right;">{{ item.assignQuantity }} / {{ item.orderQuantity }} {{ item.unit }}</div>
                        <div>{{ item.standard }}</div>
                    </div>
                </el-collapse-item>
            </el-collapse>
        </el-scrollbar>
    </div>
</template>
<script setup>
import { readHistoryOrder, readOrderDetail } from '../request/orders';
import { ref } from 'vue';
import { useRoute , useRouter } from 'vue-router'
const router = useRouter()
const route = useRoute()

const data = ref([])
const activeName = ref('')

// readOrder
async function fatchOrder() {
    const params = {
        size: 99,
        page: 1,
        orderCode: route.params.orderCode
    }
    await readHistoryOrder(params).then(res => {
        if (res.success) {
            data.value = res.data
        }
    })
}
fatchOrder()

async function fetchOrderDetail() {
    if(!activeName.value)return;
    await readOrderDetail({ orderId: activeName.value }).then(res => {
        if (res.success) {
            const activeItem = data.value.find(item => item.id === activeName.value)
            if (activeItem) {
                activeItem.children = res.data
            }
        }
    })
}

function detailTitleColor(state){
    let color = state === 0 ? 'var(--el-color-danger)' : 'var(--el-color-success)'
    return { color: color }
}

function goBack(){
    router.push({ path: '/appOrder' })
}

</script>
<style>
.app-order-detail{
    overflow: hidden;
}

.detail-title{
    padding-left: 10px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap:5px;
    font-size: 20px;
    font-weight: 600;
}

.detail-collapse {
    padding: 10px;
}

.detail-container {
    padding: 10px 15px;
    display: grid;
    grid-template-columns: 2fr 1fr;
}
.go-back{
    display: flex;
    align-items: center;
    padding-left: 10px;
    font-weight: 600;
}
</style>