<template>
  <el-container class="app-container">
    <!-- 主内容区（移除侧边栏，宽屏显示） -->
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
          <div class="user-status" @click="handleStatusClick">
            <img class="user-icon" src="@/images/user.png" alt="user" />
            <span class="user-name">{{ displayUserName }}</span>
          </div>
          <el-dropdown v-if="userStore.userState.isLoggedIn" @command="handleCommand">
            <img class="logout-icon" src="@/images/back.png" alt="logout" />
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-button type="primary" size="large" class="menu-button" @click="openMenuDialog">
            功能菜单
          </el-button>
          <el-button 
            v-if="userStore.userState.userInfo?.loginType === 0"
            type="default" 
            size="large" 
            style="margin-left: 12px" 
            @click="handleDataSynchronization"
          >
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

    <!-- 功能菜单弹窗 -->
    <Teleport to="body">
      <el-dialog
        v-model="showMenuDialog"
        title="功能菜单"
        width="420px"
        :close-on-click-modal="false"
        append-to-body
      >
        <div class="menu-dialog-content">
          <el-button
            v-for="item in menuOptions"
            :key="item.path"
            type="default"
            class="menu-dialog-item"
            @click="handleMenuSelect(item.path)"
          >
            {{ item.label }}
          </el-button>
        </div>
      </el-dialog>
    </Teleport>

    <!-- 云端数据同步弹窗 -->
    <Teleport to="body">
      <el-dialog
        v-model="showSyncDialog"
        title="云端数据同步"
        width="90%"
        :close-on-click-modal="false"
        align-center
        append-to-body
        :show-close="true"
        class="sync-dialog"
      >
        <div class="sync-dialog-content">
          <el-tabs v-model="syncActiveTab" class="sync-tabs">
            <!-- 起重机数据库 -->
            <el-tab-pane label="起重机数据库" name="crane">
              <div class="sync-tab-content">
                <div class="sync-toolbar">
                  <div class="search-group">
                    <el-input
                      v-model="syncCraneSearch"
                      placeholder="请输入起重机名称"
                      prefix-icon="Search"
                      style="width: 240px"
                      clearable
                      @keyup.enter="handleSyncCraneSearch"
                    />
                    <el-button type="primary" @click="handleSyncCraneSearch" style="margin-left: 8px">
                      搜索
                    </el-button>
                  </div>
                </div>
                <el-table
                  :data="syncCraneData"
                  v-loading="syncCraneLoading"
                  style="width: 100%"
                  :header-cell-style="{ background: '#f5f7fa' }"
                  @selection-change="handleSyncCraneSelectionChange"
                >
                  <el-table-column type="selection" width="55" />
                  <el-table-column label="序号" width="80">
                    <template #default="scope">
                      {{ scope.$index + 1 + (syncCranePage - 1) * syncCranePageSize }}
                    </template>
                  </el-table-column>
                  <el-table-column prop="machineName" label="起重机名称" min-width="150" />
                  <el-table-column prop="type" label="类型" min-width="120">
                    <template #default="scope">
                      {{ translateCraneType(scope.row.type) }}
                    </template>
                  </el-table-column>
                  <el-table-column prop="model" label="型号" min-width="150" />
                  <el-table-column prop="prodBusiness" label="生产厂家" min-width="150" />
                </el-table>
                <div class="pagination-container">
                  <div class="pagination-info">共 {{ syncCraneTotal }} 条</div>
                  <el-pagination
                    v-model:current-page="syncCranePage"
                    v-model:page-size="syncCranePageSize"
                    :page-sizes="[10, 20, 50, 100]"
                    :total="syncCraneTotal"
                    layout="prev, pager, next, jumper, sizes"
                    @current-change="handleSyncCranePageChange"
                    @size-change="handleSyncCranePageSizeChange"
                  />
                </div>
              </div>
            </el-tab-pane>

            <!-- 吊索具数据库 -->
            <el-tab-pane label="吊索具数据库" name="rigging">
              <div class="sync-tab-content">
                <div class="sync-toolbar">
                  <div class="search-group">
                    <el-input
                      v-model="syncRiggingSearch"
                      placeholder="请输入吊索具名称"
                      prefix-icon="Search"
                      style="width: 240px"
                      clearable
                      @keyup.enter="handleSyncRiggingSearch"
                    />
                    <el-button type="primary" @click="handleSyncRiggingSearch" style="margin-left: 8px">
                      搜索
                    </el-button>
                  </div>
                </div>
                <el-table
                  :data="syncRiggingData"
                  v-loading="syncRiggingLoading"
                  style="width: 100%"
                  :header-cell-style="{ background: '#f5f7fa' }"
                  @selection-change="handleSyncRiggingSelectionChange"
                >
                  <el-table-column type="selection" width="55" />
                  <el-table-column label="序号" width="80">
                    <template #default="scope">
                      {{ scope.$index + 1 + (syncRiggingPage - 1) * syncRiggingPageSize }}
                    </template>
                  </el-table-column>
                  <el-table-column prop="liftingName" label="吊索具名称" min-width="150" />
                  <el-table-column prop="liftingType" label="类型" min-width="120">
                    <template #default="scope">
                      {{ translateLiftingType(scope.row.liftingType) }}
                    </template>
                  </el-table-column>
                  <el-table-column prop="twoLiftingName" label="子类型" width="120" />
                  <el-table-column prop="prodBusiness" label="生产厂家" min-width="150" />
                </el-table>
                <div class="pagination-container">
                  <div class="pagination-info">共 {{ syncRiggingTotal }} 条</div>
                  <el-pagination
                    v-model:current-page="syncRiggingPage"
                    v-model:page-size="syncRiggingPageSize"
                    :page-sizes="[10, 20, 50, 100]"
                    :total="syncRiggingTotal"
                    layout="prev, pager, next, jumper, sizes"
                    @current-change="handleSyncRiggingPageChange"
                    @size-change="handleSyncRiggingPageSizeChange"
                  />
                </div>
              </div>
            </el-tab-pane>

            <!-- 设备数据库 -->
            <el-tab-pane label="设备数据库" name="equipment">
              <div class="sync-tab-content">
                <div class="sync-toolbar">
                  <div class="search-group">
                    <el-input
                      v-model="syncEquipmentSearch"
                      placeholder="请输入设备名称"
                      prefix-icon="Search"
                      style="width: 240px"
                      clearable
                      @keyup.enter="handleSyncEquipmentSearch"
                    />
                    <el-button type="primary" @click="handleSyncEquipmentSearch" style="margin-left: 8px">
                      搜索
                    </el-button>
                  </div>
                </div>
                <el-table
                  :data="syncEquipmentData"
                  v-loading="syncEquipmentLoading"
                  style="width: 100%"
                  :header-cell-style="{ background: '#f5f7fa' }"
                  @selection-change="handleSyncEquipmentSelectionChange"
                >
                  <el-table-column type="selection" width="55" />
                  <el-table-column label="序号" width="80">
                    <template #default="scope">
                      {{ scope.$index + 1 + (syncEquipmentPage - 1) * syncEquipmentPageSize }}
                    </template>
                  </el-table-column>
                  <el-table-column prop="deviceName" label="设备名称" min-width="150" />
                  <el-table-column prop="deviceType" label="型号" min-width="120" />
                  <el-table-column prop="prodBusiness" label="生产厂家" min-width="150" />
                </el-table>
                <div class="pagination-container">
                  <div class="pagination-info">共 {{ syncEquipmentTotal }} 条</div>
                  <el-pagination
                    v-model:current-page="syncEquipmentPage"
                    v-model:page-size="syncEquipmentPageSize"
                    :page-sizes="[10, 20, 50, 100]"
                    :total="syncEquipmentTotal"
                    layout="prev, pager, next, jumper, sizes"
                    @current-change="handleSyncEquipmentPageChange"
                    @size-change="handleSyncEquipmentPageSizeChange"
                  />
                </div>
              </div>
            </el-tab-pane>

            <!-- 起重机模型库 -->
            <el-tab-pane label="起重机模型库" name="craneModel">
              <div class="sync-tab-content">
                <div class="sync-toolbar">
                  <div class="search-group">
                    <el-input
                      v-model="syncCraneModelSearch"
                      placeholder="请输入模型名称"
                      prefix-icon="Search"
                      style="width: 240px"
                      clearable
                      @keyup.enter="handleSyncCraneModelSearch"
                    />
                    <el-button type="primary" @click="handleSyncCraneModelSearch" style="margin-left: 8px">
                      搜索
                    </el-button>
                  </div>
                </div>
                <el-table
                  :data="syncCraneModelData"
                  v-loading="syncCraneModelLoading"
                  style="width: 100%"
                  :header-cell-style="{ background: '#f5f7fa' }"
                  @selection-change="handleSyncCraneModelSelectionChange"
                >
                  <el-table-column type="selection" width="55" />
                  <el-table-column label="序号" width="80">
                    <template #default="scope">
                      {{ scope.$index + 1 + (syncCraneModelPage - 1) * syncCraneModelPageSize }}
                    </template>
                  </el-table-column>
                  <el-table-column prop="modelName" label="模型名称" min-width="150" />
                  <el-table-column prop="createName" label="创建人" width="120" />
                  <el-table-column prop="createTime" label="录入时间" width="180" />
                </el-table>
                <div class="pagination-container">
                  <div class="pagination-info">共 {{ syncCraneModelTotal }} 条</div>
                  <el-pagination
                    v-model:current-page="syncCraneModelPage"
                    v-model:page-size="syncCraneModelPageSize"
                    :page-sizes="[10, 20, 50, 100]"
                    :total="syncCraneModelTotal"
                    layout="prev, pager, next, jumper, sizes"
                    @current-change="handleSyncCraneModelPageChange"
                    @size-change="handleSyncCraneModelPageSizeChange"
                  />
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
        <template #footer>
          <div class="sync-dialog-footer">
            <el-button @click="handleCancelSync">取消同步</el-button>
            <el-button type="primary" @click="handleConfirmSync">确定同步</el-button>
          </div>
        </template>
      </el-dialog>
    </Teleport>

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
import { ref, computed, reactive, onMounted, nextTick, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
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
import { login, loginOut, getCraneInfoPage, getLiftingInfoPage, getDeviceInfoPage, getCraneModelPage, dataSynchronization } from './api/index.js';
import { translateLiftingType, translateCraneType } from './utils/common.js';

const route = useRoute();
const router = useRouter();

// 搜索关键词
const searchTitle = ref("");

// 云端数据同步弹窗相关
const showSyncDialog = ref(false);
const syncActiveTab = ref("crane");

// 起重机同步数据
const syncCraneSearch = ref("");
const syncCranePage = ref(1);
const syncCranePageSize = ref(10);
const syncCraneTotal = ref(0);
const syncCraneData = ref([]);
const syncCraneLoading = ref(false);
const syncCraneSelected = ref([]);

// 吊索具同步数据
const syncRiggingSearch = ref("");
const syncRiggingPage = ref(1);
const syncRiggingPageSize = ref(10);
const syncRiggingTotal = ref(0);
const syncRiggingData = ref([]);
const syncRiggingLoading = ref(false);
const syncRiggingSelected = ref([]);

// 设备同步数据
const syncEquipmentSearch = ref("");
const syncEquipmentPage = ref(1);
const syncEquipmentPageSize = ref(10);
const syncEquipmentTotal = ref(0);
const syncEquipmentData = ref([]);
const syncEquipmentLoading = ref(false);
const syncEquipmentSelected = ref([]);

// 起重机模型库同步数据
const syncCraneModelSearch = ref("");
const syncCraneModelPage = ref(1);
const syncCraneModelPageSize = ref(10);
const syncCraneModelTotal = ref(0);
const syncCraneModelData = ref([]);
const syncCraneModelLoading = ref(false);
const syncCraneModelSelected = ref([]);

// 登录相关
const showLoginDialog = ref(false);
const showMenuDialog = ref(false);
// 分开两个 loading 状态，避免两个按钮同时 loading
const isConfirmLogging = ref(false);
const isAdminLogging = ref(false);
const loginForm = reactive({
  username: "",
  password: "",
});

// 判断是否应该隐藏侧边栏（侧边栏已移除，始终使用全宽）
const shouldHideSidebar = computed(() => true);

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

const menuOptions = computed(() => {
  const baseMenus = [
    { label: "校核计算项目", path: "/verification-projects" },
    { label: "虚拟仿真项目", path: "/virtual-simulation" },
    { label: "总平规划项目", path: "/construction-plans" },
    { label: "数据管理", path: "/data-management" },
  ];
  if (userStore.userState.userInfo.level === 1) {
    baseMenus.push({ label: "账号管理", path: "/user-management" });
  }
  return baseMenus;
});

const displayUserName = computed(() => {
  if (!userStore.userState.isLoggedIn) return "未登录，点击登录";
  const info = userStore.userState.userInfo || {};
  const id = info.id || info.userName || "";
  const name = info.name || info.userNickName || info.userName || "";
  if (id && name) return `${id}[${name}]`;
  return id || name || "已登录";
});

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

const handleStatusClick = () => {
  if (!userStore.userState.isLoggedIn) {
    showLoginDialog.value = true;
    return;
  }
  openMenuDialog();
};

const openMenuDialog = () => {
  if (!userStore.userState.isLoggedIn) {
    ElMessage.warning("请先登录");
    showLoginDialog.value = true;
    return;
  }
  showMenuDialog.value = true;
};

const handleMenuSelect = (path) => {
  showMenuDialog.value = false;
  router.push(path);
};

const handleLogout = async () => {
  try {
    // 调用退出登录接口
    await loginOut();
    // 清除本地状态
    userStore.logout();
    ElMessage.success("已退出登录");
    // 跳转到默认页面并清空数据
    router.push('/verification-projects').then(() => {
      // 使用 nextTick 确保组件已挂载
      nextTick(() => {
        if (window.clearProjectListDirect) {
          window.clearProjectListDirect();
        }
      });
    });
    showLoginDialog.value = true;
  } catch (error) {
    console.error("退出登录失败:", error);
    // 即使接口调用失败，也清除本地状态
    userStore.logout();
    ElMessage.warning("退出登录失败，已清除本地登录状态");
    // 跳转到默认页面并清空数据
    router.push('/verification-projects').then(() => {
      // 使用 nextTick 确保组件已挂载
      nextTick(() => {
        if (window.clearProjectListDirect) {
          window.clearProjectListDirect();
        }
      });
    });
    showLoginDialog.value = true;
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
          response.data.level !== undefined ? response.data.level : null,
          0 // loginType: 0是确认登录
        );
      }
      // 清空表单
      loginForm.username = "";
      loginForm.password = "";
      // 跳转到默认页面并刷新
      router.push('/verification-projects').then(() => {
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
          response.data.level !== undefined ? response.data.level : null,
          1 // loginType: 1是管理员登录
        );
      }
      // 清空表单
      loginForm.username = "";
      loginForm.password = "";
      // 跳转到默认页面并刷新
      router.push('/verification-projects').then(() => {
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

// 处理云端数据同步按钮点击
const handleDataSynchronization = () => {
  if (!userStore.userState.isLoggedIn) {
    ElMessage.warning('请先登录');
    return;
  }
  showSyncDialog.value = true;
  syncActiveTab.value = "crane";
  // 重置数据
  syncCranePage.value = 1;
  syncRiggingPage.value = 1;
  syncEquipmentPage.value = 1;
  syncCraneModelPage.value = 1;
  syncCraneSelected.value = [];
  syncRiggingSelected.value = [];
  syncEquipmentSelected.value = [];
  syncCraneModelSelected.value = [];
  // 加载数据
  fetchSyncCraneData();
  fetchSyncRiggingData();
  fetchSyncEquipmentData();
  fetchSyncCraneModelData();
};

// 获取同步起重机数据
const fetchSyncCraneData = async () => {
  syncCraneLoading.value = true;
  try {
    const params = {
      pageNum: syncCranePage.value,
      pageSize: syncCranePageSize.value,
      push: 1, // 只获取推送的数据
    };
    
    if (syncCraneSearch.value && syncCraneSearch.value.trim()) {
      params.machineName = syncCraneSearch.value.trim();
    }
    
    const response = await getCraneInfoPage(params);

    if (response && response.code === "0") {
      const records = response.data.records || [];
      syncCraneData.value = records.map((item) => ({
        ...item,
        typeDisplay: translateCraneType(item.type),
        originalType: item.type,
        type: translateCraneType(item.type),
        push: item.push !== undefined && item.push !== null ? item.push : 0,
      }));
      syncCraneTotal.value = response.data.total || 0;
    } else {
      syncCraneData.value = [];
      syncCraneTotal.value = 0;
      ElMessage.error(response?.message || "获取起重机数据失败");
    }
  } catch (error) {
    console.error("获取起重机数据失败:", error);
    syncCraneData.value = [];
    syncCraneTotal.value = 0;
    ElMessage.error("获取数据失败，请检查网络连接");
  } finally {
    syncCraneLoading.value = false;
  }
};

// 获取同步起重机模型库数据
const fetchSyncCraneModelData = async () => {
  syncCraneModelLoading.value = true;
  try {
    const params = {
      pageNum: syncCraneModelPage.value,
      pageSize: syncCraneModelPageSize.value,
      push: 1, // 只获取推送的数据
    };

    if (syncCraneModelSearch.value && syncCraneModelSearch.value.trim()) {
      params.modelName = syncCraneModelSearch.value.trim();
    }

    const response = await getCraneModelPage(params);

    if (response && response.code === "0") {
      const records = response.data.records || [];
      syncCraneModelData.value = records.map((item) => ({
        ...item,
        push: item.push !== undefined && item.push !== null ? item.push : 0,
      }));
      syncCraneModelTotal.value = response.data.total || 0;
    } else {
      syncCraneModelData.value = [];
      syncCraneModelTotal.value = 0;
      ElMessage.error(response?.message || "获取起重机模型库数据失败");
    }
  } catch (error) {
    console.error("获取起重机模型库数据失败:", error);
    syncCraneModelData.value = [];
    syncCraneModelTotal.value = 0;
    ElMessage.error("获取数据失败，请检查网络连接");
  } finally {
    syncCraneModelLoading.value = false;
  }
};

// 获取同步吊索具数据
const fetchSyncRiggingData = async () => {
  syncRiggingLoading.value = true;
  try {
    const params = {
      pageNum: syncRiggingPage.value,
      pageSize: syncRiggingPageSize.value,
      push: 1, // 只获取推送的数据
    };
    
    if (syncRiggingSearch.value && syncRiggingSearch.value.trim()) {
      params.liftingName = syncRiggingSearch.value.trim();
    }
    
    const response = await getLiftingInfoPage(params);

    if (response && response.code === "0") {
      const records = response.data.records || [];
      syncRiggingData.value = records.map((item) => ({
        ...item,
        liftingType: translateLiftingType(item.liftingType),
        push: item.push !== undefined && item.push !== null ? item.push : 0,
      }));
      syncRiggingTotal.value = response.data.total || 0;
    } else {
      syncRiggingData.value = [];
      syncRiggingTotal.value = 0;
      ElMessage.error(response?.message || "获取数据失败");
    }
  } catch (error) {
    console.error("获取吊索具数据失败:", error);
    syncRiggingData.value = [];
    syncRiggingTotal.value = 0;
    ElMessage.error("获取数据失败，请检查网络连接");
  } finally {
    syncRiggingLoading.value = false;
  }
};

// 获取同步设备数据
const fetchSyncEquipmentData = async () => {
  syncEquipmentLoading.value = true;
  try {
    const params = {
      pageNum: syncEquipmentPage.value,
      pageSize: syncEquipmentPageSize.value,
      push: 1, // 只获取推送的数据
    };
    
    if (syncEquipmentSearch.value && syncEquipmentSearch.value.trim()) {
      params.deviceName = syncEquipmentSearch.value.trim();
    }
    
    const response = await getDeviceInfoPage(params);

    if (response && response.code === "0") {
      const records = response.data.records || [];
      syncEquipmentData.value = records.map((item) => ({
        ...item,
        push: item.push !== undefined && item.push !== null ? item.push : 0,
      }));
      syncEquipmentTotal.value = response.data.total || 0;
    } else {
      syncEquipmentData.value = [];
      syncEquipmentTotal.value = 0;
      ElMessage.error(response?.message || "获取设备数据失败");
    }
  } catch (error) {
    console.error("获取设备数据失败:", error);
    syncEquipmentData.value = [];
    syncEquipmentTotal.value = 0;
    ElMessage.error("获取数据失败，请检查网络连接");
  } finally {
    syncEquipmentLoading.value = false;
  }
};

// 起重机分页变化
const handleSyncCranePageChange = (page) => {
  syncCranePage.value = page;
  fetchSyncCraneData();
};

const handleSyncCranePageSizeChange = (size) => {
  syncCranePageSize.value = size;
  syncCranePage.value = 1;
  fetchSyncCraneData();
};

// 起重机搜索
const handleSyncCraneSearch = () => {
  syncCranePage.value = 1;
  fetchSyncCraneData();
};

// 吊索具分页变化
const handleSyncRiggingPageChange = (page) => {
  syncRiggingPage.value = page;
  fetchSyncRiggingData();
};

const handleSyncRiggingPageSizeChange = (size) => {
  syncRiggingPageSize.value = size;
  syncRiggingPage.value = 1;
  fetchSyncRiggingData();
};

// 吊索具搜索
const handleSyncRiggingSearch = () => {
  syncRiggingPage.value = 1;
  fetchSyncRiggingData();
};

// 设备分页变化
const handleSyncEquipmentPageChange = (page) => {
  syncEquipmentPage.value = page;
  fetchSyncEquipmentData();
};

const handleSyncEquipmentPageSizeChange = (size) => {
  syncEquipmentPageSize.value = size;
  syncEquipmentPage.value = 1;
  fetchSyncEquipmentData();
};

// 设备搜索
const handleSyncEquipmentSearch = () => {
  syncEquipmentPage.value = 1;
  fetchSyncEquipmentData();
};

// 起重机模型库分页变化
const handleSyncCraneModelPageChange = (page) => {
  syncCraneModelPage.value = page;
  fetchSyncCraneModelData();
};

const handleSyncCraneModelPageSizeChange = (size) => {
  syncCraneModelPageSize.value = size;
  syncCraneModelPage.value = 1;
  fetchSyncCraneModelData();
};

// 起重机模型库搜索
const handleSyncCraneModelSearch = () => {
  syncCraneModelPage.value = 1;
  fetchSyncCraneModelData();
};

// 选择变化处理
const handleSyncCraneSelectionChange = (selection) => {
  syncCraneSelected.value = selection;
};

const handleSyncRiggingSelectionChange = (selection) => {
  syncRiggingSelected.value = selection;
};

const handleSyncEquipmentSelectionChange = (selection) => {
  syncEquipmentSelected.value = selection;
};

const handleSyncCraneModelSelectionChange = (selection) => {
  syncCraneModelSelected.value = selection;
};

// 取消同步
const handleCancelSync = () => {
  showSyncDialog.value = false;
};

// 确定同步
const handleConfirmSync = async () => {
  // 收集所有选中的数据
  const syncData = [];
  
  // 起重机数据 (type: 0)
  if (syncCraneSelected.value.length > 0) {
    syncData.push({
      type: 0,
      dataId: syncCraneSelected.value.map(item => item.id)
    });
  }
  
  // 吊索具数据 (type: 1)
  if (syncRiggingSelected.value.length > 0) {
    syncData.push({
      type: 1,
      dataId: syncRiggingSelected.value.map(item => item.id)
    });
  }
  
  // 设备数据 (type: 2)
  if (syncEquipmentSelected.value.length > 0) {
    syncData.push({
      type: 2,
      dataId: syncEquipmentSelected.value.map(item => item.id)
    });
  }
  
  // 起重机模型库数据 (type: 3)
  if (syncCraneModelSelected.value.length > 0) {
    syncData.push({
      type: 3,
      dataId: syncCraneModelSelected.value.map(item => item.id)
    });
  }
  
  if (syncData.length === 0) {
    ElMessage.warning("请至少选择一条数据进行同步");
    return;
  }
  
  try {
    // 调用同步接口
    for (const item of syncData) {
      const response = await dataSynchronization(item);
      if (response && response.code === '0') {
        ElMessage.success(`${item.type === 0 ? '起重机' : item.type === 1 ? '吊索具' : item.type === 2 ? '设备' : '起重机模型库'}数据同步成功`);
      } else {
        ElMessage.error(response?.message || `${item.type === 0 ? '起重机' : item.type === 1 ? '吊索具' : item.type === 2 ? '设备' : '起重机模型库'}数据同步失败`);
      }
    }
    // 关闭弹窗
    showSyncDialog.value = false;
    // 清空选择
    syncCraneSelected.value = [];
    syncRiggingSelected.value = [];
    syncEquipmentSelected.value = [];
    syncCraneModelSelected.value = [];
  } catch (error) {
    console.error("数据同步失败:", error);
    ElMessage.error("数据同步失败，请检查网络连接");
  }
};

// 监听同步弹窗tab切换
watch(syncActiveTab, (newTab) => {
  if (showSyncDialog.value) {
    if (newTab === "crane" && syncCraneData.value.length === 0) {
      fetchSyncCraneData();
    } else if (newTab === "rigging" && syncRiggingData.value.length === 0) {
      fetchSyncRiggingData();
    } else if (newTab === "equipment" && syncEquipmentData.value.length === 0) {
      fetchSyncEquipmentData();
    } else if (newTab === "craneModel" && syncCraneModelData.value.length === 0) {
      fetchSyncCraneModelData();
    }
  }
});

// 页面加载时恢复用户状态
onMounted(() => {
  userStore.restoreUserState();
  if (!userStore.userState.isLoggedIn) {
    showLoginDialog.value = true;
  }
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
  gap: 12px;
}

.user-status {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 6px 10px;
  border-radius: 6px;
  transition: background-color 0.2s ease;
}

.user-status:hover {
  background: #f5f7fa;
}

.user-icon {
  width: 26px;
  height: 26px;
  margin-right: 8px;
}

.user-name {
  font-size: 14px;
  color: #304156;
  white-space: nowrap;
}

.logout-icon {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.menu-button {
  padding: 10px 16px;
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

.menu-dialog-content {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 12px;
}

.menu-dialog-item {
  width: 100%;
  justify-content: center;
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

/* 云端数据同步弹窗样式 */
.sync-dialog :deep(.el-dialog__body) {
  padding: 20px;
  max-height: 70vh;
  overflow-y: auto;
}

.sync-dialog-content {
  min-height: 400px;
}

.sync-tabs {
  width: 100%;
}

.sync-tab-content {
  padding: 20px 0;
}

.sync-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.sync-toolbar .search-group {
  display: flex;
  align-items: center;
}

.sync-dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding: 0 20px;
}

.pagination-info {
  color: #606266;
  font-size: 14px;
}
</style>
