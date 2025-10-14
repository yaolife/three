import { reactive } from 'vue'

// 创建用户状态
const userState = reactive({
  isLoggedIn: false,
  userInfo: {
    name: '',
    id: ''
  }
})

// 登录方法
const login = (username) => {
  userState.isLoggedIn = true
  userState.userInfo.name = username
  userState.userInfo.id = 'P100000' // 模拟工号
}

// 登出方法
const logout = () => {
  userState.isLoggedIn = false
  userState.userInfo.name = ''
  userState.userInfo.id = ''
}

// 跳过登录方法
const skipLogin = () => {
  userState.isLoggedIn = true
  userState.userInfo.name = '访客'
  userState.userInfo.id = 'GUEST001'
}

export default {
  userState,
  login,
  logout,
  skipLogin
}