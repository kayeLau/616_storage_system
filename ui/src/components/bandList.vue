<template>
    <div class="band-list">
        <el-dialog custom-class='dialog' v-model="_dialogVisible" title="分店禁售產品" width="70%" height="60%" @open="getBindedProductList">
            <div class="band-list-tree">
                <el-tree ref='treeRef' :data="data" show-checkbox node-key="id" :default-expand-all="false"/>
            </div>
            <div class="btn-group">
                <el-button type="success" @click="bindProductListToshop">確定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script setup>
import { bindProductToShop , getBindProductList } from '../request/shops';
import { getProductList } from '../request/products';
import { freezersNumDict } from '../request/dict';
import { onMounted , ref , defineProps , computed , defineEmits } from 'vue';

const props = defineProps({
    shopId:String,
    dialogVisible:Boolean
})

const data = ref([])
const treeRef = ref()

const emit = defineEmits(['closeDialog'])
let _dialogVisible = computed({
    get:()=>{
        return props.dialogVisible
    },
    set:()=>{
        emit("closeDialog")
    }
})

// 獲取產品列表
function getProducts() {
    const params = {
        size: 999,
        page: 1
    }
    getProductList(params).then(res => {
        if (res.success) {
            let _data = []
            res.resource.forEach(item => {
                if(!_data[item.freezersNum]){
                    _data[item.freezersNum] = {
                        id:item.freezersNum,
                        label:freezersNumDict[item.freezersNum],
                        disabled:true,
                        children:[{
                            id:item.productCode,
                            label:item.productName,
                        }]
                    }
                }else {
                    _data[item.freezersNum].children.push({
                        id:item.productCode,
                        label:item.productName,
                    })
                }
            });
            console.log(_data)
            data.value = _data.filter(item => item !== null)
        } else {
            data.value = []
        }
    })
}

function getBindedProductList(){
    const params = {
        shopId:props.shopId,
        size: 999,
        page: 1
    }
    getBindProductList(params).then(res => {
        if(res.success){
            let bandList = res.resource.map(item => item.productCode)
            treeRef.value.setCheckedKeys(bandList)
        }
    })
}

function bindProductListToshop(){
    const multipleSelection = treeRef.value.getCheckedKeys()
    const productList = multipleSelection.map(productCode => {
        return {
            id:props.shopId + productCode,
            shopId:props.shopId,
            productCode
        }
    })
    bindProductToShop({productList}).then(res => {
        console.log(res)
    })
}

onMounted(() => {
    getProducts()
})

</script>
<style>
.band-list .dialog{
    border-radius: 10px;
    height: 70vh;
    overflow: hidden;
}
.band-list .el-dialog__body{
    height: calc(100% - 148px);
}
.band-list-tree{
    height: 100%;
    overflow-y: scroll;
}
.band-list .el-tree-node.is-expanded>.el-tree-node__children{
    display: grid ;
    grid-template-columns: 1fr 1fr 1fr;
}

.el-checkbox__input.is-checked .el-checkbox__inner::after{
    border:none;
}
.band-list-tree::-webkit-scrollbar {
    width: 0.4em;
}

.band-list-tree::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
    border-radius: 20px;
}

.band-list-tree::-webkit-scrollbar-thumb {
  background-color: var(--el-color-primary);
  border-radius: 20px;
  /* outline: 1px solid var(--el-color-primary); */
}
</style>
<style scoped>
::v-deep .el-checkbox__input.is-checked .el-checkbox__inner{
    --el-checkbox-checked-bg-color:var(--el-color-danger);
    --el-checkbox-checked-input-border-color:var(--el-color-danger);
}
::v-deep .el-checkbox.is-checked+.el-tree-node__label{
    text-decoration: line-through;
    color: #ccc;
}
</style>