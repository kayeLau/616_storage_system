<template>
    <div class="common-layout">
        <el-container>
            <el-header class="header-bar" v-if="device === 'pc'">
                <img src="../assets/616_logo.png" alt="616_logo" class='logo'>
                <div class="avatar" @click="avatarNavHandle">
                    <el-avatar :src="avatarLink" />
                    <el-card class="avatar-detail" v-show="avatarDetailShow">
                        <div class="avatar-detail-info">
                            <span>{{ authDict[userInfo.auth] }}</span>
                            <span>{{ userInfo.name }}</span>
                        </div>
                        <el-button type="primary" style="width: 100%" @click="logOutbyUser">登出</el-button>
                    </el-card>
                </div>
            </el-header>
            <el-header class="header-bar" v-else>
                <el-avatar @click="avatarNavHandle" :src="avatarLink" />
                <img src="../assets/616_logo.png" alt="616_logo" class='logo'>
                <el-drawer v-model="phoneNavShow" direction="ltr" size="80%">
                    <div class="phone-nav">
                        <div>
                            <router-link v-for='(item, index) of menus' :key='index' :to="item.path"
                                @click="avatarNavHandle">
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
            <el-container>
                <el-aside width="180px" class='aside' v-if="device === 'pc'">
                    <el-menu :default-active="activeMenu" class="el-menu-vertical-demo" router background-color="#f2f6fc">
                        <component v-for='(item, index) of menus' :key='index' :index="item.path"
                            :is='item.childen ? "el-sub-menu" : "el-menu-item"' @click="setActiveMenu(item.path)">
                            <template #title>
                                <el-icon>
                                    <component :is='item.icon'></component>
                                </el-icon>
                                <span>{{ item.name }}</span>
                            </template>
                            <el-menu-item v-for='(subItem, subIndex) of item.childen' :key='"s" + subIndex'
                                :index="subItem.path"></el-menu-item>
                        </component>
                    </el-menu>
                    <div class="version">{{ version }}</div>
                </el-aside>

                <el-main>
                    <router-view @setActiveMenu="setActiveMenu"/>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { setStorge, getStorge, removeToken } from '../utils/auth'
import { authDict } from '../request/dict'
import { useRouter } from 'vue-router';
import { logout } from '../request/users';
import { useWindowSize } from '../hooks/useWindowSize';
import { useMenuAuth } from '@/hooks/useAuth';
import { clearDynamicRoutes } from '../router/index'
const { device } = useWindowSize();
const { generateRoutes, clearMenuMap } = useMenuAuth();
const version = process.env.VUE_APP_VERSION
const avatarLink = 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'

const router = useRouter()
async function logOutbyUser() {
    await logout().catch(err => console.err(err))
    removeToken()
    router.push({ path: '/login' })
    clearMenuMap()
    await clearDynamicRoutes()
}

const userInfo = computed(() => {
    let user = getStorge('userInfo')
    return user ? JSON.parse(user) : {}
})

const menus = ref([])
generateRoutes([
    {
        name: "訂單管理",
        path: 'order',
        icon: 'Tickets',
    },
    {
        name: "原料管理",
        path: 'product',
        icon: 'Goods',
        whiteList: false,
    },
    // {
    //     name: "菜單管理",
    //     path: 'menu',
    //     icon: 'Dish',
    // },
    {
        name: "用戶管理",
        path: 'user',
        icon: 'Avatar',
    },
    {
        name: "店舖管理",
        path: 'shop',
        icon: 'OfficeBuilding',
    },
    {
        name: "落單",
        path: 'appFood',
        icon: 'Iphone',
    },
    {
        name: "盤點",
        path: 'inventory',
        icon: 'Box',
    },
    {
        name: "設定",
        path: 'setting',
        icon: 'Setting',
    },
    {
        name: "數據",
        path: 'data',
        icon: 'TrendCharts',
    },
], 'path').then(res => {
    menus.value = res
})


let avatarDetailShow = ref(false)
let phoneNavShow = ref(false)
function avatarNavHandle() {
    if (device.value === 'pc') {
        avatarDetailShow.value = !avatarDetailShow.value
    } else {
        phoneNavShow.value = !phoneNavShow.value
    }
}

let activeMenu = ref(getStorge('activeMenu') || '1')
function setActiveMenu(menu){
    if(menu !== activeMenu.value){
        activeMenu.value = menu
    }
    setStorge('activeMenu',menu)}
</script>
<style scoped>
.common-layout {
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