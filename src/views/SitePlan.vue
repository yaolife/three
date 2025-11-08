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
          <div class="handle_btn_item" @click="togglePlaybackFromHeader">
            <img
              src="@/images/preview.png"
              alt="预览"
              style="width: 20px; height: 20px; margin-right: 5px"
            /><span>{{ isPlaying ? '停止' : '预览' }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="main-layout">
      <!-- 左侧导航菜单 -->
      <div class="left-sidebar">
        <div class="sidebar-header">
          <div class="project_name">起重机路径列表</div>
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

        <!-- 起重机路径列表 -->
        <div class="crane-list">
          <div
            v-for="crane in filteredCranes"
            :key="crane.id"
            :class="[
              'crane-item',
              { selected: selectedCrane && selectedCrane.id === crane.id },
            ]"
            @click="selectCrane(crane)"
          > <span class="crane-color" :style="{ backgroundColor: crane.color }"></span>
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
        </el-dialog>

        <!-- 添加起点弹窗 - 修改样式使其紧靠着属性编辑框左侧 -->
        <el-dialog
          v-model="addPointDialogVisible"
          title="添加点位"
          width="330px"
          :top="calculateDialogTop()"
          :close-on-click-modal="false"
          :close-on-press-escape="false"
          custom-class="add-point-dialog adjacent-dialog"
          style="position: fixed;right: 320px;height: 93%;"
        >
          <div class="point-form">
            <div class="property-item">
              <label>点位名称</label>
              <el-input v-model="newPoint.name" placeholder="点位名称" />
            </div>
            <div class="property-item">
              <label>X轴</label>
              <el-input-number
                v-model="newPoint.x"
                :precision="6"
                :step="0.1"
                placeholder="X坐标"
                style="width: 120px"
              />
            </div>
            <div class="property-item">
              <label>Y轴</label>
              <el-input-number
                v-model="newPoint.y"
                :precision="6"
                :step="0.1"
                placeholder="Y坐标"
                style="width: 120px"
              />
            </div>
            <div class="property-item">
              <label>占点类型</label>
              <div class="radio-group">
                <el-radio v-model="newPoint.type" label="lifting" @change="onPointTypeChange">吊装点位</el-radio>
                <el-radio
                  v-model="newPoint.type"
                  label="moving"
                  :disabled="isAddingStartPoint"
                  @change="onPointTypeChange"
                >移动点位</el-radio>
              </div>
            </div>
            
            <!-- 吊装点位特有字段 -->
            <template v-if="newPoint.type === 'lifting'">
                <div class="point_title">占点设置</div>
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
                  <span class="unit">m²</span>
              </div>
              <div class="property-item">
                <label>开始日期</label>
                <el-date-picker
                  v-model="newPoint.startTime"
                  type="date"
                  placeholder="请选择开始日期"
                  value-format="YYYY-MM-DD"
                  format="YYYY-MM-DD"
                />
              </div>
              <div class="property-item" v-if="!isAddingStartPoint">
                <label>结束日期</label>
                <el-date-picker
                  v-model="newPoint.endTime"
                  type="date"
                  placeholder="请选择结束日期"
                  value-format="YYYY-MM-DD"
                  format="YYYY-MM-DD"
                />
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
              <div class="stub-config">
                <div class="stub-img"> <img src="@/images/configurations.png" alt="设置" style="width: 46px; height: 20px"></div>
                <div> <div class="property-item">
                <label>占位长度</label>
                <el-input-number
                  controls-position="right"
                  v-model="newPoint.occupyLength"
                  :min="0"
                  :step="0.1"
                  placeholder="16"
                />
                <span class="unit">m</span>
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
                  <span class="unit">m</span>
              </div>
              <div class="property-item">
                <label>旋转角度</label>
                <el-input-number
                  controls-position="right"
                  v-model="newPoint.rotateAngle"
                  :step="1"
                  placeholder="-30"
                />
                  <span class="unit">度</span>
              </div></div>
              </div>
             
              
              <!-- 吊装区域 -->
              <div class="section-title">吊装区域</div>
              <div class="property-item">
                <label>作业半径</label>
                <el-input-number
                  controls-position="right"
                  v-model="newPoint.radius"
                  :min="0"
                  :step="0.1"
                  placeholder="16"
                />
                <span class="unit">m</span>
              </div>
              <div class="property-item">
                <label>幅度</label>
                <el-input-number
                  controls-position="right"
                  v-model="newPoint.amplitude"
                  :min="0"
                  :step="1"
                  placeholder="126"
                />
                <span class="unit">度</span>
              </div>
              <div class="property-item">
                <label>回转</label>
                <el-input-number
                  controls-position="right"
                  v-model="newPoint.rotation"
                  :min="0"
                  :step="1"
                  placeholder="90"
                />
                <span class="unit">度</span>
              </div>
            </template>
            
          </div>
          <template #footer>
            <span class="dialog-footer">
              <el-button class="punctuation" @click="addPointDialogVisible = false">重新标点</el-button>
              <el-button type="primary" @click="confirmAddPoint">确认添加</el-button>
            </span>
          </template>
        </el-dialog>
        
        <!-- 修改点位弹窗 - 修改样式使其紧靠着属性编辑框左侧 -->
        <el-dialog
          v-model="editPointDialogVisible"
          title="修改点位"
          width="330px"
          :top="calculateDialogTop()"
          :close-on-click-modal="false"
          :close-on-press-escape="false"
          custom-class="edit-point-dialog adjacent-dialog"
          style="position: fixed;right: 320px;"
        >
          <div class="point-form">
            <div class="property-item">
              <label>点位名称</label>
              <el-input v-model="editingPoint.name" placeholder="点位名称" />
            </div>
            <div class="property-item">
              <label>X轴</label>
              <el-input-number
                v-model="editingPoint.x"
                :precision="6"
                :step="0.1"
                placeholder="X坐标"
                style="width: 120px"
              />
            </div>
            <div class="property-item">
              <label>Y轴</label>
              <el-input-number
                v-model="editingPoint.y"
                :precision="6"
                :step="0.1"
                placeholder="Y坐标"
                style="width: 120px"
              />
            </div>
            
            <!-- 吊装点位特有字段 -->
            <template v-if="editingPoint.type === 'lifting'">
              <div class="point_title">占点设置</div>
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
                <label>开始日期</label>
                <el-date-picker
                  v-model="editingPoint.startTime"
                  type="date"
                  placeholder="请选择开始日期"
                  value-format="YYYY-MM-DD"
                  format="YYYY-MM-DD"
                />
              </div>
              <div class="property-item" v-if="!isEditingStartPoint">
                <label>结束日期</label>
                <el-date-picker
                  v-model="editingPoint.endTime"
                  type="date"
                  placeholder="请选择结束日期"
                  value-format="YYYY-MM-DD"
                  format="YYYY-MM-DD"
                />
              </div>
              <div class="property-item">
                <label>完成状态</label>
                <el-select v-model="editingPoint.status" placeholder="完成状态">
                  <el-option label="已完成" value="completed" />
                  <el-option label="未完成" value="pending" />
                </el-select>
              </div>
              
              <!-- 吊装区域 -->
              <div class="section-title">吊装区域</div>
              <div class="property-item">
                <label>作业半径</label>
                <el-input-number
                  controls-position="right"
                  v-model="editingPoint.radius"
                  :min="0"
                  :step="0.1"
                  placeholder="16"
                />
                <span class="unit">m</span>
              </div>
              <div class="property-item">
                <label>幅度</label>
                <el-input-number
                  controls-position="right"
                  v-model="editingPoint.amplitude"
                  :min="0"
                  :step="1"
                  placeholder="126"
                />
                <span class="unit">°</span>
              </div>
              <div class="property-item">
                <label>回转</label>
                <el-input-number
                  controls-position="right"
                  v-model="editingPoint.rotation"
                  :min="0"
                  :step="1"
                  placeholder="90"
                />
                <span class="unit">°</span>
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
        <div class="image-container">
          <!-- 施工场景平面图 -->
          <img
            ref="imageRef"
            src="@/images/planning.png"
            alt="总平规划图"
            class="plan-image"
            @load="handleImageLoad"
            @error="handleImageError"
          />
          <!-- Canvas覆盖层用于绘制点位和路径 -->
          <canvas
            ref="canvas"
            class="point-canvas"
            @mousedown="handleCanvasMouseDown"
            @mousemove="handleCanvasMouseMove"
            @mouseup="handleCanvasMouseUp"
            @mouseleave="handleCanvasMouseUp"
            @wheel="handleCanvasWheel"
          ></canvas>
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
            <el-color-picker
              v-model="selectedCrane.color"
              size="small"
              show-alpha
              show-input="false"
              @change="onColorChange"
            />
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
                :precision="2"
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
                :precision="2"
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
                <!-- 根据点位类型和索引显示不同图标 -->
                <img 
                  v-if="index === 0" 
                  src="@/images/point.png" 
                  alt="起点" 
                  style="width: 16px; height: 16px; margin-right: 8px"
                />
                <img 
                  v-else-if="point.type === 'lifting'" 
                  src="@/images/crane_point.png" 
                  alt="吊装点位" 
                  style="width: 16px; height: 16px; margin-right: 8px"
                />
                <img 
                  v-else 
                  src="@/images/move_point.png" 
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
          <!-- 播放和重置按钮 -->
          <div class="trajectory-controls">
            <el-button 
              type="primary" 
              :disabled="!selectedCrane || !selectedCrane.points || selectedCrane.points.length < 2"
              @click="togglePlayback"
              style="width: 100%; margin-bottom: 10px;"
            >
              {{ isPlaying && playingCraneId === selectedCrane?.id ? '停止播放' : '播放路径动画' }}
            </el-button>
            <el-button 
              type="warning" 
              :disabled="!selectedCrane || !selectedCrane.points || selectedCrane.points.length === 0"
              @click="resetTrajectory"
              style="width: 100%;"
            >
              重置路径
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import { ArrowLeft, Search, Close } from "@element-plus/icons-vue";
import startIconSrc from "@/images/point.png";
import liftingIconSrc from "@/images/crane_point.png";
import movingIconSrc from "@/images/move_point.png";

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
const craneCounter = ref(1); // 用于生成起重机名称，从2开始编号

// 点位相关数据
const addPointDialogVisible = ref(false);
const editPointDialogVisible = ref(false);

// Canvas相关数据
const canvas = ref(null);
const ctx = ref(null);
const scale = ref(1);
const offsetX = ref(0);
const offsetY = ref(0);
const isDragging = ref(false);
const lastMouseX = ref(0);
const lastMouseY = ref(0);
const imageRef = ref(null);
const imageWidth = ref(0);
const imageHeight = ref(0);
const imageNaturalWidth = ref(0);
const imageNaturalHeight = ref(0);

// 点位拖动相关
const isDraggingPoint = ref(false);
const draggedPoint = ref(null);
const draggedCrane = ref(null);
const draggedPointIndex = ref(-1);
const pointHitRadiusMap = {
  start: 16,
  lifting: 14,
  moving: 14,
}; // 点位点击检测半径（不同图标大小）

// 轨迹播放相关
const isPlaying = ref(false);
const playingCraneId = ref(null);
const playbackProgress = ref(0);
const playbackAnimationFrame = ref(null);

// 点位图标
const pointIconImages = {
  start: new Image(),
  lifting: new Image(),
  moving: new Image(),
};
pointIconImages.start.src = startIconSrc;
pointIconImages.lifting.src = liftingIconSrc;
pointIconImages.moving.src = movingIconSrc;

Object.values(pointIconImages).forEach((img) => {
  img.onload = () => {
    drawAllTrajectories();
  };
});

const pointIconSizes = {
  start: 28,
  lifting: 24,
  moving: 24,
};

const pointIconSrcMap = {
  start: startIconSrc,
  lifting: liftingIconSrc,
  moving: movingIconSrc,
};

const getPointIconKey = (point) => {
  if (!point) return "lifting";
  if (point.isStart) return "start";
  return point.type === "lifting" ? "lifting" : "moving";
};

const isValidDateDay = (value) => {
  if (!value) return false;
  return /^\d{4}-\d{2}-\d{2}$/.test(String(value).trim());
};

const createBasePoint = (overrides = {}) => ({
  name: "点位1",
  x: 112.0,
  y: 38.0,
  type: "lifting", // lifting: 吊装点位, moving: 移动点位
  groundLoad: 10,
  area: "",
  startTime: null,
  endTime: null,
  status: "completed",
  occupyLength: 16,
  occupyWidth: 0.5,
  rotateAngle: -30,
  radius: 10,
  amplitude: 10,
  angle: 60,
  isStart: false,
  ...overrides,
});

const clonePoints = (points = []) => points.map((point) => ({ ...point }));

const applyStartFlags = (points = []) => {
  points.forEach((point, index) => {
    point.isStart = index === 0;
    point.startTime = point.startTime ? String(point.startTime) : null;
    point.endTime = point.endTime ? String(point.endTime) : null;

    if (point.isStart) {
      point.type = "lifting";
      point.endTime = null;
      point.name = "起点1";
    }

    if (point.type !== "lifting") {
      point.startTime = null;
      point.endTime = null;
    }
  });
};

const countPointsByType = (points = [], type) =>
  points.filter((point, index) => index > 0 && point.type === type).length;

const getNextPointName = (type, currentPoints = [], isStart = false) => {
  if (isStart) return "起点1";
  if (type === "moving") {
    const movingCount = countPointsByType(currentPoints, "moving");
    return `移动点位${movingCount + 1}`;
  }
  const liftingCount = countPointsByType(currentPoints, "lifting");
  return `吊装点位${liftingCount + 1}`;
};

const updateCranePoints = (craneId, points = []) => {
  const normalized = clonePoints(points);
  applyStartFlags(normalized);

  if (selectedCrane.value && selectedCrane.value.id === craneId) {
    selectedCrane.value.points = normalized;
  }

  const craneIndex = cranes.value.findIndex((c) => c.id === craneId);
  if (craneIndex !== -1) {
    cranes.value[craneIndex] = { ...cranes.value[craneIndex], points: normalized };
  }

  return normalized;
};

const newPoint = ref(createBasePoint());
const editingPoint = ref(createBasePoint());
const editingPointIndex = ref(-1);

// 计算属性：是否有起点
const hasStartPoint = computed(() => {
  return selectedCrane.value && Array.isArray(selectedCrane.value.points) && selectedCrane.value.points.length > 0;
});

const isAddingStartPoint = computed(() => newPoint.value?.isStart === true);

const isEditingStartPoint = computed(() => editingPointIndex.value === 0);

onMounted(() => {
  // 从路由参数获取项目ID
  projectId.value = route.params.id || "";
  console.log("总平规划项目ID:", projectId.value);
  // 加载项目数据
  loadProjectData();
  // 自动显示Dialog
  dialogVisible.value = false;
  
  // 初始化Canvas
  nextTick(() => {
    initCanvas();
  });
  
  // 监听窗口大小变化，重新调整Canvas大小
  window.addEventListener('resize', handleResize);
});

// 处理图片加载
const handleImageLoad = () => {
  console.log('图片加载完成');
  if (imageRef.value) {
    imageNaturalWidth.value = imageRef.value.naturalWidth;
    imageNaturalHeight.value = imageRef.value.naturalHeight;
    console.log('图片尺寸:', imageNaturalWidth.value, imageNaturalHeight.value);
    nextTick(() => {
      updateImageDimensions();
      // 确保Canvas已初始化
      if (!ctx.value && canvas.value) {
        initCanvas();
      } else {
        drawAllTrajectories();
      }
    });
  }
};

// 处理图片加载错误
const handleImageError = () => {
  console.error('图片加载失败');
};

// 更新图片尺寸
const updateImageDimensions = () => {
  if (imageRef.value && canvas.value) {
    const rect = imageRef.value.getBoundingClientRect();
    imageWidth.value = rect.width;
    imageHeight.value = rect.height;
    // 延迟重绘，确保尺寸更新完成
    nextTick(() => {
      drawAllTrajectories();
    });
  }
};

// 初始化Canvas
const initCanvas = () => {
  if (!canvas.value) return;
  
  ctx.value = canvas.value.getContext('2d');
  
  // 设置Canvas大小与容器一致
  const container = canvas.value.parentElement;
  if (container) {
    canvas.value.width = container.offsetWidth;
    canvas.value.height = container.offsetHeight;
  }
  
  // 更新图片尺寸
  updateImageDimensions();
  
  // 绘制所有轨迹
  drawAllTrajectories();
};

// 处理窗口大小变化
const handleResize = () => {
  if (!canvas.value) return;
  
  const container = canvas.value.parentElement;
  if (container) {
    canvas.value.width = container.offsetWidth;
    canvas.value.height = container.offsetHeight;
  }
  
  // 更新图片尺寸
  updateImageDimensions();
  
  // 重绘所有轨迹
  drawAllTrajectories();
};

// 坐标系统映射参数（可以在使用时调整）
const coordMinX = ref(100);
const coordMaxX = ref(120);
const coordMinY = ref(30);
const coordMaxY = ref(50);

// 将地理坐标转换为Canvas坐标
// 坐标系统：X和Y是地理坐标（例如112.000000, 38.000000）
// 需要映射到图片在canvas上的实际位置
const convertToCanvasCoords = (x, y) => {
  if (!imageRef.value || !canvas.value) {
    console.warn('图片或Canvas未加载，使用默认映射');
    // 如果图片或canvas未加载，使用默认映射
    return { x: x * 5, y: y * 5 };
  }
  
  try {
    const imageRect = imageRef.value.getBoundingClientRect();
    const containerRect = canvas.value.parentElement.getBoundingClientRect();
    
    // 计算图片在容器中的偏移（相对于容器）
    const imageOffsetX = imageRect.left - containerRect.left;
    const imageOffsetY = imageRect.top - containerRect.top;
    
    // 获取图片实际显示尺寸
    const displayedWidth = imageRect.width;
    const displayedHeight = imageRect.height;
    
    if (displayedWidth === 0 || displayedHeight === 0) {
      console.warn('图片尺寸为0，使用默认映射');
      return { x: x * 5, y: y * 5 };
    }
    
    const coordRangeX = coordMaxX.value - coordMinX.value;
    const coordRangeY = coordMaxY.value - coordMinY.value;
    
    if (coordRangeX === 0 || coordRangeY === 0) {
      console.warn('坐标范围无效，使用默认映射');
      return { x: x * 5, y: y * 5 };
    }
    
    // 将地理坐标归一化（允许超出范围，以便支持更大的坐标范围）
    const normalizedX = (x - coordMinX.value) / coordRangeX;
    const normalizedY = (y - coordMinY.value) / coordRangeY;
    
    // 映射到图片坐标
    const canvasX = imageOffsetX + normalizedX * displayedWidth;
    const canvasY = imageOffsetY + normalizedY * displayedHeight;
    
    return { x: canvasX, y: canvasY };
  } catch (error) {
    console.error('坐标转换错误:', error);
    // 如果转换失败，使用默认映射
    return { x: x * 5, y: y * 5 };
  }
};

// 将Canvas坐标转换为地理坐标
const convertToGeoCoords = (canvasX, canvasY) => {
  if (!imageRef.value || !canvas.value) {
    return { x: canvasX / 5, y: canvasY / 5 };
  }
  
  try {
    const imageRect = imageRef.value.getBoundingClientRect();
    const containerRect = canvas.value.parentElement.getBoundingClientRect();
    
    // 计算图片在容器中的偏移
    const imageOffsetX = imageRect.left - containerRect.left;
    const imageOffsetY = imageRect.top - containerRect.top;
    
    // 获取图片实际显示尺寸
    const displayedWidth = imageRect.width;
    const displayedHeight = imageRect.height;
    
    if (displayedWidth === 0 || displayedHeight === 0) {
      return { x: canvasX / 5, y: canvasY / 5 };
    }
    
    // 计算相对于图片的坐标
    const relativeX = canvasX - imageOffsetX;
    const relativeY = canvasY - imageOffsetY;
    
    // 归一化到0-1范围
    const normalizedX = relativeX / displayedWidth;
    const normalizedY = relativeY / displayedHeight;
    
    // 转换为地理坐标
    const coordRangeX = coordMaxX.value - coordMinX.value;
    const coordRangeY = coordMaxY.value - coordMinY.value;
    
    const geoX = coordMinX.value + normalizedX * coordRangeX;
    const geoY = coordMinY.value + normalizedY * coordRangeY;
    
    return { x: geoX, y: geoY };
  } catch (error) {
    console.error('坐标转换错误:', error);
    return { x: canvasX / 5, y: canvasY / 5 };
  }
};

// 绘制单个起重机的轨迹（已废弃，现在使用drawAllTrajectories统一绘制）
// 保留此函数以兼容播放进度绘制
const drawCraneTrajectory = (crane, isHighlighted = false) => {
  // 此函数不再使用，所有绘制都在drawAllTrajectories中完成
};

// 绘制播放进度
const drawPlaybackProgress = (crane, points) => {
  if (points.length < 2 || playbackProgress.value <= 0) return;
  
  const color = crane.color || '#26256B';
  const totalLength = points.length - 1;
  const currentIndex = Math.floor(playbackProgress.value * totalLength);
  const progress = (playbackProgress.value * totalLength) % 1;
  
  if (currentIndex < points.length - 1) {
    const startCoords = convertToCanvasCoords(points[currentIndex].x, points[currentIndex].y);
    const endCoords = convertToCanvasCoords(points[currentIndex + 1].x, points[currentIndex + 1].y);
    
    // 绘制已完成的路径（实线）
  ctx.value.save();
    ctx.value.beginPath();
    ctx.value.moveTo(startCoords.x, startCoords.y);
    
    // 计算当前位置
    const currentX = startCoords.x + (endCoords.x - startCoords.x) * progress;
    const currentY = startCoords.y + (endCoords.y - startCoords.y) * progress;
    ctx.value.lineTo(currentX, currentY);
    
    ctx.value.strokeStyle = color;
    ctx.value.lineWidth = 4;
    ctx.value.stroke();
    ctx.value.restore();
    
    // 绘制当前位置指示器
    ctx.value.save();
    ctx.value.fillStyle = '#ff0000';
    ctx.value.beginPath();
    ctx.value.arc(currentX, currentY, 6, 0, 2 * Math.PI);
    ctx.value.fill();
    ctx.value.strokeStyle = '#ffffff';
    ctx.value.lineWidth = 2;
    ctx.value.stroke();
    ctx.value.restore();
  }
};

// 绘制所有轨迹
const drawAllTrajectories = () => {
  if (!ctx.value || !canvas.value) {
    console.warn('Canvas未初始化，无法绘制');
    return;
  }
  
  // 清空Canvas
  ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height);
  
  // 先绘制所有路径线（按点位顺序连接）
  cranes.value.forEach(crane => {
    if (crane.points && crane.points.length > 1) {
      const color = crane.color || '#26256B';
      const lineWidth = (selectedCrane.value && selectedCrane.value.id === crane.id) ? 3 : 2;
      
      ctx.value.save();
      ctx.value.setLineDash([5, 5]); // 虚线样式
      ctx.value.beginPath();
      
      // 按点位顺序连接所有点位，生成完整路径
      const startCoords = convertToCanvasCoords(crane.points[0].x, crane.points[0].y);
      ctx.value.moveTo(startCoords.x, startCoords.y);
      
      // 连接所有后续点位
      for (let i = 1; i < crane.points.length; i++) {
        const coords = convertToCanvasCoords(crane.points[i].x, crane.points[i].y);
        ctx.value.lineTo(coords.x, coords.y);
    }
    
    ctx.value.strokeStyle = color;
      ctx.value.lineWidth = lineWidth;
    ctx.value.stroke();
      ctx.value.restore();
    }
  });
  
  // 再绘制所有点位（按顺序绘制，后添加的在上面）
  // 为了确保后添加的点位在上面，我们需要按照添加顺序绘制
  // 但也要确保选中的起重机的点位在上面
  const allPoints = [];
  
  // 收集所有点位，记录它们的添加顺序
  cranes.value.forEach((crane, craneIndex) => {
    if (crane.points && crane.points.length > 0) {
      const isSelected = selectedCrane.value && selectedCrane.value.id === crane.id;
      crane.points.forEach((point, pointIndex) => {
        allPoints.push({
          point,
          crane,
          craneIndex,
          pointIndex,
          isSelected,
          isStart: !!point.isStart,
          pointId: point.id || pointIndex // 使用点位的ID或索引
        });
      });
    }
  });
  
  // 排序规则：
  // 1. 先绘制非选中的起重机点位
  // 2. 再绘制选中的起重机点位
  // 3. 在同一起重机内，按添加顺序（索引）绘制，索引大的（后添加的）在上层
  // 4. 对于选中的起重机，使用更大的绘制顺序值，确保在上层
  allPoints.sort((a, b) => {
    // 先按是否选中排序
    if (a.isSelected && !b.isSelected) return 1;
    if (!a.isSelected && b.isSelected) return -1;
    
    // 如果都是选中或都未选中，按起重机索引排序
    if (a.craneIndex !== b.craneIndex) {
      return a.craneIndex - b.craneIndex;
    }
    
    // 同一起重机内，按点位索引排序（索引大的后绘制，在上层）
    return a.pointIndex - b.pointIndex;
  });
  
  // 绘制所有点位
  allPoints.forEach(({ point, crane, index, isSelected, isStart }) => {
    const coords = convertToCanvasCoords(point.x, point.y);
    const color = crane.color || '#26256B';
    const iconKey = getPointIconKey(point);
    const iconImage = pointIconImages[iconKey];
    const iconSize = (pointIconSizes[iconKey] || 24) * (isSelected ? 1.1 : 1);
    
    if (iconImage && iconImage.complete) {
      ctx.value.drawImage(iconImage, coords.x - iconSize / 2, coords.y - iconSize / 2, iconSize, iconSize);
    } else {
      // 备用：使用彩色圆形
    ctx.value.beginPath();
    ctx.value.fillStyle = color;
      ctx.value.arc(coords.x, coords.y, iconSize / 2, 0, Math.PI * 2);
    ctx.value.fill();
    ctx.value.strokeStyle = '#ffffff';
      ctx.value.lineWidth = 1;
    ctx.value.stroke();
    }
  });
  
  // 如果是播放状态，绘制播放进度
  if (isPlaying.value && playingCraneId.value) {
    const playingCrane = cranes.value.find(c => c.id === playingCraneId.value);
    if (playingCrane && playingCrane.points && playingCrane.points.length > 1) {
      drawPlaybackProgress(playingCrane, playingCrane.points);
    }
  }
};

// 获取鼠标在Canvas上的坐标
const getMouseCanvasPos = (event) => {
  if (!canvas.value) return { x: 0, y: 0 };
  
  const rect = canvas.value.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  };
};

// 检测鼠标是否点击在点位上
const getPointAtPosition = (x, y) => {
  // 收集所有点位及其信息
  const allPoints = [];
  
  cranes.value.forEach((crane, craneIndex) => {
    if (!crane.points || crane.points.length === 0) return;
    
    const isSelected = selectedCrane.value && selectedCrane.value.id === crane.id;
    
    crane.points.forEach((point, pointIndex) => {
      const coords = convertToCanvasCoords(point.x, point.y);
      const iconKey = getPointIconKey(point);
      const hitRadius = pointHitRadiusMap[iconKey] || 12;
      const distance = Math.sqrt(Math.pow(x - coords.x, 2) + Math.pow(y - coords.y, 2));
      
      if (distance <= hitRadius) {
        allPoints.push({
          point,
          crane,
          craneIndex,
          pointIndex,
          isSelected,
          distance
        });
      }
    });
  });
  
  if (allPoints.length === 0) return null;
  
  // 排序：优先选中起重机的点位，然后按距离排序（距离小的优先），最后按添加顺序（索引大的优先）
  allPoints.sort((a, b) => {
    // 选中的起重机点位优先
    if (a.isSelected && !b.isSelected) return -1;
    if (!a.isSelected && b.isSelected) return 1;
    
    // 同一状态，按距离排序（距离小的优先）
    if (Math.abs(a.distance - b.distance) > 0.1) {
      return a.distance - b.distance;
    }
    
    // 距离相近，按起重机索引排序（后面的优先）
    if (a.craneIndex !== b.craneIndex) {
      return b.craneIndex - a.craneIndex;
    }
    
    // 同一起重机，按点位索引排序（索引大的，即后添加的优先）
    return b.pointIndex - a.pointIndex;
  });
  
  // 返回最优先的点位
  const hit = allPoints[0];
  return {
    point: hit.point,
    crane: hit.crane,
    index: hit.pointIndex
  };
};

// 鼠标按下事件处理
const handleCanvasMouseDown = (event) => {
  const mousePos = getMouseCanvasPos(event);
  
  // 先检查是否点击在点位上
  const hitPoint = getPointAtPosition(mousePos.x, mousePos.y);
  
  if (hitPoint) {
    // 开始拖动点位
    isDraggingPoint.value = true;
    draggedPoint.value = hitPoint.point;
    draggedCrane.value = hitPoint.crane;
    draggedPointIndex.value = hitPoint.index;
    canvas.value.style.cursor = 'move';
    
    // 如果点击的不是当前选中的起重机，切换到该起重机
    if (!selectedCrane.value || selectedCrane.value.id !== hitPoint.crane.id) {
      selectCrane(hitPoint.crane);
    }
  } else {
    // 开始拖动Canvas
  isDragging.value = true;
  lastMouseX.value = event.clientX;
  lastMouseY.value = event.clientY;
  canvas.value.style.cursor = 'grabbing';
  }
};

// 鼠标移动事件处理
const handleCanvasMouseMove = (event) => {
  const mousePos = getMouseCanvasPos(event);
  
  if (isDraggingPoint.value && draggedPoint.value && draggedCrane.value && draggedPointIndex.value >= 0) {
    // 拖动点位
    event.preventDefault(); // 阻止默认行为
    const newGeoCoords = convertToGeoCoords(mousePos.x, mousePos.y);
    
    // 更新cranes数组中的数据（这是数据源）
    const craneIndex = cranes.value.findIndex(c => c.id === draggedCrane.value.id);
    if (craneIndex !== -1 && cranes.value[craneIndex].points) {
      cranes.value[craneIndex].points[draggedPointIndex.value].x = newGeoCoords.x;
      cranes.value[craneIndex].points[draggedPointIndex.value].y = newGeoCoords.y;
    }
    
    // 同步更新selectedCrane（如果当前选中的是这个起重机）
    if (selectedCrane.value && selectedCrane.value.id === draggedCrane.value.id) {
      if (selectedCrane.value.points && selectedCrane.value.points[draggedPointIndex.value]) {
        selectedCrane.value.points[draggedPointIndex.value].x = newGeoCoords.x;
        selectedCrane.value.points[draggedPointIndex.value].y = newGeoCoords.y;
      }
    }
    
    // 更新draggedPoint引用
    draggedPoint.value.x = newGeoCoords.x;
    draggedPoint.value.y = newGeoCoords.y;
    
    // 重绘
    drawAllTrajectories();
  } else if (isDragging.value) {
    // 拖动Canvas
    event.preventDefault(); // 阻止默认行为
  const deltaX = event.clientX - lastMouseX.value;
  const deltaY = event.clientY - lastMouseY.value;
  
  offsetX.value += deltaX;
  offsetY.value += deltaY;
  
  lastMouseX.value = event.clientX;
  lastMouseY.value = event.clientY;
  
    // 重绘所有轨迹
    drawAllTrajectories();
  } else {
    // 鼠标悬停，检查是否在点位上
    const hitPoint = getPointAtPosition(mousePos.x, mousePos.y);
    if (hitPoint) {
      canvas.value.style.cursor = 'move';
    } else {
      canvas.value.style.cursor = 'grab';
    }
  }
};

// 鼠标释放事件处理
const handleCanvasMouseUp = (event) => {
  if (isDraggingPoint.value) {
    // 点位拖动结束，确保坐标已保存
    if (draggedPoint.value && draggedCrane.value && draggedPointIndex.value >= 0) {
      // 坐标已经在拖动过程中更新，这里只需要清理状态
      console.log('点位拖动结束，最终坐标:', {
        x: draggedPoint.value.x,
        y: draggedPoint.value.y
      });
    }
    
    isDraggingPoint.value = false;
    draggedPoint.value = null;
    draggedCrane.value = null;
    draggedPointIndex.value = -1;
  }
  
  if (isDragging.value) {
  isDragging.value = false;
  }
  
  if (canvas.value) {
    canvas.value.style.cursor = 'grab';
  }
  
  event.preventDefault();
};

// 鼠标滚轮事件处理（缩放）
const handleCanvasWheel = (event) => {
  event.preventDefault();
  
  const mouseX = event.clientX - canvas.value.offsetLeft;
  const mouseY = event.clientY - canvas.value.offsetTop;
  
  const scaleRatio = event.deltaY > 0 ? 0.9 : 1.1;
  const newScale = Math.max(0.1, Math.min(5, scale.value * scaleRatio));
  
  // 调整偏移量以保持鼠标位置不变
  const scaleChange = newScale / scale.value;
  
  offsetX.value = mouseX - (mouseX - offsetX.value) * scaleChange;
  offsetY.value = mouseY - (mouseY - offsetY.value) * scaleChange;
  
  scale.value = newScale;
  
  // 重绘所有轨迹
  drawAllTrajectories();
};

// 颜色变化处理
const onColorChange = () => {
  // 更新原数据中的对应起重机颜色
  if (selectedCrane.value) {
    const craneIndex = cranes.value.findIndex(c => c.id === selectedCrane.value.id);
    if (craneIndex !== -1) {
      cranes.value[craneIndex].color = selectedCrane.value.color;
    }
  }
  
  // 当颜色变化时，重绘所有轨迹
  drawAllTrajectories();
};

// 监听selectedCrane的变化
watch(
  () => selectedCrane.value,
  () => {
    drawAllTrajectories();
  },
  { deep: true }
);

// 监听cranes数组的变化，自动重绘所有轨迹
watch(
  () => cranes.value,
  () => {
    drawAllTrajectories();
  },
  { deep: true }
);

// 监听selectedCrane的points变化
watch(
  () => selectedCrane.value?.points,
  () => {
    if (selectedCrane.value) {
      // 更新原数据中的对应起重机点位
      const craneIndex = cranes.value.findIndex(c => c.id === selectedCrane.value.id);
      if (craneIndex !== -1) {
        cranes.value[craneIndex].points = [...(selectedCrane.value.points || [])];
      }
      drawAllTrajectories();
    }
  },
  { deep: true }
);

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
  // 如果正在播放该起重机的轨迹，停止播放
  if (isPlaying.value && playingCraneId.value === id) {
    stopPlayback();
  }
  
  cranes.value = cranes.value.filter((crane) => crane.id !== id);
  if (selectedCrane.value && selectedCrane.value.id === id) {
    selectedCrane.value = null;
  }
  
  // 重绘所有轨迹（删除的轨迹会自动消失）
  drawAllTrajectories();
  
  ElMessage.success("起重机已删除");
};

// 选择起重机
const selectCrane = (crane) => {
  // 确保每个起重机都有点位数组
  if (!crane.points) {
    crane.points = [];
  }
  const normalizedPoints = updateCranePoints(crane.id, crane.points);
  selectedCrane.value = { ...crane, points: normalizedPoints };

  // 打开时准备一个默认的新点位
  const isStart = normalizedPoints.length === 0;
  newPoint.value = createBasePoint({
    isStart,
    type: "lifting",
    name: isStart ? "起点1" : `吊装点位${normalizedPoints.length}`,
  });

  // 重绘所有轨迹
  drawAllTrajectories();
};

// 设置起重机点位（打开添加起点弹窗）
const setCranePosition = () => {
  if (!selectedCrane.value) return;
  // 重置新点位数据
  newPoint.value = createBasePoint({
    isStart: true,
    type: "lifting",
    name: getNextPointName("lifting", selectedCrane.value.points || [], true),
  });
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
      return `${rect.top + 20}px`; // 顶部比属性面板顶部少30px
    }
    return '5%'; // 默认值
  };

  // 添加防范站位
  const addNewPosition = () => {
    if (!selectedCrane.value) return;
    
    // 重置新点位数据
    const pointCount = selectedCrane.value.points ? selectedCrane.value.points.length : 0;
    const isStart = pointCount === 0;
    newPoint.value = createBasePoint({
      name: isStart ? "起点1" : `吊装点位${pointCount}`,
      isStart,
      type: "lifting",
    });
    // 打开添加点位弹窗
    addPointDialogVisible.value = true;
  };

  // 点位类型变化处理
  const onPointTypeChange = () => {
    if (isAddingStartPoint.value) {
      newPoint.value.type = "lifting";
      return;
    }

    const currentPoints = selectedCrane.value?.points || [];
    newPoint.value.name = getNextPointName(newPoint.value.type, currentPoints, false);

    if (newPoint.value.type !== "lifting") {
      newPoint.value.startTime = null;
      newPoint.value.endTime = null;
    }

    console.log("点位类型变为:", newPoint.value.type);
  };

  // 确认添加点位
  const confirmAddPoint = () => {
    if (!selectedCrane.value) {
      ElMessage.warning("请先选择起重机");
      return;
    }
    
    const currentPoints = selectedCrane.value.points ? [...selectedCrane.value.points] : [];
    const isFirstPoint = currentPoints.length === 0;
    const pointType = isFirstPoint ? "lifting" : newPoint.value.type;

    if (pointType === "lifting") {
      if (!isValidDateDay(newPoint.value.startTime)) {
        ElMessage.warning("请填写吊装点位的开始日期（精确到天）");
        return;
      }
      if (!isFirstPoint && !isValidDateDay(newPoint.value.endTime)) {
        ElMessage.warning("请填写吊装点位的结束日期（精确到天）");
        return;
      }
      if (!isFirstPoint && new Date(newPoint.value.endTime) < new Date(newPoint.value.startTime)) {
        ElMessage.warning("吊装点位的结束日期不能早于开始日期");
        return;
      }
    }

    const xCoord = typeof newPoint.value.x === "number" ? newPoint.value.x : parseFloat(newPoint.value.x) || 112;
    const yCoord = typeof newPoint.value.y === "number" ? newPoint.value.y : parseFloat(newPoint.value.y) || 38;

    const pointToAdd = {
      ...createBasePoint(),
      ...newPoint.value,
      id: Date.now() + Math.random(),
      x: xCoord,
      y: yCoord,
      type: pointType,
      isStart: isFirstPoint,
      startTime: pointType === "lifting" ? newPoint.value.startTime : null,
      endTime: !isFirstPoint && pointType === "lifting" ? newPoint.value.endTime : null,
      name: getNextPointName(pointType, currentPoints, isFirstPoint),
    };

    const updatedPoints = [...currentPoints, pointToAdd];
    const normalized = updateCranePoints(selectedCrane.value.id, updatedPoints);
    selectedCrane.value.points = normalized;

    // 关闭弹窗
    addPointDialogVisible.value = false;
    ElMessage.success("点位已添加，可在图上拖动调整位置");
    
    // 立即重绘，确保新点位显示在图上，路径自动连接
    nextTick(() => {
      drawAllTrajectories();
      // 确保新添加的点位可见
      scrollToPoint(normalized[normalized.length - 1]);
    });
    
    // 为下一次添加准备默认点位
    const nextType = "lifting";
    newPoint.value = createBasePoint({
      isStart: false,
      type: nextType,
      name: getNextPointName(nextType, normalized, false),
    });
  };

  // 滚动到点位（确保新添加的点位可见）
  const scrollToPoint = (point) => {
    if (!point || !canvas.value || !imageRef.value) return;
    
    try {
      const coords = convertToCanvasCoords(point.x, point.y);
      const canvasRect = canvas.value.getBoundingClientRect();
      const containerRect = canvas.value.parentElement.getBoundingClientRect();
      
      // 计算点位在容器中的位置
      const pointX = coords.x + containerRect.left;
      const pointY = coords.y + containerRect.top;
      
      // 如果点位不在视口内，可以滚动（但这里我们只是确保它可见）
      // 由于Canvas是覆盖层，我们只需要确保重绘即可
    } catch (error) {
      console.error('滚动到点位失败:', error);
    }
  };

  // 编辑点位
  const editPoint = (point) => {
    // 找到要编辑的点位索引
    editingPointIndex.value = selectedCrane.value.points.findIndex(p => p.id === point.id);
    // 深拷贝点位数据用于编辑
    const isStart = editingPointIndex.value === 0;
    editingPoint.value = {
      ...createBasePoint(),
      ...point,
      isStart,
      type: isStart ? "lifting" : point.type,
      startTime: point.startTime ? String(point.startTime) : null,
      endTime: isStart ? null : point.endTime ? String(point.endTime) : null,
    };
    // 打开编辑弹窗
    editPointDialogVisible.value = true;
  };

  // 确认编辑点位
  const confirmEditPoint = () => {
    if (!selectedCrane.value || editingPointIndex.value === -1) return;
    
    const currentPoints = selectedCrane.value.points ? [...selectedCrane.value.points] : [];
    const isStart = editingPointIndex.value === 0;
    const previousType = currentPoints[editingPointIndex.value]?.type;
    const updatedPoint = {
      ...currentPoints[editingPointIndex.value],
      ...editingPoint.value,
      type: isStart ? "lifting" : editingPoint.value.type,
      isStart,
    };

    if (updatedPoint.type === "lifting") {
      if (!isValidDateDay(updatedPoint.startTime)) {
        ElMessage.warning("请填写吊装点位的开始日期（精确到天）");
        return;
      }
      if (!isStart && !isValidDateDay(updatedPoint.endTime)) {
        ElMessage.warning("请填写吊装点位的结束日期（精确到天）");
        return;
      }
      if (!isStart && new Date(updatedPoint.endTime) < new Date(updatedPoint.startTime)) {
        ElMessage.warning("吊装点位的结束日期不能早于开始日期");
        return;
      }
    } else {
      updatedPoint.startTime = null;
      updatedPoint.endTime = null;
    }

    updatedPoint.x = typeof updatedPoint.x === "number" ? updatedPoint.x : parseFloat(updatedPoint.x) || 112;
    updatedPoint.y = typeof updatedPoint.y === "number" ? updatedPoint.y : parseFloat(updatedPoint.y) || 38;
    const remainingPoints = currentPoints.filter((_, idx) => idx !== editingPointIndex.value);
    updatedPoint.name = isStart
      ? "起点1"
      : (updatedPoint.type !== previousType || !updatedPoint.name
          ? getNextPointName(updatedPoint.type, remainingPoints, false)
          : updatedPoint.name);

    currentPoints[editingPointIndex.value] = updatedPoint;
    const normalized = updateCranePoints(selectedCrane.value.id, currentPoints);
    selectedCrane.value.points = normalized;
    
    // 关闭弹窗
    editPointDialogVisible.value = false;
    editingPointIndex.value = -1;
    ElMessage.success("点位已更新");
      
    // 重绘所有轨迹
    drawAllTrajectories();
  };

  // 删除点位
  const deletePoint = (index) => {
    if (!selectedCrane.value || index === 0) return; // 不能删除起点
    
    // 删除点位
    const currentPoints = selectedCrane.value.points ? [...selectedCrane.value.points] : [];
    currentPoints.splice(index, 1);
    const normalized = updateCranePoints(selectedCrane.value.id, currentPoints);
    selectedCrane.value.points = normalized;
    
    ElMessage.success("点位已删除");
      
    // 重绘所有轨迹
    drawAllTrajectories();
    
    const nextType = "lifting";
    newPoint.value = createBasePoint({
      isStart: normalized.length === 0,
      type: nextType,
      name: getNextPointName(nextType, normalized, normalized.length === 0),
    });
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

  // 轨迹播放功能（从顶部按钮调用）
  const togglePlaybackFromHeader = () => {
    togglePlayback();
  };

  // 轨迹播放功能（从属性面板调用）
  const togglePlayback = () => {
    if (!selectedCrane.value || !selectedCrane.value.points || selectedCrane.value.points.length < 2) {
      ElMessage.warning("请先选择有至少2个点位的起重机路径");
      return;
    }
    
    if (isPlaying.value && playingCraneId.value === selectedCrane.value.id) {
      stopPlayback();
    } else {
      startPlayback();
    }
  };

  // 开始播放
  const startPlayback = () => {
    if (!selectedCrane.value) return;
    
    isPlaying.value = true;
    playingCraneId.value = selectedCrane.value.id;
    playbackProgress.value = 0;
    
    const duration = 5000; // 5秒完成一次播放
    const startTime = Date.now();
    
    const animate = () => {
      if (!isPlaying.value) return;
      
      const elapsed = Date.now() - startTime;
      playbackProgress.value = Math.min(elapsed / duration, 1);
      
      // 重绘以显示播放进度
      drawAllTrajectories();
      
      if (playbackProgress.value >= 1) {
        // 播放完成，重新开始
        playbackProgress.value = 0;
        playbackAnimationFrame.value = requestAnimationFrame(() => {
          startPlayback();
        });
      } else {
        playbackAnimationFrame.value = requestAnimationFrame(animate);
      }
    };
    
    playbackAnimationFrame.value = requestAnimationFrame(animate);
  };

  // 停止播放
  const stopPlayback = () => {
    isPlaying.value = false;
    if (playbackAnimationFrame.value) {
      cancelAnimationFrame(playbackAnimationFrame.value);
      playbackAnimationFrame.value = null;
    }
    playbackProgress.value = 0;
    playingCraneId.value = null;
    drawAllTrajectories();
  };

  // 重置路径功能
  const resetTrajectory = () => {
    if (!selectedCrane.value) {
      ElMessage.warning("请先选择起重机");
      return;
    }
    
    // 如果正在播放，先停止
    if (isPlaying.value && playingCraneId.value === selectedCrane.value.id) {
      stopPlayback();
    }
    
    // 确认对话框
    ElMessageBox.confirm(
      '确定要重置当前路径吗？这将清除所有点位数据。',
      '重置路径',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    ).then(() => {
      // 清空所有点位
      updateCranePoints(selectedCrane.value.id, []);
      
      // 重绘
      drawAllTrajectories();
      newPoint.value = createBasePoint({
        isStart: true,
        type: "lifting",
        name: getNextPointName("lifting", selectedCrane.value.points || [], true),
      });
    }).catch(() => {
      // 用户取消
    });
  };

  // 组件卸载时清理
  onBeforeUnmount(() => {
    stopPlayback();
    window.removeEventListener('resize', handleResize);
  });
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
.crane-color{
  display: inline-block;
  width: 14px;
  height: 14px;
  border-radius: 2px;
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
.trajectory-controls {
  padding: 16px;
  border-top: 1px solid #c8c8c8;
  background-color: #fafafa;
}
.property-item {
  margin-bottom: 5px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.property-item label {
  font-size: 12px;
  color: #606266;
  width: 75px;
  flex-shrink: 0;
  text-align: left;
}
.point_title {
  margin-bottom: 15px;
  color: #303133;
    font-weight: 500;
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

.point-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  cursor: grab;
  z-index: 2;
  pointer-events: all;
}

.point-canvas:active {
  cursor: grabbing;
}


.unit {
  margin-left: 8px;
  font-size: 12px;
  color: #909399;
}

.el-input-number {
  width: 120px;
}
.stub-config{
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.stub-img{ 
  background: #D9D9D9;
  width: 80px;
  height: 90px;
    display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 7px;
  margin-right: 10px;
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


/* 让弹窗紧靠着属性编辑框左侧 */
.adjacent-dialog :deep(.el-dialog__wrapper) {
  position: fixed;
  width: 400px;
  display: block;
  margin: 0;
  transform: none; /* 移除默认的居中变换 */
  z-index: 1005; /* 确保与属性面板在同一层级 */
}

.adjacent-dialog :deep(.el-dialog) {
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



:deep(.el-button--primary) {
  background-color: #1890ff;
  border-color: #1890ff;
}

/* 图片容器样式 */
.image-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  margin-right: 280px;
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
.dialog-footer{
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 6px 16px;
}
.punctuation{
  color: #FFF;
  border-radius: 3px;
background: #FF8A37;
}
/* 点位表单样式 */
.point-form {
  overflow-y: auto;
}

.radio-group {
  display: flex;
  gap: 16px;
}

.section-title {
  font-size: 14px;
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
