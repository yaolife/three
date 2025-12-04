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
                <div class="search-group">
                  <el-input
                    v-model="craneSearch"
                    placeholder="请输入起重机名称"
                    prefix-icon="Search"
                    style="width: 240px"
                    clearable
                    @keyup.enter="handleCraneSearch"
                  />
                  <el-button type="primary" @click="handleCraneSearch" style="margin-left: 8px">
                    搜索
                  </el-button>
                </div>
                <el-button type="primary" @click="handleAddCrane">
                  <el-icon><Plus /></el-icon>
                  新建
                </el-button>
              </div>
              <el-table
                :data="craneData"
                v-loading="craneLoading"
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
                  prop="machineName"
                  label="起重机名称"
                  min-width="150"
                />
                <el-table-column
                  prop="type"
                  label="类型"
                  min-width="120"
                >
                  <template #default="scope">
                    {{ translateCraneType(scope.row.type) }}
                  </template>
                </el-table-column>
                  <el-table-column
                  prop="model"
                  label="型号"
                  min-width="150"
                />
                <el-table-column
                  v-if="canShowPush"
                  label="是否推送"
                  width="120"
                >
                  <template #default="scope">
                    <el-switch
                      v-model="scope.row.push"
                      :active-value="1"
                      :inactive-value="0"
                      @change="handlePushChange(scope.row)"
                    />
                  </template>
                </el-table-column>
                <el-table-column
                  prop="prodBusiness"
                  label="生产厂家"
                  min-width="150"
                />
                <el-table-column prop="createName" label="创建人" width="120" />
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
                      style="color: white;"
                      size="large"
                      @click="handleEdit(scope.row, 'crane')"
                    >
                      编辑
                    </el-button>
                    <el-button
                      link
                      type="danger"
                      size="large"
                      @click="handleDelete(scope.row, 'crane')"
                    >
                      删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div class="pagination-container">
                <div class="pagination-info">共 {{ craneTotal }} 条</div>
                <el-pagination
                  v-model:current-page="cranePage"
                  v-model:page-size="cranePageSize"
                  :page-sizes="[10, 20, 50, 100]"
                  :total="craneTotal"
                  layout="prev, pager, next, jumper, sizes"
                  @current-change="handleCranePageChange"
                  @size-change="handleCranePageSizeChange"
                />
              </div>
            </div>
          </el-tab-pane>

          <!-- 吊索具数据库 -->
          <el-tab-pane label="吊索具数据库" name="rigging">
            <div class="tab-content">
              <div class="toolbar">
                <div class="search-group">
                  <el-input
                    v-model="riggingSearch"
                    placeholder="请输入吊索具名称"
                    prefix-icon="Search"
                    style="width: 240px"
                    clearable
                    @keyup.enter="handleRiggingSearch"
                  />
                  <el-button type="primary" @click="handleRiggingSearch" style="margin-left: 8px">
                    搜索
                  </el-button>
                </div>
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
                  v-if="canShowPush"
                  label="是否推送"
                  width="120"
                >
                  <template #default="scope">
                    <el-switch
                      v-model="scope.row.push"
                      :active-value="1"
                      :inactive-value="0"
                      @change="handleRiggingPushChange(scope.row)"
                    />
                  </template>
                </el-table-column>
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
                        style="color: white;"
                      size="large"
                      @click="handleEdit(scope.row, 'rigging')"
                    >
                      编辑
                    </el-button>
                    <el-button
                      link
                      type="danger"
                      size="large"
                      @click="handleDelete(scope.row, 'rigging')"
                    >
                      删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
              <!-- Update pagination to trigger API call on page change -->
              <div class="pagination-container">
                <div class="pagination-info">共 {{ riggingTotal }} 条</div>
                <el-pagination
                  v-model:current-page="riggingPage"
                  v-model:page-size="riggingPageSize"
                  :page-sizes="[10, 20, 50, 100]"
                  :total="riggingTotal"
                  layout="prev, pager, next, jumper, sizes"
                  @current-change="handleRiggingPageChange"
                  @size-change="handleRiggingPageSizeChange"
                />
              </div>
            </div>
          </el-tab-pane>

          <!-- 设备数据库 -->
          <el-tab-pane label="设备数据库" name="equipment">
            <div class="tab-content">
              <div class="toolbar">
                <div class="search-group">
                  <el-input
                    v-model="equipmentSearch"
                    placeholder="请输入设备名称"
                    prefix-icon="Search"
                    style="width: 240px"
                    clearable
                    @keyup.enter="handleEquipmentSearch"
                  />
                  <el-button type="primary" @click="handleEquipmentSearch" style="margin-left: 8px">
                    搜索
                  </el-button>
                </div>
                <el-button type="primary" @click="handleAddEquipment">
                  <el-icon><Plus /></el-icon>
                  新建
                </el-button>
              </div>
              <el-table
                :data="equipmentData"
                v-loading="equipmentLoading"
                style="width: 100%"
                :header-cell-style="{ background: '#f5f7fa' }"
              >
                <el-table-column type="selection" width="55" />
                <el-table-column label="序号" width="80">
                    <template #default="scope">
                      {{ scope.$index + 1 + (equipmentPage - 1) * equipmentPageSize }}
                    </template>
                  </el-table-column>
                <el-table-column
                  prop="deviceName"
                  label="设备名称"
                  min-width="150"
                />
                <el-table-column prop="deviceType" label="型号" min-width="120" />
                <el-table-column
                  v-if="canShowPush"
                  label="是否推送"
                  width="120"
                >
                  <template #default="scope">
                    <el-switch
                      v-model="scope.row.push"
                      :active-value="1"
                      :inactive-value="0"
                      @change="handleDevicePushChange(scope.row)"
                    />
                  </template>
                </el-table-column>
                <el-table-column
                  prop="prodBusiness"
                  label="生产厂家"
                  min-width="150"
                />
                <el-table-column prop="createName" label="创建人" width="120" />
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
                        style="color: white;"
                      size="large"
                      @click="handleEdit(scope.row, 'equipment')"
                    >
                      编辑
                    </el-button>
                    <el-button
                      link
                      type="danger"
                      size="large"
                      @click="handleDelete(scope.row, 'equipment')"
                    >
                      删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div class="pagination-container">
                <div class="pagination-info">共 {{ equipmentTotal }} 条</div>
                <el-pagination
                  v-model:current-page="equipmentPage"
                  v-model:page-size="equipmentPageSize"
                  :page-sizes="[10, 20, 50, 100]"
                  :total="equipmentTotal"
                  layout="prev, pager, next, jumper, sizes"
                  @current-change="handleEquipmentPageChange"
                  @size-change="handleEquipmentPageSizeChange"
                />
              </div>
            </div>
          </el-tab-pane>

          <!-- 起重机模型库 -->
          <el-tab-pane label="起重机模型库" name="craneModel">
            <div class="tab-content">
              <div class="toolbar">
                <div class="search-group">
                  <el-input
                    v-model="craneModelSearch"
                    placeholder="请输入模型名称"
                    prefix-icon="Search"
                    style="width: 240px"
                    clearable
                    @keyup.enter="handleCraneModelSearch"
                  />
                  <el-button type="primary" @click="handleCraneModelSearch" style="margin-left: 8px">
                    搜索
                  </el-button>
                </div>
                <el-button type="primary" @click="handleAddCraneModel">
                  <el-icon><Plus /></el-icon>
                  新建
                </el-button>
              </div>
              <el-table
                :data="craneModelData"
                v-loading="craneModelLoading"
                style="width: 100%"
                :header-cell-style="{ background: '#f5f7fa' }"
              >
                <el-table-column type="selection" width="55" />
                <el-table-column label="序号" width="80">
                  <template #default="scope">
                    {{ scope.$index + 1 + (craneModelPage - 1) * craneModelPageSize }}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="modelName"
                  label="模型名称"
                  min-width="150"
                />
                <el-table-column
                  prop="createName"
                  label="创建人"
                  width="120"
                />
                <el-table-column
                  prop="createTime"
                  label="录入时间"
                  width="180"
                />
                <el-table-column
                  v-if="canShowPush"
                  label="是否推送"
                  width="120"
                >
                  <template #default="scope">
                    <el-switch
                      v-model="scope.row.push"
                      :active-value="1"
                      :inactive-value="0"
                      @change="handleCraneModelPushChange(scope.row)"
                    />
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="120" fixed="right">
                  <template #default="scope">
                    <el-button
                      link
                      type="danger"
                      size="large"
                      @click="handleDeleteCraneModel(scope.row)"
                    >
                      删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div class="pagination-container">
                <div class="pagination-info">共 {{ craneModelTotal }} 条</div>
                <el-pagination
                  v-model:current-page="craneModelPage"
                  v-model:page-size="craneModelPageSize"
                  :page-sizes="[10, 20, 50, 100]"
                  :total="craneModelTotal"
                  layout="prev, pager, next, jumper, sizes"
                  @current-change="handleCraneModelPageChange"
                  @size-change="handleCraneModelPageSizeChange"
                />
              </div>
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
          <el-input v-model="craneForm.machineName" placeholder="请输入（例如：WDT型）" />
        </el-form-item>
        <el-form-item label="起重机类型">
          <el-select v-model="craneForm.type" placeholder="请选择起重机类型">
            <el-option
              v-for="item in getCraneTypeOptions()"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="型号">
          <el-input v-model="craneForm.model" placeholder="请输入型号" />
        </el-form-item>
        <el-form-item label="生产厂家">
          <el-input v-model="craneForm.prodBusiness" placeholder="请输入生产厂家（例如：三一重工）" />
        </el-form-item>
        <el-form-item v-if="canShowPush" label="是否推送">
          <el-switch
            v-model="craneForm.push"
            :active-value="1"
            :inactive-value="0"
          />
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
        <el-form-item v-if="canShowPush" label="是否推送">
          <el-switch
            v-model="riggingForm.push"
            :active-value="1"
            :inactive-value="0"
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

    <!-- 设备弹窗 -->
    <el-dialog
      v-model="equipmentDialogVisible"
      :title="equipmentDialogTitle"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form :model="equipmentForm" label-width="100px">
        <el-form-item label="设备名称">
          <el-input v-model="equipmentForm.deviceName" placeholder="请输入设备名称" />
        </el-form-item>
        <el-form-item label="型号">
          <el-input v-model="equipmentForm.deviceType" placeholder="请输入型号" />
        </el-form-item>
        <el-form-item label="生产厂家">
          <el-input v-model="equipmentForm.prodBusiness" placeholder="请输入生产厂家" />
        </el-form-item>
        <el-form-item label="重量(kg)">
          <el-input-number
            v-model="equipmentForm.weight"
            :precision="2"
            :min="0"
            :step="0.01"
            placeholder="请输入重量"
            style="width: 50%"
          />
        </el-form-item>
        <el-form-item label="长度(m)">
          <el-input-number
            v-model="equipmentForm.length"
            :precision="2"
            :min="0"
            :step="0.01"
            placeholder="请输入长度"
            style="width: 50%"
          />
        </el-form-item>
        <el-form-item label="宽度(m)">
          <el-input-number
            v-model="equipmentForm.width"
            :precision="2"
            :min="0"
            :step="0.01"
            placeholder="请输入宽度"
            style="width: 50%"
          />
        </el-form-item>
        <el-form-item label="高度(m)">
          <el-input-number
            v-model="equipmentForm.height"
            :precision="2"
            :min="0"
            :step="0.01"
            placeholder="请输入高度"
            style="width: 50%"
          />
        </el-form-item>
        <el-form-item v-if="canShowPush" label="是否推送">
          <el-switch
            v-model="equipmentForm.push"
            :active-value="1"
            :inactive-value="0"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="equipmentDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleEquipmentSubmit">确定</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 新建起重机模型库弹窗 -->
    <el-dialog
      v-model="craneModelDialogVisible"
      title="新建起重机模型库"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form :model="craneModelForm" label-width="100px">
        <el-form-item label="模型名称">
          <el-input v-model="craneModelForm.modelName" placeholder="请输入模型名称" />
        </el-form-item>
        <el-form-item label="导入模型">
          <el-upload
            class="upload-demo"
            :auto-upload="false"
            :show-file-list="true"
            :limit="1"
            accept=".fbx,.FBX"
            :on-change="handleCraneModelFileChange"
            :before-upload="() => false"
          >
            <el-button type="primary">选择.FBX文件</el-button>
            <template #tip>
              <div style="margin-top: 8px; color: #909399; font-size: 12px;">
                仅支持上传单个.FBX格式模型文件
              </div>
            </template>
          </el-upload>
        </el-form-item>
        <el-form-item v-if="canShowPush" label="是否推送">
          <el-switch
            v-model="craneModelForm.push"
            :active-value="1"
            :inactive-value="0"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="craneModelDialogVisible = false">取消</el-button>
          <el-button type="primary" :loading="craneModelSubmitting" @click="handleCraneModelSubmit">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";
import { useRouter } from "vue-router";
import { Plus } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { getLiftingInfoPage, addUpdateLiftingInfo, getSubType, deleteTemplateItem, getCraneInfoPage, deleteCraneItem,editCraneInfo,getDeviceInfoPage,editDeviceInfo, deleteDeviceItem, cranePush, liftingPush, devicePush, getCraneModelPage, addModelInfo, deleteModelItem, uploadImage, modelPush } from "@/api/index.js";
import userStore from "@/store/user.js";

const router = useRouter();

import { translateLiftingType, translateCraneType, getCraneTypeOptions } from "@/utils/common.js";

// 判断用户是否有权限显示推送功能（level为1时显示）
const canShowPush = computed(() => {
  return userStore.userState.userInfo?.level === 1;
});

// 当前激活的标签页
const activeTab = ref("crane");

// 起重机数据
const craneSearch = ref("");
const cranePage = ref(1);
const cranePageSize = ref(10);
const craneTotal = ref(0);
const craneData = ref([]);
const craneLoading = ref(false);

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
const equipmentPageSize = ref(10);
const equipmentTotal = ref(0);
const equipmentData = ref([]);
const equipmentLoading = ref(false);

// 起重机模型库数据
const craneModelSearch = ref("");
const craneModelPage = ref(1);
const craneModelPageSize = ref(10);
const craneModelTotal = ref(0);
const craneModelData = ref([]);
const craneModelLoading = ref(false);

// 设备弹窗
const equipmentDialogVisible = ref(false);
const equipmentDialogTitle = ref("");
const equipmentForm = ref({
  id: "",
  deviceName: "",
  deviceType: "",
  prodBusiness: "",
  weight: "",
  length: "",
  width: "",
  height: "",
  push: 0, // 是否推送，0否1是
});

// 新建吊索具弹窗
const riggingDialogVisible = ref(false);
const riggingForm = ref({
  liftingType: "",
  subType: "",
  liftingName: "",
  prodBusiness: "",
  push: 0, // 是否推送，0否1是
});

// 新建起重机弹窗
const craneDialogVisible = ref(false);
const craneForm = ref({
  machineName: "",
  type: "",
  model: "",
  prodBusiness: "",
  push: 0, // 是否推送，0否1是
});

// 新建起重机模型库弹窗
const craneModelDialogVisible = ref(false);
const craneModelForm = ref({
  modelName: "",
  fileId: "",
  push: 0,
});
const craneModelFile = ref(null);
const craneModelSubmitting = ref(false);

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
    machineName: "",
    type: "",
    model: "",
    prodBusiness: "",
    push: 0, // 是否推送，0否1是
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
    push: 0, // 是否推送，0否1是
  };
  subTypeOptions.value = [];
};

// 新建设备
const handleAddEquipment = () => {
  equipmentDialogTitle.value = "新建设备";
  equipmentDialogVisible.value = true;
  equipmentForm.value = {
    id: "",
   deviceName: "",
  deviceType: "",
  prodBusiness: "",
    weight: "",
    length: "",
    width: "",
    height: "",
    push: 0, // 是否推送，0否1是
  };
};

// 新建起重机模型库
const handleAddCraneModel = () => {
  craneModelDialogVisible.value = true;
  craneModelForm.value = {
    modelName: "",
    fileId: "",
  };
  craneModelFile.value = null;
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
  } else if (type === "crane") {
    // 起重机编辑，跳转到起重机详情页面
    // 使用原始类型值（数字）
    const typeValue = row.originalType !== undefined && row.originalType !== null ? row.originalType : row.type;
    router.push({
      path: "/crane-detail",
      query: {
        id: row.id,
        craneName: row.machineName,
        craneType: typeValue,
        model: row.model,
        manufacturer: row.prodBusiness,
        push: row.push !== undefined && row.push !== null ? row.push : 0
      }
    });
  } else if (type === "equipment") {
    // 设备编辑，显示弹窗
    equipmentDialogTitle.value = "编辑设备";
    equipmentDialogVisible.value = true;
    equipmentForm.value = {
      id: row.id || "",
      deviceName: row.deviceName || "",
      deviceType: row.deviceType || "",
      prodBusiness: row.prodBusiness || "",
      weight: row.weight || "",
      length: row.length || "",
      width: row.width || "",
      height: row.height || "",
      push: row.push !== undefined && row.push !== null ? row.push : 0
    };
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
      try {
        if (type === 'rigging') {
          await deleteTemplateItem(row.id);
          // 删除成功后刷新吊索具数据
          await fetchRiggingData();
        } else if (type === 'crane') {
          await deleteCraneItem(row.id);
          // 删除成功后刷新起重机数据
          await fetchCraneData();
        } else if (type === 'equipment') {
          // 设备删除逻辑
          await deleteDeviceItem(row.id);
          // 删除成功后刷新设备数据
          await fetchEquipmentData();
        }
        ElMessage.success("删除成功");
      } catch (error) {
        console.error("删除失败:", error);
        ElMessage.error("删除失败，请重试");
      }
    })
    .catch(() => {
      ElMessage.info("已取消删除");
    });
};

// 删除起重机模型库数据
const handleDeleteCraneModel = (row) => {
  ElMessageBox.confirm(
    "确定要删除该起重机模型数据吗？",
    "提示",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    }
  )
    .then(async () => {
      try {
        await deleteModelItem(row.id);
        await fetchCraneModelData();
        ElMessage.success("删除成功");
      } catch (error) {
        console.error("删除起重机模型数据失败:", error);
        ElMessage.error("删除失败，请重试");
      }
    })
    .catch(() => {
      ElMessage.info("已取消删除");
    });
};

// 起重机弹窗下一步
const handleCraneNext = async () => {
  if (!craneForm.value.machineName) {
    ElMessage.warning("请输入起重机名称");
    return;
  }
  if (!craneForm.value.type) {
    ElMessage.warning("请选择起重机类型");
    return;
  }
  if (!craneForm.value.model) {
    ElMessage.warning("请输入型号");
    return;
  }
  if (!craneForm.value.prodBusiness) {
    ElMessage.warning("请输入生产厂家");
    return;
  }

  try {
    // 准备请求参数
    const requestParams = {
      machineName: craneForm.value.machineName,
      type: craneForm.value.type,
      model: craneForm.value.model,
      prodBusiness: craneForm.value.prodBusiness,
      push: craneForm.value.push || 0, // 是否推送，0否1是
    };

    const response = await editCraneInfo(requestParams);

    if (response && response.code === '0') {
      ElMessage.success("创建成功");
      craneDialogVisible.value = false;
      
      // 创建成功后跳转到起重机详情页面，传递返回的ID
      router.push({
        path: "/crane-detail",
        query: {
          id: response.data.id,
          craneName: craneForm.value.machineName,
          craneType: craneForm.value.type,
          model: craneForm.value.model,
          manufacturer: craneForm.value.prodBusiness,
        },
      });
    } else {
      ElMessage.error(response?.message || "创建失败");
    }
  } catch (error) {
    console.error("创建起重机失败:", error);
    ElMessage.error("创建失败，请检查网络连接");
  }
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
  // 添加子类型必填校验
  if (!riggingForm.value.subType) {
    ElMessage.warning("请选择子类型");
    return;
  }
  if (!riggingForm.value.prodBusiness) {
    ElMessage.warning("请输入生产厂家");
    return;
  }

  try {
    // 准备请求参数
    const requestParams = {
      ...riggingForm.value,
      push: riggingForm.value.push || 0, // 是否推送，0否1是
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

const fetchCraneData = async () => {
  // 检查登录状态，如果未登录或登录失败，不加载数据
  if (!userStore.userState.isLoggedIn) {
    console.log('用户未登录，不加载起重机数据');
    craneData.value = [];
    craneTotal.value = 0;
    craneLoading.value = false;
    return;
  }
  
  craneLoading.value = true;
  try {
    const params = {
      pageNum: cranePage.value,
      pageSize: cranePageSize.value,
    };
    
    // 如果有搜索关键词，添加搜索参数
    if (craneSearch.value && craneSearch.value.trim()) {
      params.machineName = craneSearch.value.trim();
    }
    
    const response = await getCraneInfoPage(params);

    if (response && response.code === "0") {
      // 对返回的数据进行类型翻译处理
      const records = response.data.records || [];
      craneData.value = records.map((item) => ({
        ...item,
        typeDisplay: translateCraneType(item.type), // 用于显示的翻译后的类型
        originalType: item.type, // 保存原始类型值（数字）
        type: translateCraneType(item.type), // 保持兼容性
        push: item.push !== undefined && item.push !== null ? item.push : 0, // 确保 push 字段存在
      }));
      craneTotal.value = response.data.total || 0;
    } else {
      // 如果登录失败，清空数据
      craneData.value = [];
      craneTotal.value = 0;
      ElMessage.error(response?.message || "获取起重机数据失败");
    }
  } catch (error) {
    console.error("获取起重机数据失败:", error);
    // 清空数据
    craneData.value = [];
    craneTotal.value = 0;
    ElMessage.error("获取数据失败，请检查网络连接");
  } finally {
    craneLoading.value = false;
  }
};

const handleCranePageChange = (page) => {
  cranePage.value = page;
  fetchCraneData();
};

// 起重机每页条数变化
const handleCranePageSizeChange = (size) => {
  cranePageSize.value = size;
  cranePage.value = 1;
  fetchCraneData();
};

// 起重机搜索
const handleCraneSearch = () => {
  cranePage.value = 1; // 重置到第一页
  fetchCraneData();
};

// 处理推送状态变化（起重机）
const handlePushChange = async (row) => {
  try {
    const requestParams = {
      id: row.id,
      push: row.push || 0,
    };
    
    const response = await cranePush(requestParams);
    
    if (response && response.code === '0') {
      ElMessage.success("更新成功");
    } else {
      // 如果更新失败，恢复原值
      row.push = row.push === 1 ? 0 : 1;
      ElMessage.error(response?.message || "更新失败");
    }
  } catch (error) {
    console.error("更新推送状态失败:", error);
    // 如果更新失败，恢复原值
    row.push = row.push === 1 ? 0 : 1;
    ElMessage.error("更新失败，请检查网络连接");
  }
};

// 处理推送状态变化（吊索具）
const handleRiggingPushChange = async (row) => {
  try {
    const requestParams = {
      id: row.id,
      push: row.push || 0,
    };
    
    const response = await liftingPush(requestParams);
    
    if (response && response.code === '0') {
      ElMessage.success("更新成功");
    } else {
      // 如果更新失败，恢复原值
      row.push = row.push === 1 ? 0 : 1;
      ElMessage.error(response?.message || "更新失败");
    }
  } catch (error) {
    console.error("更新推送状态失败:", error);
    // 如果更新失败，恢复原值
    row.push = row.push === 1 ? 0 : 1;
    ElMessage.error("更新失败，请检查网络连接");
  }
};

// 处理推送状态变化（设备）
const handleDevicePushChange = async (row) => {
  try {
    const requestParams = {
      id: row.id,
      push: row.push || 0,
    };
    
    const response = await devicePush(requestParams);
    
    if (response && response.code === '0') {
      ElMessage.success("更新成功");
    } else {
      // 如果更新失败，恢复原值
      row.push = row.push === 1 ? 0 : 1;
      ElMessage.error(response?.message || "更新失败");
    }
  } catch (error) {
    console.error("更新推送状态失败:", error);
    // 如果更新失败，恢复原值
    row.push = row.push === 1 ? 0 : 1;
    ElMessage.error("更新失败，请检查网络连接");
  }
};

const fetchRiggingData = async () => {
  // 检查登录状态，如果未登录或登录失败，不加载数据
  if (!userStore.userState.isLoggedIn) {
    console.log('用户未登录，不加载吊索具数据');
    riggingData.value = [];
    riggingTotal.value = 0;
    riggingLoading.value = false;
    return;
  }
  
  riggingLoading.value = true;
  try {
    const params = {
      pageNum: riggingPage.value,
      pageSize: riggingPageSize.value,
    };
    
    // 如果有搜索关键词，添加搜索参数
    if (riggingSearch.value && riggingSearch.value.trim()) {
      params.liftingName = riggingSearch.value.trim();
    }
    
    const response = await getLiftingInfoPage(params);

    if (response && response.code === "0") {
      // 对返回的数据进行类型翻译处理
      const records = response.data.records || [];
      riggingData.value = records.map((item) => ({
        ...item,
        liftingType: translateLiftingType(item.liftingType),
        push: item.push !== undefined && item.push !== null ? item.push : 0, // 确保 push 字段存在
      }));
      riggingTotal.value = response.data.total || 0;
    } else {
      // 如果登录失败，清空数据
      riggingData.value = [];
      riggingTotal.value = 0;
      ElMessage.error(response?.message || "获取数据失败");
    }
  } catch (error) {
    console.error("获取吊索具数据失败:", error);
    // 清空数据
    riggingData.value = [];
    riggingTotal.value = 0;
    ElMessage.error("获取数据失败，请检查网络连接");
  } finally {
    riggingLoading.value = false;
  }
};

const handleRiggingPageChange = (page) => {
  riggingPage.value = page;
  fetchRiggingData();
};

// 吊索具搜索
const handleRiggingSearch = () => {
  riggingPage.value = 1; // 重置到第一页
  fetchRiggingData();
};

// 吊索具每页条数变化
const handleRiggingPageSizeChange = (size) => {
  riggingPageSize.value = size;
  riggingPage.value = 1;
  fetchRiggingData();
};

watch(activeTab, (newTab) => {
  if (newTab === "rigging" && riggingData.value.length === 0) {
    fetchRiggingData();
  } else if (newTab === "crane" && craneData.value.length === 0) {
    fetchCraneData();
  } else if (newTab === "craneModel" && craneModelData.value.length === 0) {
    fetchCraneModelData();
  }
});

// 处理设备弹窗确定按钮
const handleEquipmentSubmit = async () => {
  // 表单验证
  if (!equipmentForm.value.deviceName) {
    ElMessage.warning("请输入设备名称");
    return;
  }
  if (!equipmentForm.value.deviceType) {
    ElMessage.warning("请输入型号");
    return;
  }
  if (!equipmentForm.value.prodBusiness) {
    ElMessage.warning("请输入生产厂家");
    return;
  }

  try {
    // 准备请求参数
    const requestParams = {
      ...equipmentForm.value,
      push: equipmentForm.value.push || 0, // 是否推送，0否1是
    };

    const response = await editDeviceInfo(requestParams);
    
    if (response && response.code === '0') {
      ElMessage.success(equipmentForm.value.id ? "编辑成功" : "创建成功");
      equipmentDialogVisible.value = false;
      // 刷新设备数据
      fetchEquipmentData();
    } else {
      ElMessage.error(response?.message || "操作失败");
    }
  } catch (error) {
    console.error("操作失败:", error);
    ElMessage.error("操作失败，请检查网络连接");
  }
};

// 处理起重机模型库文件选择
const handleCraneModelFileChange = (file) => {
  // Element Plus on-change 回调的第一个参数是当前文件
  craneModelFile.value = file.raw || file;
};

// 获取起重机模型库数据
const fetchCraneModelData = async () => {
  // 检查登录状态，如果未登录或登录失败，不加载数据
  if (!userStore.userState.isLoggedIn) {
    console.log("用户未登录，不加载起重机模型库数据");
    craneModelData.value = [];
    craneModelTotal.value = 0;
    craneModelLoading.value = false;
    return;
  }

  craneModelLoading.value = true;
  try {
    const params = {
      pageNum: craneModelPage.value,
      pageSize: craneModelPageSize.value,
    };

    // 如果有搜索关键词，添加搜索参数
    if (craneModelSearch.value && craneModelSearch.value.trim()) {
      params.modelName = craneModelSearch.value.trim();
    }

    const response = await getCraneModelPage(params);

    if (response && response.code === "0") {
      const records = response.data.records || [];
      craneModelData.value = records.map((item) => ({
        ...item,
        push: item.push !== undefined && item.push !== null ? item.push : 0,
      }));
      craneModelTotal.value = response.data.total || 0;
    } else {
      craneModelData.value = [];
      craneModelTotal.value = 0;
      ElMessage.error(response?.message || "获取起重机模型库数据失败");
    }
  } catch (error) {
    console.error("获取起重机模型库数据失败:", error);
    craneModelData.value = [];
    craneModelTotal.value = 0;
    ElMessage.error("获取数据失败，请检查网络连接");
  } finally {
    craneModelLoading.value = false;
  }
};

// 起重机模型库分页变化
const handleCraneModelPageChange = (page) => {
  craneModelPage.value = page;
  fetchCraneModelData();
};

// 起重机模型库搜索
const handleCraneModelSearch = () => {
  craneModelPage.value = 1;
  fetchCraneModelData();
};

// 起重机模型库每页条数变化
const handleCraneModelPageSizeChange = (size) => {
  craneModelPageSize.value = size;
  craneModelPage.value = 1;
  fetchCraneModelData();
};

// 新建起重机模型库提交
const handleCraneModelSubmit = async () => {
  if (!craneModelForm.value.modelName) {
    ElMessage.warning("请输入模型名称");
    return;
  }
  if (!craneModelFile.value) {
    ElMessage.warning("请先选择要上传的.FBX模型文件");
    return;
  }

  try {
    craneModelSubmitting.value = true;
    // 先上传模型文件，获取 fileId
    const uploadRes = await uploadImage(
      craneModelFile.value,
      craneModelFile.value.name || "model.fbx"
    );
    if (
      !uploadRes ||
      uploadRes.code !== "0" ||
      !uploadRes.data ||
      !uploadRes.data.fileId
    ) {
      ElMessage.error(uploadRes?.message || "模型文件上传失败");
      return;
    }

    const fileId = uploadRes.data.fileId;

    const params = {
      modelName: craneModelForm.value.modelName,
      fileId,
      push: craneModelForm.value.push || 0,
    };

    const res = await addModelInfo(params);
    if (res && res.code === "0") {
      ElMessage.success("新增成功");
      craneModelDialogVisible.value = false;
      craneModelForm.value = {
        modelName: "",
        fileId: "",
        push: 0,
      };
      craneModelFile.value = null;
      // 刷新列表
      fetchCraneModelData();
    } else {
      ElMessage.error(res?.message || "新增失败");
    }
  } catch (error) {
    console.error("新增起重机模型库失败:", error);
    ElMessage.error("新增失败，请检查网络连接");
  } finally {
    craneModelSubmitting.value = false;
  }
};

// 处理起重机模型库推送状态变化
const handleCraneModelPushChange = async (row) => {
  try {
    const requestParams = {
      id: row.id,
      push: row.push || 0,
    };

    const response = await modelPush(requestParams);

    if (response && response.code === "0") {
      ElMessage.success("更新成功");
    } else {
      // 如果更新失败，恢复原值
      row.push = row.push === 1 ? 0 : 1;
      ElMessage.error(response?.message || "更新失败");
    }
  } catch (error) {
    console.error("更新起重机模型库推送状态失败:", error);
    // 如果更新失败，恢复原值
    row.push = row.push === 1 ? 0 : 1;
    ElMessage.error("更新失败，请检查网络连接");
  }
};

// 获取设备数据
const fetchEquipmentData = async () => {
  // 检查登录状态，如果未登录或登录失败，不加载数据
  if (!userStore.userState.isLoggedIn) {
    console.log('用户未登录，不加载设备数据');
    equipmentData.value = [];
    equipmentTotal.value = 0;
    equipmentLoading.value = false;
    return;
  }
  
  equipmentLoading.value = true;
  try {
    const params = {
      pageNum: equipmentPage.value,
      pageSize: equipmentPageSize.value,
    };
    
    // 如果有搜索关键词，添加搜索参数
    if (equipmentSearch.value && equipmentSearch.value.trim()) {
      params.deviceName = equipmentSearch.value.trim();
    }
    
    const response = await getDeviceInfoPage(params);

    if (response && response.code === "0") {
      const records = response.data.records || [];
      equipmentData.value = records.map((item) => ({
        ...item,
        push: item.push !== undefined && item.push !== null ? item.push : 0, // 确保 push 字段存在
      }));
      equipmentTotal.value = response.data.total || 0;
    } else {
      // 如果登录失败，清空数据
      equipmentData.value = [];
      equipmentTotal.value = 0;
      ElMessage.error(response?.message || "获取设备数据失败");
    }
  } catch (error) {
    console.error("获取设备数据失败:", error);
    // 清空数据
    equipmentData.value = [];
    equipmentTotal.value = 0;
    ElMessage.error("获取数据失败，请检查网络连接");
  } finally {
    equipmentLoading.value = false;
  }
};

// 设备分页变化
const handleEquipmentPageChange = (page) => {
  equipmentPage.value = page;
  fetchEquipmentData();
};

// 设备搜索
const handleEquipmentSearch = () => {
  equipmentPage.value = 1; // 重置到第一页
  fetchEquipmentData();
};

// 设备每页条数变化
const handleEquipmentPageSizeChange = (size) => {
  equipmentPageSize.value = size;
  equipmentPage.value = 1;
  fetchEquipmentData();
};

watch(activeTab, (newTab) => {
  if (newTab === "rigging" && riggingData.value.length === 0) {
    fetchRiggingData();
  } else if (newTab === "crane" && craneData.value.length === 0) {
    fetchCraneData();
  } else if (newTab === "equipment" && equipmentData.value.length === 0) {
    fetchEquipmentData();
  } else if (newTab === "craneModel" && craneModelData.value.length === 0) {
    fetchCraneModelData();
  }
});

// 监听登录状态变化，如果未登录则清空数据
watch(() => userStore.userState.isLoggedIn, (isLoggedIn) => {
  if (!isLoggedIn) {
    console.log('登录状态变化：用户已退出，清空数据管理数据');
    craneData.value = [];
    craneTotal.value = 0;
    riggingData.value = [];
    riggingTotal.value = 0;
    equipmentData.value = [];
    equipmentTotal.value = 0;
  }
});

onMounted(() => {
  if (activeTab.value === "rigging") {
    fetchRiggingData();
  } else if (activeTab.value === "crane") {
    fetchCraneData();
  } else if (activeTab.value === "equipment") {
    fetchEquipmentData();
  } else if (activeTab.value === "craneModel") {
    fetchCraneModelData();
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

.search-group {
  display: flex;
  align-items: center;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
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

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
