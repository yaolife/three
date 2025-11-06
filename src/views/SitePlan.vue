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
          <span class="add-btn" @click="addCrane">添加</span>
        </div>
        <div class="search-box">
          <el-input
            v-model="searchQuery"
            placeholder="搜索列表"
            prefix-icon="Search"
            size="small"
          />
          <div class="search-btn">搜索</div>
        </div>
        
        <!-- 起重机列表 -->
        <div class="crane-list">
          <div 
            v-for="crane in filteredCranes" 
            :key="crane.id"
            :class="['crane-item', { 'selected': selectedCrane && selectedCrane.id === crane.id }]"
            @click="selectCrane(crane)"
          >
            <span class="crane-name">{{ crane.name }}</span>
            <el-icon class="delete-icon" @click.stop="deleteCrane(crane.id)">
          <img src="@/images/c_delete.png" alt="总平规划图" style="width: 15px; height: 15px;">
            </el-icon>
          </div>
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
        
        <!-- 任务属性编辑悬浮框 -->
        <div v-if="selectedCrane" class="property-panel">
          <div class="panel-header">
            <div class="panel-title">任务属性编辑</div>
          </div>
          <div class="panel-content">
            <div class="property-item">
              <label>名称</label>
              <el-input v-model="selectedCrane.name" placeholder="请输入名称" />
            </div>
            <div class="property-item">
              <label>起重机</label>
              <el-input v-model="selectedCrane.type" placeholder="xxx履带式起重机" />
            </div>
            <div class="property-item">
              <label>防范颜色</label>
              <div class="color-input-wrapper">
                <el-input v-model="selectedCrane.color" placeholder="#26256B" />
                <div class="color-preview" :style="{ backgroundColor: selectedCrane.color }"></div>
              </div>
            </div>
            <div class="property-item">
              <label>场地使用宽度</label>
              <el-input-number v-model="selectedCrane.width" :min="0" :step="1" placeholder="10" />
              <span class="unit">m</span>
            </div>
            <div class="property-item">
              <label>使用时间</label>
              <el-input-number v-model="selectedCrane.time" :min="0" :step="1" placeholder="10" />
              <span class="unit">d</span>
            </div>
            <div class="property-item">
              <label>地面承载力</label>
              <el-input-number v-model="selectedCrane.load" :min="0" :step="1" placeholder="10" />
              <span class="unit">t</span>
            </div>
            <div class="property-item">
              <label>点位设置</label>
              <el-button type="primary" size="small" @click="setCranePosition">设置点位</el-button>
            </div>
            <div class="property-item">
              <el-button type="primary" size="small" @click="addNewPosition">添加防范站位</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
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

// 起重机相关数据
const cranes = ref([])
const selectedCrane = ref(null)
const searchQuery = ref('')
const craneCounter = ref(0) // 用于生成起重机名称

onMounted(() => {
  // 从路由参数获取项目ID
  projectId.value = route.params.id || ''
  console.log('总平规划项目ID:', projectId.value)
  // 加载项目数据
  loadProjectData()
  // 自动显示Dialog
  dialogVisible.value = false
})

// 计算属性：过滤后的起重机列表
const filteredCranes = computed(() => {
  if (!searchQuery.value) return cranes.value
  return cranes.value.filter(crane => 
    crane.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

// 添加起重机
const addCrane = () => {
  craneCounter.value++
  const newCrane = {
    id: Date.now(),
    name: `起重机${craneCounter.value}`,
    type: 'xxx履带式起重机',
    color: '#26256B',
    width: 10,
    time: 10,
    load: 10,
    position: null
  }
  cranes.value.push(newCrane)
  ElMessage.success('起重机已添加')
}

// 删除起重机
const deleteCrane = (id) => {
  cranes.value = cranes.value.filter(crane => crane.id !== id)
  if (selectedCrane.value && selectedCrane.value.id === id) {
    selectedCrane.value = null
  }
  ElMessage.success('起重机已删除')
}

// 选择起重机
const selectCrane = (crane) => {
  selectedCrane.value = { ...crane }
}

// 设置起重机点位
const setCranePosition = () => {
  // 这里可以实现点击图片设置点位的逻辑
  ElMessage.info('请在场景图中点击设置点位')
}

// 添加防范站位
const addNewPosition = () => {
  ElMessage.success('已添加防范站位')
}

// 保存起重机属性


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
  padding-top: 36px; /* 为固定的头部留出空间 */
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
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
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
  cursor: pointer;
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
  margin-left: 200px; /* 为固定的左侧导航留出空间 */
}

.left-sidebar {
  width: 200px;
  background-color: #ffffff;
  border-right: 1px solid #e8e8e8;
  padding: 16px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  position: fixed;
  left: 0;
  top: 36px;
  bottom: 0;
  z-index: 900;
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
  margin-bottom: 16px;
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
  cursor: pointer;
}

.add-btn {
  cursor: pointer;
}

/* 起重机列表样式 */
.crane-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  overflow-y: auto;
}

.crane-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background-color: #f5f7fa;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.crane-item:hover {
  background-color: #e6e8eb;
}

.crane-item.selected {
  background-color: #e6f7ff;
  border: 1px solid #91d5ff;
}

.crane-name {
  font-size: 12px;
  color: #303133;
}

.delete-icon {
  font-size: 12px;
  color: #909399;
  cursor: pointer;
  transition: color 0.3s ease;
}

.delete-icon:hover {
  color: #f56c6c;
}

.right-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 24px;
  background-color: #f0f2f5;
  position: relative;
  overflow: hidden;
}

/* 属性面板样式 */
.property-panel {
  position: fixed;
  right: 20px;
  top: 36px;
  bottom: 0;
  width: 280px;
  background-color: white;
  border-radius: 8px 8px 0 0;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.panel-header {
  background-color: #fafafa;
  padding: 12px 16px;
  border-bottom: 1px solid #ebeef5;
}

.panel-title {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
}

.panel-content {
  padding: 16px;
  flex: 1;
  overflow-y: auto;
}

.property-item {
  margin-bottom: 16px;
}

.property-item label {
  display: block;
  font-size: 12px;
  color: #606266;
  margin-bottom: 8px;
}

.color-input-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.color-preview {
  width: 32px;
  height: 32px;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
}

.unit {
  margin-left: 8px;
  font-size: 12px;
  color: #909399;
}

.panel-footer {
  padding: 12px 16px;
  background-color: #fafafa;
  border-top: 1px solid #ebeef5;
  display: flex;
  justify-content: flex-end;
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