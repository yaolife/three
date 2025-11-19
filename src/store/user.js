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
const login = (username, userNickName = null) => {
  userState.isLoggedIn = true
  userState.userInfo.name = username
  // 如果提供了 userNickName，使用它；否则使用模拟工号
  userState.userInfo.id = userNickName || 'P100000'
  
  // 保存用户信息到 localStorage
  localStorage.setItem('userInfo', JSON.stringify({
    name: username,
    id: userNickName || 'P100000'
  }))
}

// 登出方法
const logout = () => {
  userState.isLoggedIn = false
  userState.userInfo.name = ''
  userState.userInfo.id = ''
  
  // 清除 localStorage 中的用户信息
  localStorage.removeItem('userInfo')
  localStorage.removeItem('token')
}

// 从 localStorage 恢复用户状态
const restoreUserState = () => {
  const token = localStorage.getItem('token')
  const userInfoStr = localStorage.getItem('userInfo')
  
  if (token && userInfoStr) {
    try {
      const userInfo = JSON.parse(userInfoStr)
      userState.isLoggedIn = true
      userState.userInfo.name = userInfo.name || ''
      userState.userInfo.id = userInfo.id || 'P100000'
    } catch (error) {
      console.error('恢复用户状态失败:', error)
      // 如果解析失败，清除无效数据
      localStorage.removeItem('userInfo')
    }
  }
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
  skipLogin,
  restoreUserState
}