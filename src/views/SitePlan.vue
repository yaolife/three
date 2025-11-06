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
        <div class="header-content_right">
          <div> <img src="@/images/add_text.png" alt="添加文字" style="width: 20px; height: 20px;"/></div>
            <div class="handle_btn">
              <div class="handle_btn_item"><img src="@/images/report.png" alt="生成报告" style="width: 20px; height: 20px; margin-right: 5px;"/><span>生成报告</span></div>
               <div class="handle_btn_item"><img src="@/images/preview.png" alt="预览" style="width: 20px; height: 20px; margin-right: 5px;" /><span>预览</span></div>
            </div>
      </div>
    </div>
    
    <!-- 主要内容区域 -->
    <div class="main-layout">
      <!-- 左侧导航菜单 -->
      <div class="left-sidebar">
        <div class="sidebar-header">
          <div class="project_name">起重机列表</div>
          <span class="add-btn">添加</span>
        </div>
        <div class="search-box">
          <el-input
            placeholder="搜索列表"
            prefix-icon="Search"
            size="small"
          />
          <div class="search-btn">搜索</div>
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
        
        <!-- 右侧内容区域 - 显示导入的图片 -->
        <div v-if="importedImage" class="image-container">
          <!-- <img :src="importedImage" alt="总平规划图" class="plan-image"> -->
           <img src="@/images/planning.png" alt="总平规划图" class="plan-image">
        </div>
        <div v-else-if="!dialogVisible" class="empty-content">
          <div class="empty-text">请添加施工场景图</div>
          <el-button type="primary" @click="dialogVisible = true">添加</el-button>
        </div>
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
// 存储导入的图片URL
const importedImage = ref(null)
// 用于文件上传的input元素引用
const fileInput = ref(null)

onMounted(() => {
  // 从路由参数获取项目ID
  projectId.value = route.params.id || ''
  console.log('总平规划项目ID:', projectId.value)
  // 加载项目数据
  loadProjectData()
  // 自动显示Dialog
  dialogVisible.value = false
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
  // 创建隐藏的文件输入元素
  if (!fileInput.value) {
    fileInput.value = document.createElement('input')
    fileInput.value.type = 'file'
    fileInput.value.accept = 'image/*'
    fileInput.value.onchange = (event) => {
      const file = event.target.files[0]
      if (file) {
        // 创建图片预览URL
        const reader = new FileReader()
        reader.onload = (e) => {
          importedImage.value = e.target.result
          console.log('已导入图片:', importedImage.value)
          // 关闭弹窗
          dialogVisible.value = false
        }
        reader.readAsDataURL(file)
      }
    }
  }
  // 触发文件选择对话框
  fileInput.value.click()
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
  height: 36px;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  flex-shrink: 0;
}
.project_title {
  font-size: 14px;
  border-right: 1px solid #9D9D9D;
  padding-right: 80px;
}
.header-content {
  display: flex;
  align-items: center;
}
.header-content_right{
  display: flex;
  padding: 0 20px;
  flex: 1;
  align-items: center;
  justify-content: space-between;
}
.header-content_right .handle_btn {
  display: flex;
  align-items: center;
  justify-content: center;
}
.header-content_right .handle_btn .handle_btn_item{ 
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 30px;
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
  display: flex;
  align-items: center;
  height: 32px;
  color: #0081F9;
  font-size: 12px;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 8px;
}

.search-btn {
    display: flex;
  align-items: center;
  justify-content: center;
  color: #FFF;
  border-radius: 3px;
background: #0775DB;
  width: 48px;
  height: 26px;
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

/* 图片容器样式 */
.image-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
}

.plan-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
}

/* 空内容状态样式 */
.empty-content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 20px;
}
</style>