<template>
  <div class="crane-detail-container">
    <el-card class="detail-card">
      <template #header>
        <div class="card-header">
          <span>起重机设置</span>
        </div>
      </template>

      <!-- 起重机基本信息 -->
      <div class="info-section">
        <el-form :model="craneInfo" label-width="120px">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="起重机名称">
                <el-input v-model="craneInfo.craneName" placeholder="请输入起重机名称" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="生产厂家">
                <el-input v-model="craneInfo.manufacturer" placeholder="请输入生产厂家" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="型号">
                <el-input v-model="craneInfo.model" placeholder="请输入型号" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="类型">
                <el-select v-model="craneInfo.craneType" placeholder="请选择类型" style="width: 100%">
                  <el-option
                    v-for="item in craneTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>

      <!-- 起重机基础编辑 -->
      <div class="edit-section">
        <div class="section-header">
          <span>起重机基础编辑</span>
        </div>

        <div class="grid-form">
          <el-form :model="craneSpecs" label-width="140px">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="起重机最大长度">
                  <el-input v-model="craneSpecs.maxCraneLength" placeholder="请输入">
                    <template #append>m</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="车体配重">
                  <el-input v-model="craneSpecs.counterweight" placeholder="请输入">
                    <template #append>t</template>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="最大起升高度">
                  <el-input v-model="craneSpecs.maxLiftingHeight" placeholder="请输入">
                    <template #append>m</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="最大起重力矩">
                  <el-input v-model="craneSpecs.maxLiftingMoment" placeholder="请输入">
                    <template #append>t·m</template>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="主钩重量">
                  <el-input v-model="craneSpecs.mainHookWeight" placeholder="请输入">
                    <template #append>t</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="主钩最大钓重">
                  <el-input v-model="craneSpecs.mainHookMaxCapacity" placeholder="请输入">
                    <template #append>t</template>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="副钩吊钩重量">
                  <el-input v-model="craneSpecs.auxHookWeight" placeholder="请输入">
                    <template #append>t</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="副钩最大钓重">
                  <el-input v-model="craneSpecs.auxHookMaxCapacity" placeholder="请输入">
                    <template #append>t</template>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="最大变幅角度">
                  <el-input v-model="craneSpecs.maxLuffingAngle" placeholder="请输入">
                    <template #append>度</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="最小变幅角度">
                  <el-input v-model="craneSpecs.minLuffingAngle" placeholder="请输入">
                    <template #append>度</template>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="超起平衡重重量">
                  <el-input v-model="craneSpecs.superLiftCounterweightWeight" placeholder="请输入">
                    <template #append>t</template>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="超起平衡重回转半径">
                  <el-input v-model="craneSpecs.superLiftCounterweightRadius" placeholder="请输入">
                    <template #append>m</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="主臂最大长度">
                  <el-input v-model="craneSpecs.mainBoomMaxLength" placeholder="请输入">
                    <template #append>m</template>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="副臂最大长度">
                  <el-input v-model="craneSpecs.jibMaxLength" placeholder="请输入">
                    <template #append>m</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="主臂➕副臂最大长度">
                  <el-input v-model="craneSpecs.totalBoomMaxLength" placeholder="请输入">
                    <template #append>m</template>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>

      <!-- 主臂长度基础编辑 -->
      <div class="edit-section">
        <div class="section-header">
          <span>主臂长度基础编辑</span>
          <el-button type="primary" size="small" @click="handleAddMainBoomRow">
            <el-icon><Plus /></el-icon>
            添加行
          </el-button>
        </div>

        <div class="table-wrapper">
          <el-table
            :data="mainBoomTableData"
            border
            style="width: 100%"
            :header-cell-style="{ background: '#f5f7fa' }"
          >
            <el-table-column type="index" label="序号" width="60" />
            
            <el-table-column prop="workingRadius" label="工作半径" min-width="150">
              <template #default="scope">
                <el-input
                  v-model="scope.row.workingRadius"
                  placeholder="请输入半径"
                  size="small"
                >
                  <template #append>m</template>
                </el-input>
              </template>
            </el-table-column>
            
            <el-table-column prop="boomAngle" label="主臂角度" min-width="150">
              <template #default="scope">
                <el-input
                  v-model="scope.row.boomAngle"
                  placeholder="请输入主臂角度"
                  size="small"
                >
                  <template #append>°</template>
                </el-input>
              </template>
            </el-table-column>
            
            <el-table-column prop="liftingCapacity" label="额定载荷" min-width="150">
              <template #default="scope">
                <el-input
                  v-model="scope.row.liftingCapacity"
                  placeholder="请输入额定载荷"
                  size="small"
                >
                  <template #append>t</template>
                </el-input>
              </template>
            </el-table-column>
            
            <el-table-column label="操作" width="80" fixed="right">
              <template #default="scope">
                <el-button
                  link
                  type="danger"
                  size="small"
                  @click="handleDeleteMainBoomRow(scope.$index)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>

      <!-- 主臂+副臂基础编辑 -->
      <div class="edit-section">
        <div class="section-header">
          <span>主臂+副臂基础编辑</span>
          <el-button type="primary" size="small" @click="handleAddAuxBoomRow">
            <el-icon><Plus /></el-icon>
            添加行
          </el-button>
        </div>

        <div class="table-wrapper">
          <el-table
            :data="auxBoomTableData"
            border
            style="width: 100%"
            :header-cell-style="{ background: '#f5f7fa' }"
          >
            <el-table-column type="index" label="序号" width="60" />
            
            <el-table-column prop="workingRadius" label="工作半径" min-width="150">
              <template #default="scope">
                <el-input
                  v-model="scope.row.workingRadius"
                  placeholder="请输入半径"
                  size="small"
                >
                  <template #append>m</template>
                </el-input>
              </template>
            </el-table-column>
            
            <el-table-column prop="boomAngle" label="主臂+副臂角度" min-width="180">
              <template #default="scope">
                <el-input
                  v-model="scope.row.boomAngle"
                  placeholder="请输入主臂+副臂角度"
                  size="small"
                >
                  <template #append>°</template>
                </el-input>
              </template>
            </el-table-column>
            
            <el-table-column prop="liftingCapacity" label="额定载荷" min-width="150">
              <template #default="scope">
                <el-input
                  v-model="scope.row.liftingCapacity"
                  placeholder="请输入额定载荷"
                  size="small"
                >
                  <template #append>t</template>
                </el-input>
              </template>
            </el-table-column>
            
            <el-table-column label="操作" width="80" fixed="right">
              <template #default="scope">
                <el-button
                  link
                  type="danger"
                  size="small"
                  @click="handleDeleteAuxBoomRow(scope.$index)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>

      <!-- 底部按钮 -->
      <div class="footer-actions">
        <el-button type="primary" size="large" @click="handleConfirm">
          确认修改
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { Plus } from '@element-plus/icons-vue';
import { getCraneDetail, confirmUpdateCraneDetail } from "@/api/index.js";
import { getCraneTypeOptions } from "@/utils/common.js";

const route = useRoute();
const router = useRouter();

// 起重机基本信息
const craneInfo = ref({
  craneName: "",
  manufacturer: "",
  model: "",
  craneType: "",
});

// 起重机规格参数
const craneSpecs = ref({
  maxCraneLength: "",
  counterweight: "",
  maxLiftingHeight: "",
  maxLiftingMoment: "",
  mainHookWeight: "",
  mainHookMaxCapacity: "",
  auxHookWeight: "",
  auxHookMaxCapacity: "",
  maxLuffingAngle: "",
  minLuffingAngle: "",
  superLiftCounterweightWeight: "",
  superLiftCounterweightRadius: "",
  mainBoomMaxLength: "",
  jibMaxLength: "",
  totalBoomMaxLength: "",
});

// 表格数据
const mainBoomTableData = ref([]);
const auxBoomTableData = ref([]);

// 主臂表格操作函数
const handleAddMainBoomRow = () => {
  mainBoomTableData.value.push({
    workingRadius: "",
    mainBoomLength: "",
    liftingCapacity: "",
  });
};

const handleDeleteMainBoomRow = (index) => {
  mainBoomTableData.value.splice(index, 1);
};

// 副臂表格操作函数
const handleAddAuxBoomRow = () => {
  auxBoomTableData.value.push({
    workingRadius: "",
    boomAngle: "",
    liftingCapacity: "",
  });
};

const handleDeleteAuxBoomRow = (index) => {
  auxBoomTableData.value.splice(index, 1);
};

// 起重机类型选项
const craneTypeOptions = getCraneTypeOptions();

// 初始化数据
onMounted(async () => {
  // 从路由参数获取ID
  const id = route.query.id;
  
  // 如果有ID，调用接口获取详情数据
  if (id) {
    try {
      const response = await getCraneDetail(id);
      if (response && response.code === "0" && response.data) {
        // 填充基本信息
        const data = response.data;
        craneInfo.value.craneName = data.machineName || route.query.craneName;
        craneInfo.value.manufacturer = data.prodBusiness || route.query.manufacturer;
        craneInfo.value.model = data.model || route.query.model;
        craneInfo.value.craneType = data.type || route.query.craneType;
        
        // 填充规格参数（从sysProjectTemplateCraneDetail中获取）
        if (data.sysProjectTemplateCraneDetail) {
          const detailData = data.sysProjectTemplateCraneDetail;
          Object.keys(craneSpecs.value).forEach(key => {
            if (detailData[key] !== undefined) {
              craneSpecs.value[key] = detailData[key];
            }
          });
        }

        // 填充boom表格数据（从performanceDataVOS中获取）
        if (data.performanceDataVOS && Array.isArray(data.performanceDataVOS)) {
          // 清空现有数据
          mainBoomTableData.value = [];
          auxBoomTableData.value = [];
          
          // 遍历性能数据数组
          data.performanceDataVOS.forEach(item => {
            if (item.sysProjectLiftingPerformanceDataList && Array.isArray(item.sysProjectLiftingPerformanceDataList)) {
              if (item.armType === 0) {
                // 主臂长度基础编辑表格数据
                mainBoomTableData.value = item.sysProjectLiftingPerformanceDataList.map(performanceData => ({
                  workingRadius: performanceData.workingRadius || "",
                  boomAngle: performanceData.boomAngle || "",
                  liftingCapacity: performanceData.liftingCapacity || ""
                }));
              } else if (item.armType === 1) {
                // 主臂+副臂基础编辑表格数据
                auxBoomTableData.value = item.sysProjectLiftingPerformanceDataList.map(performanceData => ({
                  workingRadius: performanceData.workingRadius || "",
                  boomAngle: performanceData.boomAngle || "",
                  liftingCapacity: performanceData.liftingCapacity || ""
                }));
              }
            }
          });
        }
      } else {
        ElMessage.error(response?.message || "获取起重机详情失败");
      }
    } catch (error) {
      console.error("获取起重机详情失败:", error);
      ElMessage.error("获取起重机详情失败，请检查网络连接");
    }
  } else {
    // 如果没有ID，从路由参数获取基本信息（兼容旧的跳转方式）
    const craneName = route.query.craneName;
    const manufacturer = route.query.manufacturer;
    const model = route.query.model;
    const craneType = route.query.craneType;

    if (craneName) {
      craneInfo.value.craneName = craneName;
    }
    if (manufacturer) {
      craneInfo.value.manufacturer = manufacturer;
    }
    if (model) {
      craneInfo.value.model = model;
    }
    if (craneType) {
      craneInfo.value.craneType = craneType;
    }
  }
});

// 确认修改
const handleConfirm = async () => {
  // 验证基本信息必填字段
  if (!craneInfo.value.craneName) {
    ElMessage.warning("请输入起重机名称");
    return;
  }
  if (!craneInfo.value.manufacturer) {
    ElMessage.warning("请输入生产厂家");
    return;
  }
  if (!craneInfo.value.model) {
    ElMessage.warning("请输入型号");
    return;
  }
  if (!craneInfo.value.craneType) {
    ElMessage.warning("请选择类型");
    return;
  }

  // 验证起重机规格参数必填字段
  if (!craneSpecs.value.counterweight) {
    ElMessage.warning("请输入车体配重");
    return;
  }
  if (!craneSpecs.value.maxLiftingHeight) {
    ElMessage.warning("请输入最大起升高度");
    return;
  }
  if (!craneSpecs.value.maxLiftingMoment) {
    ElMessage.warning("请输入最大起重力矩");
    return;
  }
  if (!craneSpecs.value.maxLuffingAngle) {
    ElMessage.warning("请输入最大变幅角度");
    return;
  }

  // 验证boom表格数据
  for (let i = 0; i < mainBoomTableData.value.length; i++) {
    const row = mainBoomTableData.value[i];
    if (!row.workingRadius || !row.mainBoomLength || !row.liftingCapacity) {
      ElMessage.warning(`主臂长度基础编辑第${i + 1}行数据不完整，请填写完整`);
      return;
    }
  }

  for (let i = 0; i < auxBoomTableData.value.length; i++) {
    const row = auxBoomTableData.value[i];
    if (!row.workingRadius || !row.boomAngle || !row.liftingCapacity) {
      ElMessage.warning(`主臂+副臂基础编辑第${i + 1}行数据不完整，请填写完整`);
      return;
    }
  }

  try {
    // 准备请求参数，包含ID和所有craneSpecs参数
    const id = route.query.id;
    if (!id) {
      ElMessage.error("缺少起重机ID");
      return;
    }

    // 转换主臂表格数据格式
    const mainBoomPerformanceData = mainBoomTableData.value.map(item => ({
      workingRadius: item.workingRadius,
      boomAngle: item.mainBoomLength,
      liftingCapacity: item.liftingCapacity
    }));

    // 转换副臂表格数据格式
    const auxBoomPerformanceData = auxBoomTableData.value.map(item => ({
      workingRadius: item.workingRadius,
      boomAngle: item.boomAngle,
      liftingCapacity: item.liftingCapacity
    }));

    // 构造新的请求参数格式
    const requestParams = {
      craneInfoId: id,
      sysProjectTemplateCraneDetail: craneSpecs.value,
      performanceInfoAddUpdateList: [
        {
          craneType: 0, // 起重机类型，暂时固定为0
          armType: 0, // 主臂长度基础编辑
          sysProjectLiftingPerformanceDataList: mainBoomPerformanceData
        },
        {
          craneType: 0, // 起重机类型，暂时固定为0
          armType: 1, // 主臂+副臂基础编辑
          sysProjectLiftingPerformanceDataList: auxBoomPerformanceData
        }
      ]
    };

    const response = await confirmUpdateCraneDetail(requestParams);

    if (response && response.code === '0') {
      ElMessage.success("保存成功");
      // 返回数据管理页面
      router.push("/data-management");
    } else {
      ElMessage.error(response?.message || "保存失败");
    }
  } catch (error) {
    console.error("保存起重机详情失败:", error);
    ElMessage.error("保存失败，请检查网络连接");
  }
};
</script>

<style scoped>
.crane-detail-container {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.detail-card {
  max-width: 1200px;
  margin: 0 auto;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.card-header {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.info-section {
  padding: 20px 0;
  border-bottom: 1px solid #e4e7ed;
}

.edit-section {
  padding: 20px 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e4e7ed;
}

.section-header span {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.grid-form {
  background-color: #fafafa;
  padding: 20px;
  border-radius: 4px;
}

.table-wrapper {
  background-color: #fafafa;
  padding: 20px;
  border-radius: 4px;
}

.footer-actions {
  display: flex;
  justify-content: center;
  padding: 30px 0 10px;
  border-top: 1px solid #e4e7ed;
}

:deep(.el-form-item) {
  margin-bottom: 18px;
}

:deep(.el-form-item__label) {
  color: #606266;
  font-weight: 500;
}

:deep(.el-input__wrapper) {
  background-color: #fff;
}
</style>
