<template>
    <div class="common-layout">
        <el-container style="height: 100%;">
            <el-header class="header-bar">
                <el-avatar @click="avatarNavHandle" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
                <img src="../assets/616_logo.png" alt="616_logo" class='logo'>
                <el-drawer v-model="phoneNavShow" direction="ltr" size="80%">
                    <div class="phone-nav">
                        <div>
                            <router-link v-for='(item, index) of menus' :key='index' :to="item.path" @click="avatarNavHandle">
                                <div class="phone-nav-link">
                                    <el-icon>
                                        <component :is='item.icon'></component>
                                    </el-icon>
                                    <span style="padding-left: 10px;">{{ item.name }}</span>
                                </div>
                            </router-link>
                        </div>
                        <div>
                            <div>{{ authDict[userInfo.auth] }} - {{ userInfo.name }}</div>
                            <el-button type="primary" style="width: 100%" @click="logOutbyUser">登出</el-button>
                        </div>
                    </div>
                </el-drawer>
            </el-header>
            <el-container style="overflow:hidden ;">
                <el-main>
                    <router-view />
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script setup>
import { computed, ref, onBeforeUnmount } from 'vue';
import { getStorge, removeToken } from '../utils/auth'
import { authDict } from '../request/dict'
import { useRouter } from 'vue-router';
import { logout } from '../request/users';

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
        path: 'appOrder',
        icon: 'Tickets',
        auth: [-1, 1, 0, 2, 3]
    },
    {
        name: "產品管理",
        path: 'product',
        icon: 'Goods',
        whiteList: false,
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


let phoneNavShow = ref(false)
function avatarNavHandle() {
    phoneNavShow.value = !phoneNavShow.value
}

onBeforeUnmount(async () => {
    await logout()
})
</script>

<style scoped>
.common-layout{
    height: 100vh;
    overflow: hidden;
}
.el-main {
    --el-main-padding: 0;
}

.header-bar {
    padding: 8px 20px;
    display: flex;
    align-items: flex-end;
    justify-content: flex-start;
}

.avatar {
    position: relative;
    cursor: pointer;
    display: flex;
    align-items: center;
}

.version {
    position: absolute;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
    color: #6c6a6a;
    font-size: smaller
}

.phone-nav {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.phone-nav-link {
    color: #000;
    font-size: 25px;
}

.phone-nav a {
    text-decoration: none;
}

.phone-nav-link {
    color: #000;
    padding-bottom: 10px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 3px;
}
</style>