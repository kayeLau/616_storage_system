<template>
    <div>
        <el-form label-width="100px">
            <el-form-item v-for="(item, index) of formColumns" :key="index" :label="item.label">
                <div v-if='item.type === "input"' class="input-box">
                    <el-input v-model="_params[item.prop]" clearable :disabled="item.disabled"/>
                    <span v-show="item.unit">{{ item.unit }}</span>
                </div>
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
import { defineProps , ref , defineEmits , watch , computed } from 'vue';
import { ElMessage  } from 'element-plus'
const props = defineProps({
    comfireCallBack:Function,
    formModel: Object,
    formColumns: Array,
})

const emit = defineEmits(['sumbitSuccess','sumbit'])

let _params = ref(props.formModel)
watch(() => props.formModel,(value)=>{
    console.log(value)
    _params.value = value
},)

function submitJsonForm(){
    if(!props.comfireCallBack){
        emit('sumbit',_params.value)
    }else{
        let data = additionData(_params.value)
        props.comfireCallBack(data).then(res => {
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
}

const shopNameList = computed(() => {
    return props.formColumns.find(item => item.prop === 'shopId') || []
})
function additionData(data){
    Object.keys(data).forEach(key => {
        if(key === 'shopId'){
            let target = shopNameList.value.options.find(item => item.value  === data.shopId)
            data.shopName = target.label
        }
    })
    return data
}

</script>
<style>
.el-select{
    width: 100%;
}
.input-box{
    width: 100%;
    display: flex;
    align-items: center;
}
.input-box > span{
    padding: 0 5px;
}
</style>