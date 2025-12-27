<template>
  <div 
    class="welcome-page" 
    :class="{ 'welcome-page-logged-in': isLoggedIn }"
    :style="{ backgroundImage: `url(${bgImageUrl})` }"
  >
    <!-- 中转空白页：顶部导航等由 App.vue 统一渲染，这里不再重复 -->
    <div class="welcome-content">
      <!-- 保持空白，无业务数据，仅作为登录后的中转页 -->
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import userStore from '../store/user.js';
// 静态导入，让Vite处理路径
import bgImage from '@/images/bg.png';

const bgImageUrl = ref(bgImage);
const isLoggedIn = computed(() => userStore.userState.isLoggedIn);

onMounted(async () => {
  const isElectron = typeof window !== 'undefined' && window.electronAPI?.isElectron;
  
  if (isElectron) {
    // Electron环境：检查路径是否正确，如果不正确则修复
    try {
      // 如果路径是相对路径（如 ./assets/bg-xxx.png），需要转换为绝对路径
      if (bgImageUrl.value && bgImageUrl.value.startsWith('./')) {
        const currentUrl = window.location.href;
        let basePath = currentUrl;
        
        if (basePath.startsWith('file://')) {
          // 处理file://协议路径
          let pathPart = basePath.replace(/^file:\/\/\//, '').replace(/^file:\/\//, '');
          if (pathPart.includes('index.html')) {
            pathPart = pathPart.substring(0, pathPart.lastIndexOf('/'));
          }
          
          // 构建完整路径
          const relativePath = bgImageUrl.value.replace('./', '');
          const fullPath = `${pathPart}/${relativePath}`;
          
          // 转换为file://协议URL
          if (fullPath.match(/^[A-Za-z]:/)) {
            // Windows路径
            bgImageUrl.value = `file:///${fullPath.replace(/\\/g, '/')}`;
          } else {
            // macOS/Linux路径
            bgImageUrl.value = `file://${fullPath}`;
          }
          console.log('[Welcome] Electron环境背景图路径:', bgImageUrl.value);
        } else {
          // HTTP/HTTPS协议
          if (basePath.includes('index.html')) {
            basePath = basePath.substring(0, basePath.lastIndexOf('/'));
          }
          bgImageUrl.value = `${basePath}/${bgImageUrl.value.replace('./', '')}`;
        }
      } else if (bgImageUrl.value && !bgImageUrl.value.startsWith('http') && !bgImageUrl.value.startsWith('file://')) {
        // 如果是绝对路径但不是完整URL，需要添加base路径
        const currentUrl = window.location.href;
        let basePath = currentUrl;
        
        if (basePath.startsWith('file://')) {
          let pathPart = basePath.replace(/^file:\/\/\//, '').replace(/^file:\/\//, '');
          if (pathPart.includes('index.html')) {
            pathPart = pathPart.substring(0, pathPart.lastIndexOf('/'));
          }
          const fullPath = `${pathPart}/${bgImageUrl.value}`;
          if (fullPath.match(/^[A-Za-z]:/)) {
            bgImageUrl.value = `file:///${fullPath.replace(/\\/g, '/')}`;
          } else {
            bgImageUrl.value = `file://${fullPath}`;
          }
        } else {
          if (basePath.includes('index.html')) {
            basePath = basePath.substring(0, basePath.lastIndexOf('/'));
          }
          bgImageUrl.value = `${basePath}/${bgImageUrl.value}`;
        }
        console.log('[Welcome] Electron环境修复后的背景图路径:', bgImageUrl.value);
      }
    } catch (error) {
      console.error('[Welcome] 修复路径失败:', error);
    }
  }
});
</script>

<style scoped>
.welcome-page {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: 0;
}

/* 登录后，背景图不遮挡导航栏 */
.welcome-page.welcome-page-logged-in {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  z-index: -1;
}

.welcome-content {
  height: 100%;
  width: 100%;
}
</style>


