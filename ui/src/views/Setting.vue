<template>
    <div>
        <jsonForm :formModel='editFormModels' :formColumns="editFormColumns" labelWidth="70%" @sumbit="sumbit"></jsonForm>
    </div>
</template>
<script setup>
import { getSettingList , updateSetting } from '../request/setting'
import jsonForm from '../components/jsonForm.vue';
import { ref , onMounted } from 'vue';
import { ElMessage } from 'element-plus'
const editFormModels = ref({})
const editFormColumns = ([
  {
    type: 'timeSelect',
    prop: 'lastOrder',
    label: '截單時間:',
    format:'HH',
  },
])

function fatchList(){
    getSettingList({size:999,page:1}).then(res => {
        if(res.success){
            res.resource.forEach(item => {
                editFormModels.value[item.name] =item.value
            })
        }
    })
}

function sumbit(params){
    let data = {
        name:'lastOrder',
        value:params.lastOrder
    }
    updateSetting(data).then(res => {
        if (res.success) {
                ElMessage({ type: 'success', message: '操作成功：資料已存入數據庫' })
                fatchList()
            } else {
                ElMessage({ type: 'error', message: '操作失败：' + res.msg })
            }
    })
}

onMounted(() =>{
    fatchList()
})
</script>