<template>
  <div>
    <el-card class="Ktable-container">
      <Ktable ref='KtableRef' :columns="columns" :operations="operations" :params="params" :getList="getShopList"
        :searchFormColumns="searchFormColumns" :customBtn="customBtn"></Ktable>
    </el-card>
    <bandList :dialogVisible="bandListDialogVisible" @closeDialog="manageBandProduct" :shopId="shopId"></bandList>
    <el-drawer v-model="jsonFormShow" title="店舖資料" direction="rtl">
      <jsonForm :formModel="editFormModel" :formColumns="editFormColumns" :rules="editFormRules"
        :comfireCallBack="JsonFormComfireCallBack" @sumbitSuccess="refreshList" @addSelectItem="addSelectItem"></jsonForm>
    </el-drawer>
  </div>
</template>
<script setup>
import { getShopList, updateShop, createShop, deleteShop, getPartitionList, createPartition, deletePartitionItem } from '../request/shops'
import { shopType, dictToOptions } from '../request/dict'
import bandList from '../components/bandList.vue'
import Ktable from '../components/table.vue'
import jsonForm from '../components/jsonForm.vue'
import { ref, onMounted } from 'vue';

const shopTypeOptions = dictToOptions(shopType)
let shopId = ref("")
const KtableRef = ref()

//edit
let JsonFormComfireCallBack = ref(() => { })
let jsonFormShow = ref(false)
const editFormModel = ref({})
const editFormColumns = ref([
  {
    type: 'select',
    prop: 'shopType',
    label: '店舖類型:',
    options: shopTypeOptions
  },
  {
    type: 'input',
    prop: 'shopCode',
    label: '店舖編號:',
  },
  {
    type: 'input',
    prop: 'shopName',
    label: '店舖名稱:',
  },
  {
    type: 'select',
    prop: 'partition',
    label: '所屬分區:',
    options: [],
    icon: 'DeleteFilled',
    popconfirmTitle: '是否刪除?',
    addItem: true,
    deleteSelectOptions: deleteSelectItem
  }
])
const editFormRules = {
  shopType: [
    { required: true, message: '請選擇店舖類型', trigger: 'blur' },
  ],
  shopCode: [
    { required: true, message: '請輸入店舖編號', trigger: 'blur' },
  ],
  shopName: [
    { required: true, message: '請輸入店舖名稱', trigger: 'blur' },
  ],
  partition: [
    { required: true, message: '請選擇所屬分區', trigger: 'blur' },
  ]
}

function getPartitionItems() {
  getPartitionList().then(res => {
    if (res.success) {
      editFormColumns.value[3].options = res.resource.map(item => {
        return {
          label: item.partitionName,
          value: item.id
        }
      })
    }
  })
}
function deleteSelectItem(partitionId) {
  deletePartitionItem({ id: partitionId }).then(res => {
    if (res.success) {
      getPartitionItems()
    }
  })
}
function addSelectItem(partitionName) {
  createPartition({ partitionName }).then(res => {
    if (res.success) {
      getPartitionItems()
    }
  })
}

onMounted(() => {
  getPartitionItems()
})

function refreshList() {
  KtableRef.value.fatchList()
  jsonFormShow.value = !jsonFormShow.value
}

function createHandle() {
  editFormModel.value = {}
  JsonFormComfireCallBack.value = createShop
  jsonFormShow.value = !jsonFormShow.value
}

function editHandle(index, row) {
  editFormModel.value = { ...row, shopType: String(row.shopType) }
  JsonFormComfireCallBack.value = updateShop
  jsonFormShow.value = !jsonFormShow.value
}

function deleteHandle(index, row) {
  deleteShop({ shopId: row.shopId }).then(res => {
    if (res.success) {
      KtableRef.value.fatchList()
    }
  })
}

// table
const shopTypeFormatter = (row, column) => {
  let cell = row[column.property]
  return shopType[cell]
}

const columns = [
  { props: 'shopCode', label: '店舖編號' },
  { props: 'shopName', label: '店舖名稱', width: 250 },
  { props: 'partition', label: '所屬分區' },
  { props: 'shopType', label: '店舖類型', formatter: shopTypeFormatter },
  // {props:'productCount',label:'產品種類'},
  { props: 'updateDate', label: '修改時間', width: 250 }
]
const operations = {
  width: 360,
  size: "small",
  children: [
    { type: "primary", name: '編輯', onClick: editHandle, icon: 'Edit' },
    { type: "warning", name: '管理禁售產品', onClick: manageBandProduct, icon: 'Setting' },
    { type: "danger", name: '删除', icon: 'Delete', onClick: deleteHandle }
  ]
}
const params = {
  size: 10,
  page: 1
}
const searchFormColumns = [
  {
    type: 'select',
    prop: 'shopType',
    label: '店铺類型:',
    options: shopTypeOptions
  }
]
const customBtn = [
  {
    type: 'success',
    label: '新增',
    icon: 'CirclePlus',
    onClick: createHandle
  },
]

// popup
let bandListDialogVisible = ref(false)
function manageBandProduct(index, row) {
  if (row && row.shopId) {
    shopId.value = row.shopId
  }
  bandListDialogVisible.value = !bandListDialogVisible.value
}
</script>