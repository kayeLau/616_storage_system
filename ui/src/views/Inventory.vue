<template>
    <Ktable ref='KtableRef' :isIndex="false" :columns="columns" :operations="operations" :params="params"
        :getList="getInventory" :searchFormColumns="searchFormColumns" :customBtn="[]"></Ktable>
</template>
<script setup>
import { readInventory } from '../request/orders';
import Ktable from '../components/table.vue';

const columns = [
    { props: 'state', label: '訂單狀態', width: 100 },
    { props: 'shopName', label: '落單門店', width: 180 },
    { props: 'department', label: '落單部門', width: 100 },
    { props: 'orderUserName', label: '落單人', width: 130 },
    { props: 'orderIndex', label: '落單次數', formatter: (row, column) => row[column.property] + 1 },
    { props: 'createDate', label: '落單時間', width: 180 },
]

const operations = null

const params = {
    size: 20,
    page: 1,
}

async function getInventory() {
    await readInventory(params).then(res => {
        if (res.success) {
            return res.inventory
        }
    })
}



</script>