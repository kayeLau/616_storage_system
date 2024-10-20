<template>
    <div id="login">
        <div class="container" id="container">
            <div class="form-container sign-in">
                <img src="../assets/616_logo.png" alt="616_logo" class='logo'>
                <div class="login-form">
                    <h1>Sign In</h1>
                    <input type="text" placeholder="用戶名稱" v-model="loginInfo.userName" @keydown.enter="toLogin(false)">
                    <input type="password" placeholder="用戶密碼" v-model="loginInfo.password"
                        @keydown.enter="toLogin(false)">
                    <button @click="toLogin(false)">Sign In</button>
                </div>
            </div>
            <div class="toggle-container">
                <div class="toggle">
                    <div class="toggle-panel">
                        <h1>616智能倉務系統</h1>
                    </div>
                </div>
            </div>
        </div>
        <el-dialog v-model="dialogVisible" title="強制退出登陸" width="500" top="25vh">
            <span>此用戶正在設備
                <span style="font-weight: 700;color: var(--el-color-primary);">{{ ipAddress }}</span>
                上登陸,是否強制退出登陸
            </span>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="toLogin(true)">確定</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>
<script setup>
// import md5 from 'js-md5'
import { setToken, setStorge } from '../utils/auth'
import { login } from '../request/users'
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus'
const router = useRouter()

const loginInfo = reactive({
    userName: null,
    password: null
})

let dialogVisible = ref(false)
let ipAddress = ref('')

function toLogin(force = false) {
    if (loginInfo.userName && loginInfo.password) {
        let data = {
            name: loginInfo.userName,
            password: loginInfo.password,
            force
        }
        login(data).then(res => {
            if (res.success === true) {
                setToken(res.token)
                setStorge('userInfo', res.userInfo)
                toHome(res.userInfo)
            } else if (res.isUsing) {
                ipAddress.value = res.ip
                dialogVisible.value = true
            } else {
                ElMessage({ type: 'error', message: res.msg })
            }
        }).catch(() => {
            ElMessage({ type: 'error', message: '服務器錯誤' })
        })
    } else {
        ElMessage({ type: 'error', message: '帳號或密碼不能為空' })
    }
}

function toHome(userInfo) {
    const path = userInfo.auth === 0 || userInfo.auth === 1 ? '/appFood' : '/order';
    router.push({ path })
}

</script>
<style scoped>
@media screen and (max-width: 750px) {
    #container {
        flex-direction: column;
        width: 80vw;
    }
}

.logo {
    padding-top: 10px;
    padding-left: 10px;
}

#login {
    background-color: #c9d6ff;
    background: linear-gradient(to right, #e2e2e2, #c9d6ff);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    height: 100vh;
    width: 100vw;
}

.container {
    background-color: #fff;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.35);
    width: 768px;
    min-height: 480px;
    display: flex;
}

.container button {
    background-color: #512da8;
    color: #fff;
    font-size: 12px;
    padding: 10px 45px;
    border: 1px solid transparent;
    border-radius: 8px;
    font-weight: 600;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    margin-top: 10px;
    cursor: pointer;
}

.container .login-form {
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 0 40px;
    height: calc(100% - 50px);
}

.container input {
    background-color: #eee;
    border: none;
    margin: 8px 0;
    padding: 10px 15px;
    font-size: 13px;
    border-radius: 8px;
    width: 100%;
    outline: none;
}

.form-container {
    height: 100%;
    overflow: hidden;
}

.toggle-container {
    flex: 1;
    overflow: hidden;
    border-radius: 150px 0 0 100px;
    z-index: 1000;
}

.toggle {
    background-color: #512da8;
    height: 100%;
    background: linear-gradient(to right, #5c6bc0, #512da8);
    color: #fff;
}

.toggle-panel {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 30px;
    text-align: center;
}
</style>