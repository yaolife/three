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
          <el-button type="default" size="large" style="margin-left: 12px" @click="handleRefresh">
              <img
                 style="width: 22px; height: 22px;margin-right: 5px;"
                src="@/images/refresh.png"
                alt="更新"
                :fit="'cover'"
              />
              <span>更新</span>
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
import { ElMessage } from "element-plus";
import userStore from './store/user.js';

const route = useRoute();
const router = useRouter();

// 搜索关键词
const searchTitle = ref("");

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
  console.log('Create project button clicked');
  
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

// 处理更新按钮点击
const handleRefresh = () => {
  console.log('更新按钮被点击，当前路由:', route.path);
  
  // 根据当前路由路径确定项目类型
  let projectType = null;
  
  if (route.path === '/verification-projects') {
    projectType = 0; // 校核计算项目
  } else if (route.path === '/virtual-simulation') {
    projectType = 1; // 虚拟仿真项目
  } else if (route.path === '/construction-plans') {
    projectType = 2; // 总平规划项目
  } else if (route.path === '/all-projects') {
    projectType = null; // 全部项目，不传 projectType
  }
  
  // 如果当前不在项目列表页面，先导航到对应的页面
  const projectListPaths = ['/all-projects', '/verification-projects', '/virtual-simulation', '/construction-plans'];
  if (!projectListPaths.includes(route.path)) {
    // 不在项目列表页面，导航到全部项目页面
    router.push('/all-projects');
    // 等待路由切换完成后再触发刷新
    setTimeout(() => {
      triggerRefresh(null);
    }, 100);
  } else {
    // 在当前页面触发刷新
    triggerRefresh(projectType);
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

.main-container.full-width {
  padding: 0;
  background-color: #ffffff;
}
</style>
