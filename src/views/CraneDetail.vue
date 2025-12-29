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
          <el-row v-if="canShowPush" :gutter="20">
            <el-col :span="12">
              <el-form-item label="是否推送">
                <el-switch
                  v-model="craneInfo.push"
                  :active-value="1"
                  :inactive-value="0"
                />
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

      <!-- 主臂长度基础编辑（计算方式1：半径+角度） -->
      <div v-if="isCalculationTypeRadiusAngle" class="edit-section">
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
                  <template #append>度</template>
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

      <!-- 主臂+副臂基础编辑（计算方式1：半径+角度） -->
      <div v-if="isCalculationTypeRadiusAngle" class="edit-section">
        <div class="section-header">
          <span>主臂+副臂(46+9.2)基础编辑</span>
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
                  <template #append>度</template>
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
      
      <!-- 主臂+副臂(46+16)基础编辑（计算方式1：半径+角度） -->
      <div v-if="isCalculationTypeRadiusAngle" class="edit-section">
        <div class="section-header">
          <span>主臂+副臂(46+16)基础编辑</span>
          <el-button type="primary" size="small" @click="handleAddAuxBoomRow2">
            <el-icon><Plus /></el-icon>
            添加行
          </el-button>
        </div>

        <div class="table-wrapper">
          <el-table
            :data="auxBoomTableData2"
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
                  <template #append>度</template>
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
                  @click="handleDeleteAuxBoomRow2(scope.$index)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>

      <!-- 动态额载表格编辑（计算方式2：半径+长度） -->
      <div v-if="isCalculationTypeRadiusLength" class="edit-section">
        <div class="section-header">
          <span>额载表格编辑</span>
          <el-button type="primary" size="small" @click="handleAddDynamicTable(0)">
            <el-icon><Plus /></el-icon>
            添加表格
          </el-button>
        </div>

        <div
          v-for="(table, tIndex) in dynamicTables"
          :key="tIndex"
          class="table-wrapper"
        >
          <div class="section-header">
            <el-input
              v-model="table.title"
              placeholder="请输入表格标题，例如：主臂长度基础编辑"
              style="max-width: 320px"
            />
            <div>
              <el-button
                type="primary"
                size="small"
                @click="handleAddDynamicRow(tIndex)"
              >
                <el-icon><Plus /></el-icon>
                添加行
              </el-button>
              <el-button
                v-if="dynamicTables.length > 1"
                type="danger"
                size="small"
                style="margin-left: 8px"
                @click="handleDeleteDynamicTable(tIndex)"
              >
                删除表格
              </el-button>
            </div>
          </div>

          <el-table
            :data="table.rows"
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

            <el-table-column prop="boomAngle" label="主臂长度" min-width="180">
              <template #default="scope">
                <el-input
                  v-model="scope.row.boomAngle"
                  placeholder="请输入主臂长度"
                  size="small"
                >
                  <template #append>值</template>
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
                  @click="handleDeleteDynamicRow(tIndex, scope.$index)"
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
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { Plus } from '@element-plus/icons-vue';
import { getCraneDetail, confirmUpdateCraneDetail } from "@/api/index.js";
import { getCraneTypeOptions, craneType } from "@/utils/common.js";
import userStore from "@/store/user.js";

const route = useRoute();
const router = useRouter();

// 起重机基本信息
const craneInfo = ref({
  craneName: "",
  manufacturer: "",
  model: "",
  craneType: "",
  calculationType: 1, // 额载计算方式：1 半径+角度，2 半径+长度
  push: 0, // 是否推送，0否1是
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

// 保存从接口返回的 sysProjectTemplateCraneDetail.id
const sysProjectTemplateCraneDetailId = ref(null);

// 表格数据（计算方式1：半径+角度，使用固定的3个表格）
const mainBoomTableData = ref([]);
const auxBoomTableData = ref([]);
const auxBoomTableData2 = ref([]);

// 动态表格数据（计算方式2：半径+长度，支持动态添加表格）
const dynamicTables = ref([
  {
    title: "", // 标题默认空，由用户输入
    rows: [],
  },
]);

// 计算当前是哪个额载计算方式
const isCalculationTypeRadiusAngle = computed(() => {
  const ct = Number(craneInfo.value.calculationType || 1);
  return ct === 1;
});

const isCalculationTypeRadiusLength = computed(() => {
  const ct = Number(craneInfo.value.calculationType || 1);
  return ct === 2;
});

// 主臂表格操作函数
const handleAddMainBoomRow = () => {
  mainBoomTableData.value.push({
    workingRadius: "",
    mainBoomMaxLength: "",
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

// 主臂+副臂(46+16)表格操作函数
const handleAddAuxBoomRow2 = () => {
  auxBoomTableData2.value.push({
    workingRadius: "",
    boomAngle: "",
    liftingCapacity: "",
  });
};

const handleDeleteAuxBoomRow2 = (index) => {
  auxBoomTableData2.value.splice(index, 1);
};

// 动态表格操作函数（计算方式2）
const handleAddDynamicTable = (baseIndex = 0) => {
  const baseTable = dynamicTables.value[baseIndex] || { title: "", rows: [] };
  // 只复制表格结构和标题，不复制行数据
  const newTable = {
    title: baseTable.title,
    rows: [
      {
        workingRadius: "",
        boomAngle: "",
        liftingCapacity: "",
      },
    ],
  };
  dynamicTables.value.push(newTable);
};

const handleDeleteDynamicTable = (tableIndex) => {
  if (dynamicTables.value.length <= 1) {
    ElMessage.warning("至少保留一个表格");
    return;
  }
  dynamicTables.value.splice(tableIndex, 1);
};

const handleAddDynamicRow = (tableIndex) => {
  const table = dynamicTables.value[tableIndex];
  if (!table) return;
  table.rows.push({
    workingRadius: "",
    boomAngle: "",
    liftingCapacity: "",
  });
};

const handleDeleteDynamicRow = (tableIndex, rowIndex) => {
  const table = dynamicTables.value[tableIndex];
  if (!table) return;
  table.rows.splice(rowIndex, 1);
};

// 起重机类型选项
const craneTypeOptions = getCraneTypeOptions();

// 判断用户是否有权限显示推送功能（根据菜单权限判断，如果包含数据管理菜单则显示）
const canShowPush = computed(() => {
  const userMenus = userStore.userState.userInfo?.menus || [];
  // 数据管理对应的 menus 值为 "3"
  return userMenus.includes("3");
});

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
        // 额载计算方式（优先接口，其次路由参数，默认1）
        if (data.sysProjectTemplateCrane && data.sysProjectTemplateCrane.calculationType !== undefined && data.sysProjectTemplateCrane.calculationType !== null) {
          craneInfo.value.calculationType = Number(data.sysProjectTemplateCrane.calculationType) || 1;
        } else if (data.calculationType !== undefined && data.calculationType !== null) {
          craneInfo.value.calculationType = Number(data.calculationType) || 1;
        } else if (route.query.calculationType !== undefined && route.query.calculationType !== null) {
          craneInfo.value.calculationType = Number(route.query.calculationType) || 1;
        }
        // 从 sysProjectTemplateCrane 对象中获取 push 值，如果没有则从 data.push 或路由参数获取
        if (data.sysProjectTemplateCrane && data.sysProjectTemplateCrane.push !== undefined && data.sysProjectTemplateCrane.push !== null) {
          craneInfo.value.push = parseInt(data.sysProjectTemplateCrane.push) || 0;
        } else {
          craneInfo.value.push = data.push !== undefined && data.push !== null ? parseInt(data.push) : (route.query.push ? parseInt(route.query.push) : 0);
        }
        
        // 填充规格参数（从sysProjectTemplateCraneDetail中获取）
        if (data.sysProjectTemplateCraneDetail) {
          const detailData = data.sysProjectTemplateCraneDetail;
          // 保存 id
          if (detailData.id !== undefined && detailData.id !== null) {
            sysProjectTemplateCraneDetailId.value = detailData.id;
          }
          Object.keys(craneSpecs.value).forEach(key => {
            if (detailData[key] !== undefined) {
              craneSpecs.value[key] = detailData[key];
            }
          });
        }

        // 填充boom表格数据（从performanceDataVOS中获取）
        if (data.performanceDataVOS && Array.isArray(data.performanceDataVOS)) {
          const ct = Number(craneInfo.value.calculationType || 1);
          if (ct === 1) {
            // 计算方式1：保持现有三块表格结构
            mainBoomTableData.value = [];
            auxBoomTableData.value = [];
            auxBoomTableData2.value = [];
            data.performanceDataVOS.forEach(item => {
              if (item.sysProjectLiftingPerformanceDataList && Array.isArray(item.sysProjectLiftingPerformanceDataList)) {
                if (item.armType === 0) {
                  // 主臂长度基础编辑表格数据
                  mainBoomTableData.value = item.sysProjectLiftingPerformanceDataList.map(performanceData => ({
                    workingRadius: performanceData.workingRadius ?? "",
                    boomAngle: performanceData.boomAngle ?? "",
                    liftingCapacity: performanceData.liftingCapacity ?? ""
                  }));
                } else if (item.armType === 1) {
                  // 主臂+副臂基础编辑表格数据
                  auxBoomTableData.value = item.sysProjectLiftingPerformanceDataList.map(performanceData => ({
                    workingRadius: performanceData.workingRadius ?? "",
                    boomAngle: performanceData.boomAngle ?? "",
                    liftingCapacity: performanceData.liftingCapacity ?? ""
                  }));
                } else if (item.armType === 2) {
                  // 主臂+副臂(46+16)基础编辑表格数据
                  auxBoomTableData2.value = item.sysProjectLiftingPerformanceDataList.map(performanceData => ({
                    workingRadius: performanceData.workingRadius ?? "",
                    boomAngle: performanceData.boomAngle ?? "",
                    liftingCapacity: performanceData.liftingCapacity ?? ""
                  }));
                }
              }
            });
          } else if (ct === 2) {
            // 计算方式2：使用动态表格结构
            dynamicTables.value = data.performanceDataVOS.map((item) => ({
              title: item.title || "",
              rows: (item.sysProjectLiftingPerformanceDataList || []).map((performanceData) => ({
                workingRadius: performanceData.workingRadius ?? "",
                boomAngle: performanceData.boomAngle ?? "",
                liftingCapacity: performanceData.liftingCapacity ?? "",
              })),
            }));
            // 如果接口没有返回数据，保持一个空表格
            if (!dynamicTables.value.length) {
              dynamicTables.value = [
                {
                  title: "主臂长度基础编辑",
                  rows: [],
                },
              ];
            }
          }
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
    const push = route.query.push;

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
    if (push !== undefined && push !== null) {
      craneInfo.value.push = parseInt(push) || 0;
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
  if (craneSpecs.value.counterweight === "" || craneSpecs.value.counterweight === undefined) {
    ElMessage.warning("请输入车体配重");
    return;
  }
  if (craneSpecs.value.maxLiftingMoment === "" || craneSpecs.value.maxLiftingMoment === undefined) {
    ElMessage.warning("请输入最大起重力矩");
    return;
  }
  // 以下字段改为非必填项：
  // - 最大起升高度 (maxLiftingHeight)
  // - 主钩重量 (mainHookWeight)
  // - 副钩吊钩重量 (auxHookWeight)
  // - 最大变幅角度 (maxLuffingAngle)
  // - 最小变幅角度 (minLuffingAngle)
  // - 超起平衡重重量 (superLiftCounterweightWeight)
  // - 超起平衡重回转半径 (superLiftCounterweightRadius)
  // - 副臂最大长度 (jibMaxLength)
  // - 主钩最大钓重 (mainHookMaxCapacity)
  // - 副钩最大钓重 (auxHookMaxCapacity)
  // - 主臂+副臂最大长度 (totalBoomMaxLength)

  const calcType = Number(craneInfo.value.calculationType || 1);

  if (calcType === 1) {
    // 验证固定三块表格数据
    for (let i = 0; i < mainBoomTableData.value.length; i++) {
      const row = mainBoomTableData.value[i];
      if ((row.workingRadius === "" || row.workingRadius === undefined) || 
          (row.boomAngle === "" || row.boomAngle === undefined) || 
          (row.liftingCapacity === "" || row.liftingCapacity === undefined)) {
        ElMessage.warning(`主臂长度基础编辑第${i + 1}行数据不完整，请填写完整`);
        return;
      }
    }

    for (let i = 0; i < auxBoomTableData.value.length; i++) {
      const row = auxBoomTableData.value[i];
      if ((row.workingRadius === "" || row.workingRadius === undefined) || 
          (row.boomAngle === "" || row.boomAngle === undefined) || 
          (row.liftingCapacity === "" || row.liftingCapacity === undefined)) {
        ElMessage.warning(`主臂+副臂(46+9.2)基础编辑第${i + 1}行数据不完整，请填写完整`);
        return;
      }
    }
    
    for (let i = 0; i < auxBoomTableData2.value.length; i++) {
      const row = auxBoomTableData2.value[i];
      if ((row.workingRadius === "" || row.workingRadius === undefined) || 
          (row.boomAngle === "" || row.boomAngle === undefined) || 
          (row.liftingCapacity === "" || row.liftingCapacity === undefined)) {
        ElMessage.warning(`主臂+副臂(46+16)基础编辑第${i + 1}行数据不完整，请填写完整`);
        return;
      }
    }
  } else if (calcType === 2) {
    // 验证动态表格数据
    if (!dynamicTables.value.length) {
      ElMessage.warning("请至少添加一个额载表格");
      return;
    }
    for (let t = 0; t < dynamicTables.value.length; t++) {
      const table = dynamicTables.value[t];
      if (!table.title || table.title.trim() === "") {
        ElMessage.warning(`第 ${t + 1} 个表格的标题未填写，请填写表格标题`);
        return;
      }
      if (!table.rows.length) {
        ElMessage.warning(`表格「${table.title}」至少需要一行数据`);
        return;
      }
      for (let r = 0; r < table.rows.length; r++) {
        const row = table.rows[r];
        if ((row.workingRadius === "" || row.workingRadius === undefined) ||
            (row.boomAngle === "" || row.boomAngle === undefined) ||
            (row.liftingCapacity === "" || row.liftingCapacity === undefined)) {
          ElMessage.warning(`表格「${table.title}」第 ${r + 1} 行数据不完整，请填写完整`);
          return;
        }
      }
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
      workingRadius: item.workingRadius !== undefined && item.workingRadius !== null ? item.workingRadius : "",
      boomAngle: item.boomAngle !== undefined && item.boomAngle !== null ? item.boomAngle : "",
      liftingCapacity: item.liftingCapacity !== undefined && item.liftingCapacity !== null ? item.liftingCapacity : ""
    }));

    // 转换副臂表格数据格式
    const auxBoomPerformanceData = auxBoomTableData.value.map(item => ({
      workingRadius: item.workingRadius !== undefined && item.workingRadius !== null ? item.workingRadius : "",
      boomAngle: item.boomAngle !== undefined && item.boomAngle !== null ? item.boomAngle : "",
      liftingCapacity: item.liftingCapacity !== undefined && item.liftingCapacity !== null ? item.liftingCapacity : ""
    }));
    
    // 转换主臂+副臂(46+16)表格数据格式
    const auxBoomPerformanceData2 = auxBoomTableData2.value.map(item => ({
      workingRadius: item.workingRadius !== undefined && item.workingRadius !== null ? item.workingRadius : "",
      boomAngle: item.boomAngle !== undefined && item.boomAngle !== null ? item.boomAngle : "",
      liftingCapacity: item.liftingCapacity !== undefined && item.liftingCapacity !== null ? item.liftingCapacity : ""
    }));

    // 构造新的请求参数格式
    const sysProjectTemplateCraneDetailData = {
      ...craneSpecs.value
    };
    // 如果有从接口获取的 id，则添加到 sysProjectTemplateCraneDetail 对象中
    if (sysProjectTemplateCraneDetailId.value !== null && sysProjectTemplateCraneDetailId.value !== undefined) {
      sysProjectTemplateCraneDetailData.id = sysProjectTemplateCraneDetailId.value;
    }
    
    // 构造 sysProjectTemplateCraneDTO 参数（起重机设置最上面的参数）
    const sysProjectTemplateCraneDTO = {
      machineName: craneInfo.value.craneName || "",
      type: craneInfo.value.craneType ? parseInt(craneInfo.value.craneType) : null,
      model: craneInfo.value.model || "",
      prodBusiness: craneInfo.value.manufacturer || "",
      calculationType: calcType || 1,
      push: craneInfo.value.push !== undefined && craneInfo.value.push !== null ? parseInt(craneInfo.value.push) : 0
    };
    
    let performanceInfoAddUpdateList = [];

    if (calcType === 1) {
      performanceInfoAddUpdateList = [
        {
          craneType: craneType, // 起重机类型，引用common.js里的craneType
          armType: 0, // 主臂长度基础编辑
          sysProjectLiftingPerformanceDataList: mainBoomPerformanceData
        },
        {
          craneType: craneType, // 起重机类型，引用common.js里的craneType
          armType: 1, // 主臂+副臂基础编辑
          sysProjectLiftingPerformanceDataList: auxBoomPerformanceData
        },
        {
          craneType: craneType, // 起重机类型，引用common.js里的craneType
          armType: 2, // 主臂+副臂(46+16)基础编辑
          sysProjectLiftingPerformanceDataList: auxBoomPerformanceData2
        }
      ];
    } else if (calcType === 2) {
      performanceInfoAddUpdateList = dynamicTables.value.map((table, index) => ({
        craneType: craneType,
        armType: index, // 使用索引区分不同表格
        title: table.title || "",
        sysProjectLiftingPerformanceDataList: table.rows.map((item) => ({
          workingRadius: item.workingRadius ?? "",
          boomAngle: item.boomAngle ?? "",
          liftingCapacity: item.liftingCapacity ?? "",
        })),
      }));
    }

    const requestParams = {
      craneInfoId: id,
      sysProjectTemplateCraneDTO: sysProjectTemplateCraneDTO,
      sysProjectTemplateCraneDetail: sysProjectTemplateCraneDetailData,
      performanceInfoAddUpdateList,
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
  height: 100%;
  overflow-y: auto;
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
