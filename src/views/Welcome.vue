<template>
  <!-- Welcome组件只在/welcome路由时渲染，不显示背景图（背景图由Background组件提供） -->
  <div class="welcome-content">
    <!-- 保持空白，无业务数据，仅作为登录后的中转页 -->
  </div>
</template>

<script setup>
// Welcome组件不再处理背景图，背景图由Background组件统一管理
// 这里只保留内容区域
</script>

<style scoped>
.welcome-content {
  height: 100%;
  width: 100%;
  overflow: hidden;
}
</style>
