<template>
  <div class="site-plan-editor-container">
    <!-- 页面顶部标题 -->
    <div class="page-header">
      <h2>总平规划</h2>
    </div>
    
    <!-- 主要内容区域 -->
    <div class="main-content">
      <div class="empty-state">
        <div class="empty-icon">
          <img src="@/images/site_plan.png" alt="总平规划" class="plan-icon">
        </div>
        <div class="empty-text">暂无施工场景，请导入相关平面图！</div>
        <el-button 
          type="primary" 
          @click="handleImportPlan"
          class="import-btn"
        >
          点击添加
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

// 初始化路由相关
const route = useRoute()
const router = useRouter()

// 获取项目ID
const projectId = ref(route.params.id || '')

// 组件挂载时的初始化操作
onMounted(() => {
  // 可以在这里加载项目数据
  if (projectId.value) {
    console.log('加载总平规划项目数据，项目ID:', projectId.value)
    // 这里可以添加加载项目数据的逻辑
  }
})

// 处理导入平面图
const handleImportPlan = () => {
  // 这里可以实现导入平面图的逻辑
  console.log('导入平面图，项目ID:', projectId.value)
  // 暂时显示消息提示
  ElMessage.info('导入平面图功能待实现')
}
</script>

<style scoped>
.site-plan-editor-container {
  width: 100%;
  height: 100vh;
  background-color: #f0f2f5;
  padding: 0;
  margin: 0;
  overflow: hidden;
}

.page-header {
  background-color: #001529;
  color: white;
  padding: 16px 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.page-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 500;
}

.main-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 64px);
  padding: 0 24px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 600px;
  background-color: white;
  border-radius: 8px;
  padding: 60px 40px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.empty-icon {
  margin-bottom: 24px;
}

.plan-icon {
  width: 120px;
  height: 120px;
  opacity: 0.7;
}

.empty-text {
  font-size: 18px;
  color: #606266;
  margin-bottom: 36px;
  text-align: center;
  font-weight: 400;
}

.import-btn {
  min-width: 140px;
  height: 40px;
  font-size: 16px;
  background-color: #1890ff;
  border-color: #1890ff;
}

.import-btn:hover {
  background-color: #40a9ff;
  border-color: #40a9ff;
}
</style>