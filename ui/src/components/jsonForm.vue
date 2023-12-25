<template>
    <div>
        <el-form ref='formRef' :label-width="labelWidth" :model="_params" label-position="left" :rules="rules">
            <el-form-item v-for="(item, index) of _columns" :key="index" :label="item.label" :prop="item.prop">
                <div v-if='item.type === "input"' class="input-box">
                    <el-input v-model="_params[item.prop]" clearable :disabled="item.disabled" />
                    <span v-show="item.unit">{{ item.unit }}</span>
                </div>
                <el-select v-if='item.type === "select"' v-model="_params[item.prop]" clearable :disabled="item.disabled"
                    @change="item.change" placeholder="請選擇">
                    <el-option v-for="opt in item.options" :key="opt.value" :label="opt.label" :value="opt.value">
                        <div class="select-options-wicon" v-if="item.icon">
                            <span>{{ opt.label }}</span>
                            <el-popconfirm width="100" confirm-button-text="是" cancel-button-text="否" icon="InfoFilled"
                                icon-color="#626AEF" :title="item.popconfirmTitle" confirm-button-type="text" @confirm="item.deleteSelectOptions(opt.value)">
                                <template #reference>
                                    <el-icon style="color: var(--el-color-danger)" @click.stop="">
                                        <component :is='item.icon'></component>
                                    </el-icon>
                                </template>
                            </el-popconfirm>
                        </div>
                    </el-option>
                    <el-input v-if="item.addItem" v-model="addSelectItem" class="option-input" placeholder="請輸入新增分區" @keydown.enter="addSelectItemFn()">
                        <template #append>
                            <el-button icon="Select" type="success" style="color:var(--el-color-success);padding-top: 5px;" @click="addSelectItemFn()"/>
                        </template>
                    </el-input>
                </el-select>
                <el-date-picker v-if='item.type === "datePicker"' v-model="_params[item.prop]" type="daterange"
                    range-separator="至" start-placeholder="開始日期" end-placeholder="結束日期" clearable />
                <el-time-picker v-if='item.type === "timePicker"' v-model="_params[item.prop]" arrow-control
                    placeholder="請選擇時間" clearable />
                <el-time-select v-if='item.type === "timeSelect"' v-model="_params[item.prop]" start="01:00" step="01:00"
                    end="24:00" placeholder="請選擇時間" clearable />
            </el-form-item>
        </el-form>
        <div class="btn-group">
            <el-button type="success" plain icon="Select" round @click="submitJsonForm">確定</el-button>
        </div>
    </div>
</template>
<script setup>
import { defineProps, ref, defineEmits, watch, computed, defineExpose , unref } from 'vue';
import { ElMessage } from 'element-plus'
const props = defineProps({
    comfireCallBack: Function,
    formModel: Object,
    formColumns: Array,
    rules: Object,
    labelWidth: {
        type: String,
        default: '100px'
    }
})
const formRef = ref(null)
const emit = defineEmits(['sumbitSuccess', 'sumbit','addSelectItem'])

let _params = ref(props.formModel)
watch(() => props.formModel, (value) => {
    clearValidate()
    _params.value = value
})
const _columns = computed(() => {
    return props.formColumns.filter(item => !item.remove)
})

function submitJsonForm() {
    formRef.value.validate((valid) => {
        if (valid) {
            if (!props.comfireCallBack) {
                emit('sumbit', _params.value)
            } else {
                let data = additionData(_params.value)
                props.comfireCallBack(data).then(res => {
                    if (res.success) {
                        emit('sumbitSuccess')
                        ElMessage({ type: 'success', message: '操作成功：資料已存入數據庫' })
                    } else {
                        ElMessage({ type: 'error', message: '操作失败：' + res.msg })
                    }
                }).catch(err => {
                    console.error(err)
                })
            }
        }
    })
}

const shopNameList = computed(() => {
    return props.formColumns.find(item => item.prop === 'shopId')
})
function additionData(data) {
    Object.keys(data).forEach(key => {
        if (key === 'shopId' && shopNameList.value) {
            let target = shopNameList.value.options.find(item => item.value === data.shopId)
            data.shopName = target ? target.label : ''
        }
    })
    return data
}

function clearValidate() {
    formRef.value.clearValidate()
}

function resetFields(keys) {
    if(keys.length){
        keys.forEach(key => {
            _params.value[key] = ''
        })
    }else{
        Object.key(_params.value).forEach(key => {
            _params.value[key] = ''
        })
    }
}

const addSelectItem = ref('')
function addSelectItemFn(){
    emit('addSelectItem',unref(addSelectItem))
    addSelectItem.value = ''
}

defineExpose({ resetFields })

</script>
<style>
.el-select {
    width: 100%;
}

.input-box {
    width: 100%;
    display: flex;
    align-items: center;
}

.input-box>span {
    padding: 0 5px;
}

.select-options-wicon {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.option-input {
    --el-border-radius-base: 0
}
</style>