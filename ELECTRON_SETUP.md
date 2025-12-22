# Electron 快速开始

## 第一步：安装依赖

```bash
npm install --save-dev electron electron-builder concurrently wait-on cross-env
```

## 第二步：配置 API 地址

### 方式一：修改代码（简单但不灵活）

编辑 `src/api/index.js`，找到以下代码：

```javascript
if (isElectron) {
  return "http://192.168.1.106:18080";  // 修改为你的 API 地址
}
```

### 方式二：使用环境变量（推荐）

在项目根目录创建 `.env` 文件：

```env
VITE_API_BASE_URL=http://your-api-server:port
```

## 第三步：开发测试

运行 Electron 开发模式：

```bash
npm run electron:dev
```

这将：
- 启动 Vite 开发服务器
- 自动打开 Electron 窗口
- 启用热重载

## 第四步：打包应用

### 打包当前平台

```bash
npm run electron:build
```

### 打包特定平台

**Windows:**
```bash
npm run electron:build:win
```

**macOS:**
```bash
npm run electron:build:mac
```

**Linux:**
```bash
npm run electron:build:linux
```

打包后的文件在 `release` 目录中。

## 文件结构

```
项目根目录/
├── electron/
│   ├── main.js          # Electron 主进程
│   └── preload.js        # 预加载脚本
├── src/
│   └── api/
│       └── index.js      # API 配置（已支持 Electron）
├── package.json          # 已添加 Electron 脚本
├── vite.config.js       # 已配置 base: './'
└── ELECTRON_README.md    # 详细文档
```

## 常见问题

### Q: 打包后无法连接 API？

A: 确保在 Electron 环境中配置了正确的 API 地址。检查 `src/api/index.js` 中的配置。

### Q: 打包后资源加载失败？

A: 确保 `vite.config.js` 中设置了 `base: './'`。

### Q: 如何修改应用图标？

A: 在 `build` 目录下放置图标文件：
- `build/icon.icns` (macOS)
- `build/icon.ico` (Windows)  
- `build/icon.png` (Linux)

### Q: 如何修改应用名称？

A: 编辑 `package.json` 中的 `build.productName` 字段。

## 下一步

- 查看 `ELECTRON_README.md` 了解详细配置
- 根据需要调整窗口大小和配置
- 测试打包后的应用功能
