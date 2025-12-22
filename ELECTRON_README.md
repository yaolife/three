# Electron 桌面应用打包指南

本项目已配置为使用 Electron 打包成桌面应用。

## 安装依赖

首先安装 Electron 相关依赖：

```bash
npm install --save-dev electron electron-builder concurrently wait-on cross-env
```

## 开发模式

在开发模式下运行 Electron 应用：

```bash
npm run electron:dev
```

这个命令会：
1. 启动 Vite 开发服务器（http://localhost:5173）
2. 等待服务器就绪后启动 Electron 窗口
3. 自动打开开发者工具

## 构建和打包

### 构建所有平台

```bash
npm run electron:build
```

### 构建特定平台

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

打包后的文件会在 `release` 目录中。

## 配置说明

### package.json 配置

- `main`: Electron 主进程入口文件
- `homepage`: 设置为 `./` 以确保资源路径正确
- `build`: electron-builder 配置
  - `appId`: 应用唯一标识符
  - `productName`: 应用显示名称
  - `directories.output`: 输出目录
  - `files`: 需要打包的文件列表

### 平台特定配置

- **macOS**: 生成 `.dmg` 安装包
- **Windows**: 生成 `.exe` 安装程序（NSIS）
- **Linux**: 生成 `AppImage` 和 `deb` 包

## 注意事项

1. **图标文件**: 需要在 `build` 目录下放置应用图标：
   - `build/icon.icns` (macOS)
   - `build/icon.ico` (Windows)
   - `build/icon.png` (Linux)

2. **API 地址配置**: 在 Electron 应用中，Vite 的代理配置不会生效。API 地址配置方式：
   
   **方式一：修改代码中的默认地址**
   
   编辑 `src/api/index.js`，修改 Electron 环境下的默认 API 地址：
   ```javascript
   if (isElectron) {
     return "http://your-api-server:port";  // 修改为你的 API 地址
   }
   ```
   
   **方式二：使用环境变量（推荐）**
   
   创建 `.env` 文件（或 `.env.production`）：
   ```env
   VITE_API_BASE_URL=http://your-api-server:port
   ```
   
   这样可以在不同环境使用不同的 API 地址。

3. **路径问题**: 已设置 `base: './'` 确保资源路径正确。

4. **生产环境**: 打包前确保：
   - 修改 API 地址为生产环境地址
   - 检查所有资源路径是否正确
   - 测试应用功能是否正常
   - 确保后端服务可访问

## 常见问题

### 1. 打包后无法加载资源

确保 `vite.config.js` 中设置了 `base: './'`。

### 2. API 请求失败

Electron 中 Vite 的代理不生效，需要：
- 使用完整的 API URL
- 或者在 Electron 主进程中配置代理

### 3. 窗口无法打开

检查 `electron/main.js` 中的路径配置是否正确。

## 开发建议

1. 开发时使用 `npm run electron:dev` 进行调试
2. 打包前先运行 `npm run build` 确保构建成功
3. 在不同平台上测试打包后的应用
4. 根据需要调整窗口大小和配置
