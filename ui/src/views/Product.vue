<template>
  <div>
    <el-card class="Ktable-container">
      <Ktable ref='KtableRef' :columns="columns" :operations="operations" :params="params" :getList="readProduct"
        :searchFormColumns="searchFormColumns" :customBtn="customBtn"></Ktable>
    </el-card>
    <el-drawer v-model="jsonFormShow" title="店舖資料" direction="rtl" :style="{ minWidth: '300px' }">
      <jsonForm :formModel="editFormModel" :formColumns="editFormColumns" :rules="editFormRules"
        :comfireCallBack="JsonFormComfireCallBack" @sumbitSuccess="refreshList"></jsonForm>
    </el-drawer>
  </div>
</template>
<script setup>
import { readProduct, updateProduct, createProduct } from '../request/products'
import { freezersNumDict, classifyDict, departmentDict, dictToOptions, disable, productSummary } from '../request/dict'
import Ktable from '../components/table.vue'
import jsonForm from '../components/jsonForm.vue'
import { ref } from 'vue'
import { exportExcel , xlsxToJson } from '../utils/export'
import { ElUpload, ElButton } from 'element-plus'

const KtableRef = ref()

//#region Edit
let JsonFormComfireCallBack = ref(() => { })
let jsonFormShow = ref(false)
const editFormModel = ref({})
const editFormColumns = ref([
  {
    type: 'input',
    prop: 'productCode',
    label: '產品編號:',
  },
  {
    type: 'input',
    prop: 'productName',
    label: '產品名稱:',
  },
  {
    type: 'select',
    prop: 'classify',
    label: '分類:',
    options: dictToOptions(classifyDict)
  },
  {
    type: 'select',
    prop: 'freezersNum',
    label: '雪房號碼:',
    options: dictToOptions(freezersNumDict)
  },
  {
    type: 'select',
    prop: 'department',
    label: '負責部門:',
    options: dictToOptions(departmentDict)
  },
  {
    type: 'input',
    prop: 'standard',
    label: '規格:',
  },
  {
    type: 'input',
    prop: 'unit',
    label: '單位:',
  },
  {
    type: 'select',
    prop: 'disable',
    label: '狀態:',
    options: dictToOptions(disable)
  },
  {
    type: 'select',
    prop: 'summary',
    label: '肉類匯總:',
    options: dictToOptions(productSummary)
  }
])
const editFormRules = {
  productCode: [
    { required: true, message: '請輸入產品編號', trigger: 'blur' },
  ],
  productName: [
    { required: true, message: '請輸入產品名稱', trigger: 'blur' },
  ],
  freezersNum: [
    { required: true, message: '請選擇雪房號碼', trigger: 'blur' },
  ],
  classify: [
    { required: true, message: '請選擇分類', trigger: 'blur' },
  ],
  department: [
    { required: true, message: '請選擇負責部門', trigger: 'blur' },
  ],
  standard: [
    { required: true, message: '請輸入規格', trigger: 'blur' },
  ],
  unit: [
    { required: true, message: '請輸入單位', trigger: 'blur' },
  ],
  disable: [
    { required: true, message: '請選擇展示狀態', trigger: 'blur' },
  ],
  summary: [
    { required: true, message: '請選擇匯總狀態', trigger: 'blur' },
  ],
}

function refreshList() {
  KtableRef.value.fatchList()
  jsonFormShow.value = !jsonFormShow.value
}

function createHandle() {
  editFormModel.value = {}
  JsonFormComfireCallBack.value = createProduct
  editFormColumns.value[0].disabled = false
  jsonFormShow.value = !jsonFormShow.value
}

function editHandle(index, row) {
  editFormModel.value = {
    ...row,
    freezersNum: String(row.freezersNum),
    classify: String(row.classify),
    department: String(row.department),
    disable: String(row.disable),
    summary: String(row.summary)
  }
  JsonFormComfireCallBack.value = updateProduct
  editFormColumns.value[0].disabled = true
  jsonFormShow.value = !jsonFormShow.value
}

function deleteHandle(index, row) {
  updateProduct({ productId: row.productId , disable:2 }).then(res => {
    if (res.success) {
      KtableRef.value.fatchList()
    }
  })
}
//#endregion

//#region Tabel
const freezersNumFormatter = (row, column) => {
  let cell = row[column.property]
  return freezersNumDict[cell]
}

const classifyFormatter = (row, column) => {
  let cell = row[column.property]
  return classifyDict[cell]
}

const departmentFormatter = (row, column) => {
  let cell = row[column.property]
  return departmentDict[cell]
}

const summaryFormatter = (row, column) => {
  let cell = row[column.property]
  return productSummary[cell]
}

const disableFormatter = (row, column) => {
  let cell = row[column.property]
  let color = cell === 1 ? 'var(--el-color-danger)' : 'var(--el-color-success)'
  return `<span style='color:${color}'>${disable[cell]}<span>`
}

const columns = [
  { props: 'disable', label: '狀態', formatter: disableFormatter, width: 60 },
  { props: 'productCode', label: '產品編號', width: 80 },
  { props: 'productName', label: '產品名稱', width: 130 },
  { props: 'classify', label: '分類', formatter: classifyFormatter , width: 120},
  { props: 'freezersNum', label: '雪房號碼', formatter: freezersNumFormatter },
  { props: 'department', label: '負責部門', formatter: departmentFormatter },
  { props: 'standard', label: '規格', width: 120 },
  { props: 'unit', label: '單位' },
  { props: 'summary', label: '匯總', formatter: summaryFormatter },
  { props: 'updateDate', label: '修改時間', width: 200 }
]
const operations = {
  width: 200,
  size: "small",
  children: [
    { type: "primary", name: '編輯', icon: 'Edit', onClick: editHandle },
    {  btnType:"popconfirm", type: "danger", name: '删除', icon: 'Delete', onClick: deleteHandle }
  ]
}
const params = {
  size: 20,
  page: 1,
  disable:'0'
}
const searchFormColumns = [
  {
    type: 'input',
    prop: 'productName',
    label: '產品名稱:',
  },
  {
    type: 'select',
    prop: 'freezersNum',
    label: '雪房號碼:',
    options: dictToOptions(freezersNumDict)
  },
  {
    type: 'select',
    prop: 'classify',
    label: '分類:',
    options: dictToOptions(classifyDict)
  },
  {
    type: 'select',
    prop: 'disable',
    label: '狀態:',
    options: dictToOptions(disable)
  },
  {
    type: 'select',
    prop: 'summary',
    label: '匯總:',
    options: dictToOptions(productSummary)
  }
]

let fileList = ref([])
const customBtn = [
  {
    type: 'button',
    btnType: 'success',
    label: '新增',
    icon: 'CirclePlus',
    onClick: createHandle
  },
  {
    type: 'button',
    btnType: 'success',
    label: '導出',
    icon: 'Printer',
    onClick: exportProductExcel
  },
  {
    type: 'render',
    render: (h) => {
      return h(ElUpload, {
          class: "upload-demo", autoUpload: false, onChange:excelToJson, limit:1,
          ['onUpdate:modelValue']: (value) => {
            fileList.value = value
          }
        }, [
          h(ElButton, { type: "primary", plain: true, limit: 1 , 
          style:{ borderTopRightRadius:0 , borderBottomRightRadius:0 }}, '轉換為JSON')
        ])
    }
  },
]

function excelToJson(file){
  const reader = new FileReader()
  reader.readAsBinaryString(file.raw)
  reader.onload = e => {
    xlsxToJson(e.target.result)
  };
}

function exportProductExcel() {
  readProduct({ size: 999, page: 1 }).then(res => {
    if (res.success) {
      let jsonData = []
      jsonData = res.data.map(item => {
        return [
          disable[item.disable],
          item.productId,
          item.productCode,
          item.productName,
          classifyDict[item.classify],
          freezersNumDict[item.freezersNum],
          departmentDict[item.department],
          item.standard,
          item.unit,
          productSummary[item.summary],
          item.updateDate,
        ]
      })
      jsonData.unshift(['狀態', '產品Id', '產品編號', '產品名稱', '分類 ', '雪房號碼', '負責部門', '規格', '單位', '匯總', '修改時間'])
      const products = {
        sheetNames: '產品',
        jsonData
      }
      exportExcel({exportDate:[products]})
    }
  })
}
//#endregion
</script>
<style>
.upload-demo {
  display: flex;
}

.el-upload-list__item .el-upload-list__item-info {
  width: 100%;
}
</style>