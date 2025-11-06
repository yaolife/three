<template>
  <div class="site-plan-container">
    <!-- 页面顶部标题 -->
    <div class="page-header">
      <div class="header-content">
        <el-button type="text" class="back-btn" @click="handleBack">
          <el-icon><ArrowLeft /></el-icon>
        </el-button>
        <div class="project_title">总平规划xxx项目</div>
      </div>
      <div class="header-content_right">
        <div>
          <img
            src="@/images/add_text.png"
            alt="添加文字"
            style="width: 20px; height: 20px"
          />
        </div>
        <div class="handle_btn">
          <div class="handle_btn_item">
            <img
              src="@/images/report.png"
              alt="生成报告"
              style="width: 20px; height: 20px; margin-right: 5px"
            /><span>生成报告</span>
          </div>
          <div class="handle_btn_item">
            <img
              src="@/images/preview.png"
              alt="预览"
              style="width: 20px; height: 20px; margin-right: 5px"
            /><span>预览</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="main-layout">
      <!-- 左侧导航菜单 -->
      <div class="left-sidebar">
        <div class="sidebar-header">
          <div class="project_name">起重机列表</div>
          <span class="add-btn" @click="addCrane">添加</span>
        </div>
        <div class="search-box">
          <el-input
            v-model="searchQuery"
            placeholder="搜索列表"
            prefix-icon="Search"
            size="small"
          />
          <div class="search-btn">搜索</div>
        </div>

        <!-- 起重机列表 -->
        <div class="crane-list">
          <div
            v-for="crane in filteredCranes"
            :key="crane.id"
            :class="[
              'crane-item',
              { selected: selectedCrane && selectedCrane.id === crane.id },
            ]"
            @click="selectCrane(crane)"
          >
            <span class="crane-name">{{ crane.name }}</span>
            <el-icon class="delete-icon" @click.stop="deleteCrane(crane.id)">
              <img
                src="@/images/c_delete.png"
                alt="总平规划图"
                style="width: 15px; height: 15px"
              />
            </el-icon>
          </div>
        </div>
      </div>

      <!-- 右侧内容区 -->
      <div class="right-content">
        <!-- 使用Element Plus的Dialog组件，设置为水平垂直居中 -->
        <el-dialog
          v-model="dialogVisible"
          title="添加施工场景"
          width="360px"
          top="20%"
          :close-on-click-modal="false"
          :close-on-press-escape="false"
          class="site-plan-dialog"
        >
          <div class="empty-state">
            <div class="empty-text">暂无施工场景，请导入相关平面图！</div>
            <el-button type="primary" @click="handleImportPlan"
              >点击添加</el-button
            >
          </div>
          <template #footer>
            <span class="dialog-footer">
              <!-- 可以在这里添加其他操作按钮 -->
            </span>
          </template>
        </el-dialog>

        <!-- 添加起点弹窗 - 修改样式使其紧靠着属性编辑框左侧 -->
        <el-dialog
          v-model="addPointDialogVisible"
          title="添加点位"
          width="400px"
          :top="calculateDialogTop()"
          :close-on-click-modal="false"
          :close-on-press-escape="false"
          custom-class="add-point-dialog adjacent-dialog"
        >
          <div class="point-form">
            <div class="property-item">
              <label>点位名称</label>
              <el-input v-model="newPoint.name" placeholder="点位名称" />
            </div>
            <div class="property-item">
              <label>X轴</label>
              <el-input v-model="newPoint.x" placeholder="X坐标" />
            </div>
            <div class="property-item">
              <label>Y轴</label>
              <el-input v-model="newPoint.y" placeholder="Y坐标" />
            </div>
            <div class="property-item">
              <label>占点类型</label>
              <div class="radio-group">
                <el-radio v-model="newPoint.type" label="lifting" @change="onPointTypeChange">吊装点位</el-radio>
                <el-radio v-model="newPoint.type" label="moving" @change="onPointTypeChange">移动点位</el-radio>
              </div>
            </div>
            
            <!-- 吊装点位特有字段 -->
            <template v-if="newPoint.type === 'lifting'">
              <div class="property-item">
                <label>地面承载力</label>
                <el-input-number
                  controls-position="right"
                  v-model="newPoint.groundLoad"
                  :min="0"
                  :step="1"
                  placeholder="10"
                />
                <span class="unit">t</span>
              </div>
              <div class="property-item">
                <label>区域场地</label>
                <el-input v-model="newPoint.area" placeholder="区域场地" />
              </div>
              <div class="property-item">
                <label>开始时间</label>
                <el-input v-model="newPoint.startTime" placeholder="开始时间" />
              </div>
              <div class="property-item">
                <label>结束时间</label>
                <el-input v-model="newPoint.endTime" placeholder="结束时间" />
              </div>
              <div class="property-item">
                <label>完成状态</label>
                <el-select v-model="newPoint.status" placeholder="完成状态">
                  <el-option label="已完成" value="completed" />
                  <el-option label="未完成" value="pending" />
                </el-select>
              </div>
              
              <!-- 占位设置 -->
              <div class="section-title">占位设置</div>
              <div class="property-item">
                <label>占位长度</label>
                <el-input-number
                  controls-position="right"
                  v-model="newPoint.occupyLength"
                  :min="0"
                  :step="0.1"
                  placeholder="16"
                />
              </div>
              <div class="property-item">
                <label>占位宽度</label>
                <el-input-number
                  controls-position="right"
                  v-model="newPoint.occupyWidth"
                  :min="0"
                  :step="0.1"
                  placeholder="0.5"
                />
              </div>
              <div class="property-item">
                <label>旋转角度</label>
                <el-input-number
                  controls-position="right"
                  v-model="newPoint.rotateAngle"
                  :step="1"
                  placeholder="-30"
                />
              </div>
            </template>
            
            <!-- 移动点位特有字段 -->
            <template v-if="newPoint.type === 'moving'">
              <div class="section-title">作业范围</div>
              <div class="property-item">
                <label>作业半径</label>
                <el-input-number
                  controls-position="right"
                  v-model="newPoint.radius"
                  :min="0"
                  :step="1"
                  placeholder="10"
                />
              </div>
              <div class="property-item">
                <label>幅度</label>
                <el-input-number
                  controls-position="right"
                  v-model="newPoint.amplitude"
                  :min="0"
                  :step="1"
                  placeholder="10"
                />
              </div>
              <div class="property-item">
                <label>仰角</label>
                <el-input-number
                  controls-position="right"
                  v-model="newPoint.angle"
                  :step="1"
                  placeholder="60"
                />
              </div>
            </template>
          </div>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="addPointDialogVisible = false">重新标点</el-button>
              <el-button type="primary" @click="confirmAddPoint">确认添加</el-button>
            </span>
          </template>
        </el-dialog>
        
        <!-- 修改点位弹窗 - 修改样式使其紧靠着属性编辑框左侧 -->
        <el-dialog
          v-model="editPointDialogVisible"
          title="修改点位"
          width="400px"
          :top="calculateDialogTop()"
          :close-on-click-modal="false"
          :close-on-press-escape="false"
          custom-class="edit-point-dialog adjacent-dialog"
        >
          <div class="point-form">
            <div class="property-item">
              <label>点位名称</label>
              <el-input v-model="editingPoint.name" placeholder="点位名称" />
            </div>
            <div class="property-item">
              <label>X轴</label>
              <el-input v-model="editingPoint.x" placeholder="X坐标" />
            </div>
            <div class="property-item">
              <label>Y轴</label>
              <el-input v-model="editingPoint.y" placeholder="Y坐标" />
            </div>
            
            <!-- 吊装点位特有字段 -->
            <template v-if="editingPoint.type === 'lifting'">
              <div class="property-item">
                <label>地面承载力</label>
                <el-input-number
                  controls-position="right"
                  v-model="editingPoint.groundLoad"
                  :min="0"
                  :step="1"
                  placeholder="10"
                />
                <span class="unit">t</span>
              </div>
              <div class="property-item">
                <label>区域场地</label>
                <el-input v-model="editingPoint.area" placeholder="区域场地" />
              </div>
              <div class="property-item">
                <label>开始时间</label>
                <el-input v-model="editingPoint.startTime" placeholder="开始时间" />
              </div>
              <div class="property-item">
                <label>结束时间</label>
                <el-input v-model="editingPoint.endTime" placeholder="结束时间" />
              </div>
              <div class="property-item">
                <label>完成状态</label>
                <el-select v-model="editingPoint.status" placeholder="完成状态">
                  <el-option label="已完成" value="completed" />
                  <el-option label="未完成" value="pending" />
                </el-select>
              </div>
            </template>
            
            <!-- 移动点位特有字段 -->
            <template v-if="editingPoint.type === 'moving'">
              <div class="section-title">作业范围</div>
              <div class="property-item">
                <label>作业半径</label>
                <el-input-number
                  controls-position="right"
                  v-model="editingPoint.radius"
                  :min="0"
                  :step="1"
                  placeholder="10"
                />
              </div>
              <div class="property-item">
                <label>幅度</label>
                <el-input-number
                  controls-position="right"
                  v-model="editingPoint.amplitude"
                  :min="0"
                  :step="1"
                  placeholder="10"
                />
              </div>
              <div class="property-item">
                <label>仰角</label>
                <el-input-number
                  controls-position="right"
                  v-model="editingPoint.angle"
                  :step="1"
                  placeholder="60"
                />
              </div>
            </template>
          </div>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="editPointDialogVisible = false">取消</el-button>
              <el-button type="primary" @click="confirmEditPoint">确认修改</el-button>
            </span>
          </template>
        </el-dialog>

        <!-- 右侧内容区域 - 显示导入的图片 -->
        <div v-if="importedImage" class="image-container">
          <!-- <img :src="importedImage" alt="总平规划图" class="plan-image"> -->
          <img
            src="@/images/planning.png"
            alt="总平规划图"
            class="plan-image"
          />
        </div>
        <div v-else-if="!dialogVisible" class="empty-content">
          <div class="empty-text">请添加施工场景图</div>
          <el-button type="primary" @click="dialogVisible = true"
            >添加</el-button
          >
        </div>

        <!-- 任务属性编辑悬浮框 -->
        <div v-if="selectedCrane" class="property-panel">
          <div class="panel-header">
            <div class="panel-title">任务属性编辑</div>
          </div>
          <div class="panel-content">
            <div class="property-item">
              <label>名称</label>
              <el-input v-model="selectedCrane.name" placeholder="请输入名称" />
            </div>
            <div class="property-item">
              <label>起重机</label>
              <el-input
                v-model="selectedCrane.type"
                placeholder="xxx履带式起重机"
              />
            </div>
            <div class="property-item">
              <label>路径颜色</label>
              <div class="color-input-wrapper">
                <el-input v-model="selectedCrane.color" placeholder="#26256B" />
                <div
                  class="color-preview"
                  :style="{ backgroundColor: selectedCrane.color }"
                ></div>
              </div>
            </div>
            <div class="property-item">
              <label>路径使用宽度</label>
              <el-input-number
                controls-position="right"
                precision="2"
                v-model="selectedCrane.width"
                :min="0"
                :step="1"
                placeholder="10"
              />
              <span class="unit">m</span>
            </div>
            <div class="property-item">
              <label>使用时间</label>
              <el-input-number
                controls-position="right"
                v-model="selectedCrane.time"
                :min="0"
                :step="1"
                placeholder="10"
              />
              <span class="unit">d</span>
            </div>
            <div class="property-item">
              <label>地面承载力</label>
              <el-input-number
                controls-position="right"
                precision="2"
                v-model="selectedCrane.load"
                :min="0"
                :step="1"
                placeholder="10"
              />
              <span class="unit">t</span>
            </div>
          </div>
          <div class="point_setting">
            <div>点位设置</div>
            <!-- 如果没有起点，显示设置起点按钮 -->
            <div v-if="!hasStartPoint" class="setting_start">
              <img
                src="@/images/point.png"
                alt="设置起点"
                style="width: 16px; height: 16px"
              />
              <span @click="setCranePosition">设置起点+</span>
            </div>
            <!-- 显示点位列表 -->
            <div v-for="(point, index) in selectedCrane.points" :key="point.id" class="point-item">
              <div class="point-info">
                <!-- 根据点位类型显示不同图标 -->
                <img 
                  v-if="point.type === 'lifting'" 
                  src="@/images/point.png" 
                  alt="吊装点位" 
                  style="width: 16px; height: 16px; margin-right: 8px"
                />
                <img 
                  v-else 
                  src="@/images/point.png" 
                  alt="移动点位" 
                  style="width: 16px; height: 16px; margin-right: 8px"
                />
                <span>{{ point.name }}</span>
              </div>
              <div class="point-actions">
                <span class="action-btn edit" @click="editPoint(point)">修改</span>
                <!-- 只有非起点才可以删除 -->
                <span v-if="index > 0" class="action-btn delete" @click="deletePoint(index)">删除</span>
              </div>
            </div>
          </div>
          <div class="add_path_point">
             <img
                src="@/images/add_point.png"
                alt="设置路径点位<"
                style="width: 22px; height: 22px"
              />
            <span  @click="addNewPosition"
              >添加路径点位</span>
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { ArrowLeft, Search, Close } from "@element-plus/icons-vue";

const route = useRoute();
const router = useRouter();

// 从路由参数获取项目ID
const projectId = ref("");
// 控制Dialog显示
const dialogVisible = ref(true);
// 存储导入的图片URL
const importedImage = ref(null);
// 用于文件上传的input元素引用
const fileInput = ref(null);

// 起重机相关数据
const cranes = ref([]);
const selectedCrane = ref(null);
const searchQuery = ref("");
const craneCounter = ref(0); // 用于生成起重机名称

// 点位相关数据
const addPointDialogVisible = ref(false);
const editPointDialogVisible = ref(false);
const newPoint = ref({
  name: "点位1",
  x: 112.00000000,
  y: 38.00000000,
  type: "lifting", // lifting: 吊装点位, moving: 移动点位
  groundLoad: 10,
  area: "",
  startTime: "",
  endTime: "",
  status: "completed",
  occupyLength: 16,
  occupyWidth: 0.5,
  rotateAngle: -30,
  radius: 10,
  amplitude: 10,
  angle: 60
});
const editingPoint = ref({});
const editingPointIndex = ref(-1);

// 计算属性：是否有起点
const hasStartPoint = computed(() => {
  return selectedCrane.value && selectedCrane.value.points && selectedCrane.value.points.length > 0;
});

onMounted(() => {
  // 从路由参数获取项目ID
  projectId.value = route.params.id || "";
  console.log("总平规划项目ID:", projectId.value);
  // 加载项目数据
  loadProjectData();
  // 自动显示Dialog
  dialogVisible.value = false;
});

// 计算属性：过滤后的起重机列表
const filteredCranes = computed(() => {
  if (!searchQuery.value) return cranes.value;
  return cranes.value.filter((crane) =>
    crane.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// 添加起重机
const addCrane = () => {
  craneCounter.value++;
  const newCrane = {
    id: Date.now(),
    name: `起重机${craneCounter.value}`,
    type: "xxx履带式起重机",
    color: "#26256B",
    width: 10,
    time: 10,
    load: 10,
    points: [], // 添加点位数组
    position: null,
  };
  cranes.value.push(newCrane);
  ElMessage.success("起重机已添加");
};

// 删除起重机
const deleteCrane = (id) => {
  cranes.value = cranes.value.filter((crane) => crane.id !== id);
  if (selectedCrane.value && selectedCrane.value.id === id) {
    selectedCrane.value = null;
  }
  ElMessage.success("起重机已删除");
};

// 选择起重机
const selectCrane = (crane) => {
  // 确保每个起重机都有点位数组
  if (!crane.points) {
    crane.points = [];
  }
  selectedCrane.value = { ...crane };
};

// 设置起重机点位（打开添加起点弹窗）
const setCranePosition = () => {
  // 重置新点位数据
  newPoint.value = {
    name: "点位1",
    x: 112.00000000,
    y: 38.00000000,
    type: "lifting",
    groundLoad: 10,
    area: "",
    startTime: "",
    endTime: "",
    status: "completed",
    occupyLength: 16,
    occupyWidth: 0.5,
    rotateAngle: -30,
    radius: 10,
    amplitude: 10,
    angle: 60
  };
  // 打开添加点位弹窗
  addPointDialogVisible.value = true;
};

// 计算弹窗顶部位置，使其比属性面板顶部少30px
  const calculateDialogTop = () => {
    // 获取属性面板的位置信息
    const propertyPanel = document.querySelector('.property-panel');
    if (propertyPanel) {
      console.log('属性面板位置：', propertyPanel.getBoundingClientRect());
      const rect = propertyPanel.getBoundingClientRect();
      return `${rect.top + 30}px`; // 顶部比属性面板顶部少30px
    }
    return '5%'; // 默认值
  };

  // 添加防范站位
  const addNewPosition = () => {
  if (!selectedCrane.value) return;
  
  // 重置新点位数据
  const pointCount = selectedCrane.value.points ? selectedCrane.value.points.length : 0;
  newPoint.value = {
    name: selectedCrane.value.points && selectedCrane.value.points[0] ? 
           (selectedCrane.value.points[0].type === 'lifting' ? 
            `吊装点位${pointCount}` : `移动点位${pointCount - 1}`) : 
           "点位1",
    x: 112.00000000,
    y: 38.00000000,
    type: pointCount === 0 ? "lifting" : 
          (Math.random() > 0.5 ? "lifting" : "moving"),
    groundLoad: 10,
    area: "",
    startTime: "",
    endTime: "",
    status: "completed",
    occupyLength: 16,
    occupyWidth: 0.5,
    rotateAngle: -30,
    radius: 10,
    amplitude: 10,
    angle: 60
  };
  // 打开添加点位弹窗
  addPointDialogVisible.value = true;
};

// 点位类型变化处理
const onPointTypeChange = () => {
  // 可以在这里添加类型变化时的处理逻辑
  console.log("点位类型变为:", newPoint.value.type);
};

// 确认添加点位
const confirmAddPoint = () => {
  if (!selectedCrane.value) return;
  
  // 确保点位数组存在
  if (!selectedCrane.value.points) {
    selectedCrane.value.points = [];
  }
  
  // 创建新点位对象
  const pointToAdd = {
    id: Date.now(),
    ...newPoint.value
  };
  
  // 如果是第一个点位，设置为起点
  if (selectedCrane.value.points.length === 0) {
    pointToAdd.name = "起点1";
  }
  
  // 添加点位
  selectedCrane.value.points.push(pointToAdd);
  
  // 更新原数据中的对应起重机
  const craneIndex = cranes.value.findIndex(c => c.id === selectedCrane.value.id);
  if (craneIndex !== -1) {
    cranes.value[craneIndex].points = [...selectedCrane.value.points];
  }
  
  // 关闭弹窗
  addPointDialogVisible.value = false;
  ElMessage.success("点位已添加");
};

// 编辑点位
const editPoint = (point) => {
  // 找到要编辑的点位索引
  editingPointIndex.value = selectedCrane.value.points.findIndex(p => p.id === point.id);
  // 深拷贝点位数据用于编辑
  editingPoint.value = JSON.parse(JSON.stringify(point));
  // 打开编辑弹窗
  editPointDialogVisible.value = true;
};

// 确认编辑点位
const confirmEditPoint = () => {
  if (!selectedCrane.value || editingPointIndex.value === -1) return;
  
  // 更新点位数据
  selectedCrane.value.points[editingPointIndex.value] = {
    ...editingPoint.value
  };
  
  // 更新原数据中的对应起重机
  const craneIndex = cranes.value.findIndex(c => c.id === selectedCrane.value.id);
  if (craneIndex !== -1) {
    cranes.value[craneIndex].points = [...selectedCrane.value.points];
  }
  
  // 关闭弹窗
  editPointDialogVisible.value = false;
  editingPointIndex.value = -1;
  ElMessage.success("点位已更新");
};

// 删除点位
const deletePoint = (index) => {
  if (!selectedCrane.value || index === 0) return; // 不能删除起点
  
  // 删除点位
  selectedCrane.value.points.splice(index, 1);
  
  // 更新原数据中的对应起重机
  const craneIndex = cranes.value.findIndex(c => c.id === selectedCrane.value.id);
  if (craneIndex !== -1) {
    cranes.value[craneIndex].points = [...selectedCrane.value.points];
  }
  
  ElMessage.success("点位已删除");
};

// 加载项目数据
const loadProjectData = () => {
  console.log("加载项目数据，项目ID:", projectId.value);
  // 模拟加载一些起重机数据用于演示
  const mockCranes = [
    {
      id: 1,
      name: "起重机1",
      type: "xxx履带式起重机",
      color: "#26256B",
      width: 10,
      time: 10,
      load: 10,
      points: [],
      position: null,
    }
  ];
  cranes.value = mockCranes;
};

// 处理返回按钮点击
const handleBack = () => {
  router.push({ name: "AllProjects" });
};

// 处理关闭弹窗
const handleCloseModal = () => {
  dialogVisible.value = false;
  // 可以在这里添加关闭弹窗后的处理逻辑
  console.log("关闭弹窗");
};

// 处理导入平面图
const handleImportPlan = () => {
  // 创建隐藏的文件输入元素
  if (!fileInput.value) {
    fileInput.value = document.createElement("input");
    fileInput.value.type = "file";
    fileInput.value.accept = "image/*";
    fileInput.value.onchange = (event) => {
      const file = event.target.files[0];
      if (file) {
        // 创建图片预览URL
        const reader = new FileReader();
        reader.onload = (e) => {
          importedImage.value = e.target.result;
          console.log("已导入图片:", importedImage.value);
          // 关闭弹窗
          dialogVisible.value = false;
        };
        reader.readAsDataURL(file);
      }
    };
  }
  // 触发文件选择对话框
  fileInput.value.click();
};
</script>

<style scoped>
.site-plan-container {
  width: 100%;
  height: 100%;
  min-height: 100vh;
  background-color: #f0f2f5;
  padding: 0;
  margin: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding-top: 36px; /* 为固定的头部留出空间 */
}

.page-header {
  color: #303030;
  border-bottom: 1px solid #e4e4e4;
  background: #fff;
  box-shadow: 0 3px 4.2px 0 rgba(0, 0, 0, 0.05);
  height: 36px;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  flex-shrink: 0;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}
.project_title {
  font-size: 14px;
  border-right: 1px solid #9d9d9d;
  padding-right: 80px;
}
.header-content {
  display: flex;
  align-items: center;
}
.header-content_right {
  display: flex;
  padding: 0 20px;
  flex: 1;
  align-items: center;
  justify-content: space-between;
}
.header-content_right .handle_btn {
  display: flex;
  align-items: center;
  justify-content: center;
}
.header-content_right .handle_btn .handle_btn_item {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 30px;
  cursor: pointer;
}

.back-btn {
  color: #000000;
  margin-right: 16px;
  font-size: 20px;
}

.back-btn:hover {
  color: #000000;
  cursor: pointer;
}

.page-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 500;
}

.main-layout {
  display: flex;
  flex: 1;
  margin-left: 200px; /* 为固定的左侧导航留出空间 */
}

.left-sidebar {
  width: 200px;
  background-color: #ffffff;
  border-right: 1px solid #e8e8e8;
  padding: 16px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  position: fixed;
  left: 0;
  top: 36px;
  bottom: 0;
  z-index: 900;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.project_name {
  font-size: 14px;
  color: #303133;
}

.add-btn {
  display: flex;
  align-items: center;
  height: 32px;
  color: #0081f9;
  font-size: 12px;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.search-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  border-radius: 3px;
  background: #0775db;
  width: 48px;
  height: 26px;
  padding: 0 12px;
  font-size: 12px;
  cursor: pointer;
}

.add-btn {
  cursor: pointer;
}

/* 起重机列表样式 */
.crane-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  overflow-y: auto;
}

.crane-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background-color: #f5f7fa;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.crane-item:hover {
  background-color: #e6e8eb;
}

.crane-item.selected {
  background-color: #e6f7ff;
  border: 1px solid #91d5ff;
}

.crane-name {
  font-size: 12px;
  color: #303133;
}

.delete-icon {
  font-size: 12px;
  color: #909399;
  cursor: pointer;
  transition: color 0.3s ease;
}

.delete-icon:hover {
  color: #f56c6c;
}

.right-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 24px;
  background-color: #f0f2f5;
  position: relative;
  overflow: hidden;
}

/* 属性面板样式 */
.property-panel {
  position: fixed;
  right: 20px;
  top: 36px;
  bottom: 0;
  width: 280px;
  background-color: white;
  border-radius: 8px 8px 0 0;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.panel-header {
  background-color: #fafafa;
  padding: 12px 16px;
  border-bottom: 1px solid #ebeef5;
}

.panel-title {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
}

.panel-content {
  padding: 16px;
  overflow-y: auto;
}
.point_setting {
  border-top: 1px solid #c8c8c8;
  padding: 16px;
  max-height: 300px;
  overflow-y: auto;
}
.setting_start{
  margin-top: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  color: #006FFF;
  cursor: pointer;
}
.setting_start:hover {
  color: #005ce6;
}
.add_path_point{
  display: flex;
  justify-content: center;
  align-items: center;
  height: 38px;
  border-top: 1px solid #c8c8c8;
   border-bottom: 1px solid #c8c8c8;
  gap: 8px;
  color: #006FFF;
  cursor: pointer;
}
.add_path_point:hover {
  color: #005ce6;
}
.property-item {
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.property-item label {
  font-size: 12px;
  color: #606266;
  width: 70px;
  flex-shrink: 0;
  text-align: left;
}

.color-input-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.color-preview {
  width: 32px;
  height: 32px;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
}

.unit {
  margin-left: 8px;
  font-size: 12px;
  color: #909399;
}

.el-input-number {
  width: 120px;
}

.property-item .el-input {
  width: 120px;
}

.panel-footer {
  padding: 12px 16px;
  background-color: #fafafa;
  border-top: 1px solid #ebeef5;
  display: flex;
  justify-content: flex-end;
}

.property-item .el-button {
  margin-left: 0;
}

/* 确保Dialog弹窗水平垂直居中 */
.add-point-dialog,
.edit-point-dialog {
  position: absolute;
  right: calc(280px + 10px); /* 右侧面板宽度 + 间距 */
  top: auto; /* 让top属性生效 */
  bottom: auto; /* 让top属性生效 */
  left: auto; /* 让right属性生效 */
}

/* 让弹窗紧靠着属性编辑框左侧 */
.adjacent-dialog :deep(.el-dialog__wrapper) {
  position: fixed;
  height: auto;
  width: 400px;
  max-height: calc(100vh - 60px); /* 限制最大高度，底部少30px */
  right: calc(280px + 10px); /* 右侧面板宽度 + 间距 */
  top: auto; /* 让top属性生效 */
  bottom: auto; /* 让top属性生效 */
  left: auto; /* 让right属性生效 */
  display: block;
  margin: 0;
  transform: none; /* 移除默认的居中变换 */
  z-index: 1005; /* 确保与属性面板在同一层级 */
}

.adjacent-dialog :deep(.el-dialog) {
  margin: 0;
  position: static;
  width: 100%;
  max-width: none;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15); /* 添加阴影使其看起来更自然 */
}

.empty-state {
  text-align: center;
  padding: 20px 0;
}

.empty-text {
  font-size: 14px;
  color: #606266;
  margin-bottom: 20px;
}

:deep(.el-dialog__body) {
  padding: 20px;
}

:deep(.el-button--primary) {
  background-color: #1890ff;
  border-color: #1890ff;
}

/* 图片容器样式 */
.image-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
}

.plan-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
}

/* 空内容状态样式 */
.empty-content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 20px;
}

/* 点位项样式 */
.point-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  margin-top: 10px;
  background-color: #f5f7fa;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.point-item:hover {
  background-color: #e6e8eb;
}

.point-info {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #303133;
}

.point-actions {
  display: flex;
  gap: 12px;
}

.action-btn {
  font-size: 12px;
  cursor: pointer;
  transition: color 0.3s ease;
}

.action-btn.edit {
  color: #006FFF;
}

.action-btn.edit:hover {
  color: #005ce6;
}

.action-btn.delete {
  color: #f56c6c;
}

.action-btn.delete:hover {
  color: #d32f2f;
}

/* 点位表单样式 */
.point-form {
  max-height: 400px;
  overflow-y: auto;
}

.radio-group {
  display: flex;
  gap: 16px;
}

.section-title {
  font-size: 12px;
  color: #303133;
  font-weight: 500;
  margin-top: 16px;
  margin-bottom: 8px;
}

/* 确保单选按钮的样式 */
:deep(.el-radio) {
  margin-right: 10px;
}

/* 确保选择框的宽度 */
.property-item .el-select {
  width: 120px;
}
</style>
