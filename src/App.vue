<template>
  <el-container class="app-container">
    <!-- 侧边栏 -->
    <el-aside width="200px" class="sidebar-container">
      <div class="logo-container">
        <img src="/vite.svg" alt="Logo" class="logo" />
        <span class="logo-text">光热三维施工仿真软件</span>
      </div>
      <el-menu
        :default-active="activeMenu"
        class="el-menu-vertical-demo"
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
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
        <el-menu-item index="/check-calculation">
          <span>校核计算</span>
        </el-menu-item>
        <el-menu-item index="/construction-plans">
          <el-icon><Document /></el-icon>
          <span>施工平立面图</span>
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
      <el-header class="header-container">
        <div class="header-left">
          <span class="user-name">张三(P100000)</span>
        </div>
        <div class="header-right">
          <el-button type="primary" size="small" @click="createProject">
            <el-icon><Plus /></el-icon>
            创建项目
          </el-button>
          <div class="search-box">
            <el-input placeholder="搜索" prefix-icon="Search" size="small" />
            <el-button type="default" size="small" style="margin-left: 8px;">
              搜索
            </el-button>
          </div>
          <el-button type="default" size="small" style="margin-left: 12px;">
            云数据同步
          </el-button>
          <el-button type="default" size="small" style="margin-left: 12px;">
            更新
          </el-button>
          <el-button type="default" size="small" style="margin-left: 12px;">
            帮助
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
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import {
  FolderOpened,
  VideoPlay,
  Document,
  Delete,
  Plus,
  Search
} from '@element-plus/icons-vue'

const route = useRoute()
const activeMenu = computed(() => route.path || '/all-projects')

const createProject = () => {
  // 创建项目的逻辑将在这里实现
  console.log('创建新项目')
}
</script>

<style scoped>
.app-container {
  height: 100vh;
  overflow: hidden;
}

.sidebar-container {
  background-color: #304156;
  height: 100%;
}

.logo-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 0;
  border-bottom: 1px solid #435971;
}

.logo {
  width: 40px;
  height: 40px;
  margin-right: 10px;
}

.logo-text {
  color: #fff;
  font-size: 16px;
  font-weight: 500;
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