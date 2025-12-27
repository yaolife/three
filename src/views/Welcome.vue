<template>
  <div 
    class="welcome-page" 
    :class="{ 'welcome-page-logged-in': isLoggedIn }"
    :style="bgImageStyle"
  >
    <!-- 中转空白页：顶部导航等由 App.vue 统一渲染，这里不再重复 -->
    <div class="welcome-content">
      <!-- 保持空白，无业务数据，仅作为登录后的中转页 -->
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import userStore from '../store/user.js';

const route = useRoute();
// 初始化时根据环境设置默认值，确保背景图能立即显示
const isElectronEnv = typeof window !== 'undefined' && window.electronAPI?.isElectron;
const bgImageUrl = ref(isElectronEnv ? './bg.png' : '/bg.png');
const isLoggedIn = computed(() => userStore.userState.isLoggedIn);

// 计算背景图样式
const bgImageStyle = computed(() => {
  const url = bgImageUrl.value;
  if (url) {
    return { 
      backgroundImage: `url(${url})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    };
  }
  return {};
});

// 测试图片是否能加载
const testImageLoad = (url) => {
  return new Promise((resolve) => {
    const img = new Image();
    let resolved = false;
    
    const cleanup = () => {
      if (!resolved) {
        resolved = true;
        img.onload = null;
        img.onerror = null;
      }
    };
    
    img.onload = () => {
      cleanup();
      console.log('[Welcome] 图片加载成功:', url);
      resolve(true);
    };
    
    img.onerror = (error) => {
      cleanup();
      console.warn('[Welcome] 图片加载失败:', url, error);
      resolve(false);
    };
    
    img.src = url;
    
    // 设置超时，避免长时间等待（增加到5秒，因为file://协议可能较慢）
    setTimeout(() => {
      if (!resolved) {
        cleanup();
        console.warn('[Welcome] 图片加载超时:', url);
        resolve(false);
      }
    }, 5000);
  });
};

// 构建背景图路径的函数（使用多种方法确保成功）
const buildBgImagePath = async () => {
  const isElectron = typeof window !== 'undefined' && window.electronAPI?.isElectron;
  
  console.log('[Welcome] ========== 开始构建背景图路径 ==========');
  console.log('[Welcome] 是否Electron环境:', isElectron);
  console.log('[Welcome] 当前路由:', route.path);
  console.log('[Welcome] 当前页面URL:', window.location.href);
  
  if (isElectron) {
    // Electron环境：使用public目录下的bg.png
    try {
      const currentUrl = window.location.href;
      
      if (currentUrl.startsWith('file://')) {
        // 方法1：优先使用IPC API获取路径（最可靠）
        if (window.electronAPI?.getResourcePath) {
          try {
            const ipcPath = await window.electronAPI.getResourcePath('bg.png');
            if (ipcPath) {
              console.log('[Welcome] 方法1 - IPC获取的路径:', ipcPath);
              const canLoad = await testImageLoad(ipcPath);
              if (canLoad) {
                bgImageUrl.value = ipcPath;
                console.log('[Welcome] ✅ 背景图加载成功（方法1 - IPC）');
                return;
              } else {
                console.warn('[Welcome] ⚠️ IPC路径图片加载失败，尝试方法2');
              }
            }
          } catch (ipcError) {
            console.warn('[Welcome] ⚠️ IPC调用失败，尝试方法2:', ipcError);
          }
        }
        
        // 方法2：使用new URL()构建路径
        try {
          const baseUrl = new URL('.', currentUrl);
          const bgUrl = new URL('bg.png', baseUrl);
          const urlPath = bgUrl.href;
          console.log('[Welcome] 方法2 - 使用new URL()构建路径:', urlPath);
          
          const canLoad = await testImageLoad(urlPath);
          if (canLoad) {
            bgImageUrl.value = urlPath;
            console.log('[Welcome] ✅ 背景图加载成功（方法2 - new URL）');
            return;
          } else {
            console.warn('[Welcome] ⚠️ new URL()路径图片加载失败，尝试方法3');
          }
        } catch (urlError) {
          console.warn('[Welcome] ⚠️ new URL()方法失败，尝试方法3:', urlError);
        }
        
        // 方法3：基于字符串构建路径
        try {
          let pathPart = currentUrl.replace(/^file:\/\/\//, '').replace(/^file:\/\//, '');
          if (pathPart.includes('index.html')) {
            pathPart = pathPart.substring(0, pathPart.lastIndexOf('/'));
          }
          const bgPath = `${pathPart}/bg.png`;
          let finalPath;
          if (bgPath.match(/^[A-Za-z]:/)) {
            finalPath = `file:///${bgPath.replace(/\\/g, '/')}`;
          } else {
            finalPath = `file://${bgPath}`;
          }
          console.log('[Welcome] 方法3 - 字符串构建路径:', finalPath);
          
          const canLoad = await testImageLoad(finalPath);
          if (canLoad) {
            bgImageUrl.value = finalPath;
            console.log('[Welcome] ✅ 背景图加载成功（方法3 - 字符串构建）');
            return;
          } else {
            console.warn('[Welcome] ⚠️ 字符串构建路径图片加载失败，使用相对路径');
          }
        } catch (e) {
          console.error('[Welcome] 方法3失败:', e);
        }
        
        // 最终降级：使用相对路径
        bgImageUrl.value = './bg.png';
        console.log('[Welcome] 使用最终降级路径: ./bg.png');
      } else {
        // HTTP/HTTPS协议（开发环境）
        bgImageUrl.value = '/bg.png';
        console.log('[Welcome] 开发环境背景图路径:', bgImageUrl.value);
      }
    } catch (error) {
      console.error('[Welcome] 构建路径失败:', error);
      bgImageUrl.value = './bg.png';
    }
  } else {
    // 非Electron环境（开发环境）：使用public目录路径
    bgImageUrl.value = '/bg.png';
    console.log('[Welcome] 非Electron环境背景图路径:', bgImageUrl.value);
  }
};

// 组件挂载时立即构建路径
onMounted(async () => {
  console.log('[Welcome] 组件已挂载，当前路由:', route.path);
  console.log('[Welcome] 初始背景图URL:', bgImageUrl.value);
  // 立即优化路径（初始值已在ref中设置）
  await buildBgImagePath();
});

// 监听路由变化，确保在welcome页面时设置背景图
watch(() => route.path, async (newPath) => {
  if (newPath === '/welcome' || newPath === '/Welcome') {
    console.log('[Welcome] 路由切换到welcome页面');
    await nextTick();
    // 如果路径为空或者是默认的相对路径，重新构建
    if (!bgImageUrl.value || bgImageUrl.value === './bg.png') {
      await buildBgImagePath();
    }
  }
}, { immediate: true });
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


