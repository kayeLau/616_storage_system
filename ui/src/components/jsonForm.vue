<template>
    <div>
        <el-form label-width="100px">
            <el-form-item v-for="(item, index) of formColumns" :key="index" :label="item.label">
                <el-input v-if='item.type === "input"' v-model="_params[item.prop]" clearable :disabled="item.disabled"/>
                <el-select v-if='item.type === "select"' v-model="_params[item.prop]" clearable :disabled="item.disabled">
                    <el-option v-for="opt in item.options" :key="opt.value" :label="opt.label" :value="opt.value" />
                </el-select>
                <el-date-picker v-if='item.type === "datePicker"' v-model="_params[item.prop]" type="daterange"
                    range-separator="至" start-placeholder="Start date" end-placeholder="End date" clearable />
            </el-form-item>
        </el-form>
        <div class="btn-group">
            <el-button type="success" plain icon="Select" round @click="submitJsonForm">確定</el-button>
        </div>
    </div>
</template>
<script setup>
import { defineProps , ref , defineEmits , watch } from 'vue';
import { ElMessage  } from 'element-plus'
const props = defineProps({
    comfireCallBack:Function,
    formModel: Object,
    formColumns: Array
})

const emit = defineEmits(['sumbitSuccess'])

let _params = ref(props.formModel)
watch(() => props.formModel,(value)=>{
    console.log(value)
    _params.value = value
})

function submitJsonForm(){
    props.comfireCallBack(_params.value).then(res => {
        if(res.success){
            emit('sumbitSuccess')
            ElMessage ({ type: 'success', message: '操作成功：資料已存入數據庫' })
        }else{
            ElMessage ({ type: 'error', message: '操作失败：' + res.msg })
        }
    }).catch(err => {
        console.error(err)
    })
}
</script>
<style>
.el-select{
    width: 100%;
}
</style>