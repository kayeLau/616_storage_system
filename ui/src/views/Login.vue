<template>
    <div id="login">
        <div class="container" id="container">
            <div class="form-container sign-in">
                <div class="login-form">
                    <h1>Sign In</h1>
                    <input type="text" placeholder="用戶名稱" v-model="loginInfo.userName" @keydown.enter="toLogin(false)">
                    <input type="password" placeholder="用戶密碼" v-model="loginInfo.password" @keydown.enter="toLogin(false)">
                    <button @click="toLogin(false)">Sign In</button>
                </div>
            </div>
            <div class="toggle-container">
                <div class="toggle">
                    <div class="toggle-panel toggle-right">
                        <!-- <h1>616智能倉務系統</h1> -->
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
                toHome()
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

function toHome() {
    router.push({
        path: '/order'
    })
}

</script>
<style>
#login {
    background-color: #c9d6ff;
    background: linear-gradient(to right, #e2e2e2, #c9d6ff);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    height: 100vh;
}

.container {
    background-color: #fff;
    border-radius: 30px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.35);
    position: relative;
    overflow: hidden;
    width: 768px;
    max-width: 100%;
    min-height: 480px;
}

.container p {
    font-size: 14px;
    line-height: 20px;
    letter-spacing: 0.3px;
    margin: 20px 0;
}

.container span {
    font-size: 12px;
}

.container a {
    color: #333;
    font-size: 13px;
    text-decoration: none;
    margin: 15px 0 10px;
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

.container button.hidden {
    background-color: transparent;
    border-color: #fff;
}

.container .login-form {
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 0 40px;
    height: 100%;
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
    position: absolute;
    top: 0;
    height: 100%;
    transition: all 0.6s ease-in-out;
}

.sign-in {
    left: 0;
    width: 50%;
    z-index: 2;
}

.container.active .sign-in {
    transform: translateX(100%);
}

.sign-up {
    left: 0;
    width: 50%;
    opacity: 0;
    z-index: 1;
}

.container.active .sign-up {
    transform: translateX(100%);
    opacity: 1;
    z-index: 5;
    animation: move 0.6s;
}

@keyframes move {

    0%,
    49.99% {
        opacity: 0;
        z-index: 1;
    }

    50%,
    100% {
        opacity: 1;
        z-index: 5;
    }
}

.social-icons {
    margin: 20px 0;
}

.social-icons a {
    border: 1px solid #ccc;
    border-radius: 20%;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    margin: 0 3px;
    width: 40px;
    height: 40px;
}

.toggle-container {
    position: absolute;
    top: 0;
    left: 50%;
    width: 50%;
    height: 100%;
    overflow: hidden;
    transition: all 0.6s ease-in-out;
    border-radius: 150px 0 0 100px;
    z-index: 1000;
}

.container.active .toggle-container {
    transform: translateX(-100%);
    border-radius: 0 150px 100px 0;
}

.toggle {
    background-color: #512da8;
    height: 100%;
    background: linear-gradient(to right, #5c6bc0, #512da8);
    color: #fff;
    position: relative;
    left: -100%;
    height: 100%;
    width: 200%;
    transform: translateX(0);
    transition: all 0.6s ease-in-out;
}

.container.active .toggle {
    transform: translateX(50%);
}

.toggle-panel {
    position: absolute;
    width: 50%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 0 30px;
    text-align: center;
    top: 0;
    transform: translateX(0);
    transition: all 0.6s ease-in-out;
}

.toggle-left {
    transform: translateX(-200%);
}

.container.active .toggle-left {
    transform: translateX(0);
}

.toggle-right {
    right: 0;
    transform: translateX(0);
}

.container.active .toggle-right {
    transform: translateX(200%);
}
</style>