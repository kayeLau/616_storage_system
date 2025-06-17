<template>
    <div class="setting">
        <h3 class="title">系統設定</h3>
        <el-form ref='formRef' :model="editFormModels" label-position="left">
            <el-form-item label="截單時間" prop="lastOrder">
                <el-time-select v-model="editFormModels.lastOrder" start="01:00" step="01:00" end="23:00" size="small"
                    placeholder="請選擇時間" clearable format="HH" style="width: 150px;" @change="sumbitLastOrder" />
            </el-form-item>
            <el-form-item label="設點必點產品" prop="promptItem" align="right">
                <el-button type="primary" style="width: 150px;" size="small" @click="setDialogShow(0)">編輯</el-button>
            </el-form-item>
        </el-form>
        <div class="title">日志</div>
        <el-form ref='formRef' :model="models" label-position="left">
            <el-form-item label="日志下載" prop="logName">
                <el-select style="width: 150px;" v-model="models.logName" size="small" placeholder="請選擇時間" clearable
                    @change="downloadLogFile">
                    <el-option v-for="opt of logsOption" :key="opt" :label="opt" :value="opt"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <!-- 接口管理 -->
        <h3 class="title">API權限設定</h3>
        <el-scrollbar style="height: 100%;">
            <el-form class="">
                <el-form-item v-for="(item, index) of apis" :key="index" :label="item.name" label-position="left"
                    label-width="180px">
                    <el-checkbox-group v-model="item.access" @change="editApi(item)">
                        <el-checkbox label="廚房" />
                        <el-checkbox label="樓面" />
                        <el-checkbox label="區經" />
                        <el-checkbox label="工埸" />
                    </el-checkbox-group>
                </el-form-item>
            </el-form>
        </el-scrollbar>
    </div>
    <el-dialog v-model="dialogShow" title="分店地址" custom-class='dialog' width="80%" height="60%" @open="openHandler"
        destroy-on-close>
        <component :is='dialogComponent'></component>
    </el-dialog>
</template>
<script setup>
import { updateSetting, readAllSetting } from '../request/setting'
import { readApi, updateApi } from '../request/api'
import { apiAccessDict, exchangeKeyValue } from '../request/dict'
import { readLogsName, downloadLog } from '../request/file';
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus'
import promptItem from '../components/promptItem.vue'

/* 必點 */
let dialogComponent = ref(null)
let dialogShow = ref(false)
let activeComponend = 0

function openHandler() {
    switch (activeComponend) {
        case 0:
            dialogComponent.value = promptItem
            break;
        default:
            break
    }

}

function setDialogShow(num) {
    activeComponend = num
    dialogShow.value = !dialogShow.value
}

/* API管理 */
let apis = ref([])
function fetchApi() {
    readApi().then(res => {
        if (res.success) {
            apis.value = res.data.map(item => {
                item.access = item.access === null || item.access === '' ? [] : item.access.split(',').map(item => apiAccessDict[item]);
                return item
            })
            console.log(apis.value)
        }
    })
}

function editApi(item) {
    const dict = exchangeKeyValue(apiAccessDict)
    const access = item.access.map(item => dict[item]).join(',')
    const data = {
        id: item.id,
        access: access
    }
    updateApi(data).then(res => {
        if (res.success) {
            ElMessage({ type: 'success', message: '操作成功：資料已存入數據庫' })
            fetchApi()
        } else {
            ElMessage({ type: 'error', message: '操作失败：' + res.msg })
        }
    })
}

/* 設定 */
const editFormModels = ref({})
function fatchList() {
    readAllSetting().then(res => {
        if (res.success) {
            res.data.forEach(item => {
                editFormModels.value[item.name] = item.value
            })
        }
    })
}

function sumbitLastOrder() {
    let data = {
        name: 'lastOrder',
        value: editFormModels.value.lastOrder
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

/* 日志 */
const models = ref({})
const logsOption = ref([])

async function getLogsNamae() {
    await readLogsName().then(res => {
        if (res.success) {
            logsOption.value = res.files
        }
    })
}

function downloadLogFile() {
    if (models.value.logName) {
        downloadLog({ fileName: models.value.logName }).then(res => {
            console.log(res)
            let blob = new Blob([res], { type: "application/text" })
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = models.value.logName;
            link.click();
            window.URL.revokeObjectURL(link.href);
        })
    }
}


onMounted(() => {
    fatchList()
    fetchApi()
    getLogsNamae()
})
</script>
<style>
.setting {
    padding: 0 15px;
    height: calc(100vh - 100px);
    display: flex;
    flex-direction: column;
}

</style>