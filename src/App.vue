<template>
  <el-container class="app-container">
    <!-- 侧边栏 -->
    <el-aside width="200px" class="sidebar-container">
      <div class="logo-container">
        <div v-if="userStore.userState.isLoggedIn" class="user-info">
          <el-image
            src="/src/images/user.png"
            alt="user"
            class="logo"
            :fit="'cover'"
          />
          <span class="logo-text">{{ userStore.userState.userInfo.name }}[{{ userStore.userState.userInfo.id }}]</span>
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
        active-text-color="rgba(0, 132, 255, 0.34)"
        router
      >
        <el-menu-item index="/all-projects">
          <el-icon><FolderOpened /></el-icon>
          <span>全部项目</span>
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
        <el-menu-item index="/recycle-bin">
          <el-icon><Delete /></el-icon>
          <span>回收站</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    
    <!-- 主内容区 -->
    <el-container>
      <!-- 顶部导航栏 -->
      <el-header v-if="!shouldHideHeader" class="header-container">
        <div class="header-left">
          <!-- <span class="user-name">{{ userStore.userState.isLoggedIn ? userStore.userState.userInfo.name : '未登录' }}</span> -->
        <el-button type="primary" size="large" @click="createProject">
            <el-icon style="font-size: 10px; margin-right: 5px;background-color: white;color: #06F;padding: 2px;"><Plus /></el-icon>
            创建项目
          </el-button>
          <div class="search-box">
            <el-input placeholder="搜索" prefix-icon="Search" size="large" />
            <el-button type="default" size="large" style="margin-left: 8px">
              搜索
            </el-button>
          </div>
        </div>
        <div class="header-right">
     
          <el-button v-if="userStore.userState.isLoggedIn" type="default" size="small" @click="handleLogout" style="margin-left: 12px">
            退出登录
          </el-button>
          <el-button type="default" size="large" style="margin-left: 12px">
             <img
                 style="width: 22px; height: 22px;margin-right: 5px;"
                src="@/images/synchronize.png"
                alt="数据同步"
                :fit="'cover'"
              />
            <span>云端数据同步</span>
          </el-button>   
          <el-button type="default" size="large" style="margin-left: 12px">
              <img
                 style="width: 22px; height: 22px;margin-right: 5px;"
                src="@/images/refresh.png"
                alt="更新"
                :fit="'cover'"
              />
              <span>更新</span>
          </el-button>
              <el-button type="default" size="large" style="margin-left: 12px">
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
      <el-main class="main-container">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  FolderOpened,
  VideoPlay,
  Document,
  Delete,
  Plus,
  Search,
  DataAnalysis,
} from "@element-plus/icons-vue";
import userStore from './store/user.js';

const route = useRoute();
const router = useRouter();

// 判断是否应该隐藏侧边栏
const shouldHideSidebar = computed(() => {
  return route.meta.hideSidebar || false;
});

// 判断是否应该隐藏顶部导航栏
const shouldHideHeader = computed(() => {
  return route.meta.hideHeader || false;
});

const activeMenu = computed(() => route.path || "/all-projects");

// 创建项目全局状态，用于在组件间传递
window.createProjectFlag = false;

const createProject = () => {
  console.log('Create project button clicked');
  // 设置创建项目标志，确保全局可访问
  window.createProjectFlag = true;
  
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
    // 导航到全部项目页面，路由变化会触发AllProjects组件的onMounted或watch
    console.log('Navigating to all-projects page');
    router.push('/all-projects');
  }
};

const handleLoginClick = () => {
  router.push('/login');
};

const handleLogout = () => {
  userStore.logout();
  router.push('/login');
};

const handleCommand = (command) => {
  if (command === 'logout') {
    handleLogout();
  }
};
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
</style>
