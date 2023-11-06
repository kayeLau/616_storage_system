<template>
    <div class="expand-list-container">
        <el-icon size="1.5em" style="padding-top: 2px;">
            <Document />
        </el-icon>
        <div class="expand-list">
            <h2>訂單明细</h2>
            <div class="expand-list-body">
                <div class="expand-list-body-row expand-header">
                    <span></span>
                    <span></span>
                    <span>下單數量</span>
                    <span>分配數量</span>
                </div>
                <div class="expand-list-body-row expand-header">
                    <span></span>
                    <span></span>
                    <span>下單數量</span>
                    <span>分配數量</span>
                </div>
                <div v-for="(item, index) of expandTable" :key="index" class="expand-list-body-row">
                    <span>{{ item.productCode }}</span>
                    <span>{{ item.productName }}</span>
                    <span>{{ item.orderQuantity + item.unit }}</span>
                    <el-input v-model="assignQuantitySet[index].assignQuantity" clearable></el-input>
                    <!-- <span>{{ item.assignQuantity + item.unit}}</span> -->
                </div>
            </div>
            <div class="btn-group">
                <el-button type="primary">新增項目</el-button>
                <el-button type="success">提交</el-button>
            </div>
        </div>
    </div>
</template>
<script setup>
import { defineProps , ref} from 'vue';
const props = defineProps({
    expandTable:Array,
})
const expandTable_temp = JSON.parse(JSON.stringify(props.expandTable))
const assignQuantitySet = ref(expandTable_temp)
</script>
<style>
.expand-list-container{
    width: 100%;
    padding: 15px 20px;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    background-color: #e2ecfc;
    border-bottom-left-radius: 15px;
    border-bottom-right-radius: 15px;
}
.expand-list{
    width: 100%;
    padding-left: 8px;
}
.expand-list-body{
    display: grid;
    grid-template-columns: 1fr 1fr;
    padding-top: 8px;
}
.expand-header{
    padding-bottom: 8px;
    font-weight: bold;
}
.expand-list-body-row{
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    text-align: center;
}
/* .expand-list-body-row:nth-child(2n){
    border-left: #000 solid 2px;
} */
</style>