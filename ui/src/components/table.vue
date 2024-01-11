<template>
    <div style="height: 100%;">
        <el-form :inline="true" :model="_params" class="form-inline" v-if="searchFormColumns.length">
            <el-form-item v-for='(item, index) of _searchFormColumns' :label="item.label" :key="index">
                <el-input v-if='item.type === "input"' v-model="_params[item.prop]" clearable style="width: 150px;" />
                <el-select v-if='item.type === "select"' v-model="_params[item.prop]" clearable style="width: 150px;"
                    placeholder="請選擇">
                    <el-option v-for="opt in item.options" :key="opt.value" :label="opt.label" :value="opt.value" />
                </el-select>
                <el-date-picker v-if='item.type === "datePicker"' v-model="_params[item.prop]" type="daterange"
                    style="width: 250px;" range-separator="至" start-placeholder="開始時間" end-placeholder="結束時間" clearable
                    value-format="YYYY-MM-DD HH:mm:ss"
                    :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 2, 1, 23, 59, 59)]" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" size="small" @click="fatchList">查詢</el-button>
            </el-form-item>
        </el-form>
        <!-- tabel -->
        <el-table :data="data" class="table" highlight-current-row header-cell-class-name="table-header"
            :row-class-name="tableRowClassName" @selection-change="handleSelectionChange">
            <el-table-column v-if="isExpand" type="expand">
                <template v-slot="props">
                    <expandTable :expandTable="props.row.children" :products="products"></expandTable>
                </template>
            </el-table-column>
            <el-table-column v-if='isSelection' type="selection" width="50" />
            <el-table-column v-if='isIndex' type="index" width="50" />
            <el-table-column v-for="(item, index) of columns" :prop="item.props" :label="item.label" :width="item.width"
                :key="index" :formatter="item.formatter">
                <template #default="scope">
                    <template v-if="!item.render">
                        <template v-if="item.formatter">
                            <span v-html="item.formatter(scope.row, scope.column)"></span>
                        </template>
                        <template v-else>
                            <span>{{ scope.row[scope.column.property] }}</span>
                        </template>
                    </template>
                    <template v-else>
                        <component :is="item.render(h,scope.row, scope.column)" />
                        <!-- <expand-dom :column="column" :row="scope.row" :render="column.render" :index="index"></expand-dom> -->
                    </template>
                </template>
            </el-table-column>
            <el-table-column v-if='operations && _operationsChildren.length' fixed="right" label="操作"
                :width="operations.width">
                <template #default="scope">
                    <el-button v-for="(item, index) of _operationsChildren" :type="item.type" :key="index" :icon="item.icon"
                        plain @click="item.onClick(scope.$index, scope.row)"
                        :disabled="item.disabled ? item.disabled(scope.row) : false">{{ item.name }}</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- pagination -->
        <div class="pagination">
            <div class="pagination-btn-group">
                <template v-for="(item, index) of _customBtn" :key="index">
                    <el-button v-if="item.type === 'button'" :type="item.btnType" @click="item.onClick()" :icon="item.icon" plain>{{ item.label }}</el-button>
                    <el-progress v-if="item.type === 'progress'" :style='{width:item.width}' :stroke-width="24" :percentage="item.percentage" 
                     status="success" :duration="10">
                        <div text class="progress-label" @click="item.onClick()">{{ item.label }}</div>
                    </el-progress>
                    <el-popover v-if="item.type === 'popover'" placement="top" :width="300" trigger="click">
                      <template #reference>
                        <el-button :type="item.btnType" :icon="item.icon" plain>{{ item.label }}</el-button>
                      </template>
                        <component :is="item.render(h)" />
                    </el-popover>
                </template>
            </div>
            <el-pagination background layout="total, prev, pager, next" :total="parseInt(_params.total)"
                v-model:current-page="_params.page" :page-size="_params.size" @size-change="fatchList"
                @current-change="fatchList" />
        </div>
    </div>
</template>
<script setup>
import { defineProps, defineExpose, reactive, onMounted, ref, defineEmits, h } from 'vue';
import { ElMessage } from 'element-plus'
import expandTable from './expandTable.vue'

const emit = defineEmits(['selectionChange'])

const props = defineProps({
    isExpand: {
        type: Boolean,
        default: false
    },
    isSelection: {
        type: Boolean,
        default: false
    },
    isIndex: {
        type: Boolean,
        default: true
    },
    searchFormColumns: Array,
    columns: Array,
    operations: Object,
    params: Object,
    getList: Function,
    customBtn: Array,
    products: Array,
    tableRowClassName: Function
})

let data = ref([])
let _params = reactive(props.params)
let _operationsChildren = props.operations.children.filter(item => !item.hide)
let _searchFormColumns = props.searchFormColumns.filter(item => !item.hide)
let _customBtn = props.customBtn.filter(item => !item.hide)


async function fatchList() {
    let result = {}
    if (typeof props.getList === 'function') {
        await props.getList(props.params).then(res => {
            if (res.success) {
                data.value = res.resource
                _params.total = res.total
                result = res
            } else {
                data.value = []
                ElMessage({ type: 'error', message: '數據查詢失败' })
            }
        })
    }
    return result
}

function handleSelectionChange(value) {
    emit('selectionChange', value)
}

defineExpose({ fatchList })

onMounted(() => {
    fatchList()
})
</script>
<style>
.table {
    width: 100%;
    height: calc(100% - 90px)
}

.table-header {
    --el-table-header-bg-color: var(--el-color-primary-light-3);
    color: #fff;
}

.form-inline {
    padding-left: 8px;
}

.el-form-item__label {
    font-weight: bold;
}

.pagination {
    display: flex;
    justify-content: space-between;
    padding-top: 10px;
}

.pagination-btn-group {
    display: flex;
    align-items: center;
    gap: 20px;
}
.progress-label{
    font-size: 14px;
    color: #000;
    padding-left: 5px;
}

.el-form--inline .el-form-item {
    margin-right: 20px;
}

.el-table .danger-row {
    --el-table-tr-bg-color: var(--el-color-danger-light-9);
}

.el-table .warning-row {
    --el-table-tr-bg-color: var(--el-color-warning-light-9);
}

.el-table .success-row {
    --el-table-tr-bg-color: var(--el-color-success-light-9);
}
</style>