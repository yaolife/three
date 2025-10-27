<template>
  <div class="login-container">
    <div class="login-form-wrapper">
      <h2 class="login-title">光热三维施工仿真软件</h2>
      <el-card class="login-card">
        <el-form ref="loginForm" :model="loginForm" :rules="rules" label-width="80px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="loginForm.username" placeholder="请输入用户名或工号" prefix-icon="User" />
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" prefix-icon="Lock" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleLogin" style="width: 100%">确认登录</el-button>
          </el-form-item>
        </el-form>
        <div class="login-helper">
          <el-button type="link" @click="skipLogin" style="margin: 0 auto; display: block;">
            不登录，直接进入
          </el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'
import userStore from '../store/user.js'

const router = useRouter()
const loginForm = reactive({
  username: '',
  password: ''
})

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ]
}

const handleLogin = () => {
  // 模拟登录验证
  if (loginForm.username && loginForm.password) {
    ElMessage.success('登录成功')
    // 设置用户状态
    userStore.login(loginForm.username)
    // 登录成功后跳转到全部项目页面
    router.push('/all-projects')
  } else {
    ElMessage.error('请输入用户名和密码')
  }
}

const skipLogin = () => {
  // 设置跳过登录状态
  userStore.skipLogin()
  // 直接进入系统
  router.push('/all-projects')
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
}

.login-form-wrapper {
  position: relative;
  z-index: 10;
  max-width: 400px;
  width: 100%;
  padding: 20px;
}

.login-title {
  text-align: center;
  color: #fff;
  font-size: 24px;
  margin-bottom: 30px;
  font-weight: 500;
}

.login-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.login-helper {
  margin-top: 20px;
  text-align: center;
}

/* 背景装饰 */
.login-container::before {
  content: '';
  position: absolute;
  width: 300px;
  height: 300px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  top: 10%;
  left: 10%;
}

.login-container::after {
  content: '';
  position: absolute;
  width: 400px;
  height: 400px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 50%;
  bottom: 10%;
  right: 10%;
}
</style>
