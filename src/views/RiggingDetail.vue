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
            <span class="value">{{ translateLiftingType(riggingInfo.liftingType) }}</span>
          </div>
          <div class="info-item">
            <span class="label">吊索具名称：</span>
            <span class="value">{{ riggingInfo.liftingName }}</span>
          </div>
          <div class="info-item">
            <span class="label">生产厂家：</span>
            <span class="value">{{ riggingInfo.prodBusiness }}</span>
          </div>
          <div class="info-item">
            <span class="label">子类型：</span>
            <span class="value">{{ riggingInfo.subTypeName }}</span>
          </div>
        </div>

        <!-- 可编辑表格 -->
        <div class="table-section">
          <div class="table-toolbar">
            <span class="table-title">吊索具详细信息</span>
            <el-button type="primary" size="small" @click="handleAddRow">
              <el-icon><Plus /></el-icon>
              添加行
            </el-button>
          </div>
          
          <DynamicRiggingTable
            :table-data="tableData"
            :columns="currentColumns"
            :loading="tableLoading"
            @delete="handleDeleteRow"
          />
          
          <!-- 分页 -->
          <!--
          <el-pagination
            v-model:current-page="detailPage"
            :page-size="detailPageSize"
            :total="detailTotal"
            layout="total, prev, pager, next"
            class="pagination"
            @current-change="handleDetailPageChange"
          />
          -->
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { ArrowLeft, Plus } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { translateLiftingType } from "@/utils/common.js";
import { getLiftingDetailPage, addUpdateLiftingDetail, deleteSubItem, getLiftingInfoPage } from '@/api/index.js';
import { getColumnsByType } from '@/config/columnConfig.js';
import DynamicRiggingTable from '@/components/rigging-tables/DynamicRiggingTable.vue';

const router = useRouter();
const route = useRoute();

// 吊索具基本信息
const riggingInfo = ref({
  id: '',
  liftingType: '',
  liftingName: '',
  prodBusiness: '',
  subType: '',
  subTypeName: '',
});

// 分页和加载状态
const tableData = ref([]);
const tableLoading = ref(false);
const saveLoading = ref(false);
const detailPage = ref(-1);
const detailPageSize = ref(-1);
const detailTotal = ref(0);

const currentColumns = computed(() => {
  if (!riggingInfo.value.subType) {
    // Default columns if no subType
    return [
      { prop: 'deviceModel', label: '产品型号', minWidth: 120 },
      { prop: 'ratedLoad', label: '额定载荷', minWidth: 120 },
    ];
  }
  return getColumnsByType(riggingInfo.value.subType);
});

const createEmptyRow = () => {
  const emptyRow = {
    deviceName: '',
    deviceModel: '',
    deviceCode: '',
  };
  
  // Add all column properties to the empty row
  currentColumns.value.forEach(column => {
    emptyRow[column.prop] = '';
  });
  
  return emptyRow;
};

const fetchLiftingInfoFromTable = async (id) => {
  try {
    const response = await getLiftingInfoPage({
      pageNum: 1,
      pageSize: 10,
    });
    
    if (response && response.code === '0' && response.data && response.data.records) {
      // Find the record with matching id
      const record = response.data.records.find(item => item.id == id);
      
      if (record) {
        riggingInfo.value = {
          id: record.id,
          liftingType: record.liftingType,
          liftingName: record.liftingName,
          prodBusiness: record.prodBusiness,
          subType: record.twoLiftingType || '',
          subTypeName: record.twoLiftingName || '',
        };
      } else {
        ElMessage.error('未找到对应的吊索具信息');
      }
    } else {
      ElMessage.error(response?.message || '获取吊索具信息失败');
    }
  } catch (error) {
    console.error('获取吊索具信息失败:', error);
    ElMessage.error('获取吊索具信息失败，请检查网络连接');
  }
};

// 从API获取详情数据
const fetchDetailData = async () => {
  if (!riggingInfo.value.id) {
    // 如果是新建模式,不初始化默认行数据
    tableData.value = [];
    return;
  }

  tableLoading.value = true;
  try {
    const response = await getLiftingDetailPage({
      pageNum: detailPage.value,
      pageSize: detailPageSize.value,
      liftingInfoId: riggingInfo.value.id,
    });
    
    if (response && response.code === '0') {
      tableData.value = response.data.records || [];
      detailTotal.value = response.data.total || 0;
      
      // 如果没有数据，不初始化默认行数据
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
const handleBack = () => {
  router.back();
};

const handleAddRow = () => {
  tableData.value.push(createEmptyRow());
};

const handleDeleteRow = (index) => {
  // 获取要删除的行数据
  const rowData = tableData.value[index];
  
  // 如果当前行有id，调用删除接口
  if (rowData && rowData.id) {
    ElMessageBox.confirm('确定要删除这行数据吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(async () => {
        try {
          const response = await deleteSubItem(rowData.id);
          if (response && response.code === '0') {
            // 接口删除成功后，从表格中移除该行
            tableData.value.splice(index, 1);
            ElMessage.success('删除成功');
          } else {
            ElMessage.error(response?.message || '删除失败');
          }
        } catch (error) {
          console.error('删除失败:', error);
          ElMessage.error('删除失败，请检查网络连接');
        }
      })
      .catch(() => {
        ElMessage.info('已取消删除');
      });
  } else {
    // 如果没有id，直接从表格中移除（新增但未保存的行）
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
  }
};

const handleSave = async () => {
  // 验证数据
  const emptyFields = [];
  
  for (let i = 0; i < tableData.value.length; i++) {
    const row = tableData.value[i];
    const rowEmptyFields = [];
    
    // Check all required columns
    currentColumns.value.forEach(column => {
      const value = row[column.prop];
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        rowEmptyFields.push(column.label);
      }
    });
    
    if (rowEmptyFields.length > 0) {
      emptyFields.push({
        rowIndex: i + 1,
        fields: rowEmptyFields
      });
    }
  }
  
  // if (emptyFields.length > 0) {
  //   const messages = emptyFields.map(item => 
  //     `第${item.rowIndex}行：${item.fields.join('、')}为空`
  //   ).join('\n');
  //   ElMessage.warning({
  //     message: `以下字段不能为空：\n${messages}`,
  //     duration: 5000,
  //     dangerouslyUseHTMLString: false,
  //   });
  //   return;
  // }

  saveLoading.value = true;
  try {
    const response = await addUpdateLiftingDetail({
      liftingInfoId: riggingInfo.value.id,
      sysProjectTemplateLiftingList: tableData.value,
    });
    
    if (response && response.code === '0') {
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

onMounted(async () => {
  // 从路由参数获取基本信息
  if (route.query.id) {
    // 新建模式：从query参数获取
    riggingInfo.value.id = route.query.id;
    riggingInfo.value.liftingType = route.query.liftingType;
    riggingInfo.value.liftingName = route.query.liftingName;
    riggingInfo.value.prodBusiness = route.query.prodBusiness;
    riggingInfo.value.subType = route.query.twoLiftingType || route.query.subType || '';
    riggingInfo.value.subTypeName = route.query.twoLiftingName || route.query.subTypeName || '';
    
    // 加载详情数据
    await fetchDetailData();
  } else if (route.params.id) {
    riggingInfo.value.id = route.params.id;
    
    // 如果query中有足够的信息，直接使用而不再调用API
    if (route.query.liftingType && route.query.liftingName && route.query.prodBusiness) {
      riggingInfo.value.liftingType = route.query.liftingType;
      riggingInfo.value.liftingName = route.query.liftingName;
      riggingInfo.value.prodBusiness = route.query.prodBusiness;
      riggingInfo.value.subType = route.query.twoLiftingType || route.query.subType || '';
      riggingInfo.value.subTypeName = route.query.twoLiftingName || route.query.subTypeName || '';
    } else {
      // 如果信息不完整，从API获取所有信息
      await fetchLiftingInfoFromTable(route.params.id);
    }
    
    // 再加载详情数据
    await fetchDetailData();
  }
});
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
  flex-wrap: wrap;
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
