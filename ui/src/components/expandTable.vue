<template>
    <div class="expand-list-container">
        <el-icon size="1.5em" style="padding-top: 2px;">
            <Document />
        </el-icon>
        <div class="expand-list">
            <h2>訂單明细</h2>
            <div class="expand-list-body">
                <div class="expand-header" v-for="index in 2" :key="index">
                    <div class="expand-list-body-row">
                        <span></span>
                        <span></span>
                        <span>下單數量</span>
                        <span>分配數量</span>
                    </div>
                </div>
                <div v-for="(item, index) of assignQuantitySet" :key="index">
                    <div class="expand-list-body-row" v-if="item.type === 'createItem'">
                        <el-select v-model="assignQuantitySet[index].productCode" filterable class="input" @change="setOrderItem(index)">
                            <el-option v-for="item in productOptions" :key="item.value" :label="item.label" :value="item.value" />
                        </el-select>
                        <span>{{ item.productName }}</span>
                        <div>
                            <el-input v-model="assignQuantitySet[index].orderQuantity" clearable class="input-short"></el-input>
                            <span>{{ item.unit }}</span>
                        </div>
                        <div>
                            <el-input v-model="assignQuantitySet[index].assignQuantity" clearable class="input-short"></el-input>
                            <span>{{ item.unit }}</span>
                        </div>
                    </div>
                    <div class="expand-list-body-row" v-else>
                        <span>{{ item.productCode }}</span>
                        <span>{{ item.productName }}</span>
                        <span>{{ item.orderQuantity + item.unit }}</span>
                        <div>
                            <el-input v-model="assignQuantitySet[index].assignQuantity" clearable class="input-short"></el-input>
                            <span>{{ item.unit }}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="btn-group">
                <el-button type="primary" @click="addOrderItem">新增項目</el-button>
                <el-button type="success">提交</el-button>
            </div>
        </div>
    </div>
</template>
<script setup>
import { defineProps, ref, computed } from 'vue';
const props = defineProps({
    expandTable: Array,
    products:Array
})

const expandTable_temp = JSON.parse(JSON.stringify(props.expandTable))
const assignQuantitySet = ref(expandTable_temp)
const productOptions = computed(()=>{
    return props.products.map(item => {
        return {
            value:item.productCode,
            label:item.productCode
        }
    })
})

function addOrderItem() {
    let orderId = expandTable_temp[0].orderId
    let newItem = {type:'createItem',orderId,productCode:"",productName:"",orderQuantity:0,assignQuantity:0,unit:"",updateDate:''}
    assignQuantitySet.value.push(newItem)
}
function setOrderItem(index){
    let productCode = assignQuantitySet.value[index].productCode
    let product = props.products.find(item => item.productCode === productCode)
    assignQuantitySet.value[index].productName = product.productName
    assignQuantitySet.value[index].unit = product.unit
}

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

.expand-list {
    width: 100%;
    padding-left: 8px;
}

.expand-list-body {
    display: grid;
    grid-template-columns: 1fr 1fr;
    padding-top: 8px;
}

.expand-header {
    padding-bottom: 8px;
    font-weight: bold;
}

.expand-list-body-row {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    text-align: center;
    justify-items: center;
    align-items: center;
}
.input{
    width: 60%;
}
.input-short{
    padding-right: 2px;
    width: 55%;
}
input {
    text-align: center;
}
</style>