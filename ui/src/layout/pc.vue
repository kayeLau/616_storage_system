<template>
    <div class="common-layout">
        <el-container>
            <el-header class="header-bar">
                <img src="../assets/616_logo.png" alt="616_logo" class='logo'>
                <div class="avatar" @click="avatarNavHandle">
                    <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
                    <el-card class="avatar-detail" v-show="avatarDetailShow">
                        <div class="avatar-detail-info">
                            <span>{{ authDict[userInfo.auth] }}</span>
                            <span>{{ userInfo.name }}</span>
                        </div>
                        <el-button type="primary" style="width: 100%" @click="logOutbyUser">登出</el-button>
                    </el-card>
                </div>
            </el-header>

            <el-container>
                <el-aside width="180px" class='aside'>
                    <el-menu default-active="1" class="el-menu-vertical-demo" router background-color="#f2f6fc">
                        <component v-for='(item, index) of menus' :key='index' :index="item.path"
                            :is='item.childen ? "el-sub-menu" : "el-menu-item"'>
                            <template #title>
                                <el-icon>
                                    <component :is='item.icon'></component>
                                </el-icon>
                                <span>{{ item.name }}</span>
                            </template>
                            <el-menu-item v-for='(subItem, subIndex) of item.childen' :key='"s" + subIndex'
                                :index="subItem.path">item
                                one</el-menu-item>
                        </component>
                    </el-menu>
                    <div class="version">
                        {{ version }}
                    </div>
                </el-aside>

                <el-main>
                    <router-view />
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { getStorge, removeToken } from '../utils/auth'
import { authDict } from '../request/dict'
import { useRouter } from 'vue-router';
import { logout } from '../request/users';
const version = process.env.VUE_APP_VERSION

const router = useRouter()
async function logOutbyUser() {
    await logout().catch(err => console.err(err))
    removeToken()
    router.push({
        path: '/login'
    })
}
const userInfo = computed(() => {
    let user = getStorge('userInfo')
    return user ? JSON.parse(user) : {}
})
const menus = [
    {
        name: "訂單管理",
        path: 'order',
        icon: 'Tickets',
        auth: [-1, 1, 0, 2, 3]
    },
    {
        name: "原料管理",
        path: 'product',
        icon: 'Goods',
        whiteList: false,
        auth: [-1]
    },
    {
        name: "菜單管理",
        path: 'menu',
        icon: 'Dish',
        auth: [-1]
    },
    {
        name: "用戶管理",
        path: 'user',
        icon: 'Avatar',
        auth: [-1]
    },
    {
        name: "店舖管理",
        path: 'shop',
        icon: 'OfficeBuilding',
        auth: [-1]
    },
    {
        name: "落單",
        path: 'appFood',
        icon: 'Iphone',
        auth: [0, 1]
    },
    // {
    //     name: "倉存管理",
    //     path: 'inventory',
    //     icon: 'Box',
    //     auth: [-1, 1, 0, 2, 3]
    // },
    // {
    //     name: "盤點",
    //     path: 'appInventory',
    //     icon: 'Box',
    //     auth: [0, 1]
    // },
    {
        name: "設定",
        path: 'setting',
        icon: 'Setting',
        auth: [-1]
    },
    {
        name: "數據",
        path: 'data',
        icon: 'TrendCharts',
        auth: [-1]
    },
].filter(item => item.auth.includes(userInfo.value.auth))

let avatarDetailShow = ref(false)

function avatarNavHandle() {
    avatarDetailShow.value = !avatarDetailShow.value
}

</script>

<style scoped>
.common-layout{
    height: 100vh;
    overflow: hidden;
}
.el-main {
    --el-main-padding: 0 10px;
    height: 100%;
}

.header-bar {
    padding: 8px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.logo {
    width: 235px;
    height: 28px;
    background-size: contain;

}

.avatar {
    position: relative;
    cursor: pointer;
    display: flex;
    align-items: center;
}

.avatar>span {
    font-weight: bold;
}

.avatar-detail {
    position: absolute;
    z-index: 999;
    width: 200px;
    background-color: #fff;
    top: 100%;
    right: 10px;
}

.avatar-detail-info {
    padding: 20px 0;
    display: flex;
    justify-content: space-between;
}

.avatar-detail>p {
    padding-bottom: 5px;
}

.version {
    position: absolute;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
    color: #6c6a6a;
    font-size: smaller
}

.aside {
    padding-right: 8px;
    position: relative;
    height: calc(100vh - 60px);
}
</style>