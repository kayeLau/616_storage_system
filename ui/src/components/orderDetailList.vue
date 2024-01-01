<template>
  <div style="height: 100%;">
    <!-- tabel -->
    <el-table :data="_data.children" class="table" header-cell-class-name="table-header"
      :row-class-name="tableRowClassName" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" />
      <el-table-column prop="status" label="分配狀態">
        <template #default="scope">
          <span :style="orderStateColor(scope.row.status)">{{ orderStateDict[scope.row.status] }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="productCode" label="產品編號" width="150">
        <template #default="scope">
          <el-select v-if='scope.row.mode === "create"' v-model="_data.children[scope.$index].productCode" filterable class="input-short"
            @change="setOrderItem(scope.row)">
            <el-option v-for="item in productOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
          <span v-else>{{ scope.row.productCode }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="productName" label="產品名稱" />
      <el-table-column prop="orderQuantity" label="下單數量" width="150" align="center">
        <template #default="scope">
          <div v-if='scope.row.mode === "create"' class="flex-row-center">
            <el-input-number v-model="_data.children[scope.$index].orderQuantity" :min="0" :controls="false"
              @change="setSubmitAvailable(scope.$index)" />
            <span>{{ scope.row.unit }}</span>
          </div>
         </template>
      </el-table-column>
      <el-table-column prop="assignQuantity" label="分配數量" width="150" align="center">
        <template #default="scope">
          <div class="flex-row-center">
            <el-input-number v-model="_data.children[scope.$index].assignQuantity" :min="0" :controls="false"
              @change="setSubmitAvailable(scope.$index)" />
            <span>{{ scope.row.unit }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="orderMode" label="下單模式" :formatter="orderModeFormatter" align="center" />
      <el-table-column prop="updateDate" label="修改時間" width="180" />
      <el-table-column prop="remark" label="備注" width="200">
        <template #default="scope">
          <el-input v-model="_data.children[scope.$index].remark" @change="setSubmitAvailable(scope.$index)" />
        </template>
      </el-table-column>
      <!-- <el-table-column fixed="right" label="操作" width="120">
        <template #default="scope">
          <el-button v-if='scope.row.mode === "create"' type="success" icon="Coin" plain @click="submitAdditionOrderItem(scope.row)">提交</el-button>
          <el-button v-else type="success" icon="Coin" plain @click="updateAssignQuantity(scope.row)">提交</el-button>
        </template>
      </el-table-column> -->
    </el-table>
    <!-- pagination -->
    <div class="pagination">
      <div>
        <el-button type="primary" @click="updateAssignQuantity()" icon="Coin" plain>按下單數量分配</el-button>
        <el-button type="success" icon="Coin" plain @click="submitOrderItem">提交</el-button>
        <el-button type="success" @click="insertOrderItem" icon="CirclePlus" plain>新增</el-button>
      </div>
      <el-pagination background layout="total, prev, pager, next" :total="parseInt(_data.children.length)"
        v-model:current-page="_params.page" :page-size="_params.size" />
    </div>
  </div>
</template>
<script setup>
import { defineProps, reactive, ref, watch, defineEmits , computed } from 'vue';
import { updateOrderDetailAssignQuantity, createAdditionOrderItem } from '../request/orders';
import { orderStateDict, orderMode, orderStateColor } from '../request/dict';
import { ElMessage } from 'element-plus'
const props = defineProps({
  data: Object,
  params: Object,
  products: Array
})

let _data = reactive(props.data)
let _params = reactive(props.params)
let selection = ref([])

watch(() => props.data, (value) => {
  _data = value
})

const emit = defineEmits(['refreshList'])

const orderModeFormatter = (row, column) => {
  let cell = row[column.property]
  return orderMode[cell]
}

function setSubmitAvailable(index) {
  _data.children[index].disabled = false
}

// 表格顏色
function tableRowClassName({ row }) {
  if (row.orderQuantity > row.assignQuantity) {
    return 'danger-row'
  } else if (row.orderQuantity < row.assignQuantity) {
    return 'success-row'
  }
}

// 產品列表
function setOrderItem(row) {
    let productCode = row.productCode
    let product = props.products.find(item => item.productCode === productCode)
    row.productName = product.productName
    row.unit = product.unit
}

const productOptions = computed(() => {
    return props.products.map(item => {
        return {
            value: item.productCode,
            label: item.productCode
        }
    })
})

// 新增
function insertOrderItem() {
  let orderId = _data.id
  _data.children.unshift({
    orderId,
    status: 2,
    productCode: '',
    productName: '',
    orderQuantity: null,
    assignQuantity: null,
    orderMode: 1,
    remark: '',
    updateDate: '-',
    mode: 'create'
  })
}

async function submitOrderItem(){
  let createList = _data.children.filter(item => item.mode === 'create' && item.productCode && item.productName 
  && item.orderQuantity !== null && item.assignQuantity !== null)
  let updateList = _data.children.filter(item => !item.mode && item.assignQuantity !== null)
  await addAdditionOrderItem(createList)
  updateAssignQuantity(updateList)
}

async function addAdditionOrderItem(orderList) {
  if (!orderList.length) {return}
  await createAdditionOrderItem({ orderList }).then(res => {
    if (res.success) {
      ElMessage({ type: 'success', message: '操作成功：資料已存入數據庫' })
    } else {
      ElMessage({ type: 'error', message: '提交失敗' })
    }
  })
}

// 提交分配數量
async function updateAssignQuantity(row) {
  let assignQuantitys = generateAssignQuantityParams(row)
  if (!assignQuantitys.length) {
    ElMessage({ type: 'warning', message: '訂單分匹值無改變' })
    return
  }
  let orderId = _data.id
  await updateOrderDetailAssignQuantity({ assignQuantitys, orderId }).then(res => {
    if (res.success) {
      ElMessage({ type: 'success', message: '操作成功：資料已存入數據庫' })
    } else {
      ElMessage({ type: 'error', message: '操作失败：' + res.msg })
    }
  }).catch(err => {
    console.error(err)
  })
  emit('refreshList')
}

function handleSelectionChange(value) {
  selection.value = value
}

function generateAssignQuantityParams(orderList) {
  if (!orderList.length) {
    orderList = selection.value
    orderList.forEach(item => {
      item.assignQuantity = item.orderQuantity
    })
  }

  let assignQuantitys = orderList.map(item => {
    return {
      id: item.id,
      assignQuantity: item.assignQuantity,
      remark: item.remark
    }
  })
  return assignQuantitys
}
</script>