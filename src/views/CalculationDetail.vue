<template>
  <div class="calculation-detail-container">
    <div class="header">
      <div class="header-left" @click="openEditTitleDialog">
        <span class="project-title">{{ projectTitle }}</span>
        <img src="@/images/hoisting.png" alt="edit" class="edit" />
      </div>
      <el-tabs
        v-model="activeTab"
        class="calculation-tabs"
        @tab-change="handleTabChange"
      >
        <el-tab-pane label="起重机校核计算" name="crane">
          <template #label>
            <div class="tab-label">
              <img
                style="width: 22px; height: 22px"
                v-if="activeTab === 'crane'"
                src="@/images/active_crane.png"
                alt=""
                :fit="'cover'"
              />
              <img
                v-else
                style="width: 22px; height: 22px"
                src="@/images/crane.png"
                alt=""
                :fit="'cover'"
              />
              起重机校核计算
            </div>
          </template>
        </el-tab-pane>
        <el-tab-pane label="吊索具校核计算" name="lifting">
          <template #label>
            <div class="tab-label">
              <img
                style="width: 22px; height: 22px"
                v-if="activeTab === 'lifting'"
                src="@/images/active_slings.png"
                alt=""
                :fit="'cover'"
              />
              <img
                v-else
                style="width: 22px; height: 22px"
                src="@/images/slings.png"
                alt=""
                :fit="'cover'"
              />
              吊索具校核计算
            </div>
          </template>
        </el-tab-pane>
        <el-tab-pane label="地基承载力校核计算" name="foundation">
          <template #label>
            <div class="tab-label">
              <img
                style="width: 22px; height: 22px"
                v-if="activeTab === 'foundation'"
                src="@/images/active_base.png"
                alt=""
                :fit="'cover'"
              />
              <img
                v-else
                style="width: 22px; height: 22px"
                src="@/images/base.png"
                alt=""
                :fit="'cover'"
              />

              地基承载力校核计算
            </div>
          </template>
        </el-tab-pane>
        <!-- Added new tab for construction plan and elevation drawing -->
        <el-tab-pane label="施工平立面图" name="construction">
          <template #label>
            <div class="tab-label">
              <img
                style="width: 22px; height: 22px"
                v-if="activeTab === 'construction'"
                src="@/images/active_drawing.png"
                alt=""
                :fit="'cover'"
              />
              <img
                v-else
                style="width: 22px; height: 22px"
                src="@/images/drawing.png"
                alt=""
                :fit="'cover'"
              />
              施工平立面图
            </div>
          </template>
        </el-tab-pane>
      </el-tabs>
      <el-button type="primary">导出</el-button>
    </div>

    <div class="content-wrapper">
      <!-- 起重机校核计算内容 -->
      <div v-if="activeTab === 'crane'" class="left-panel">
        <el-scrollbar>
          <!-- 起重机参数Tabs -->
          <el-tabs v-model="craneParamsTab" type="card">
            <el-tab-pane label="起重机参数1" name="crane1">
              <!-- 基本信息 -->
              <div class="section crane-parameters-section">
                <div class="section-title">基本信息</div>
                <div class="form-content" style="margin-left: -20px;">
                  <div class="form-grid">
                    <div class="form-row">
                      <label class="form-label">起重机名称</label>
                      <div class="form-input-group">
                        <el-select
                        v-model="selectedCraneId"
                        placeholder="请选择起重机名称"
                        filterable
                        clearable
                        :loading="craneLoading"
                        @change="(val) => handleCraneChange(val, false)"
                      >
                        <el-option
                          v-for="crane in craneList"
                          :key="crane.id"
                          :label="crane.machineName"
                          :value="crane.id"
                        />
                      </el-select>
                     <el-button
                    type="primary"
                    size="default"
                   @click="openIntelligentSelection(0)"
                    >智能选型</el-button
                  >
                      </div>
                       
                    </div>
                    <div class="form-row">
                      <label class="form-label">设备名称</label>
                      <div class="form-input-group">
                        <el-select
                        v-model="selectedDeviceId"
                        placeholder="请选择设备名称"
                        filterable
                        clearable
                        :loading="deviceLoading"
                        @change="(val) => handleDeviceChange(val, false)"
                      >
                        <el-option
                          v-for="device in deviceList"
                          :key="device.id"
                          :label="device.deviceName"
                          :value="device.id"
                        />
                      </el-select>
                      </div>
                    </div>

                    <div class="form-row">
                      <label class="form-label">生产厂家</label>
                      <el-input v-model="formData.manufacturer"  placeholder="请输入生产厂家" />
                    </div>

                    <div class="form-row">
                      <label class="form-label">设备型号</label>
                      <el-input v-model="formData.equipmentType" placeholder="请输入设备型号"/>
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
                    <label class="form-label">吊臂类型</label>
                    <el-select v-model="formData.boomType" placeholder="请选择吊臂类型" style="width: 150px; ">
                      <el-option
                        v-for="item in getBoomType()"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
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
                    <label class="form-label" style="margin-left: -20px;">作业半径<span>(r)</span></label>
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
                        placeholder="请输入超起平衡重量"
                      />
                      <span class="unit">t</span>
                    </div>
                    <label class="form-label">超起平衡回转半径</label>
                    <div class="input-with-unit">
                      <el-input-number
                        v-model="formData.superLiftRadius"
                        controls-position="right"
                        :precision="2"
                        placeholder="请输入超起平衡回转半径"
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
                        <el-select
                            v-model="selectedCraneId2"
                            placeholder="请选择起重机名称"
                            filterable
                            clearable
                            :loading="craneLoading"
                            @change="(val) => handleCraneChange(val, true)"
                            style="width: calc(100% - 90px);"
                          >
                            <el-option
                              v-for="crane in craneList"
                              :key="crane.id"
                              :label="crane.machineName"
                              :value="crane.id"
                            />
                          </el-select>
                      <el-button
                    type="primary"
                    size="default"
                   @click="openIntelligentSelection(1)"
                    >智能选型</el-button
                  >
                        
                      </div>
                    </div>
                    <div class="form-row">
                      <label class="form-label">设备名称</label>
                      <div class="form-input-group">
                        <el-select
                          v-model="selectedDeviceId2"
                          placeholder="请选择设备名称"
                          filterable
                          clearable
                          :loading="deviceLoading"
                          @change="(val) => handleDeviceChange(val, false, true)"
                        >
                          <el-option
                            v-for="device in deviceList"
                            :key="device.id"
                            :label="device.deviceName"
                            :value="device.id"
                          />
                        </el-select>
                      </div>
                    </div>

                    <div class="form-row">
                      <label class="form-label">生产厂家</label>
                      <el-input v-model="formData.manufacturer2" placeholder="请输入生产厂家"/>
                    </div>

                    <div class="form-row">
                      <label class="form-label">设备型号</label>
                      <el-input v-model="formData.equipmentType2" placeholder="请输入设备型号"/>
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
                    <label class="form-label">吊臂类型</label>
                    <el-select v-model="formData.boomType2" placeholder="请选择吊臂类型" style="width: 150px;">
                      <el-option
                        v-for="item in getBoomType()"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
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
                    <label class="form-label" style="margin-left: -20px;">作业半径<span>(r)</span></label>
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
                  <label class="form-label error">起重机1承载重量</label>
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
                  <label class="form-label error">起重机2承载重量</label>
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
                        <th width="60">勾选</th>
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
            <el-button type="primary" @click="showCalculationResult"
              >计算结果</el-button
            >
          </div>
        </el-scrollbar>
      </div>

      <!-- 起重机示意图 -->
      <div v-if="activeTab === 'crane'" class="right-panel">
        <div class="diagram-container">
          <img
            v-if="formData.liftingMethod === 'double'"
            src=" @/images/machine.png"
            alt="起重机示意图"
            class="crane-diagram"
          />
          <img
            v-else
            src=" @/images/cac.png"
            alt="起重机示意图"
            class="crane-diagram"
          />
        </div>
      </div>

      <!-- 吊索具校核计算内容 -->
      <div v-if="activeTab === 'lifting'" class="left-panel">
        <el-scrollbar>
          <!-- 设备吊索设置 -->
          <div class="section section-with-border">
            <div class="section-title">设备设置</div>
            <div class="form-content">
              <div class="form-grid">
                <div class="form-row">
                  <label class="form-label">设备名称</label>
                  <div class="form-input-group">
                    <el-select
                        v-model="selectedSlingDeviceId"
                        placeholder="请选择设备名称"
                        filterable
                        clearable
                        :loading="deviceLoading"
                        @change="(val) => handleDeviceChange(val, true)"
                      >
                        <el-option
                          v-for="device in deviceList"
                          :key="device.id"
                          :label="device.deviceName"
                          :value="device.id"
                        />
                      </el-select>
                  </div>
                </div>
                <div class="form-row"></div>

                <div class="form-row">
                  <label class="form-label">设备型号</label>
                  <el-input
                    v-model="activeSlingData.equipmentModel"
                    placeholder="请输入设备型号"
                  />
                </div>
              </div>

              <div class="form-row" style="margin-top: 16px">
                <label class="form-label">设备重量<span>(G)</span></label>
                <div class="input-with-unit">
                  <el-input-number
                    v-model="activeSlingData.equipmentWeight"
                    controls-position="right"
                    :precision="2"
                  />
                  <span class="unit">t</span>
                </div>
                <el-radio-group v-model="activeSlingData.liftingType">
                  <el-radio value="noBeam">无吊梁</el-radio>
                  <el-radio value="withBeam">有吊梁</el-radio>
                </el-radio-group>
                <el-checkbox
                  v-model="activeSlingData.isSinglePointLifting"
                  style="margin-left: 20px"
                  @change="handleSinglePointLiftingChange"
                  v-if="activeSlingData.liftingType !== 'withBeam'"
                >
                  是否单点吊装
                </el-checkbox>
              </div>

              <!-- 有吊梁情况下显示平衡梁参数 -->
              <div
                class="form-row"
                v-if="activeSlingData.liftingType === 'withBeam'"
                style="display: flex; gap: 20px"
              >
                <div style="display: flex; align-items: center">
                  <label class="form-label">平衡梁重量<span>G1</span></label>
                  <div class="input-with-unit">
                    <el-input-number
                      v-model="activeSlingData.beamWeight"
                      controls-position="right"
                      :precision="2"
                    />
                    <span class="unit">t</span>
                  </div>
                </div>

                <div
                  style="display: flex; align-items: center; margin-left: -60px"
                >
                  <label class="form-label">平衡梁长度</label>
                  <div class="input-with-unit">
                    <el-input-number
                      v-model="activeSlingData.beamLength"
                      controls-position="right"
                      :precision="2"
                    />
                    <span class="unit">m</span>
                  </div>
                </div>

                <div style="display: flex; align-items: center">
                  <label class="form-label" style="max-width: 150px"
                    >吊梁下部吊具重量<span>G2</span></label
                  >
                  <div class="input-with-unit">
                    <el-input-number
                      v-model="activeSlingData.beamSlingWeight"
                      controls-position="right"
                      :precision="2"
                    />
                    <span class="unit">t</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 吊索具配置 -->
          <div class="section section-with-border">
            <div class="section-title section-title-with-button">
              <span>吊索具配置</span>
            </div>
            <!-- Updated sling component header to use blue button style -->
            <div class="sling-tabs-container">
              <div
                v-for="(sling, index) in liftingFormDatas"
                :key="sling.id"
                class="sling-tab-wrapper"
                :class="{ active: activeSlingIndex === index }"
              >
                <el-button
                  type="primary"
                  class="sling-tab-button"
                  :class="{
                    'sling-tab-button-inactive': activeSlingIndex !== index,
                  }"
                  @click="activeSlingIndex = index"
                >
                  {{
                    sling.liftingType === "withBeam"
                      ? sling.isBottomSling
                        ? `下部吊索具${getSlingIndex(sling, true)}`
                        : `上部吊索具${getSlingIndex(sling, false)}`
                      : `吊索具0${index + 1}`
                  }}
                </el-button>
                <!-- Delete图标，只在非默认吊索具上显示 -->
                <img
                  v-if="index > 0 && !(sling.isBottomSling && index === 1)"
                  class="remove-sling-button"
                  src="@/images/delete.png"
                  alt="删除"
                  :fit="'cover'"
                  @click="removeSling(index)"
                />
              </div>
              <img
                class="add-sling-button"
                src="@/images/add.png"
                alt="新增按钮"
                :fit="'cover'"
                @click="addNewSling"
                v-if="
                  activeSlingData.liftingType === 'noBeam'
                    ? !activeSlingData.isSinglePointLifting
                    : true
                "
              />
            </div>
            <div
              class="form-content"
              style="border: 1px solid #e7e7e7; padding-top: 15px"
            >
              <div class="form-row">
                <label class="form-label">吊索具名称</label>
                <div class="form-input-group">
                  <el-input
                    v-model="activeSlingData.deviceName"
                    placeholder="请输入吊索具名称"
                    class="manufacturer-input"
                  />
                  <!-- Added click handler to open three-level selection dialog -->
                  <el-button
                    type="primary"
                    size="default"
                    @click="openLiftingEquipmentDialog"
                    >选择</el-button
                  >
                </div>
                <!-- Added radio buttons inline with name field -->
                <el-radio-group
                  v-model="activeSlingData.slingType"
                  class="inline-radio-group"
                >
                  <el-radio value="0">钢丝绳</el-radio>
                  <el-radio value="1">吊带</el-radio>
                  <el-radio value="2">卸扣</el-radio>
                  <el-radio value="3">缆绳</el-radio>
                </el-radio-group>
              </div>

              <div class="form-row">
                <label class="form-label">生产厂家</label>
                <el-input
                  v-model="activeSlingData.manufacturer"
                  placeholder="请输入生产厂家"
                  class="manufacturer-input"
                />
              </div>

              <div class="form-row">
                <label class="form-label">产品型号</label>
                <el-input
                  v-model="activeSlingData.productModel"
                  placeholder="请输入产品型号"
                  class="manufacturer-input"
                />
              </div>

              <!-- Removed standalone radio group row -->
              <div class="form-row" style="margin-left: 50px">
                <el-radio-group v-model="activeSlingData.loadType">
                  <el-radio value="magnetic">破断拉力</el-radio>
                  <el-radio value="rope">额定载荷</el-radio>
                </el-radio-group>
                <label
                  class="form-label"
                  v-if="activeSlingData.loadType === 'magnetic'"
                  >出厂安全系数</label
                >
                <div
                  class="input-with-unit"
                  v-if="activeSlingData.loadType === 'magnetic'"
                >
                  <el-input-number
                    v-model="activeSlingData.safetyFactor"
                    controls-position="right"
                    :precision="2"
                  />
                </div>
                <label
                  class="form-label"
                  v-if="activeSlingData.loadType === 'rope'"
                  >额定载荷(PQ)</label
                >
                <div
                  class="input-with-unit"
                  v-if="activeSlingData.loadType === 'rope'"
                >
                  <el-input-number
                    v-model="activeSlingData.ratedLoad"
                    controls-position="right"
                    :precision="2"
                  />
                  <span class="unit">MPa</span>
                </div>
              </div>

              <div class="distance-inputs">
                <div class="distance-inputs-left">
                  <div class="form-row">
                    <label class="form-label">上部吊点数量</label>
                    <div class="input-with-unit">
                      <el-input-number
                        v-model="activeSlingData.topPointCount"
                        controls-position="right"
                        :precision="0"
                        disabled
                      />
                    </div>
                    <el-checkbox v-model="activeSlingData.isDouble"
                      >是否打双</el-checkbox
                    >
                  </div>

                  <div class="form-row">
                    <label class="form-label">下部吊点数量</label>
                    <div class="input-with-unit">
                      <el-input-number
                        v-model="activeSlingData.bottomPointCount"
                        controls-position="right"
                        :precision="0"
                        :min="
                          activeSlingData.liftingType === 'withBeam' ? 2 : 1
                        "
                        :max="8"
                        :disabled="activeSlingData.isSinglePointLifting"
                      />
                    </div>
                    <label class="form-label">挂布方式</label>
                    <el-select
                      v-model="activeSlingData.customLoop"
                      placeholder="请选择"
                      class="hanging-method-select"
                    >
                      <el-option label="矩形" value="loop" />
                      <el-option label="圆形" value="zero" />
                    </el-select>
                  </div>
                  <div class="form-row">
                    <label class="form-label">绳索长度</label>
                    <div class="input-with-unit">
                      <el-input-number
                        v-model="activeSlingData.ropeLength"
                        controls-position="right"
                         placeholder="输入长度"
                        :precision="2"
                      />
                      <span class="unit">m</span>
                    </div>
                  </div>

                  <div class="form-row">
                    <label class="form-label error">高度<span>(h)</span></label>
                    <div class="input-with-unit">
                      <el-input-number
                        v-model="activeSlingData.height"
                        controls-position="right"
                        :precision="2"
                        placeholder="输入高度"
                          disabled
                      />
                      <span class="unit">m</span>
                    </div>
                  </div>

                  <div class="form-row">
                    <label class="form-label">角度<span>(α)</span></label>
                    <div class="input-with-unit">
                      <el-input-number
                        v-model="activeSlingData.angle"
                        controls-position="right"
                          placeholder="输入角度"
                        :precision="1"
                        disabled
                      />
                      <span class="unit">度</span>
                    </div>
                  </div>
                </div>
                <div class="distance-inputs-right">
                  <!-- 无吊梁情况下显示L1-L4 -->
                  <template v-if="activeSlingData.liftingType === 'noBeam'">
                    <div class="form-row">
                      <el-checkbox v-model="activeSlingData.enableL1" />
                      <label class="form-label error"
                        >距离<span>L1</span></label
                      >
                      <div class="input-with-unit">
                        <el-input-number
                          v-model="activeSlingData.distanceL1"
                          controls-position="right"
                          :precision="0"
                        />
                        <span class="unit">m</span>
                      </div>
                    </div>

                    <div class="form-row">
                      <el-checkbox v-model="activeSlingData.enableL2" />
                      <label class="form-label error"
                        >距离<span>L2</span></label
                      >
                      <div class="input-with-unit">
                        <el-input-number
                          v-model="activeSlingData.distanceL2"
                          controls-position="right"
                          :precision="0"
                        />
                        <span class="unit">m</span>
                      </div>
                    </div>

                    <div class="form-row">
                      <el-checkbox v-model="activeSlingData.enableL3" />
                      <label class="form-label error"
                        >距离<span>L3</span></label
                      >
                      <div class="input-with-unit">
                        <el-input-number
                          v-model="activeSlingData.distanceL3"
                          controls-position="right"
                          :precision="0"
                        />
                        <span class="unit">m</span>
                      </div>
                    </div>

                    <div class="form-row">
                      <el-checkbox v-model="activeSlingData.enableL4" />
                      <label class="form-label error"
                        >距离<span>L4</span></label
                      >
                      <div class="input-with-unit">
                        <el-input-number
                          v-model="activeSlingData.distanceL4"
                          controls-position="right"
                          :precision="0"
                        />
                        <span class="unit">m</span>
                      </div>
                    </div>

                    <div class="form-row full-width">
                      <el-button
                        type="primary"
                        size="small"
                        class="calculate-distance-btn"
                        :loading="isCalculatingHeightAngle"
                        @click="handleCalculateHeightAngle"
                      >
                        计算角度和高度结果
                      </el-button>
                    </div>
                  </template>

                  <!-- 有吊梁情况下只显示La -->
                  <template v-else>
                    <div class="form-row">
                      <el-checkbox v-model="activeSlingData.enableLa" />
                      <label class="form-label error"
                        >距离<span>La</span></label
                      >
                      <div class="input-with-unit">
                        <el-input-number
                          v-model="activeSlingData.distanceLa"
                          controls-position="right"
                          :precision="0"
                        />
                        <span class="unit">m</span>
                      </div>
                    </div>
                  </template>
                </div>
              </div>
              <!-- 系数设置 -->
              <div class="section section-with-border">
                <div class="section-title">系数设置</div>
                <div class="form-content">
                  <div class="system-table">
                    <table>
                      <thead>
                        <tr>
                          <th width="60">勾选</th>
                          <th width="80">序号</th>
                          <th>系数名称</th>
                          <th width="120">值</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          v-for="(
                            item, index
                          ) in activeSlingData.liftingSystemItems"
                          :key="item.id"
                        >
                          <td>
                            <el-checkbox v-model="item.checked" />
                          </td>
                          <td>{{ item.order }}</td>
                          <td>
                            <el-input
                              v-model="item.name"
                              size="small"
                              placeholder="请输入系数名称"
                              @input="handleLiftingSystemInputChange(index)"
                            />
                          </td>
                          <td>
                            <el-input-number
                              v-model="item.value"
                              :controls="false"
                              size="small"
                              :precision="1"
                              @change="handleLiftingSystemInputChange(index)"
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="action-buttons">
            <el-button>重置</el-button>
            <el-button type="primary" @click="showLiftingResult"
              >计算结果</el-button
            >
          </div>
        </el-scrollbar>
      </div>

      <!-- 地基承载力校核计算内容 -->
      <div v-if="activeTab === 'foundation'" class="left-panel">
        <el-scrollbar>
          <!-- 基本信息 -->
          <div class="found_bear">地基承载</div>
          <div class="section section-with-border" style="margin-top: 0">
            <div class="form-content">
              <div class="form-grid">
                <div class="form-row">
                  <label class="form-label">承载类型</label>
                  <el-select
                    v-model="foundationData.craneType"
                    placeholder="请选择承载类型"
                  >
                    <el-option label="汽车式" value="truck" />
                    <el-option label="塔式" value="tower" />
                    <el-option label="履带式" value="tracked" />
                  </el-select>
                </div>
                <div class="form-row">
                  <label class="form-label">起重机名称</label>
                  <el-input
                    v-model="foundationData.foundationName"
                    placeholder="请输入起重机名称"
                  />
                </div>
              </div>
            </div>
            <div class="weight_set">
              <div class="section-title">重心设置</div>
              <div class="form-content">
                <div class="form-grid">
                  <div class="form-row">
                    <label class="form-label">履带名称</label>
                    <el-input
                      v-model="foundationData.trackName"
                      placeholder="请输入履带名称"
                    />
                  </div>
                  <div class="form-row">
                    <label class="form-label">履带型号</label>
                    <el-input
                      v-model="foundationData.trackModel"
                      placeholder="请输入履带型号"
                    />
                  </div>
                </div>
                <div class="form-grid" style="margin-top: 16px">
                  <div class="form-row">
                    <label class="form-label">计算方式</label>
                    <el-radio-group v-model="foundationData.calculationPoint">
                      <el-radio value="center">平均接地比压</el-radio>
                      <el-radio value="support" disabled>力矩平衡</el-radio>
                    </el-radio-group>
                  </div>
                </div>

                <!-- 新增的2列布局 -->
                <div
                  class="form-grid"
                  style="margin-top: 16px; display: flex; gap: 20px"
                >
                  <!-- 左列 -->
                  <div style="flex: 1">
                    <div class="form-row" style="margin-bottom: 16px">
                      <label class="form-label"
                        >左或右侧履带板宽度<span>B1</span></label
                      >
                      <div class="input-with-unit">
                        <el-input-number
                          v-model="foundationData.trackWidthB"
                          controls-position="right"
                          :precision="2"
                        />
                        <span class="unit">m</span>
                      </div>
                    </div>
                    <div class="form-row" style="margin-bottom: 16px">
                      <label class="form-label"
                        >履带接地长度<span>L4</span></label
                      >
                      <div class="input-with-unit">
                        <el-input-number
                          v-model="foundationData.trackGroundLengthL4"
                          controls-position="right"
                          :precision="2"
                        />
                        <span class="unit">m</span>
                      </div>
                    </div>
                    <div class="form-row" style="margin-bottom: 16px">
                      <label class="form-label"
                        >起重机设计自重<span>W</span></label
                      >
                      <div class="input-with-unit">
                        <el-input-number
                          v-model="foundationData.craneWeightW"
                          controls-position="right"
                          :precision="2"
                        />
                        <span class="unit">t</span>
                      </div>
                    </div>
                    <div class="form-row">
                      <label class="form-label">重力加速度<span>g</span></label>
                      <div class="input-with-unit">
                        <el-input-number
                          v-model="foundationData.gravityAccel"
                          controls-position="right"
                          :precision="2"
                        />
                        <span class="unit">m/s²</span>
                      </div>
                    </div>
                  </div>

                  <!-- 右列 -->
                  <div>
                    <div class="form-row">
                      <label class="form-label">驱动轮</label>
                      <el-checkbox
                        v-model="foundationData.driveWheelOffGround"
                      />
                      <label
                        class="form-label"
                        style="text-align: left; margin-left: -35px"
                        >是否离地</label
                      >
                    </div>
                    <div class="form-row">
                      <label class="form-label">从动轮</label>
                      <el-checkbox
                        v-model="foundationData.idlerWheelOffGround"
                      />
                      <label
                        class="form-label"
                        style="text-align: left; margin-left: -35px"
                        >是否离地</label
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="action-buttons">
            <el-button @click="resetFoundation">重置</el-button>
            <el-button type="primary" @click="calculateFoundation"
              >计算结果</el-button
            >
          </div>
        </el-scrollbar>
      </div>

      <!-- 地基示意图 -->
      <div v-if="activeTab === 'foundation'" class="right-panel">
        <div class="diagram-container found_img">
          <img
            src="/src/images/foundation.png"
            alt="地基示意图"
            class="crane-diagram"
          />
          <img
            src="/src/images/fou_item.png"
            alt="地基示意图"
            class="crane-diagram"
          />
        </div>
      </div>

      <!-- 吊索具示意图 -->
      <div v-if="activeTab === 'lifting'" class="right-panel">
        <div class="diagram-container">
          <img
            v-if="activeSlingData.liftingType === 'withBeam'"
            src="@/images/beam.png"
            alt="吊索具示意图"
            class="crane-diagram"
            :fit="'cover'"
          />
          <img
            v-else
            src="@/images/lifting.png"
            alt="吊索具示意图"
            class="crane-diagram"
            :fit="'cover'"
          />
        </div>
      </div>

      <!-- Added construction plan content area with embedded method-draw -->
      <div
        v-if="activeTab === 'construction'"
        class="content-wrapper construction-plan-wrapper"
      >
        <iframe
          src="/method-draw/index.html"
          class="method-draw-iframe"
          frameborder="0"
          title="施工平立面图编辑器"
        ></iframe>
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
        <div class="section-title">
          项目吊装方式:{{ singleResult.liftingMethod }}
        </div>
      </div>

      <div class="result-section">
        <div class="section-title">起重机选择</div>
        <div class="section-content">
          <div class="equipment-info">
            <div class="info-item">起重机：{{ singleResult.craneName }}</div>
            <div class="info-item">
              规格型号：主臂长度{{ formData.mainBoomLength }}m、副臂长度{{
                formData.auxBoomLength
              }}m、主臂角度{{ formData.mainBoomAngle }}°、副臂角度{{
                formData.auxBoomAngle
              }}°、吊钩最大起升高度xxx
            </div>
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
            （设备重量G+吊钩重量G1+计算钢丝绳重量G2+吊索具重量G3+其他计算重量G4）
            <template
              v-for="(factor, index) in singleResult.selectedFactors"
              :key="index"
            >
              ×{{ factor.name }}
            </template>
            】/起重机额定载荷PQ×100%&lt;100%
          </div>

          <div class="formula">
            <div class="formula-fraction">
              <div class="formula-numerator">
                (G+G1+G2+G3+G4)
                <template
                  v-for="(factor, index) in singleResult.selectedFactors"
                  :key="index"
                >
                  ×X{{ index + 1 }}
                </template>
              </div>
              <div class="formula-denominator">起重机额定载荷PQ</div>
            </div>
            <div class="formula-operator">× 100% &lt; 100%</div>
          </div>

          <div class="weight-details">
            <div class="weight-item">
              G：设备重量={{ singleResult.equipmentWeight }}t
            </div>
            <div class="weight-item">
              G1：吊钩重量={{ singleResult.hookWeight }}t
            </div>
            <div class="weight-item">
              G2：计算钢丝绳重量={{ singleResult.wireRopeWeight }}t
            </div>
            <div class="weight-item">
              G3：吊索具重量={{ singleResult.slingsWeight }}t
            </div>
            <div class="weight-item">
              G4：其他计算重量={{ singleResult.otherWeight }}t
            </div>
            <!-- 动态显示选中的系数，按照X1, X2, X3...的顺序 -->
            <div
              v-for="(factor, index) in singleResult.selectedFactors"
              :key="index"
              class="weight-item"
            >
              X{{ index + 1 }}：{{ factor.name }}={{ factor.value }}
            </div>
          </div>
        </div>
      </div>

      <div class="result-section result-final">
        <div class="section-title">
          <div>计算结果：{{ singleResult.calculationResult }}%</div>
          <div>
            <span
              :class="{
                qualified: singleResult.isQualified,
                unqualified: !singleResult.isQualified,
              }"
            >
              <template v-if="parseFloat(singleResult.calculationResult) < 100"
                >&lt;100%
                {{ singleResult.isQualified ? "(合格)" : "(不合格)" }}</template
              >
              <template
                v-else-if="parseFloat(singleResult.calculationResult) === 100"
                >=100% (不合格)</template
              >
              <template v-else>&gt;100% (不合格)</template>
            </span>
          </div>
        </div>
      </div>

      <div class="result-section">
        <div class="section-content conclusion">
          <template v-if="parseFloat(singleResult.calculationResult) < 100">
            起重机校核计算结果为{{
              singleResult.calculationResult
            }}%，小于100%，故满足要求。</template
          >
          <template
            v-else-if="parseFloat(singleResult.calculationResult) === 100"
          >
            起重机校核计算结果为{{
              singleResult.calculationResult
            }}%，等于100%，故不满足要求。</template
          >
          <template v-else>
            起重机校核计算结果为{{
              singleResult.calculationResult
            }}%，大于100%，故不满足要求。</template
          >
        </div>
      </div>
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="singleCraneDialogVisible = false">关闭</el-button>
      </span>
    </template>
  </el-dialog>

  <!-- 吊索具计算结果弹窗1：无吊梁且上/下部吊点数量均为1 -->
  <el-dialog
    v-model="liftingResultDialog1Visible"
    title="计算结果"
    width="700px"
    append-to-body
  >
    <div class="calculation-result">
      <h3>xxxxxx方案项目吊索具校核计算</h3>

      <!-- 循环显示所有吊索具信息 -->
      <div
        v-for="(sling, index) in liftingFormDatas"
        :key="sling.id"
        class="sling-result-card"
      >
        <div class="sling-result-header">
          <h4>吊索具 {{ index + 1 }}</h4>
        </div>
        <div class="result-section">
          <div class="section-title">吊索具信息</div>
          <div class="section-content">
            <div class="equipment-info">
              <div class="info-item">吊索具名称：{{ sling.deviceName }}</div>
              <div class="info-item">生产厂家：{{ sling.manufacturer }}</div>
              <div class="info-item">
                吊索具类型：{{
                  sling.slingType === "0"
                    ? "钢丝绳"
                    : sling.slingType === "1"
                    ? "吊带"
                    : sling.slingType === "2"
                    ? "卸扣"
                    : sling.slingType === "3"
                    ? "缆绳"
                    : "其它"
                }}
              </div>
              <div class="info-item">
                {{
                  sling.loadType === "magnetic" ? "出厂安全系数" : "额定载荷"
                }}：{{
                  sling.loadType === "magnetic"
                    ? sling.safetyFactor
                    : sling.ratedLoad
                }}
                {{ sling.loadType === "rope" ? "MPa" : "" }}
              </div>
            </div>
          </div>
        </div>

        <div class="result-section">
          <div class="section-title">设备信息</div>
          <div class="section-content">
            <div class="info-item">设备名称：{{ sling.equipmentName }}</div>
            <div class="info-item">设备编号：{{ sling.equipmentNumber }}</div>
            <div class="info-item">设备型号：{{ sling.equipmentModel }}</div>
            <div class="info-item">设备重量：{{ sling.equipmentWeight }} t</div>
          </div>
        </div>

        <div class="result-section">
          <div class="section-title">吊点信息</div>
          <div class="section-content">
            <div class="info-item">上部吊点数量：{{ sling.topPointCount }}</div>
            <div class="info-item">
              下部吊点数量：{{ sling.bottomPointCount }}
            </div>
            <div class="info-item">
              是否打双：{{ sling.isDouble ? "是" : "否" }}
            </div>
            <div class="info-item">挂布方式：{{ sling.customLoop }}</div>
          </div>
        </div>

        <div class="result-section">
          <div class="section-title">其他信息</div>
          <div class="section-content">
            <div class="info-item">绳索长度：{{ sling.ropeLength }} m</div>
            <div class="info-item">高度：{{ sling.height }} m</div>
            <div class="info-item">角度：{{ sling.angle }} 度</div>
          </div>
        </div>

        <div class="result-section">
          <div class="section-title">计算过程</div>
          <div class="section-content calculation-process">
            <!-- 根据loadType显示不同的计算公式 -->
            <div class="process-text">已知吊索具与设备直连的吊装公式为：</div>
            <div class="process-text" v-if="sling.loadType === 'magnetic'">
              破断拉力安全系数算法，破断拉力÷【设备重量G×动载系数×偏载系数×其他安全系数】＞6
            </div>
            <div class="process-text" v-else>
              设备重量G×动载系数×偏载系数×其他系数）/额定载荷×100%＜100%
            </div>

            <!-- 破断拉力计算公式 -->
            <div class="formula" v-if="sling.loadType === 'magnetic'">
              <div class="formula-fraction">
                <div class="formula-numerator" style="padding: 10px 50px">
                  N
                </div>
                <div class="formula-denominator">
                  G
                  <template
                    v-for="(item, index) in sling.liftingSystemItems.filter(
                      (item) => item.checked && item.value
                    )"
                    :key="index"
                  >
                    × X{{ index + 1 }}
                  </template>
                </div>
              </div>
              <div class="formula-operator">&gt; 6</div>
            </div>

            <!-- 额定载荷计算公式 -->
            <div class="formula" v-else>
              <div class="formula-fraction">
                <div class="formula-numerator">
                  G
                  <template
                    v-for="(item, index) in sling.liftingSystemItems.filter(
                      (item) => item.checked && item.value
                    )"
                    :key="index"
                  >
                    × X{{ index + 1 }}
                  </template>
                </div>
                <div class="formula-denominator">额定载荷PQ</div>
              </div>
              <div class="formula-operator">× 100% &lt; 100%</div>
            </div>

            <div class="weight-details">
              <!-- 破断拉力变量说明 -->
              <template v-if="sling.loadType === 'magnetic'">
                <div class="weight-item">
                  N：破断拉力={{ sling.safetyFactor
                  }}{{ sling.slingType === "rope" ? "MPa" : "" }}
                </div>
                <div class="weight-item">
                  G：设备重量={{ sling.equipmentWeight }}t
                </div>
                <template
                  v-for="(item, itemIndex) in sling.liftingSystemItems.filter(
                    (item) => item.checked && item.value
                  )"
                  :key="itemIndex"
                >
                  <div class="weight-item">
                    X{{ itemIndex + 1 }}：{{ item.name }}={{ item.value }}
                  </div>
                </template>
              </template>

              <!-- 额定载荷变量说明 -->
              <template v-else>
                <div class="weight-item">
                  B：额定载荷={{ sling.ratedLoad
                  }}{{ sling.slingType === "rope" ? "MPa" : "" }}
                </div>
                <div class="weight-item">
                  G：设备重量={{ sling.equipmentWeight }}t
                </div>
                <template
                  v-for="(item, itemIndex) in sling.liftingSystemItems.filter(
                    (item) => item.checked && item.value
                  )"
                  :key="itemIndex"
                >
                  <div class="weight-item">
                    X{{ itemIndex + 1 }}：{{ item.name }}={{ item.value }}
                  </div>
                </template>
              </template>
            </div>

            <!-- 计算结果放在计算过程下方 -->
            <div
              class="result-section result-final"
              style="
                margin-top: 20px;
                border: 1px solid #e0e0e0;
                border-radius: 4px;
              "
            >
              <div
                class="section-title"
                style="
                  background-color: #ffeebf;
                  padding: 8px 12px;
                  font-weight: bold;
                  color: #666;
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                "
              >
                <div>
                  吊索具 {{ index + 1 }} 计算结果：{{
                    sling.loadType === "magnetic"
                      ? calculateLiftingResult(sling).result.toFixed(2)
                      : calculateLiftingResult(sling).result.toFixed(2) + "%"
                  }}
                </div>
                <div>
                  <span
                    :class="
                      calculateLiftingResult(sling).isQualified
                        ? 'qualified'
                        : 'unqualified'
                    "
                    >{{
                      calculateLiftingResult(sling).isQualified
                        ? sling.loadType === "magnetic"
                          ? ">6 (合格)"
                          : "<100% (合格)"
                        : sling.loadType === "magnetic"
                        ? "≤6 (不合格)"
                        : "≥100% (不合格)"
                    }}</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="result-section">
        <div class="section-title">结论</div>
        <div class="section-content conclusion">
          <!-- 检查所有吊索具是否都满足要求 -->
          <template
            v-if="
              liftingFormDatas.every(
                (sling) => calculateLiftingResult(sling).isQualified
              )
            "
          >
            <template
              v-for="(sling, index) in liftingFormDatas"
              :key="sling.id"
            >
              吊索具{{ index + 1 }}校核计算结果为{{
                sling.loadType === "magnetic"
                  ? calculateLiftingResult(sling).result.toFixed(2)
                  : calculateLiftingResult(sling).result.toFixed(2) + "%"
              }}，{{
                sling.loadType === "magnetic"
                  ? (calculateLiftingResult(sling).result.toFixed(2) > 6
                      ? "大于"
                      : calculateLiftingResult(sling).result.toFixed(2) == 6
                      ? "等于"
                      : "小于") + "6"
                  : (calculateLiftingResult(sling).result.toFixed(2) < 100
                      ? "小于"
                      : calculateLiftingResult(sling).result.toFixed(2) == 100
                      ? "等于"
                      : "大于") + "100%"
              }}
            </template>
            故满足要求。
          </template>
          <template v-else>
            <template
              v-for="(sling, index) in liftingFormDatas"
              :key="sling.id"
            >
              吊索具{{ index + 1 }}校核计算结果为{{
                sling.loadType === "magnetic"
                  ? calculateLiftingResult(sling).result.toFixed(2)
                  : calculateLiftingResult(sling).result.toFixed(2) + "%"
              }}，{{
                sling.loadType === "magnetic"
                  ? (calculateLiftingResult(sling).result.toFixed(2) > 6
                      ? "大于"
                      : calculateLiftingResult(sling).result.toFixed(2) == 6
                      ? "等于"
                      : "小于") + "6"
                  : (calculateLiftingResult(sling).result.toFixed(2) < 100
                      ? "小于"
                      : calculateLiftingResult(sling).result.toFixed(2) == 100
                      ? "等于"
                      : "大于") + "100%"
              }}，{{
                calculateLiftingResult(sling).isQualified ? "满足" : "不满足"
              }}要求；
            </template>
            故不满足要求。
          </template>
        </div>
      </div>
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="liftingResultDialog1Visible = false">关闭</el-button>
      </span>
    </template>
  </el-dialog>

  <!-- 吊索具计算结果弹窗2：无吊梁且下部吊点数量大于1 -->
  <el-dialog
    v-model="liftingResultDialog2Visible"
    title="计算结果"
    width="700px"
    append-to-body
  >
    <div class="calculation-result">
      <h3>xxxxxx方案项目吊索具校核计算</h3>

      <!-- 循环显示所有吊索具信息 -->
      <div
        v-for="(sling, index) in liftingFormDatas"
        :key="sling.id"
        class="sling-result-card"
      >
        <div class="sling-result-header">
          <h4>吊索具 {{ index + 1 }}</h4>
        </div>
        <div class="result-section">
          <div class="section-title">吊索具信息</div>
          <div class="section-content">
            <div class="equipment-info">
              <div class="info-item">吊索具名称：{{ sling.deviceName }}</div>
              <div class="info-item">生产厂家：{{ sling.manufacturer }}</div>
              <div class="info-item">
                吊索具类型：{{
                  sling.slingType === "0"
                    ? "钢丝绳"
                    : sling.slingType === "1"
                    ? "吊带"
                    : sling.slingType === "2"
                    ? "卸扣"
                    : sling.slingType === "3"
                    ? "缆绳"
                    : "其它"
                }}
              </div>
              <div class="info-item">
                {{
                  sling.loadType === "magnetic" ? "出厂安全系数" : "额定载荷"
                }}：{{
                  sling.loadType === "magnetic"
                    ? sling.safetyFactor
                    : sling.ratedLoad
                }}
                {{ sling.loadType === "rope" ? "MPa" : "" }}
              </div>
            </div>
          </div>
        </div>

        <div class="result-section">
          <div class="section-title">设备信息</div>
          <div class="section-content">
            <div class="info-item">设备名称：{{ sling.equipmentName }}</div>
            <div class="info-item">设备编号：{{ sling.equipmentNumber }}</div>
            <div class="info-item">设备型号：{{ sling.equipmentModel }}</div>
            <div class="info-item">设备重量：{{ sling.equipmentWeight }} t</div>
          </div>
        </div>

        <div class="result-section">
          <div class="section-title">吊点信息</div>
          <div class="section-content">
            <div class="info-item">上部吊点数量：{{ sling.topPointCount }}</div>
            <div class="info-item">
              下部吊点数量：{{ sling.bottomPointCount }}
            </div>
            <div class="info-item">
              是否打双：{{ sling.isDouble ? "是" : "否" }}
            </div>
            <div class="info-item">挂布方式：{{ sling.customLoop }}</div>
          </div>
        </div>

        <div class="result-section">
          <div class="section-title">尺寸信息</div>
          <div class="section-content">
            <div class="info-item">绳索长度：{{ sling.ropeLength }} m</div>
            <div class="info-item">高度：{{ sling.height }} m</div>
            <div class="info-item">角度：{{ sling.angle }} 度</div>
          </div>
        </div>

        <div class="result-section">
          <div class="section-title">计算过程</div>
          <div class="section-content calculation-process">
            <!-- 根据loadType显示不同的计算公式 -->
            <div class="process-text">已知吊索具与设备直连的吊装公式为：</div>

            <!-- 破断拉力计算公式 -->
            <template v-if="sling.loadType === 'magnetic'">
              <div class="process-text">
                破断拉力安全系数算法，破断拉力÷【设备重量÷吊点数量·×动载系数×偏载系数×其他系数÷sinQ（单条吊索与水平面夹角）】＞6
              </div>
              <div class="formula">
                <div class="formula-fraction">
                  <div class="formula-numerator" style="padding: 0 70px">N</div>
                  <div class="formula-denominator">
                    G ÷ r
                    <template
                      v-for="(item, index) in sling.liftingSystemItems.filter(
                        (item) => item.checked && item.value
                      )"
                      :key="index"
                      >× X{{ index + 1 }}</template
                    >
                    ÷ sinQ
                  </div>
                </div>
                <div class="formula-operator">&gt; 6</div>
              </div>
            </template>

            <!-- 额定载荷计算公式 -->
            <template v-else>
              <div class="process-text">
                额定载荷算法，设备重量÷吊点数量×动载系数×偏载系数×其他系数÷sinQ（单条吊索与水平面夹角）÷额定载荷×100%＜100%（出厂安全系数满足6倍安全系数）；
              </div>
              <div class="formula">
                <div class="formula-fraction">
                  <div class="formula-numerator" style="border-bottom: none">
                    G ÷ r
                    <template
                      v-for="(item, index) in sling.liftingSystemItems.filter(
                        (item) => item.checked && item.value
                      )"
                      :key="index"
                      >× X{{ index + 1 }}</template
                    >
                    ÷ sinQ ÷ B
                  </div>
                </div>
                <div class="formula-operator">× 100% &lt; 100%</div>
              </div>
            </template>

            <div class="weight-details">
              <!-- 破断拉力变量说明 -->
              <template v-if="sling.loadType === 'magnetic'">
                <div class="weight-item">
                  N：破断拉力={{ sling.safetyFactor
                  }}{{ sling.slingType === "rope" ? "MPa" : "" }}
                </div>
                <div class="weight-item">
                  G：设备重量={{ sling.equipmentWeight }}t
                </div>
                <div class="weight-item">
                  r：下部吊点数={{ sling.bottomPointCount }}
                </div>
                <div class="weight-item">
                  Q：(单条吊索与水平面夹角) = {{ sling.angle || "-" }}°
                </div>
                <template
                  v-for="(item, itemIndex) in sling.liftingSystemItems.filter(
                    (item) => item.checked && item.value
                  )"
                  :key="itemIndex"
                >
                  <div class="weight-item">
                    X{{ itemIndex + 1 }}：{{ item.name }}={{ item.value }}
                  </div>
                </template>
              </template>

              <!-- 额定载荷变量说明 -->
              <template v-else>
                <div class="weight-item">
                  B：额定载荷={{ sling.ratedLoad
                  }}{{ sling.slingType === "rope" ? "MPa" : "" }}
                </div>
                <div class="weight-item">
                  G：设备重量={{ sling.equipmentWeight }}t
                </div>
                <div class="weight-item">
                  r：吊点数={{ sling.bottomPointCount }}
                </div>
                <div class="weight-item">
                  Q：(单条吊索与水平面夹角) = {{ sling.angle || "-" }}°
                </div>
                <template
                  v-for="(item, itemIndex) in sling.liftingSystemItems.filter(
                    (item) => item.checked && item.value
                  )"
                  :key="itemIndex"
                >
                  <div class="weight-item">
                    X{{ itemIndex + 1 }}：{{ item.name }}={{ item.value }}
                  </div>
                </template>
              </template>
            </div>

            <!-- 计算结果放在计算过程下方 -->
            <div
              class="result-section result-final"
              style="
                margin-top: 20px;
                border: 1px solid #e0e0e0;
                border-radius: 4px;
              "
            >
              <div
                class="section-title"
                style="
                  background-color: #ffeebf;
                  padding: 8px 12px;
                  font-weight: bold;
                  color: #666;
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                "
              >
                <div>
                  吊索具 {{ index + 1 }} 计算结果：{{
                    sling.loadType === "magnetic"
                      ? calculateLiftingResult(sling).result.toFixed(2)
                      : calculateLiftingResult(sling).result.toFixed(2) + "%"
                  }}
                </div>
                <div>
                  <span
                    :class="
                      calculateLiftingResult(sling).isQualified
                        ? 'qualified'
                        : 'unqualified'
                    "
                    >{{
                      calculateLiftingResult(sling).isQualified
                        ? sling.loadType === "magnetic"
                          ? ">6 (合格)"
                          : "<100% (合格)"
                        : sling.loadType === "magnetic"
                        ? "≤6 (不合格)"
                        : "≥100% (不合格)"
                    }}</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="result-section">
        <div class="section-title">结论</div>
        <div class="section-content conclusion">
          <!-- 检查所有吊索具是否都满足要求 -->
          <template
            v-if="
              liftingFormDatas.every(
                (sling) => calculateLiftingResult(sling).isQualified
              )
            "
          >
            <template
              v-for="(sling, index) in liftingFormDatas"
              :key="sling.id"
            >
              吊索具{{ index + 1 }}校核计算结果为{{
                sling.loadType === "magnetic"
                  ? calculateLiftingResult(sling).result.toFixed(2)
                  : calculateLiftingResult(sling).result.toFixed(2) + "%"
              }}，{{
                sling.loadType === "magnetic"
                  ? (calculateLiftingResult(sling).result.toFixed(2) > 6
                      ? "大于"
                      : calculateLiftingResult(sling).result.toFixed(2) == 6
                      ? "等于"
                      : "小于") + "6"
                  : (calculateLiftingResult(sling).result.toFixed(2) < 100
                      ? "小于"
                      : calculateLiftingResult(sling).result.toFixed(2) == 100
                      ? "等于"
                      : "大于") + "100%"
              }}
            </template>
            故满足要求。
          </template>
          <template v-else>
            <template
              v-for="(sling, index) in liftingFormDatas"
              :key="sling.id"
            >
              吊索具{{ index + 1 }}校核计算结果为{{
                sling.loadType === "magnetic"
                  ? calculateLiftingResult(sling).result.toFixed(2)
                  : calculateLiftingResult(sling).result.toFixed(2) + "%"
              }}，{{
                sling.loadType === "magnetic"
                  ? (calculateLiftingResult(sling).result.toFixed(2) > 6
                      ? "大于"
                      : calculateLiftingResult(sling).result.toFixed(2) == 6
                      ? "等于"
                      : "小于") + "6"
                  : (calculateLiftingResult(sling).result.toFixed(2) < 100
                      ? "小于"
                      : calculateLiftingResult(sling).result.toFixed(2) == 100
                      ? "等于"
                      : "大于") + "100%"
              }}，{{
                calculateLiftingResult(sling).isQualified ? "满足" : "不满足"
              }}要求；
            </template>
            故不满足要求。
          </template>
        </div>
      </div>
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="liftingResultDialog2Visible = false">关闭</el-button>
      </span>
    </template>
  </el-dialog>

  <!-- 吊索具计算结果弹窗3：有吊梁 -->
  <el-dialog
    v-model="liftingResultDialog3Visible"
    title="计算结果"
    width="700px"
    append-to-body
  >
    <div class="calculation-result">
      <h3>xxxxxx方案项目吊索具校核计算</h3>

      <!-- 循环显示所有吊索具信息 -->
      <div
        v-for="sling in liftingFormDatas.filter(
          (s) => s.liftingType === 'withBeam'
        )"
        :key="sling.id"
        class="sling-result-card"
      >
        <div class="sling-result-header">
          <h4>
            {{ sling.isBottomSling ? "下部吊索具" : "上部吊索具" }}
            {{ getSlingIndex(sling, sling.isBottomSling) }}
          </h4>
        </div>
        <div class="result-section">
          <div class="section-title">吊索具信息</div>
          <div class="section-content">
            <div class="equipment-info">
              <div class="info-item">吊索具名称：{{ sling.deviceName }}</div>
              <div class="info-item">生产厂家：{{ sling.manufacturer }}</div>
              <div class="info-item">
                吊索具类型：{{
                  sling.slingType === "0"
                    ? "钢丝绳"
                    : sling.slingType === "1"
                    ? "吊带"
                    : sling.slingType === "2"
                    ? "卸扣"
                    : sling.slingType === "3"
                    ? "缆绳"
                    : "其它"
                }}
              </div>
              <div class="info-item">
                {{
                  sling.loadType === "magnetic" ? "出厂安全系数" : "额定载荷"
                }}：{{
                  sling.loadType === "magnetic"
                    ? sling.safetyFactor
                    : sling.ratedLoad
                }}
                {{ sling.loadType === "rope" ? "MPa" : "" }}
              </div>
            </div>
          </div>
        </div>

        <div class="result-section">
          <div class="section-title">设备信息</div>
          <div class="section-content">
            <div class="info-item">设备名称：{{ sling.equipmentName }}</div>
            <div class="info-item">设备型号：{{ sling.equipmentModel }}</div>
            <div class="info-item">设备重量：{{ sling.equipmentWeight }} t</div>
          </div>
        </div>

        <div class="result-section" v-if="!sling.isBottomSling">
          <div class="section-title">平衡梁参数</div>
          <div class="section-content">
            <div class="info-item">平衡梁重量：{{ sling.beamWeight }} t</div>
            <div class="info-item">平衡梁长度：{{ sling.beamLength }} m</div>
            <div class="info-item">
              吊梁下部吊具重量：{{ sling.beamSlingWeight }} t
            </div>
          </div>
        </div>

        <div class="result-section">
          <div class="section-title">吊点信息</div>
          <div class="section-content">
            <div class="info-item">上部吊点数量：{{ sling.topPointCount }}</div>
            <div class="info-item">
              下部吊点数量：{{ sling.bottomPointCount }}
            </div>
            <div class="info-item">
              是否打双：{{ sling.isDouble ? "是" : "否" }}
            </div>
            <div class="info-item">挂布方式：{{ sling.customLoop }}</div>
          </div>
        </div>

        <div class="result-section">
          <div class="section-title">尺寸信息</div>
          <div class="section-content">
            <div class="info-item">绳索长度：{{ sling.ropeLength }} m</div>
            <div class="info-item">高度：{{ sling.height }} m</div>
            <div class="info-item">角度：{{ sling.angle }} 度</div>
          </div>
        </div>

        <div class="result-section">
          <div class="section-title">计算过程</div>
          <div class="section-content calculation-process">
            <!-- 根据是否为底部吊索具显示不同的描述 -->
            <div class="process-text" v-if="sling.isBottomSling">
              已知吊梁与设备之间吊索具的吊装公式为：
            </div>
            <div class="process-text" v-else>
              已知吊钩与吊梁之间吊索具的吊装公式为：
            </div>

            <!-- 根据是否为底部吊索具和loadType显示不同的计算公式 -->
            <template v-if="sling.isBottomSling">
              <!-- 下部吊索具 -->
              <div class="process-text" v-if="sling.loadType === 'magnetic'">
                破断拉力安全系数算法，破断拉力÷【设备重量÷吊点数量×动载系数×偏载系数×其他系数÷sinQ（单条吊索与水平面夹角）】＞6
              </div>
              <div class="process-text" v-else>
                额定载荷算法，设备重量÷吊点数量×动载系数×偏载系数×其他系数÷sinQ（单条吊索与水平面夹角）÷额定载荷×100%＜100%（出厂安全系数满足6倍安全系数）；
              </div>

              <!-- 破断拉力计算公式 -->
              <div class="formula" v-if="sling.loadType === 'magnetic'">
                <div class="formula-fraction">
                  <div class="formula-numerator" style="padding: 0 70px">N</div>
                  <div class="formula-denominator">
                    G ÷ r
                    <template
                      v-for="(
                        item, itemIndex
                      ) in sling.liftingSystemItems.filter(
                        (item) => item.checked && item.value
                      )"
                      :key="itemIndex"
                      >× X{{ itemIndex + 1 }}</template
                    >
                    ÷ sinQ
                  </div>
                </div>
                <div class="formula-operator">&gt; 6</div>
              </div>

              <!-- 额定载荷计算公式 -->
              <div class="formula" v-else>
                <div class="formula-fraction">
                  <div class="formula-numerator" style="border-bottom: none">
                    G ÷ r
                    <template
                      v-for="(
                        item, itemIndex
                      ) in sling.liftingSystemItems.filter(
                        (item) => item.checked && item.value
                      )"
                      :key="itemIndex"
                      >× X{{ itemIndex + 1 }}</template
                    >
                    ÷ sinQ ÷ B
                  </div>
                </div>
                <div class="formula-operator">× 100% &lt; 100%</div>
              </div>
            </template>

            <template v-else>
              <!-- 上部吊索具 -->
              <div class="process-text" v-if="sling.loadType === 'magnetic'">
                破断拉力安全系数算法，破断拉力÷【（设备重量+平衡梁重量+吊梁下部吊具重量）÷吊点数量×动载系数×偏载系数×其他系数÷sinQ（单条吊索与吊梁夹角）】＞6
              </div>
              <div class="process-text" v-else>
                额定载荷算法，（设备重量+平衡梁重量+吊梁下部吊具重量）÷吊点数量×动载系数×偏载系数×其他系数÷sinQ（单条吊索与吊梁夹角）÷额定载荷×100%＜100%（出厂安全系数满足6倍安全系数）；
              </div>

              <!-- 破断拉力计算公式 -->
              <div class="formula" v-if="sling.loadType === 'magnetic'">
                <div class="formula-fraction">
                  <div class="formula-numerator" style="padding: 0 100px">
                    N
                  </div>
                  <div class="formula-denominator">
                    (G + G1 + G2) ÷ r
                    <template
                      v-for="(
                        item, itemIndex
                      ) in sling.liftingSystemItems.filter(
                        (item) => item.checked && item.value
                      )"
                      :key="itemIndex"
                      >× X{{ itemIndex + 1 }}</template
                    >
                    ÷ sinQ
                  </div>
                </div>
                <div class="formula-operator">&gt; 6</div>
              </div>

              <!-- 额定载荷计算公式 -->
              <div class="formula" v-else>
                <div class="formula-fraction">
                  <div class="formula-numerator" style="padding: 0 30px">
                    (G + G1 + G2) ÷ r
                    <template
                      v-for="(
                        item, itemIndex
                      ) in sling.liftingSystemItems.filter(
                        (item) => item.checked && item.value
                      )"
                      :key="itemIndex"
                      >× X{{ itemIndex + 1 }}</template
                    >
                    ÷ sinQ
                  </div>
                  <div class="formula-denominator">额定载荷</div>
                </div>
                <div class="formula-operator">× 100% &lt; 100%</div>
              </div>
            </template>

            <div class="weight-details">
              <!-- 破断拉力变量说明 -->
              <template v-if="sling.loadType === 'magnetic'">
                <div class="weight-item">
                  N：破断拉力={{ sling.safetyFactor
                  }}{{ sling.slingType === "rope" ? "MPa" : "" }}
                </div>
                <div class="weight-item">
                  G：设备重量={{ sling.equipmentWeight }}t
                </div>
                <div v-if="!sling.isBottomSling" class="weight-item">
                  G1：平衡梁重量={{ sling.beamWeight }}t
                </div>
                <div v-if="!sling.isBottomSling" class="weight-item">
                  G2：吊梁下部吊具重量={{ sling.beamSlingWeight }}t
                </div>
                <div class="weight-item">
                  r：吊点数={{ sling.bottomPointCount }}
                </div>
                <div class="weight-item">
                  Q：(单条吊索与{{
                    sling.isBottomSling ? "水平面" : "吊梁"
                  }}夹角) = {{ sling.angle || "-" }}°
                </div>
                <template
                  v-for="(item, itemIndex) in sling.liftingSystemItems.filter(
                    (item) => item.checked && item.value
                  )"
                  :key="itemIndex"
                >
                  <div class="weight-item">
                    X{{ itemIndex + 1 }}：{{ item.name }}={{ item.value }}
                  </div>
                </template>
              </template>

              <!-- 额定载荷变量说明 -->
              <template v-else>
                <div class="weight-item">
                  B：额定载荷={{ sling.ratedLoad
                  }}{{ sling.slingType === "rope" ? "MPa" : "" }}
                </div>
                <div class="weight-item">
                  G：设备重量={{ sling.equipmentWeight }}t
                </div>
                <div v-if="!sling.isBottomSling" class="weight-item">
                  G1：平衡梁重量={{ sling.beamWeight }}t
                </div>
                <div v-if="!sling.isBottomSling" class="weight-item">
                  G2：吊梁下部吊具重量={{ sling.beamSlingWeight }}t
                </div>
                <div class="weight-item">
                  r：吊点数={{ sling.bottomPointCount }}
                </div>
                <div class="weight-item">
                  Q：(单条吊索与{{
                    sling.isBottomSling ? "水平面" : "吊梁"
                  }}夹角) = {{ sling.angle || "-" }}°
                </div>
                <template
                  v-for="(item, itemIndex) in sling.liftingSystemItems.filter(
                    (item) => item.checked && item.value
                  )"
                  :key="itemIndex"
                >
                  <div class="weight-item">
                    X{{ itemIndex + 1 }}：{{ item.name }}={{ item.value }}
                  </div>
                </template>
              </template>
            </div>

            <!-- 计算结果放在计算过程下方 -->
            <div
              class="result-section result-final"
              style="
                margin-top: 20px;
                border: 1px solid #e0e0e0;
                border-radius: 4px;
              "
            >
              <div
                class="section-title"
                style="
                  background-color: #ffeebf;
                  padding: 8px 12px;
                  font-weight: bold;
                  color: #666;
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                "
              >
                <div>
                  计算结果：{{
                    sling.loadType === "magnetic"
                      ? calculateLiftingResult(sling).result.toFixed(2)
                      : calculateLiftingResult(sling).result.toFixed(2) + "%"
                  }}
                </div>
                <div>
                  <span
                    :class="
                      calculateLiftingResult(sling).isQualified
                        ? 'qualified'
                        : 'unqualified'
                    "
                    >{{
                      calculateLiftingResult(sling).isQualified
                        ? sling.loadType === "magnetic"
                          ? ">6 (合格)"
                          : "<100% (合格)"
                        : sling.loadType === "magnetic"
                        ? "≤6 (不合格)"
                        : "≥100% (不合格)"
                    }}</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="result-section">
        <div class="section-title">结论</div>
        <div class="section-content conclusion">
          <!-- 检查所有有吊梁的吊索具是否都满足要求 -->
          <template
            v-if="
              liftingFormDatas
                .filter((s) => s.liftingType === 'withBeam')
                .every((sling) => calculateLiftingResult(sling).isQualified)
            "
          >
            <template
              v-for="sling in liftingFormDatas.filter(
                (s) => s.liftingType === 'withBeam'
              )"
              :key="sling.id"
            >
              吊索具{{
                getSlingIndex(sling, sling.isBottomSling)
              }}校核计算结果为{{
                sling.loadType === "magnetic"
                  ? calculateLiftingResult(sling).result.toFixed(2)
                  : calculateLiftingResult(sling).result.toFixed(2) + "%"
              }}，{{
                sling.loadType === "magnetic"
                  ? (calculateLiftingResult(sling).result.toFixed(2) > 6
                      ? "大于"
                      : calculateLiftingResult(sling).result.toFixed(2) == 6
                      ? "等于"
                      : "小于") + "6"
                  : (calculateLiftingResult(sling).result.toFixed(2) < 100
                      ? "小于"
                      : calculateLiftingResult(sling).result.toFixed(2) == 100
                      ? "等于"
                      : "大于") + "100%"
              }}，同时出厂安全系数满足6倍安全系数,
            </template>
            故满足要求。
          </template>
          <template v-else>
            <template
              v-for="sling in liftingFormDatas.filter(
                (s) => s.liftingType === 'withBeam'
              )"
              :key="sling.id"
            >
              吊索具{{
                getSlingIndex(sling, sling.isBottomSling)
              }}校核计算结果为{{
                sling.loadType === "magnetic"
                  ? calculateLiftingResult(sling).result.toFixed(2)
                  : calculateLiftingResult(sling).result.toFixed(2) + "%"
              }}，{{
                sling.loadType === "magnetic"
                  ? (calculateLiftingResult(sling).result.toFixed(2) > 6
                      ? "大于"
                      : calculateLiftingResult(sling).result.toFixed(2) == 6
                      ? "等于"
                      : "小于") + "6"
                  : (calculateLiftingResult(sling).result.toFixed(2) < 100
                      ? "小于"
                      : calculateLiftingResult(sling).result.toFixed(2) == 100
                      ? "等于"
                      : "大于") + "100%"
              }}，{{
                calculateLiftingResult(sling).isQualified ? "满足" : "不满足"
              }}要求；
            </template>
            故不满足要求。
          </template>
        </div>
      </div>
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="liftingResultDialog3Visible = false">关闭</el-button>
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
        <div class="section-title">
          项目吊装方式:{{ doubleResult.liftingMethod }}
        </div>
      </div>

      <div class="result-section">
        <div class="section-title">起重机1选择</div>
        <div class="section-content">
          <div class="equipment-info">
            <div class="info-item">起重机：{{ doubleResult.craneName1 }}</div>
            <div class="info-item">
              规格型号：主臂长度{{ formData.mainBoomLength }}m、副臂长度{{
                formData.auxBoomLength
              }}m、主臂角度{{ formData.mainBoomAngle }}°、副臂角度{{
                formData.auxBoomAngle
              }}°、吊钩最大起升高度xxx
            </div>
            <div class="info-item">破断拉力：{{ formData.ratedLoad }}t</div>
          </div>
        </div>
      </div>

      <div class="result-section">
        <div class="section-title">起重机2选择</div>
        <div class="section-content">
          <div class="equipment-info">
            <div class="info-item">起重机：{{ doubleResult.craneName2 }}</div>
            <div class="info-item">
              规格型号：主臂长度{{ formData.mainBoomLength2 }}m、副臂长度{{
                formData.auxBoomLength2
              }}m、主臂角度{{ formData.mainBoomAngle2 }}°、副臂角度{{
                formData.auxBoomAngle2
              }}°、吊钩最大起升高度xxx
            </div>
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
            <template
              v-for="(factor, index) in doubleResult.selectedFactors"
              :key="index"
            >
              ×{{ factor.name }}
            </template>
            】/单台起重机额定载荷PQ×100%&lt;75%
          </div>

          <div class="formula">
            <div class="formula-fraction">
              <div class="formula-numerator">
                (G0+G1+G2+G3+G4)
                <template
                  v-for="(factor, index) in doubleResult.selectedFactors"
                  :key="index"
                >
                  ×X{{ index + 1 }}
                </template>
              </div>
              <div class="formula-denominator">起重机额定载荷PQ</div>
            </div>
            <div class="formula-operator">× 100% &lt; 75%</div>
          </div>

          <div class="weight-details">
            <div class="weight-item">
              G0：单台起重机所承担最大设备重量={{ doubleResult.G0 }}t
            </div>
            <div class="weight-item">
              G1：吊钩重量={{ doubleResult.hookWeight }}t
            </div>
            <div class="weight-item">
              G2：计算钢丝绳重量={{ doubleResult.wireRopeWeight }}t
            </div>
            <div class="weight-item">
              G3：吊索具重量={{ doubleResult.slingsWeight }}t
            </div>
            <div class="weight-item">
              G4：其他计算重量={{ doubleResult.otherWeight }}t
            </div>
            <!-- 动态显示选中的系数，按照X1, X2, X3...的顺序 -->
            <div
              v-for="(factor, index) in doubleResult.selectedFactors"
              :key="index"
              class="weight-item"
            >
              X{{ index + 1 }}：{{ factor.name }}={{ factor.value }}
            </div>
          </div>
        </div>
      </div>

      <div class="result-section result-final">
        <div class="section-title">
          <div>起重机1计算结果：{{ doubleResult.calculationResult1 }}%</div>
          <div>
            <span
              :class="{
                qualified: doubleResult.isQualified1,
                unqualified: !doubleResult.isQualified1,
              }"
            >
              <template v-if="parseFloat(doubleResult.calculationResult1) < 75"
                >&lt;75% (合格)</template
              >
              <template
                v-else-if="parseFloat(doubleResult.calculationResult1) === 75"
                >=75% (不合格)</template
              >
              <template v-else>&gt;75% (不合格)</template>
            </span>
          </div>
        </div>
      </div>

      <div class="result-section result-final">
        <div class="section-title">
          <div>起重机2计算结果：{{ doubleResult.calculationResult2 }}%</div>
          <div>
            <span
              :class="{
                qualified: doubleResult.isQualified2,
                unqualified: !doubleResult.isQualified2,
              }"
            >
              <template v-if="parseFloat(doubleResult.calculationResult2) < 75"
                >&lt;75% (合格)</template
              >
              <template
                v-else-if="parseFloat(doubleResult.calculationResult2) === 75"
                >=75% (不合格)</template
              >
              <template v-else>&gt;75% (不合格)</template>
            </span>
          </div>
        </div>
      </div>

      <div class="result-section">
        <div class="section-content conclusion">
          <template
            v-if="doubleResult.isQualified1 && doubleResult.isQualified2"
          >
            起重机1校核计算结果为{{
              doubleResult.calculationResult1
            }}%，小于75%；起重机2校核计算结果为{{
              doubleResult.calculationResult2
            }}%，小于75%；故满足要求。
          </template>
          <template v-else>
            起重机1校核计算结果为{{ doubleResult.calculationResult1 }}%
            <template v-if="parseFloat(doubleResult.calculationResult1) < 75"
              >小于</template
            >
            <template
              v-else-if="parseFloat(doubleResult.calculationResult1) === 75"
              >等于</template
            >
            <template v-else>大于</template>
            75%； 起重机2校核计算结果为{{ doubleResult.calculationResult2 }}%
            <template v-if="parseFloat(doubleResult.calculationResult2) < 75"
              >小于</template
            >
            <template
              v-else-if="parseFloat(doubleResult.calculationResult2) === 75"
              >等于</template
            >
            <template v-else>大于</template>
            75%；故不满足要求。
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

  <!-- 编辑标题弹窗 -->
  <el-dialog
    v-model="editTitleDialogVisible"
    title="编辑项目标题"
    width="400px"
    append-to-body
  >
    <div class="edit-title-dialog">
      <el-input v-model="newTitle" placeholder="请输入项目标题" />
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancelEditTitle">取消</el-button>
        <el-button type="primary" @click="confirmEditTitle">确定</el-button>
      </span>
    </template>
  </el-dialog>

  <!-- Added three-level lifting equipment selection dialog -->
  <el-dialog
    v-model="showLiftingEquipmentDialog"
    title="吊索具选择"
    width="900px"
    append-to-body
    @close="closeLiftingEquipmentDialog"
  >
    <div class="lifting-equipment-selector">
      <!-- 第一级：自定义分类 -->
      <div class="selector-column">
        <div class="column-header">请选择类型</div>
        <div class="column-content">
          <div
            v-for="category in equipmentCategories"
            :key="category.id"
            class="selector-item"
            :class="{ active: selectedCategory?.id === category.id }"
            @click="selectCategory(category)"
          >
            {{ category.liftingTypeName }}
          </div>
        </div>
      </div>

      <!-- 第二级：选择产品 -->
      <div class="selector-column">
        <div class="column-header">选择产品</div>
        <div class="column-content">
          <div
            v-for="product in equipmentProducts"
            :key="product.id"
            class="selector-item"
            :class="{ active: selectedProduct?.id === product.id }"
            @click="selectProduct(product)"
          >
            {{ product.liftingName }}
          </div>
        </div>
      </div>

      <!-- 第三级：选择型号 -->
      <div class="selector-column">
        <div class="column-header">选择型号</div>
        <div class="column-content">
          <div
            v-for="model in equipmentModels"
            :key="model.id"
            class="selector-item"
            :class="{ active: selectedModel?.id === model.id }"
            @click="selectModel(model)"
          >
            {{ model.deviceModel }}
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeLiftingEquipmentDialog">取消</el-button>
        <el-button type="primary" @click="confirmLiftingEquipmentSelection"
          >确定</el-button
        >
      </span>
    </template>
  </el-dialog>

  <!-- 吊索具类型选择弹窗 -->
  <el-dialog
    v-model="showSlingTypeDialog"
    title="添加吊索具"
    width="300px"
    center
    append-to-body
    :show-close="false"
    style="padding: 0"
  >
    <template #header>
      <div
        style="
          background: #e5e5e5;
          padding: 5px;
          text-align: left;
          font-weight: bold;
          position: relative;
        "
      >
        添加吊索具
        <el-button
          style="
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            width: 24px;
            height: 24px;
            min-height: 24px;
            padding: 0;
          "
          @click="closeSlingTypeDialog"
        >
          <span
            style="
              font-size: 18px;
              font-weight: bold;
              display: inline-block;
              transform: rotate(45deg);
            "
            >+</span
          >
        </el-button>
      </div>
    </template>
    <div
      style="
        display: flex;
        flex-direction: column;
        gap: 17px;
        padding: 20px 0;
        align-items: center;
      "
    >
      <el-button
        type="default"
        style="width: 70%; height: 40px; font-size: 16px"
        @click="
          selectedSlingType = 'upper';
          confirmAddSling();
        "
      >
        添加上部吊索具
      </el-button>
      <el-button
        type="default"
        style="width: 70%; height: 40px; font-size: 16px; margin-left: 0"
        @click="
          selectedSlingType = 'lower';
          confirmAddSling();
        "
      >
        添加下部吊索具
      </el-button>
    </div>
  </el-dialog>

  <!-- 地基承载力计算结果弹窗 -->
  <el-dialog
    v-model="foundationResultDialogVisible"
    title="计算结果"
    width="900px"
    append-to-body
  >
    <div class="calculation-result foundation-result">
      <h3>xxxxx方案项目地基承载力校核计算</h3>

      <div class="result-section">
        <div
          class="section-title"
          style="
            background-color: #ffeebf;
            padding: 8px 12px;
            font-weight: bold;
            color: #666;
          "
        >
          履带信息
        </div>
        <div class="section-content" style="padding: 12px">
          <div class="info-row">
            <span class="info-label">履带名称：</span>
            <span class="info-value">{{
              foundationCalculationResult.trackInfo.name
            }}</span>
            <span class="info-label" style="margin-left: 40px">型号：</span>
            <span class="info-value">{{
              foundationCalculationResult.trackInfo.model
            }}</span>
          </div>
          <div class="info-row" style="margin-top: 8px">
            <span class="info-label">规格型号：</span>
            <span class="info-value">{{
              foundationCalculationResult.trackInfo.specifications
            }}</span>
          </div>
        </div>
      </div>

      <div class="result-section">
        <div
          class="section-title"
          style="
            background-color: #ffeebf;
            padding: 8px 12px;
            font-weight: bold;
            color: #666;
          "
        >
          其它参数
        </div>
        <div class="section-content" style="padding: 12px">
          <div class="info-row">
            <span class="info-label">接地长度</span>
            <span class="info-value">{{
              foundationCalculationResult.otherParams.groundLength
            }}</span>
          </div>
        </div>
      </div>

      <div class="result-section">
        <div
          class="section-title"
          style="
            background-color: #ffeebf;
            padding: 8px 12px;
            font-weight: bold;
            color: #666;
          "
        >
          计算过程
        </div>
        <div class="section-content calculation-process" style="padding: 12px">
          <div class="process-text">
            第一步：已知履带接地长度和履带宽度，可以计算出接地面积
          </div>
          <div class="process-text">接地面积公式为</div>

          <div class="formula" style="margin: 20px 0; text-align: center">
            <div style="font-size: 24px; color: #666">
              <span style="font-style: italic; font-weight: bold">A</span>
              <span style="margin: 0 10px">=</span>
              <span style="font-style: italic; font-weight: bold">L</span
              ><sub>4</sub>
              <span style="margin: 0 10px">×</span>
              <span style="font-style: italic; font-weight: bold">2B</span
              ><sub>1</sub>
            </div>
          </div>

          <div class="weight-details" style="margin: 20px 0">
            <div class="weight-item">
              L4：履带接地长度= {{ foundationData.trackGroundLengthL4 }}m
            </div>
            <div class="weight-item">
              B1：左或右侧履带板宽度= {{ foundationData.trackWidthB }}m
            </div>
          </div>

          <div class="info-row" style="margin: 20px 0">
            <span class="info-label">履带接地面积计算结果A=</span>
            <span class="info-value"
              >{{
                foundationCalculationResult.calculationProcess.area.toFixed(2)
              }}
              m²</span
            >
          </div>

          <div class="process-text" style="margin-top: 30px">
            第二步：根据起重机设计自重和重力加速度，以及得出的接地面积计算出平均接地比压
          </div>
          <div class="process-text">平均接地比压按公式为</div>

          <div class="formula" style="margin: 20px 0; text-align: center">
            <div
              style="
                font-size: 24px;
                color: #666;
                display: flex;
                align-items: center;
                justify-content: center;
              "
            >
              <span style="font-style: italic; font-weight: bold">T</span>
              <span style="margin: 0 10px">=</span>
              <div
                style="
                  display: inline-flex;
                  flex-direction: column;
                  align-items: center;
                "
              >
                <div style="padding: 5px 20px; border-bottom: 2px solid #666">
                  <span style="font-style: italic; font-weight: bold">W</span>
                  <span style="margin: 0 5px">×</span>
                  <span style="font-style: italic; font-weight: bold">g</span>
                </div>
                <div style="padding: 5px 20px">
                  <span style="font-style: italic; font-weight: bold">A</span>
                </div>
              </div>
            </div>
          </div>

          <div class="weight-details" style="margin: 20px 0">
            <div class="weight-item">
              W：起重机设计自重={{ foundationData.craneWeightW }}t
            </div>
            <div class="weight-item">
              g：重力加速度={{ foundationData.gravityAccel }} m/s²
            </div>
            <div class="weight-item">
              A：履带接地面积={{
                foundationCalculationResult.calculationProcess.area.toFixed(2)
              }}
              m²
            </div>
          </div>
        </div>
      </div>

      <div class="result-section result-final">
        <div
          class="section-title"
          style="
            background-color: #ffeebf;
            padding: 8px 12px;
            font-weight: bold;
            color: #666;
            display: flex;
            align-items: center;
            justify-content: space-between;
          "
        >
          <div>
            T:履带平均接地比压=
            {{
              foundationCalculationResult.calculationProcess.pressure.toFixed(
                2
              )
            }}t
          </div>
          <el-button
            type="text"
            style="color: #666; padding: 0"
            @click="copyFoundationResult"
          >
            <el-icon style="font-size: 18px"><DocumentCopy /></el-icon>
          </el-button>
        </div>
      </div>

      <div class="result-section">
        <div
          class="section-title"
          style="
            background-color: #ffeebf;
            padding: 8px 12px;
            font-weight: bold;
            color: #666;
          "
        >
          结论
        </div>
        <div class="section-content conclusion" style="padding: 12px">
          履带平均接地比压计算结果为{{
            foundationCalculationResult.calculationProcess.pressure.toFixed(0)
          }}t
        </div>
      </div>
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="foundationResultDialogVisible = false"
          >关闭</el-button
        >
      </span>
    </template>
  </el-dialog>
  <!-- 智能选型弹窗 -->
  <el-dialog
    v-model="intelligentSelectionDialogVisible"
    title="起重机智能选型"
    width="800px"
    :before-close="() => { intelligentSelectionDialogVisible = false; }"
  >
    <div class="intelligent-selection-content">
      <div class="selection-params">
        <div class="selection-info">
        <el-form label-width="120px">
          <el-form-item label="设备名称">
            <div style="display: flex; align-items: center; gap: 10px;">
              <el-select
                v-model="selectedDeviceId"
                placeholder="请选择设备名称"
                filterable
                clearable
                :loading="deviceLoading"
                @change="(val) => handleDeviceChange(val, false)"
              >
                <el-option
                  v-for="device in deviceList"
                  :key="device.id"
                  :label="device.deviceName"
                  :value="device.id"
                />
              </el-select>
              <div style="display: flex; align-items: center; width: 300px;">
                <label style="min-width: 80px; text-align: right; margin-right: 12px;">设备重量</label>
                <el-input-number
                  v-model="formData.equipmentWeight"
                  :min="0"
                  :precision="2"
                  controls-position="right"
                  placeholder="请输入设备重量"
                  style="flex: 1;"
                />
                <span style="margin-left: 10px;">t</span>
              </div>
            </div>
          </el-form-item>
          
          <el-form-item label="设备型号">
            <el-input
              v-model="formData.equipmentType"
              placeholder="请输入设备型号"
            />
          </el-form-item>
          
          <el-form-item label="设备生产厂家">
            <el-input
              v-model="formData.manufacturer"
              placeholder="请输入设备生产厂家"
            />
          </el-form-item>
        </el-form>
        </div>
        <div class="selection-params_button" @click="executeIntelligentSelection" :loading="intelligentSelectionLoading" >
          <div>智能选型</div>
        </div>
      </div>
      
      <div class="selection-results" v-if="selectionResults.length > 0">
        <h3>选型结果</h3>
        <div
          v-for="(result, index) in selectionResults"
          :key="index"
          class="selection-result-item"
          @click="selectCraneResult(result)"
        >
          <div class="crane-title">
            <div>{{ result.machineName }}</div>
             <div class="crane-title_info"><span>厂家:{{ result.prodBusiness }}</span><span>型号:{{ result.model }}</span></div>
          </div>
          <div class="crane-content">
            <div class="crane-info">
            <label>主臂最大长度</label>
            <span>{{ result.mainBoomMaxLength || '--' }}m</span>
          </div>
         <div class="crane-info">
            <label>副臂最大长度</label>
            <span>{{ result.jibMaxLength || '--' }}m</span>
          </div>
          <div class="crane-info">
            <label>最大承载重量</label>
            <span>{{ result.mainHookMaxCapacity || '--' }}t</span>
          </div>
          <div class="crane-info" style="border: none">
            <label>车体配重重量</label>
            <span>{{ result.counterweight || '--' }}t</span>
          </div>
            <div class="crane-info" style="border: none">
             <el-button type="primary">选择</el-button>
          </div>
          </div>  
        </div>
      </div>
      
      <div v-else-if="!intelligentSelectionLoading" class="no-results">
        暂无选型结果，请点击"智能选型"按钮获取结果
      </div>
    </div>
    
    <template #footer>
      <el-button @click="intelligentSelectionDialogVisible = false">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useRouter } from "vue-router";
import {
  ArrowLeft,
  Edit,
  Tools,
  Connection,
  Histogram,
  DocumentCopy, // 添加复制图标
} from "@element-plus/icons-vue";
import { ElMessage } from "element-plus"; // Corrected import statement for ElMessage
import {
  getLiftingMenuOne,
  getLiftingMenuTwo,
  getLiftingMenuThree,
  getDeviceList,
  getDeviceDetail,
  getCraneList,
  getLiftingDetail,
  getCraneDataDetail,
  intelligentCraneSelection,
  getCalculateInfo,
  getCalculateHeightOrAngle,
} from "@/api/index.js";
import {  getBoomType, craneType} from "@/utils/common.js";

const router = useRouter();
const activeTab = ref("crane");
const craneParamsTab = ref("crane1"); // 起重机参数tab页默认选中第一个

// 设备列表相关
const deviceList = ref([]);
const deviceLoading = ref(false);
const selectedDeviceId = ref('');
const selectedDeviceId2 = ref('');
const selectedSlingDeviceId = ref('');

// 起重机列表相关
const craneList = ref([]);

const craneLoading = ref(false);
const selectedCraneId = ref('');
const selectedCraneId2 = ref('');

// 加载设备列表
const loadDeviceList = async () => {
  try {
    deviceLoading.value = true;
    const response = await getDeviceList({ pageNum: -1, pageSize: -1 });
    if (response.code === '0' && response.data && response.data.records) {
      deviceList.value = response.data.records;
    }
  } catch (error) {
    ElMessage.error('获取设备列表失败');
    console.error('获取设备列表失败:', error);
  } finally {
    deviceLoading.value = false;
  }
};

// 加载起重机列表
const loadCraneList = async () => {
  try {
    craneLoading.value = true;
    const response = await getCraneList({ pageNum: -1, pageSize: -1 });
    if (response.code === '0' && response.data && response.data.records) {
      craneList.value = response.data.records;
    }
  } catch (error) {
    ElMessage.error('获取起重机列表失败');
    console.error('获取起重机列表失败:', error);
  } finally {
    craneLoading.value = false;
  }
};

// 获取设备详情并回显数据
const getDeviceDetailAndEcho = async (deviceId, isSlingTab = false, isCrane2 = false) => {
  try {
    const response = await getDeviceDetail(deviceId);
    if (response.code === '0' && response.data) {
      const deviceData = response.data;
      if (isSlingTab) {
        // 吊索具tab回显
        activeSlingData.value.equipmentName = deviceData.deviceName || '';
        activeSlingData.value.equipmentModel = deviceData.deviceType || '';
        activeSlingData.value.manufacturer2 = deviceData.prodBusiness || '';
        // 如果设备重量有值，也进行回显
        if (deviceData.weight) {
          activeSlingData.value.equipmentWeight = parseFloat(deviceData.weight) || 0;
        }
      } else if (isCrane2) {
        // 起重机2参数tab回显
        formData.value.equipmentName2 = deviceData.deviceName || '';
        formData.value.equipmentType2 = deviceData.deviceType || '';
        // 将设备重量赋值给起重机2的设备重量(G)
        if (deviceData.weight) {
          formData.value.equipmentWeight = parseFloat(deviceData.weight) || 0;
        }
      } else {
        // 起重机1参数tab回显
        formData.value.equipmentName = deviceData.deviceName || '';
        formData.value.equipmentType = deviceData.deviceType || '';
        // 将设备重量赋值给起重机1的设备重量(G)
        if (deviceData.weight) {
          formData.value.equipmentWeight = parseFloat(deviceData.weight) || 0;
        }
      }
    }
  } catch (error) {
    ElMessage.error('获取设备详情失败');
    console.error('获取设备详情失败:', error);
  }
};

// 处理设备选择变化
const handleDeviceChange = (deviceId, isSlingTab = false, isCrane2 = false) => {
  if (deviceId) {
    getDeviceDetailAndEcho(deviceId, isSlingTab, isCrane2);
  } else {
    // 当清空设备名称时，清除相应的回显信息
    if (isSlingTab) {
      // 清除吊索具tab回显信息
      activeSlingData.value.equipmentName = '';
      activeSlingData.value.equipmentModel = '';
      activeSlingData.value.manufacturer2 = '';
      activeSlingData.value.equipmentWeight = 0;
    } else if (isCrane2) {
      // 清除起重机2参数tab回显信息
      formData.value.equipmentName2 = '';
      formData.value.equipmentType2 = '';
      formData.value.manufacturer2 = '';
      formData.value.equipmentWeight = 0;
    } else {
      // 清除起重机1参数tab回显信息
      formData.value.equipmentName = '';
      formData.value.equipmentType = '';
      formData.value.manufacturer = '';
      formData.value.equipmentWeight = 0;
    }
  }
};

// 打开智能选型弹窗
const openIntelligentSelection = (craneIndex) => {
  currentCraneIndex.value = craneIndex;
  intelligentSelectionDialogVisible.value = true;
};

// 执行智能选型
const executeIntelligentSelection = async () => {
  // 先判断是否选择了设备名称
  if (!selectedDeviceId.value) {
    ElMessage.warning('请先选择设备名称');
    return;
  }
  
  // 判断设备重量是否有值且大于0
  if (!formData.value.equipmentWeight || formData.value.equipmentWeight <= 0) {
    ElMessage.warning('设备重量必须大于0');
    return;
  }
  
  try {
    intelligentSelectionLoading.value = true;
    const weight = formData.value.equipmentWeight; // 使用设备重量，如果没有则使用默认值10
    const response = await intelligentCraneSelection({ mainHookMaxCapacity: weight });
    if (response.code === '0' && response.data) {
      selectionResults.value = response.data;
    } else {
      ElMessage.error('获取智能选型结果失败');
      selectionResults.value = [];
    }
  } catch (error) {
    ElMessage.error('智能选型失败');
    console.error('智能选型失败:', error);
    selectionResults.value = [];
  } finally {
    intelligentSelectionLoading.value = false;
  }
};

// 选择起重机结果
const selectCraneResult = async (result) => {
  // 查找对应的起重机ID
  const crane = craneList.value.find(c => c.id === result.craneInfoId);
  
  if (crane) {
    // 根据当前起重机索引设置选中的起重机
    if (currentCraneIndex.value === 0) {
      selectedCraneId.value = crane.id;
      await handleCraneChange(crane.id, false);
    } else {
      selectedCraneId2.value = crane.id;
      await handleCraneChange(crane.id, true);
    }
    intelligentSelectionDialogVisible.value = false;
    ElMessage.success('起重机选择成功');
  } else {
    ElMessage.error('未找到对应的起重机');
  }
};

// 处理起重机选择变化
const handleCraneChange = async (craneId, isSecondCrane = false) => {
  const crane = craneList.value.find(c => c.id === craneId);
  if (crane) {
    try {
      // 调用起重机详情接口获取详细数据
      const response = await getCraneDataDetail(craneId);
      const craneData = response.data.sysProjectTemplateCraneDetail || {};
      
      // 将接口返回的mainHookWeight赋值给重量计算设置版块的吊钩重量G1
      formData.value.hookWeightG1 = craneData.mainHookWeight !== undefined ? craneData.mainHookWeight : formData.value.hookWeightG1;
      
      // 将接口返回的mainHookMaxCapacity赋值给默认值G0字段
      formData.value.G0 = craneData.mainHookMaxCapacity !== undefined ? craneData.mainHookMaxCapacity : formData.value.G0;
      
      // 同时更新doubleResult对象中的equipmentWeight和G0字段
      if (craneData.mainHookMaxCapacity !== undefined) {
        doubleResult.equipmentWeight = craneData.mainHookMaxCapacity;
        doubleResult.G0 = craneData.mainHookMaxCapacity;
      }
      // 根据是否为第二台起重机，填充对应的参数
      if (isSecondCrane) {
        // 填充第二台起重机参数
           //生产厂家
         formData.value.manufacturer2 = response.data.sysProjectTemplateCrane?.prodBusiness || '';
         //车体配重重量
        formData.value.hookWeight = craneData.counterweight !== undefined ? craneData.counterweight : 1;
        //吊钩最大起升吊高度
        formData.value.hookHeight = craneData.maxLiftingHeight !== undefined ? craneData.maxLiftingHeight : 12;
        //超起平衡重量
        formData.value.superLiftWeight = craneData.superLiftCounterweightWeight !== undefined ? craneData.superLiftCounterweightWeight : 12;
        //超起平衡回转半径
        formData.value.superLiftRadius = craneData.superLiftCounterweightRadius !== undefined ? craneData.superLiftCounterweightRadius : 12;
      } else {
        // 填充第一台起重机参数
          //生产厂家
           formData.value.manufacturer = response.data.sysProjectTemplateCrane?.prodBusiness || '';
         //车体配重重量
        formData.value.hookWeight = craneData.counterweight !== undefined ? craneData.counterweight : 1;
        //吊钩最大起升吊高度
        formData.value.hookHeight = craneData.maxLiftingHeight !== undefined ? craneData.maxLiftingHeight : 12;
        //超起平衡重量
        formData.value.superLiftWeight = craneData.superLiftCounterweightWeight !== undefined ? craneData.superLiftCounterweightWeight : 12;
        //超起平衡回转半径
        formData.value.superLiftRadius = craneData.superLiftCounterweightRadius !== undefined ? craneData.superLiftCounterweightRadius : 12;
      }
    } catch (error) {
      console.error('获取起重机详情失败:', error);
      // 如果接口调用失败，使用基础数据填充
      if (isSecondCrane) {
        formData.value.craneName2 = crane.craneName || '';
        formData.value.manufacturer2 = crane.manufacturer || '';
        formData.value.model2 = crane.model || '';
      } else {
        formData.value.craneName = crane.craneName || '';
        formData.value.manufacturer = crane.manufacturer || '';
        formData.value.model = crane.model || '';
      }
    }
  }
};

// 初始化时加载列表
loadDeviceList();
loadCraneList();

const handleTabChange = (tabName) => {
  // 处理标签页切换逻辑
  console.log("切换到标签页:", tabName);
};

const formData = ref({
  // 起重机1参数
  craneName: "",
  equipmentName: "",
  manufacturer: "",
  equipmentNumber: "",
  model: "",
  equipmentType: "",
  ratedLoad: 12,
  boomType: 0, // 添加吊臂类型字段，默认值为主臂
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
  craneName2: "",
  equipmentName2: "",
  manufacturer2: "",
  equipmentNumber2: "",
  model2: "",
  equipmentType2: "",
  ratedLoad2: 12,
  boomType2: 0, // 添加吊臂类型字段，默认值为主臂
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
  liftingMethod: "single",
  crane1Distance: 0,
  crane1Weight: 0,
  crane2Distance: 0,
  crane2Weight: 0,
  G0: 65, // 添加G0字段，默认值为65

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
  otherWeightG4: 0,
});

// 监听起重机1参数变化，自动调用getCalculateInfo接口
watch(
  () => [
    formData.value.mainBoomLength,
    formData.value.mainBoomAngle,
    formData.value.auxBoomLength,
    formData.value.auxBoomAngle,
    formData.value.boomType
  ],
  async (newValues) => {
    // 确保所有必要参数都有值
    if (newValues.every(val => val !== undefined && val !== null && val !== '')) {
      try {
        const response = await getCalculateInfo({
          l1: formData.value.mainBoomLength,
          theta1: formData.value.mainBoomAngle,
          l2: formData.value.auxBoomLength,
          theta2: formData.value.auxBoomAngle,
          craneType: craneType,// 起重机类型
          armType: formData.value.boomType//吊臂类型
        });
        
        if (response.code === '0' && response.data) {
          // 更新作业半径和额定载荷
          formData.value.workRadius = response.data.workRadius;
          // 从cranePerformanceData中获取liftingCapacity
          if (response.data.cranePerformanceData && response.data.cranePerformanceData.liftingCapacity) {
            formData.value.ratedLoad = response.data.cranePerformanceData.liftingCapacity;
          }
        }
      } catch (error) {
        console.error('调用getCalculateInfo接口失败:', error);
        // 错误处理：可以选择显示提示或者忽略，不影响用户操作
      }
    }
  },
  { immediate: false, deep: true }
);

// 监听起重机2参数变化，自动调用getCalculateInfo接口
watch(
  () => [
    formData.value.mainBoomLength2,
    formData.value.mainBoomAngle2,
    formData.value.auxBoomLength2,
    formData.value.auxBoomAngle2,
    formData.value.boomType2
  ],
  async (newValues) => {
    // 确保所有必要参数都有值
    if (newValues.every(val => val !== undefined && val !== null && val !== '')) {
      try {
        const response = await getCalculateInfo({
          l1: formData.value.mainBoomLength2,
          theta1: formData.value.mainBoomAngle2,
          l2: formData.value.auxBoomLength2,
          theta2: formData.value.auxBoomAngle2,
           craneType: craneType,// 起重机类型
          armType: formData.value.boomType2//吊臂类型
        });
        
        if (response.code === '0' && response.data) {
          // 更新作业半径和额定载荷
          formData.value.workRadius2 = response.data.workRadius;
          // 从cranePerformanceData中获取liftingCapacity
          if (response.data.cranePerformanceData && response.data.cranePerformanceData.liftingCapacity) {
            formData.value.ratedLoad2 = response.data.cranePerformanceData.liftingCapacity;
          }
        }
      } catch (error) {
        console.error('调用getCalculateInfo接口失败(起重机2):', error);
        // 错误处理：可以选择显示提示或者忽略，不影响用户操作
      }
    }
  },
  { immediate: false, deep: true }
);

// 吊索具校核计算表单数据数组，用于存储多个吊索具配置
const liftingFormDatas = ref([
  {
    id: 1,
    equipmentName: "",
    equipmentNumber: "",
    equipmentModel: "",
    equipmentWeight: 15,
    isUnbalanced: false,
    hasRope: false,
    deviceName: "",
    manufacturer: "",
    productModel: "", // 添加产品型号字段，默认值为SCC13000TM
    loadType: "magnetic", // New field for radio button selection, default to "magnetic" (破断拉力)
    safetyFactor: 1,
    ratedLoad: 0, // 添加额定载荷字段
    topPointCount: 1,
    bottomPointCount: 4,
    customLoop: "loop",
    distanceL1: 12,
    distanceL2: 12,
    distanceL3: 12,
    distanceL4: 12,
    distanceLa: 0, // 添加distanceLa字段
    beamWeight: 5, // 添加平衡梁重量字段
    beamLength: 6, // 添加平衡梁长度字段
    beamSlingWeight: 8, // 添加吊梁下部吊具重量字段
    enableL1: false, // Added new field
    enableL2: false, // Added new field
    enableL3: false, // Added new field
    enableL4: false, // Added new field
    enableLa: false, // 添加enableLa字段
    ropeLength: 1,
    height: null,
    angle: null,
    liftingType: "noBeam", // 添加这个字段，'noBeam'表示无吊梁，'withBeam'表示有吊梁
    slingType: "0", // Initialize slingType, as it's now part of the radio group, default to magnetic (钢丝绳)
    isDouble: false, // Added field for "是否打双" checkbox
    isSinglePointLifting: false, // 添加是否单点吊装字段
    isBottomSling: false, // 标识是否为下部吊索具，false为上部，true为下部
    liftingSystemItems: [
      { id: 1, order: 1, name: "动载系数", value: 1, checked: false },
      { id: 2, order: 2, name: "偏载系数", value: 1, checked: false },
      { id: 3, order: 3, name: "其他系数", value: 1, checked: false },
      { id: 4, order: 4, name: "", value: null, checked: false },
    ],
  },
]);

// 当前激活的吊索具配置索引
const activeSlingIndex = ref(0);

// 获取当前激活的吊索具配置
const activeSlingData = computed(() => {
  return liftingFormDatas.value[activeSlingIndex.value];
});

// 弹窗可见性状态
const singleCraneDialogVisible = ref(false);
const doubleCraneDialogVisible = ref(false);
// 吊索具计算结果弹窗状态
const liftingResultDialog1Visible = ref(false);
const liftingResultDialog2Visible = ref(false);
// 智能选型弹窗状态
const intelligentSelectionDialogVisible = ref(false);
const currentCraneIndex = ref(0); // 0表示第一台起重机，1表示第二台起重机
const selectionResults = ref([]); // 智能选型结果列表
const intelligentSelectionLoading = ref(false); // 智能选型加载状态
const liftingResultDialog3Visible = ref(false);
// 地基承载力计算结果弹窗状态
const foundationResultDialogVisible = ref(false);

// 弹窗可见性状态
const showSlingTypeDialog = ref(false);
const selectedSlingType = ref(""); // 'upper' or 'lower'

const showLiftingEquipmentDialog = ref(false);
const equipmentCategories = ref([]);
const equipmentProducts = ref([]);
const equipmentModels = ref([]);
const selectedCategory = ref(null);
const selectedProduct = ref(null);
const selectedModel = ref(null);

// 监听吊装类型变化，切换时重置吊索具配置到默认初始状态
watch(
  () => activeSlingData.value?.liftingType, // Use optional chaining to safely access liftingType
  (newType, oldType) => {
    // When switching from 'noBeam' to 'withBeam'
    if (newType === "withBeam" && oldType === "noBeam") {
      // 使用第一个吊索具作为模板
      const templateSling = liftingFormDatas.value[0];
      if (templateSling) {
        // 清空当前数据并创建新的上下部吊索具
        liftingFormDatas.value = [];

        // 创建上部吊索具01
        const upperSling = JSON.parse(JSON.stringify(templateSling));
        upperSling.id = 1;
        upperSling.isBottomSling = false;
        upperSling.liftingType = "withBeam";

        // 创建下部吊索具01，复制上部吊索具内容
        const lowerSling = JSON.parse(JSON.stringify(upperSling));
        lowerSling.id = 2;
        lowerSling.isBottomSling = true;
        lowerSling.bottomPointCount = 4; // 设置下部吊索具的下部吊点数量默认值为4

        // 添加到数组中，确保顺序正确
        liftingFormDatas.value.push(upperSling);
        liftingFormDatas.value.push(lowerSling);

        // 默认选中第一个（上部吊索具）
        activeSlingIndex.value = 0;
      }
    }
    // When switching from 'withBeam' to 'noBeam'
    else if (newType === "noBeam" && oldType === "withBeam") {
      // Keep the first sling (assuming it's the primary one) and reset its type
      const firstSling = liftingFormDatas.value.find((s) => s.id === 1); // Or the first one in the current list
      if (firstSling) {
        firstSling.liftingType = "noBeam";
        firstSling.isBottomSling = false; // Reset if it was a lower sling
        liftingFormDatas.value = [firstSling];
        activeSlingIndex.value = 0;
      }
    }
  }
);

// 添加新的吊索具配置
const addNewSling = () => {
  if (activeSlingData.value.liftingType === "withBeam") {
    // 有吊梁情况下，显示选择弹窗
    showSlingTypeDialog.value = true;
  } else if (activeSlingData.value.liftingType === "noBeam") {
    // 无吊梁情况下，保持原有逻辑
    const newId = liftingFormDatas.value.length + 1;
    // 复制当前吊索具配置作为新配置的基础
    const newSlingData = JSON.parse(JSON.stringify(activeSlingData.value));
    newSlingData.id = newId;
    liftingFormDatas.value.push(newSlingData);
  }
};

// 单点吊装复选框变化处理
const handleSinglePointLiftingChange = (val) => {
  if (val) {
    // 如果选中了单点吊装，设置下部吊点数量为1，并禁用输入框
    activeSlingData.value.bottomPointCount = 1;
  }
  // 如果取消选中，不禁用输入框，保持用户可编辑状态
};

// 选择吊索具类型并添加
const confirmAddSling = () => {
  if (!selectedSlingType.value) return;

  // 获取现有相同类型吊索具的数量，以生成正确的序号
  const isUpper = selectedSlingType.value === "upper";
  const existingSameTypeCount = liftingFormDatas.value.filter(
    (sling) =>
      sling.liftingType === "withBeam" && sling.isBottomSling === !isUpper
  ).length;

  // 找到第一个上部吊索具作为模板
  const upperSlingTemplate = liftingFormDatas.value.find(
    (sling) => sling.liftingType === "withBeam" && !sling.isBottomSling
  );

  if (upperSlingTemplate) {
    // 复制模板内容
    const newSlingData = JSON.parse(JSON.stringify(upperSlingTemplate));
    newSlingData.id = liftingFormDatas.value.length + 1;
    newSlingData.isBottomSling = !isUpper;

    // 如果是下部吊索具，设置下部吊点数量默认值为4
    if (!isUpper) {
      newSlingData.bottomPointCount = 4;
    }

    // 确保有独立的 liftingSystemItems
    newSlingData.liftingSystemItems = JSON.parse(
      JSON.stringify(
        newSlingData.liftingSystemItems || [
          { id: 1, order: 1, name: "动载系数", value: 1, checked: false },
          { id: 2, order: 2, name: "偏载系数", value: 1, checked: false },
          { id: 3, order: 3, name: "其他系数", value: 1, checked: false },
          { id: 4, order: 4, name: "", value: null, checked: false },
        ]
      )
    );

    // 添加到数组中
    liftingFormDatas.value.push(newSlingData);
  }

  // 重置选择并关闭弹窗
  selectedSlingType.value = "";
  showSlingTypeDialog.value = false;
};

// 关闭吊索具类型选择弹窗
const closeSlingTypeDialog = () => {
  selectedSlingType.value = "";
  showSlingTypeDialog.value = false;
};

// 获取吊索具序号
const getSlingIndex = (sling, isBottomSling) => {
  // 找出同类型吊索具的所有项
  const sameTypeSlings = liftingFormDatas.value.filter(
    (s) => s.liftingType === "withBeam" && s.isBottomSling === isBottomSling
  );

  // 找到当前吊索具在同类型中的索引
  const index = sameTypeSlings.findIndex((s) => s.id === sling.id);

  // 返回格式为01, 02, 03...的序号
  return index >= 0 ? `0${index + 1}` : "01";
};

// 删除指定索引的吊索具配置
const removeSling = (index) => {
  // 至少保留一个吊索具配置
  if (liftingFormDatas.value.length > 1) {
    liftingFormDatas.value.splice(index, 1);

    // 如果删除的是当前激活的配置或之前的配置，需要调整激活索引
    if (activeSlingIndex.value >= index) {
      activeSlingIndex.value = Math.max(0, activeSlingIndex.value - 1);
    }
  }
};

const weightItems = ref([
  { id: 1, order: 1, name: "动载系数", value: 1, checked: false },
  { id: 2, order: 2, name: "偏载系数", value: 1, checked: false },
  { id: 3, order: 3, name: "其他系数", value: 1, checked: false },
  { id: 4, order: 4, name: "", value: null, checked: false },
]);

// 吊索具系统设备表单数据
const liftingSystemItems = ref([
  { id: 1, order: 1, name: "动载系数", value: 1, checked: false },
  { id: 2, order: 2, name: "偏载系数", value: 1, checked: false },
  { id: 3, order: 3, name: "其他系数", value: 1, checked: false },
  { id: 4, order: 4, name: "", value: null, checked: false },
]);

// 添加新行的函数
const addNewRow = () => {
  const newId =
    weightItems.value.length > 0
      ? Math.max(...weightItems.value.map((item) => item.id)) + 1
      : 1;
  weightItems.value.push({
    id: newId,
    order: weightItems.value.length + 1,
    name: "",
    value: null,
    checked: false,
  });
};

// 处理输入变化的函数
const handleInputChange = (index) => {
  // 如果是最后一行，并且该行已经有内容，则添加新行
  if (index === weightItems.value.length - 1) {
    const currentItem = weightItems.value[index];
    if (
      (currentItem.name && currentItem.name.trim() !== "") ||
      (currentItem.value !== null &&
        currentItem.value !== undefined &&
        currentItem.value !== "")
    ) {
      addNewRow();
    }
  }
};

const handleLiftingSystemInputChange = (index) => {
  // Auto-add new row logic if needed
  if (index === activeSlingData.value.liftingSystemItems.length - 1) {
    const currentItem = activeSlingData.value.liftingSystemItems[index];
    if (
      (currentItem.name && currentItem.name.trim() !== "") ||
      (currentItem.value !== null &&
        currentItem.value !== undefined &&
        currentItem.value !== "")
    ) {
      // 如果当前行已有内容且不到10行，添加新行
      if (activeSlingData.value.liftingSystemItems.length < 10) {
        const newId =
          Math.max(
            ...activeSlingData.value.liftingSystemItems.map((item) => item.id)
          ) + 1;
        activeSlingData.value.liftingSystemItems.push({
          id: newId,
          order: activeSlingData.value.liftingSystemItems.length + 1,
          name: "",
          value: null,
          checked: false,
        });
      }
    }
  }
};

// 计算属性：获取当前激活吊索具的已选中重量系数项
const activeLiftingSystemItems = computed(() => {
  return activeSlingData.value.liftingSystemItems.filter(
    (item) => item.checked && item.name && item.value !== null
  );
});

// 计算角度的正弦值（将角度转换为弧度后再计算正弦值）
const calculateSinValue = (angle) => {
  if (!angle || isNaN(angle)) return 0;
  // 将角度转换为弧度：弧度 = 角度 × π / 180
  const radians = (angle * Math.PI) / 180;
  // 计算正弦值
  return Math.sin(radians);
};

// 计算吊索具校核结果
const calculateLiftingResult = (sling) => {
  // 获取选中的系数项
  const selectedFactors = sling.liftingSystemItems.filter(
    (item) => item.checked && item.name && item.value !== null
  );

  // 计算系数乘积
  let factorProduct = 1;
  selectedFactors.forEach((factor) => {
    factorProduct *= factor.value;
  });

  // 计算角度的正弦值
  const sinQ = calculateSinValue(sling.angle);

  // 计算单条吊索的受力（假设平均分配）
  let forcePerSling = 0;
  let result = 0;
  let isQualified = false;

  if (sling.liftingType === "noBeam") {
    // 无吊梁情况
    if (sling.topPointCount === 1 && sling.bottomPointCount === 1) {
      // 场景一：无吊梁且上/下部吊点数量均为1
      forcePerSling =
        (sling.equipmentWeight / sling.bottomPointCount) * factorProduct;

      if (sling.loadType === "magnetic") {
        // 破断拉力安全系数算法
        result = sling.safetyFactor / forcePerSling;
        isQualified = result > 6;
      } else {
        // 额定载荷算法
        result = (forcePerSling / sling.ratedLoad) * 100;
        isQualified = result < 100;
      }
    } else if (sling.bottomPointCount > 1) {
      // 场景二：无吊梁且下部吊点数量大于1
      forcePerSling =
        ((sling.equipmentWeight / sling.bottomPointCount) * factorProduct) /
        sinQ;
      if (sling.loadType === "magnetic") {
        // 破断拉力情况
        result = sling.safetyFactor / forcePerSling;
        isQualified = result > 6;
      } else {
        // 额定载荷情况
        result = (forcePerSling / sling.ratedLoad) * 100;
        isQualified = result < 100;
      }
    }
  } else if (sling.liftingType === "withBeam") {
    // 有吊梁情况，需要区分上部吊索具和下部吊索具
    if (sling.isBottomSling) {
      // 下部吊索具
      forcePerSling =
        ((sling.equipmentWeight / sling.bottomPointCount) * factorProduct) /
        sinQ;
      if (sling.loadType === "magnetic") {
        // 下部吊索具且为破断拉力
        result = sling.safetyFactor / forcePerSling;
        isQualified = result > 6;
      } else {
        // 下部吊索具且为额定载荷
        result = (forcePerSling / sling.ratedLoad) * 100;
        isQualified = result < 100;
      }
    } else {
      // 上部吊索具
      const totalWeight =
        sling.equipmentWeight + sling.beamWeight + sling.beamSlingWeight;
      forcePerSling =
        ((totalWeight / sling.bottomPointCount) * factorProduct) / sinQ;
      if (sling.loadType === "magnetic") {
        // 上部吊索具且为破断拉力
        result = sling.safetyFactor / forcePerSling;
        isQualified = result > 6;
      } else {
        // 上部吊索具且为额定载荷
        result = (forcePerSling / sling.ratedLoad) * 100;
        isQualified = result < 100;
      }
    }
  }

  // 默认返回
  return {
    result: result,
    isQualified: isQualified,
  };
};

// 显示吊索具计算结果
const showLiftingResult = () => {
  // 非空校验
    if (!selectedSlingDeviceId.value) {
    ElMessage.warning('请选择设备名称');
    return;
  }
  if (!activeSlingData.value.deviceName) {
    ElMessage.warning('请输入吊索具名称');
    return;
  }
  if (!activeSlingData.value.height || parseFloat(activeSlingData.value.height) <= 0) {
    ElMessage.warning('请计算有效的吊索具高度');
    return;
  }
  if (!activeSlingData.value.angle || parseFloat(activeSlingData.value.angle) <= 0) {
    ElMessage.warning('请计算有效的吊索具角度');
    return;
  }
  
  // 场景判断
  if (activeSlingData.value.liftingType === "noBeam") {
    // 无吊梁情况
    if (
      activeSlingData.value.topPointCount === 1 &&
      activeSlingData.value.bottomPointCount === 1
    ) {
      // 场景一：无吊梁且上/下部吊点数量均为1
      liftingResultDialog1Visible.value = true;
    } else if (activeSlingData.value.bottomPointCount > 1) {
      // 场景二：无吊梁且下部吊点数量大于1
      liftingResultDialog2Visible.value = true;
    }
  } else if (activeSlingData.value.liftingType === "withBeam") {
    // 场景三：有吊梁
    liftingResultDialog3Visible.value = true;
  }
};

// 单机吊装计算结果数据
const singleResult = ref({
  liftingMethod: "单机吊装",
  craneName: "",
  equipmentName: "",
  totalWeight: 0,
  otherParams: "",
  hookWeight: 0,
  wireRopeWeight: 0,
  slingsWeight: 0,
  otherWeight: 0,
  equipmentWeight: 0,
  factorDisplay: "", // Added to hold the formatted factor string
  factorProduct: 1, // Initialize to 1
  calculationResult: 0,
  isQualified: false,
  selectedFactors: [], // Added to hold the selected factors for display
});

// 双机吊装计算结果数据
const doubleResult = ref({
  liftingMethod: "双机吊装",
  craneName1: "",
  craneName2: "",
  equipmentName: "",
  totalWeight: 0,
  otherParams: "",
  hookWeight: 0,
  wireRopeWeight: 0,
  slingsWeight: 0,
  otherWeight: 0,
  equipmentWeight: 65, // 默认取65 双机吊装G0的值
  G0: 65, // 添加专门的G0字段
  factorDisplay: "", // Added to hold the formatted factor string
  factorProduct: 1, // Initialize to 1
  calculationResult1: 0,
  calculationResult2: 0,
  isQualified1: false,
  isQualified2: false,
  selectedFactors: [], // Added to hold the selected factors for display
});

// 显示计算结果弹窗
const showCalculationResult = () => {
  // 根据当前激活的起重机参数tab进行相应的非空校验
  if (craneParamsTab.value === 'crane1') {
    // 起重机参数1内容下，只校验起重机1的名称和设备名称
    if (!selectedCraneId.value) {
      ElMessage.warning('请选择起重机名称');
      return;
    }
    if (!selectedDeviceId.value) {
      ElMessage.warning('请选择设备名称');
      return;
    }
  } else if (craneParamsTab.value === 'crane2') {
    // 起重机参数2内容下，只校验起重机2的名称和设备名称
    if (!selectedCraneId2.value) {
      ElMessage.warning('请选择起重机2的名称');
      return;
    }
    if (!selectedDeviceId2.value) {
      ElMessage.warning('请选择起重机2的设备名称');
      return;
    }
  }
  // 收集选中的重量参数
  let equipmentWeight = formData.value.isEquipmentWeightChecked
    ? formData.value.equipmentWeight
    : 0;
  let hookWeightG1 = formData.value.isHookWeightChecked
    ? formData.value.hookWeightG1
    : 0;
  let wireRopeWeightG2 = formData.value.isWireRopeWeightChecked
    ? formData.value.wireRopeWeightG2
    : 0;
  let slingsWeightG3 = formData.value.isSlingsWeightChecked
    ? formData.value.slingsWeightG3
    : 0;
  let otherWeightG4 = formData.value.isOtherWeightChecked
    ? formData.value.otherWeightG4
    : 0;

  // 获取选中的系数项
  const selectedFactors = weightItems.value.filter(
    (item) => item.checked && item.name && item.value !== null
  );

  // 计算系数乘积
  let factorProduct = 1;
  selectedFactors.forEach((factor) => {
    factorProduct *= factor.value;
  });

  // 计算总重量
  const totalWeight =
    equipmentWeight +
    hookWeightG1 +
    wireRopeWeightG2 +
    slingsWeightG3 +
    otherWeightG4;

  // 根据吊装方式显示不同的弹窗
  if (formData.value.liftingMethod === "single") {
    // 单机吊装计算
    const calculationResult =
      (((equipmentWeight +
        hookWeightG1 +
        wireRopeWeightG2 +
        slingsWeightG3 +
        otherWeightG4) *
        factorProduct) /
        formData.value.ratedLoad) *
      100;

    // 填充单机吊装结果数据
    singleResult.value = {
      liftingMethod: "单机吊装",
      craneName: formData.value.craneName,
      equipmentName: formData.value.equipmentName,
      totalWeight: totalWeight.toFixed(2),
      otherParams: `吊钩重量${hookWeightG1.toFixed(
        2
      )}t、计算钢丝绳重量${wireRopeWeightG2.toFixed(
        2
      )}t、吊索具重量${slingsWeightG3.toFixed(
        2
      )}t、其他计算重量${otherWeightG4.toFixed(2)}t`,
      hookWeight: hookWeightG1.toFixed(2),
      wireRopeWeight: wireRopeWeightG2.toFixed(2),
      slingsWeight: slingsWeightG3.toFixed(2),
      otherWeight: otherWeightG4.toFixed(2),
      equipmentWeight: equipmentWeight.toFixed(2),
      calculationResult: calculationResult.toFixed(2),
      isQualified: calculationResult < 100, // 修改合格判断逻辑，等于100%时不满足要求
      selectedFactors: selectedFactors,
    };

    singleCraneDialogVisible.value = true;
  } else {
    // 双机吊装计算，使用formData中的G0值，如果不存在则使用默认值65
    const G0 = formData.value.G0 !== undefined ? formData.value.G0 : 65;
    const calculationResult1 =
      (((G0 +
        hookWeightG1 +
        wireRopeWeightG2 +
        slingsWeightG3 +
        otherWeightG4) *
        factorProduct) /
        formData.value.ratedLoad) *
      100;
    const calculationResult2 =
      (((G0 +
        hookWeightG1 +
        wireRopeWeightG2 +
        slingsWeightG3 +
        otherWeightG4) *
        factorProduct) /
        formData.value.ratedLoad2) *
      100;

    // 填充双机吊装结果数据
    doubleResult.value = {
      liftingMethod: "双机吊装",
      craneName1: formData.value.craneName || "起重机1",
      craneName2: formData.value.craneName2 || "起重机2",
      equipmentName: formData.value.equipmentName,
      totalWeight: totalWeight.toFixed(2),
      otherParams: `吊钩重量${hookWeightG1.toFixed(
        2
      )}t、计算钢丝绳重量${wireRopeWeightG2.toFixed(
        2
      )}t、吊索具重量${slingsWeightG3.toFixed(
        2
      )}t、其他计算重量${otherWeightG4.toFixed(2)}t`,
      hookWeight: hookWeightG1.toFixed(2),
      wireRopeWeight: wireRopeWeightG2.toFixed(2),
      slingsWeight: slingsWeightG3.toFixed(2),
      otherWeight: otherWeightG4.toFixed(2),
      equipmentWeight: equipmentWeight.toFixed(2),
      G0: G0, // 存储实际使用的G0值
      calculationResult1: calculationResult1.toFixed(2),
      calculationResult2: calculationResult2.toFixed(2),
      isQualified1: calculationResult1 < 75, // 修改合格判断逻辑，等于75%时不满足要求
      isQualified2: calculationResult2 < 75, // 修改合格判断逻辑，等于75%时不满足要求
      selectedFactors: selectedFactors,
    };

    doubleCraneDialogVisible.value = true;
  }
};

const projectTitle = ref("XXXX设备吊装项目方案");

// 编辑标题的弹窗相关数据
const editTitleDialogVisible = ref(false);
const newTitle = ref("");

// 打开编辑标题弹窗
const openEditTitleDialog = () => {
  newTitle.value = projectTitle.value;
  editTitleDialogVisible.value = true;
};

// 确认修改标题
const confirmEditTitle = () => {
  if (newTitle.value.trim()) {
    projectTitle.value = newTitle.value.trim();
  }
  editTitleDialogVisible.value = false;
};

// 取消修改标题
const cancelEditTitle = () => {
  editTitleDialogVisible.value = false;
};

// 地基承载力校核计算数据
const foundationData = ref({
  foundationName: "",
  foundationPoint: "Q345D钢基础结构",
  centerMark: "xxxx",
  number: "H-00000",
  calculationPoint: "center",
  foundationType: "concrete",
  compactionCoeff: 1.0,
  bearingCapacity: 200.0,
  gravityAccel: 9.8,
  craneType: "truck",
  trackName: "",
  trackModel: "",
  trackWidthB: 0,
  trackGroundLengthL4: 0,
  craneWeightW: 0,
  driveWheelOffGround: false,
  idlerWheelOffGround: false,
});

// 地基承载力计算结果弹窗数据
const foundationCalculationResult = ref({
  trackInfo: {
    name: "",
    model: "",
    specifications: "",
  },
  otherParams: {
    groundLength: "",
  },
  calculationProcess: {
    area: 0,
    pressure: 0,
  },
});

// 地基承载力计算方法
const calculateFoundation = () => {
  // 计算接地面积 A = L4 × 2B1
  const groundArea =
    foundationData.value.trackGroundLengthL4 *
    2 *
    foundationData.value.trackWidthB;

  // 计算平均接地比压 T = W × g / A
  const averagePressure =
    (foundationData.value.craneWeightW * foundationData.value.gravityAccel) /
    groundArea;

  // 准备计算结果数据
  foundationCalculationResult.value = {
    trackInfo: {
      name: foundationData.value.trackName || "S",
      model: foundationData.value.trackModel || "HS-0000",
      specifications: `左侧履带宽度${
        foundationData.value.trackWidthB || 26
      }m、右侧履带宽度${
        foundationData.value.trackWidthB || 26
      }m、起重机设计自重、重力加速度。`,
    },
    otherParams: {
      groundLength: `${foundationData.value.trackGroundLengthL4 || 6}m`,
    },
    calculationProcess: {
      area: groundArea,
      pressure: averagePressure,
    },
  };

  // 显示计算结果弹窗
  foundationResultDialogVisible.value = true;
};

// 重置地基承载力数据
const resetFoundation = () => {
  foundationData.value = {
    foundationName: "",
    foundationPoint: "Q345D钢基础结构",
    centerMark: "xxxx",
    number: "H-00000",
    calculationPoint: "center",
    foundationType: "concrete",
    compactionCoeff: 1.0,
    bearingCapacity: 200.0,
    gravityAccel: 9.8,
    craneType: "truck",
    trackName: "",
    trackModel: "",
    trackWidthB: 0,
    trackGroundLengthL4: 0,
    craneWeightW: 0,
    driveWheelOffGround: false,
    idlerWheelOffGround: false,
  };
};

// 关闭地基承载力计算结果弹窗
const handleFoundationDialogClose = () => {
  foundationResultDialogVisible.value = false;
};

const copyFoundationResult = () => {
  const resultText = `
xxxxx方案项目地基承载力校核计算

履带信息
履带名称：${foundationCalculationResult.value.trackInfo.name}  型号：${
    foundationCalculationResult.value.trackInfo.model
  }
规格型号：${foundationCalculationResult.value.trackInfo.specifications}

其它参数
接地长度 ${foundationCalculationResult.value.otherParams.groundLength}

计算过程
第一步：已知履带接地长度和履带宽度，可以计算出接地面积
接地面积公式为
A = L4 × 2B1

L4：履带接地长度=${foundationData.value.trackGroundLengthL4}m
B1：左或右侧履带板宽度=${foundationData.value.trackWidthB}m

履带接地面积计算结果A= ${foundationCalculationResult.value.calculationProcess.area.toFixed(
    2
  )} m²

第二步：根据起重机设计自重和重力加速度，以及得出的接地面积计算出平均接地比压
平均接地比压按公式为
T = W × g / A

W：起重机设计自重=${foundationData.value.craneWeightW}t
g：重力加速度=${foundationData.value.gravityAccel} m/s²
A：履带接地面积=${foundationCalculationResult.value.calculationProcess.area.toFixed(
    2
  )} m²

T:履带平均接地比压= ${foundationCalculationResult.value.calculationProcess.pressure.toFixed(
    0
  )}t

结论
履带平均接地比压计算结果为${foundationCalculationResult.value.calculationProcess.pressure.toFixed(
    0
  )}t
  `.trim();

  // 复制到剪贴板
  navigator.clipboard
    .writeText(resultText)
    .then(() => {
      ElMessage.success("计算结果已复制到剪贴板");
    })
    .catch(() => {
      ElMessage.error("复制失败，请手动复制");
    });
};

// 打开吊索具配置选择弹窗
const openLiftingEquipmentDialog = async () => {
  showLiftingEquipmentDialog.value = true;
  // 重置选择状态
  selectedCategory.value = null;
  selectedProduct.value = null;
  selectedModel.value = null;
  equipmentProducts.value = [];
  equipmentModels.value = [];

  // 加载一级分类数据
  await fetchCategories();
};

// 获取一级分类数据
const fetchCategories = async () => {
  try {
    const response = await getLiftingMenuOne(0);
    if (response && response.data) {
      equipmentCategories.value = response.data;
    }
  } catch (error) {
    console.error("获取吊索具分类失败:", error);
    ElMessage.error("获取吊索具分类失败");
  }
};

// 选择一级分类
const selectCategory = async (category) => {
  selectedCategory.value = category;
  selectedProduct.value = null;
  selectedModel.value = null;
  equipmentModels.value = [];

  // 加载二级产品数据
  await fetchProducts(category.liftingType);
};

// 获取二级产品数据
const fetchProducts = async (liftingType) => {
  try {
    const response = await getLiftingMenuTwo({
      pageNum: -1,
      pageSize: -1,
      liftingType: liftingType,
    });
    if (response && response.data && response.data.records) {
      equipmentProducts.value = response.data.records;
    }
  } catch (error) {
    console.error("获取吊索具产品失败:", error);
    ElMessage.error("获取吊索具产品失败");
  }
};

// 选择二级产品
const selectProduct = async (product) => {
  selectedProduct.value = product;
  selectedModel.value = null;

  // 加载三级型号数据
  await fetchModels(product.id);
};

// 获取三级型号数据
const fetchModels = async (liftingInfoId) => {
  try {
    const response = await getLiftingMenuThree({
      pageNum: -1,
      pageSize: -1,
      liftingInfoId: liftingInfoId,
    });
    if (response && response.data && response.data.records) {
      equipmentModels.value = response.data.records;
    }
  } catch (error) {
    console.error("获取吊索具型号失败:", error);
    ElMessage.error("获取吊索具型号失败");
  }
};

// 选择三级型号
const selectModel = (model) => {
  selectedModel.value = model;
};

// 确认选择
const confirmLiftingEquipmentSelection = async () => {
  if (!selectedModel.value) {
    ElMessage.warning("请选择完整的吊索具配置");
    return;
  }

  try {
    // 调用getLiftingDetail接口获取详细数据
    const response = await getLiftingDetail(selectedModel.value.id);
    if (response.code === '0' && response.data) {
      const liftingDetail = response.data;
      
      // 将选中的第二级菜单名称填充到吊索具名称输入框
      activeSlingData.value.deviceName =
        selectedProduct.value.liftingName  || selectedProduct.value.modelName;
      // 将接口返回的数据回显到吊索具配置输入框
      if (liftingDetail) {
        // 回显设备相关信息，使用第二级菜单的prodBusiness作为生产厂家
        activeSlingData.value.manufacturer = (selectedProduct.value && selectedProduct.value.prodBusiness) || liftingDetail.manufacturer || (selectedProduct.value ? selectedProduct.value.manufacturer : "");
        // 使用接口返回的deviceModel作为产品型号
        activeSlingData.value.productModel = liftingDetail.deviceModel || liftingDetail.productModel || (selectedProduct.value ? selectedProduct.value.productModel : "");
        
        // 回显其他可能的字段
        if (liftingDetail.liftingType !== undefined) {
          // 根据分类ID映射到slingType值
          // 0: 钢丝绳, 1: 吊带, 2: 卸扣, 3: 缆绳
          const typeMap = {
            0: "0", // 钢丝绳
            1: "1", // 吊带
            2: "2", // 卸扣
            3: "3", // 缆绳
          };
          activeSlingData.value.slingType = typeMap[liftingDetail.liftingType] || "0";
        } else if (selectedCategory.value) {
          // 如果接口没有返回类型，使用已选择的分类
          const typeMap = {
            0: "0", // 钢丝绳
            1: "1", // 吊带
            2: "2", // 卸扣
            3: "3", // 缆绳
          };
          activeSlingData.value.slingType = typeMap[selectedCategory.value.liftingType] || "0";
        }
        
        // 回显其他可能的吊索具配置字段
        activeSlingData.value.loadCapacity = liftingDetail.loadCapacity || activeSlingData.value.loadCapacity;
        // 使用接口返回的miniLength作为绳索长度
        activeSlingData.value.ropeLength = liftingDetail.miniLength !== undefined ? liftingDetail.miniLength : (liftingDetail.length || activeSlingData.value.length);
        activeSlingData.value.diameter = liftingDetail.diameter || activeSlingData.value.diameter;
        activeSlingData.value.material = liftingDetail.material || activeSlingData.value.material;
        
        // 处理额定载荷(pq)相关逻辑
        if (liftingDetail.pq !== undefined && liftingDetail.pq !== null) {
          // 选中额定载荷选项
          activeSlingData.value.loadType = 'rope';
     
          // 设置额定载荷值
          activeSlingData.value.ratedLoad = liftingDetail.pq;
        }
        // 处理破断拉力(smalPull)相关逻辑
        if (liftingDetail.smalPull !== undefined && liftingDetail.smalPull !== null) {
          // 选中破断拉力选项
         activeSlingData.value.loadType = 'magnetic';
          // 设置出厂安全系数值
          activeSlingData.value.safetyFactor = liftingDetail.smalPull;
        }
      }

      ElMessage.success("吊索具配置选择成功并加载详情");
    }
  } catch (error) {
    console.error("获取吊索具详情失败:", error);
    ElMessage.error("获取吊索具详情失败，请重试");
    
    // 如果接口调用失败，仍然使用第三级菜单名称填充基本信息
    activeSlingData.value.deviceName =
      selectedProduct.value.liftingName  || selectedProduct.value.modelName;
    if (selectedProduct.value) {
      // 使用第二级菜单的prodBusiness作为生产厂家
      activeSlingData.value.manufacturer =
        (selectedProduct.value && selectedProduct.value.prodBusiness) || selectedProduct.value.manufacturer || "";
      activeSlingData.value.productModel =
        selectedProduct.value.productModel || "";
    }

    if (selectedCategory.value) {
      const typeMap = {
        0: "0", // 钢丝绳
        1: "1", // 吊带
        2: "2", // 卸扣
        3: "3", // 缆绳
      };
      activeSlingData.value.slingType =
        typeMap[selectedCategory.value.liftingType] || "0";
    }
  }
  closeLiftingEquipmentDialog();
};

// 关闭弹窗
const closeLiftingEquipmentDialog = () => {
  showLiftingEquipmentDialog.value = false;
  selectedCategory.value = null;
  selectedProduct.value = null;
  selectedModel.value = null;
  equipmentProducts.value = [];
  equipmentModels.value = [];
};

const isCalculatingHeightAngle = ref(false);

const handleCalculateHeightAngle = async () => {
  const data = activeSlingData.value;
  if (!data || data.liftingType !== 'noBeam') return;

  const fields = ["distanceL1", "distanceL2", "distanceL3", "distanceL4"];
  const values = fields.map((key) => Number(data[key]));

  if (values.some((val) => Number.isNaN(val) || val === null || val === undefined || val <= 0)) {
    ElMessage.warning("请完整填写距离L1至L4的数值");
    return;
  }

  const ropeLength = Number(data.ropeLength);
  if (Number.isNaN(ropeLength) || ropeLength <= 0) {
    ElMessage.warning("请先填写绳索长度");
    return;
  }

  const [L1, L2, L3, L4] = values;
  const avgLongSide = (L1 + L3) / 2;
  const avgShortSide = (L2 + L4) / 2;
  const centerDistance = Number(
    Math.sqrt((avgLongSide / 2) ** 2 + (avgShortSide / 2) ** 2).toFixed(4)
  );

  try {
    isCalculatingHeightAngle.value = true;
    const response = await getCalculateHeightOrAngle({
      ropeLength,
      distance: centerDistance,
    });

    if (response?.code === '0' && response.data) {
      if (typeof response.data.height === 'number') {
        data.height = response.data.height;
      }
      if (typeof response.data.angle === 'number') {
        data.angle = response.data.angle;
      }
      ElMessage.success("计算成功");
    } else {
      ElMessage.error(response?.message || "计算失败，请稍后重试");
    }
  } catch (error) {
    console.error('调用getCalculateHeightOrAngle失败:', error);
    ElMessage.error("计算失败，请稍后重试");
  } finally {
    isCalculatingHeightAngle.value = false;
  }
};

watch(liftingFormDatas, (newList) => {
  newList.forEach((item) => {
    if (item.height === undefined) item.height = null;
    if (item.angle === undefined) item.angle = null;
  });
});
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
  justify-content: space-between;
}

.header-left {
  display: flex;
  width: 30%;
  align-items: center;
  gap: 12px;
}
.header-left:hover {
  cursor: pointer;
}
.project-title {
  font-size: 14px;
  color: #333;
}

/* Tabs样式 */
.calculation-tabs {
  background: white;
  margin-left: -30%;
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
  margin-top: 15px;
}

.form-row {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  gap: 10px;
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
  background-color: #ffeebf;
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
  background-color: #ffeebf;
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
}

.diagram-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.found_img {
  gap: 20px;
  flex-direction: column;
}
.crane-diagram {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.edit {
  width: 16px;
  height: 16px;
  cursor: pointer;
  transition: transform 0.2s;
}

.edit:hover {
  transform: scale(1.1);
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
.found_bear {
  background: #0775db;
  color: white;
  width: 86px;
  height: 28px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.weight_set {
  margin-top: 15px;
  padding: 20px 15px;
  border: 1px solid #e5e5e5;
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
  background-color: #0775db;
  color: white;
}

/* 吊索具校核计算特有样式 */
.section-title-with-button {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 8px;
}

/* Updated sling component header styles to match reference design */
.sling-tabs-container {
  display: flex;
  align-items: center;
}

.sling-tab-wrapper {
  position: relative;
  margin-right: 10px;
}

.sling-tab-button {
  background: #1890ff;
  color: white;
  border: none;
  padding: 8px 24px;
  font-size: 14px;
  font-weight: 500;
  border-radius: 4px;
}

.sling-tab-button:hover {
  background: #40a9ff;
  color: white;
}

.sling-tab-button-inactive {
  background: #d4d4d4;
  color: #666;
}

.sling-tab-button-inactive:hover {
  background: #e0e0e0;
}

.remove-sling-button {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 16px;
  height: 16px;
  cursor: pointer;
  background: #d4d4d4;
  border-radius: 50%;
  padding: 2px;
}

.add-sling-button {
  width: 22px;
  height: 22px;
  padding: 0;
  font-size: 18px;
  background: white;
}
.add-sling-button:hover {
  cursor: pointer;
}

/* 吊索具结果卡片样式 */
.sling-result-card {
  margin-bottom: 20px;
  padding: 15px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  background-color: #fafafa;
}

.sling-result-card:last-child {
  margin-bottom: 0;
}

.sling-result-header {
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: 2px solid #409eff;
}

.sling-result-header h4 {
  margin: 0;
  color: #409eff;
  font-weight: bold;
}
.sling-component-header {
  background: #f0f0f0;
  padding: 8px 12px;
  margin-bottom: 16px;
  border-radius: 4px;
}

.component-label {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

/* Added inline radio group styling */
.inline-radio-group {
  margin-left: auto;
}

.manufacturer-input {
  max-width: 300px;
}

.hanging-method-select {
  width: 150px;
}

.error-text {
  color: #ff4d4f;
  font-size: 14px;
}

/* 添加与起重机校核计算tab下系数表格一致的样式 */
.system-table table {
  width: 100%;
  border-collapse: collapse;
}

.system-table th,
.system-table td {
  padding: 8px;
  text-align: center;
  border: 1px solid #e5e5e5;
  font-size: 14px;
}

.system-table th {
  background: #fafafa;
  font-weight: 600;
  color: #333;
}

.system-table td {
  color: #666;
}

.distance-inputs {
  display: flex;
  justify-content: space-around;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-top: 16px;
}

.distance-inputs .distance-inputs-left .form-row {
  margin-bottom: 16px;
  gap: 8px;
  display: flex;
  align-items: center;
}

.distance-inputs .distance-inputs-right {
  border: 1px solid #e7e7e7;
  background: #f6f6f6;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 16px;
}

/* Added checkbox styling for distance inputs */
.distance-inputs .form-row .el-checkbox {
  margin-right: 8px;
}

.distance-inputs .form-row .form-label {
  min-width: 80px;
  margin-right: 8px;
}

.distance-inputs-right .form-row {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}
.distance-inputs-right .form-row .form-label {
  text-align: left;
}

.distance-inputs-right .form-row:last-child {
  margin-bottom: 0;
}

.distance-inputs-right .form-row.full-width {
  width: 100%;
  justify-content: center;
}

.calculate-distance-btn {
  width: 100%;
}

/* 地基承载力计算结果弹窗样式 */
.foundation-result .info-row {
  display: flex;
  align-items: center;
  line-height: 1.8;
}

.foundation-result .info-label {
  color: #666;
  font-size: 14px;
}

.foundation-result .info-value {
  color: #333;
  font-size: 14px;
}

.foundation-result .weight-item {
  padding: 4px 0;
  color: #666;
  font-size: 14px;
}

.foundation-result .process-text {
  margin: 10px 0;
  color: #666;
  font-size: 14px;
  line-height: 1.6;
}

/* Added styles for construction plan iframe */
.construction-plan-wrapper {
  width: 100%;
  height: calc(100vh - 120px);
  padding: 0;
  overflow: hidden;
}

.method-draw-iframe {
  width: 100%;
  height: 100%;
  border: none;
}

/* Added styles for three-level lifting equipment selection dialog */
.lifting-equipment-selector {
  display: flex;
  gap: 1px;
  height: 500px;
  background-color: #e7e7e7;
}

.selector-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: white;
}

.column-header {
  padding: 12px 16px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #e7e7e7;
  font-weight: 500;
  font-size: 14px;
  color: #333;
}

.column-content {
  flex: 1;
  overflow-y: auto;
}

.selector-item {
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.2s;
  border-bottom: 1px solid #f5f5f5;
  font-size: 14px;
  color: #666;
}

.selector-item:hover {
  background-color: #f5f5f5;
}

.selector-item.active {
  background-color: #e6f7ff;
  color: #1890ff;
  font-weight: 500;
}

/* 滚动条样式 */
.column-content::-webkit-scrollbar {
  width: 6px;
}

.column-content::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.column-content::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.column-content::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 智能选型链接样式 */
.intelligent-selection-link {
  color: #1890ff;
  cursor: pointer;
  margin-left: 10px;
  font-size: 14px;
  text-decoration: underline;
}

.intelligent-selection-link:hover {
  color: #40a9ff;
}

/* 智能选型弹窗样式 */
.selection-result-item {
  padding: 12px;
  margin-bottom: 10px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
border: 1px solid #DEDEDE;
background: #FFF;
box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.07);
}

.selection-result-item:hover {
  border-color: #1890ff;
  background-color: #f5f5f5;
}

.selection-result-item .crane-title {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 8px;
  display: flex;
  justify-content: space-between;
}
.selection-result-item .crane-title .crane-title_info span{
  margin-left: 40px;
    font-weight: 400;
}
.selection-result-item .crane-info {
  font-size: 14px;
  color: #666;
  margin-bottom: 4px;
  display: flex;
  justify-content: space-between;
}
.selection-result-item .crane-content{
 display: flex;
 justify-content: space-between;
}
.selection-result-item .crane-content .crane-info{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 20%;
  border-right: 1px solid #D7D7D7;
}
.selection-result-item .crane-content .crane-info label{
margin-bottom: 10px;
}
.selection-result-item .crane-content .crane-info span{
color: #000;
font-size: 14px;
font-weight: 500;

}
.selection-params{
  display: flex;
  align-items: end;
}
.selection-params .selection-info{
  width: 60%;
  box-sizing: border-box;
  padding-right: 10%;
}
.selection-params .selection-params_button{

display: flex;
flex: 1;
padding: 10px 16px;
justify-content: end;
align-items: center;
gap: 10px;
flex-shrink: 0;
}
.selection-params .selection-params_button>div{
    border-radius: 9px;
    background: #EDF6FF;
border: 1px solid #9DD0FF;
    display: flex;
    align-items: center;
  justify-content: center;
width: 110px;
height: 56px;
color: #0775DB;
}
.selection-params .selection-params_button:hover{
  cursor: pointer;
}
.no-results{
  display: flex;
  justify-content: center;
}
</style>
