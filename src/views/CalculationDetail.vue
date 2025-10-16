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
      <el-tabs
        v-model="activeTab"
        class="calculation-tabs"
        @tab-change="handleTabChange"
      >
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
          <!-- 起重机参数Tabs -->
          <el-tabs v-model="craneParamsTab" type="card">
            <el-tab-pane label="起重机参数1" name="crane1">
              <!-- 基本信息 -->
              <div class="section crane-parameters-section">
                <div class="section-title">基本信息</div>
                <div class="form-content">
                  <div class="form-grid">
                    <div class="form-row">
                      <label class="form-label">起重机名称</label>
                      <div class="form-input-group">
                        <el-input
                          v-model="formData.craneName"
                          placeholder="SCC13000TM履带起重机"
                        />
                        <el-button type="primary" size="medium">选择</el-button>
                      </div>
                    </div>
                    <div class="form-row">
                      <label class="form-label">设备名称</label>
                      <el-input v-model="formData.equipmentName" disabled/>
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
                      <el-input-number
                        v-model="formData.ratedLoad"
                        controls-position="right"
                        :precision="2"
                      />
                      <span class="unit">pq</span>
                    </div>
                  </div>

                  <div class="form-row">
                    <label class="form-label">主臂长度</label>
                    <div class="input-with-unit">
                      <el-input-number
                        v-model="formData.mainBoomLength"
                        controls-position="right"
                        :precision="2"
                      />
                      <span class="unit">m</span>
                    </div>
                    <label class="form-label">副臂长度</label>
                    <div class="input-with-unit">
                      <el-input-number
                        v-model="formData.auxBoomLength"
                        controls-position="right"
                        :precision="2"
                      />
                      <span class="unit">m</span>
                    </div>
                    <label class="form-label">作业半径<span>(r)</span></label>
                    <div class="input-with-unit error">
                      <el-input-number
                        v-model="formData.workRadius"
                        controls-position="right"
                        :precision="2"
                      />
                      <span class="unit">m</span>
                    </div>
                  </div>

                  <div class="form-row">
                    <label class="form-label">主臂角度</label>
                    <div class="input-with-unit">
                      <el-input-number
                        v-model="formData.mainBoomAngle"
                        controls-position="right"
                        :precision="2"
                      />
                      <span class="unit">度</span>
                    </div>
                    <label class="form-label">副臂角度</label>
                    <div class="input-with-unit">
                      <el-input-number
                        v-model="formData.auxBoomAngle"
                        controls-position="right"
                        :precision="2"
                      />
                      <span class="unit">度</span>
                    </div>
                  </div>

                  <div class="form-row">
                    <label class="form-label">车体配重重量</label>
                    <div class="input-with-unit">
                      <el-input-number
                        v-model="formData.hookWeight"
                        controls-position="right"
                        :precision="2"
                      />
                      <span class="unit">t</span>
                    </div>
                    <label class="form-label">吊钩最大起升吊高度</label>
                    <div class="input-with-unit">
                      <el-input-number
                        v-model="formData.hookHeight"
                        controls-position="right"
                        :precision="2"
                      />
                      <span class="unit">m</span>
                    </div>
                  </div>

                  <div class="form-row">
                    <label class="form-label">超起平衡重量</label>
                    <div class="input-with-unit">
                      <el-input-number
                        v-model="formData.superLiftWeight"
                        controls-position="right"
                        :precision="2"
                      />
                      <span class="unit">t</span>
                    </div>
                    <label class="form-label">超起平衡回转半径</label>
                    <div class="input-with-unit">
                      <el-input-number
                        v-model="formData.superLiftRadius"
                        controls-position="right"
                        :precision="2"
                      />
                      <span class="unit">m</span>
                    </div>
                  </div>
                </div>
              </div>
            </el-tab-pane>
            
            <!-- 使用条件渲染替代v-show来确保tab内容正确显示 -->
            <el-tab-pane 
              v-if="formData.liftingMethod === 'double'" 
              label="起重机参数2" 
              name="crane2"
              lazy
            >
              <!-- 基本信息 -->
              <div class="section crane-parameters-section">
                <div class="section-title">基本信息</div>
                <div class="form-content">
                  <div class="form-grid">
                    <div class="form-row">
                      <label class="form-label">起重机名称</label>
                      <div class="form-input-group">
                        <el-input
                          v-model="formData.craneName2"
                          placeholder="SCC13000TM履带起重机"
                        />
                        <el-button type="primary" size="medium">选择</el-button>
                      </div>
                    </div>
                    <div class="form-row">
                      <label class="form-label">设备名称</label>
                      <el-input v-model="formData.equipmentName2" disabled/>
                    </div>

                    <div class="form-row">
                      <label class="form-label">生产厂家</label>
                      <el-input v-model="formData.manufacturer2" />
                    </div>

                    <div class="form-row">
                      <label class="form-label">设备编号</label>
                      <el-input v-model="formData.equipmentNumber2" />
                    </div>

                    <div class="form-row">
                      <label class="form-label">型号</label>
                      <el-input v-model="formData.model2" />
                    </div>

                    <div class="form-row">
                      <label class="form-label">设备型号</label>
                      <el-input v-model="formData.equipmentType2" />
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
                      <el-input-number
                        v-model="formData.ratedLoad2"
                        controls-position="right"
                        :precision="2"
                      />
                      <span class="unit">pq</span>
                    </div>
                  </div>

                  <div class="form-row">
                    <label class="form-label">主臂长度</label>
                    <div class="input-with-unit">
                      <el-input-number
                        v-model="formData.mainBoomLength2"
                        controls-position="right"
                        :precision="2"
                      />
                      <span class="unit">m</span>
                    </div>
                    <label class="form-label">副臂长度</label>
                    <div class="input-with-unit">
                      <el-input-number
                        v-model="formData.auxBoomLength2"
                        controls-position="right"
                        :precision="2"
                      />
                      <span class="unit">m</span>
                    </div>
                    <label class="form-label">作业半径<span>(r)</span></label>
                    <div class="input-with-unit error">
                      <el-input-number
                        v-model="formData.workRadius2"
                        controls-position="right"
                        :precision="2"
                      />
                      <span class="unit">m</span>
                    </div>
                  </div>

                  <div class="form-row">
                    <label class="form-label">主臂角度</label>
                    <div class="input-with-unit">
                      <el-input-number
                        v-model="formData.mainBoomAngle2"
                        controls-position="right"
                        :precision="2"
                      />
                      <span class="unit">度</span>
                    </div>
                    <label class="form-label">副臂角度</label>
                    <div class="input-with-unit">
                      <el-input-number
                        v-model="formData.auxBoomAngle2"
                        controls-position="right"
                        :precision="2"
                      />
                      <span class="unit">度</span>
                    </div>
                  </div>

                  <div class="form-row">
                    <label class="form-label">车体配重重量</label>
                    <div class="input-with-unit">
                      <el-input-number
                        v-model="formData.hookWeight2"
                        controls-position="right"
                        :precision="2"
                      />
                      <span class="unit">t</span>
                    </div>
                    <label class="form-label">吊钩最大起升吊高度</label>
                    <div class="input-with-unit">
                      <el-input-number
                        v-model="formData.hookHeight2"
                        controls-position="right"
                        :precision="2"
                      />
                      <span class="unit">m</span>
                    </div>
                  </div>

                  <div class="form-row">
                    <label class="form-label">超起平衡重量</label>
                    <div class="input-with-unit">
                      <el-input-number
                        v-model="formData.superLiftWeight2"
                        controls-position="right"
                        :precision="2"
                      />
                      <span class="unit">t</span>
                    </div>
                    <label class="form-label">超起平衡回转半径</label>
                    <div class="input-with-unit">
                      <el-input-number
                        v-model="formData.superLiftRadius2"
                        controls-position="right"
                        :precision="2"
                      />
                      <span class="unit">m</span>
                    </div>
                  </div>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>

          <!-- 吊装计算设置 -->
          <div class="section section-with-border">
            <div class="section-title">吊装计算设置</div>
            <div class="form-content">
              <div class="form-row">
                <label class="form-label">吊装方式</label>
                <el-select
                  v-model="formData.liftingMethod"
                  placeholder="请选择"
                >
                  <el-option label="单机吊装" value="single" />
                  <el-option label="双机吊装" value="double" />
                </el-select>
              </div>

              <!-- 双机吊装参数，仅在选择双机吊装时显示 -->
              <div
                v-if="formData.liftingMethod === 'double'"
                class="double-crane-params"
              >
                <div class="form-row">
                  <label class="form-label error"
                    >起重机1吊点至设备重心距离<span>L1</span></label
                  >
                  <div class="input-with-unit">
                    <el-input-number
                      v-model="formData.crane1Distance"
                      controls-position="right"
                      :precision="2"
                    />
                    <span class="unit">m</span>
                  </div>
                  <label class="form-label error">起重机1承担重量</label>
                  <div class="input-with-unit">
                    <el-input-number
                      v-model="formData.crane1Weight"
                      controls-position="right"
                      :precision="2"
                    />
                    <span class="unit">t</span>
                  </div>
                </div>
                <div class="form-row">
                  <label class="form-label error"
                    >起重机2吊点至设备重心距离<span>L2</span></label
                  >
                  <div class="input-with-unit">
                    <el-input-number
                      v-model="formData.crane2Distance"
                      controls-position="right"
                      :precision="2"
                    />
                    <span class="unit">m</span>
                  </div>
                  <label class="form-label error">起重机2承担重量</label>
                  <div class="input-with-unit">
                    <el-input-number
                      v-model="formData.crane2Weight"
                      controls-position="right"
                      :precision="2"
                    />
                    <span class="unit">t</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 重量计算设置 -->
          <div class="section section-with-border">
            <div class="section-title">重量计算设置</div>
            <div class="form-content">
              <div class="weight-calculation-layout">
                <!-- 左侧重量参数 -->
                <div class="weight-parameters">
                  <div class="form-row weight-set">
                    <el-checkbox v-model="formData.isEquipmentWeightChecked" />
                    <label class="form-label">设备重量<span>(G)</span></label>
                    <div class="input-with-unit">
                      <el-input-number
                        v-model="formData.equipmentWeight"
                        controls-position="right"
                        :precision="2"
                      />
                      <span class="unit">t</span>
                    </div>
                  </div>
                  <div class="form-row weight-set">
                    <el-checkbox v-model="formData.isHookWeightChecked" />
                    <label class="form-label">吊钩重量<span>(G1)</span></label>
                    <div class="input-with-unit">
                      <el-input-number
                        v-model="formData.hookWeightG1"
                        controls-position="right"
                        :precision="2"
                      />
                      <span class="unit">t</span>
                    </div>
                  </div>
                  <div class="form-row weight-set">
                    <el-checkbox v-model="formData.isWireRopeWeightChecked" />
                    <label class="form-label"
                      >计算钢丝绳重量<span>(G2)</span></label
                    >
                    <div class="input-with-unit">
                      <el-input-number
                        v-model="formData.wireRopeWeightG2"
                        controls-position="right"
                        :precision="2"
                      />
                      <span class="unit">t</span>
                    </div>
                  </div>
                  <div class="form-row weight-set">
                    <el-checkbox v-model="formData.isSlingsWeightChecked" />
                    <label class="form-label"
                      >吊索具重量<span>(G3)</span></label
                    >
                    <div class="input-with-unit">
                      <el-input-number
                        v-model="formData.slingsWeightG3"
                        controls-position="right"
                        :precision="2"
                      />
                      <span class="unit">t</span>
                    </div>
                  </div>
                  <div class="form-row weight-set">
                    <el-checkbox v-model="formData.isOtherWeightChecked" />
                    <label class="form-label"
                      >其它计算重量<span>(G4)</span></label
                    >
                    <div class="input-with-unit">
                      <el-input-number
                        v-model="formData.otherWeightG4"
                        controls-position="right"
                        :precision="2"
                      />
                      <span class="unit">t</span>
                    </div>
                  </div>
                </div>

                <!-- 右侧系数表 -->
                <div class="weight-table">
                  <table>
                    <thead>
                      <tr>
                        <th width="60">
                          勾选
                        </th>
                        <th width="80">序号</th>
                        <th>系数名称</th>
                        <th width="120">值</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(item, index) in weightItems" :key="item.id">
                        <td>
                          <el-checkbox v-model="item.checked" />
                        </td>
                        <td>{{ item.order }}</td>
                        <td>
                          <el-input
                            v-model="item.name"
                            size="small"
                            placeholder="请输入系数名称"
                            @input="handleInputChange(index)"
                          />
                        </td>
                        <td>
                          <el-input-number
                            v-model="item.value"
                            :controls="false"
                            size="small"
                            @change="handleInputChange(index)"
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <div class="action-buttons">
            <el-button>重置</el-button>
            <el-button type="primary" @click="showCalculationResult">计算结果</el-button>
            <el-button>导出</el-button>
          </div>
        </el-scrollbar>
      </div>

      <div class="right-panel">
        <div class="diagram-container">
          <img
            :src="formData.liftingMethod === 'double' ? '/src/images/machine.png' : '/src/images/cac.png'"
            alt="起重机示意图"
            class="crane-diagram"
          />
        </div>
      </div>
    </div>
  </div>

  <!-- 单机吊装计算结果弹窗 -->
  <el-dialog
    v-model="singleCraneDialogVisible"
    title="计算结果"
    width="700px"
    append-to-body
  >
    <div class="calculation-result">
      <h3>xxxxxx方案项目起重机校核计算</h3>
      
      <div class="result-section">
        <div class="section-title">项目吊装方式:{{ singleResult.liftingMethod }}</div>
      </div>
      
      <div class="result-section">
        <div class="section-title">起重机选择</div>
        <div class="section-content">
          <div class="equipment-info">
            <div class="info-item">起重机：{{ singleResult.craneName }}</div>
            <div class="info-item">规格型号：主臂长度{{ formData.mainBoomLength }}m、副臂长度{{ formData.auxBoomLength }}m、主臂角度{{ formData.mainBoomAngle }}°、副臂角度{{ formData.auxBoomAngle }}°、吊钩最大起升高度xxx</div>
            <div class="info-item">破断拉力：{{ formData.ratedLoad }}t</div>
          </div>
        </div>
      </div>
      
      <div class="result-section">
        <div class="section-title">设备选择</div>
        <div class="section-content">
          <div class="info-item">设备：{{ singleResult.equipmentName }}</div>
          <div class="info-item">重量：{{ singleResult.totalWeight }} t</div>
        </div>
      </div>
      
      <div class="result-section">
        <div class="section-title">其它参数</div>
        <div class="section-content">{{ singleResult.otherParams }}</div>
      </div>
      
      <div class="result-section">
        <div class="section-title">计算过程</div>
        <div class="section-content calculation-process">
          <div class="process-text">已知单台计算机吊装公式为：</div>
          <div class="process-text">
            设备重量G+吊钩重量G1+计算钢丝绳重量G2+吊索具重量G3+其他计算重量G4）
            <template v-for="(factor, index) in singleResult.selectedFactors" :key="index">
              ×{{ factor.name }}
            </template>
            】/起重机额定载荷PQ×100%&lt;100%
          </div>
          
          <div class="formula">
            <div class="formula-fraction">
              <div class="formula-numerator">
                (G+G1+G2+G3+G4)
                <template v-for="(factor, index) in singleResult.selectedFactors" :key="index">
                  ×X{{ index + 1 }}
                </template>
              </div>
              <div class="formula-denominator">
                起重机额定载荷PQ
              </div>
            </div>
            <div class="formula-operator">× 100% &lt; 100%</div>
          </div>
          
          <div class="weight-details">
          <div class="weight-item">G：设备重量={{ singleResult.equipmentWeight }}t</div>
          <div class="weight-item">G1：吊钩重量={{ singleResult.hookWeight }}t</div>
          <div class="weight-item">G2：计算钢丝绳重量={{ singleResult.wireRopeWeight }}t</div>
          <div class="weight-item">G3：吊索具重量={{ singleResult.slingsWeight }}t</div>
          <div class="weight-item">G4：其他计算重量={{ singleResult.otherWeight }}t</div>
          <!-- 动态显示选中的系数，按照X1, X2, X3...的顺序 -->
          <div v-for="(factor, index) in singleResult.selectedFactors" :key="index" class="weight-item">
            X{{ index + 1 }}：{{ factor.name }}={{ factor.value }}
          </div>
        </div>
      </div>
    </div>
    
    <div class="result-section result-final">
      <div class="section-title"><div>计算结果：{{ singleResult.calculationResult }}%</div>
      <div>
        <span :class="{ 'qualified': singleResult.isQualified, 'unqualified': !singleResult.isQualified }">
          <template v-if="parseFloat(singleResult.calculationResult) &lt; 100">&lt;100% {{ singleResult.isQualified ? '(合格)' : '(不合格)' }}</template>
          <template v-else-if="parseFloat(singleResult.calculationResult) === 100">=100% (不合格)</template>
          <template v-else>&gt;100% (不合格)</template>
        </span>
      </div>
      </div>
    </div>
    
    <div class="result-section">
      <div class="section-content conclusion">
        <template v-if="singleResult.isQualified">
          起重机校核计算结果为{{ singleResult.calculationResult }}%，小于100%，故满足要求。
        </template>
        <template v-else>
          起重机校核计算结果为{{ singleResult.calculationResult }}%，大于100%，故不满足要求。
        </template>
      </div>
    </div>
  </div>
  
  <template #footer>
    <span class="dialog-footer">
      <el-button @click="singleCraneDialogVisible = false">关闭</el-button>
    </span>
  </template>
</el-dialog>

  <!-- 双机吊装计算结果弹窗 -->
  <el-dialog
    v-model="doubleCraneDialogVisible"
    title="计算结果"
    width="700px"
    append-to-body
  >
    <div class="calculation-result">
      <h3>xxxxxx方案项目起重机校核计算</h3>
      
      <div class="result-section">
        <div class="section-title">项目吊装方式:{{ doubleResult.liftingMethod }}</div>
      </div>
      
      <div class="result-section">
        <div class="section-title">起重机1选择</div>
        <div class="section-content">
          <div class="equipment-info">
            <div class="info-item">起重机：{{ doubleResult.craneName1 }}</div>
            <div class="info-item">规格型号：主臂长度{{ formData.mainBoomLength }}m、副臂长度{{ formData.auxBoomLength }}m、主臂角度{{ formData.mainBoomAngle }}°、副臂角度{{ formData.auxBoomAngle }}°、吊钩最大起升高度xxx</div>
            <div class="info-item">破断拉力：{{ formData.ratedLoad }}t</div>
          </div>
        </div>
      </div>
      
      <div class="result-section">
        <div class="section-title">起重机2选择</div>
        <div class="section-content">
          <div class="equipment-info">
            <div class="info-item">起重机：{{ doubleResult.craneName2 }}</div>
            <div class="info-item">规格型号：主臂长度{{ formData.mainBoomLength2 }}m、副臂长度{{ formData.auxBoomLength2 }}m、主臂角度{{ formData.mainBoomAngle2 }}°、副臂角度{{ formData.auxBoomAngle2 }}°、吊钩最大起升高度xxx</div>
            <div class="info-item">破断拉力：{{ formData.ratedLoad2 }}t</div>
          </div>
        </div>
      </div>
      
      <div class="result-section">
        <div class="section-title">设备选择</div>
        <div class="section-content">
          <div class="info-item">设备：{{ doubleResult.equipmentName }}</div>
          <div class="info-item">重量：{{ doubleResult.totalWeight }} t</div>
        </div>
      </div>
      
      <div class="result-section">
        <div class="section-title">其它参数</div>
        <div class="section-content">{{ doubleResult.otherParams }}</div>
      </div>
      
      <div class="result-section">
        <div class="section-title">计算过程</div>
        <div class="section-content calculation-process">
          <div class="process-text">已知两台起重机吊装公式为：</div>
          <div class="process-text">
            （单台起重机所承担最大设备重量G0+吊钩重量G1+计算钢丝绳重量G2+吊索具重量G3+其他计算重量G4）
            <template v-for="(factor, index) in doubleResult.selectedFactors" :key="index">
              ×{{ factor.name }}
            </template>
            】/单台起重机额定载荷PQ×100%&lt;75%
          </div>
          
          <div class="formula">
            <div class="formula-fraction">
              <div class="formula-numerator">
                (G+G1+G2+G3+G4)
                <template v-for="(factor, index) in doubleResult.selectedFactors" :key="index">
                  ×X{{ index + 1 }}
                </template>
              </div>
              <div class="formula-denominator">
                起重机额定载荷PQ
              </div>
            </div>
            <div class="formula-operator">× 100% &lt; 75%</div>
          </div>
          
          <div class="weight-details">
            <div class="weight-item">G：设备重量={{ doubleResult.equipmentWeight }}t</div>
            <div class="weight-item">G1：吊钩重量={{ doubleResult.hookWeight }}t</div>
            <div class="weight-item">G2：计算钢丝绳重量={{ doubleResult.wireRopeWeight }}t</div>
            <div class="weight-item">G3：吊索具重量={{ doubleResult.slingsWeight }}t</div>
            <div class="weight-item">G4：其他计算重量={{ doubleResult.otherWeight }}t</div>      
            <!-- 动态显示选中的系数，按照X1, X2, X3...的顺序 -->
            <div v-for="(factor, index) in doubleResult.selectedFactors" :key="index" class="weight-item">
              X{{ index + 1 }}：{{ factor.name }}={{ factor.value }}
            </div>
          </div>
        </div>
      </div>
      
      <div class="result-section result-final">
        <div class="section-title">起重机1计算结果：{{ doubleResult.calculationResult1 }}%</div>
        <div class="section-content final-result">
          <span :class="{ 'qualified': doubleResult.isQualified1, 'unqualified': !doubleResult.isQualified1 }">
            <template v-if="parseFloat(doubleResult.calculationResult1) &lt; 75">&lt;75% (合格)</template>
            <template v-else-if="parseFloat(doubleResult.calculationResult1) === 75">=75% (不合格)</template>
            <template v-else>&gt;75% (不合格)</template>
          </span>
        </div>
      </div>
      
      <div class="result-section result-final">
        <div class="section-title">起重机2计算结果：{{ doubleResult.calculationResult2 }}%</div>
        <div class="section-content final-result">
          <span :class="{ 'qualified': doubleResult.isQualified2, 'unqualified': !doubleResult.isQualified2 }">
            <template v-if="parseFloat(doubleResult.calculationResult2) &lt; 75">&lt;75% (合格)</template>
            <template v-else-if="parseFloat(doubleResult.calculationResult2) === 75">=75% (不合格)</template>
            <template v-else>&gt;75% (不合格)</template>
          </span>
        </div>
      </div>
      
      <div class="result-section">
        <div class="section-content conclusion">
          <template v-if="doubleResult.isQualified1 && doubleResult.isQualified2">
            起重机1校核计算结果为{{ doubleResult.calculationResult1 }}%，小于75%；起重机2校核计算结果为{{ doubleResult.calculationResult2 }}%，小于75%；故满足要求。
          </template>
          <template v-else>
            起重机1校核计算结果为{{ doubleResult.calculationResult1 }}%，起重机2校核计算结果为{{ doubleResult.calculationResult2 }}%，其中至少有一个大于等于75%，故不满足要求。
          </template>
        </div>
      </div>
    </div>
    
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="doubleCraneDialogVisible = false">关闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, Edit, Tools, Connection, Histogram } from '@element-plus/icons-vue'

const router = useRouter()
const activeTab = ref('crane')
const craneParamsTab = ref('crane1') // 起重机参数tab页默认选中第一个

const handleTabChange = (tabName) => {
  // 处理标签页切换逻辑
  console.log('切换到标签页:', tabName)
}

const formData = ref({
  // 起重机1参数
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
  
  // 起重机2参数
  craneName2: '',
  equipmentName2: '',
  manufacturer2: '',
  equipmentNumber2: '',
  model2: '',
  equipmentType2: '',
  ratedLoad2: 12,
  mainBoomLength2: 12,
  auxBoomLength2: 12,
  workRadius2: 12,
  mainBoomAngle2: 12,
  auxBoomAngle2: 12,
  hookWeight2: 12,
  hookHeight2: 12,
  superLiftWeight2: 12,
  superLiftRadius2: 12,
  
  // 吊装计算设置
  liftingMethod: 'single',
  crane1Distance: 0,
  crane1Weight: 0,
  crane2Distance: 0,
  crane2Weight: 0,
  
  // 重量计算设置 - 左侧重量参数
  isEquipmentWeightChecked: false,
  equipmentWeight: 0,
  isHookWeightChecked: false,
  hookWeightG1: 0,
  isWireRopeWeightChecked: false,
  wireRopeWeightG2: 0,
  isSlingsWeightChecked: false,
  slingsWeightG3: 0,
  isOtherWeightChecked: false,
  otherWeightG4: 0
})

const weightItems = ref([
  { id: 1, order: 1, name: '动载系数', value: 0.8, checked: false },
  { id: 2, order: 2, name: '偏载系数', value: 1, checked: false },
  { id: 3, order: 3, name: '其他系数', value: 1, checked: false },
  { id: 4, order: 4, name: '', value: null, checked: false },
])

// 添加新行的函数
const addNewRow = () => {
  const newId = weightItems.value.length > 0 ? Math.max(...weightItems.value.map(item => item.id)) + 1 : 1
  weightItems.value.push({
    id: newId,
    order: weightItems.value.length + 1,
    name: '',
    value: null,
    checked: false
  })
}

// 处理输入变化的函数
const handleInputChange = (index) => {
  // 如果是最后一行，并且该行已经有内容，则添加新行
  if (index === weightItems.value.length - 1) {
    const currentItem = weightItems.value[index]
    if ((currentItem.name && currentItem.name.trim() !== '') || 
        (currentItem.value !== null && currentItem.value !== undefined && currentItem.value !== '')) {
      addNewRow()
    }
  }
}

// 弹窗可见性状态
const singleCraneDialogVisible = ref(false)
const doubleCraneDialogVisible = ref(false)

// 单机吊装计算结果数据
const singleResult = ref({
  liftingMethod: '单机吊装',
  craneName: '',
  equipmentName: '',
  totalWeight: 0,
  otherParams: '',
  hookWeight: 0,
  wireRopeWeight: 0,
  slingsWeight: 0,
  otherWeight: 0,
  equipmentWeight: 0,
  dynamicFactor: 0,
  offsetFactor: 0,
  calculationResult: 0,
  isQualified: false
})

// 双机吊装计算结果数据
const doubleResult = ref({
  liftingMethod: '双机吊装',
  craneName1: '',
  craneName2: '',
  equipmentName: '',
  totalWeight: 0,
  otherParams: '',
  hookWeight: 0,
  wireRopeWeight: 0,
  slingsWeight: 0,
  otherWeight: 0,
  equipmentWeight: 65, // 默认取65
  dynamicFactor: 0,
  offsetFactor: 0,
  calculationResult1: 0,
  calculationResult2: 0,
  isQualified1: false,
  isQualified2: false
})

// 显示计算结果弹窗
const showCalculationResult = () => {
  // 收集选中的重量参数
  let equipmentWeight = formData.value.isEquipmentWeightChecked ? formData.value.equipmentWeight : 0
  let hookWeightG1 = formData.value.isHookWeightChecked ? formData.value.hookWeightG1 : 0
  let wireRopeWeightG2 = formData.value.isWireRopeWeightChecked ? formData.value.wireRopeWeightG2 : 0
  let slingsWeightG3 = formData.value.isSlingsWeightChecked ? formData.value.slingsWeightG3 : 0
  let otherWeightG4 = formData.value.isOtherWeightChecked ? formData.value.otherWeightG4 : 0
  
  // 获取选中的系数项
  const selectedFactors = weightItems.value.filter(item => item.checked && item.name && item.value !== null)
  
  // 计算系数乘积
  let factorProduct = 1
  selectedFactors.forEach(factor => {
    factorProduct *= factor.value
  })
  
  // 计算总重量
  const totalWeight = equipmentWeight + hookWeightG1 + wireRopeWeightG2 + slingsWeightG3 + otherWeightG4
  
  // 根据吊装方式显示不同的弹窗
  if (formData.value.liftingMethod === 'single') {
    // 单机吊装计算
    const calculationResult = ((equipmentWeight + hookWeightG1 + wireRopeWeightG2 + slingsWeightG3 + otherWeightG4) * 
                              factorProduct / formData.value.ratedLoad * 100)
    
    // 构建选中的系数显示字符串
    let factorDisplay = ''
    selectedFactors.forEach((factor, index) => {
      const factorName = String.fromCharCode(88 + index + 1) // X1, X2, X3...
      factorDisplay += `${factorName}：${factor.name}=${factor.value.toFixed(2)} `
    })
    
    // 填充单机吊装结果数据
    singleResult.value = {
      liftingMethod: '单机吊装',
      craneName: formData.value.craneName,
      equipmentName: formData.value.equipmentName,
      totalWeight: totalWeight.toFixed(2),
      otherParams: `吊钩重量${hookWeightG1.toFixed(2)}t、计算钢丝绳重量${wireRopeWeightG2.toFixed(2)}t、吊索具重量${slingsWeightG3.toFixed(2)}t、其他计算重量${otherWeightG4.toFixed(2)}t`,
      hookWeight: hookWeightG1.toFixed(2),
      wireRopeWeight: wireRopeWeightG2.toFixed(2),
      slingsWeight: slingsWeightG3.toFixed(2),
      otherWeight: otherWeightG4.toFixed(2),
      equipmentWeight: equipmentWeight.toFixed(2),
      factorDisplay: factorDisplay.trim(),
      factorProduct: factorProduct,
      calculationResult: calculationResult.toFixed(2),
      isQualified: calculationResult < 100, // 修改合格判断逻辑，等于100%时不满足要求
      selectedFactors: selectedFactors
    }
    
    singleCraneDialogVisible.value = true
  } else {
    // 双机吊装计算，G0默认为65
    const G0 = 65
    const calculationResult1 = ((G0 + hookWeightG1 + wireRopeWeightG2 + slingsWeightG3 + otherWeightG4) * 
                               factorProduct / formData.value.ratedLoad * 100)
    const calculationResult2 = ((G0 + hookWeightG1 + wireRopeWeightG2 + slingsWeightG3 + otherWeightG4) * 
                               factorProduct / formData.value.ratedLoad2 * 100)
    
    // 构建选中的系数显示字符串
    let factorDisplay = ''
    selectedFactors.forEach((factor, index) => {
      const factorName = String.fromCharCode(88 + index + 1) // X1, X2, X3...
      factorDisplay += `${factorName}：${factor.name}=${factor.value.toFixed(2)} `
    })
    
    // 填充双机吊装结果数据
    doubleResult.value = {
      liftingMethod: '双机吊装',
      craneName1: formData.value.craneName || '起重机1',
      craneName2: formData.value.craneName2 || '起重机2',
      equipmentName: formData.value.equipmentName,
      totalWeight: totalWeight.toFixed(2),
      otherParams: `吊钩重量${hookWeightG1.toFixed(2)}t、计算钢丝绳重量${wireRopeWeightG2.toFixed(2)}t、吊索具重量${slingsWeightG3.toFixed(2)}t、其他计算重量${otherWeightG4.toFixed(2)}t`,
      hookWeight: hookWeightG1.toFixed(2),
      wireRopeWeight: wireRopeWeightG2.toFixed(2),
      slingsWeight: slingsWeightG3.toFixed(2),
      otherWeight: otherWeightG4.toFixed(2),
      equipmentWeight: equipmentWeight.toFixed(2), 
      factorDisplay: factorDisplay.trim(),
      factorProduct: factorProduct,
      calculationResult1: calculationResult1.toFixed(2),
      calculationResult2: calculationResult2.toFixed(2),
      isQualified1: calculationResult1 < 75, // 修改合格判断逻辑，等于75%时不满足要求
      isQualified2: calculationResult2 < 75, // 修改合格判断逻辑，等于75%时不满足要求
      selectedFactors: selectedFactors
    }
    
    doubleCraneDialogVisible.value = true
  }
}
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
  background: #bebebe;
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

.form-row .form-label {
  min-width: 130px;
  font-size: 14px;
  color: #666;
  text-align: right;
}
.weight-set {
  justify-content: space-around;
}

.weight-set .form-label {
  text-align: left;
  width: 30px;
}
.form-label span {
  color: red;
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

.weight-calculation-layout {
  display: flex;
  gap: 20px;
}

.weight-parameters {
  width: 40%;
  border: 1px solid #e5e5e5;
  border-radius: 4px;
  padding: 16px;
  background: #fafafa;
}

.weight-parameters .form-row {
  margin-bottom: 12px;
  gap: 12px;
}

.weight-parameters .form-row:last-child {
  margin-bottom: 0;
}

.weight-parameters .form-label {
  min-width: 150px;
}

.weight-table {
  flex: 1;
  margin-top: 0;
}

.weight-table table {
  width: 100%;
  border-collapse: collapse;
}

/* 计算结果弹窗样式 */
.calculation-result {
  font-size: 14px;
}

.calculation-result h3 {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

.result-section {
  margin-bottom: 16px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}

.result-section .section-title {
   background-color: #FFEEBF;
  padding: 8px 12px;
  font-weight: bold;
  color: #666;
}

.result-section .section-content {
  padding: 12px;
}

.equipment-info .info-item {
  margin-bottom: 6px;
}

.equipment-info .info-item:last-child {
  margin-bottom: 0;
}

.calculation-process .process-text {
  margin-bottom: 12px;
  line-height: 1.6;
}

.formula {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px 0;
  gap: 10px;
}

.formula-fraction {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.formula-numerator {
  padding: 10px;
  border-bottom: 2px solid #333;
  text-align: center;
}

.formula-denominator {
  padding: 10px;

  text-align: center;
}

.formula-operator {
  font-size: 16px;
  font-weight: bold;
}

.weight-details {
  margin-top: 20px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.weight-item {
  padding: 4px 0;
}

.result-final {
  margin-top: 20px;
}

.result-final .section-title {
  background-color: #FFEEBF;
  font-weight: bold;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.final-result {
  font-size: 16px;
  font-weight: bold;
}

.qualified {
  color: #67c23a;
}

.unqualified {
  color: #f56c6c;
}

.conclusion {
  line-height: 1.6;
  color: #333;
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
/* 起重机参数Tabs样式 */
:deep(.el-tabs--card > .el-tabs__header .el-tabs__item.is-active) {
  display: flex;
  align-items: center;
  background-color: #0775DB;
  color: white;
}
</style>