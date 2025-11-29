<template>
  <div class="site-plan-container">
    <!-- 页面顶部标题 -->
    <div class="page-header">
      <div class="header-content">
        <el-button type="text" class="back-btn" @click="handleBack">
          <el-icon><ArrowLeft /></el-icon>
        </el-button>
        <div class="project_title">{{ projectTitle || '总平规划xxx项目' }}</div>
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
          <div class="handle_btn_item" @click="handleSave">
            <img
              src="@/images/save.png"
              alt="保存"
              style="width: 20px; height: 20px; margin-right: 5px"
            /><span>保存</span>
          </div>
          <div class="handle_btn_item" @click="handleGenerateReport">
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
            /><span>{{ isPlayingAll ? '停止' : '预览' }}</span>
          </div>
          <!-- 全局录制按钮 -->
          <div class="handle_btn_item" @click="startGlobalRecording" v-if="!isGlobalRecording">
            <span>开始全局录制</span>
          </div>
          <div class="handle_btn_item" @click="stopGlobalRecording" v-if="isGlobalRecording">
            <span>结束全局录制</span>
          </div>
          <div class="handle_btn_item" @click="downloadGlobalRecording" v-if="globalRecordingBlob">
            <span>下载视频</span>
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
            placeholder="搜索起重机路径名称"
            prefix-icon="Search"
            size="small"
            clearable
          />
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
                style="width: 160px"
              />
            </div>
            <div class="property-item">
              <label>Y轴</label>
              <el-input-number
                v-model="newPoint.y"
                :precision="6"
                :step="0.1"
                placeholder="Y坐标"
                style="width: 160px"
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
                <label>地基承载力</label>
                <el-input-number
                  controls-position="right"
                  v-model="newPoint.groundLoad"
                  :min="0"
                  :step="1"
                  placeholder="10"
                />
                <span class="unit">t/m²</span>
              </div>
              <div class="property-item">
                <label>区域场地</label>
                <el-input v-model="newPoint.area" placeholder="区域场地" />
                  <span class="unit">m²</span>
              </div>
              <div class="property-item">
                <label>
                  开始日期
                  <span style="color: #f56c6c; margin-left: 4px;">*</span>
                </label>
                <el-date-picker
                  v-model="newPoint.startTime"
                  type="date"
                  placeholder="请选择开始日期"
                  value-format="YYYY-MM-DD"
                  format="YYYY-MM-DD"
                />
              </div>
              <div class="property-item">
                <label>
                  结束日期
                  <span style="color: #f56c6c; margin-left: 4px;">*</span>
                </label>
                <el-date-picker
                  v-model="newPoint.endTime"
                  type="date"
                  placeholder="请选择结束日期"
                  value-format="YYYY-MM-DD"
                  format="YYYY-MM-DD"
                />
              </div>
              <div class="property-item">
                <label>备注</label>
                <el-input
                  v-model="newPoint.remarks"
                  type="textarea"
                  :rows="3"
                  placeholder="请输入备注"
                  maxlength="500"
                  show-word-limit
                />
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
                style="width: 160px"
              />
            </div>
            <div class="property-item">
              <label>Y轴</label>
              <el-input-number
                v-model="editingPoint.y"
                :precision="6"
                :step="0.1"
                placeholder="Y坐标"
                style="width: 160px"
              />
            </div>
            
            <!-- 吊装点位特有字段 -->
            <template v-if="editingPoint.type === 'lifting'">
              <div class="point_title">占点设置</div>
              <div class="property-item">
                <label>地基承载力</label>
                <el-input-number
                  controls-position="right"
                  v-model="editingPoint.groundLoad"
                  :min="0"
                  :step="1"
                  placeholder="10"
                />
                <span class="unit">t/m²</span>
              </div>
              <div class="property-item">
                <label>区域场地</label>
                <el-input v-model="editingPoint.area" placeholder="区域场地" />
              </div>
              <div class="property-item">
                <label>
                  开始日期
                  <span style="color: #f56c6c; margin-left: 4px;">*</span>
                </label>
                <el-date-picker
                  v-model="editingPoint.startTime"
                  type="date"
                  placeholder="请选择开始日期"
                  value-format="YYYY-MM-DD"
                  format="YYYY-MM-DD"
                />
              </div>
              <div class="property-item">
                <label>
                  结束日期
                  <span style="color: #f56c6c; margin-left: 4px;">*</span>
                </label>
                <el-date-picker
                  v-model="editingPoint.endTime"
                  type="date"
                  placeholder="请选择结束日期"
                  value-format="YYYY-MM-DD"
                  format="YYYY-MM-DD"
                />
              </div>
              <div class="property-item">
                <label>备注</label>
                <el-input
                  v-model="editingPoint.remarks"
                  type="textarea"
                  :rows="3"
                  placeholder="请输入备注"
                  maxlength="500"
                  show-word-limit
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
        <div class="image-container">
          <div v-if="selectedCrane" class="drawing-toolbar">
            <div class="toolbar-headline">
              <div class="toolbar-title">绘制点位占位</div>
              <div class="toolbar-subtitle">
                {{ activePoint ? `当前点位：${activePoint.name}` : '请选择吊装点位' }}
              </div>
            </div>
            <div class="toolbar-divider"></div>
            <div class="toolbar-tools">
              <button
                v-for="tool in drawingToolOptions"
                :key="tool.type"
                class="tool-button"
                :class="[
                  `tool-${tool.type}`,
                  { active: activeDrawingTool === tool.type }
                ]"
                :title="tool.label"
                @click.stop="handleDrawingToolClick(tool.type)"
              >
                <span class="tool-icon" :class="`icon-${tool.type}`">
                  {{ tool.type === 'text' ? 'T' : '' }}
                </span>
              </button>
            </div>
            <div class="toolbar-divider"></div>
            <div class="toolbar-actions">
              <el-button
                size="small"
                type="default"
                class="clear-shapes-btn"
                :disabled="!canCompleteDrawing"
                @click="handleClearShapes"
              >
                清除
              </el-button>
              <el-button
                size="small"
                type="default"
                class="undo-shape-btn"
                :disabled="!activeShapeId"
                @click="handleUndoShape"
              >
                撤销
              </el-button>
            </div>
          </div>
          <!-- 施工场景平面图 -->
          <img
            ref="imageRef"
            src="@/images/planning.png"
            alt="总平规划图"
            class="plan-image"
            :style="{
              transform: `translate(${offsetX}px, ${offsetY}px) scale(${scale})`,
              transformOrigin: '0 0'
            }"
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
          <svg
            v-if="canvasSize.width && canvasSize.height"
            class="shape-overlay"
            :width="canvasSize.width"
            :height="canvasSize.height"
            :viewBox="`0 0 ${canvasSize.width} ${canvasSize.height}`"
            :style="{
              transform: `translate(${offsetX}px, ${offsetY}px) scale(${scale})`,
              transformOrigin: '0 0'
            }"
          >
            <g
              v-for="item in renderedShapeItems"
              :key="item.id"
              class="shape-overlay-item"
              :class="{ active: item.id === activeShapeId }"
              @mousedown.stop="handleShapeMouseDown(item, $event)"
            >
              <rect
                v-if="item.tool === 'rectangle'"
                class="shape-body"
                :x="item.canvasX - (item.config.width || 0) / 2"
                :y="item.canvasY - (item.config.height || 0) / 2"
                :width="item.config.width || 0"
                :height="item.config.height || 0"
                :fill="item.config.fill || 'rgba(255,255,255,0.2)'"
                :stroke="item.config.stroke || '#F59A23'"
                :transform="`rotate(${item.config.rotate || 0}, ${item.canvasX}, ${item.canvasY})`"
              />
              <circle
                v-else-if="item.tool === 'circle'"
                class="shape-body"
                :cx="item.canvasX"
                :cy="item.canvasY"
                :r="item.config.radius || MIN_RADIUS"
                :fill="item.config.fill || 'rgba(38,132,255,0.25)'"
                :stroke="item.config.stroke || '#2684FF'"
              />
              <polygon
                v-else-if="item.tool === 'triangle'"
                class="shape-body"
                :points="createTrianglePoints(item.canvasX, item.canvasY, item.config.size || MIN_TRIANGLE_SIZE, item.config.rotate || 0)"
                :fill="item.config.fill || 'rgba(245,108,108,0.25)'"
                :stroke="item.config.stroke || '#F56C6C'"
              />
              <path
                v-else-if="item.tool === 'sector'"
                class="shape-body"
                :d="createSectorPath(item.canvasX, item.canvasY, item.config.radius || MIN_RADIUS, item.config.rotate || 0, (item.config.rotate || 0) + (item.config.angle || 60))"
                :fill="item.config.fill || 'rgba(255,196,112,0.25)'"
                :stroke="item.config.stroke || '#F59A23'"
              />
              <text
                v-else-if="item.tool === 'text'"
                class="shape-text"
                :x="item.canvasX"
                :y="item.canvasY"
                :fill="item.config.color || '#1F2D3D'"
                :font-size="item.config.fontSize || 14"
                :transform="`rotate(${item.config.rotate || 0}, ${item.canvasX}, ${item.canvasY})`"
                text-anchor="middle"
                dominant-baseline="middle"
              >
                {{ item.config.text || '文字' }}
              </text>

              <!-- 边界框 -->
              <rect
                v-if="item.id === activeShapeId && isShapeResizable(item.tool) && getShapeBounds(item)"
                class="shape-bounding-box"
                :x="getShapeBounds(item).left"
                :y="getShapeBounds(item).top"
                :width="getShapeBounds(item).width"
                :height="getShapeBounds(item).height"
                fill="none"
                stroke="#409eff"
                stroke-width="1"
                stroke-dasharray="4 4"
              />
              
              <!-- 8个控制点 -->
              <g v-if="item.id === activeShapeId && isShapeResizable(item.tool)">
                <circle
                  v-for="(handle, index) in getResizeHandles(item)"
                  :key="index"
                  class="shape-resize-handle"
                  :class="`handle-${handle.position}`"
                  :cx="handle.x"
                  :cy="handle.y"
                  r="6"
                  @mousedown.stop="handleResizeMouseDown(item, $event, handle.position)"
                />
              </g>
            </g>
          </svg>
          
          <!-- 调试信息（开发环境显示） -->
          <div v-if="false" style="position: absolute; top: 10px; right: 10px; background: rgba(0,0,0,0.7); color: white; padding: 10px; font-size: 12px; z-index: 10000; border-radius: 4px;">
            <div>shapeOverlays: {{ shapeOverlays.length }}</div>
            <div>renderedShapeItems: {{ renderedShapeItems.length }}</div>
            <div>canvasSize: {{ canvasSize.width }}x{{ canvasSize.height }}</div>
            <div>selectedCrane: {{ selectedCrane?.name || '无' }}</div>
          </div>
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
              <label>地基承载力</label>
              <el-input-number
                controls-position="right"
                :precision="2"
                v-model="selectedCrane.load"
                :min="0"
                :step="1"
                placeholder="10"
              />
              <span class="unit">t/m²</span>
            </div>
          </div>
          <div class="point_setting">
            <div>点位设置</div>
            <!-- 如果没有起点，显示设置起点按钮 -->
            <div v-if="!hasStartPoint" class="setting_start">
              <!-- <img
                src="@/images/point.svg"
                alt="设置起点"
                style="width: 16px; height: 16px"
              /> -->
              <svg t="1762755830607" class="icon" viewBox="0 0 1024 1024" version="1.1"  p-id="7979" width="28" height="28"><path d="M337.92 890.88a173.056 46.08 0 1 0 346.112 0 173.056 46.08 0 1 0-346.112 0Z" opacity=".4" p-id="7980"></path><path d="M421.376 890.88a89.6 23.04 0 1 0 179.2 0 89.6 23.04 0 1 0-179.2 0Z" opacity=".4" p-id="7981"></path><path d="M512 891.392c-11.264 0-19.968-8.704-19.968-19.968v-250.88c0-11.264 8.704-19.968 19.968-19.968s19.968 8.704 19.968 19.968v250.88c0 11.264-8.704 19.968-19.968 19.968z" :fill="selectedCrane?.color || '#106848'" p-id="7982"></path><path d="M241.664 385.024c0 149.504 120.832 270.336 270.336 270.336s270.336-120.832 270.336-270.336c0-149.504-120.832-270.336-270.336-270.336-149.504 0-270.336 120.832-270.336 270.336z" :fill="selectedCrane?.color || '#07AA74'" p-id="7983"></path><path d="M463.36 474.624c16.896 5.632 37.888 7.168 64 7.168 18.432 0.512 106.496 0.512 128.512-0.512-4.096 6.656-9.216 19.456-11.264 28.16H527.36c-60.928 0-97.792-8.704-120.832-47.104-3.584 22.528-8.704 41.984-16.384 57.856-5.12-3.584-17.408-9.728-24.064-12.8 16.384-30.72 19.968-79.872 20.992-133.632l26.624 2.048c-0.512 13.824-1.024 27.648-2.048 40.448 6.144 19.456 14.336 33.28 25.088 43.52v-107.52H374.272v-25.088h56.32v-34.304h-48.64v-25.088h48.64v-31.744h27.136v31.744h47.104v25.088h-47.104v34.304h55.296v25.088h-49.664v40.448h46.592v25.088h-46.592v56.832z m142.336-200.192h-83.968v-25.6h111.104v105.984h-80.896v60.416c0 9.728 2.048 11.776 14.848 11.776h41.984c11.776 0 13.312-5.632 14.848-41.984 6.144 5.12 17.408 9.216 25.088 11.264-3.584 44.544-11.264 56.32-37.888 56.32H563.2c-30.208 0-39.424-7.68-39.424-36.864V329.728h80.896V274.432h1.024z" fill="#FFFFFF" p-id="7984"></path></svg>
              <span @click="setCranePosition">设置起点+</span>
            </div>
            <!-- 显示点位列表 -->
            <div
              v-for="(point, index) in selectedCrane.points"
              :key="point.id"
              class="point-item"
              :class="{ active: point.id === activePointId }"
              @click="handlePointItemClick(point)"
            >
              <div class="point-info">
                <!-- 根据点位类型和索引显示不同图标 -->
                   <svg    v-if="index === 0"  t="1762755830607" class="icon" viewBox="0 0 1024 1024" version="1.1"  p-id="7979" width="28" height="28"><path d="M337.92 890.88a173.056 46.08 0 1 0 346.112 0 173.056 46.08 0 1 0-346.112 0Z" opacity=".4" p-id="7980"></path><path d="M421.376 890.88a89.6 23.04 0 1 0 179.2 0 89.6 23.04 0 1 0-179.2 0Z" opacity=".4" p-id="7981"></path><path d="M512 891.392c-11.264 0-19.968-8.704-19.968-19.968v-250.88c0-11.264 8.704-19.968 19.968-19.968s19.968 8.704 19.968 19.968v250.88c0 11.264-8.704 19.968-19.968 19.968z" :fill="selectedCrane?.color || '#106848'" p-id="7982"></path><path d="M241.664 385.024c0 149.504 120.832 270.336 270.336 270.336s270.336-120.832 270.336-270.336c0-149.504-120.832-270.336-270.336-270.336-149.504 0-270.336 120.832-270.336 270.336z" :fill="selectedCrane?.color || '#07AA74'" p-id="7983"></path><path d="M463.36 474.624c16.896 5.632 37.888 7.168 64 7.168 18.432 0.512 106.496 0.512 128.512-0.512-4.096 6.656-9.216 19.456-11.264 28.16H527.36c-60.928 0-97.792-8.704-120.832-47.104-3.584 22.528-8.704 41.984-16.384 57.856-5.12-3.584-17.408-9.728-24.064-12.8 16.384-30.72 19.968-79.872 20.992-133.632l26.624 2.048c-0.512 13.824-1.024 27.648-2.048 40.448 6.144 19.456 14.336 33.28 25.088 43.52v-107.52H374.272v-25.088h56.32v-34.304h-48.64v-25.088h48.64v-31.744h27.136v31.744h47.104v25.088h-47.104v34.304h55.296v25.088h-49.664v40.448h46.592v25.088h-46.592v56.832z m142.336-200.192h-83.968v-25.6h111.104v105.984h-80.896v60.416c0 9.728 2.048 11.776 14.848 11.776h41.984c11.776 0 13.312-5.632 14.848-41.984 6.144 5.12 17.408 9.216 25.088 11.264-3.584 44.544-11.264 56.32-37.888 56.32H563.2c-30.208 0-39.424-7.68-39.424-36.864V329.728h80.896V274.432h1.024z" fill="#FFFFFF" p-id="7984"></path></svg>
                <!-- <img 
                  v-if="index === 0" 
                  src="@/images/point.png" 
                  alt="起点" 
                  style="width: 16px; height: 16px; margin-right: 8px"
                /> -->
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
                <span class="action-btn edit" @click.stop="editPoint(point)">修改</span>
                <!-- 只有非起点才可以删除 -->
                <span
                  v-if="index > 0"
                  class="action-btn delete"
                  @click.stop="deletePoint(index)"
                >删除</span>
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
              {{ (isPlaying && playingCraneId === selectedCrane?.id) ? '停止播放' : '播放路径动画' }}
            </el-button>
            <el-button 
              type="warning" 
              :disabled="!selectedCrane || !selectedCrane.points || selectedCrane.points.length === 0"
              @click="resetTrajectory"
              style="width: 100%; margin-bottom: 10px;"
            >
              重置路径
            </el-button>
            <!-- 单个起重机录制按钮 -->
            <el-button 
              type="success" 
              :disabled="!selectedCrane || craneRecordingStates[selectedCrane?.id]?.isRecording"
              @click="startCraneRecording"
              style="width: 100%; margin-bottom: 10px;"
            >
              开始录制
            </el-button>
            <el-button 
              type="danger" 
              :disabled="!selectedCrane || !craneRecordingStates[selectedCrane?.id]?.isRecording"
              @click="stopCraneRecording"
              style="width: 100%; margin-bottom: 10px;"
            >
              结束录制
            </el-button>
            <el-button 
              type="info" 
              :disabled="!selectedCrane || !craneRecordingStates[selectedCrane?.id]?.blob"
              @click="downloadCraneRecording"
              style="width: 100%;"
            >
              下载录制
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 全局登录弹窗 -->
    <Teleport to="body">
      <el-dialog
        v-model="showLoginDialog"
        title=""
        width="450px"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        class="login-dialog"
        align-center
        append-to-body
      >
        <div class="login-dialog-content">
          <div class="login-title-section">
            <h2 class="login-main-title">光热三维施工仿真软件</h2>
            <p class="login-sub-title">用户登录</p>
          </div>
          <p class="login-prompt-text">请输入您的用户名和密码</p>
          <div class="login-form">
            <div class="login-input-wrapper">
              <el-icon class="input-icon"><User /></el-icon>
              <el-input
                v-model="loginForm.username"
                placeholder="请输入用户名"
                class="login-input"
              />
            </div>
            <div class="login-input-wrapper">
              <el-icon class="input-icon"><Lock /></el-icon>
              <el-input
                v-model="loginForm.password"
                type="password"
                placeholder="请输入密码"
                class="login-input"
                show-password
                @keyup.enter="handleLogin"
              />
            </div>
          </div>
          <div class="login-buttons">
            <el-button type="primary" class="login-confirm-btn" @click="handleLogin" :loading="isLogging">
              确认登录
            </el-button>
            <el-button type="warning" class="login-offline-btn" @click="handleOfflineLogin">
              离线登录
            </el-button>
          </div>
        </div>
      </el-dialog>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import { ArrowLeft, Search, Close, User, Lock } from "@element-plus/icons-vue";
import startIconSrc from "@/images/point.png";
import liftingIconSrc from "@/images/crane_point.png";
import movingIconSrc from "@/images/move_point.png";
import craneModelSrc from "@/images/crane_model.png";
import RecordRTC from "recordrtc";
import { uploadImage, saveGeneralPing, getGeneralDetails, exportProject, login } from "@/api/index";
import userStore from "@/store/user.js";

const route = useRoute();
const router = useRouter();

// 从路由参数获取项目ID
const projectId = ref("");
// 项目标题
const projectTitle = ref("");
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
const craneCounter = ref(0); // 用于生成起重机名称，从1开始编号

// 绘制工具栏相关状态
const drawingToolOptions = [
  { type: "rectangle", label: "矩形" },
  { type: "circle", label: "圆形" },
  { type: "triangle", label: "三角形" },
  { type: "sector", label: "扇形" },
  { type: "text", label: "文字" },
];
const activeDrawingTool = ref(null);
const shapeOverlays = ref([]);
const activePointId = ref(null);
const activeShapeId = ref(null);
const isDraggingShape = ref(false);
const isResizingShape = ref(false);
const dragContext = reactive({
  type: null,
  shapeId: null,
  tool: null,
  handlePosition: null,
  startPos: { x: 0, y: 0 },
  initialConfig: null,
  initialCanvasPos: { x: 0, y: 0 },
  initialBounds: null,
});

// 点位相关数据
const addPointDialogVisible = ref(false);
const editPointDialogVisible = ref(false);

// 登录相关
const showLoginDialog = ref(false);
const isLogging = ref(false);
const loginForm = reactive({
  username: "",
  password: "",
});

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
const canvasSize = reactive({
  width: 0,
  height: 0,
});

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
  const isPlayingAll = ref(false); // 是否播放所有路径
  const animationPlans = ref({}); // 存储每个起重机的动画计划
const playbackElapsed = ref(0);
const animationPlan = ref(null);
const playbackAnimationFrame = ref(null);
const secondsPerDay = 3;

// 录制相关状态
const isGlobalRecording = ref(false);
const globalRecordingBlob = ref(null);
const globalRecorder = ref(null);
const craneRecordingStates = ref({}); // 存储每个起重机的录制状态 { craneId: { isRecording: false, recorder: null, blob: null } }

// 点位图标
const pointIconImages = {
  start: new Image(),
  lifting: new Image(),
  moving: new Image(),
};

// 起重机模型图片（用于路径运动轨迹）
const craneModelImage = new Image();
craneModelImage.src = craneModelSrc;
craneModelImage.onload = () => {
  // 图片加载完成后重绘轨迹
  if (ctx.value) {
    drawAllTrajectories();
  }
};

// 生成带颜色的SVG DataURL函数
const createStartIconSvg = (color = '#07AA74') => {
  // 替换SVG中的颜色值
  const svg = `<svg t="1762755830607" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M337.92 890.88a173.056 46.08 0 1 0 346.112 0 173.056 46.08 0 1 0-346.112 0Z" opacity=".4"/><path d="M421.376 890.88a89.6 23.04 0 1 0 179.2 0 89.6 23.04 0 1 0-179.2 0Z" opacity=".4"/><path d="M512 891.392c-11.264 0-19.968-8.704-19.968-19.968v-250.88c0-11.264 8.704-19.968 19.968-19.968s19.968 8.704 19.968 19.968v250.88c0 11.264-8.704 19.968-19.968 19.968z" fill="${color || '#106848'}"/><path d="M241.664 385.024c0 149.504 120.832 270.336 270.336 270.336s270.336-120.832 270.336-270.336c0-149.504-120.832-270.336-270.336-270.336-149.504 0-270.336 120.832-270.336 270.336z" fill="${color || '#07AA74'}"/><path d="M463.36 474.624c16.896 5.632 37.888 7.168 64 7.168 18.432 0.512 106.496 0.512 128.512-0.512-4.096 6.656-9.216 19.456-11.264 28.16H527.36c-60.928 0-97.792-8.704-120.832-47.104-3.584 22.528-8.704 41.984-16.384 57.856-5.12-3.584-17.408-9.728-24.064-12.8 16.384-30.72 19.968-79.872 20.992-133.632l26.624 2.048c-0.512 13.824-1.024 27.648-2.048 40.448 6.144 19.456 14.336 33.28 25.088 43.52v-107.52H374.272v-25.088h56.32v-34.304h-48.64v-25.088h48.64v-31.744h27.136v31.744h47.104v25.088h-47.104v34.304h55.296v25.088h-49.664v40.448h46.592v25.088h-46.592v56.832z m142.336-200.192h-83.968v-25.6h111.104v105.984h-80.896v60.416c0 9.728 2.048 11.776 14.848 11.776h41.984c11.776 0 13.312-5.632 14.848-41.984 6.144 5.12 17.408 9.216 25.088 11.264-3.584 44.544-11.264 56.32-37.888 56.32H563.2c-30.208 0-39.424-7.68-39.424-36.864V329.728h80.896V274.432h1.024z" fill="#FFFFFF"/></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};

// 初始化起点图标为默认颜色
pointIconImages.start.src = createStartIconSvg();
pointIconImages.lifting.src = liftingIconSrc;
pointIconImages.moving.src = movingIconSrc;

Object.values(pointIconImages).forEach((img) => {
  img.onload = () => {
    // 延迟执行，确保 drawAllTrajectories 已经定义
    if (typeof drawAllTrajectories === 'function') {
      drawAllTrajectories();
    } else {
      // 如果函数还未定义，延迟执行
      setTimeout(() => {
        if (typeof drawAllTrajectories === 'function') {
          drawAllTrajectories();
        }
      }, 100);
    }
  };
});

// 缓存不同颜色的起点图标
const startIconCache = {};

// 获取带指定颜色的起点图标
const getStartIconWithColor = (color) => {
  if (!color) return pointIconImages.start;
  
  if (!startIconCache[color]) {
    const img = new Image();
    img.src = createStartIconSvg(color);
    img.onload = () => drawAllTrajectories();
    startIconCache[color] = img;
  }
  
  return startIconCache[color];
};

const pointIconSizes = {
  start: 22,
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

const withOffsetDefaults = (config = {}) => ({
  offsetX: 0,
  offsetY: 0,
  ...config,
});

const defaultShapeConfigs = {
  rectangle: withOffsetDefaults({
    width: 80,
    height: 40,
    // 使用与平面图明显区分的冷色调
    fill: "rgba(0, 160, 233, 0.35)", // 蓝青色半透明
    stroke: "#00A0E9",
    rotate: 0,
  }),
  circle: withOffsetDefaults({
    radius: 38,
    fill: "rgba(38, 132, 255, 0.25)",
    stroke: "#2684FF",
    rotate: 0,
  }),
  triangle: withOffsetDefaults({
    size: 72,
    fill: "rgba(245, 108, 108, 0.25)",
    stroke: "#F56C6C",
    rotate: 0,
  }),
  sector: withOffsetDefaults({
    radius: 90,
    angle: 60,
    // 扇形初始化颜色改为红色
    fill: "rgba(245, 108, 108, 0.25)",
    stroke: "#F56C6C",
    rotate: -30,
  }),
  text: withOffsetDefaults({
    text: "文字",
    color: "#1F2D3D",
    fontSize: 14,
    rotate: 0,
  }),
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
  remarks: "",
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
      // 起点也可以有结束时间，不再强制设置为null
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

const msPerDay = 24 * 60 * 60 * 1000;

const parseDateValue = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const diffDays = (start, end) => {
  if (!start || !end) return 0;
  const diff = Math.round((end.getTime() - start.getTime()) / msPerDay);
  return diff;
};

const diffDaysInclusive = (start, end) => {
  if (!start || !end) return 0;
  const diff = Math.round((end.getTime() - start.getTime()) / msPerDay);
  return diff >= 0 ? diff + 1 : 0;
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

const activePoint = computed(() => {
  if (!selectedCrane.value || !selectedCrane.value.points || selectedCrane.value.points.length === 0) {
    return null;
  }
  if (activePointId.value) {
    const matched = selectedCrane.value.points.find(
      (point) => point.id === activePointId.value && point.type === "lifting"
    );
    if (matched) {
      return matched;
    }
  }
  const fallback = selectedCrane.value.points.find((point) => point.type === "lifting");
  if (fallback) {
    activePointId.value = fallback.id;
  }
  return fallback || null;
});

const getShapesForPoint = (pointId) => {
  if (!pointId) return [];
  
  // 首先尝试精确匹配
  let matched = shapeOverlays.value.filter((shape) => shape.pointId === pointId);
  
  // 如果精确匹配失败，尝试字符串匹配（处理类型不匹配的情况）
  if (matched.length === 0) {
    matched = shapeOverlays.value.filter((shape) => 
      String(shape.pointId) === String(pointId)
    );
  }
  
  return matched;
};

const canCompleteDrawing = computed(() => {
  if (!activePoint.value) return false;
  return getShapesForPoint(activePoint.value.id).length > 0;
});

const activeShape = computed(() => {
  if (!activeShapeId.value) return null;
  return shapeOverlays.value.find((shape) => shape.id === activeShapeId.value) || null;
});

const renderedShapeItems = computed(() => {
  // 依赖图片尺寸，确保尺寸变化后重新计算
  imageWidth.value;
  imageHeight.value;
  canvasSize.width;
  canvasSize.height;
  shapeOverlays.value.length; // 强制依赖 shapeOverlays
  cranes.value.length; // 强制依赖 cranes
  selectedCrane.value?.id; // 强制依赖 selectedCrane
  
  // 基本条件检查
  if (!canvas.value) {
    console.debug("renderedShapeItems: canvas 不存在");
    return [];
  }
  if (!canvasSize.width || !canvasSize.height) {
    console.debug("renderedShapeItems: canvas 尺寸未初始化", { width: canvasSize.width, height: canvasSize.height });
    return [];
  }
  if (shapeOverlays.value.length === 0) {
    return [];
  }
  if (cranes.value.length === 0) {
    console.debug("renderedShapeItems: 没有起重机数据");
    return [];
  }
  
  const result = shapeOverlays.value
    .map((shape, index) => {
      // 首先尝试通过 craneId 和 pointId 精确匹配
      let matched = findPointById(shape.pointId, shape.craneId);
      
      // 如果找不到，尝试在所有起重机中查找（通过 ID）
      if (!matched) {
        for (const crane of cranes.value) {
          const point = crane.points?.find(p => p.id === shape.pointId);
          if (point) {
            console.debug(`形状[${index}] ${shape.id} 通过全局查找找到点位: ${point.name}`);
            matched = { crane, point };
            break;
          }
        }
      }
      
      // 如果还是找不到，尝试通过位置坐标匹配
      if (!matched && shape.position) {
        for (const crane of cranes.value) {
          const point = crane.points?.find(p => {
            const dx = Math.abs(p.x - shape.position.x);
            const dy = Math.abs(p.y - shape.position.y);
            return dx < 0.1 && dy < 0.1;
          });
          if (point) {
            console.debug(`形状[${index}] ${shape.id} 通过坐标匹配找到点位: ${point.name} (${point.x}, ${point.y})`);
            matched = { crane, point };
            break;
          }
        }
      }
      
      // 如果还是找不到，尝试通过起重机 ID 和点位名称匹配
      if (!matched && shape.craneId) {
        const crane = cranes.value.find(c => c.id === shape.craneId);
        if (crane && crane.points) {
          // 尝试通过位置坐标找到最接近的点位
          let closestPoint = null;
          let minDistance = Infinity;
          crane.points.forEach(point => {
            if (shape.position) {
              const dx = point.x - shape.position.x;
              const dy = point.y - shape.position.y;
              const distance = Math.sqrt(dx * dx + dy * dy);
              if (distance < minDistance && distance < 1.0) {
                minDistance = distance;
                closestPoint = point;
              }
            }
          });
          if (closestPoint) {
            console.debug(`形状[${index}] ${shape.id} 通过最近距离匹配找到点位: ${closestPoint.name}`);
            matched = { crane, point: closestPoint };
          }
        }
      }
      
      // 即使找不到点位，也尝试通过 position 直接渲染
      if (!matched) {
        console.warn(`形状[${index}] ${shape.id} 无法匹配到点位，尝试直接使用 position 渲染`);
        if (shape.position) {
          // 直接使用保存的 position 坐标进行渲染
          const baseCoords = convertToCanvasCoords(shape.position.x, shape.position.y);
          return {
            ...shape,
            canvasX: baseCoords.x,
            canvasY: baseCoords.y,
            baseCoords,
            geoPosition: shape.position,
            point: { x: shape.position.x, y: shape.position.y }, // 临时点位数据
            crane: cranes.value.find(c => c.id === shape.craneId) || cranes.value[0], // 尝试找到起重机，否则使用第一个
          };
        }
        return null;
      }
      
      const geoPosition = shape.position || matched.point;
      const baseCoords = convertToCanvasCoords(geoPosition.x, geoPosition.y);
      return {
        ...shape,
        canvasX: baseCoords.x,
        canvasY: baseCoords.y,
        baseCoords,
        geoPosition,
        point: matched.point,
        crane: matched.crane,
      };
    })
    .filter(Boolean);
  
  console.debug(`renderedShapeItems: 返回 ${result.length} 个可渲染的形状`);
  return result;
});

const syncActivePointSelection = () => {
  if (!selectedCrane.value || !selectedCrane.value.points || selectedCrane.value.points.length === 0) {
    activePointId.value = null;
    return;
  }
  // 检查当前选中的点位是否仍然有效（包括移动点位）
  const validPoint = selectedCrane.value.points.find(
    (point) => point.id === activePointId.value
  );
  if (!validPoint) {
    // 如果当前选中的点位不存在，则回退到第一个吊装点位
    const fallback = selectedCrane.value.points.find((point) => point.type === "lifting");
    activePointId.value = fallback ? fallback.id : null;
  }
  // 如果当前选中的是移动点位，保留选中状态（不重置）
};

watch(
  () => selectedCrane.value?.id,
  () => {
    nextTick(() => {
      syncActivePointSelection();
    });
  }
);

// 监听 shapeOverlays 变化，强制触发重新渲染
watch(
  () => shapeOverlays.value.length,
  (newLength, oldLength) => {
    console.log(`shapeOverlays 数量变化: ${oldLength} -> ${newLength}`);
    if (newLength > 0) {
      nextTick(() => {
        // 强制触发 renderedShapeItems 重新计算
        const items = renderedShapeItems.value;
        console.log(`watch: 强制刷新后 renderedShapeItems 数量:`, items.length);
        // 如果数量不匹配，再次强制更新
        if (items.length !== newLength) {
          setTimeout(() => {
            shapeOverlays.value = [...shapeOverlays.value];
            const items2 = renderedShapeItems.value;
            console.log(`watch: 延迟刷新后 renderedShapeItems 数量:`, items2.length);
          }, 100);
        }
      });
    }
  },
  { immediate: true }
);

// 监听 cranes 变化，重新匹配形状数据
watch(
  () => cranes.value.length,
  () => {
    if (shapeOverlays.value.length > 0 && cranes.value.length > 0) {
      console.log(`cranes 数量变化，重新匹配形状数据`);
      nextTick(() => {
        // 强制更新 shapeOverlays 以触发重新匹配
        shapeOverlays.value = [...shapeOverlays.value];
        const items = renderedShapeItems.value;
        console.log(`重新匹配后 renderedShapeItems 数量:`, items.length);
      });
    }
  }
);

watch(
  () => selectedCrane.value?.points,
  () => {
    syncActivePointSelection();
  },
  { deep: true }
);

watch(
  () => activePointId.value,
  () => {
    const shapes = getShapesForPoint(activePointId.value);
    if (!shapes.some((shape) => shape.id === activeShapeId.value)) {
      activeShapeId.value = shapes.length > 0 ? shapes[0].id : null;
    }
  }
);

watch(
  shapeOverlays,
  () => {
    const shapes = getShapesForPoint(activePointId.value);
    if (!shapes.some((shape) => shape.id === activeShapeId.value)) {
      activeShapeId.value = shapes.length > 0 ? shapes[0].id : null;
    }
    // 只在非创建状态下重绘，避免创建时的重复绘制
    if (!isCreatingShape) {
      drawAllTrajectories();
    }
  },
  { deep: true }
);

const handlePointItemClick = (point) => {
  // 允许选中移动点位，只是不能绘制点位占位
  activePointId.value = point.id;
};

// 将 base64 转换为 Blob
const base64ToBlob = (base64) => {
  return new Promise((resolve, reject) => {
    try {
      const arr = base64.split(',');
      const mime = arr[0].match(/:(.*?);/)[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      resolve(new Blob([u8arr], { type: mime }));
    } catch (error) {
      reject(error);
    }
  });
};

// 防止重复创建的标志
let isCreatingShape = false;

const handleDrawingToolClick = async (toolType) => {
  if (!selectedCrane.value) {
    ElMessage.warning("请先选择起重机");
    return;
  }
  
  // 检查是否选中了点位
  if (!activePointId.value) {
    ElMessage.warning("请先选择吊装点位");
    return;
  }
  
  // 检查选中的点位是否为吊装点位
  const currentPoint = selectedCrane.value.points.find(p => p.id === activePointId.value);
  if (!currentPoint || currentPoint.type !== "lifting") {
    ElMessage.warning("当前仅支持在吊装点位上绘制");
    return;
  }

  // 防止重复创建
  if (isCreatingShape) {
    return;
  }

  activeDrawingTool.value = toolType;
  isCreatingShape = true;

  if (toolType === "text") {
    try {
      const { value } = await ElMessageBox.prompt("请输入要展示的文字", "添加文字", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputValue: defaultShapeConfigs.text.text,
      });
      addShapeOverlayForPoint(toolType, { text: value || defaultShapeConfigs.text.text });
    } catch (error) {
      activeDrawingTool.value = null;
    } finally {
      isCreatingShape = false;
    }
    return;
  }

  addShapeOverlayForPoint(toolType);
  // addShapeOverlayForPoint 内部会在 nextTick 中重置标志
};

const addShapeOverlayForPoint = (toolType, extraConfig = {}) => {
  if (!activePoint.value) {
    isCreatingShape = false;
    return;
  }
  
  // 再次检查防止重复创建
  if (isCreatingShape && shapeOverlays.value.length > 0) {
    const lastShape = shapeOverlays.value[shapeOverlays.value.length - 1];
    const timeDiff = Date.now() - parseInt(lastShape.id.split('_')[0]);
    // 如果最后创建的图形是在100ms内创建的，可能是重复创建
    if (timeDiff < 100 && lastShape.tool === toolType && lastShape.pointId === activePoint.value.id) {
      console.warn('检测到可能的重复创建，已阻止');
      isCreatingShape = false;
      return;
    }
  }
  
  const config = {
    ...(defaultShapeConfigs[toolType] || {}),
    ...extraConfig,
  };
  if (!Number.isFinite(config.offsetX)) config.offsetX = 0;
  if (!Number.isFinite(config.offsetY)) config.offsetY = 0;

  const shape = {
    id: `${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    tool: toolType,
    pointId: activePoint.value.id,
    craneId: selectedCrane.value?.id || null,
    position: {
      x: activePoint.value.x,
      y: activePoint.value.y,
    },
    config,
  };

  shapeOverlays.value = [...shapeOverlays.value, shape];
  activeShapeId.value = shape.id;
  
  // 创建完成后立即重绘
  nextTick(() => {
    drawAllTrajectories();
    isCreatingShape = false;
  });
};

const handleClearShapes = () => {
  if (!activePoint.value) {
    ElMessage.warning("暂无可清除的点位绘制");
    return;
  }
  shapeOverlays.value = shapeOverlays.value.filter((shape) => shape.pointId !== activePoint.value.id);
  activeDrawingTool.value = null;
  activeShapeId.value = null;
  ElMessage.success("已清除当前点位的绘制图形");
};

// 撤销选中的图形
const handleUndoShape = () => {
  if (!activeShapeId.value) {
    ElMessage.warning("请先选择一个图形");
    return;
  }
  
  const shapeIndex = shapeOverlays.value.findIndex((shape) => shape.id === activeShapeId.value);
  if (shapeIndex === -1) {
    ElMessage.warning("未找到要撤销的图形");
    return;
  }
  
  // 删除选中的图形
  shapeOverlays.value = shapeOverlays.value.filter((shape) => shape.id !== activeShapeId.value);
  
  // 选择下一个图形或清空选中
  const remainingShapes = getShapesForPoint(activePointId.value);
  activeShapeId.value = remainingShapes.length > 0 ? remainingShapes[0].id : null;
  
  ElMessage.success("已撤销选中的图形");
};

const MIN_RECT_SIZE = 24;
const MIN_RADIUS = 12;
const MIN_TRIANGLE_SIZE = 32;
const MIN_FONT_SIZE = 12;
let pointerListenersAttached = false;

const updateShape = (shapeId, updater) => {
  shapeOverlays.value = shapeOverlays.value.map((shape) => {
    if (shape.id !== shapeId) return shape;
    return updater(shape);
  });
};

const updateShapeConfig = (shapeId, updater) => {
  updateShape(shapeId, (shape) => {
    const baseConfig = { ...(shape.config || {}) };
    const nextConfig =
      typeof updater === "function" ? updater(baseConfig) : { ...baseConfig, ...updater };
    return {
      ...shape,
      config: nextConfig,
    };
  });
};

const attachPointerListeners = () => {
  if (pointerListenersAttached) return;
  window.addEventListener("mousemove", handleGlobalPointerMove);
  window.addEventListener("mouseup", handleGlobalPointerUp);
  pointerListenersAttached = true;
};

const detachPointerListeners = () => {
  if (!pointerListenersAttached) return;
  window.removeEventListener("mousemove", handleGlobalPointerMove);
  window.removeEventListener("mouseup", handleGlobalPointerUp);
  pointerListenersAttached = false;
};

const setShapePositionByCanvas = (shapeId, canvasX, canvasY) => {
  const geo = convertToGeoCoords(canvasX, canvasY);
  updateShape(shapeId, (shape) => ({
    ...shape,
    position: { x: geo.x, y: geo.y },
  }));
};

const handleShapeMouseDown = (item, event) => {
  event.preventDefault();
  event.stopPropagation();
  activeShapeId.value = item.id;
  
  // 在点位设置中选中该点位占位对应的点位
  if (item.pointId && item.crane) {
    // 确保选中的起重机是正确的
    if (!selectedCrane.value || selectedCrane.value.id !== item.crane.id) {
      selectCrane(item.crane);
    }
    activePointId.value = item.pointId;
  }
  
  dragContext.type = "move";
  dragContext.shapeId = item.id;
  dragContext.tool = item.tool;
  dragContext.startPos = getMouseCanvasPos(event);
  dragContext.initialConfig = { ...(item.config || {}) };
  dragContext.initialCanvasPos = { x: item.canvasX, y: item.canvasY };
  isDraggingShape.value = true;
  attachPointerListeners();
};

const handleResizeMouseDown = (item, event, handlePosition) => {
  event.preventDefault();
  event.stopPropagation();
  activeShapeId.value = item.id;
  dragContext.type = "resize";
  dragContext.shapeId = item.id;
  dragContext.tool = item.tool;
  dragContext.handlePosition = handlePosition; // 保存控制点位置
  dragContext.startPos = getMouseCanvasPos(event);
  dragContext.initialConfig = { ...(item.config || {}) };
  dragContext.initialCanvasPos = { x: item.canvasX, y: item.canvasY };
  dragContext.initialBounds = getShapeBounds(item);
  isResizingShape.value = true;
  attachPointerListeners();
};

const handleGlobalPointerMove = (event) => {
  if (!dragContext.shapeId) return;
  const currentPos = getMouseCanvasPos(event);
  const deltaX = currentPos.x - dragContext.startPos.x;
  const deltaY = currentPos.y - dragContext.startPos.y;

  if (dragContext.type === "move" && isDraggingShape.value) {
    const newCanvasX = (dragContext.initialCanvasPos?.x || 0) + deltaX;
    const newCanvasY = (dragContext.initialCanvasPos?.y || 0) + deltaY;
    setShapePositionByCanvas(dragContext.shapeId, newCanvasX, newCanvasY);
  } else if (dragContext.type === "resize" && isResizingShape.value) {
    resizeShapeWithDelta(deltaX, deltaY);
  }
};

const handleGlobalPointerUp = () => {
  if (!isDraggingShape.value && !isResizingShape.value) return;
  isDraggingShape.value = false;
  isResizingShape.value = false;
  dragContext.type = null;
  dragContext.shapeId = null;
  dragContext.tool = null;
  dragContext.handlePosition = null;
  dragContext.initialConfig = null;
  dragContext.initialCanvasPos = null;
  dragContext.initialBounds = null;
  detachPointerListeners();
};

const resizeShapeWithDelta = (deltaX, deltaY) => {
  if (!dragContext.shapeId || !dragContext.initialBounds) return;
  const tool = dragContext.tool;
  const initial = dragContext.initialConfig || {};
  const handlePos = dragContext.handlePosition || "se";
  const bounds = dragContext.initialBounds;
  
  updateShapeConfig(dragContext.shapeId, (config) => {
    const next = { ...config };
    
    if (tool === "rectangle") {
      // 矩形调整逻辑：
      // - 角落控制点（nw, ne, sw, se）：旋转
      // - 边缘控制点（n, s, w, e）：调整大小
      if (handlePos === "ne" || handlePos === "se" || handlePos === "sw" || handlePos === "nw") {
        // 角落控制点：旋转矩形
        const centerX = dragContext.initialCanvasPos?.x || (bounds.left + bounds.width / 2);
        const centerY = dragContext.initialCanvasPos?.y || (bounds.top + bounds.height / 2);
        
        const initialRotate = initial.rotate || 0;
        const rad = degToRad(initialRotate);
        const handleOffsetX = handlePos.includes("e") ? bounds.width / 2 : -bounds.width / 2;
        const handleOffsetY = handlePos.includes("s") ? bounds.height / 2 : -bounds.height / 2;
        const rotatedOffsetX = handleOffsetX * Math.cos(rad) - handleOffsetY * Math.sin(rad);
        const rotatedOffsetY = handleOffsetX * Math.sin(rad) + handleOffsetY * Math.cos(rad);
        const initialHandleX = centerX + rotatedOffsetX;
        const initialHandleY = centerY + rotatedOffsetY;
        
        const newHandleX = initialHandleX + deltaX;
        const newHandleY = initialHandleY + deltaY;
        
        const initialAngle = Math.atan2(initialHandleY - centerY, initialHandleX - centerX);
        const newAngle = Math.atan2(newHandleY - centerY, newHandleX - centerX);
        let angleDiff = (newAngle - initialAngle) * (180 / Math.PI);
        
        while (angleDiff > 180) angleDiff -= 360;
        while (angleDiff < -180) angleDiff += 360;
        
        next.rotate = ((initialRotate + angleDiff) % 360 + 360) % 360;
        // 保持宽高不变
        next.width = initial.width || 80;
        next.height = initial.height || 40;
      } else {
        // 边缘控制点：调整大小
        let newWidth = bounds.width;
        let newHeight = bounds.height;
        let offsetX = 0;
        let offsetY = 0;
        
        if (handlePos.includes("e")) {
          newWidth = Math.max(MIN_RECT_SIZE, bounds.width + deltaX);
        }
        if (handlePos.includes("w")) {
          newWidth = Math.max(MIN_RECT_SIZE, bounds.width - deltaX);
          offsetX = deltaX;
        }
        if (handlePos.includes("s")) {
          newHeight = Math.max(MIN_RECT_SIZE, bounds.height + deltaY);
        }
        if (handlePos.includes("n")) {
          newHeight = Math.max(MIN_RECT_SIZE, bounds.height - deltaY);
          offsetY = deltaY;
        }
        
        next.width = newWidth;
        next.height = newHeight;
        next.rotate = initial.rotate || 0; // 保持旋转角度不变
        
        // 更新位置（如果从左边或上边调整）
        const currentPos = dragContext.initialCanvasPos || { x: 0, y: 0 };
        if (handlePos.includes("w") || handlePos.includes("n")) {
          const newCanvasX = handlePos.includes("w") ? currentPos.x + offsetX : currentPos.x;
          const newCanvasY = handlePos.includes("n") ? currentPos.y + offsetY : currentPos.y;
          const geo = convertToGeoCoords(newCanvasX, newCanvasY);
          updateShape(dragContext.shapeId, (shape) => ({
            ...shape,
            position: { x: geo.x, y: geo.y },
          }));
        }
      }
    } else if (tool === "circle") {
      // 圆形调整逻辑：
      // - 角落控制点（nw, ne, sw, se）：旋转
      // - 边缘控制点（n, s, w, e）：调整半径
      if (handlePos === "ne" || handlePos === "se" || handlePos === "sw" || handlePos === "nw") {
        // 角落控制点：旋转圆形
        const centerX = dragContext.initialCanvasPos?.x || (bounds.left + bounds.width / 2);
        const centerY = dragContext.initialCanvasPos?.y || (bounds.top + bounds.height / 2);
        
        const initialRotate = initial.rotate || 0;
        const radius = initial.radius || MIN_RADIUS;
        const handleOffsetX = handlePos.includes("e") ? radius : -radius;
        const handleOffsetY = handlePos.includes("s") ? radius : -radius;
        const rad = degToRad(initialRotate);
        const rotatedOffsetX = handleOffsetX * Math.cos(rad) - handleOffsetY * Math.sin(rad);
        const rotatedOffsetY = handleOffsetX * Math.sin(rad) + handleOffsetY * Math.cos(rad);
        const initialHandleX = centerX + rotatedOffsetX;
        const initialHandleY = centerY + rotatedOffsetY;
        
        const newHandleX = initialHandleX + deltaX;
        const newHandleY = initialHandleY + deltaY;
        
        const initialAngle = Math.atan2(initialHandleY - centerY, initialHandleX - centerX);
        const newAngle = Math.atan2(newHandleY - centerY, newHandleX - centerX);
        let angleDiff = (newAngle - initialAngle) * (180 / Math.PI);
        
        while (angleDiff > 180) angleDiff -= 360;
        while (angleDiff < -180) angleDiff += 360;
        
        next.rotate = ((initialRotate + angleDiff) % 360 + 360) % 360;
        // 保持半径不变
        next.radius = radius;
      } else {
        // 边缘控制点：调整半径
        const delta = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const sign = handlePos.includes("e") || handlePos.includes("s") ? 1 : -1;
        next.radius = Math.max(MIN_RADIUS, (initial.radius || MIN_RADIUS) + delta * sign);
        next.rotate = initial.rotate || 0; // 保持旋转角度不变
      }
    } else if (tool === "triangle") {
      // 三角形调整逻辑：
      // - 角落控制点（nw, ne, sw, se）：旋转
      // - 边缘控制点（n, s, w, e）：调整大小
      if (handlePos === "ne" || handlePos === "se" || handlePos === "sw" || handlePos === "nw") {
        // 角落控制点：旋转三角形
        const centerX = dragContext.initialCanvasPos?.x || (bounds.left + bounds.width / 2);
        const centerY = dragContext.initialCanvasPos?.y || (bounds.top + bounds.height / 2);
        
        const initialRotate = initial.rotate || 0;
        const size = initial.size || MIN_TRIANGLE_SIZE;
        const handleOffsetX = handlePos.includes("e") ? size / 2 : -size / 2;
        const handleOffsetY = handlePos.includes("s") ? size / 2 : -size / 2;
        const rad = degToRad(initialRotate);
        const rotatedOffsetX = handleOffsetX * Math.cos(rad) - handleOffsetY * Math.sin(rad);
        const rotatedOffsetY = handleOffsetX * Math.sin(rad) + handleOffsetY * Math.cos(rad);
        const initialHandleX = centerX + rotatedOffsetX;
        const initialHandleY = centerY + rotatedOffsetY;
        
        const newHandleX = initialHandleX + deltaX;
        const newHandleY = initialHandleY + deltaY;
        
        const initialAngle = Math.atan2(initialHandleY - centerY, initialHandleX - centerX);
        const newAngle = Math.atan2(newHandleY - centerY, newHandleX - centerX);
        let angleDiff = (newAngle - initialAngle) * (180 / Math.PI);
        
        while (angleDiff > 180) angleDiff -= 360;
        while (angleDiff < -180) angleDiff += 360;
        
        next.rotate = ((initialRotate + angleDiff) % 360 + 360) % 360;
        // 保持大小不变
        next.size = size;
      } else {
        // 边缘控制点：调整大小
        const delta = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const sign = handlePos.includes("e") || handlePos.includes("s") ? 1 : -1;
        next.size = Math.max(MIN_TRIANGLE_SIZE, (initial.size || MIN_TRIANGLE_SIZE) + delta * sign);
        next.rotate = initial.rotate || 0; // 保持旋转角度不变
      }
    } else if (tool === "sector") {
      // 扇形调整逻辑：
      // - 角落控制点（nw, ne, sw, se）：旋转扇形
      // - 上下控制点（n, s）：调整扇形角度（开合角度）
      // - 左右控制点（w, e）：调整半径（大小）
      if (handlePos === "ne" || handlePos === "se" || handlePos === "sw" || handlePos === "nw") {
        // 角落控制点：旋转扇形
        const centerX = dragContext.initialCanvasPos?.x || (bounds.left + bounds.width / 2);
        const centerY = dragContext.initialCanvasPos?.y || (bounds.top + bounds.height / 2);
        
        const initialRotate = initial.rotate || -30;
        const radius = initial.radius || MIN_RADIUS;
        const handleOffsetX = handlePos.includes("e") ? radius : -radius;
        const handleOffsetY = handlePos.includes("s") ? radius : -radius;
        const rad = degToRad(initialRotate);
        const rotatedOffsetX = handleOffsetX * Math.cos(rad) - handleOffsetY * Math.sin(rad);
        const rotatedOffsetY = handleOffsetX * Math.sin(rad) + handleOffsetY * Math.cos(rad);
        const initialHandleX = centerX + rotatedOffsetX;
        const initialHandleY = centerY + rotatedOffsetY;
        
        const newHandleX = initialHandleX + deltaX;
        const newHandleY = initialHandleY + deltaY;
        
        const initialAngle = Math.atan2(initialHandleY - centerY, initialHandleX - centerX);
        const newAngle = Math.atan2(newHandleY - centerY, newHandleX - centerX);
        let angleDiff = (newAngle - initialAngle) * (180 / Math.PI);
        
        while (angleDiff > 180) angleDiff -= 360;
        while (angleDiff < -180) angleDiff += 360;
        
        next.rotate = ((initialRotate + angleDiff) % 360 + 360) % 360;
        // 保持半径和角度不变
        next.radius = radius;
        next.angle = initial.angle || 60;
      } else if (handlePos === "n" || handlePos === "s") {
        // 上下控制点：调整扇形角度（开合角度），不改变半径和旋转
        const angleDelta = handlePos === "s" ? deltaY : -deltaY;
        next.angle = Math.max(10, Math.min(360, (initial.angle || 60) + angleDelta / 2));
        next.radius = initial.radius || MIN_RADIUS;
        next.rotate = initial.rotate || -30;
      } else {
        // 左右控制点：调整半径（大小）
        const delta = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const sign = handlePos.includes("e") ? 1 : -1;
        next.radius = Math.max(MIN_RADIUS, (initial.radius || MIN_RADIUS) + delta * sign);
        next.angle = initial.angle || 60;
        next.rotate = initial.rotate || -30;
      }
    } else if (tool === "text") {
      // 通过不同的控制点调整字体大小或旋转
      if (handlePos === "ne" || handlePos === "se" || handlePos === "sw" || handlePos === "nw") {
        // 角落控制点：旋转文字
        const centerX = dragContext.initialCanvasPos?.x || (bounds.left + bounds.width / 2);
        const centerY = dragContext.initialCanvasPos?.y || (bounds.top + bounds.height / 2);
        
        // 计算初始控制点位置（考虑旋转）
        const initialRotate = initial.rotate || 0;
        const rad = degToRad(initialRotate);
        
        // 使用文字的实际宽度和高度来计算控制点位置
        const fontSize = initial.fontSize || 14;
        const textContent = initial.text || "文字";
        const textWidth = textContent.length * fontSize * 0.6;
        const textHeight = fontSize;
        
        const handleOffsetX = handlePos.includes("e") ? textWidth / 2 : -textWidth / 2;
        const handleOffsetY = handlePos.includes("s") ? textHeight / 2 : -textHeight / 2;
        const rotatedOffsetX = handleOffsetX * Math.cos(rad) - handleOffsetY * Math.sin(rad);
        const rotatedOffsetY = handleOffsetX * Math.sin(rad) + handleOffsetY * Math.cos(rad);
        const initialHandleX = centerX + rotatedOffsetX;
        const initialHandleY = centerY + rotatedOffsetY;
        
        // 计算新的控制点位置
        const newHandleX = initialHandleX + deltaX;
        const newHandleY = initialHandleY + deltaY;
        
        // 计算角度差
        const initialAngle = Math.atan2(initialHandleY - centerY, initialHandleX - centerX);
        const newAngle = Math.atan2(newHandleY - centerY, newHandleX - centerX);
        let angleDiff = (newAngle - initialAngle) * (180 / Math.PI);
        
        // 规范化角度到 -180 到 180 度
        while (angleDiff > 180) angleDiff -= 360;
        while (angleDiff < -180) angleDiff += 360;
        
        // 平滑旋转，避免跳跃
        next.rotate = ((initialRotate + angleDiff) % 360 + 360) % 360;
        // 保持字体大小不变
        next.fontSize = fontSize;
      } else {
        // 边缘控制点：调整字体大小
        // 使用更平滑的缩放算法，根据移动距离计算缩放比例
        const currentFontSize = initial.fontSize || 14;
        const textContent = initial.text || "文字";
        const textWidth = textContent.length * currentFontSize * 0.6;
        const textHeight = currentFontSize;
        
        // 根据控制点位置确定缩放方向
        let scaleFactor = 1;
        if (handlePos === "n" || handlePos === "s") {
          // 上下控制点：根据垂直移动调整字体大小
          scaleFactor = 1 + (deltaY / textHeight);
        } else if (handlePos === "e" || handlePos === "w") {
          // 左右控制点：根据水平移动调整字体大小
          scaleFactor = 1 + (deltaX / textWidth);
        }
        
        // 计算新的字体大小，限制在合理范围内
        const newFontSize = Math.max(MIN_FONT_SIZE, Math.min(200, currentFontSize * scaleFactor));
        next.fontSize = Math.round(newFontSize * 10) / 10; // 保留一位小数，使缩放更平滑
        // 保持旋转角度不变
        next.rotate = initial.rotate || 0;
      }
    }
    return next;
  });
};

const findPointById = (pointId, craneId) => {
  if (!pointId) return null;
  if (craneId) {
    const targetCrane = cranes.value.find((crane) => crane.id === craneId);
    if (targetCrane) {
      const point = targetCrane.points?.find((p) => p.id === pointId);
      if (point) return { crane: targetCrane, point };
    }
  }
  for (const crane of cranes.value) {
    if (!crane.points) continue;
    const point = crane.points.find((p) => p.id === pointId);
    if (point) {
      return { crane, point };
    }
  }
  return null;
};

const degToRad = (deg) => (deg * Math.PI) / 180;

const rotatePoint = (x, y, angleDeg = 0) => {
  const rad = degToRad(angleDeg);
  return {
    x: x * Math.cos(rad) - y * Math.sin(rad),
    y: x * Math.sin(rad) + y * Math.cos(rad),
  };
};

const createTrianglePoints = (cx, cy, size = 60, rotateDeg = 0) => {
  const half = size / 2;
  const points = [
    rotatePoint(0, -half, rotateDeg),
    rotatePoint(half, half, rotateDeg),
    rotatePoint(-half, half, rotateDeg),
  ];
  return points.map((p) => `${cx + p.x},${cy + p.y}`).join(" ");
};

const polarToCartesian = (cx, cy, radius, angleDeg) => {
  const rad = degToRad(angleDeg);
  return {
    x: cx + radius * Math.cos(rad),
    y: cy + radius * Math.sin(rad),
  };
};

const createSectorPath = (cx, cy, radius, startAngleDeg, endAngleDeg) => {
  const start = polarToCartesian(cx, cy, radius, startAngleDeg);
  const end = polarToCartesian(cx, cy, radius, endAngleDeg);
  const largeArcFlag = Math.abs(endAngleDeg - startAngleDeg) > 180 ? 1 : 0;
  return [
    `M ${cx} ${cy}`,
    `L ${start.x} ${start.y}`,
    `A ${radius} ${radius} 0 ${largeArcFlag} ${endAngleDeg >= startAngleDeg ? 1 : 0} ${end.x} ${end.y}`,
    "Z",
  ].join(" ");
};

const isShapeResizable = (tool) =>
  ["rectangle", "circle", "triangle", "sector", "text"].includes(tool);

// 获取图形的边界框（用于显示控制点）
const getShapeBounds = (item) => {
  const config = item.config || {};
  if (item.tool === "rectangle") {
    const width = config.width || 80;
    const height = config.height || 40;
    return {
      left: item.canvasX - width / 2,
      right: item.canvasX + width / 2,
      top: item.canvasY - height / 2,
      bottom: item.canvasY + height / 2,
      width,
      height,
    };
  }
  if (item.tool === "circle") {
    const radius = config.radius || MIN_RADIUS;
    return {
      left: item.canvasX - radius,
      right: item.canvasX + radius,
      top: item.canvasY - radius,
      bottom: item.canvasY + radius,
      width: radius * 2,
      height: radius * 2,
    };
  }
  if (item.tool === "triangle") {
    const size = config.size || MIN_TRIANGLE_SIZE;
    return {
      left: item.canvasX - size / 2,
      right: item.canvasX + size / 2,
      top: item.canvasY - size / 2,
      bottom: item.canvasY + size / 2,
      width: size,
      height: size,
    };
  }
  if (item.tool === "sector") {
    const radius = config.radius || MIN_RADIUS;
    return {
      left: item.canvasX - radius,
      right: item.canvasX + radius,
      top: item.canvasY - radius,
      bottom: item.canvasY + radius,
      width: radius * 2,
      height: radius * 2,
    };
  }
  if (item.tool === "text") {
    const fontSize = config.fontSize || 14;
    const textContent = config.text || "文字";
    // 更准确地计算文字宽度，考虑字符间距
    const textWidth = Math.max(textContent.length * fontSize * 0.6, fontSize * 2);
    const textHeight = fontSize;
    // 添加一些边距，使控制点更容易点击
    const padding = 4;
    return {
      left: item.canvasX - textWidth / 2 - padding,
      right: item.canvasX + textWidth / 2 + padding,
      top: item.canvasY - textHeight / 2 - padding,
      bottom: item.canvasY + textHeight / 2 + padding,
      width: textWidth + padding * 2,
      height: textHeight + padding * 2,
    };
  }
  return null;
};

// 获取8个控制点的位置（类似 Figma）
const getResizeHandles = (item) => {
  const bounds = getShapeBounds(item);
  if (!bounds) return [];
  
  const { left, right, top, bottom, width, height } = bounds;
  const centerX = (left + right) / 2;
  const centerY = (top + bottom) / 2;
  
  return [
    { x: left, y: top, position: "nw" },      // 左上
    { x: centerX, y: top, position: "n" },    // 上
    { x: right, y: top, position: "ne" },     // 右上
    { x: right, y: centerY, position: "e" },  // 右
    { x: right, y: bottom, position: "se" },   // 右下
    { x: centerX, y: bottom, position: "s" }, // 下
    { x: left, y: bottom, position: "sw" },   // 左下
    { x: left, y: centerY, position: "w" },   // 左
  ];
};

const drawShapeOverlays = () => {
  if (!ctx.value) return;
  shapeOverlays.value.forEach((shape) => {
    const matched = findPointById(shape.pointId, shape.craneId);
    if (!matched) return;
    const baseCoords = convertToCanvasCoords(matched.point.x, matched.point.y);
    const offsetX = Number(shape.config?.offsetX) || 0;
    const offsetY = Number(shape.config?.offsetY) || 0;
    const coords = {
      x: baseCoords.x + offsetX,
      y: baseCoords.y + offsetY,
    };
    switch (shape.tool) {
      case "rectangle":
        drawRectangleShape(coords, shape.config);
        break;
      case "circle":
        drawCircleShape(coords, shape.config);
        break;
      case "triangle":
        drawTriangleShape(coords, shape.config);
        break;
      case "sector":
        drawSectorShape(coords, shape.config);
        break;
      case "text":
        drawTextShape(coords, shape.config);
        break;
      default:
        break;
    }
  });
};

const drawRectangleShape = (coords, config = {}) => {
  const width = config.width || 80;
  const height = config.height || 40;
  ctx.value.save();
  ctx.value.translate(coords.x, coords.y);
  ctx.value.rotate(degToRad(config.rotate || 0));
  ctx.value.beginPath();
  ctx.value.rect(-width / 2, -height / 2, width, height);
  ctx.value.fillStyle = config.fill || "rgba(255,255,255,0.2)";
  ctx.value.fill();
  ctx.value.strokeStyle = config.stroke || "#F59A23";
  ctx.value.lineWidth = 2;
  ctx.value.stroke();
  ctx.value.restore();
};

const drawCircleShape = (coords, config = {}) => {
  const radius = config.radius || 40;
  ctx.value.save();
  ctx.value.beginPath();
  ctx.value.arc(coords.x, coords.y, radius, 0, Math.PI * 2);
  ctx.value.fillStyle = config.fill || "rgba(38,132,255,0.25)";
  ctx.value.fill();
  ctx.value.strokeStyle = config.stroke || "#2684FF";
  ctx.value.lineWidth = 2;
  ctx.value.stroke();
  ctx.value.restore();
};

const drawTriangleShape = (coords, config = {}) => {
  const size = config.size || 70;
  ctx.value.save();
  ctx.value.translate(coords.x, coords.y);
  ctx.value.rotate(degToRad(config.rotate || 0));
  ctx.value.beginPath();
  ctx.value.moveTo(0, -size / 2);
  ctx.value.lineTo(size / 2, size / 2);
  ctx.value.lineTo(-size / 2, size / 2);
  ctx.value.closePath();
  ctx.value.fillStyle = config.fill || "rgba(245,108,108,0.25)";
  ctx.value.fill();
  ctx.value.strokeStyle = config.stroke || "#F56C6C";
  ctx.value.lineWidth = 2;
  ctx.value.stroke();
  ctx.value.restore();
};

const drawSectorShape = (coords, config = {}) => {
  const radius = config.radius || 80;
  const angle = config.angle || 60;
  const rotate = config.rotate || 0;
  const startAngle = degToRad(rotate);
  const endAngle = degToRad(rotate + angle);
  
  ctx.value.save();
  ctx.value.beginPath();
  ctx.value.moveTo(coords.x, coords.y);
  ctx.value.arc(coords.x, coords.y, radius, startAngle, endAngle);
  ctx.value.closePath();
  ctx.value.fillStyle = config.fill || "rgba(255,196,112,0.25)";
  ctx.value.fill();
  ctx.value.strokeStyle = config.stroke || "#F59A23";
  ctx.value.lineWidth = 2;
  ctx.value.stroke();
  ctx.value.restore();
};

const drawTextShape = (coords, config = {}) => {
  ctx.value.save();
  ctx.value.font = `${config.fontSize || 14}px "PingFang SC", "Microsoft YaHei", sans-serif`;
  ctx.value.fillStyle = config.color || "#1F2D3D";
  ctx.value.textAlign = "center";
  ctx.value.textBaseline = "middle";
  ctx.value.fillText(config.text || "文字", coords.x, coords.y);
  ctx.value.restore();
};

const capturePointSnapshot = (point) => {
  if (!canvas.value) return null;
  const { x, y } = convertToCanvasCoords(point.x, point.y);
  const radius = 100; // 以点位为中心，半径为100px进行截图
  const size = radius * 2;
  const snapshotCanvas = document.createElement("canvas");
  snapshotCanvas.width = size;
  snapshotCanvas.height = size;
  const snapshotCtx = snapshotCanvas.getContext("2d");

  const sx = Math.max(0, x - radius);
  const sy = Math.max(0, y - radius);
  const sw = Math.min(size, canvas.value.width - sx);
  const sh = Math.min(size, canvas.value.height - sy);

  // 填充白色背景
  snapshotCtx.fillStyle = "#ffffff";
  snapshotCtx.fillRect(0, 0, size, size);
  
  // 先绘制 Canvas 内容
  snapshotCtx.drawImage(
    canvas.value,
    sx,
    sy,
    sw,
    sh,
    (size - sw) / 2,
    (size - sh) / 2,
    sw,
    sh
  );

  // 获取该点位的形状，绘制到截图 Canvas 上
  const shapes = getShapesForPoint(point.id);
  if (shapes.length > 0) {
    shapes.forEach((shape) => {
      const shapeCoords = convertToCanvasCoords(
        shape.position?.x || point.x,
        shape.position?.y || point.y
      );
      
      // 计算形状相对于截图区域的偏移
      const offsetX = shapeCoords.x - sx - radius;
      const offsetY = shapeCoords.y - sy - radius;
      
      // 在截图 Canvas 上绘制形状
      snapshotCtx.save();
      snapshotCtx.translate(radius + offsetX, radius + offsetY);
      
      const config = shape.config || {};
      switch (shape.tool) {
        case "rectangle":
          snapshotCtx.rotate(degToRad(config.rotate || 0));
          snapshotCtx.fillStyle = config.fill || "rgba(255,255,255,0.2)";
          snapshotCtx.strokeStyle = config.stroke || "#F59A23";
          snapshotCtx.lineWidth = 2;
          snapshotCtx.fillRect(-(config.width || 80) / 2, -(config.height || 40) / 2, config.width || 80, config.height || 40);
          snapshotCtx.strokeRect(-(config.width || 80) / 2, -(config.height || 40) / 2, config.width || 80, config.height || 40);
          break;
        case "circle":
          snapshotCtx.fillStyle = config.fill || "rgba(38,132,255,0.25)";
          snapshotCtx.strokeStyle = config.stroke || "#2684FF";
          snapshotCtx.lineWidth = 2;
          snapshotCtx.beginPath();
          snapshotCtx.arc(0, 0, config.radius || 38, 0, Math.PI * 2);
          snapshotCtx.fill();
          snapshotCtx.stroke();
          break;
        case "triangle":
          const triSize = config.size || 72;
          snapshotCtx.fillStyle = config.fill || "rgba(245,108,108,0.25)";
          snapshotCtx.strokeStyle = config.stroke || "#F56C6C";
          snapshotCtx.lineWidth = 2;
          snapshotCtx.rotate(degToRad(config.rotate || 0));
          snapshotCtx.beginPath();
          snapshotCtx.moveTo(0, -triSize / 2);
          snapshotCtx.lineTo(triSize / 2, triSize / 2);
          snapshotCtx.lineTo(-triSize / 2, triSize / 2);
          snapshotCtx.closePath();
          snapshotCtx.fill();
          snapshotCtx.stroke();
          break;
        case "sector":
          const sectorRadius = config.radius || 90;
          const startAngle = degToRad(config.rotate || -30);
          const endAngle = degToRad((config.rotate || -30) + (config.angle || 60));
          snapshotCtx.fillStyle = config.fill || "rgba(255,196,112,0.25)";
          snapshotCtx.strokeStyle = config.stroke || "#F59A23";
          snapshotCtx.lineWidth = 2;
          snapshotCtx.beginPath();
          snapshotCtx.moveTo(0, 0);
          snapshotCtx.arc(0, 0, sectorRadius, startAngle, endAngle);
          snapshotCtx.closePath();
          snapshotCtx.fill();
          snapshotCtx.stroke();
          break;
        case "text":
          snapshotCtx.rotate(degToRad(config.rotate || 0));
          snapshotCtx.fillStyle = config.color || "#1F2D3D";
          snapshotCtx.font = `${config.fontSize || 14}px sans-serif`;
          snapshotCtx.textAlign = "center";
          snapshotCtx.textBaseline = "middle";
          snapshotCtx.fillText(config.text || "文字", 0, 0);
          break;
      }
      
      snapshotCtx.restore();
    });
  }

  return snapshotCanvas.toDataURL("image/png");
};

const mockSaveDrawing = (payload) =>
  new Promise((resolve) => {
    console.log("Mock保存绘制结果:", payload);
    setTimeout(() => resolve({ code: 0 }), 800);
  });

// 计算属性：是否有起点
const hasStartPoint = computed(() => {
  return selectedCrane.value && Array.isArray(selectedCrane.value.points) && selectedCrane.value.points.length > 0;
});

const isAddingStartPoint = computed(() => newPoint.value?.isStart === true);

const isEditingStartPoint = computed(() => editingPointIndex.value === 0);

// 全局测试函数，可以在浏览器控制台调用
window.testShapeRender = () => {
  console.log("========== 手动测试形状渲染 ==========");
  console.log("shapeOverlays 数量:", shapeOverlays.value.length);
  console.log("renderedShapeItems 数量:", renderedShapeItems.value.length);
  console.log("canvasSize:", canvasSize);
  console.log("canvas 存在:", !!canvas.value);
  console.log("selectedCrane:", selectedCrane.value?.name);
  console.log("cranes 数量:", cranes.value.length);
  
  // 如果有形状数据但没有渲染，尝试强制刷新
  if (shapeOverlays.value.length > 0 && renderedShapeItems.value.length === 0) {
    console.log("尝试强制刷新...");
    shapeOverlays.value = [...shapeOverlays.value];
    nextTick(() => {
      const items = renderedShapeItems.value;
      console.log("强制刷新后 renderedShapeItems 数量:", items.length);
      if (items.length === 0) {
        console.warn("⚠️ 强制刷新后仍然无法渲染");
        // 尝试添加一个测试形状
        if (cranes.value.length > 0 && cranes.value[0].points?.length > 0) {
          const testPoint = cranes.value[0].points[0];
          const testShape = {
            id: 'manual_test_' + Date.now(),
            tool: 'rectangle',
            pointId: testPoint.id,
            craneId: cranes.value[0].id,
            position: { x: testPoint.x, y: testPoint.y },
            config: { width: 100, height: 50, fill: 'rgba(255,0,0,0.5)', stroke: '#ff0000' }
          };
          shapeOverlays.value = [...shapeOverlays.value, testShape];
          nextTick(() => {
            const testItems = renderedShapeItems.value;
            console.log("添加测试形状后 renderedShapeItems 数量:", testItems.length);
            if (testItems.length > 0) {
              console.log("✅ 测试形状可以渲染，说明渲染逻辑正常");
            } else {
              console.error("❌ 测试形状也无法渲染，说明渲染逻辑有问题");
            }
          });
        }
      }
    });
  }
  console.log("========== 手动测试完成 ==========");
};

onMounted(async () => {
  // 从路由参数获取项目ID
  projectId.value = route.params.id || "";
  console.log("总平规划项目ID:", projectId.value);
  // 加载项目数据
  if (projectId.value) {
    loadProjectData();
  }
  // 自动显示Dialog
  dialogVisible.value = false;
  
  // 初始化Canvas
  nextTick(() => {
    initCanvas();
  });
  
  // 监听窗口大小变化，重新调整Canvas大小
  window.addEventListener('resize', handleResize);
  
  // 在页面加载完成后，延迟检查渲染状态
  setTimeout(() => {
    if (shapeOverlays.value.length > 0) {
      console.log("页面加载完成，检查渲染状态...");
      const items = renderedShapeItems.value;
      console.log("页面加载后 renderedShapeItems 数量:", items.length);
      if (items.length === 0) {
        console.warn("⚠️ 页面加载后形状未渲染，尝试强制刷新");
        shapeOverlays.value = [...shapeOverlays.value];
        nextTick(() => {
          const items2 = renderedShapeItems.value;
          console.log("强制刷新后 renderedShapeItems 数量:", items2.length);
        });
      }
    }
  }, 2000);
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
    canvasSize.width = canvas.value.width;
    canvasSize.height = canvas.value.height;
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
    canvasSize.width = canvas.value.width;
    canvasSize.height = canvas.value.height;
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
// 需要映射到图片在canvas上的实际位置（变换前的坐标，transform会自动应用）
const convertToCanvasCoords = (x, y) => {
  if (!imageRef.value || !canvas.value) {
    console.warn('图片或Canvas未加载，使用默认映射');
    // 如果图片或canvas未加载，使用默认映射
    return { x: x * 5, y: y * 5 };
  }
  
  try {
    // 获取图片的显示尺寸（变换后的尺寸）
    const imageRect = imageRef.value.getBoundingClientRect();
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
    
    // 将地理坐标归一化
    const normalizedX = (x - coordMinX.value) / coordRangeX;
    const normalizedY = (y - coordMinY.value) / coordRangeY;
    
    // 映射到图片坐标（变换前的坐标，transform会自动应用）
    const canvasX = normalizedX * (displayedWidth / scale.value);
    const canvasY = normalizedY * (displayedHeight / scale.value);
    
    return { x: canvasX, y: canvasY };
  } catch (error) {
    console.error('坐标转换错误:', error);
    // 如果转换失败，使用默认映射
    return { x: x * 5, y: y * 5 };
  }
};

// 将Canvas坐标转换为地理坐标（canvasX和canvasY是变换前的坐标）
const convertToGeoCoords = (canvasX, canvasY) => {
  if (!imageRef.value || !canvas.value) {
    return { x: canvasX / 5, y: canvasY / 5 };
  }
  
  try {
    // 获取图片的显示尺寸（变换后的尺寸）
    const imageRect = imageRef.value.getBoundingClientRect();
    const displayedWidth = imageRect.width;
    const displayedHeight = imageRect.height;
    
    if (displayedWidth === 0 || displayedHeight === 0) {
      return { x: canvasX / 5, y: canvasY / 5 };
    }
    
    // canvasX和canvasY是变换前的坐标，需要归一化
    const normalizedX = canvasX / (displayedWidth / scale.value);
    const normalizedY = canvasY / (displayedHeight / scale.value);
    
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
  const drawPlaybackProgress = () => {
    if (!ctx.value) return;

    // 处理播放单个路径的情况
    if (isPlaying.value && animationPlan.value) {
      const plan = animationPlan.value;
      const currentTime = Math.min(playbackElapsed.value, plan.totalDuration);
      const color = plan.color || '#26256B';

      plan.segments.forEach((segment) => {
        if (segment.type !== 'travel') return;
        if (currentTime < segment.startTime + segment.duration) return;

        const fromCoords = plan.coords[segment.fromIndex];
        const toCoords = plan.coords[segment.toIndex];
        ctx.value.save();
        ctx.value.beginPath();
        ctx.value.moveTo(fromCoords.x, fromCoords.y);
        ctx.value.lineTo(toCoords.x, toCoords.y);
        ctx.value.strokeStyle = color;
        ctx.value.lineWidth = 4;
        ctx.value.stroke();
        ctx.value.restore();
      });

      const activeSegment = plan.segments.find((segment) => currentTime < segment.startTime + segment.duration)
        || plan.segments[plan.segments.length - 1];
      if (!activeSegment) return;

      if (activeSegment.type === 'travel') {
        const fromCoords = plan.coords[activeSegment.fromIndex];
        const toCoords = plan.coords[activeSegment.toIndex];
        // 计算当前段的方向角度（用于旋转起重机模型）
        const angle = Math.atan2(
          toCoords.y - fromCoords.y,
          toCoords.x - fromCoords.x
        );
        const elapsed = Math.max(0, currentTime - activeSegment.startTime);
        const progress = activeSegment.duration > 0 ? Math.min(elapsed / activeSegment.duration, 1) : 1;
        const currentX = fromCoords.x + (toCoords.x - fromCoords.x) * progress;
        const currentY = fromCoords.y + (toCoords.y - fromCoords.y) * progress;

        ctx.value.save();
        ctx.value.beginPath();
        ctx.value.moveTo(fromCoords.x, fromCoords.y);
        ctx.value.lineTo(currentX, currentY);
        ctx.value.strokeStyle = color;
        ctx.value.lineWidth = 4;
        ctx.value.stroke();
        ctx.value.restore();

        // 绘制起重机模型图片，并保持与路径方向平行
        ctx.value.save();
        if (craneModelImage.complete) {
          const imageSize = 24; // 图片大小
          ctx.value.translate(currentX, currentY);
          ctx.value.rotate(angle);
          ctx.value.drawImage(
            craneModelImage,
            -imageSize / 2,
            -imageSize / 2,
            imageSize,
            imageSize
          );
        }
        ctx.value.restore();
      } else if (activeSegment.type === 'dwell') {
        const pointCoords = plan.coords[activeSegment.pointIndex];
        // 停留段：使用上一段行驶段的方向保持图片与路径平行
        let angle = 0;
        const prevTravel = [...plan.segments]
          .filter(s => s.type === 'travel' && s.startTime <= currentTime)
          .pop();
        if (prevTravel) {
          const prevFrom = plan.coords[prevTravel.fromIndex];
          const prevTo = plan.coords[prevTravel.toIndex];
          angle = Math.atan2(
            prevTo.y - prevFrom.y,
            prevTo.x - prevFrom.x
          );
        }

        // 绘制起重机模型图片
        ctx.value.save();
        if (craneModelImage.complete) {
          const imageSize = 24; // 图片大小
          ctx.value.translate(pointCoords.x, pointCoords.y);
          ctx.value.rotate(angle);
          ctx.value.drawImage(
            craneModelImage,
            -imageSize / 2,
            -imageSize / 2,
            imageSize,
            imageSize
          );
        }
        ctx.value.restore();
      }
    }
    
    // 处理播放所有路径的情况
    else if (isPlayingAll.value) {
      Object.values(animationPlans.value).forEach((plan) => {
        const currentTime = Math.min(playbackElapsed.value, plan.totalDuration);
        const color = plan.color || '#26256B';

        plan.segments.forEach((segment) => {
          if (segment.type !== 'travel') return;
          if (currentTime < segment.startTime + segment.duration) return;

          const fromCoords = plan.coords[segment.fromIndex];
          const toCoords = plan.coords[segment.toIndex];
          ctx.value.save();
          ctx.value.beginPath();
          ctx.value.moveTo(fromCoords.x, fromCoords.y);
          ctx.value.lineTo(toCoords.x, toCoords.y);
          ctx.value.strokeStyle = color;
          ctx.value.lineWidth = 4;
          ctx.value.stroke();
          ctx.value.restore();
        });

        const activeSegment = plan.segments.find((segment) => currentTime < segment.startTime + segment.duration)
          || plan.segments[plan.segments.length - 1];
        if (!activeSegment) return;

        if (activeSegment.type === 'travel') {
          const fromCoords = plan.coords[activeSegment.fromIndex];
          const toCoords = plan.coords[activeSegment.toIndex];
          // 计算当前段的方向角度（用于旋转起重机模型）
          const angle = Math.atan2(
            toCoords.y - fromCoords.y,
            toCoords.x - fromCoords.x
          );
          const elapsed = Math.max(0, currentTime - activeSegment.startTime);
          const progress = activeSegment.duration > 0 ? Math.min(elapsed / activeSegment.duration, 1) : 1;
          const currentX = fromCoords.x + (toCoords.x - fromCoords.x) * progress;
          const currentY = fromCoords.y + (toCoords.y - fromCoords.y) * progress;

          ctx.value.save();
          ctx.value.beginPath();
          ctx.value.moveTo(fromCoords.x, fromCoords.y);
          ctx.value.lineTo(currentX, currentY);
          ctx.value.strokeStyle = color;
          ctx.value.lineWidth = 4;
          ctx.value.stroke();
          ctx.value.restore();

          // 绘制起重机模型图片，并保持与路径方向平行
          ctx.value.save();
          if (craneModelImage.complete) {
            const imageSize = 24; // 图片大小
            ctx.value.translate(currentX, currentY);
            ctx.value.rotate(angle);
            ctx.value.drawImage(
              craneModelImage,
              -imageSize / 2,
              -imageSize / 2,
              imageSize,
              imageSize
            );
          }
          ctx.value.restore();
        } else if (activeSegment.type === 'dwell') {
          const pointCoords = plan.coords[activeSegment.pointIndex];
          // 停留段：使用上一段行驶段的方向保持图片与路径平行
          let angle = 0;
          const prevTravel = [...plan.segments]
            .filter(s => s.type === 'travel' && s.startTime <= currentTime)
            .pop();
          if (prevTravel) {
            const prevFrom = plan.coords[prevTravel.fromIndex];
            const prevTo = plan.coords[prevTravel.toIndex];
            angle = Math.atan2(
              prevTo.y - prevFrom.y,
              prevTo.x - prevFrom.x
            );
          }

          // 绘制起重机模型图片
          ctx.value.save();
          if (craneModelImage.complete) {
            const imageSize = 24; // 图片大小
            ctx.value.translate(pointCoords.x, pointCoords.y);
            ctx.value.rotate(angle);
            ctx.value.drawImage(
              craneModelImage,
              -imageSize / 2,
              -imageSize / 2,
              imageSize,
              imageSize
            );
          }
          ctx.value.restore();
        }
      });
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
  
  // 应用变换：先平移，再缩放
  ctx.value.save();
  ctx.value.translate(offsetX.value, offsetY.value);
  ctx.value.scale(scale.value, scale.value);
  
  // 先绘制背景图片（如果存在）
  if (imageRef.value && imageRef.value.complete) {
    ctx.value.save();
    // 直接绘制图片，填充整个canvas
    ctx.value.drawImage(
      imageRef.value,
      0,
      0,
      canvas.value.width,
      canvas.value.height
    );
    ctx.value.restore();
  }
  
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
  
  // 点位占位图形现在由 SVG overlay 渲染，不再在 Canvas 上绘制
  // drawShapeOverlays(); // 已移除，避免与 SVG overlay 重复渲染
  
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
    
    // 对于起点，使用带颜色的SVG图标
    let iconImage;
    if (iconKey === 'start') {
      iconImage = getStartIconWithColor(color);
    } else {
      iconImage = pointIconImages[iconKey];
    }
    
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
  if ((isPlaying.value && animationPlan.value) || isPlayingAll.value) {
    drawPlaybackProgress();
  }
  
  // 恢复变换
  ctx.value.restore();
};

// 获取鼠标在Canvas上的坐标（考虑transform的逆变换）
const getMouseCanvasPos = (event) => {
  if (!canvas.value) return { x: 0, y: 0 };
  
  const rect = canvas.value.getBoundingClientRect();
  // 获取鼠标在Canvas元素上的像素坐标
  const pixelX = event.clientX - rect.left;
  const pixelY = event.clientY - rect.top;
  
  // 应用transform的逆变换：先反向缩放，再反向平移
  const x = (pixelX - offsetX.value) / scale.value;
  const y = (pixelY - offsetY.value) / scale.value;
  
  return { x, y };
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

// 检查是否点击在图形上
const isClickOnShape = (x, y) => {
  for (const item of renderedShapeItems.value) {
    const config = item.config || {};
    let hit = false;
    
    if (item.tool === "rectangle") {
      const width = config.width || 80;
      const height = config.height || 40;
      const left = item.canvasX - width / 2;
      const right = item.canvasX + width / 2;
      const top = item.canvasY - height / 2;
      const bottom = item.canvasY + height / 2;
      hit = x >= left && x <= right && y >= top && y <= bottom;
    } else if (item.tool === "circle") {
      const radius = config.radius || MIN_RADIUS;
      const dist = Math.sqrt(Math.pow(x - item.canvasX, 2) + Math.pow(y - item.canvasY, 2));
      hit = dist <= radius;
    } else if (item.tool === "triangle") {
      const size = config.size || MIN_TRIANGLE_SIZE;
      const half = size / 2;
      // 简化的三角形碰撞检测
      const dx = Math.abs(x - item.canvasX);
      const dy = Math.abs(y - item.canvasY);
      hit = dx + dy <= half * 1.5;
    } else if (item.tool === "sector") {
      const radius = config.radius || MIN_RADIUS;
      const dist = Math.sqrt(Math.pow(x - item.canvasX, 2) + Math.pow(y - item.canvasY, 2));
      hit = dist <= radius;
    } else if (item.tool === "text") {
      const fontSize = config.fontSize || 14;
      const textWidth = (config.text || "文字").length * fontSize * 0.6;
      const textHeight = fontSize;
      hit = Math.abs(x - item.canvasX) <= textWidth / 2 && Math.abs(y - item.canvasY) <= textHeight / 2;
    }
    
    if (hit) {
      return true;
    }
  }
  return false;
};

// 鼠标按下事件处理
const handleCanvasMouseDown = (event) => {
  // 如果点击在图形上，不处理 canvas 事件（让 SVG 层处理）
  const mousePos = getMouseCanvasPos(event);
  if (isClickOnShape(mousePos.x, mousePos.y)) {
    return;
  }
  
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
      // 在 nextTick 中设置点位选中状态，确保在 syncActivePointSelection 之后执行
      nextTick(() => {
        activePointId.value = hitPoint.point.id;
      });
    } else {
      // 在点位设置中选中该点位
      activePointId.value = hitPoint.point.id;
    }
  } else {
    // 开始拖动Canvas
    isDragging.value = true;
    lastMouseX.value = event.clientX;
    lastMouseY.value = event.clientY;
    canvas.value.style.cursor = 'grabbing';
    // 取消选中图形
    activeShapeId.value = null;
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
    
    // 如果正在播放动画，更新动画计划
    if (isPlaying.value && animationPlan.value && playingCraneId.value === draggedCrane.value.id) {
      // 重新计算当前播放的动画计划
      const newPlan = computeAnimationPlan(draggedCrane.value.points, draggedCrane.value.color);
      if (newPlan) {
        animationPlan.value = newPlan;
      }
    }
    
    // 如果正在播放所有路径动画，更新对应的动画计划
    if (isPlayingAll.value && animationPlans.value[draggedCrane.value.id]) {
      // 重新计算当前拖动的起重机的动画计划
      const newPlan = computeAnimationPlan(draggedCrane.value.points, draggedCrane.value.color);
      if (newPlan) {
        animationPlans.value[draggedCrane.value.id] = newPlan;
      }
    }
    
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
  
  const rect = canvas.value.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;
  
  const scaleRatio = event.deltaY > 0 ? 0.9 : 1.1;
  const newScale = Math.max(0.1, Math.min(5, scale.value * scaleRatio));
  
  // 调整偏移量以保持鼠标位置不变
  // 鼠标在变换前坐标系中的位置
  const worldX = (mouseX - offsetX.value) / scale.value;
  const worldY = (mouseY - offsetY.value) / scale.value;
  
  // 计算新的偏移量，使鼠标位置在变换后坐标系中保持不变
  offsetX.value = mouseX - worldX * newScale;
  offsetY.value = mouseY - worldY * newScale;
  
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
  let nextNumber = 1;
  
  // 如果已有起重机，从最后一个起重机的名称中提取数字并加1
  if (cranes.value.length > 0) {
    const lastCrane = cranes.value[cranes.value.length - 1];
    const match = lastCrane.name.match(/起重机(\d+)/);
    if (match && match[1]) {
      nextNumber = parseInt(match[1], 10) + 1;
    }
  }
  
  const newCrane = {
    id: Date.now(),
    name: `起重机${nextNumber}`,
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
  
  shapeOverlays.value = shapeOverlays.value.filter((shape) => shape.craneId !== id);
  if (activePointId.value && !selectedCrane.value) {
    activePointId.value = null;
  }
  if (!shapeOverlays.value.some((shape) => shape.id === activeShapeId.value)) {
    activeShapeId.value = null;
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
  nextTick(() => {
    syncActivePointSelection();
  });

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
    if (!selectedCrane.value) {
      ElMessage.warning("请先选择起重机");
      return;
    }
    
    // 判断是否已添加起点
    const pointCount = selectedCrane.value.points ? selectedCrane.value.points.length : 0;
    if (pointCount === 0) {
      ElMessage.warning("请先添加起点");
      return;
    }
    
    // 重置新点位数据
    const isStart = false; // 添加路径点位不是起点
    newPoint.value = createBasePoint({
      name: `吊装点位${pointCount}`,
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
      // 开始日期必填
      if (!isValidDateDay(newPoint.value.startTime)) {
        ElMessage.warning("请填写吊装点位的开始日期");
        return;
      }
      // 结束日期必填
      if (!newPoint.value.endTime || !isValidDateDay(newPoint.value.endTime)) {
        ElMessage.warning("请填写吊装点位的结束日期");
        return;
      }
      // 结束日期不能早于开始日期
      if (new Date(newPoint.value.endTime) < new Date(newPoint.value.startTime)) {
        ElMessage.warning("吊装点位的结束日期不能早于开始日期");
        return;
      }
      
      // 校验：后面一个点的开始时间要大于等于前面一个点的结束时间
      if (!isFirstPoint && currentPoints.length > 0) {
        // 找到前一个吊装点位
        for (let i = currentPoints.length - 1; i >= 0; i--) {
          const prevPoint = currentPoints[i];
          if (prevPoint.type === "lifting" && prevPoint.endTime) {
            const prevEndTime = new Date(prevPoint.endTime);
            const currentStartTime = new Date(newPoint.value.startTime);
            if (currentStartTime < prevEndTime) {
              ElMessage.warning(`当前点位的开始时间必须大于等于前一个吊装点位的结束时间（${prevPoint.endTime}）`);
              return;
            }
            break;
          }
        }
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
      endTime: pointType === "lifting" ? newPoint.value.endTime : null,
      name: getNextPointName(pointType, currentPoints, isFirstPoint),
    };

    const updatedPoints = [...currentPoints, pointToAdd];
    const normalized = updateCranePoints(selectedCrane.value.id, updatedPoints);
    selectedCrane.value.points = normalized;

    // 关闭弹窗
    addPointDialogVisible.value = false;
    ElMessage.success("点位已添加，可在图上拖动调整位置");
    
    // 如果添加的是吊装点位，自动选中该点位
    if (pointType === "lifting") {
      activePointId.value = pointToAdd.id;
    }
    
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
      endTime: point.endTime ? String(point.endTime) : null,
      remarks: point.remarks || "",
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
      // 开始日期必填
      if (!isValidDateDay(updatedPoint.startTime)) {
        ElMessage.warning("请填写吊装点位的开始日期");
        return;
      }
      // 结束日期必填
      if (!updatedPoint.endTime || !isValidDateDay(updatedPoint.endTime)) {
        ElMessage.warning("请填写吊装点位的结束日期");
        return;
      }
      // 结束日期不能早于开始日期
      if (new Date(updatedPoint.endTime) < new Date(updatedPoint.startTime)) {
        ElMessage.warning("吊装点位的结束日期不能早于开始日期");
        return;
      }
      
      // 校验：后面一个点的开始时间要大于等于前面一个点的结束时间
      // 检查前一个吊装点位
      if (editingPointIndex.value > 0) {
        for (let i = editingPointIndex.value - 1; i >= 0; i--) {
          const prevPoint = currentPoints[i];
          if (prevPoint.type === "lifting" && prevPoint.endTime) {
            const prevEndTime = new Date(prevPoint.endTime);
            const currentStartTime = new Date(updatedPoint.startTime);
            if (currentStartTime < prevEndTime) {
              ElMessage.warning(`当前点位的开始时间必须大于等于前一个吊装点位的结束时间（${prevPoint.endTime}）`);
              return;
            }
            break;
          }
        }
      }
      
      // 检查后一个吊装点位
      if (updatedPoint.endTime && editingPointIndex.value < currentPoints.length - 1) {
        for (let i = editingPointIndex.value + 1; i < currentPoints.length; i++) {
          const nextPoint = currentPoints[i];
          if (nextPoint.type === "lifting" && nextPoint.startTime) {
            const currentEndTime = new Date(updatedPoint.endTime);
            const nextStartTime = new Date(nextPoint.startTime);
            if (nextStartTime < currentEndTime) {
              ElMessage.warning(`后一个吊装点位的开始时间（${nextPoint.startTime}）必须大于等于当前点位的结束时间`);
              return;
            }
            break;
          }
        }
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
  const removedPoint = currentPoints[index];
    currentPoints.splice(index, 1);
    const normalized = updateCranePoints(selectedCrane.value.id, currentPoints);
    selectedCrane.value.points = normalized;
  if (removedPoint?.id) {
    shapeOverlays.value = shapeOverlays.value.filter((shape) => shape.pointId !== removedPoint.id);
    if (activePointId.value === removedPoint.id) {
      activePointId.value = null;
      nextTick(() => syncActivePointSelection());
    }
    if (!shapeOverlays.value.some((shape) => shape.id === activeShapeId.value)) {
      activeShapeId.value = null;
    }
  }
    
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
  // 加载项目数据（编辑时调用）
  const loadProjectData = async () => {
    if (!projectId.value) {
      console.log("项目ID不存在，跳过数据加载");
      return;
    }

    try {
      console.log("========== 开始加载项目数据 ==========");
      console.log("项目ID:", projectId.value);
      
      // 清空之前的形状数据
      shapeOverlays.value = [];
      console.log("已清空之前的形状数据");
      
      const response = await getGeneralDetails(projectId.value);
      
      if (response && response.code === "0" && response.data) {
        
        // 检查 flatInfo 中每个点位的 shapes 数据
        if (response.data.flatInfo && Array.isArray(response.data.flatInfo)) {
          response.data.flatInfo.forEach((flatInfo, index) => {
            console.log(`flatInfo[${index}]:`, flatInfo);
            if (flatInfo.sysProjectFlatDetailItem && Array.isArray(flatInfo.sysProjectFlatDetailItem)) {
              flatInfo.sysProjectFlatDetailItem.forEach((item, itemIndex) => {
                console.log(`  点位[${itemIndex}]:`, {
                  id: item.id,
                  pointName: item.pointName,
                  hasShapes: !!item.shapes,
                  shapesType: typeof item.shapes,
                  shapesValue: item.shapes ? (typeof item.shapes === 'string' ? item.shapes.substring(0, 100) : item.shapes) : null
                });
              });
            }
          });
        }
        
        // 设置项目标题（优先从 sysProjectInfo 获取）
        let titleFound = false;
        
        if (response.data.sysProjectInfo) {
          const title = response.data.sysProjectInfo.title;
          console.log("从 sysProjectInfo 获取的 title:", title);
          if (title) {
            projectTitle.value = String(title).trim();
            console.log("✓ 已设置项目标题:", projectTitle.value);
            titleFound = true;
          } else {
            console.warn("sysProjectInfo.title 为空或未定义");
          }
        } else {
          console.warn("response.data.sysProjectInfo 不存在");
        }
        
        // 如果还没有找到标题，尝试其他可能的路径
        if (!titleFound) {
          if (response.data.title) {
            projectTitle.value = String(response.data.title).trim();
            console.log("✓ 从 response.data.title 获取项目标题:", projectTitle.value);
            titleFound = true;
          }
        }
        
        // 如果仍然没有找到，尝试从路由 query 参数获取（如果 AllProjects 传递了）
        if (!titleFound && route.query.title) {
          projectTitle.value = String(route.query.title).trim();
          console.log("✓ 从路由 query 参数获取项目标题:", projectTitle.value);
          titleFound = true;
        }
        
        if (!titleFound) {
          console.error("❌ 无法获取项目标题，所有尝试都失败了");
        }
        
        if (response.data.flatInfo) {
          const flatInfoList = response.data.flatInfo;
          
          // 先收集所有形状数据，稍后添加
          const shapesToAdd = [];
          
          // 转换为前端数据结构
          const loadedCranes = flatInfoList.map((flatInfo) => {
            const craneDetail = flatInfo.sysProjectFlatDetail;
            const pointItems = flatInfo.sysProjectFlatDetailItem || [];
            
            // 转换点位数据
            const points = pointItems.map((item) => {
              // 转换日期格式（LocalDate -> Date string）
              const formatLocalDate = (localDate) => {
                if (!localDate) return null;
                if (typeof localDate === 'string') return localDate;
                if (localDate.year && localDate.month && localDate.day) {
                  const year = localDate.year;
                  const month = String(localDate.month).padStart(2, '0');
                  const day = String(localDate.day).padStart(2, '0');
                  return `${year}-${month}-${day}`;
                }
                return null;
              };
              
              // 确定点位类型
              const type = item.occupyType === 0 ? "lifting" : "moving";
              const isStart = item.pointType === 0;
              
              const pointData = {
                id: item.id,
                name: item.pointName || "",
                x: typeof item.x === "number" ? item.x : parseFloat(item.x) || 0,
                y: typeof item.y === "number" ? item.y : parseFloat(item.y) || 0,
                type: type,
                groundLoad: item.carryingCapacity || null,
                area: item.area || "",
                startTime: formatLocalDate(item.startTime),
                endTime: formatLocalDate(item.endTime),
                remarks: item.remarks || "",
                status: "completed",
                occupyLength: item.pointLength || null,
                occupyWidth: item.pointWidth || null,
                rotateAngle: item.rotateAngle || null,
                radius: item.workRadius || null,
                amplitude: item.amplitude || null,
                angle: 60,
                isStart: isStart,
                fileId: item.fileId || null,
                carryingCapacity: item.carryingCapacity || null,
                pointLength: item.pointLength || null,
                pointWidth: item.pointWidth || null,
                workRadius: item.workRadius || null,
                turnAround: item.turnAround || null,
              };
              
              // 收集形状数据（如果存在），稍后添加到 shapeOverlays
              // 支持一个点位上有多个文字，每个文字都有独立的位置坐标
              console.log(`检查点位 ${item.pointName} (ID: ${item.id}) 的形状数据:`, {
                hasShapes: !!item.shapes,
                shapesType: typeof item.shapes,
                shapesValue: item.shapes
              });
              
              // 尝试多种可能的字段名
              const shapesData = item.shapes || item.shapeData || item.shape || item.drawingShapes;
              
              if (shapesData) {
                try {
                  console.log(`点位 ${item.pointName} (ID: ${item.id}) 找到形状数据，类型:`, typeof shapesData);
                  // 将字符串转为数组
                  let shapesArray = [];
                  if (typeof shapesData === 'string') {
                    try {
                      shapesArray = JSON.parse(shapesData);
                      console.log(`点位 ${item.pointName} JSON解析成功，数量:`, shapesArray.length);
                    } catch (parseError) {
                      console.error(`点位 ${item.pointName} JSON解析失败:`, parseError, shapesData);
                    }
                  } else if (Array.isArray(shapesData)) {
                    shapesArray = shapesData;
                    console.log(`点位 ${item.pointName} 形状数据是数组，数量:`, shapesArray.length);
                  } else {
                    console.warn(`点位 ${item.pointName} 形状数据格式未知:`, shapesData);
                  }
                  
                  if (Array.isArray(shapesArray) && shapesArray.length > 0) {
                    console.log(`点位 ${item.pointName} 解析后的形状数组:`, shapesArray);
                    shapesArray.forEach((shapeData, shapeIndex) => {
                      // 每个形状（包括文字）都有独立的位置坐标
                      // position 保存的是地理坐标（x, y），用于回显时正确定位
                      const shape = {
                        id: shapeData.id || `${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
                        tool: shapeData.tool,
                        pointId: item.id,
                        craneId: craneDetail.id,
                        position: shapeData.position || { x: pointData.x, y: pointData.y }, // 使用保存的位置坐标
                        config: shapeData.config || {}, // 包含文字内容（text 属性）和其他配置
                      };
                      console.log(`  形状[${shapeIndex}]:`, shape);
                      shapesToAdd.push(shape);
                    });
                  } else {
                    console.warn(`点位 ${item.pointName} 形状数组为空或无效`);
                  }
                } catch (error) {
                  console.error(`点位 ${item.pointName} 解析形状数据失败:`, error, shapesData);
                }
              } else {
                console.log(`点位 ${item.pointName} (ID: ${item.id}) 没有形状数据`);
              }
              
              return pointData;
            });
            
            // 构建起重机对象
            return {
              id: craneDetail.id,
              name: craneDetail.craneName || "",
              type: craneDetail.craneType || "",
              color: craneDetail.color || "#26256B",
              pathUseWidth: craneDetail.pathUseWidth || null,
              useTime: craneDetail.useTime || null,
              carryingCapacity: craneDetail.carryingCapacity || null,
              points: points,
            };
          });
        
          // 更新起重机列表
          cranes.value = loadedCranes;
          
          // 等待 DOM 更新
          await nextTick();
          
          // 等待 Canvas 初始化
          if (!canvasSize.width || !canvasSize.height) {
            let retries = 0;
            while ((!canvasSize.width || !canvasSize.height) && retries < 20) {
              await new Promise(resolve => setTimeout(resolve, 50));
              retries++;
            }
          }
          
          // 在 selectCrane 之前添加形状数据，避免 selectCrane 修改点位数据导致 ID 不匹配
          if (shapesToAdd.length > 0) {
            console.log(`========== 开始添加形状数据 ==========`);
            console.log(`准备添加 ${shapesToAdd.length} 个形状到 shapeOverlays`);
            console.log(`当前起重机数量:`, cranes.value.length);
            console.log(`当前点位总数:`, cranes.value.reduce((sum, crane) => sum + (crane.points?.length || 0), 0));
            
            // 验证形状数据中的点位 ID 是否存在于起重机数据中
            shapesToAdd.forEach((shape, index) => {
              const matched = findPointById(shape.pointId, shape.craneId);
              if (!matched) {
                console.warn(`形状[${index}] ${shape.id} 无法找到点位 pointId=${shape.pointId}, craneId=${shape.craneId}`);
                // 尝试在所有起重机中查找
                for (const crane of cranes.value) {
                  const point = crane.points?.find(p => p.id === shape.pointId);
                  if (point) {
                    console.log(`  通过全局查找找到点位: ${point.name} (ID: ${point.id})`);
                    shape.craneId = crane.id;
                    break;
                  }
                }
                
                // 如果还是找不到，尝试通过位置坐标匹配
                if (!matched && shape.position) {
                  for (const crane of cranes.value) {
                    const point = crane.points?.find(p => 
                      Math.abs(p.x - shape.position.x) < 0.1 && 
                      Math.abs(p.y - shape.position.y) < 0.1
                    );
                    if (point) {
                      console.log(`  通过坐标匹配找到点位: ${point.name} (ID: ${point.id})`);
                      shape.pointId = point.id;
                      shape.craneId = crane.id;
                      break;
                    }
                  }
                }
              } else {
                console.log(`形状[${index}] ${shape.id} 成功匹配到点位: ${matched.point.name} (ID: ${matched.point.id})`);
              }
            });
            
            // 添加形状数据
            shapeOverlays.value = [...shapesToAdd];
            console.log(`已添加，当前 shapeOverlays 数量:`, shapeOverlays.value.length);
            
            // 强制触发响应式更新
            await nextTick();
            
            // 再次强制更新，确保 Vue 响应式系统能检测到变化
            shapeOverlays.value = [...shapeOverlays.value];
            await nextTick();
            
            console.log(`========== 形状数据添加完成 ==========`);
          }
          
          // 如果有数据，选中第一个起重机（在添加形状之后）
          if (loadedCranes.length > 0) {
            selectCrane(loadedCranes[0]);
            await nextTick();
            
            // 再次强制更新 shapeOverlays，确保在 selectCrane 之后也能正确渲染
            if (shapesToAdd.length > 0) {
              // 多次强制刷新，确保响应式更新
              for (let i = 0; i < 3; i++) {
                shapeOverlays.value = [...shapeOverlays.value];
                await nextTick();
                await new Promise(resolve => setTimeout(resolve, 50));
              }
              
              // 延迟再次强制刷新，确保所有响应式更新都完成
              setTimeout(() => {
                shapeOverlays.value = [...shapeOverlays.value];
                const renderedItems = renderedShapeItems.value;
                console.log(`========== 延迟刷新验证 ==========`);
                console.log(`延迟刷新后 renderedShapeItems 数量:`, renderedItems.length);
                console.log(`延迟刷新后 shapeOverlays 数量:`, shapeOverlays.value.length);
                
                // 输出所有形状的详细信息
                renderedItems.forEach((item, index) => {
                  console.log(`渲染项[${index}]:`, {
                    id: item.id,
                    tool: item.tool,
                    canvasX: item.canvasX,
                    canvasY: item.canvasY,
                    pointId: item.pointId,
                    craneId: item.craneId,
                    position: item.geoPosition
                  });
                });
                
                // 如果还是没有渲染，尝试添加一个测试形状
                if (renderedItems.length === 0 && shapeOverlays.value.length > 0) {
                  console.warn("⚠️ 形状数据存在但无法渲染，尝试添加测试形状");
                  const testShape = {
                    id: 'test_' + Date.now(),
                    tool: 'rectangle',
                    pointId: loadedCranes[0].points?.[0]?.id || null,
                    craneId: loadedCranes[0].id,
                    position: loadedCranes[0].points?.[0] ? { x: loadedCranes[0].points[0].x, y: loadedCranes[0].points[0].y } : { x: 0, y: 0 },
                    config: { width: 100, height: 50, fill: 'rgba(255,0,0,0.3)', stroke: '#ff0000' }
                  };
                  shapeOverlays.value = [...shapeOverlays.value, testShape];
                  setTimeout(() => {
                    const testRendered = renderedShapeItems.value;
                    console.log(`测试形状渲染结果:`, testRendered.length);
                    if (testRendered.length > 0) {
                      console.log("✅ 测试形状可以渲染，说明渲染逻辑正常，问题在于数据匹配");
                    } else {
                      console.error("❌ 测试形状也无法渲染，说明渲染逻辑有问题");
                    }
                  }, 100);
                }
                console.log(`========== 延迟刷新验证完成 ==========`);
              }, 1000);
            }
            
            // 验证形状数据是否正确渲染（在 selectCrane 之后）
            if (shapesToAdd.length > 0) {
              await nextTick();
              const renderedItems = renderedShapeItems.value;
              console.log(`========== 渲染验证 ==========`);
              console.log(`shapeOverlays 数量:`, shapeOverlays.value.length);
              console.log(`renderedShapeItems 数量:`, renderedItems.length);
              console.log(`canvasSize:`, { width: canvasSize.width, height: canvasSize.height });
              console.log(`canvas 存在:`, !!canvas.value);
              console.log(`selectedCrane:`, selectedCrane.value?.name);
              
              // 输出所有 shapeOverlays 的详细信息
              console.log(`所有 shapeOverlays:`, shapeOverlays.value.map(s => ({
                id: s.id,
                tool: s.tool,
                pointId: s.pointId,
                craneId: s.craneId,
                position: s.position
              })));
              
              if (renderedItems.length !== shapesToAdd.length) {
                console.warn(`警告：只有 ${renderedItems.length}/${shapesToAdd.length} 个形状成功渲染`);
                // 输出无法渲染的形状
                shapesToAdd.forEach((shape, index) => {
                  const rendered = renderedItems.find(item => item.id === shape.id);
                  if (!rendered) {
                    console.warn(`  形状[${index}] ${shape.id} 未渲染`, {
                      pointId: shape.pointId,
                      craneId: shape.craneId,
                      position: shape.position,
                      matched: findPointById(shape.pointId, shape.craneId)
                    });
                  }
                });
              } else {
                console.log(`✅ 所有 ${renderedItems.length} 个形状成功渲染`);
              }
              console.log(`========== 渲染验证完成 ==========`);
            }
          }
          
          // 重绘所有轨迹
          nextTick(() => {
            drawAllTrajectories();
          });
          
          ElMessage.success("数据加载成功");
        } else {
          console.warn("接口返回数据格式异常:", response);
          // 如果没有数据，使用默认空数据
          cranes.value = [];
        }
      } else {
        console.warn("接口返回数据格式异常:", response);
        // 如果没有数据，使用默认空数据
        cranes.value = [];
      }
    } catch (error) {
      console.error("加载项目数据失败:", error);
      ElMessage.error("加载数据失败，请检查网络连接");
      // 失败时使用默认空数据
      cranes.value = [];
    }
  };

  // 监听路由变化，确保在路由参数变化时重新加载数据
  // 注意：必须在 loadProjectData 函数定义之后才能使用
  watch(() => route.params.id, (newId) => {
    if (newId && newId !== projectId.value) {
      projectId.value = newId;
      console.log("路由参数变化，项目ID:", projectId.value);
      loadProjectData();
    }
  });

  // 处理返回按钮点击
  // 保存总平规划数据

// 处理登录
const handleLogin = async () => {
  if (!loginForm.username || !loginForm.password) {
    ElMessage.warning("请输入用户名和密码");
    return;
  }

  isLogging.value = true;
  try {
    const response = await login({
      userName: loginForm.username,
      password: loginForm.password,
    });

    if (response && response.code === "0") {
      ElMessage.success("登录成功");
      showLoginDialog.value = false;
      // 保存登录信息
      if (response.data && response.data.token) {
        localStorage.setItem("token", response.data.token);
      }
      // 设置用户状态，使用接口返回的 userNickName 替换模拟工号
      if (response.data) {
        userStore.login(
          response.data.userName || loginForm.username,
          response.data.userNickName || null
        );
      }
      // 清空表单
      loginForm.username = "";
      loginForm.password = "";
    } else {
      ElMessage.error(response?.msg || "登录失败，请检查用户名和密码");
    }
  } catch (error) {
    console.error("登录失败:", error);
    ElMessage.error("登录失败，请稍后重试");
  } finally {
    isLogging.value = false;
  }
};

// 处理离线登录
const handleOfflineLogin = () => {
  // 暂时不做逻辑操作
  showLoginDialog.value = false;
};

// 生成报告
const handleGenerateReport = async () => {
  if (!projectId.value) {
    ElMessage.warning("项目ID不存在");
    return;
  }

  try {
    ElMessage.info("正在生成报告，请稍候...");
    const response = await exportProject({ projectId: projectId.value });
    
    // 如果返回的是文件 blob（Word 或 PDF）
    if (response && response.blob && (response.type === 'docx' || response.type === 'doc' || response.type === 'pdf')) {
      // 创建下载链接
      const url = window.URL.createObjectURL(response.blob);
      const link = document.createElement('a');
      link.href = url;
      const fileExtension = response.type === 'pdf' ? 'pdf' : (response.type === 'doc' ? 'doc' : 'docx');
      link.download = `项目报告_${projectId.value}_${Date.now()}.${fileExtension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      ElMessage.success("报告生成成功");
    } else if (response && response.code === "0") {
      // 如果接口返回的是 JSON，可能包含下载链接或其他信息
      ElMessage.success(response.msg || "报告生成成功");
    } else {
      ElMessage.error(response?.msg || "报告生成失败");
    }
  } catch (error) {
    console.error("生成报告失败:", error);
    ElMessage.error("生成报告失败，请稍后重试");
  }
};

const handleSave = async () => {
  if (!projectId.value) {
    ElMessage.warning("项目ID不存在");
    return;
  }

  if (!cranes.value || cranes.value.length === 0) {
    ElMessage.warning("请先添加起重机路径");
    return;
  }

  try {
    // 重绘所有轨迹，确保截图准确
    drawAllTrajectories();
    await nextTick();

    // 先上传所有需要占位截图的点位图片，获取 fileId
    // 遍历所有起重机及其点位
    for (const crane of cranes.value) {
      for (const point of crane.points || []) {
        // 只处理吊装点位（occupyType=0）且有形状的点位
        if (point.type === "lifting") {
          const shapes = getShapesForPoint(point.id);
          if (shapes.length > 0) {
            try {
              // 截取当前点位的图片
              const snapshot = capturePointSnapshot(point);
              if (snapshot) {
                // 将 base64 转换为 Blob
                const blob = await base64ToBlob(snapshot);
                
                // 生成文件名（使用点位名称和时间戳）
                const fileName = `${point.name || "point"}_${Date.now()}.png`;
                
                // 上传图片（以文件流形式）
                const response = await uploadImage(blob, fileName);
                
                if (response && response.code === "0" && response.data && response.data.fileId) {
                  // 将 fileId 存储到点位数据中
                  const pointIndex = crane.points.findIndex(p => p.id === point.id);
                  if (pointIndex !== -1) {
                    crane.points[pointIndex].fileId = response.data.fileId;
                  }
                } else {
                  console.error(`点位 ${point.name} 图片上传失败:`, response?.msg);
                  ElMessage.warning(`点位 ${point.name} 图片上传失败`);
                }
              }
            } catch (error) {
              console.error(`点位 ${point.name} 图片上传失败:`, error);
              ElMessage.warning(`点位 ${point.name} 图片上传失败`);
            }
          }
        }
      }
    }

    // 构建接口所需的数据格式
    const sysProjectFlatAddUpdateDetail = cranes.value.map((crane, craneIndex) => {
      // 构建起重机信息
      const sysProjectFlatDetail = {
        projectId: projectId.value,
        craneName: crane.name || "",
        craneType: crane.type || "",
        color: crane.color || "#26256B",
        pathUseWidth: crane.pathUseWidth || null,
        useTime: crane.useTime || null,
        carryingCapacity: crane.carryingCapacity || null,
        itemIndex: craneIndex + 1,
      };

      // 构建点位数组，确保第一条是吊装点位
      const points = (crane.points || []).map((point, pointIndex) => {
        // 确定点位类型
        let pointType = 1; // 默认普通点位
        if (pointIndex === 0) {
          pointType = 0; // 起点
        } else if (pointIndex === crane.points.length - 1) {
          pointType = 2; // 终点
        }

        // 确定占点类型：吊装点位=0，移动点位=1
        const occupyType = point.type === "lifting" ? 0 : 1;

        // 格式化日期（精确到天）
        const formatDate = (dateStr) => {
          if (!dateStr) return null;
          try {
            const date = new Date(dateStr);
            if (isNaN(date.getTime())) return null;
            // 返回 YYYY-MM-DD 格式
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");
            return `${year}-${month}-${day}`;
          } catch (error) {
            return null;
          }
        };

        // 获取该点位的所有形状数据（包括多个文字）
        // 每个形状都有独立的位置坐标（position），支持一个点位上有多个文字
        const rawShapes = getShapesForPoint(point.id);
        
        // 调试：检查形状数据获取情况
        console.log(`========== 保存时检查点位 ${point.name} (ID: ${point.id}) ==========`);
        console.log(`点位类型: ${point.type}, occupyType: ${occupyType}`);
        console.log(`getShapesForPoint 返回的形状数量:`, rawShapes.length);
        console.log(`所有 shapeOverlays:`, shapeOverlays.value.map(s => ({
          id: s.id,
          tool: s.tool,
          pointId: s.pointId,
          craneId: s.craneId,
          pointIdType: typeof s.pointId,
          pointIdValue: s.pointId,
          pointIdMatch: s.pointId === point.id,
          pointIdStringMatch: String(s.pointId) === String(point.id)
        })));
        
        // 如果通过 point.id 找不到，尝试通过字符串匹配
        let shapesToSave = rawShapes;
        if (rawShapes.length === 0) {
          console.warn(`⚠️ 通过 point.id (${point.id}) 找不到形状，尝试其他匹配方式`);
          // 尝试字符串匹配
          const stringMatched = shapeOverlays.value.filter((shape) => 
            String(shape.pointId) === String(point.id)
          );
          if (stringMatched.length > 0) {
            console.log(`通过字符串匹配找到 ${stringMatched.length} 个形状`);
            shapesToSave = stringMatched;
          } else {
            // 尝试通过 craneId 和坐标匹配
            const craneMatched = shapeOverlays.value.filter((shape) => 
              shape.craneId === crane.id && 
              shape.position &&
              Math.abs(shape.position.x - point.x) < 0.1 &&
              Math.abs(shape.position.y - point.y) < 0.1
            );
            if (craneMatched.length > 0) {
              console.log(`通过坐标匹配找到 ${craneMatched.length} 个形状`);
              shapesToSave = craneMatched;
            }
          }
        }
        
        const shapes = shapesToSave.map((shape) => {
          const config = shape.config || {};
          const tool = shape.tool;
          
          // 计算形状的 width 和 height
          let width = null;
          let height = null;
          
          if (tool === "rectangle") {
            width = config.width || 80;
            height = config.height || 40;
          } else if (tool === "circle") {
            const radius = config.radius || MIN_RADIUS;
            width = radius * 2;
            height = radius * 2;
          } else if (tool === "triangle") {
            const size = config.size || MIN_TRIANGLE_SIZE;
            width = size;
            height = size;
          } else if (tool === "sector") {
            const radius = config.radius || MIN_RADIUS;
            width = radius * 2;
            height = radius * 2;
          } else if (tool === "text") {
            const fontSize = config.fontSize || 14;
            const textContent = config.text || "文字";
            const textWidth = textContent.length * fontSize * 0.6;
            width = textWidth;
            height = fontSize;
            
            // 确保文字内容被保存（text 属性）
            // position 保存的是该文字的地理坐标（x, y），支持多个文字有不同位置
            return {
              id: shape.id,
              tool: tool,
              config: {
                ...config,
                text: textContent, // 确保文字内容被保存
                width: width,
                height: height,
              },
              position: shape.position || { x: point.x, y: point.y }, // 保存文字的位置坐标
            };
          }
          
          return {
            id: shape.id,
            tool: tool,
            config: {
              ...config,
              width: width,
              height: height,
            },
            position: shape.position || { x: point.x, y: point.y }, // 保存形状的位置坐标
          };
        });

        return {
          flatDetailId: crane.id || null,
          pointName: point.name || "",
          x: typeof point.x === "number" ? point.x : parseFloat(point.x) || 0,
          y: typeof point.y === "number" ? point.y : parseFloat(point.y) || 0,
          carryingCapacity: point.groundLoad || point.carryingCapacity || null,
          area: point.area || null,
          startTime: formatDate(point.startTime),
          endTime: formatDate(point.endTime),
          remarks: point.remarks || null,
          pointLength: point.occupyLength || point.pointLength || null,
          pointWidth: point.occupyWidth || point.pointWidth || null,
          rotateAngle: point.rotateAngle || null,
          workRadius: point.radius || point.workRadius || null,
          amplitude: point.amplitude || null,
          turnAround: point.turnAround || null,
          occupyType: occupyType,
          pointType: pointType,
          fileId: point.fileId || null,
          itemIndex: pointIndex + 1,
          shapes: shapes.length > 0 ? JSON.stringify(shapes) : null, // 将形状数组转为字符串
        };
        
        // 调试：输出保存的形状数据
        if (shapes.length > 0) {
          console.log(`点位 ${point.name} 保存的形状数据:`, shapes);
          console.log(`点位 ${point.name} 保存的 shapes JSON:`, JSON.stringify(shapes));
        } else {
          console.log(`点位 ${point.name} 没有形状数据需要保存`);
        }
        
        return pointData;
      });

      // 确保第一条是吊装点位（occupyType=0）
      const liftingPoints = points.filter((p) => p.occupyType === 0);
      const movingPoints = points.filter((p) => p.occupyType === 1);
      
      // 重新排序：先吊装点位，后移动点位
      const sortedPoints = [...liftingPoints, ...movingPoints];

      return {
        sysProjectFlatDetail,
        points: sortedPoints,
      };
    });

    const payload = {
      projectId: projectId.value,
      sysProjectFlatAddUpdateDetail,
    };

    // 调试：检查保存的数据中是否包含 shapes
    console.log("========== 保存数据检查 ==========");
    console.log("当前 shapeOverlays 总数:", shapeOverlays.value.length);
    console.log("所有 shapeOverlays 详情:", shapeOverlays.value.map(s => ({
      id: s.id,
      tool: s.tool,
      pointId: s.pointId,
      pointIdType: typeof s.pointId,
      craneId: s.craneId,
      position: s.position,
      config: s.config
    })));
    console.log("完整保存数据:", JSON.stringify(payload, null, 2));
    sysProjectFlatAddUpdateDetail.forEach((craneData, craneIndex) => {
      console.log(`起重机 ${craneIndex + 1}: ${craneData.sysProjectFlatDetail.craneName}`);
      console.log(`  起重机详情:`, craneData.sysProjectFlatDetail);
      craneData.points.forEach((point, pointIndex) => {
        console.log(`  点位 ${point.pointName} (索引 ${pointIndex + 1}):`, {
          id: point.flatDetailId,
          pointName: point.pointName,
          x: point.x,
          y: point.y,
          hasShapes: !!point.shapes,
          shapesType: typeof point.shapes,
          shapesLength: point.shapes ? point.shapes.length : 0,
          shapesPreview: point.shapes ? point.shapes.substring(0, 200) : null
        });
        if (point.shapes) {
          try {
            const shapesData = JSON.parse(point.shapes);
            console.log(`    形状数据解析成功，数量: ${shapesData.length}`, shapesData);
          } catch (e) {
            console.error(`    形状数据解析失败:`, e);
          }
        } else {
          // 如果该点位没有 shapes，检查 shapeOverlays 中是否有该点位的形状
          const crane = cranes.value.find(c => c.id === craneData.sysProjectFlatDetail.id || c.name === craneData.sysProjectFlatDetail.craneName);
          if (crane) {
            const matchedPoint = crane.points?.find(p => p.name === point.pointName || (Math.abs(p.x - point.x) < 0.1 && Math.abs(p.y - point.y) < 0.1));
            if (matchedPoint) {
              const shapesForPoint = getShapesForPoint(matchedPoint.id);
              if (shapesForPoint.length > 0) {
                console.warn(`    ⚠️ 该点位在 shapeOverlays 中有 ${shapesForPoint.length} 个形状，但保存时未包含！`);
                console.warn(`    点位 ID 匹配情况:`, {
                  pointIdInSave: point.flatDetailId,
                  pointIdInCrane: matchedPoint.id,
                  pointIdMatch: point.flatDetailId === matchedPoint.id,
                  shapesPointIds: shapesForPoint.map(s => s.pointId)
                });
              }
            }
          }
        }
      });
    });
    console.log("========== 保存数据检查完成 ==========");

    // 调用保存接口
    const response = await saveGeneralPing(payload);

    if (response && response.code === "0") {
      ElMessage.success("保存成功");
    } else {
      ElMessage.error(response?.msg || "保存失败");
    }
  } catch (error) {
    console.error("保存总平规划失败:", error);
    ElMessage.error("保存失败，请检查网络连接");
  }
};

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

  // 轨迹播放功能（从顶部按钮调用）- 播放所有路径
  const togglePlaybackFromHeader = () => {
    if (isPlayingAll.value) {
      stopPlaybackAll();
    } else {
      startPlaybackAll();
    }
  };

  // 轨迹播放功能（从属性面板调用）
  const togglePlayback = () => {
    // 停止任何正在播放的所有路径
    if (isPlayingAll.value) {
      stopPlaybackAll();
    }
    
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
    // 停止多路径播放
    if (isPlayingAll.value) {
      stopPlaybackAll();
    }
    
    if (!selectedCrane.value || !selectedCrane.value.points || selectedCrane.value.points.length < 2) {
      ElMessage.warning("请先完善路径点位及时间信息");
      return;
    }

    const plan = computeAnimationPlan(selectedCrane.value.points, selectedCrane.value.color);
    if (!plan) {
      ElMessage.warning("无法播放，请检查吊装点位的时间设置");
      return;
    }

    animationPlan.value = plan;
    isPlaying.value = true;
    playingCraneId.value = selectedCrane.value.id;
    playbackElapsed.value = 0;

    let animationStart = Date.now();

    const animate = () => {
      if (!isPlaying.value || !animationPlan.value) return;

      const now = Date.now();
      const elapsedSeconds = (now - animationStart) / 1000;
      const totalDuration = animationPlan.value.totalDuration;

      if (totalDuration <= 0) {
        stopPlayback();
        return;
      }

      playbackElapsed.value = elapsedSeconds % totalDuration;

      if (elapsedSeconds >= totalDuration) {
        animationStart = now;
      }

      drawAllTrajectories();
      playbackAnimationFrame.value = requestAnimationFrame(animate);
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
    animationPlan.value = null;
    playbackElapsed.value = 0;
    playingCraneId.value = null;
    drawAllTrajectories();
  };

  // 开始单个起重机录制
  const startCraneRecording = async () => {
    if (!selectedCrane.value || !canvas.value) {
      ElMessage.warning("请先选择起重机或等待页面加载完成");
      return;
    }

    // 检查是否有路径点
    if (!selectedCrane.value.points || selectedCrane.value.points.length < 2) {
      ElMessage.warning("请先添加路径点，至少需要2个路径点才能录制");
      return;
    }

    // 检查是否有背景图片
    if (!imageRef.value || !imageRef.value.complete) {
      ElMessage.warning("请先导入施工场景平面图");
      return;
    }

    try {
      // 初始化该起重机的录制状态
      if (!craneRecordingStates.value[selectedCrane.value.id]) {
        craneRecordingStates.value[selectedCrane.value.id] = {
          isRecording: false,
          recorder: null,
          blob: null,
        };
      }

      // 确保背景图片已绘制到canvas
      drawAllTrajectories();

      // 获取 canvas 的 MediaStream
      const stream = canvas.value.captureStream(30); // 30 FPS

      // 创建录制器
      const recorder = new RecordRTC(stream, {
        type: "video",
        mimeType: "video/webm;codecs=vp9",
        videoBitsPerSecond: 2500000,
      });

      recorder.startRecording();

      // 更新状态
      craneRecordingStates.value[selectedCrane.value.id].isRecording = true;
      craneRecordingStates.value[selectedCrane.value.id].recorder = recorder;

      ElMessage.success(`开始录制 ${selectedCrane.value.name} 的操作视频`);
    } catch (error) {
      console.error("开始录制失败:", error);
      ElMessage.error("开始录制失败，请检查浏览器是否支持");
    }
  };

  // 停止单个起重机录制
  const stopCraneRecording = () => {
    if (!selectedCrane.value || !craneRecordingStates.value[selectedCrane.value.id]) {
      ElMessage.warning("没有正在进行的录制");
      return;
    }

    const recordingState = craneRecordingStates.value[selectedCrane.value.id];
    if (!recordingState.isRecording || !recordingState.recorder) {
      ElMessage.warning("没有正在进行的录制");
      return;
    }

    const recorder = recordingState.recorder;
    recorder.stopRecording(() => {
      const blob = recorder.getBlob();
      recordingState.blob = blob;
      recordingState.isRecording = false;
      recordingState.recorder = null;

      ElMessage.success(`已停止录制 ${selectedCrane.value.name} 的操作视频`);
    });
  };

  // 下载单个起重机录制
  const downloadCraneRecording = () => {
    if (!selectedCrane.value || !craneRecordingStates.value[selectedCrane.value.id]) {
      ElMessage.warning("没有可下载的录制文件");
      return;
    }

    const recordingState = craneRecordingStates.value[selectedCrane.value.id];
    if (!recordingState.blob) {
      ElMessage.warning("没有可下载的录制文件");
      return;
    }

    const blob = recordingState.blob;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedCrane.value.name}_录制_${new Date().getTime()}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    ElMessage.success("下载成功");
  };

  // 开始全局录制
  const startGlobalRecording = async () => {
    if (!canvas.value) {
      ElMessage.warning("请等待页面加载完成");
      return;
    }

    // 检查是否有背景图片
    if (!imageRef.value || !imageRef.value.complete) {
      ElMessage.warning("请先导入施工场景平面图");
      return;
    }

    // 检查是否至少有一个起重机有路径点
    const hasPath = cranes.value.some(crane => crane.points && crane.points.length >= 2);
    if (!hasPath) {
      ElMessage.warning("请先为至少一个起重机添加路径点");
      return;
    }

    try {
      // 确保背景图片已绘制到canvas
      drawAllTrajectories();

      // 获取 canvas 的 MediaStream
      const stream = canvas.value.captureStream(30); // 30 FPS

      // 创建录制器
      const recorder = new RecordRTC(stream, {
        type: "video",
        mimeType: "video/webm;codecs=vp9",
        videoBitsPerSecond: 2500000,
      });

      recorder.startRecording();

      // 更新状态
      isGlobalRecording.value = true;
      globalRecorder.value = recorder;
      globalRecordingBlob.value = null;

      ElMessage.success("开始全局录制");
    } catch (error) {
      console.error("开始全局录制失败:", error);
      ElMessage.error("开始全局录制失败，请检查浏览器是否支持");
    }
  };

  // 停止全局录制
  const stopGlobalRecording = () => {
    if (!isGlobalRecording.value || !globalRecorder.value) {
      ElMessage.warning("没有正在进行的录制");
      return;
    }

    const recorder = globalRecorder.value;
    recorder.stopRecording(() => {
      const blob = recorder.getBlob();
      globalRecordingBlob.value = blob;
      isGlobalRecording.value = false;
      globalRecorder.value = null;

      ElMessage.success("已停止全局录制");
    });
  };

  // 下载全局录制
  const downloadGlobalRecording = () => {
    if (!globalRecordingBlob.value) {
      ElMessage.warning("没有可下载的录制文件");
      return;
    }

    const blob = globalRecordingBlob.value;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `全局录制_${new Date().getTime()}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    ElMessage.success("下载成功");
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

  // 开始播放所有路径
  const startPlaybackAll = () => {
    // 停止任何正在播放的单个路径
    if (isPlaying.value) {
      stopPlayback();
    }

    // 检查是否有可播放的路径
    const validCranes = cranes.value.filter(crane => 
      crane.points && crane.points.length >= 2
    );
    
    if (validCranes.length === 0) {
      ElMessage.warning("没有可播放的路径，请确保至少有一条路径包含2个以上点位");
      return;
    }

    // 为每个有效路径生成动画计划
    animationPlans.value = {};
    let hasValidPlan = false;
    
    validCranes.forEach(crane => {
      const plan = computeAnimationPlan(crane.points, crane.color);
      if (plan) {
        animationPlans.value[crane.id] = plan;
        hasValidPlan = true;
      }
    });

    if (!hasValidPlan) {
      ElMessage.warning("无法播放，请检查路径点位的时间设置");
      return;
    }

    isPlayingAll.value = true;
    playbackElapsed.value = 0;

    let animationStart = Date.now();

    const animate = () => {
      if (!isPlayingAll.value || Object.keys(animationPlans.value).length === 0) return;

      const now = Date.now();
      const elapsedSeconds = (now - animationStart) / 1000;
      
      // 使用最长的路径时长作为总时长
      const totalDurations = Object.values(animationPlans.value).map(plan => plan.totalDuration);
      const maxDuration = Math.max(...totalDurations, 1); // 确保至少为1秒
      
      playbackElapsed.value = elapsedSeconds % maxDuration;

      if (elapsedSeconds >= maxDuration) {
        animationStart = now;
      }

      drawAllTrajectories();
      playbackAnimationFrame.value = requestAnimationFrame(animate);
    };

    playbackAnimationFrame.value = requestAnimationFrame(animate);
  };

  // 停止播放所有路径
  const stopPlaybackAll = () => {
    isPlayingAll.value = false;
    if (playbackAnimationFrame.value) {
      cancelAnimationFrame(playbackAnimationFrame.value);
      playbackAnimationFrame.value = null;
    }
    animationPlans.value = {};
    playbackElapsed.value = 0;
    drawAllTrajectories();
  };

  // 组件卸载时清理
  onBeforeUnmount(() => {
    // 停止播放
    stopPlayback();
    stopPlaybackAll();
    window.removeEventListener('resize', handleResize);

    // 清理录制器
    // 停止全局录制
    if (isGlobalRecording.value && globalRecorder.value) {
      globalRecorder.value.stopRecording();
      globalRecorder.value = null;
    }

    // 停止所有起重机的录制
    Object.keys(craneRecordingStates.value).forEach((craneId) => {
      const state = craneRecordingStates.value[craneId];
      if (state.isRecording && state.recorder) {
        state.recorder.stopRecording();
        state.recorder = null;
      }
    });

    detachPointerListeners();
  });

  const computeAnimationPlan = (points = [], color = '#26256B') => {
    if (!points || points.length < 2 || !canvas.value) return null;

    const coords = points.map((point) => convertToCanvasCoords(point.x, point.y));
    const segments = [];
    let timeCursor = 0;
    const coveredSegments = new Set();

    const timedIndices = points
      .map((p, idx) => ({ point: p, idx }))
      .filter(({ point }) => point.type === 'lifting');

    if (!timedIndices.length) return null;

    for (let k = 0; k < timedIndices.length - 1; k += 1) {
      const startItem = timedIndices[k];
      const endItem = timedIndices[k + 1];
      const startIdx = startItem.idx;
      const endIdx = endItem.idx;
      const startPoint = startItem.point;
      const endPoint = endItem.point;

      // 如果起点有结束时间，行驶时间从起点的结束时间开始计算；否则从起点的开始时间计算
      const startDate = (startItem.idx === 0 && startPoint.endTime) 
        ? parseDateValue(startPoint.endTime) 
        : parseDateValue(startPoint.startTime);
      const endDate = parseDateValue(endPoint.startTime);
      let travelDays = Math.max(0, diffDays(startDate, endDate));
      if (travelDays <= 0) travelDays = 1;
      const travelSeconds = travelDays * secondsPerDay;

      let totalDistance = 0;
      const localSegments = [];
      for (let idx = startIdx; idx < endIdx; idx += 1) {
        const fromCoords = coords[idx];
        const toCoords = coords[idx + 1];
        const distance = Math.hypot(toCoords.x - fromCoords.x, toCoords.y - fromCoords.y);
        totalDistance += distance;
        localSegments.push({ fromIndex: idx, toIndex: idx + 1, distance });
      }

      localSegments.forEach((segment) => {
        const proportion = totalDistance > 0 ? segment.distance / totalDistance : 0;
        const duration = totalDistance > 0
          ? travelSeconds * proportion
          : (localSegments.length > 0 ? travelSeconds / localSegments.length : 0);
        segments.push({
          type: 'travel',
          fromIndex: segment.fromIndex,
          toIndex: segment.toIndex,
          duration,
          startTime: timeCursor,
        });
        timeCursor += duration;
        coveredSegments.add(`${segment.fromIndex}-${segment.toIndex}`);
      });

      const dwellDays = endPoint.endTime
        ? diffDaysInclusive(parseDateValue(endPoint.startTime), parseDateValue(endPoint.endTime))
        : 0;

      if (dwellDays > 0) {
        const dwellSeconds = dwellDays * secondsPerDay;
        segments.push({
          type: 'dwell',
          pointIndex: endIdx,
          duration: dwellSeconds,
          startTime: timeCursor,
        });
        timeCursor += dwellSeconds;
      }
    }

    for (let idx = 0; idx < points.length - 1; idx += 1) {
      const key = `${idx}-${idx + 1}`;
      if (coveredSegments.has(key)) continue;

      const duration = secondsPerDay;
      segments.push({
        type: 'travel',
        fromIndex: idx,
        toIndex: idx + 1,
        duration,
        startTime: timeCursor,
      });
      timeCursor += duration;
    }

    segments.sort((a, b) => a.startTime - b.startTime);
    let cumulative = 0;
    const normalizedSegments = segments.map((segment) => {
      const normalizedSegment = { ...segment, startTime: cumulative };
      cumulative += segment.duration;
      return normalizedSegment;
    });

    const totalDuration = cumulative;
    if (totalDuration <= 0) return null;

    return {
      segments: normalizedSegments,
      totalDuration,
      coords,
      color,
    };
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

.login-btn {
  color: #333;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 5px;
  margin-right: 16px;
}

.login-btn:hover {
  color: #409eff;
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

.drawing-toolbar {
  position: absolute;
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
  display: inline-flex;
  align-items: center;
  gap: 16px;
  padding: 10px 24px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 8px 30px rgba(15, 35, 95, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.6);
  z-index: 5;
  white-space: nowrap;
}

.toolbar-headline {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 120px;
  white-space: nowrap;
}

.toolbar-title {
  font-size: 14px;
  font-weight: 600;
  color: #1f2d3d;
  white-space: nowrap;
}

.toolbar-subtitle {
  font-size: 12px;
  color: #909399;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 120px;
}

.toolbar-divider {
  width: 1px;
  height: 32px;
  background: rgba(0, 0, 0, 0.08);
}

.toolbar-tools {
  display: flex;
  align-items: center;
  gap: 8px;
}

.tool-button {
  width: 36px;
  height: 36px;
  border-radius: 6px;
  border: 1px solid #dcdfe6;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 0;
}

.tool-button:hover,
.tool-button.active {
  border-color: #409eff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.12);
}

.tool-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.tool-icon.icon-rectangle {
  width: 16px;
  height: 12px;
  border: 2px solid #606266;
  border-radius: 2px;
}

.tool-icon.icon-circle {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 2px solid #606266;
}

.tool-icon.icon-triangle {
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-bottom: 14px solid #606266;
}

.tool-icon.icon-sector {
  width: 18px;
  height: 18px;
  border: 2px solid #606266;
  border-radius: 100% 0 0 0;
  transform: rotate(-45deg);
}

.tool-icon.icon-text {
  font-weight: 600;
  font-size: 14px;
  color: #303133;
}

.toolbar-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.clear-shapes-btn {
  color: #606266;
}

.shape-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 3;
}

.shape-overlay-item {
  pointer-events: auto;
  cursor: move;
}

.shape-overlay-item .shape-body {
  stroke-width: 2px;
  pointer-events: auto;
}

.shape-overlay-item.active .shape-body {
  stroke-width: 2.5px;
  filter: drop-shadow(0 2px 6px rgba(64, 158, 255, 0.25));
}

.shape-text {
  font-weight: 600;
  pointer-events: auto;
  cursor: move;
}

.shape-bounding-box {
  pointer-events: none;
}

.shape-resize-handle {
  fill: #ffffff;
  stroke: #409eff;
  stroke-width: 2px;
  pointer-events: auto;
  cursor: se-resize;
}

.shape-resize-handle.handle-nw {
  cursor: nw-resize;
}

.shape-resize-handle.handle-n {
  cursor: n-resize;
}

.shape-resize-handle.handle-ne {
  cursor: ne-resize;
}

.shape-resize-handle.handle-e {
  cursor: e-resize;
}

.shape-resize-handle.handle-se {
  cursor: se-resize;
}

.shape-resize-handle.handle-s {
  cursor: s-resize;
}

.shape-resize-handle.handle-sw {
  cursor: sw-resize;
}

.shape-resize-handle.handle-w {
  cursor: w-resize;
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
  border: 1px solid transparent;
  transition: all 0.3s ease;
}

.point-item:hover {
  background-color: #e6e8eb;
}

.point-item.active {
  border-color: rgba(64, 158, 255, 0.6);
  background-color: rgba(64, 158, 255, 0.1);
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

/* 全局登录弹窗样式 */
.login-dialog :deep(.el-dialog) {
  margin: 0;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.login-dialog :deep(.el-dialog__header) {
  padding: 0;
  margin-bottom: 0;
}

.login-dialog :deep(.el-dialog__body) {
  padding: 0;
}

.login-dialog-content {
  padding: 40px 50px;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  border-radius: 8px;
  position: relative;
  overflow: hidden;
}

/* 背景装饰 - 起重机轮廓 */
.login-dialog-content::before {
  content: '';
  position: absolute;
  bottom: -50px;
  left: -50px;
  width: 200px;
  height: 200px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M20 80 L30 60 L40 60 L40 40 L50 40 L50 20 L60 20 L60 40 L70 40 L70 60 L80 60 L80 80 Z' fill='rgba(255,255,255,0.1)'/%3E%3C/svg%3E");
  opacity: 0.3;
  pointer-events: none;
}

.login-dialog-content::after {
  content: '';
  position: absolute;
  top: -50px;
  right: -50px;
  width: 200px;
  height: 300px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 150'%3E%3Cpath d='M50 10 L50 30 L60 30 L60 50 L70 50 L70 70 L60 70 L60 90 L50 90 L50 110 L40 110 L40 90 L30 90 L30 70 L20 70 L20 50 L30 50 L30 30 L40 30 L40 10 Z' fill='rgba(255,255,255,0.1)'/%3E%3C/svg%3E");
  opacity: 0.3;
  pointer-events: none;
}

.login-title-section {
  text-align: center;
  margin-bottom: 20px;
  position: relative;
  z-index: 1;
}

.login-main-title {
  color: #fff;
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 10px 0;
}

.login-sub-title {
  color: #fff;
  font-size: 16px;
  margin: 0;
}

.login-prompt-text {
  color: #fff;
  font-size: 14px;
  text-align: center;
  margin-bottom: 30px;
  position: relative;
  z-index: 1;
}

.login-form {
  margin-bottom: 30px;
  position: relative;
  z-index: 1;
}

.login-input-wrapper {
  position: relative;
  margin-bottom: 20px;
}

.input-icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
  z-index: 2;
  font-size: 18px;
}

.login-input :deep(.el-input__wrapper) {
  padding-left: 45px;
  border-radius: 6px;
  background-color: #fff;
  box-shadow: none;
}

.login-input :deep(.el-input__wrapper:hover) {
  box-shadow: none;
}

.login-input :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px #409eff inset;
}

.login-input :deep(.el-input__inner) {
  height: 45px;
  line-height: 45px;
}

.login-buttons {
  display: flex;
  flex-direction: column;
  gap: 15px;
  position: relative;
  z-index: 1;
}

.login-confirm-btn,
.login-offline-btn {
  width: 100%;
  height: 45px;
  font-size: 16px;
  border-radius: 6px;
  border: none;
}

.login-confirm-btn {
  background-color: #409eff;
  border-color: #409eff;
  color: #fff;
}

.login-confirm-btn:hover {
  background-color: #66b1ff;
  border-color: #66b1ff;
}

.login-offline-btn {
  background-color: #e6a23c;
  border-color: #e6a23c;
  color: #fff;
}

.login-offline-btn:hover {
  background-color: #ebb563;
  border-color: #ebb563;
}
</style>
