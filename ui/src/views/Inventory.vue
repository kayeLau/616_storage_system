<template>
    <el-card class="Ktable-container">
        <Ktable ref='KtableRef' :isIndex="false" :columns="columns" :operations="null" :params="params"
            :getList="getInventory" :searchFormColumns="searchFormColumns" :customBtn="[]"></Ktable>
    </el-card>
</template>
<script setup>
import { readInventory } from '../request/inventory';
import Ktable from '../components/table.vue';
import { ref } from 'vue';
import { classifyDict, freezersNumDict, dictToOptions } from '../request/dict';

let columns = ref([])

const params = {
    size: 20,
    page: 1,
}

const searchFormColumns = ref([
    // {
    //     type: 'datePicker',
    //     prop: 'updateDate',
    //     label: '盤點月份:',
    // },
    {
        type: 'select',
        prop: 'freezersNum',
        label: '雪房號碼:',
        options: dictToOptions(freezersNumDict),
    },
    {
        type: 'select',
        prop: 'classify',
        label: '分類:',
        options: dictToOptions(classifyDict),
    }
])

async function getInventory() {
    return await readInventory(params).then(res => {
        if (res.success) {
            const _columns = [{
                props: 'shopName',
                label: '店舖名稱',
                width: 130,
            }]
            res.product.forEach(item => {
                _columns.push({
                    props: item.productCode,
                    label: item.productName,
                    width: item.productName.length * 28,
                    formatter:(row, column)=>{
                        let cell = row[column.property]
                        return cell ? cell : 0
                    }
                })
            })
            columns.value = _columns
            return { data: res.inventory, success: true }
        }
    })
}



</script>