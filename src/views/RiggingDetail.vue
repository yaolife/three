<template>
  <div class="rigging-detail-container">
    <el-card class="page-card">
      <template #header>
        <div class="card-header">
          <div class="header-left">
            <el-button @click="handleBack" link>
              <el-icon><ArrowLeft /></el-icon>
              返回
            </el-button>
            <span class="title">吊索具详情</span>
          </div>
          <div class="header-right">
            <el-button type="primary" @click="handleSave" :loading="saveLoading">
              确认新增
            </el-button>
          </div>
        </div>
      </template>
      <div class="page-content">
        <!-- 基本信息 -->
        <div class="info-section">
          <div class="info-item">
            <span class="label">吊索具类型：</span>
            <span class="value">{{ riggingInfo.type }}</span>
          </div>
          <div class="info-item">
            <span class="label">吊索具名称：</span>
            <span class="value">{{ riggingInfo.name }}</span>
          </div>
          <div class="info-item">
            <span class="label">生产厂家：</span>
            <span class="value">{{ riggingInfo.manufacturer }}</span>
          </div>
        </div>

        <!-- 可编辑表格 -->
        <div class="table-section">
          <div class="table-toolbar">
            <span class="table-title">设备详细信息</span>
            <el-button type="primary" size="small" @click="handleAddRow">
              <el-icon><Plus /></el-icon>
              添加行
            </el-button>
          </div>
          <el-table
            :data="tableData"
            v-loading="tableLoading"
            border
            style="width: 100%"
            :header-cell-style="{ background: '#f5f7fa' }"
          >
            <el-table-column type="index" label="序号" width="60" />
            <el-table-column label="设备名称" min-width="120">
              <template #default="scope">
                <el-input
                  v-model="scope.row.deviceName"
                  placeholder="请输入设备名称"
                  size="small"
                />
              </template>
            </el-table-column>
            <el-table-column label="设备型号" min-width="120">
              <template #default="scope">
                <el-input
                  v-model="scope.row.deviceModel"
                  placeholder="请输入设备型号"
                  size="small"
                />
              </template>
            </el-table-column>
            <el-table-column label="设备编号" min-width="120">
              <template #default="scope">
                <el-input
                  v-model="scope.row.deviceCode"
                  placeholder="请输入设备编号"
                  size="small"
                />
              </template>
            </el-table-column>
            <el-table-column label="额定载荷" min-width="120">
              <template #default="scope">
                <el-input
                  v-model="scope.row.pq"
                  placeholder="请输入额定载荷"
                  size="small"
                />
              </template>
            </el-table-column>
            <el-table-column label="近似高度" min-width="120">
              <template #default="scope">
                <el-input
                  v-model="scope.row.approximateHigh"
                  placeholder="请输入近似高度"
                  size="small"
                />
              </template>
            </el-table-column>
            <el-table-column label="近似宽度" min-width="120">
              <template #default="scope">
                <el-input
                  v-model="scope.row.approximateWidth"
                  placeholder="请输入近似宽度"
                  size="small"
                />
              </template>
            </el-table-column>
            <el-table-column label="最小长度" min-width="120">
              <template #default="scope">
                <el-input
                  v-model="scope.row.miniLength"
                  placeholder="请输入最小长度"
                  size="small"
                />
              </template>
            </el-table-column>
            <el-table-column label="近似厚度" min-width="120">
              <template #default="scope">
                <el-input
                  v-model="scope.row.approximateThickness"
                  placeholder="请输入近似厚度"
                  size="small"
                />
              </template>
            </el-table-column>
            <el-table-column label="环眼长度" min-width="120">
              <template #default="scope">
                <el-input
                  v-model="scope.row.eyeLength"
                  placeholder="请输入环眼长度"
                  size="small"
                />
              </template>
            </el-table-column>
            <el-table-column label="操作" width="80" fixed="right">
              <template #default="scope">
                <el-button
                  link
                  type="danger"
                  size="small"
                  @click="handleDeleteRow(scope.$index)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <el-pagination
            v-model:current-page="detailPage"
            :page-size="detailPageSize"
            :total="detailTotal"
            layout="total, prev, pager, next"
            class="pagination"
            @current-change="handleDetailPageChange"
          />
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { ArrowLeft, Plus } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { getLiftingDetailPage, addUpdateLiftingDetail } from '../api/index.js';

const router = useRouter();
const route = useRoute();

// 吊索具基本信息
const riggingInfo = ref({
  id: '',
  type: '',
  name: '',
  manufacturer: '',
});

// 分页和加载状态
const tableData = ref([]);
const tableLoading = ref(false);
const saveLoading = ref(false);
const detailPage = ref(1);
const detailPageSize = ref(10);
const detailTotal = ref(0);

// 从API获取详情数据
const fetchDetailData = async () => {
  if (!riggingInfo.value.id) {
    // 如果是新建模式，初始化一行空数据
    tableData.value = [
      {
        deviceName: '',
        deviceModel: '',
        deviceCode: '',
        pq: '',
        approximateHigh: '',
        approximateWidth: '',
        miniLength: '',
        approximateThickness: '',
        eyeLength: '',
      },
    ];
    return;
  }

  tableLoading.value = true;
  try {
    const response = await getLiftingDetailPage({
      pageNum: detailPage.value,
      pageSize: detailPageSize.value,
      liftingInfoId: riggingInfo.value.id,
    });
    
    if (response && response.code === 200) {
      tableData.value = response.data.records || [];
      detailTotal.value = response.data.total || 0;
      
      // 如果没有数据，初始化一行空数据
      if (tableData.value.length === 0) {
        tableData.value = [
          {
            deviceName: '',
            deviceModel: '',
            deviceCode: '',
            pq: '',
            approximateHigh: '',
            approximateWidth: '',
            miniLength: '',
            approximateThickness: '',
            eyeLength: '',
          },
        ];
      }
    } else {
      ElMessage.error(response?.message || '获取详情数据失败');
    }
  } catch (error) {
    console.error('获取详情数据失败:', error);
    ElMessage.error('获取数据失败，请检查网络连接');
  } finally {
    tableLoading.value = false;
  }
};

// 处理分页变化
const handleDetailPageChange = (page) => {
  detailPage.value = page;
  fetchDetailData();
};

// 初始化数据
onMounted(() => {
  // 从路由参数获取基本信息
  if (route.query.id) {
    riggingInfo.value.id = route.query.id;
  }
  if (route.query.type) {
    riggingInfo.value.type = route.query.type;
    riggingInfo.value.name = route.query.name;
    riggingInfo.value.manufacturer = route.query.manufacturer;
  } else if (route.params.id) {
    // 如果是编辑模式，从后端获取数据
    riggingInfo.value.id = route.params.id;
    // 这里应该调用API获取基本信息，暂时使用模拟数据
    riggingInfo.value = {
      id: route.params.id,
      type: '吊装带',
      name: 'W01型（环眼型）',
      manufacturer: '巨力索具股份有限公司',
    };
  }
  
  // 加载详情数据
  fetchDetailData();
});

// 返回
const handleBack = () => {
  router.back();
};

// 添加行
const handleAddRow = () => {
  tableData.value.push({
    deviceName: '',
    deviceModel: '',
    deviceCode: '',
    pq: '',
    approximateHigh: '',
    approximateWidth: '',
    miniLength: '',
    approximateThickness: '',
    eyeLength: '',
  });
};

// 删除行
const handleDeleteRow = (index) => {
  if (tableData.value.length === 1) {
    ElMessage.warning('至少保留一行数据');
    return;
  }
  ElMessageBox.confirm('确定要删除这行数据吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      tableData.value.splice(index, 1);
      ElMessage.success('删除成功');
    })
    .catch(() => {
      ElMessage.info('已取消删除');
    });
};

// 保存数据并调用API
const handleSave = async () => {
  // 验证数据
  for (let i = 0; i < tableData.value.length; i++) {
    const row = tableData.value[i];
    if (!row.deviceName || !row.deviceModel || !row.deviceCode) {
      ElMessage.warning(`第${i + 1}行的设备名称、设备型号、设备编号不能为空`);
      return;
    }
  }

  saveLoading.value = true;
  try {
    const response = await addUpdateLiftingDetail({
      liftingInfoId: riggingInfo.value.id,
      details: tableData.value,
    });
    
    if (response && response.code === 200) {
      ElMessage.success('保存成功');
      
      // 保存后返回列表页
      setTimeout(() => {
        router.push('/data-management');
      }, 1000);
    } else {
      ElMessage.error(response?.message || '保存失败');
    }
  } catch (error) {
    console.error('保存失败:', error);
    ElMessage.error('保存失败，请检查网络连接');
  } finally {
    saveLoading.value = false;
  }
};
</script>

<style scoped>
.rigging-detail-container {
  padding: 20px 0;
}

.page-card {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.title {
  font-size: 16px;
  font-weight: 500;
}

.page-content {
  padding: 20px;
}

.info-section {
  display: flex;
  gap: 40px;
  padding: 20px;
  background-color: #f5f7fa;
  border-radius: 4px;
  margin-bottom: 20px;
}

.info-item {
  display: flex;
  align-items: center;
}

.label {
  font-weight: 500;
  color: #606266;
  margin-right: 8px;
}

.value {
  color: #303133;
}

.table-section {
  margin-top: 20px;
}

.table-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.table-title {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>
