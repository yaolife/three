<template>
  <el-container class="app-container">
    <!-- 侧边栏 - 不在SitePlan页面显示 -->
    <el-aside v-if="!shouldHideSidebar" width="200px" class="sidebar-container">
      <div class="logo-container">
        <div v-if="userStore.userState.isLoggedIn" class="user-info">
          <el-image
            src="/src/images/user.png"
            alt="user"
            class="logo"
            :fit="'cover'"
          />
          <span class="logo-text">{{ userStore.userState.userInfo.id }}[{{ userStore.userState.userInfo.name }}]</span>
          <el-dropdown @command="handleCommand">
            <el-image
              src="/src/images/back.png"
              alt="user"
              class="back"
              :fit="'cover'"
            />
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
        <div v-else class="login-prompt" @click="handleLoginClick">
            <img
            src="@/images/user.png"
            alt="user"
            class="logo"
          />
          <span class="login-text">未登录，<span>点击登录</span></span>
        </div>
      </div>
      <el-menu
        :default-active="activeMenu"
        class="el-menu-vertical-demo"
        background-color="#191919"
        text-color="#bfcbd9"
        active-text-color="#FFFFFF"
        router
      >
        <el-menu-item index="/all-projects">
          <el-icon><FolderOpened /></el-icon>
          <span>全部项目</span>
        </el-menu-item>
        <el-menu-item index="/verification-projects">
          <el-icon><Document /></el-icon>
          <span>校核计算项目</span>
        </el-menu-item>
        <el-menu-item index="/virtual-simulation">
          <el-icon><VideoPlay /></el-icon>
          <span>虚拟仿真项目</span>
        </el-menu-item>
        <el-menu-item index="/construction-plans">
          <el-icon><Document /></el-icon>
          <span>总平规划项目</span>
        </el-menu-item>
        <!-- Added Data Management menu item -->
        <el-menu-item index="/data-management">
          <el-icon><DataAnalysis /></el-icon>
          <span>数据管理</span>
        </el-menu-item>
        <el-menu-item 
          v-if="userStore.userState.userInfo.level === 1" 
          index="/user-management"
        >
          <el-icon><User /></el-icon>
          <span>账号管理</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    
    <!-- 主内容区 -->
    <el-container>
      <!-- 顶部导航栏 -->
      <el-header v-if="!shouldHideHeader" class="header-container">
        <div class="header-left">
          <!-- <span class="user-name">{{ userStore.userState.isLoggedIn ? userStore.userState.userInfo.name : '未登录' }}</span> -->
          <!-- 只在项目列表页面显示创建项目按钮和搜索框 -->
          <template v-if="isProjectListPage">
            <el-button type="primary" size="large" @click="createProject">
              <el-icon style="font-size: 10px; margin-right: 5px;background-color: white;color: #06F;padding: 2px;"><Plus /></el-icon>
              创建项目
            </el-button>
            <div class="search-box">
              <el-input 
                v-model="searchTitle" 
                placeholder="请输入项目标题" 
                prefix-icon="Search" 
                size="large"
                @keyup.enter="handleSearch"
                clearable
              />
              <el-button type="default" size="large" style="margin-left: 8px" @click="handleSearch">
                搜索
              </el-button>
            </div>
          </template>
        </div>
        <div class="header-right">
          <el-button type="default" size="large" style="margin-left: 12px">
             <img
                 style="width: 22px; height: 22px;margin-right: 5px;"
                src="@/images/synchronize.png"
                alt="数据同步"
                :fit="'cover'"
              />
            <span>云端数据同步</span>
          </el-button>   
          <el-button type="default" size="large" style="margin-left: 12px" @click="handleCopy">
                  <img
                 style="width: 22px; height: 22px;margin-right: 5px;"
                src="@/images/copy.png"
                alt="复制"
                :fit="'cover'"
              />
             <span>复制</span>
          </el-button>
        </div>
      </el-header>
      
      <!-- 路由视图 -->
      <el-main :class="['main-container', shouldHideSidebar ? 'full-width' : '']">
        <router-view />
      </el-main>
    </el-container>

    <!-- 全局登录弹窗 -->
    <Teleport to="body">
      <el-dialog
        v-model="showLoginDialog"
        width="660px"
        style="padding: 0;"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        class="login-dialog"
        align-center
        append-to-body
        :show-close="true"
      >
        <template #header>
          <span class="login-dialog-header-title" >光热三维施工仿真软件</span>
        </template>
        <div class="login-dialog-content">
          <img src="@/images/zgh.png" alt="zgh" class="login-logo-img" />
          <div class="login-title-section">
            <h2 class="login-main-title">光热三维施工仿真软件</h2>
            <p class="login-sub-title">用户登录</p>
          </div>
          <span class="login-prompt-text">请输入您的用户名和密码</span>
          <div class="login-form">
            <div class="login-input-wrapper">
              <el-icon class="input-icon"><User /></el-icon>
              <el-input
                v-model="loginForm.username"
                placeholder="请输入用户名"
                class="login-input"
              />
            </div>
            <div class="login-input-wrapper">
              <el-icon class="input-icon"><Lock /></el-icon>
              <el-input
                v-model="loginForm.password"
                type="password"
                placeholder="请输入密码"
                class="login-input"
                show-password
                @keyup.enter="handleLogin"
              />
            </div>
          </div>
          <div class="login-buttons">
            <el-button type="primary" class="login-confirm-btn" @click="handleLogin" :loading="isConfirmLogging">
              确认登录
            </el-button>
            <el-button type="warning" class="login-offline-btn" @click="handleOfflineLogin" :loading="isAdminLogging">
              管理员登录
            </el-button>
          </div>
        </div>
      </el-dialog>
    </Teleport>
  </el-container>
</template>

<script setup>
import { ref, computed, reactive, onMounted, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  FolderOpened,
  VideoPlay,
  Document,
  Plus,
  Search,
  DataAnalysis,
  User,
  Lock,
} from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import userStore from './store/user.js';
import { login, loginOut } from './api/index.js';

const route = useRoute();
const router = useRouter();

// 搜索关键词
const searchTitle = ref("");

// 登录相关
const showLoginDialog = ref(false);
// 分开两个 loading 状态，避免两个按钮同时 loading
const isConfirmLogging = ref(false);
const isAdminLogging = ref(false);
const loginForm = reactive({
  username: "",
  password: "",
});

// 判断是否应该隐藏侧边栏
const shouldHideSidebar = computed(() => {
  return route.meta.hideSidebar || false;
});

// 判断是否应该隐藏顶部导航栏
const shouldHideHeader = computed(() => {
  return route.meta.hideHeader || false;
});

// 判断是否是项目列表页面
const isProjectListPage = computed(() => {
  const projectListPaths = ['/all-projects', '/verification-projects', '/virtual-simulation', '/construction-plans'];
  return projectListPaths.includes(route.path);
});

const activeMenu = computed(() => route.path || "/all-projects");

// 创建项目全局状态，用于在组件间传递
// 初始化为 false，确保只在明确点击按钮时才设置为 true
if (typeof window.createProjectFlag === 'undefined') {
  window.createProjectFlag = false;
}

const createProject = () => {
  // 未登录时，只提示，不打开登录弹窗，也不加载任何数据
  if (!userStore.userState.isLoggedIn) {
    ElMessage.warning('请先登录');
    return;
  }
  
  // 检查当前是否已经在全部项目页面
  if (route.path === '/all-projects') {
    // 直接使用全局方法打开弹窗，更可靠
    if (window.openProjectDialogDirect) {
      console.log('Using direct method to open project dialog');
      window.openProjectDialogDirect();
    } else {
      // 备用方案：使用setTimeout确保事件正确派发
      console.log('Falling back to event dispatch method');
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('openProjectDialog'));
      }, 100);
    }
  } else {
    // 导航到全部项目页面时，设置标志
    // 注意：只在导航时才设置标志，避免在已存在的页面中误触发
    console.log('Navigating to all-projects page');
    window.createProjectFlag = true;
    router.push('/all-projects');
  }
};

const handleLoginClick = () => {
  showLoginDialog.value = true;
};

const handleLogout = async () => {
  try {
    // 调用退出登录接口
    await loginOut();
    // 清除本地状态
    userStore.logout();
    ElMessage.success("已退出登录");
    // 跳转到全部项目页面并清空数据
    router.push('/all-projects').then(() => {
      // 使用 nextTick 确保组件已挂载
      nextTick(() => {
        if (window.clearProjectListDirect) {
          window.clearProjectListDirect();
        }
      });
    });
  } catch (error) {
    console.error("退出登录失败:", error);
    // 即使接口调用失败，也清除本地状态
    userStore.logout();
    ElMessage.warning("退出登录失败，已清除本地登录状态");
    // 跳转到全部项目页面并清空数据
    router.push('/all-projects').then(() => {
      // 使用 nextTick 确保组件已挂载
      nextTick(() => {
        if (window.clearProjectListDirect) {
          window.clearProjectListDirect();
        }
      });
    });
  }
};

// 处理登录（确认登录）
const handleLogin = async () => {
  if (!loginForm.username || !loginForm.password) {
    ElMessage.warning("请输入用户名和密码");
    return;
  }

  isConfirmLogging.value = true;
  try {
    const response = await login({
      userName: loginForm.username,
      password: loginForm.password,
      loginType: 0, // 0是确认登录
    });

    if (response && response.code === "0") {
      ElMessage.success("登录成功");
      showLoginDialog.value = false;
      // 保存登录信息
      if (response.data && response.data.token) {
        localStorage.setItem("token", response.data.token);
      }
      // 设置用户状态，使用接口返回的 userNickName 替换模拟工号
      if (response.data) {
        userStore.login(
          response.data.userName || loginForm.username,
          response.data.userNickName || null,
          response.data.level !== undefined ? response.data.level : null
        );
      }
      // 清空表单
      loginForm.username = "";
      loginForm.password = "";
      // 跳转到全部项目页面并刷新
      router.push('/all-projects').then(() => {
        triggerRefresh(null);
      });
    } else {
      ElMessage.error(response?.msg || "登录失败，请检查用户名和密码");
    }
  } catch (error) {
    console.error("登录失败:", error);
    ElMessage.error("登录失败，请稍后重试");
  } finally {
    isConfirmLogging.value = false;
  }
};

// 处理管理员登录（管理员登录独立 loading）
const handleOfflineLogin = async () => {
  if (!loginForm.username || !loginForm.password) {
    ElMessage.warning("请输入用户名和密码");
    return;
  }

  isAdminLogging.value = true;
  try {
    const response = await login({
      userName: loginForm.username,
      password: loginForm.password,
      loginType: 1, // 1是管理员登录
    });

    if (response && response.code === "0") {
      ElMessage.success("管理员登录成功");
      showLoginDialog.value = false;
      // 保存登录信息
      if (response.data && response.data.token) {
        localStorage.setItem("token", response.data.token);
      }
      // 设置用户状态，使用接口返回的 userNickName 替换模拟工号
      if (response.data) {
        userStore.login(
          response.data.userName || loginForm.username,
          response.data.userNickName || null,
          response.data.level !== undefined ? response.data.level : null
        );
      }
      // 清空表单
      loginForm.username = "";
      loginForm.password = "";
      // 跳转到全部项目页面并刷新
      router.push('/all-projects').then(() => {
        triggerRefresh(null);
      });
    } else {
      ElMessage.error(response?.msg || "管理员登录失败，请检查用户名和密码");
    }
  } catch (error) {
    console.error("管理员登录失败:", error);
    ElMessage.error("管理员登录失败，请稍后重试");
  } finally {
    isAdminLogging.value = false;
  }
};

const handleCommand = (command) => {
  if (command === 'logout') {
    handleLogout();
  }
};

// 触发刷新事件
const triggerRefresh = (projectType) => {
  console.log('触发刷新，项目类型:', projectType);
  
  // 优先使用直接调用方法，避免重复调用
  if (window.refreshProjectListDirect) {
    window.refreshProjectListDirect(projectType);
  } else {
    // 如果直接方法不存在，使用事件通知（备用方案）
    window.dispatchEvent(new CustomEvent('refreshProjectList', {
      detail: { projectType }
    }));
  }
};

// 处理复制按钮点击
const handleCopy = () => {
  console.log('复制按钮被点击，当前路由:', route.path);
  
  // 检查当前是否在项目列表页面
  const projectListPaths = ['/all-projects', '/verification-projects', '/virtual-simulation', '/construction-plans'];
  if (!projectListPaths.includes(route.path)) {
    ElMessage.warning('请在项目列表页面使用复制功能');
    return;
  }
  
  // 调用 AllProjects 组件的复制方法
  if (window.copyProjectDirect) {
    window.copyProjectDirect();
  } else {
    ElMessage.warning('复制功能暂不可用，请刷新页面后重试');
  }
};

// 处理搜索按钮点击
const handleSearch = () => {
  console.log('搜索按钮被点击，搜索关键词:', searchTitle.value);
  
  // 检查当前是否在项目列表页面
  const projectListPaths = ['/all-projects', '/verification-projects', '/virtual-simulation', '/construction-plans'];
  if (!projectListPaths.includes(route.path)) {
    ElMessage.warning('请在项目列表页面使用搜索功能');
    return;
  }
  
  // 调用 AllProjects 组件的搜索方法
  if (window.searchProjectDirect) {
    window.searchProjectDirect(searchTitle.value);
  } else {
    ElMessage.warning('搜索功能暂不可用，请刷新页面后重试');
  }
};

// 页面加载时恢复用户状态
onMounted(() => {
  userStore.restoreUserState();
  // 暴露 router 实例到 window，供 api/index.js 中的 checkResponseCode 使用
  window.__VUE_ROUTER__ = router;
  
  // 监听 token 被清除的事件，同步更新登录状态
  window.addEventListener("tokenCleared", () => {
    userStore.logout();
  });
  
  // 监听 storage 变化事件（处理跨标签页的情况）
  window.addEventListener("storage", (e) => {
    if (e.key === "token" && !e.newValue) {
      // token 被清除
      userStore.logout();
    }
  });
});
</script>

<style scoped>
.app-container {
  height: 100vh;
  overflow: hidden;
}

.sidebar-container {
  background-color: #191919;
  height: 100%;
}

.logo-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 0;
  border-bottom: 1px solid #435971;
}

/* 选中菜单项的文字样式和背景色 - 增强可读性 */
:deep(.el-menu-item.is-active) {
  color: #FFFFFF !important;
  font-weight: 600;
  background-color: rgba(0, 132, 255, 0.34) !important;
}

:deep(.el-menu-item.is-active span) {
  color: #FFFFFF !important;
  font-weight: 600;
}

:deep(.el-menu-item.is-active .el-icon) {
  color: #FFFFFF !important;
}

/* 选中菜单项悬停效果 */
:deep(.el-menu-item.is-active:hover) {
  background-color: rgba(0, 132, 255, 0.5) !important;
}

.user-info {
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: center;
}

.logo {
  width: 26px;
  height: 26px;
  margin-right: 10px;
}
.back {
  width: 18px;
  height: 18px;
  margin-left: 17px;
  cursor: pointer;
}
.logo-text {
  color: #fff;
  font-size: 16px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 120px;
}

.login-prompt {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 10px 0;
  cursor: pointer;
}

.login-text {
  color: #bfcbd9;
  font-size: 14px;
  text-align: center
}

.login-text span {
  color: rgba(206, 206, 206, 0.57);
  text-decoration: underline;
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-left {
  display: flex;
  align-items: center;
}

.user-name {
  font-size: 14px;
  color: #304156;
}

.header-right {
  display: flex;
  align-items: center;
}

.search-box {
  display: flex;
  align-items: center;
  margin-left: 12px;
}

.main-container {
  padding: 20px;
  background-color: #f0f2f5;
  overflow-y: auto;
}

.main-container.full-width {
  padding: 0;
  background-color: #ffffff;
}

/* 全局登录弹窗样式 */
.login-dialog :deep(.el-dialog) {
  margin: 0 !important;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 0 !important;
}

.login-dialog :deep(.el-dialog__wrapper) {
  padding: 0 !important;
}

.login-dialog :deep(.el-dialog__header) {
  padding: 20px 20px 0 20px !important;
  margin-bottom: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: none;
}

.login-dialog :deep(.el-dialog__headerbtn) {
  top: 10px;
  right: 20px;
}

.login-dialog :deep(.el-dialog__body) {
  padding: 0 !important;
}

.login-dialog :deep(.el-dialog__container) {
  padding: 0 !important;
}

.login-dialog-header-title {
  color:  #303030;
  font-size: 12px;
  font-weight: 600;
  margin-left: 16px;
  position: relative;
  top: 10px;
}

.login-dialog-content {
  display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  padding: 40px 0 0 0;
  background-image: url('@/images/login_bg.png'), linear-gradient(180deg, #000 0%, #1F415C 69.71%, #000F1B 100%);
  background-size: cover, 100% 100%;
  background-position: center, center;
  background-repeat: no-repeat, no-repeat;
  position: relative;
  overflow: hidden;
}

.login-logo-img {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 2;
  max-width: 145px;
  max-height: 60px;
  object-fit: contain;
}

/* 背景装饰 - 起重机轮廓 */
.login-dialog-content::before {
  content: '';
  position: absolute;
  bottom: -50px;
  left: -50px;
  width: 200px;
  height: 200px;

  opacity: 0.3;
  pointer-events: none;
}

.login-dialog-content::after {
  content: '';
  position: absolute;
  top: -50px;
  right: -50px;
  width: 200px;
  height: 300px;
  opacity: 0.3;
  pointer-events: none;
}

.login-title-section {
  text-align: center;
  margin-bottom: 20px;
  position: relative;
  z-index: 1;
}

.login-main-title {
  color: #fff;
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 10px 0;
}

.login-sub-title {
  color: #fff;
  font-size: 16px;
  margin: 0;
}

.login-prompt-text {
  color: rgba(255, 255, 255, 0.70);
font-weight: 400;
  font-size: 14px;
 width: 50%;
  position: relative;
  z-index: 1; 
}

.login-form {
  width: 50%;
  margin-bottom: 30px;
  position: relative;
  z-index: 1;
}

.login-input-wrapper {
  position: relative;
  margin-bottom: 20px;
}

.input-icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
  z-index: 2;
  font-size: 18px;
}

.login-input :deep(.el-input__wrapper) {
  padding-left: 45px;
  border-radius: 6px;
  background-color: #fff;
  box-shadow: none;
}

.login-input :deep(.el-input__wrapper:hover) {
  box-shadow: none;
}

.login-input :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px #409eff inset;
}

.login-input :deep(.el-input__inner) {
  height: 45px;
  line-height: 45px;
}

.login-buttons {
  flex-direction: column;
  gap: 15px;
  width: 25%;
  position: relative;
  z-index: 1;
  margin-bottom: 0;
  padding-bottom: 40px;
}

.login-confirm-btn,
.login-offline-btn {
  width: 100%;
  margin-bottom: 10px;
  height: 45px;
  font-size: 16px;
  border-radius: 6px;
  border: none;
}

.login-confirm-btn {
  background-color: #409eff;
  border-color: #409eff;
  color: #fff;
}

.login-confirm-btn:hover {
  background-color: #66b1ff;
  border-color: #66b1ff;
}

.login-offline-btn {
  background-color: #e6a23c;
  border-color: #e6a23c;
  color: #fff;
}

.login-offline-btn:hover {
  background-color: #ebb563;
  border-color: #ebb563;
}
.el-dialog__header.show-close{
  display: flex;
  align-items: center;
}
</style>
