const { app, BrowserWindow, Menu, ipcMain, protocol } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');
const isDev = process.env.NODE_ENV === 'development';

let mainWindow;

// 处理打开外部应用的 IPC 消息
ipcMain.handle('open-external-app', async (event, appPath) => {
  try {
    // 构建完整的应用路径
    let fullPath;
    if (path.isAbsolute(appPath)) {
      // 绝对路径直接使用
      fullPath = appPath;
    } else {
      // 相对路径：相对于 Electron 应用可执行文件所在的目录
      // 例如：应用在 D:\yj\lightHeat\simulation\ThreeConstruction.exe
      // 外部应用在 D:\yj\lightHeat\simulation\PT3DMPD\PT3DMPD.exe
      // 使用 app.getPath('exe') 获取可执行文件路径，然后获取其所在目录
      const exePath = app.getPath('exe');
      const appDir = path.dirname(exePath);
      fullPath = path.join(appDir, appPath);
    }
    
    console.log('尝试打开外部应用:', fullPath);
    console.log('应用目录:', path.dirname(app.getPath('exe')));
    
    // 使用 spawn 启动外部应用
    const child = spawn(fullPath, [], {
      detached: true,
      stdio: 'ignore'
    });
    
    // 不等待子进程，立即返回
    child.unref();
    
    return { success: true };
  } catch (error) {
    console.error('打开外部应用失败:', error);
    return { success: false, error: error.message };
  }
});

// 处理获取资源路径的 IPC 消息
ipcMain.handle('get-resource-path', async (event, relativePath) => {
  try {
    if (isDev) {
      // 开发环境：返回开发服务器路径
      return `http://localhost:5173/${relativePath}`;
    } else {
      // 生产环境：查找文件系统路径
      // 在打包后的应用中，需要使用可执行文件路径来构建资源路径
      const exePath = app.getPath('exe');
      const exeDir = path.dirname(exePath);
      
      // 获取应用路径（可能是asar包路径）
      const appPath = app.getAppPath();
      
      console.log('[Main Process] ========== 获取资源路径 ==========');
      console.log('[Main Process] 资源文件:', relativePath);
      console.log('[Main Process] 可执行文件路径:', exePath);
      console.log('[Main Process] 可执行文件目录:', exeDir);
      console.log('[Main Process] 应用路径:', appPath);
      console.log('[Main Process] 是否asar包:', appPath.includes('.asar'));
      
      // 尝试多个可能的位置
      const possiblePaths = [];
      
      // 1. resources/app/dist/（打包后的标准位置）
      possiblePaths.push(path.join(exeDir, 'resources', 'app', 'dist', relativePath));
      
      // 2. resources/app.asar/dist/（如果使用asar）
      if (appPath.includes('.asar')) {
        const asarPath = appPath.replace(/\.asar.*$/, '.asar');
        possiblePaths.push(path.join(asarPath, 'dist', relativePath));
      }
      
      // 3. dist根目录（相对于应用路径）
      possiblePaths.push(path.join(appPath, 'dist', relativePath));
      
      // 4. 应用根目录
      possiblePaths.push(path.join(appPath, relativePath));
      
      // 5. dist/assets目录
      possiblePaths.push(path.join(appPath, 'dist', 'assets', path.basename(relativePath)));
      possiblePaths.push(path.join(exeDir, 'resources', 'app', 'dist', 'assets', path.basename(relativePath)));
      
      // 6. 如果是bg.png，尝试查找assets目录中所有bg*.png文件
      if (relativePath === 'bg.png') {
        const assetsDirs = [
          path.join(appPath, 'dist', 'assets'),
          path.join(exeDir, 'resources', 'app', 'dist', 'assets'),
        ];
        
        for (const assetsDir of assetsDirs) {
          try {
            if (fs.existsSync(assetsDir)) {
              const files = fs.readdirSync(assetsDir);
              const bgFiles = files.filter(f => f.startsWith('bg') && f.endsWith('.png'));
              if (bgFiles.length > 0) {
                const bgFile = path.join(assetsDir, bgFiles[0]);
                possiblePaths.unshift(bgFile); // 优先使用hash化的文件
                console.log('[Main Process] 找到assets目录中的bg文件:', bgFile);
              }
            }
          } catch (assetsError) {
            // 继续尝试下一个目录
            continue;
          }
        }
      }
      
      console.log('[Main Process] 尝试的路径列表:');
      possiblePaths.forEach((p, i) => {
        console.log(`  ${i + 1}. ${p} (存在: ${fs.existsSync(p)})`);
      });
      
      // 检查每个可能的路径
      for (const potentialPath of possiblePaths) {
        try {
          if (fs.existsSync(potentialPath)) {
            const normalizedPath = path.normalize(potentialPath).replace(/\\/g, '/');
            let fileUrl;
            if (process.platform === 'win32') {
              // Windows: file:///C:/path/to/file
              fileUrl = `file:///${normalizedPath}`;
            } else {
              // macOS/Linux: file:///path/to/file
              fileUrl = `file://${normalizedPath}`;
            }
            console.log('[Main Process] ✅ 找到资源文件:', fileUrl);
            return fileUrl;
          }
        } catch (checkError) {
          // 继续尝试下一个路径
          continue;
        }
      }
      
      // 如果所有路径都不存在，返回最可能的路径（让浏览器尝试加载）
      const fallbackPath = path.join(exeDir, 'resources', 'app', 'dist', relativePath);
      const normalizedPath = path.normalize(fallbackPath).replace(/\\/g, '/');
      let fileUrl;
      if (process.platform === 'win32') {
        fileUrl = `file:///${normalizedPath}`;
      } else {
        fileUrl = `file://${normalizedPath}`;
      }
      console.warn('[Main Process] ⚠️ 资源文件未找到，返回默认路径:', fileUrl);
      return fileUrl;
    }
  } catch (error) {
    console.error('[Main Process] 获取资源路径失败:', error);
    console.error('[Main Process] 错误堆栈:', error.stack);
    return null;
  }
});

// 注册自定义协议处理资源文件（用于更可靠地加载本地资源）
function setupProtocol() {
  if (!isDev) {
    // 只在生产环境注册协议
    try {
      protocol.registerFileProtocol('app', (request, callback) => {
        const url = request.url.substr(6); // 移除 'app://' 前缀
        const filePath = path.normalize(`${__dirname}/../${url}`);
        console.log('[Main Process] app://协议请求:', url, '->', filePath);
        callback({ path: filePath });
      });
      console.log('[Main Process] ✅ 已注册app://协议');
    } catch (error) {
      console.warn('[Main Process] 注册app://协议失败（可能已注册）:', error);
    }
  }
}

function createWindow() {
  // 创建浏览器窗口
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      webSecurity: false, // 在Electron中禁用webSecurity以允许加载本地文件
      allowRunningInsecureContent: true
    },
    icon: path.join(__dirname, '../public/favicon.ico'), // 如果有图标的话
    show: false, // 先不显示，等加载完成后再显示
    titleBarStyle: 'default',
    backgroundColor: '#000000' // 改为黑色，避免与背景图产生白色间隙
  });

  // 加载应用
  if (isDev) {
    // 开发环境：加载 Vite 开发服务器
    mainWindow.loadURL('http://localhost:5173');
    // 打开开发者工具
    mainWindow.webContents.openDevTools();
  } else {
    // 生产环境：加载打包后的文件
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // 窗口准备好后显示
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    
    // 如果是开发环境，聚焦到窗口
    if (isDev) {
      mainWindow.focus();
    }
  });

  // 当窗口被关闭时
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // 处理窗口关闭
  mainWindow.on('close', (event) => {
    // 可以在这里添加确认对话框
    // event.preventDefault();
  });
}

// 当 Electron 完成初始化并准备创建浏览器窗口时调用此方法
app.whenReady().then(() => {
  setupProtocol();
  createWindow();

  app.on('activate', () => {
    // 在 macOS 上，当单击 dock 图标并且没有其他窗口打开时，
    // 通常在应用程序中重新创建一个窗口。
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// 当所有窗口都被关闭时退出应用（macOS 除外）
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// 处理证书错误（如果需要）
app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
  // 在开发环境中，可以忽略证书错误
  if (isDev) {
    event.preventDefault();
    callback(true);
  } else {
    callback(false);
  }
});

// 设置应用菜单（可选）
if (process.platform === 'darwin') {
  // macOS 菜单
  const template = [
    {
      label: app.getName(),
      submenu: [
        { role: 'about', label: '关于' },
        { type: 'separator' },
        { role: 'services', label: '服务' },
        { type: 'separator' },
        { role: 'hide', label: '隐藏' },
        { role: 'hideOthers', label: '隐藏其他' },
        { role: 'unhide', label: '显示全部' },
        { type: 'separator' },
        { role: 'quit', label: '退出' }
      ]
    },
    {
      label: '编辑',
      submenu: [
        { role: 'undo', label: '撤销' },
        { role: 'redo', label: '重做' },
        { type: 'separator' },
        { role: 'cut', label: '剪切' },
        { role: 'copy', label: '复制' },
        { role: 'paste', label: '粘贴' },
        { role: 'selectAll', label: '全选' }
      ]
    },
    {
      label: '视图',
      submenu: [
        { role: 'reload', label: '重新加载' },
        { role: 'forceReload', label: '强制重新加载' },
        { role: 'toggleDevTools', label: '切换开发者工具' },
        { type: 'separator' },
        { role: 'resetZoom', label: '实际大小' },
        { role: 'zoomIn', label: '放大' },
        { role: 'zoomOut', label: '缩小' },
        { type: 'separator' },
        { role: 'togglefullscreen', label: '切换全屏' }
      ]
    },
    {
      role: 'window',
      label: '窗口',
      submenu: [
        { role: 'minimize', label: '最小化' },
        { role: 'close', label: '关闭' }
      ]
    }
  ];
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
} else {
  // Windows/Linux 不显示菜单栏
  Menu.setApplicationMenu(null);
}
