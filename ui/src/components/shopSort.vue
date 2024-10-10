<template>
    <div class="itxst">
        <el-dialog custom-class='dialog' v-model="_dialogVisible" title="店舖排序" width="70%" height="60%"
            @open="fetchShopList">
            <div style="overflow: scroll;height: calc(100% - 50px);">
                <draggable :list="state.list" ghost-class="ghost" chosen-class="chosenClass" animation="300"
                    @start="onStart" @end="onEnd">
                    <template #item="{ element }">
                        <div class="item">
                            {{ element.name }}
                        </div>
                    </template>
                </draggable>
            </div>
        </el-dialog>
    </div>
</template>
<script setup>
import { reactive , defineProps , computed , defineEmits} from "vue";
import draggable from "vuedraggable";
import { readShop, setShopOrder } from '../request/shops';

const props = defineProps({
    shopOrderDialogVisible:Boolean
})
const emit = defineEmits(['closeDialog'])
let _dialogVisible = computed({
    get:()=>{
        return props.shopOrderDialogVisible
    },
    set:()=>{
        emit("closeDialog")
    }
})

const state = reactive({
    list: [],
});

const onStart = () => {
    console.log("开始拖拽");
};

const onEnd = () => {
    const shopList = state.list.map((item,index) => {
        console.log(item)
        return {
            shopId:item.id,
            shopOrder:index
        }
    })
    setShopOrder({shopList}).then(res => {
        if (res.success) {
            console.log(res.data)
        }
    })
};

function fetchShopList() {
    readShop({ size: 999, page: 1 }).then(res => {
        if (res.success) {
            state.list = res.data.map(item => {
                return {
                    name: item.shopName,
                    id: item.shopId
                }
            })
        }
    })
}
</script>
<style scoped>
.itxst {
    width: 600px;
    display: flex;
}

.itxst>div:nth-of-type(1) {
    flex: 1;
}

.itxst>div:nth-of-type(2) {
    width: 270px;
    padding-left: 20px;
}

.item {
    border: solid 1px #eee;
    padding: 6px 10px;
    text-align: left;
}

.item:hover {
    cursor: move;
}

.item+.item {
    margin-top: 10px;
}

.ghost {
    border: solid 1px rgb(19, 41, 239);
}

.chosenClass {
    background-color: #f1f1f1;
}
</style>