<template>
  <div class="virtual-simulation-container">
    <el-card class="page-card">
      <template #header>
        <div class="card-header">
          <span>虚拟仿真项目</span>
        </div>
      </template>
      <div class="page-content">
        <el-empty description="暂无虚拟仿真项目数据" />
      </div>
    </el-card>
  </div>
</template>

<script setup>
// 虚拟仿真项目页面组件
</script>

<style scoped>
.virtual-simulation-container {
  padding: 20px 0;
}

.page-card {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-content {
  padding: 40px 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
