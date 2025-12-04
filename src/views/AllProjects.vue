<template>
  <div class="all-projects-container">
    <el-card class="project-table-card">
      <!-- 上传按钮工具栏 -->
      <div class="table-toolbar" v-if="canShowUpload">
        <div class="toolbar-spacer"></div>
        <el-button type="primary" @click="handleUpload">
          <el-icon><Upload /></el-icon>
          上传
        </el-button>
      </div>
      
      <!-- 项目列表表格 -->
      <el-table 
        :data="projectData" 
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" align="center" width="55" />
        <el-table-column type="index" align="center" label="序号" width="70">
          <template #default="{ $index }">
            {{ $index + 1 }}
          </template>
        </el-table-column>
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
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px">
         <el-form-item label="选择类型">   </el-form-item>
        <el-form-item label="">
          <div class="project-type-container" style="margin-left: -80px;">
            <div class="project-type-item" :class="{ 'active': formData.projectType === 0 }" @click="formData.projectType = 0; formData.fileType = 0">
              <div class="project-type-icon" :class="{ 'active': formData.projectType === 0 }">
                <span>校核计算</span>
                <img src="@/images/verification.png" alt="校核计算" style="width: 30px;height: 30px;">
              </div>
              <div class="project-type-label">新建校核计算</div>
            </div>
            <div class="project-type-item" :class="{ 'active': formData.projectType === 1 }" @click="formData.projectType = 1; formData.fileType = 1">
              <div class="project-type-icon" :class="{ 'active': formData.projectType === 1 }">
                <span>三维仿真</span>
                 <img src="@/images/three_dimensional.png" alt="三维仿真" style="width: 30px;height: 30px;">
              </div>
              <div class="project-type-label">新建三维仿真</div>
            </div>
            <div class="project-type-item" :class="{ 'active': formData.projectType === 2 }" @click="formData.projectType = 2; formData.fileType = 1">
              <div class="project-type-icon" :class="{ 'active': formData.projectType === 2 }">
                <span>总平规划</span>
                 <img src="@/images/site_plan.png" alt="总平规划" style="width: 30px;height: 30px;">
              </div>
              <div class="project-type-label">新建总平规划</div>
            </div>
          </div>
        </el-form-item>
        
        <el-form-item label="项目标题" prop="title" :rules="[{ required: true, message: '请输入项目标题', trigger: 'blur' }]">
          <el-input v-model="formData.title" placeholder="请输入项目标题" />
        </el-form-item>
        
        <el-form-item label="创建部门" prop="belongingDept" :rules="[{ required: true, message: '请输入创建部门', trigger: 'blur' }]">
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
import { ref, onMounted, onUnmounted, watch, nextTick, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Upload } from '@element-plus/icons-vue'
import { getAllProject, handleEditProject, deleteProjectItem, copyProjectItem, pushProject } from '../api/index.js'
import userStore from '../store/user.js'

// 初始化 router 和 route
const router = useRouter()
const route = useRoute()

const projectTypeFilter = computed(() => {
  if (route.meta && route.meta.projectType !== undefined) {
    return route.meta.projectType
  }
  if (route.query && route.query.projectType !== undefined) {
    const parsed = Number(route.query.projectType)
    return Number.isNaN(parsed) ? null : parsed
  }
  return null
})

// 判断是否显示上传按钮（loginType为0时显示）
const canShowUpload = computed(() => {
  return userStore.userState.userInfo?.loginType === 0;
})

const resolveDefaultProjectType = () =>
  projectTypeFilter.value !== null && projectTypeFilter.value !== undefined
    ? projectTypeFilter.value
    : 0

const resolveDefaultFileType = (type) => (type === 0 ? 0 : 1)

const createEmptyFormData = () => {
  const defaultType = resolveDefaultProjectType()
  return {
    id: null,
    title: '',
    projectType: defaultType,
    fileType: resolveDefaultFileType(defaultType),
    belongingProject: '',
    belongingDept: ''
  }
}

// 项目数据
const projectData = ref([])
// 选中的项目数据
const selectedProjects = ref([])
// 搜索关键词
const searchTitle = ref("")

// 分页数据
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 创建项目弹窗相关
const showCreateDialog = ref(false)
const formRef = ref(null)
const formData = ref(createEmptyFormData())

const formRules = ref({
  title: [{ required: true, message: '请输入项目标题', trigger: 'blur' }],
  belongingDept: [{ required: true, message: '请输入创建部门', trigger: 'blur' }]
})

// 刷新项目列表的方法（供外部调用）
const refreshProjectList = (projectType = null) => {
  console.log('刷新项目列表，项目类型:', projectType);
  
  // 重置当前页为第一页
  currentPage.value = 1;
  
  // 重新加载数据（loadProjectData 会根据当前路由的 projectTypeFilter 自动获取正确的项目类型）
  loadProjectData();
};

// 初始化加载数据
onMounted(() => {
  loadProjectData()
  
  // 检查是否需要打开创建项目弹窗（从App.vue触发）
  // 使用 nextTick 确保在组件完全挂载后再检查
  nextTick(() => {
    checkCreateFlag()
  })
  
  // 监听自定义事件，当用户已在全部项目页面时打开创建弹窗
  console.log('Adding openProjectDialog event listener');
  window.addEventListener('openProjectDialog', checkCreateFlag)
  
  // 监听刷新项目列表事件
  window.addEventListener('refreshProjectList', (event) => {
    const projectType = event.detail?.projectType;
    refreshProjectList(projectType);
  });

  // 添加全局方法，方便直接从App.vue调用
  window.openProjectDialogDirect = () => {
    console.log('Direct open project dialog called');
    // 确保在DOM更新后执行
    nextTick(() => {
      openCreateDialog();
    });
  }
  
  // 添加全局刷新方法，方便直接从App.vue调用
  window.refreshProjectListDirect = (projectType) => {
    console.log('Direct refresh project list called');
    refreshProjectList(projectType);
  }
  
  // 添加全局清空数据方法，用于退出登录时清空数据
  window.clearProjectListDirect = () => {
    console.log('Direct clear project list called');
    projectData.value = [];
    total.value = 0;
    currentPage.value = 1;
    selectedProjects.value = [];
    searchTitle.value = "";
  }
  
  // 添加全局复制方法，方便直接从App.vue调用
  window.copyProjectDirect = () => {
    console.log('Direct copy project called');
    return copyProject();
  }
  
  // 添加全局搜索方法，方便直接从App.vue调用
  window.searchProjectDirect = (title) => {
    console.log('Direct search project called');
    searchProject(title);
  }
})

// 组件卸载时清理事件监听器和状态
onUnmounted(() => {
  console.log('Removing event listeners');
  window.removeEventListener('openProjectDialog', checkCreateFlag)
  window.removeEventListener('refreshProjectList', refreshProjectList)
  // 移除全局方法
  delete window.openProjectDialogDirect;
  delete window.refreshProjectListDirect;
  delete window.copyProjectDirect;
  delete window.searchProjectDirect;
  delete window.clearProjectListDirect;
  // 重置创建项目标志，避免遗留状态导致下次进入页面时误触发
  window.createProjectFlag = false;
})

// 监听路由变化，但只在从其他页面导航到当前页面时检查创建标志
// 避免在同一个组件内切换路由时重复触发
let previousPath = route.fullPath
watch(() => route.fullPath, (newPath) => {
  // 只有在路径真正改变，且是从其他页面导航过来时才检查
  // 如果是从其他路由导航到使用 AllProjects 组件的路由，才检查标志
  if (previousPath !== newPath) {
    // 延迟检查，确保组件已完全挂载
    nextTick(() => {
      // 只在明确设置了创建标志时才打开弹窗
      // 并且确保标志在检查后立即重置，避免重复触发
      if (window.createProjectFlag === true) {
        window.createProjectFlag = false
        console.log('Opening create project dialog from route change');
        openCreateDialog()
      }
    })
    previousPath = newPath
  }
})

// 检查并处理创建项目标志的函数
const checkCreateFlag = () => {
  console.log('checkCreateFlag called, createProjectFlag:', window.createProjectFlag);
  // 使用严格相等检查，确保只在明确为 true 时才打开
  if (window.createProjectFlag === true) {
    // 立即重置标志，避免重复触发
    window.createProjectFlag = false
    // 打开创建项目弹窗
    console.log('Opening create project dialog');
    openCreateDialog()
  }
}

// 处理表格选中变化
const handleSelectionChange = (selection) => {
  selectedProjects.value = selection;
  console.log('选中的项目:', selection);
};

// 处理上传按钮点击
const handleUpload = async () => {
  // 检查是否至少选中一个项目
  if (!selectedProjects.value || selectedProjects.value.length === 0) {
    ElMessage.warning('请至少选择一个项目进行上传');
    return;
  }
  
  // 收集选中的项目ID
  const ids = selectedProjects.value.map(item => item.id).filter(id => id !== null && id !== undefined);
  
  if (ids.length === 0) {
    ElMessage.warning('选中的项目数据异常，无法上传');
    return;
  }
  
  try {
    const response = await pushProject({ ids });
    
    if (response && response.code === '0') {
      ElMessage.success('上传成功');
      // 清空选中状态
      selectedProjects.value = [];
    } else {
      ElMessage.error(response?.msg || '上传失败');
    }
  } catch (error) {
    console.error('上传项目失败:', error);
    ElMessage.error('上传失败，请检查网络连接');
  }
};

// 复制项目的方法（供外部调用）
const copyProject = async () => {
  const selectedCount = selectedProjects.value.length;
  
  if (selectedCount === 0) {
    ElMessage.warning('请先选择一个项目');
    return false;
  }
  
  if (selectedCount > 1) {
    ElMessage.warning('只能选择一个项目进行复制');
    return false;
  }
  
  const selectedProject = selectedProjects.value[0];
  if (!selectedProject || !selectedProject.id) {
    ElMessage.error('选中的项目数据异常');
    return false;
  }
  
  try {
    console.log('复制项目，项目ID:', selectedProject.id);
    const response = await copyProjectItem({ projectId: selectedProject.id });
    
    if (response.code === '0') {
      ElMessage.success('复制成功');
      // 刷新当前菜单下的table数据
      loadProjectData();
      // 清空选中状态
      selectedProjects.value = [];
      return true;
    } else {
      ElMessage.error(response.msg || '复制失败');
      return false;
    }
  } catch (error) {
    console.error('复制项目失败:', error);
    ElMessage.error('复制项目失败');
    return false;
  }
};

// 搜索项目的方法（供外部调用）
const searchProject = (title = "") => {
  console.log('搜索项目，关键词:', title);
  
  // 设置搜索关键词
  searchTitle.value = title || "";
  
  // 重置当前页为第一页
  currentPage.value = 1;
  
  // 重新加载数据
  loadProjectData();
};

// 加载项目数据
const loadProjectData = async () => {
  // 检查登录状态，如果未登录或登录失败，不加载数据
  if (!userStore.userState.isLoggedIn) {
    console.log('用户未登录，不加载项目数据');
    projectData.value = [];
    total.value = 0;
    return;
  }
  
  try {
    const params = {
      pageNum: currentPage.value,
      pageSize: pageSize.value
    }
    
    if (projectTypeFilter.value !== null && projectTypeFilter.value !== undefined) {
      params.projectType = projectTypeFilter.value
    }
    
    // 如果有搜索关键词，添加到参数中
    if (searchTitle.value && searchTitle.value.trim()) {
      params.title = searchTitle.value.trim()
    }
    
    const response = await getAllProject(params)
    
    if (response.code === '0' && response.data) {
      projectData.value = response.data.records || []
      total.value = response.data.total || 0
    } else {
      // 如果登录失败，清空数据
      if (response.code !== '0') {
        projectData.value = [];
        total.value = 0;
      }
      ElMessage.error(response.msg || '获取项目列表失败')
    }
  } catch (error) {
    console.error('获取项目列表失败:', error)
    // 清空数据
    projectData.value = [];
    total.value = 0;
    // 如果是"请重新登录"错误，不显示错误提示（checkResponseCode已经处理）
    if (error.message !== '请重新登录') {
      ElMessage.error('获取项目列表失败')
    }
  }
}

// 获取文件类型文本
const getFileTypeText = (type) => {
  const typeMap = {
    0: '本地',
    1: '云端'
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
  } else if (row.projectType === 2) {
    // 总平规划类型跳转到总平规划页面
    router.push({
      name: 'SitePlan',
      params: { id: row.id },
      query: { title: row.title || '' } // 传递项目标题作为 query 参数
    })
  } else {
    // 其他类型打开通用编辑对话框
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
    // 验证表单
    await formRef.value.validate()
    
    // 准备提交数据
    const submitData = {
      id: formData.value.id,
      title: formData.value.title,
      projectType: formData.value.projectType,
      fileType: formData.value.fileType,
      belongingProject: formData.value.belongingProject,
      belongingDept: formData.value.belongingDept
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
    if (error !== 'cancel') {
      console.error('提交表单失败:', error)
    }
  }
}

// 重置表单
const resetForm = () => {
  formData.value = createEmptyFormData()
  if (formRef.value) {
    formRef.value.resetFields()
  }
}

watch(projectTypeFilter, () => {
  currentPage.value = 1
  // 切换项目类型时清空搜索关键词
  searchTitle.value = ""
  loadProjectData()
  resetForm()
})

// 监听登录状态变化，如果未登录则清空数据
watch(() => userStore.userState.isLoggedIn, (isLoggedIn) => {
  if (!isLoggedIn) {
    console.log('登录状态变化：用户已退出，清空项目数据');
    projectData.value = [];
    total.value = 0;
    currentPage.value = 1;
    selectedProjects.value = [];
    searchTitle.value = "";
  }
})



// 打开创建项目弹窗的方法，供父组件调用
const openCreateDialog = () => {
  // 重置表单
  resetForm()
  // 打开弹窗
  showCreateDialog.value = true
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

// 暴露方法给父组件
defineExpose({
  openCreateDialog
})
</script>

<style scoped>
.all-projects-container {
  padding: 5px 0;
}

.project-table-card {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.table-toolbar {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 3px 20px;
  margin-bottom: 0;
}

.toolbar-spacer {
  flex: 1;
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
  gap: 40px;
}

.project-type-item {
  cursor: pointer;
  text-align: center;
  width: 120px;
}

.project-type-icon {
  width: 100px;
  height: 100px;
  background-color: #B8D4EF;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 10px;
  color: #1890ff;
  font-size: 14px;
  border-radius: 11px;
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.project-type-icon.active {
  background-color: #1890ff;
  color: white;
  border-color: #1890ff;
}

.project-type-item:hover .project-type-icon {
  border-color: #1890ff;
}
.project-type-item .project-type-icon {
  position: relative;
}
.project-type-item .project-type-icon img{
  position: absolute;
  right: 0;
  bottom: 0;
}
.project-type-label {
  font-size: 12px;
  color: #333;
}

.project-type-item.active .project-type-label {
  color: #1890ff;
  font-weight: 500;
}
</style>
