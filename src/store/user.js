import { reactive } from 'vue'

// 创建用户状态
const userState = reactive({
  isLoggedIn: false,
  userInfo: {
    name: '',
    id: '',
    level: null // 账号级别：1为管理员，0为普通用户
  }
})

// 登录方法
const login = (username, userNickName = null, level = null) => {
  userState.isLoggedIn = true
  userState.userInfo.name = username
  // 如果提供了 userNickName，使用它；否则使用模拟工号
  userState.userInfo.id = userNickName || 'P100000'
  userState.userInfo.level = level !== null ? level : null
  
  // 保存用户信息到 localStorage
  localStorage.setItem('userInfo', JSON.stringify({
    name: username,
    id: userNickName || 'P100000',
    level: level !== null ? level : null
  }))
}

// 登出方法
const logout = () => {
  userState.isLoggedIn = false
  userState.userInfo.name = ''
  userState.userInfo.id = ''
  userState.userInfo.level = null
  
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
      userState.userInfo.level = userInfo.level !== undefined ? userInfo.level : null
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
  userState.userInfo.level = null
}

export default {
  userState,
  login,
  logout,
  skipLogin,
  restoreUserState
}