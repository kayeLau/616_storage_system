<template>
  <el-table class="table" header-cell-class-name="table-header" :data="data" style="width: 100%; margin-bottom: 20px"
    row-key="id" default-expand-all>
    <el-table-column prop="nameZh" label="名稱" />
    <el-table-column prop="auth" label="可訪問角色" />
    <el-table-column prop="type" label="類型" />
    <el-table-column prop="path" label="路由" />
  </el-table>
</template>

<script setup>
import { readMenuAuth } from '../../request/menuAuth'
import { ref } from 'vue';

let data = ref([])

function getMenuAuth() {
  readMenuAuth({ isTree: true }).then(res => {
    if (res.success) {
      data.value = res.data
    }
  })
}

getMenuAuth()

</script>