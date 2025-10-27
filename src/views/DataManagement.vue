<template>
  <div class="data-management-container">
    <el-card class="page-card">
      <template #header>
        <div class="card-header">
          <span>数据管理</span>
        </div>
      </template>
      <div class="page-content">
        <el-tabs v-model="activeTab" class="data-tabs">
          <!-- 起重机数据库 -->
          <el-tab-pane label="起重机数据库" name="crane">
            <div class="tab-content">
              <div class="toolbar">
                <el-input
                  v-model="craneSearch"
                  placeholder="搜索"
                  prefix-icon="Search"
                  style="width: 240px"
                  clearable
                />
                <el-button type="primary" @click="handleAddCrane">
                  <el-icon><Plus /></el-icon>
                  新建
                </el-button>
              </div>
              <el-table
                :data="craneData"
                style="width: 100%"
                :header-cell-style="{ background: '#f5f7fa' }"
              >
                <el-table-column type="selection" width="55" />
                <el-table-column label="序号" width="80">
                  <template #default="scope">
                    {{ scope.$index + 1 }}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="deviceName"
                  label="吊索具名称"
                  min-width="150"
                />
                <el-table-column
                  prop="liftingType"
                  label="类型"
                  min-width="120"
                >
                  <template #default="scope">
                    {{ translateLiftingType(scope.row.liftingType) }}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="manufacturer"
                  label="生产厂家"
                  min-width="150"
                />
                <el-table-column prop="creator" label="创建人" width="120" />
                <el-table-column
                  prop="createTime"
                  label="录入时间"
                  width="180"
                />
                <el-table-column label="操作" width="150" fixed="right">
                  <template #default="scope">
                    <el-button
                      link
                      type="primary"
                      size="small"
                      @click="handleEdit(scope.row, 'crane')"
                    >
                      编辑
                    </el-button>
                    <el-button
                      link
                      type="danger"
                      size="small"
                      @click="handleDelete(scope.row, 'crane')"
                    >
                      删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
              <el-pagination
                v-model:current-page="cranePage"
                :page-size="10"
                :total="craneTotal"
                layout="total, prev, pager, next"
                class="pagination"
              />
            </div>
          </el-tab-pane>

          <!-- 吊索具数据库 -->
          <el-tab-pane label="吊索具数据库" name="rigging">
            <div class="tab-content">
              <div class="toolbar">
                <el-input
                  v-model="riggingSearch"
                  placeholder="搜索"
                  prefix-icon="Search"
                  style="width: 240px"
                  clearable
                  @input="handleRiggingSearch"
                />
                <el-button type="primary" @click="handleAddRigging">
                  <el-icon><Plus /></el-icon>
                  新建
                </el-button>
              </div>
              <!-- Add loading state for table -->
              <el-table
                :data="riggingData"
                v-loading="riggingLoading"
                style="width: 100%"
                :header-cell-style="{ background: '#f5f7fa' }"
              >
                <el-table-column type="selection" width="55" />
                <el-table-column label="序号" width="80">
                  <template #default="scope">
                    {{ scope.$index + 1 + (riggingPage - 1) * riggingPageSize }}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="liftingName"
                  label="吊索具名称"
                  min-width="150"
                />
                <el-table-column
                  prop="liftingType"
                  label="类型"
                  min-width="120"
                >
                  <template #default="scope">
                    {{ translateLiftingType(scope.row.liftingType) }}
                  </template>
                </el-table-column>
                <el-table-column prop="twoLiftingName" label="子类型" width="120" />
                <el-table-column
                  prop="prodBusiness"
                  label="生产厂家"
                  min-width="150"
                />
                <el-table-column prop="createName" label="创建人" width="80" />
                <el-table-column
                  prop="createTime"
                  label="录入时间"
                  width="180"
                />
                <el-table-column label="操作" width="150" fixed="right">
                  <template #default="scope">
                    <el-button
                      link
                      type="primary"
                      size="small"
                      @click="handleEdit(scope.row, 'rigging')"
                    >
                      编辑
                    </el-button>
                    <el-button
                      link
                      type="danger"
                      size="small"
                      @click="handleDelete(scope.row, 'rigging')"
                    >
                      删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
              <!-- Update pagination to trigger API call on page change -->
              <el-pagination
                v-model:current-page="riggingPage"
                :page-size="riggingPageSize"
                :total="riggingTotal"
                layout="total, prev, pager, next"
                class="pagination"
                @current-change="handleRiggingPageChange"
              />
            </div>
          </el-tab-pane>

          <!-- 设备数据库 -->
          <el-tab-pane label="设备数据库" name="equipment">
            <div class="tab-content">
              <div class="toolbar">
                <el-input
                  v-model="equipmentSearch"
                  placeholder="搜索"
                  prefix-icon="Search"
                  style="width: 240px"
                  clearable
                />
                <el-button type="primary" @click="handleAddEquipment">
                  <el-icon><Plus /></el-icon>
                  新建
                </el-button>
              </div>
              <el-table
                :data="equipmentData"
                style="width: 100%"
                :header-cell-style="{ background: '#f5f7fa' }"
              >
                <el-table-column type="selection" width="55" />
                <el-table-column label="序号" width="80">
                  <template #default="scope">
                    {{ scope.$index + 1 }}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="name"
                  label="吊索具名称"
                  min-width="150"
                />
                <el-table-column prop="type" label="类型" min-width="120">
                  <template #default="scope">
                    {{ translateLiftingType(scope.row.type) }}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="manufacturer"
                  label="生产厂家"
                  min-width="150"
                />
                <el-table-column prop="creator" label="创建人" width="120" />
                <el-table-column
                  prop="createTime"
                  label="录入时间"
                  width="180"
                />
                <el-table-column label="操作" width="150" fixed="right">
                  <template #default="scope">
                    <el-button
                      link
                      type="primary"
                      size="small"
                      @click="handleEdit(scope.row, 'equipment')"
                    >
                      编辑
                    </el-button>
                    <el-button
                      link
                      type="danger"
                      size="small"
                      @click="handleDelete(scope.row, 'equipment')"
                    >
                      删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
              <el-pagination
                v-model:current-page="equipmentPage"
                :page-size="10"
                :total="equipmentTotal"
                layout="total, prev, pager, next"
                class="pagination"
              />
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-card>

    <!-- 新建起重机弹窗 -->
    <el-dialog
      v-model="craneDialogVisible"
      title="新建起重机"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form :model="craneForm" label-width="100px">
        <el-form-item label="起重机名称">
          <el-input v-model="craneForm.craneName" placeholder="请输入（例如：WDT型）" />
        </el-form-item>
        <el-form-item label="起重机类型">
          <el-select v-model="craneForm.craneType" placeholder="请选择起重机类型">
            <el-option label="汽车吊" value="汽车吊" />
            <el-option label="履带吊" value="履带吊" />
            <el-option label="塔吊" value="塔吊" />
            <el-option label="门式起重机" value="门式起重机" />
          </el-select>
        </el-form-item>
        <el-form-item label="型号">
          <el-input v-model="craneForm.model" placeholder="请输入型号" />
        </el-form-item>
        <el-form-item label="生产厂家">
          <el-input v-model="craneForm.manufacturer" placeholder="请输入生产厂家（例如：三一重工）" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="craneDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleCraneNext">下一步</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 新建吊索具弹窗 -->
    <el-dialog
      v-model="riggingDialogVisible"
      title="新建吊索具"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form :model="riggingForm" label-width="100px">
        <el-form-item label="吊索具名称">
          <el-input v-model="riggingForm.liftingName" placeholder="请输入吊索具名称" />
        </el-form-item>
        <el-form-item label="吊索具类型">
          <el-select v-model="riggingForm.liftingType" placeholder="请选择吊索具类型" @change="handleLiftingTypeChange">
            <el-option label="钢丝绳" value="0" />
            <el-option label="吊带" value="1" />
            <el-option label="卸扣" value="2" />
            <el-option label="缆绳" value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="子类型">
          <el-select v-model="riggingForm.subType" placeholder="请选择子类型">
            <el-option
              v-for="item in subTypeOptions"
              :key="item.liftingType"
              :label="item.liftingTypeName"
              :value="item.liftingType"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="生产厂家">
          <el-input
            v-model="riggingForm.prodBusiness"
            placeholder="请输入生产厂家"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="riggingDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleRiggingNext"
            >下一步</el-button
          >
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { Plus } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { getLiftingInfoPage, addUpdateLiftingInfo, getSubType, deleteTemplateItem } from "@/api/index.js";

const router = useRouter();

import { translateLiftingType } from "@/utils/common.js";

// 当前激活的标签页
const activeTab = ref("crane");

// 起重机数据
const craneSearch = ref("");
const cranePage = ref(1);
const craneTotal = ref(6532);
const craneData = ref([]);

// 吊索具数据
const riggingSearch = ref("");
const riggingPage = ref(1);
const riggingPageSize = ref(10);
const riggingTotal = ref(0);
const riggingData = ref([]);
const riggingLoading = ref(false);

// 设备数据
const equipmentSearch = ref("");
const equipmentPage = ref(1);
const equipmentTotal = ref(6532);
const equipmentData = ref([
  {
    id: 1,
    name: "五",
    type: "0",
    manufacturer: "xxxxxx公司",
    creator: "admin",
    createTime: "2025-01-01 12:00:00",
  },
  {
    id: 2,
    name: "XXXXXXXX吊索具",
    type: "1",
    manufacturer: "xxxxxx公司",
    creator: "admin",
    createTime: "2025-01-01 12:00:00",
  },
  {
    id: 3,
    name: "XXXXXXXX吊索具",
    type: "2",
    manufacturer: "xxxxxx公司",
    creator: "admin",
    createTime: "2025-01-01 12:00:00",
  },
  {
    id: 4,
    name: "XXXXXXXX吊索具",
    type: "3",
    manufacturer: "xxxxxx公司",
    creator: "admin",
    createTime: "2025-01-01 12:00:00",
  },
  {
    id: 5,
    name: "XXXXXXXX吊索具",
    type: "0",
    manufacturer: "xxxxxx公司",
    creator: "admin",
    createTime: "2025-01-01 12:00:00",
  },
  {
    id: 6,
    name: "XXXXXXXX吊索具",
    type: "1",
    manufacturer: "xxxxxx公司",
    creator: "admin",
    createTime: "2025-01-01 12:00:00",
  },
  {
    id: 7,
    name: "XXXXXXXX吊索具",
    type: "2",
    manufacturer: "xxxxxx公司",
    creator: "admin",
    createTime: "2025-01-01 12:00:00",
  },
  {
    id: 8,
    name: "XXXXXXXX吊索具",
    type: "3",
    manufacturer: "xxxxxx公司",
    creator: "admin",
    createTime: "2025-01-01 12:00:00",
  },
  {
    id: 9,
    name: "XXXXXXXX吊索具",
    type: "0",
    manufacturer: "xxxxxx公司",
    creator: "admin",
    createTime: "2025-01-01 12:00:00",
  },
  {
    id: 10,
    name: "XXXXXXXX吊索具",
    type: "1",
    manufacturer: "xxxxxx公司",
    creator: "admin",
    createTime: "2025-01-01 12:00:00",
  },
]);

// 新建吊索具弹窗
const riggingDialogVisible = ref(false);
const riggingForm = ref({
  liftingType: "",
  subType: "",
  liftingName: "",
  prodBusiness: "",
});

// 新建起重机弹窗
const craneDialogVisible = ref(false);
const craneForm = ref({
  craneName: "",
  craneType: "",
  model: "",
  manufacturer: "",
});

// 子类型选项
const subTypeOptions = ref([]);

// 获取子类型数据
const fetchSubTypes = async (type) => {
  if (!type) {
    subTypeOptions.value = [];
    return;
  }
  
  try {
    const response = await getSubType(type);
    if (response && response.code === "0") {
      subTypeOptions.value = response.data || [];
    } else {
      subTypeOptions.value = [];
      ElMessage.error(response?.message || "获取子类型数据失败");
    }
  } catch (error) {
    console.error("获取子类型数据失败:", error);
    subTypeOptions.value = [];
    ElMessage.error("获取子类型数据失败，请检查网络连接");
  }
};

// 处理吊索具类型变化
const handleLiftingTypeChange = (value) => {
  riggingForm.value.subType = "";
  fetchSubTypes(value);
};

// 新建起重机
const handleAddCrane = () => {
  craneDialogVisible.value = true;
  craneForm.value = {
    craneName: "",
    craneType: "",
    model: "",
    manufacturer: "",
  };
};

// 新建吊索具
const handleAddRigging = () => {
  riggingDialogVisible.value = true;
  riggingForm.value = {
    liftingType: "",
    subType: "",
    liftingName: "",
    prodBusiness: "",
  };
  subTypeOptions.value = [];
};

// 新建设备
const handleAddEquipment = () => {
  ElMessage.info("新建设备功能待实现");
};

// 编辑
const handleEdit = (row, type) => {
  if (type === "rigging") {
    router.push({
      path: `/rigging-detail/${row.id}`,
      query: {
        liftingType: row.liftingType,
        liftingName: row.liftingName,
        twoLiftingType: row.twoLiftingType,
        twoLiftingName: row.twoLiftingName,
        prodBusiness: row.prodBusiness
      }
    });
  } else {
    ElMessage.info(`编辑${type === "crane" ? "起重机" : "设备"}功能待实现`);
  }
};

// 删除
const handleDelete = (row, type) => {
  ElMessageBox.confirm(
    `确定要删除这条${
      type === "crane" ? "起重机" : type === "rigging" ? "吊索具" : "设备"
    }数据吗？`,
    "提示",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    }
  )
    .then(async () => {
      if (type === 'rigging') {
        try {
          await deleteTemplateItem(row.id);
          ElMessage.success("删除成功");
        } catch (error) {
          console.error("删除失败:", error);
          ElMessage.error("删除失败，请重试");
        }
      } else {
        ElMessage.success("删除成功");
      }
    })
    .catch(() => {
      ElMessage.info("已取消删除");
    });
};

// 起重机弹窗下一步
const handleCraneNext = () => {
  if (!craneForm.value.craneName) {
    ElMessage.warning("请输入起重机名称");
    return;
  }
  if (!craneForm.value.craneType) {
    ElMessage.warning("请选择起重机类型");
    return;
  }
  if (!craneForm.value.model) {
    ElMessage.warning("请输入型号");
    return;
  }
  if (!craneForm.value.manufacturer) {
    ElMessage.warning("请输入生产厂家");
    return;
  }

  // 跳转到起重机详情页面
  router.push({
    path: "/crane-detail",
    query: {
      craneName: craneForm.value.craneName,
      craneType: craneForm.value.craneType,
      model: craneForm.value.model,
      manufacturer: craneForm.value.manufacturer,
    },
  });
  craneDialogVisible.value = false;
};

// 吊索具弹窗下一步
const handleRiggingNext = async () => {
  if (!riggingForm.value.liftingType) {
    ElMessage.warning("请选择吊索具类型");
    return;
  }
  if (!riggingForm.value.liftingName) {
    ElMessage.warning("请输入吊索具名称");
    return;
  }
  if (!riggingForm.value.prodBusiness) {
    ElMessage.warning("请输入生产厂家");
    return;
  }

  try {
    // 准备请求参数
    const requestParams = {
      ...riggingForm.value
    };
    
    // 如果选择了子类型，从subTypeOptions中获取对应的liftingTypeName和liftingType
    if (riggingForm.value.subType) {
      const selectedSubType = subTypeOptions.value.find(
        item => item.liftingType === riggingForm.value.subType
      );
      
      if (selectedSubType) {
        requestParams.twoLiftingType = selectedSubType.liftingType;
        requestParams.twoLiftingName = selectedSubType.liftingTypeName;
      }
    }

    const response = await addUpdateLiftingInfo(requestParams);

    if (response && response.code === '0') {
      ElMessage.success("创建成功");
      riggingDialogVisible.value = false;

      router.push({
        path: "/rigging-detail",
        query: {
          id: response.data.id,
          liftingType: riggingForm.value.liftingType,
          liftingName: riggingForm.value.liftingName,
          prodBusiness: riggingForm.value.prodBusiness,
          subType: requestParams.twoLiftingType || '',
          subTypeName: requestParams.twoLiftingName || '',
        },
      });
    } else {
      ElMessage.error(response?.message || "创建失败");
    }
  } catch (error) {
    console.error("创建吊索具失败:", error);
    ElMessage.error("创建失败，请检查网络连接");
  }
};

const fetchRiggingData = async () => {
  riggingLoading.value = true;
  try {
    const response = await getLiftingInfoPage({
      pageNum: riggingPage.value,
      pageSize: riggingPageSize.value,
    });

    if (response && response.code === "0") {
      // 对返回的数据进行类型翻译处理
      const records = response.data.records || [];
      riggingData.value = records.map((item) => ({
        ...item,
        liftingType: translateLiftingType(item.liftingType),
      }));
      riggingTotal.value = response.data.total || 0;
    } else {
      ElMessage.error(response?.message || "获取数据失败");
    }
  } catch (error) {
    console.error("获取吊索具数据失败:", error);
    ElMessage.error("获取数据失败，请检查网络连接");
  } finally {
    riggingLoading.value = false;
  }
};

const handleRiggingPageChange = (page) => {
  riggingPage.value = page;
  fetchRiggingData();
};

let searchTimer = null;
const handleRiggingSearch = () => {
  if (searchTimer) {
    clearTimeout(searchTimer);
  }
  searchTimer = setTimeout(() => {
    riggingPage.value = 1; // Reset to first page on search
    fetchRiggingData();
  }, 500);
};

watch(activeTab, (newTab) => {
  if (newTab === "rigging" && riggingData.value.length === 0) {
    fetchRiggingData();
  }
});

onMounted(() => {
  if (activeTab.value === "rigging") {
    fetchRiggingData();
  }
});
</script>

<style scoped>
.data-management-container {
  padding: 20px 0;
}

.page-card {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  font-weight: 500;
}

.page-content {
  padding: 20px 0;
}

.data-tabs {
  width: 100%;
}

.tab-content {
  padding: 20px 0;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
