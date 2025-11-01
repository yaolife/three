<template>
  <div class="all-projects-container">
    <el-card class="project-table-card">
      <!-- 创建项目按钮 -->
      <div class="create-project-btn-container">
        <el-button type="primary" @click="showCreateDialog = true">创建项目</el-button>
      </div>
      
      <!-- 项目列表表格 -->
      <el-table :data="projectData" style="width: 100%">
        <el-table-column prop="id" align="center" label="序号" width="70" />
        <el-table-column prop="title" align="center" label="项目标题" max-width="130" />
        <el-table-column prop="fileType" align="center" label="文件类型" width="120">
          <template #default="scope">
            {{ getFileTypeText(scope.row.fileType) }}
          </template>
        </el-table-column>
        <el-table-column prop="projectType" align="center" label="项目类型" width="100">
          <template #default="scope">
            {{ getProjectTypeText(scope.row.projectType) }}
          </template>
        </el-table-column>
        <el-table-column prop="belongingProject" align="center" label="所属项目" width="170" />
            <el-table-column prop="belongingDept" align="center" label="创建部门" width="170" />
                <el-table-column prop="createTime" align="center" label="创建时间" width="170" />
        <el-table-column align="center" label="操作" width="160" fixed="right">
          <template #default="scope">
            <el-button
              type="default"
              size="small"
              @click="handleEdit(scope.row)"
              style="margin-left: 8px"
            >
              编辑
            </el-button>
            <el-button
              type="danger"
              size="small"
              @click="handleDelete(scope.row)"
              style="margin-left: 8px"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 分页控件 -->
      <div class="pagination-container">
        <div class="pagination-info">
          共 {{ total }} 条
        </div>
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="prev, pager, next, jumper, sizes"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    
    <!-- 创建/编辑项目弹窗 -->
    <el-dialog v-model="showCreateDialog" title="创建项目" width="500px" :close-on-click-modal="false">
      <el-form ref="formRef" :model="formData" label-width="100px">
        <el-form-item label="选择类型">
          <div class="project-type-container">
            <div class="project-type-item" @click="formData.projectType = 0; formData.fileType = 0">
              <div class="project-type-icon">
                <span>校核计算</span>
              </div>
              <div class="project-type-label">新建校核计算</div>
            </div>
            <div class="project-type-item" @click="formData.projectType = 1; formData.fileType = 1">
              <div class="project-type-icon">
                <span>三维仿真</span>
              </div>
              <div class="project-type-label">新建三维仿真</div>
            </div>
            <div class="project-type-item" @click="formData.projectType = 2; formData.fileType = 2">
              <div class="project-type-icon">
                <span>总平规划</span>
              </div>
              <div class="project-type-label">总平规划</div>
            </div>
          </div>
        </el-form-item>
        
        <el-form-item label="项目标题" prop="title" :rules="[{ required: true, message: '请输入项目标题', trigger: 'blur' }]">
          <el-input v-model="formData.title" placeholder="请输入项目标题" />
        </el-form-item>
        
        <el-form-item label="创建部门">
          <el-input v-model="formData.belongingDept" placeholder="请输入创建部门" />
        </el-form-item>
        
        <el-form-item label="所属项目">
          <el-input v-model="formData.belongingProject" placeholder="请输入所属项目" />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showCreateDialog = false">取消</el-button>
          <el-button type="primary" @click="submitForm">确认创建</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getAllProject, handleEditProject, deleteProjectItem } from '../api/index.js'

// 初始化 router
const router = useRouter()

// 项目数据
const projectData = ref([])

// 分页数据
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 创建项目弹窗相关
const showCreateDialog = ref(false)
const formRef = ref(null)
const formData = ref({
  id: '',
  title: '',
  projectType: 0,
  fileType: 0,
  belongingProject: '',
  belongingDept: ''
})

// 初始化加载数据
onMounted(() => {
  loadProjectData()
})

// 加载项目数据
const loadProjectData = async () => {
  try {
    const response = await getAllProject({
      pageNum: currentPage.value,
      pageSize: pageSize.value
    })
    
    if (response.code === '0' && response.data) {
      projectData.value = response.data.records || []
      total.value = response.data.total || 0
    } else {
      ElMessage.error(response.msg || '获取项目列表失败')
    }
  } catch (error) {
    console.error('获取项目列表失败:', error)
    ElMessage.error('获取项目列表失败')
  }
}

// 获取文件类型文本
const getFileTypeText = (type) => {
  const typeMap = {
    0: '校核计算',
    1: '三维仿真',
    2: '总平规划'
  }
  return typeMap[type] || type
}

// 获取项目类型文本
const getProjectTypeText = (type) => {
  const typeMap = {
    0: '校核计算',
    1: '三维仿真',
    2: '总平规划'
  }
  return typeMap[type] || type
}

// 打开编辑对话框
const handleEdit = (row) => {
  if (row.projectType === 0) {
    // 校核计算类型跳转到详情页
    router.push({
      name: 'CalculationDetail',
      params: { id: row.id }
    })
  } else {
    // 其他类型打开编辑对话框
    formData.value = {
      id: row.id,
      title: row.title,
      projectType: row.projectType,
      fileType: row.fileType,
      belongingProject: row.belongingProject,
      belongingDept: row.belongingDept || ''
    }
    showCreateDialog.value = true
  }
}

// 处理删除
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
      '确定要删除该项目吗？',
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    const response = await deleteProjectItem(row.id)
    
    if (response.code === '0') {
      ElMessage.success('删除成功')
      // 重新加载数据
      loadProjectData()
    } else {
      ElMessage.error(response.msg || '删除失败')
    }
  } catch (error) {
    if (error === 'cancel') return
    console.error('删除项目失败:', error)
    ElMessage.error('删除项目失败')
  }
}

// 提交表单
const submitForm = async () => {
  try {
    // 准备提交数据
    const submitData = {
      id: formData.value.id,
      title: formData.value.title,
      projectType: formData.value.projectType,
      fileType: formData.value.fileType,
      belongingProject: formData.value.belongingProject
    }
    
    const response = await handleEditProject(submitData)
    
    if (response.code === '0') {
      ElMessage.success(formData.value.id ? '编辑成功' : '创建成功')
      showCreateDialog.value = false
      // 重置表单
      resetForm()
      // 重新加载数据
      loadProjectData()
    } else {
      ElMessage.error(response.msg || '操作失败')
    }
  } catch (error) {
    console.error('提交表单失败:', error)
    ElMessage.error('提交表单失败')
  }
}

// 重置表单
const resetForm = () => {
  formData.value = {
    id: '',
    title: '',
    projectType: 0,
    fileType: 0,
    belongingProject: '',
    belongingDept: ''
  }
  if (formRef.value) {
    formRef.value.resetFields()
  }
}

// 分页事件处理
const handleSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
  loadProjectData()
}

const handleCurrentChange = (current) => {
  currentPage.value = current
  loadProjectData()
}
</script>

<style scoped>
.all-projects-container {
  padding: 5px 0;
}

.project-table-card {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.create-project-btn-container {
  margin-bottom: 20px;
  text-align: right;
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

/* 项目类型选择样式 */
.project-type-container {
  display: flex;
  gap: 20px;
}

.project-type-item {
  cursor: pointer;
  text-align: center;
  width: 120px;
}

.project-type-icon {
  width: 80px;
  height: 80px;
  background-color: #e6f7ff;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 10px;
  color: #1890ff;
  font-size: 14px;
  border: 2px solid transparent;
}

.project-type-item:hover .project-type-icon {
  border-color: #1890ff;
}

.project-type-label {
  font-size: 12px;
  color: #333;
}
</style>
