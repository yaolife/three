<template>
  <div 
    class="app-background"
    :style="bgImageStyle"
  ></div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import userStore from '../store/user.js';

// 初始化时根据环境设置默认值，确保背景图能立即显示
const isElectronEnv = typeof window !== 'undefined' && window.electronAPI?.isElectron;
const bgImageUrl = ref(isElectronEnv ? './bg.png' : '/bg.png');

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
  const isElectron = typeof window !== 'undefined' && window.electronAPI?.isElectron;
  
  console.log('[Background] ========== 开始构建背景图路径 ==========');
  console.log('[Background] 是否Electron环境:', isElectron);
  
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
};

// 组件挂载时立即构建路径
onMounted(async () => {
  console.log('[Background] 组件已挂载');
  console.log('[Background] 初始背景图URL:', bgImageUrl.value);
  // 立即优化路径（初始值已在ref中设置）
  await buildBgImagePath();
});
</script>

<style scoped>
.app-background {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: 0;
  pointer-events: none; /* 让背景图不阻挡交互 */
}
</style>

