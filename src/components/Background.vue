<template>
  <div 
    v-if="isWelcomeRoute"
    class="app-background"
    :style="bgImageStyle"
  ></div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import userStore from '../store/user.js';

// 获取当前路由
const route = useRoute();

// 检查是否是welcome路由
const isWelcomeRoute = computed(() => {
  return route.path === '/welcome';
});

// 初始化时根据环境设置默认值，确保背景图能立即显示
const isElectronEnv = typeof window !== 'undefined' && window.electronAPI?.isElectron;
const bgImageUrl = ref(isElectronEnv ? './bg.png' : '/bg.png');

// 计算背景图样式
const bgImageStyle = computed(() => {
  // 如果不是welcome路由，返回空样式，确保背景图不显示
  if (!isWelcomeRoute.value) {
    console.log('[Background] bgImageStyle: 非welcome路由，返回空样式');
    return {};
  }
  
  const url = bgImageUrl.value;
  console.log('[Background] bgImageStyle: welcome路由，bgImageUrl:', url);
  
  if (url && url.trim() !== '') {
    const style = { 
      backgroundImage: `url(${url})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    };
    console.log('[Background] bgImageStyle: 返回样式:', style);
    return style;
  }
  
  console.log('[Background] bgImageStyle: bgImageUrl为空，返回空样式');
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
      console.log('[Background] 图片加载成功:', url);
      resolve(true);
    };
    
    img.onerror = (error) => {
      cleanup();
      console.warn('[Background] 图片加载失败:', url, error);
      resolve(false);
    };
    
    img.src = url;
    
    // 设置超时，避免长时间等待（增加到5秒，因为file://协议可能较慢）
    setTimeout(() => {
      if (!resolved) {
        cleanup();
        console.warn('[Background] 图片加载超时:', url);
        resolve(false);
      }
    }, 5000);
  });
};

// 构建背景图路径的函数（使用多种方法确保成功）
const buildBgImagePath = async () => {
  // 如果当前不是welcome路由，不构建路径
  if (route.path !== '/welcome') {
    console.log('[Background] 当前不是welcome路由，跳过构建路径');
    return;
  }
  
  const isElectron = typeof window !== 'undefined' && window.electronAPI?.isElectron;
  
  console.log('[Background] ========== 开始构建背景图路径 ==========');
  console.log('[Background] 是否Electron环境:', isElectron);
  console.log('[Background] 当前路由:', route.path);
  
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
              console.log('[Background] 方法1 - IPC获取的路径:', ipcPath);
              const canLoad = await testImageLoad(ipcPath);
              if (canLoad) {
                bgImageUrl.value = ipcPath;
                console.log('[Background] ✅ 背景图加载成功（方法1 - IPC）');
                return;
              } else {
                console.warn('[Background] ⚠️ IPC路径图片加载失败，尝试方法2');
              }
            }
          } catch (ipcError) {
            console.warn('[Background] ⚠️ IPC调用失败，尝试方法2:', ipcError);
          }
        }
        
        // 方法2：使用new URL()构建路径
        try {
          const baseUrl = new URL('.', currentUrl);
          const bgUrl = new URL('bg.png', baseUrl);
          const urlPath = bgUrl.href;
          console.log('[Background] 方法2 - 使用new URL()构建路径:', urlPath);
          
          const canLoad = await testImageLoad(urlPath);
          if (canLoad) {
            bgImageUrl.value = urlPath;
            console.log('[Background] ✅ 背景图加载成功（方法2 - new URL）');
            return;
          } else {
            console.warn('[Background] ⚠️ new URL()路径图片加载失败，尝试方法3');
          }
        } catch (urlError) {
          console.warn('[Background] ⚠️ new URL()方法失败，尝试方法3:', urlError);
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
          console.log('[Background] 方法3 - 字符串构建路径:', finalPath);
          
          const canLoad = await testImageLoad(finalPath);
          if (canLoad) {
            bgImageUrl.value = finalPath;
            console.log('[Background] ✅ 背景图加载成功（方法3 - 字符串构建）');
            return;
          } else {
            console.warn('[Background] ⚠️ 字符串构建路径图片加载失败，使用相对路径');
          }
        } catch (e) {
          console.error('[Background] 方法3失败:', e);
        }
        
        // 最终降级：使用相对路径
        bgImageUrl.value = './bg.png';
        console.log('[Background] 使用最终降级路径: ./bg.png');
      } else {
        // HTTP/HTTPS协议（开发环境）
        bgImageUrl.value = '/bg.png';
        console.log('[Background] 开发环境背景图路径:', bgImageUrl.value);
      }
    } catch (error) {
      console.error('[Background] 构建路径失败:', error);
      bgImageUrl.value = './bg.png';
    }
  } else {
    // 非Electron环境（开发环境）：使用public目录路径
    bgImageUrl.value = '/bg.png';
    console.log('[Background] 非Electron环境背景图路径:', bgImageUrl.value);
  }
  
  // 最后验证：如果当前是welcome路由但bgImageUrl仍为空，使用默认值
  if (route.path === '/welcome' && (!bgImageUrl.value || bgImageUrl.value.trim() === '')) {
    console.warn('[Background] ⚠️ 路径构建后bgImageUrl仍为空，使用默认值');
    const isElectron = typeof window !== 'undefined' && window.electronAPI?.isElectron;
    bgImageUrl.value = isElectron ? './bg.png' : '/bg.png';
  }
  
  console.log('[Background] ========== 背景图路径构建完成 ==========');
  console.log('[Background] 最终bgImageUrl:', bgImageUrl.value);
};

// 组件挂载时立即构建路径
onMounted(async () => {
  console.log('[Background] 组件已挂载');
  console.log('[Background] 当前路由:', route.path);
  console.log('[Background] 初始背景图URL:', bgImageUrl.value);
  
  // 只有在welcome路由时才构建路径
  if (route.path === '/welcome') {
    // 确保初始值正确（web端使用/bg.png，Electron端会在buildBgImagePath中处理）
    const isElectron = typeof window !== 'undefined' && window.electronAPI?.isElectron;
    if (!isElectron) {
      // web端直接使用/bg.png，不需要复杂的路径构建
      bgImageUrl.value = '/bg.png';
      console.log('[Background] Web端，直接使用/bg.png');
    } else {
      // Electron端需要构建路径
      await buildBgImagePath();
    }
    console.log('[Background] ✅ welcome路由，已设置背景图路径:', bgImageUrl.value);
  } else {
    // 非welcome路由时，清空背景图URL
    bgImageUrl.value = '';
    console.log('[Background] 非welcome路由，已清空背景图URL');
  }
});

// 监听路由变化，确保非welcome路由时清空背景图
watch(() => route.path, async (newPath, oldPath) => {
  console.log('[Background] 路由变化:', oldPath, '->', newPath);
  if (newPath !== '/welcome') {
    // 非welcome路由时，清空背景图URL，确保不显示
    bgImageUrl.value = '';
    console.log('[Background] 已清空背景图URL（非welcome路由）');
  } else {
    // welcome路由时，重新构建路径
    console.log('[Background] 切换到welcome路由，开始设置背景图路径');
    const isElectron = typeof window !== 'undefined' && window.electronAPI?.isElectron;
    if (!isElectron) {
      // web端直接使用/bg.png
      bgImageUrl.value = '/bg.png';
      console.log('[Background] Web端，直接使用/bg.png');
    } else {
      // Electron端需要构建路径
      await buildBgImagePath();
    }
    console.log('[Background] ✅ welcome路由，已设置背景图路径:', bgImageUrl.value);
  }
});
</script>

<style scoped>
.app-background {
  position: fixed;
  top: -20px !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  height: 100vh !important;
  width: 100vw !important;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  /* 背景图覆盖整个页面，包括导航栏区域 */
  z-index: 0; /* 背景图在最底层，覆盖整个页面 */
  pointer-events: none; /* 让背景图不阻挡交互 */
  margin: 0 !important;
  padding: 0 !important;
  border: none !important;
  border-top: none !important;
  border-bottom: none !important;
  border-left: none !important;
  border-right: none !important;
  outline: none !important;
  box-shadow: none !important;
  box-sizing: border-box !important;
  transform: translateZ(0); /* 强制硬件加速，避免渲染问题 */
  display: block; /* 默认显示，但通过v-if和路由检查控制 */
}
</style>

