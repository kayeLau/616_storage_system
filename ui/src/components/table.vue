<template>
    <div style="height: 100%;">
        <el-form :inline="true" :model="_params" class="form-inline">
            <el-form-item v-for='(item, index) of searchFormColumns' :label="item.label" :key="index">
                <el-input v-if='item.type === "input"' v-model="_params[item.prop]" clearable />
                <el-select v-if='item.type === "select"' v-model="_params[item.prop]" clearable>
                    <el-option v-for="opt in item.options" :key="opt.value" :label="opt.label" :value="opt.value" />
                </el-select>
                <el-date-picker v-if='item.type === "datePicker"' v-model="_params[item.prop]" type="daterange"
                    range-separator="至" start-placeholder="Start date" end-placeholder="End date" clearable />
            </el-form-item>
        </el-form>
        <!-- tabel -->
        <el-table :data="data" :style="tableStyle">
            <el-table-column type="index" width="50" />
            <el-table-column v-for="(item, index) of columns" :prop="item.props" :label="item.label" :width="item.width"
                :key="index" :formatter="item.formatter"/>
            <el-table-column fixed="right" label="Operations" :width="operations.width">
                <template #default="scope">
                    <el-button v-for="(item, index) of operations.children" :type="item.type" :key="index" @click="item.onClick(scope.$index, scope.row)">{{ item.name }}</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- pagination -->
        <div class="pagination">
            <el-button v-for="(item,index) of customBtn" :type="item.type" :key="index" @click="item.onClick" :icon="item.icon">{{ item.label }}</el-button>
            <el-pagination background layout="total, prev, pager, next" :total="_params.total" v-model:current-page="_params.page" :page-size="_params.size" 
            @size-change="fatchList" @current-change="fatchList"/>
        </div>
    </div>
</template>
<script setup>
import { defineProps, reactive, onMounted, ref } from 'vue';

const props = defineProps({
    tableStyle: {
        type: String,
        default: () => {
            return {
                width: "100%",
                height: "calc(100% - 132px)",
            }
        }
    },
    searchFormColumns: Array,
    columns: Array,
    operations: Object,
    params: Object,
    getList: Function,
    customBtn:Array
})

let data = ref([])
let _params = reactive(props.params)

function fatchList() {
    props.getList(props.params).then(res => {
        console.log(res)
        if (res.success) {
            data.value = res.resource
            _params.total = res.total
        } else {
            data.value = []
        }
    })
}

onMounted(() => {
    fatchList()
})
</script>
<style>
.form-inline{
    padding-left: 8px;
}
.el-form-item__label{
    font-weight: bold;
}
.pagination{
    display: flex;
    justify-content: space-between;
    padding-top: 10px;
}
</style>