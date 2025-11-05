<template>
  <div class="site-plan-container">
    <!-- 页面顶部标题 -->
    <div class="page-header">
      <div class="header-content">
        <el-button type="text" class="back-btn" @click="handleBack">
          <el-icon><ArrowLeft /></el-icon>
        </el-button>
        <div class="project_title">总平规划xxx项目</div>
      </div>
    </div>
    
    <!-- 主要内容区域 -->
    <div class="main-layout">
      <!-- 左侧导航菜单 -->
      <div class="left-sidebar">
        <div class="sidebar-header">
          <div class="project_name">起重机列表</div>
          <el-button type="primary" size="small" class="add-btn">添加</el-button>
        </div>
        <div class="search-box">
          <el-input
            placeholder="搜索列表"
            prefix-icon="Search"
            size="small"
          />
          <el-button type="primary" size="small" class="search-btn">搜索</el-button>
        </div>
      </div>
      
      <!-- 右侧内容区 -->
      <div class="right-content">
        <!-- 使用Element Plus的Dialog组件，设置为水平垂直居中 -->
        <el-dialog
          v-model="dialogVisible"
          title="添加施工场景"
          width="360px"   
          top="20%"
          :close-on-click-modal="false"
          :close-on-press-escape="false"
          class="site-plan-dialog"
        >
          <div class="empty-state">
            <div class="empty-text">暂无施工场景，请导入相关平面图！</div>
            <el-button type="primary" @click="handleImportPlan">点击添加</el-button>
          </div>
          <template #footer>
            <span class="dialog-footer">
              <!-- 可以在这里添加其他操作按钮 -->
            </span>
          </template>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowLeft, Search, Close } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()

// 从路由参数获取项目ID
const projectId = ref('')
// 控制Dialog显示
const dialogVisible = ref(true)

onMounted(() => {
  // 从路由参数获取项目ID
  projectId.value = route.params.id || ''
  console.log('总平规划项目ID:', projectId.value)
  // 加载项目数据
  loadProjectData()
  // 自动显示Dialog
  dialogVisible.value = true
})

// 加载项目数据
const loadProjectData = () => {
  console.log('加载项目数据，项目ID:', projectId.value)
  // 这里可以添加加载项目数据的逻辑
}

// 处理返回按钮点击
const handleBack = () => {
  router.push({ name: 'AllProjects' })
}

// 处理关闭弹窗
const handleCloseModal = () => {
  dialogVisible.value = false
  // 可以在这里添加关闭弹窗后的处理逻辑
  console.log('关闭弹窗')
}

// 处理导入平面图
const handleImportPlan = () => {
  console.log('导入平面图功能')
  // 这里可以实现文件上传逻辑
  ElMessage.info('平面图导入功能待实现')
}
</script>

<style scoped>
.site-plan-container {
  width: 100%;
  height: 100%;
  min-height: 100vh;
  background-color: #f0f2f5;
  padding: 0;
  margin: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.page-header {
  color:  #303030;
  border-bottom: 1px solid #E4E4E4;
background: #FFF;
box-shadow: 0 3px 4.2px 0 rgba(0, 0, 0, 0.05);
  padding: 0 24px;
  height: 36px;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  flex-shrink: 0;
}
.project_title {
  font-size: 14px;
  border-right: 1px solid #9D9D9D;
  padding-right: 60px;
}
.header-content {
  display: flex;
  align-items: center;
  width: 100%;
}

.back-btn {
  color: #000000;
  margin-right: 16px;
  font-size: 20px;
}

.back-btn:hover {
  color: #000000;
  cursor: pointer;
}

.page-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 500;
}

.main-layout {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.left-sidebar {
  width: 200px;
  background-color: #ffffff;
  border-right: 1px solid #e8e8e8;
  padding: 16px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.project_name {
  font-size: 14px;
  color: #303133;
}

.add-btn {
  height: 32px;
  padding: 0 12px;
  font-size: 12px;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 8px;
}

.search-btn {
  height: 32px;
  padding: 0 12px;
  font-size: 12px;
}

.right-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 24px;
  background-color: #f0f2f5;
}

/* 确保Dialog弹窗水平垂直居中 */
.site-plan-dialog {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

:deep(.el-dialog__wrapper) {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.empty-state {
  text-align: center;
  padding: 20px 0;
}

.empty-text {
  font-size: 14px;
  color: #606266;
  margin-bottom: 20px;
}

:deep(.el-dialog__body) {
  padding: 20px;
}

:deep(.el-button--primary) {
  background-color: #1890ff;
  border-color: #1890ff;
}
</style>