const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
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
    backgroundColor: '#ffffff'
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
