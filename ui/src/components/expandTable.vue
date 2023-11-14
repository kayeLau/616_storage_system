<template>
    <div class="expand-list-container">
        <el-icon size="1.5em" style="padding-top: 2px;">
            <Document />
        </el-icon>
        <div class="expand-list">
            <h2>訂單明细</h2>
            <div class="expand-list-body">
                <div class="expand-header">
                    <div class="expand-list-body-row">
                        <span></span>
                        <span></span>
                        <span>下單數量</span>
                        <span>分配數量</span>
                        <span>下單模式</span>
                        <span>修改時間</span>
                    </div>
                </div>
                <!-- 訂單明细(前線) -->
                <div v-for="(item, index) of orderItems" :key="index" class="expand-list-body-box">
                    <div class="expand-list-body-row">
                        <span>{{ item.productCode }}</span>
                        <span>{{ item.productName || '-' }}</span>
                        <span>{{ item.orderQuantity + item.unit }}</span>
                        <div>
                            <el-input v-if="editMode" v-model="orderItems[index].assignQuantity" clearable
                                class="input-short"></el-input>
                            <span v-else>{{ item.assignQuantity }}</span>
                            <span>{{ item.unit }}</span>
                        </div>
                        <span>{{ orderMode[item.orderMode] }}</span>
                        <span>{{ item.updateDate }}</span>
                    </div>
                </div>
            </div>
            <!-- <div class="btn-group">
                <el-button :type="editMode ? 'danger' : 'primary'" plain @click="editMode = !editMode">{{ editMode ?
                     '取消編輯' :
                     '編輯項目' }}</el-button>
                <el-button v-if='editMode' type="success" plain>提交</el-button>
            </div> -->
        </div>
    </div>
    <!-- 訂單明细(追加) 
        <div class="expand-list-container">
        <el-icon size="1.5em" style="padding-top: 2px;">
            <Document />
        </el-icon>
        <div class="expand-list">
            <h2>追加訂單</h2>
            <div class="expand-list-body">
                <div v-for="(item, index) of newOrderItems" :key="index" class="expand-list-body-box">
                    <div class="expand-list-body-row">
                        <el-select v-model="newOrderItems[index].productCode" filterable class="input-short"
                            @change="setOrderItem(index)">
                            <el-option v-for="item in productOptions" :key="item.value" :label="item.label"
                                :value="item.value" />
                        </el-select>
                        <span>{{ item.productName || '-' }}</span>
                        <div>
                            <el-input v-model="newOrderItems[index].orderQuantity" clearable class="input-short"></el-input>
                            <span>{{ item.unit }}</span>
                        </div>
                        <div>
                            <el-input v-model="newOrderItems[index].assignQuantity" clearable
                                class="input-short"></el-input>
                            <span>{{ item.unit }}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="btn-group">
                <el-button type="success" @click="addOrderItem" plain>新增項目</el-button>
                <el-button type="success" plain @click="submitAdditionOrderItem">提交</el-button>
            </div>
        </div>
    </div> -->
</template>
<script setup>
// import { createAdditionOrderItem } from '../request/orders';
// import { ElMessage  } from 'element-plus'
import { defineProps, ref  } from 'vue';
import { orderMode } from '../request/dict'
const props = defineProps({
    expandTable: Array,
    products: Array
})

let editMode = ref(false)
const expandTable_temp = JSON.parse(JSON.stringify(props.expandTable))
const orderItems = ref(expandTable_temp)
// const newOrderItems = ref([])
// const productOptions = computed(() => {
//     return props.products.map(item => {
//         return {
//             value: item.productCode,
//             label: item.productCode
//         }
//     })
// })

// function addOrderItem() {
//     let orderItemsLen = newOrderItems.value.length
//     if(orderItemsLen && !newOrderItems.value[orderItemsLen - 1].productCode){
//         ElMessage ({ type: 'warning', message: '請先填寫內容再新增' })
//         return
//     }
//     let orderId = expandTable_temp[0].orderId
//     let newItem = { orderId, productCode: "", productName: "", orderQuantity: '', assignQuantity: '', unit: "", updateDate: '' , orderMode:1}
//     newOrderItems.value.push(newItem)
// }
// function setOrderItem(index) {
//     let productCode = newOrderItems.value[index].productCode
//     let product = props.products.find(item => item.productCode === productCode)
//     newOrderItems.value[index].productName = product.productName
//     newOrderItems.value[index].unit = product.unit
// }

// const emit = defineEmits(['refresh'])
// function submitAdditionOrderItem(){
//     let orderList = newOrderItems.value.filter(item => item.productCode)
//     if(!orderList.length){
//         ElMessage ({ type: 'warning', message: '新增項目為空' })
//         return
//     }
//     let data = {
//         orderList
//     }
//     createAdditionOrderItem(data).then(res => {
//         if(res.success){
//             emit("refresh")
//             ElMessage ({ type: 'success', message: '提交成功' })
//         }else{
//             ElMessage ({ type: 'error', message: '提交失敗' })
//         }
//     })
// }

</script>
<style>
.expand-list-container {
    width: 100%;
    padding: 15px 20px;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    background-color: #e2ecfc;
    border-bottom-left-radius: 15px;
    border-bottom-right-radius: 15px;
}

.expand-list-container:nth-child(2) {
    border-bottom-left-radius: 15px;
    border-bottom-right-radius: 15px;
}

.expand-list {
    width: 100%;
    padding-left: 8px;
}

.expand-list-body {
    display: grid;
    grid-template-columns: 1fr;
    padding-top: 8px;
}

.expand-header {
    padding-bottom: 8px;
    font-weight: bold;
}

.expand-list-body-row {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
    text-align: center;
    justify-items: center;
    align-items: center;
}

/* .expand-list-body-box:nth-child(2n - 1) {
    border-right: 2px #4e4e4e solid;
} */

.input {
    width: 60%;
}

.input-short {
    padding-right: 2px;
    width: 75%;
}

input {
    text-align: center;
}

.list-divide {
    padding: 20px 0;
    width: 100%;
    height: 1px;
    background-color: black;
}
</style>