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
                        <span>分配狀態</span>
                        <span></span>
                        <span></span>
                        <span>下單數量</span>
                        <span>分配數量</span>
                        <span>下單模式</span>
                        <span>修改時間</span>
                        <span>備注</span>
                    </div>
                </div>
                <!-- 訂單明细(前線) -->
                <div v-for="(item, index) of orderItems" :key="index" class="expand-list-body-box">
                    <div class="expand-list-body-row">
                        <span v-html="orderStateFormatter(item.status)"></span>
                        <span>{{ item.productCode }}</span>
                        <span>{{ item.productName || '-' }}</span>
                        <span>{{ item.orderQuantity + item.unit }}</span>
                        <span>{{ item.assignQuantity === null ? '-' : item.assignQuantity + item.unit }}</span>
                        <span>{{ orderMode[item.orderMode] }}</span>
                        <span>{{ item.updateDate }}</span>
                        <span>{{ item.remark }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { defineProps, ref  } from 'vue';
import { orderMode , orderStateDict } from '../request/dict'
const props = defineProps({
    expandTable: Array
})
const orderStateFormatter = (cell) => {
  let color = cell === 0 ? 'var(--el-color-danger)' : 'var(--el-color-success)'
  return `<span style='color:${color}'>${orderStateDict[cell]}<span>`
}
const expandTable_temp = JSON.parse(JSON.stringify(props.expandTable))
const orderItems = ref(expandTable_temp)

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
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
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