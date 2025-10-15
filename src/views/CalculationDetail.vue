<template>
  <div class="calculation-detail-container">
    <div class="header">
      <div class="header-left">
        <span class="project-title">XXXXXXXXX设备吊装项目方案</span>
        <el-image
          src="/src/images/hoisting.png"
          alt="edit"
          class="edit"
          :fit="'cover'"
        />
      </div>
    <el-tabs v-model="activeTab" class="calculation-tabs" @tab-change="handleTabChange">
      <el-tab-pane label="起重机校核计算" name="crane">
        <template #label>
          <div class="tab-label">
            <el-icon><Tools /></el-icon>
            起重机校核计算
          </div>
        </template>
      </el-tab-pane>
      <el-tab-pane label="吊索具校核计算" name="lifting">
        <template #label>
          <div class="tab-label">
            <el-icon><Connection /></el-icon>
            吊索具校核计算
          </div>
        </template>
      </el-tab-pane>
      <el-tab-pane label="地基承载力校核计算" name="foundation">
        <template #label>
          <div class="tab-label">
            <el-icon><Histogram /></el-icon>
            地基承载力校核计算
          </div>
        </template>
      </el-tab-pane>
    </el-tabs>
    </div>

 

    <div class="content-wrapper">
      <div class="left-panel">
        <el-scrollbar>
          <!-- 基本信息 -->
          <div class="section crane-parameters-section">
            <div class="section-title">基本信息</div>
            <div class="form-content">
              <div class="form-grid">
                <div class="form-row">
                  <label class="form-label">起重机名称</label>
                  <div class="form-input-group">
                    <el-input v-model="formData.craneName" placeholder="SCC13000TM履带起重机" />
                    <el-button type="primary" size="medium">选择</el-button>
                  </div>
                </div>           
                <div class="form-row">
                  <label class="form-label">设备名称</label>
                  <el-input v-model="formData.equipmentName" />
                </div>

                <div class="form-row">
                  <label class="form-label">生产厂家</label>
                  <el-input v-model="formData.manufacturer" />
                </div>

                <div class="form-row">
                  <label class="form-label">设备编号</label>
                  <el-input v-model="formData.equipmentNumber" />
                </div>

                <div class="form-row">
                  <label class="form-label">型号</label>
                  <el-input v-model="formData.model" />
                </div>

                <div class="form-row">
                  <label class="form-label">设备型号</label>
                  <el-input v-model="formData.equipmentType" />
                </div>
              </div>
            </div>
          </div>

          <!-- 起重机工况 -->
          <div class="section section-with-border">
            <div class="section-title">起重机工况</div>
            <div class="form-content">
              <div class="form-row">
                <label class="form-label">额定载荷PQ</label>
                <div class="input-with-unit">
                  <el-input-number v-model="formData.ratedLoad" controls-position="right" :precision="2"/>
                  <span class="unit">pq</span>
                </div>
              </div>

              <div class="form-row">
                <label class="form-label">主臂长度</label>
                <div class="input-with-unit">
                  <el-input-number v-model="formData.mainBoomLength" controls-position="right" :precision="2"/>
                  <span class="unit">m</span>
                </div>
                <label class="form-label">副臂长度</label>
                <div class="input-with-unit">
                  <el-input-number v-model="formData.auxBoomLength" controls-position="right" :precision="2"/>
                  <span class="unit">m</span>
                </div>
                <label class="form-label">作业半径<span>(r)</span></label>
                <div class="input-with-unit error">
                  <el-input-number v-model="formData.workRadius" controls-position="right" :precision="2"/>
                  <span class="unit">m</span>
                </div>
              </div>

              <div class="form-row">
                <label class="form-label">主臂角度</label>
                <div class="input-with-unit">
                  <el-input-number v-model="formData.mainBoomAngle" controls-position="right" :precision="2" />
                  <span class="unit">度</span>
                </div>
                <label class="form-label">副臂角度</label>
                <div class="input-with-unit">
                  <el-input-number v-model="formData.auxBoomAngle" controls-position="right" :precision="2"/>
                  <span class="unit">度</span>
                </div>
              </div>

              <div class="form-row">
                <label class="form-label">车体配重重量</label>
                <div class="input-with-unit">
                  <el-input-number v-model="formData.hookWeight" controls-position="right" :precision="2"/>
                  <span class="unit">t</span>
                </div>
                <label class="form-label">吊钩最大起升吊高度</label>
                <div class="input-with-unit">
                  <el-input-number v-model="formData.hookHeight" controls-position="right" :precision="2"/>
                  <span class="unit">m</span>
                </div>
              </div>

              <div class="form-row">
                <label class="form-label">超起平衡重量</label>
                <div class="input-with-unit">
                  <el-input-number v-model="formData.superLiftWeight" controls-position="right" :precision="2"/>
                  <span class="unit">t</span>
                </div>
                <label class="form-label">超起平衡回转半径</label>
                <div class="input-with-unit">
                  <el-input-number v-model="formData.superLiftRadius" controls-position="right" :precision="2"/>
                  <span class="unit">m</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 吊装计算设置 -->
          <div class="section section-with-border">
            <div class="section-title">吊装计算设置</div>
            <div class="form-content">
              <div class="form-row">
                <label class="form-label">吊装方式</label>
                <el-select v-model="formData.liftingMethod" placeholder="请选择">
                  <el-option label="单机吊装" value="single" />
                  <el-option label="双机吊装" value="double" />
                </el-select>
              </div>
            </div>
          </div>

          <!-- 重量计算设置 -->
          <div class="section section-with-border">
            <div class="section-title">重量计算设置</div>
            <div class="form-content">
              <div class="weight-table">
                <table>
                  <thead>
                    <tr>
                      <th width="60">
                        <el-checkbox />
                      </th>
                      <th width="80">序号</th>
                      <th>系数名称</th>
                      <th width="120">值</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in weightItems" :key="item.id">
                      <td>
                        <el-checkbox v-model="item.checked" />
                      </td>
                      <td>{{ item.order }}</td>
                      <td>
                        <el-input v-model="item.name" size="small" placeholder="请输入系数名称" />
                      </td>
                      <td>
                        <el-input-number v-model="item.value" :controls="false" size="small" />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div class="action-buttons">
            <el-button>重置</el-button>
            <el-button type="primary">计算结果</el-button>
            <el-button>导出</el-button>
          </div>
        </el-scrollbar>
      </div>

      <div class="right-panel">
        <div class="diagram-container">
          <img src="/src/images/cac.png" alt="起重机示意图" class="crane-diagram" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, Edit, Tools, Connection, Histogram } from '@element-plus/icons-vue'

const router = useRouter()
const activeTab = ref('crane')

const handleTabChange = (tabName) => {
  // 处理标签页切换逻辑
  console.log('切换到标签页:', tabName)
}

const formData = ref({
  craneName: 'SCC13000TM履带起重机',
  equipmentName: 'xxxxxx设备',
  manufacturer: '三一重工',
  equipmentNumber: 'xxxxxxx',
  model: 'SCC13000TM',
  equipmentType: '',
  equipmentType: 'H000000',
  ratedLoad: 12,
  mainBoomLength: 12,
  auxBoomLength: 12,
  workRadius: 12,
  mainBoomAngle: 12,
  auxBoomAngle: 12,
  hookWeight: 12,
  hookHeight: 12,
  superLiftWeight: 12,
  superLiftRadius: 12,
  liftingMethod: 'single'
})

const weightItems = ref([
  { id: 1, order: 1, name: '动载系数', value: 0.8, checked: false },
  { id: 2, order: 2, name: '偏载系数', value: 1, checked: false },
  { id: 3, order: 3, name: '其他系数', value: null, checked: false },
  { id: 4, order: 4, name: '', value: null, checked: false },
])

</script>

<style scoped>
.calculation-detail-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
}

.header {
  background: white;
  padding: 6px 24px;
 
  display: flex;
  align-items: center;
}

.header-left {
  display: flex;
  width: 30%;
  align-items: center;
  gap: 12px;
}

.project-title {
  font-size: 14px;
  color: #333;
}

/* Tabs样式 */
.calculation-tabs {
  background: white;

}

.calculation-tabs :deep(.el-tabs__header) {
  margin: 0;
}


.calculation-tabs :deep(.el-tabs__nav-scroll) {
  display: flex;
}

.calculation-tabs :deep(.el-tabs__nav) {
  display: flex;
  flex-wrap: nowrap;
}

.calculation-tabs :deep(.el-tabs__item) {
  padding: 0 24px;
  height: 50px;
  line-height: 50px;
  font-size: 14px;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.calculation-tabs :deep(.el-tabs__item:hover) {
  color: #409eff;
}

.calculation-tabs :deep(.el-tabs__item.is-active) {
  color: #409eff;
}

.tab-label {
  display: flex;
  align-items: center;
  gap: 8px;
}

.content-wrapper {
  display: flex;
  gap: 16px;
  padding: 16px;
  overflow: hidden;
}

.left-panel {
  width: 60%;
  background: white;
  border-radius: 4px;
  padding: 20px;
}

.right-panel {
  flex: 1;
  background: #BEBEBE;
  border-radius: 4px;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.section {
  margin-bottom: 24px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
  padding-bottom: 8px;

}

.form-content {
  padding: 0 12px;
}

/* 带边框的区块样式 */
.section-with-border {
  border: 1px solid #e5e5e5;
  border-radius: 4px;
  padding: 20px;
}

.form-row {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  gap: 20px;
}

.form-label {
  min-width: 130px;
  font-size: 14px;
  color: #666;
  text-align: right;
  span{
    color: red;
  }
}

.form-input-group {
  flex: 1;
  display: flex;
  gap: 8px;
}

.input-with-unit {
  display: flex;
  align-items: center;
  gap: 4px;
}

.input-with-unit.error :deep(.el-input-number) {
  border-color: #ff4d4f;
}

.unit {
  font-size: 14px;
  color: #666;
  min-width: 20px;
}

.weight-table {
  margin-top: 12px;
}

.weight-table table {
  width: 100%;
  border-collapse: collapse;
}

.weight-table th,
.weight-table td {
  padding: 8px;
  text-align: center;
  border: 1px solid #e5e5e5;
  font-size: 14px;
}

.weight-table th {
  background: #fafafa;
  font-weight: 600;
  color: #333;
}

.weight-table td {
  color: #666;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #e5e5e5;
}

.diagram-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.crane-diagram {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.edit {
  width: 16px;
  height: 16px;
}

:deep(.el-input-number) {
  width: 100px;
}

:deep(.el-input-number .el-input__inner) {
  text-align: left;
}

:deep(.el-select) {
  width: 200px;
}

/* 起重机参数部分样式 - 添加边框并实现每行2列布局 */
.crane-parameters-section {
  border: 1px solid #e5e5e5;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 24px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-grid .form-row {
  margin-bottom: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.form-grid .form-label {
  margin-bottom: 0;
  margin-right: 12px;
  text-align: right;
  min-width: 120px;
}

.form-grid .form-input-group,
.form-grid .el-input {
  width: 100%;
  flex: 1;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .form-grid .form-row {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .form-grid .form-label {
    margin-bottom: 8px;
    text-align: left;
  }
}
</style>