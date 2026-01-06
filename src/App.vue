<template>
  <el-container 
    class="app-container"
    :class="{ 'route-welcome': route.path === '/welcome' }"
  >
    <!-- 主内容区（移除侧边栏，宽屏显示） -->
    <el-container>
      <!-- 顶部导航栏：未登录时不显示 -->
      <el-header 
        v-if="isLoggedIn && !shouldHideHeader" 
        :class="['header-container', route.path === '/welcome' ? 'header-transparent' : '']"
      >
        <div class="header-left">
          <el-button
            v-if="isMenuPage"
            type="default"
            size="large"
            class="back-btn"
            @click="openMenuDialog"
          >
            <img src="@/images/back.png" alt="back" class="back-icon" />
            <span style="margin-left: 4px">返回</span>
          </el-button>
          <span v-if="isMenuPage && currentMenuLabel" class="header-menu-label">
            {{ currentMenuLabel }}
          </span>
          <el-button
            v-else-if="isEditPage"
            type="default"
            size="large"
            class="back-btn"
            @click="handleBackToList"
          >
            <img src="@/images/back.png" alt="back" class="back-icon" />
            <span style="margin-left: 4px">返回</span>
          </el-button>
          <span v-if="isEditPage && backMenuLabel" class="header-menu-label">
            {{ backMenuLabel }}
          </span>
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
            <img class="logout-icon" src="@/images/exit.png" alt="logout" />
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
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
      
      <!-- 背景图组件：只在welcome路由页面显示（登录和未登录都显示） -->
      <Background v-if="route.path === '/welcome'" :key="route.path" />
      
      <!-- 路由视图 -->
      <el-main
        v-if="isLoggedIn || route.path === '/welcome'"
        :class="['main-container', shouldHideSidebar ? 'full-width' : '', route.path === '/welcome' ? 'welcome-page-container' : '']"
      >
        <router-view />
      </el-main>
    </el-container>

    <!-- 功能菜单弹窗 -->
    <Teleport to="body">
      <el-dialog
         v-model="showMenuDialog"
        width="600px"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false"
        append-to-body
        class="menu-dialog"
      >
        <template #header>
          <div class="menu-dialog-header">
            <span>功能菜单</span>
          </div>
        </template>
        <div class="menu-dialog-content">
          <div
            v-for="item in menuOptions"
            :key="item.path"
            class="menu-dialog-item"
            @click="handleMenuSelect(item.path)"
          >
            {{ item.label }}
          </div>
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
                    layout="prev, pager, next"
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
                    layout="prev, pager, next"
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
                    layout="prev, pager, next"
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
                    layout="prev, pager, next"
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
        :show-close="false"
      >
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
            <el-button  class="login-confirm-btn" @click="handleLogin" :loading="isConfirmLogging">
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
  Close,
} from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import userStore from './store/user.js';
import { login, loginOut, getCraneInfoPage, getLiftingInfoPage, getDeviceInfoPage, getCraneModelPage, dataSynchronization } from './api/index.js';
import { translateLiftingType, translateCraneType } from './utils/common.js';
import Background from './components/Background.vue';

const route = useRoute();
const router = useRouter();

// 是否已登录
const isLoggedIn = computed(() => userStore.userState.isLoggedIn);

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
  const projectListPaths = ['/verification-projects', '/virtual-simulation', '/construction-plans'];
  return projectListPaths.includes(route.path);
});

const isMenuPage = computed(() => route.meta.isMenuPage);
const isEditPage = computed(() => route.meta.isEditPage);
const backToPath = computed(() => route.meta.backTo || '/verification-projects');

const activeMenu = computed(() => route.path || "/verification-projects");

// 所有功能菜单配置（用于菜单渲染和返回按钮文字）
const ALL_MENUS = [
  { label: "校核计算", path: "/verification-projects", menuValue: "0" },
  { label: "三维仿真", path: "/virtual-simulation", menuValue: "1" },
  { label: "总平规划平台", path: "/construction-plans", menuValue: "2" },
  { label: "数据管理", path: "/data-management", menuValue: "3" },
  { label: "账号管理", path: "/user-management", menuValue: "4" },
];

const menuOptions = computed(() => {
  // 获取用户菜单权限
  const userMenus = userStore.userState.userInfo.menus || [];
  
  // 根据用户的 menus 数组过滤菜单
  return ALL_MENUS.filter(menu => {
    // 将 menuValue 转换为字符串进行比较
    return userMenus.includes(String(menu.menuValue));
  });
});

// 根据路径获取功能菜单名称
const getMenuLabelByPath = (path) => {
  const item = ALL_MENUS.find((menu) => menu.path === path);
  return item ? item.label : "";
};

// 当前页面对应的菜单名称（用于菜单页返回按钮）
const currentMenuLabel = computed(() => getMenuLabelByPath(route.path));

// 编辑页返回路径对应的菜单名称（用于编辑页返回按钮）
const backMenuLabel = computed(() => getMenuLabelByPath(backToPath.value));

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

  // 如果当前就在任意一个项目列表页面（校核 / 三维仿真 / 总平规划），
  // 直接在当前页面打开创建项目弹窗，不再跳转到其它路由
  if (isProjectListPage.value) {
    if (window.openProjectDialogDirect) {
      console.log('Using direct method to open project dialog on current list page');
      window.openProjectDialogDirect();
    } else {
      console.log('Falling back to event dispatch method on current list page');
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('openProjectDialog'));
      }, 100);
    }
    return;
  }

  // 兼容旧逻辑：如果将来在非列表页面也需要“创建项目”，再通过标志跳转
  console.log('Navigating to verification-projects page for project creation');
  window.createProjectFlag = true;
  router.push('/verification-projects');
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

const handleBackToList = () => {
  router.push(backToPath.value);
};

const openMenuDialog = () => {
  if (!userStore.userState.isLoggedIn) {
    ElMessage.warning("请先登录");
    showLoginDialog.value = true;
    return;
  }
  showMenuDialog.value = true;
};

const closeMenuDialog = () => {
  showMenuDialog.value = false;
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
    // 先关闭菜单弹窗
    showMenuDialog.value = false;
    // 跳转到welcome页面以显示背景图
    await router.push('/welcome');
    // 使用 nextTick 确保组件已挂载
    await nextTick();
    if (window.clearProjectListDirect) {
      window.clearProjectListDirect();
    }
    // 显示登录弹窗
    showLoginDialog.value = true;
  } catch (error) {
    console.error("退出登录失败:", error);
    // 即使接口调用失败，也清除本地状态
    userStore.logout();
    ElMessage.warning("退出登录失败，已清除本地登录状态");
    // 先关闭菜单弹窗
    showMenuDialog.value = false;
    // 跳转到welcome页面以显示背景图
    await router.push('/welcome');
    // 使用 nextTick 确保组件已挂载
    await nextTick();
    if (window.clearProjectListDirect) {
      window.clearProjectListDirect();
    }
    // 显示登录弹窗
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
          0, // loginType: 0是确认登录
          response.data.menus || null // 菜单权限
        );
      }
      // 清空表单
      loginForm.username = "";
      loginForm.password = "";
      // 跳转到登录后的空白中转页，并弹出功能菜单供选择
      router.push('/welcome').then(() => {
        nextTick(() => {
          openMenuDialog();
        });
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
          1, // loginType: 1是管理员登录
          response.data.menus || null // 菜单权限
        );
      }
      // 清空表单
      loginForm.username = "";
      loginForm.password = "";
      // 跳转到登录后的空白中转页，并弹出功能菜单供选择
      router.push('/welcome').then(() => {
        nextTick(() => {
          openMenuDialog();
        });
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
  const projectListPaths = ['/verification-projects', '/virtual-simulation', '/construction-plans'];
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
  const projectListPaths = ['/verification-projects', '/virtual-simulation', '/construction-plans'];
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
onMounted(async () => {
  userStore.restoreUserState();
  
  if (!userStore.userState.isLoggedIn) {
    // 未登录时，确保在welcome页面
    if (route.path !== '/welcome') {
      await router.push('/welcome');
      await nextTick();
    }
    showLoginDialog.value = true;
  } else {
    // 如果已登录，自动显示功能菜单弹窗
    // 使用 nextTick 确保组件完全挂载后再显示菜单
    nextTick(() => {
      // 如果当前不在欢迎页面，先跳转到欢迎页面
      if (route.path !== '/welcome') {
        router.push('/welcome').then(() => {
          nextTick(() => {
            openMenuDialog();
          });
        });
      } else {
        // 如果已经在欢迎页面，直接显示菜单
        openMenuDialog();
      }
    });
  }
  // 暴露 router 实例到 window，供 api/index.js 中的 checkResponseCode 使用
  window.__VUE_ROUTER__ = router;
  
  // 监听 token 被清除的事件，同步更新登录状态
  window.addEventListener("tokenCleared", async () => {
    userStore.logout();
    // 跳转到welcome页面
    if (route.path !== '/welcome') {
      await router.push('/welcome');
      await nextTick();
    }
    // 显示登录弹窗
    showLoginDialog.value = true;
  });
  
  // 监听 storage 变化事件（处理跨标签页的情况）
  window.addEventListener("storage", async (e) => {
    if (e.key === "token" && !e.newValue) {
      // token 被清除
      userStore.logout();
      // 跳转到welcome页面
      if (route.path !== '/welcome') {
        await router.push('/welcome');
        await nextTick();
      }
      // 显示登录弹窗
      showLoginDialog.value = true;
    }
  });
});
</script>

<style scoped>
.app-container {
  height: 100vh;
  overflow: hidden;
  margin: 0;
  padding: 0;
  background-color: #f0f2f5; /* 默认背景色，非welcome页面使用 */
}

/* welcome页面时，外层app-container也要消除所有间距 */
.app-container.route-welcome {
  margin: 0 !important;
  padding: 0 !important;
  border: none !important;
  position: relative;
  background-color: transparent !important; /* welcome页面时透明，让背景图完全显示 */
}

/* welcome页面时，确保el-container也隐藏滚动条 */
.app-container :deep(.el-container) {
  height: 100%;
  overflow: hidden;
  margin: 0;
  padding: 0;
}

/* welcome页面时，所有el-container都要消除间距 */
.app-container.route-welcome :deep(.el-container) {
  margin: 0 !important;
  padding: 0 !important;
  border: none !important;
  background-color: transparent !important; /* welcome页面时透明，让背景图完全显示 */
}

/* welcome页面时，内层el-container也要消除间距 */
.app-container.route-welcome :deep(.el-container > .el-container) {
  margin: 0 !important;
  margin-top: 0 !important;
  margin-bottom: 0 !important;
  margin-left: 0 !important;
  margin-right: 0 !important;
  padding: 0 !important;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
  padding-left: 0 !important;
  padding-right: 0 !important;
  border: none !important;
  border-top: none !important;
  border-bottom: none !important;
}

/* welcome页面时，el-main也要隐藏滚动条 */
.app-container :deep(.el-main) {
  overflow: hidden;
}

/* welcome页面时，确保el-header没有默认的margin和padding，消除白色边框 */
.app-container.route-welcome :deep(.el-header) {
  margin: 0 !important;
  margin-top: 0 !important;
  margin-bottom: 0 !important;
  margin-left: 0 !important;
  margin-right: 0 !important;
  padding: 0 !important;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
  padding-left: 0 !important;
  padding-right: 0 !important;
  height: auto !important;
  min-height: auto !important;
  max-height: none !important;
  border: none !important;
  border-top: none !important;
  border-bottom: none !important;
  border-left: none !important;
  border-right: none !important;
  line-height: normal !important;
  vertical-align: top !important;
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
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 1000;
  background-color: #fff; /* 默认白色背景 */
  margin: 0 !important;
  margin-top: 0 !important;
  margin-bottom: 0 !important;
  border: none !important;
  border-top: none !important;
  border-bottom: none !important;
}

/* welcome页面时，导航栏默认也应该是透明的，让背景图完全显示 */
.app-container.route-welcome .header-container {
  background-color: transparent !important;
  box-shadow: none !important;
}

/* welcome页面时，导航栏透明，让背景图透过来 */
.header-container.header-transparent {
  background-color: transparent !important;
  box-shadow: none !important;
  position: relative;
  z-index: 1000;
  margin: 0 !important;
  margin-top: 0 !important;
  margin-bottom: 0 !important;
  margin-left: 0 !important;
  margin-right: 0 !important;
  padding: 0 20px !important; /* 只保留左右padding，用于内容对齐 */
  padding-top: 0 !important;
  padding-bottom: 0 !important;
  border: none !important;
  border-top: none !important;
  border-bottom: none !important;
  border-left: none !important;
  border-right: none !important;
  height: auto !important;
  min-height: auto !important;
  max-height: none !important;
  line-height: normal !important;
  vertical-align: top !important;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.back-btn {
  color: #878787;
  margin-right: 16px;
  font-size: 14px;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 2px;
  background: #FDFDFD;
  box-shadow: -1px -1px 0 0 rgba(0, 0, 0, 0.15) inset;
}

.back-icon {
  width: 18px;
  height: 18px;
  margin-right: 4px;
  vertical-align: middle;
}

.header-menu-label {
  font-size: 14px;
  font-weight: 600;
  color: #303030;
}

/* 登录后，导航栏元素使用白色，让它们在背景图上可见 */
.header-transparent .back-btn {
  color: #ffffff;
  background-color: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
}

.header-transparent .back-btn:hover {
  background-color: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
}

.user-name {
  font-size: 14px;
  color: #304156;
}

/* 登录后，用户名文字改为白色 */
.header-transparent .user-name {
  color: #ffffff;
  font-weight: 500;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* welcome页面时，header-right右侧要有间距，顶部要有10px间距 */
.header-container.header-transparent .header-right {
  margin-right: 20px; /* 给复制按钮等元素右侧留出间距 */
  margin-top: 10px !important; /* welcome页面时，与顶部保留10px间距 */
}

.user-status {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 6px 10px;
  border-radius: 6px;
  transition: background-color 0.2s ease;
  position: relative;
  z-index: 1;
}

.user-status:hover {
  background: #f5f7fa;
}

/* 登录后，用户状态悬停效果 */
.header-transparent .user-status:hover {
  background: rgba(255, 255, 255, 0.2);
}

.user-icon {
  width: 26px;
  height: 26px;
  margin-right: 8px;
  position: relative;
  z-index: 1;
}


.user-name {
  font-size: 14px;
  color: #304156;
  white-space: nowrap;
  position: relative;
  z-index: 1;
}

/* 登录后，用户名文字改为白色 */
.header-transparent .user-name {
  color: #ffffff;
  font-weight: 500;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
}

.logout-icon {
  width: 20px;
  height: 20px;
  cursor: pointer;
  position: relative;
  z-index: 1;
}

/* 登录后，退出图标添加白色滤镜 */
.header-transparent .logout-icon {
  filter: brightness(0) invert(1);
}

.menu-button {
  padding: 10px 16px;
}

.search-box {
  display: flex;
  align-items: center;
  margin-left: 12px;
  position: relative;
  z-index: 1;
}

/* 登录后，搜索框和按钮的样式 */
.header-transparent .search-box :deep(.el-input__wrapper) {
  background-color: rgba(255, 255, 255, 0.9);
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.3) inset;
}

.header-transparent .search-box :deep(.el-input__inner) {
  color: #303133;
}

.header-transparent .search-box :deep(.el-input__prefix) {
  color: #606266;
}

.header-transparent .search-box .el-button {
  color: #ffffff;
  background-color: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
}

.header-transparent .search-box .el-button:hover {
  background-color: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
}

/* 登录后，导航栏按钮（创建项目、复制、云端数据同步）的样式 */
.header-transparent .header-left .el-button,
.header-transparent .header-right .el-button {
  color: #ffffff;
  background-color: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
  position: relative;
  z-index: 1;
}

.header-transparent .header-left .el-button:hover,
.header-transparent .header-right .el-button:hover {
  background-color: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
}

/* 创建项目按钮（primary类型）的特殊样式 */
.header-transparent .header-left .el-button--primary {
  background-color: rgba(64, 158, 255, 0.8);
  border-color: rgba(64, 158, 255, 0.9);
  color: #ffffff;
}

.header-transparent .header-left .el-button--primary:hover {
  background-color: rgba(64, 158, 255, 0.9);
  border-color: rgba(64, 158, 255, 1);
}

/* 登录后，导航栏按钮中的图标和图片的样式 */
.header-transparent .header-left .el-button img,
.header-transparent .header-right .el-button img {
  filter: brightness(0) invert(1);
}

/* 下拉菜单图标样式 */
.header-transparent .el-dropdown {
  position: relative;
  z-index: 1;
}

.main-container {
  padding: 20px;
  background-color: #f0f2f5; /* 默认背景色 */
  overflow-y: auto;
  position: relative;
  z-index: 1;
}

/* welcome页面时，main-container也应该是透明的，让背景图完全显示 */
.app-container.route-welcome .main-container {
  background-color: transparent !important;
}

/* welcome页面时，背景透明，让背景图透过来 */
.main-container.welcome-page-container {
  background-color: transparent;
}

.main-container.full-width {
  padding: 0;
  background-color: transparent;
}

.main-container.welcome-page-container {
  padding: 0 !important;
  background-color: transparent !important; /* 确保透明，让背景图显示 */
  overflow: hidden !important;
  overflow-y: hidden !important;
  overflow-x: hidden !important;
  position: relative;
  height: 100%;
  z-index: 1; /* 确保内容在背景图上方 */
}

/* welcome页面时，el-main也要隐藏滚动条 */
.main-container.welcome-page-container :deep(.el-main) {
  overflow: hidden !important;
  height: 100%;
}

.menu-dialog-content {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 30px;
  padding: 20px;
}

.menu-dialog-item {
  width: 100%;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 8px;
  color: #2B507D;
  font-size: 18px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  user-select: none;
border: 1px solid #B3B3B3;
  background-color: #e8e8e8;
box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);
}

.menu-dialog-item:hover {
  background-color: #d8d8d8;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
  cursor: pointer;
}

.menu-dialog-item:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.menu-dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 18px;
  font-weight: 600;
  padding: 16px 20px;
  border-bottom: 1px solid #e4e7ed;
}

.menu-dialog :deep(.el-dialog__body) {
  padding: 0 !important;
}

.menu-close {
  cursor: pointer;
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
  padding-bottom: 0 !important;
  margin-bottom: 0 !important;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: none;
}

/* 覆盖 Element Plus 使用的 CSS 变量 - 必须在多个层级设置 */
.login-dialog {
  --el-dialog-padding-primary: 0 !important;
}

.login-dialog :deep(.el-dialog) {
  --el-dialog-padding-primary: 0 !important;
}

.login-dialog :deep(.el-dialog__header) {
  --el-dialog-padding-primary: 0 !important;
  padding-bottom: 0 !important;
}

/* 使用更具体的选择器确保覆盖 */
.login-dialog.el-dialog :deep(.el-dialog__header),
.login-dialog :deep(.el-dialog .el-dialog__header),
body .login-dialog :deep(.el-dialog__header) {
  padding-bottom: 0 !important;
  --el-dialog-padding-primary: 0 !important;
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
  background: #ffffff;
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
  color:#245E85;
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 10px 0;
}

.login-sub-title {
  color: #245E85;
  font-size: 16px;
  margin: 0;
}

.login-prompt-text {
  color: #666666;
  font-weight: 400;
   margin-bottom: 2px;
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
  border-radius: 1px;
border: 1px solid #A2A2A2;
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
  background-color: #245E85;
  border-color: #245E85;
  color: #fff;
}

.login-confirm-btn:hover {
  background-color: #245E85;
  border-color: #245E85;
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

/* 云端数据同步弹窗：表格分页和总计挨在一起且居中 */
.sync-dialog .pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
}

.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
}

.pagination-info {
  color: #606266;
  font-size: 14px;
}
</style>

<style>
/* 全局样式：确保覆盖 Element Plus 的默认 padding-bottom */
.login-dialog .el-dialog__header {
  padding-bottom: 0 !important;
  --el-dialog-padding-primary: 0 !important;
}

body .login-dialog .el-dialog__header {
  padding-bottom: 0 !important;
  --el-dialog-padding-primary: 0 !important;
}

/* 全局样式：所有 table 的表头样式 */
.el-table__header th,
.el-table__header th.el-table__cell,
.el-table__header-wrapper .el-table__header th,
.el-table__header-wrapper .el-table__header th.el-table__cell,
.el-table thead th.el-table__cell {
  border-radius: 1px !important;
  background: #EBEBEB !important;
  color: #454545 !important;
  font-size: 14px !important;
  border: none !important;
  border-bottom: none !important;
  border-right: none !important;
}

/* 全局样式：所有 table 的分页样式 */
.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  padding: 20px;
}

.pagination-info {
  color: #606266;
  font-size: 14px;
  margin-right: 0;
}

/* 分页组件样式优化 */
.el-pagination {
  display: flex;
  align-items: center;
  justify-content: center;
}

.el-pagination .btn-prev,
.el-pagination .btn-next {
  min-width: 32px;
  height: 32px;
  line-height: 32px;
  padding: 0 8px;
  border: none;
  background-color: transparent;
  color: #000;
  border-radius: 0;
  margin: 0 4px;
}

.el-pagination .btn-prev:hover,
.el-pagination .btn-next:hover {
  color: #000;
  border-radius: 2px;
  background: rgba(191, 191, 191, 0.32);
}

.el-pagination .btn-prev.is-disabled,
.el-pagination .btn-next.is-disabled {
  color: #c0c4cc;
  border-color: #e4e7ed;
  background-color: #f5f7fa;
  cursor: not-allowed;
}

.el-pagination .el-pager {
  display: flex;
  align-items: center;
  gap: 4px;
}

.el-pagination .el-pager li {
  min-width: 32px;
  height: 32px;
  line-height: 32px;
  padding: 0 4px;
  border-radius: 0;
  border: none;
  background-color: transparent;
  color: #606266;
  margin: 0 2px;
  cursor: pointer;
  text-align: center;
}

.el-pagination .el-pager li:hover {
  color: #000;
  border-radius: 2px;
  border: 1px solid #000;
  background: #FFF;
  box-shadow: 2px 2px 0 0 rgba(0, 0, 0, 0.25);
}

.el-pagination .el-pager li.is-active {
  color: #000;
  border-radius: 2px;
  border: 1px solid #000;
  background: #FFF;
  font-weight: 500;
  box-shadow: 2px 2px 0 0 rgba(0, 0, 0, 0.25);
}

.el-pagination .el-pager li.more {
  border: none;
  background: transparent;
  cursor: default;
}

.el-pagination .el-pager li.more:hover {
  color: #606266;
  border: none;
}

/* 全局样式：所有 table 操作列中的按钮样式 */
.el-table .el-button {
  background-color: transparent !important;
  border: none !important;
  box-shadow: none !important;
  color: #578FFF !important;
  font-size: 14px !important;
  padding: 0 4px;
}

.el-table .el-button:hover {
  background-color: transparent !important;
  color: #578FFF !important;
}

/* 全局样式：所有 table 每一行底部线条颜色 */
.el-table__body td,
.el-table__body td.el-table__cell {
  border-bottom: 1px solid rgba(80, 80, 80, 0.30) !important;
}
</style>
