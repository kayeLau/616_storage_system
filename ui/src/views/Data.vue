<template>
    <div class="title">到期時間</div>
    <el-row>
        <el-col :span="6">
            <el-statistic value="22/09/2024" title="官網維護"></el-statistic>
        </el-col>
        <el-col :span="6">
            <el-statistic value="11/06/2025" title="616wms域名"></el-statistic>
        </el-col>
        <el-col :span="6">
            <el-statistic value="04/05/2025" title="本系統維護"></el-statistic>
        </el-col>
        <el-col :span="6">
            <el-statistic value="25/02/2025" title="服務器"></el-statistic>
        </el-col>
    </el-row>
    <div class="title">日志</div>
    <el-form ref='formRef' :model="models" label-position="left">
        <el-form-item label="日志下載" prop="logName">
            <el-select style="width: 150px;" v-model="models.logName" size="small" placeholder="請選擇時間" clearable
                @change="downloadLogFile">
                <el-option v-for="opt of logsOption" :key="opt" :label="opt" :value="opt"></el-option>
            </el-select>
        </el-form-item>
    </el-form>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { readLogsName, downloadLog } from '../request/file';

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
    getLogsNamae()
})
</script>
