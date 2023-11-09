<template>
    <div class="common-layout">
        <el-container>
            <el-header class="header-bar" >
                    <img src="../assets/616_logo.jpg" alt="616_logo" class='logo'>
                    <div class="avatar">
                        <!-- <span>Kaye</span> -->
                        <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
                    </div>
            </el-header>

            <el-container>
                <el-aside width="250px" style="padding-right: 8px;">
                    <el-menu default-active="1" class="el-menu-vertical-demo" router background-color="#f2f6fc">
                        <component v-for='(item, index) of menus' :key='index' :index="item.path" :is='item.childen ? "el-sub-menu" : "el-menu-item"'>
                            <template #title>
                                <el-icon>
                                    <component :is='item.icon'></component>
                                </el-icon>
                                <span>{{ item.name }}</span>
                            </template>
                            <el-menu-item v-for='(subItem, subIndex) of item.childen' :key='"s" + subIndex' :index="subItem.path">item one</el-menu-item>
                        </component>
                    </el-menu>
                </el-aside>

                <el-main>
                    <router-view />
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script setup>
import { reactive } from 'vue';
const menus = reactive([
    {
        name: "訂單管理",
        path:'order',
        icon:'Tickets',
    },
    {
        name: "產品管理",
        path:'product',
        icon:'Goods',
    },
    {
        name: "用戶管理",
        path:'user',
        icon:'Avatar',
    },
    {
        name: "店舖管理",
        path:'shop',
        icon:'OfficeBuilding',
    },
    {
        name: "落單頁",
        path:'appOrder',
        icon:'Iphone',
    },
    ])
</script>
<style>
 @media only screen and (max-width: 960px) {
    .el-main {
        --el-main-padding:0
    }
    .el-aside{
        display: none;
    }
 }
.header-bar{
    padding: 8px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.logo{
    width:235px;
    height:28px;
    background-size: contain;

}
.avatar{
    display: flex;
    align-items: center;
}
.avatar>span{
    font-weight: bold;
}
</style>