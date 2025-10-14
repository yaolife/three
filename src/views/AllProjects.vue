<template>
  <div class="all-projects-container">
    <el-card class="project-table-card">
      <!-- 项目列表表格 -->
      <el-table :data="projectData" style="width: 100%">
        <el-table-column prop="id" align="center" label="序号" width="70" />
        <el-table-column prop="title" align="center" label="方案标题" min-width="130" />
        <el-table-column prop="fileType" align="center" label="文件类型" width="100" />
        <el-table-column prop="type" align="center" label="类型" width="100" />
        <el-table-column prop="relatedProject" align="center" label="所属项目" width="170" />
        <el-table-column prop="creator" align="center" label="创建人" width="100" />
        <el-table-column prop="createTime" align="center" label="创建时间" width="180" />
        <el-table-column align="center" label="操作" width="240" fixed="right">
          <template #default="scope">
            <el-button
              v-if="scope.row.status === 'local'"
              type="primary"
              size="small"
              @click="handleUpload(scope.row)"
            >
              上传
            </el-button>
            <el-button
              v-else
              type="primary"
              size="small"
              @click="handleReUpload(scope.row)"
            >
              重新上传
            </el-button>
            <el-button
              type="default"
              size="small"
              @click="handleEdit(scope.row)"
              style="margin-left: 8px"
            >
              打开
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
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

// 模拟项目数据
const projectData = ref([
  {
    id: 1,
    title: 'XXXXXXXX设备吊装项目方案',
    fileType: '本地',
    type: '校核计算',
    relatedProject: 'xxxxxxx集热器吊装项目',
    creator: 'xxxxxxx公司',
    createTime: '2025-01-01 12:00:00',
    status: 'local'
  },
  {
    id: 2,
    title: 'XXXXXXXX设备吊装项目方案',
    fileType: '本地',
    type: '校核计算',
    relatedProject: 'xxxxxxx集热器吊装项目',
    creator: 'xxxxxxx公司',
    createTime: '2025-01-01 12:00:00',
    status: 'local'
  },
  {
    id: 3,
    title: 'XXXXXXXX设备吊装项目方案',
    fileType: '本地',
    type: '校核计算',
    relatedProject: 'xxxxxxx集热器吊装项目',
    creator: 'xxxxxxx公司',
    createTime: '2025-01-01 12:00:00',
    status: 'local'
  },
  {
    id: 4,
    title: 'XXXXXXXX设备吊装项目方案',
    fileType: '云端',
    type: '校核计算',
    relatedProject: 'xxxxxxx集热器吊装项目',
    creator: 'xxxxxxx公司',
    createTime: '2025-01-01 12:00:00',
    status: 'cloud'
  },
  {
    id: 5,
    title: 'XXXXXXXX设备吊装项目方案',
    fileType: '本地',
    type: '平立面图',
    relatedProject: 'xxxxxxx集热器吊装项目',
    creator: 'xxxxxxx公司',
    createTime: '2025-01-01 12:00:00',
    status: 'local'
  },
  {
    id: 6,
    title: 'XXXXXXXX设备吊装项目方案',
    fileType: '云端',
    type: '校核计算',
    relatedProject: 'xxxxxxx集热器吊装项目',
    creator: 'xxxxxxx公司',
    createTime: '2025-01-01 12:00:00',
    status: 'cloud'
  },
  {
    id: 7,
    title: 'XXXXXXXX设备吊装项目方案',
    fileType: '本地',
    type: '三维仿真',
    relatedProject: 'xxxxxxx集热器吊装项目',
    creator: 'xxxxxxx公司',
    createTime: '2025-01-01 12:00:00',
    status: 'local'
  },
  {
    id: 8,
    title: 'XXXXXXXX设备吊装项目方案',
    fileType: '云端',
    type: '校核计算',
    relatedProject: 'xxxxxxx集热器吊装项目',
    creator: 'xxxxxxx公司',
    createTime: '2025-01-01 12:00:00',
    status: 'cloud'
  }
])

// 分页数据
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(6532) // 模拟总数

// 操作方法
const handleUpload = (row) => {
  ElMessage({ message: '正在上传项目...', type: 'info' })
  // 实际上传逻辑将在这里实现
}

const handleReUpload = (row) => {
  ElMessage({ message: '正在重新上传项目...', type: 'info' })
  // 实际重新上传逻辑将在这里实现
}

const handleEdit = (row) => {
  ElMessage({ message: '正在编辑项目...', type: 'info' })
  // 实际编辑逻辑将在这里实现
}

const handleDelete = (row) => {
  ElMessage({ message: '正在删除项目...', type: 'info' })
  // 实际删除逻辑将在这里实现
}

// 分页事件处理
const handleSizeChange = (size) => {
  pageSize.value = size
  // 实际数据加载逻辑将在这里实现
}

const handleCurrentChange = (current) => {
  currentPage.value = current
  // 实际数据加载逻辑将在这里实现
}
</script>

<style scoped>
.all-projects-container {
  padding: 20px 0;
}

.project-table-card {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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