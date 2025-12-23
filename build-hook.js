const fs = require('fs');
const path = require('path');
const os = require('os');

// 检查是否为 macOS 平台
function isMacOS() {
  return process.platform === 'darwin';
}

// afterExtract: 在解压 Electron 之后、打包之前运行
// 这是创建可执行文件的最佳时机（仅 macOS）
exports.afterExtract = async function(context) {
  const { packager } = context;
  const platform = packager.platform.name;
  
  if (platform !== 'darwin') {
    console.log(`AfterExtract hook: Skipping (platform: ${platform}, not macOS)`);
    return;
  }
  
  const { appOutDir } = context;
  const appName = packager.appInfo.productFilename;
  const appPath = path.join(appOutDir, `${appName}.app`);
  const macosPath = path.join(appPath, 'Contents', 'MacOS');
  const electronPath = path.join(macosPath, 'Electron');
  
  console.log(`AfterExtract hook: Processing ${appPath}`);
  
  // 检查可执行文件是否存在
  if (!fs.existsSync(electronPath)) {
    console.log(`Electron executable not found at ${electronPath}, creating it...`);
    
    // 确保 MacOS 目录存在
    if (!fs.existsSync(macosPath)) {
      fs.mkdirSync(macosPath, { recursive: true });
    }
    
    // 从 node_modules 复制 Electron 可执行文件
    const sourcePath = path.join(process.cwd(), 'node_modules', 'electron', 'dist', 'Electron.app', 'Contents', 'MacOS', 'Electron');
    
    if (fs.existsSync(sourcePath)) {
      try {
        fs.copyFileSync(sourcePath, electronPath);
        fs.chmodSync(electronPath, 0o755);
        console.log(`Successfully copied Electron executable from ${sourcePath} to ${electronPath}`);
      } catch (err) {
        console.error(`Failed to copy Electron executable: ${err.message}`);
        throw err;
      }
    } else {
      console.error(`Error: Source Electron executable not found at ${sourcePath}`);
      throw new Error('Electron executable source not found');
    }
  } else {
    console.log(`Electron executable already exists at ${electronPath}`);
  }
};

// beforePack: 在打包之前确保 Electron 可执行文件存在（仅 macOS）
exports.beforePack = async function(context) {
  const { packager } = context;
  const platform = packager.platform.name;
  
  if (platform !== 'darwin') {
    console.log(`BeforePack hook: Skipping (platform: ${platform}, not macOS)`);
    return;
  }
  
  console.log('BeforePack hook: Verifying Electron executable exists...');
  const { appOutDir } = context;
  const appName = packager.appInfo.productFilename;
  const appPath = path.join(appOutDir, `${appName}.app`);
  const macosPath = path.join(appPath, 'Contents', 'MacOS');
  const electronPath = path.join(macosPath, 'Electron');
  
  if (!fs.existsSync(electronPath)) {
    console.log(`Electron executable missing at ${electronPath}, creating it now...`);
    
    // 确保 MacOS 目录存在
    if (!fs.existsSync(macosPath)) {
      fs.mkdirSync(macosPath, { recursive: true });
      console.log(`Created MacOS directory: ${macosPath}`);
    }
    
    // 从 node_modules 复制 Electron 可执行文件
    const sourcePath = path.join(process.cwd(), 'node_modules', 'electron', 'dist', 'Electron.app', 'Contents', 'MacOS', 'Electron');
    
    if (fs.existsSync(sourcePath)) {
      try {
        fs.copyFileSync(sourcePath, electronPath);
        fs.chmodSync(electronPath, 0o755);
        console.log(`Successfully copied Electron executable from ${sourcePath} to ${electronPath}`);
      } catch (err) {
        console.error(`Failed to copy Electron executable: ${err.message}`);
        throw err;
      }
    } else {
      console.error(`Error: Source Electron executable not found at ${sourcePath}`);
      throw new Error('Electron executable source not found');
    }
  } else {
    console.log(`Electron executable verified at ${electronPath}`);
  }
};

// afterPack: 在打包之后，只重命名可执行文件，不重命名整个 app（仅 macOS）
exports.default = async function(context) {
  const { packager } = context;
  const platform = packager.platform.name;
  
  if (platform !== 'darwin') {
    console.log(`AfterPack hook: Skipping (platform: ${platform}, not macOS)`);
    return;
  }
  
  const { appOutDir } = context;
  const appName = 'ThreeConstruction'; // 目标应用名称
  const currentAppName = packager.appInfo.productFilename;
  const appPath = path.join(appOutDir, `${currentAppName}.app`);
  const macosPath = path.join(appPath, 'Contents', 'MacOS');
  const electronPath = path.join(macosPath, 'Electron');
  const targetPath = path.join(macosPath, appName);

  console.log(`AfterPack hook: Processing ${appPath}`);
  
  // 只重命名可执行文件，不重命名整个 app（让 electron-builder 完成所有检查）
  if (fs.existsSync(electronPath) && !fs.existsSync(targetPath)) {
    console.log(`Renaming executable from ${electronPath} to ${targetPath}`);
    fs.renameSync(electronPath, targetPath);
    
    // 更新 Info.plist 中的 CFBundleExecutable
    const infoPlistPath = path.join(appPath, 'Contents', 'Info.plist');
    if (fs.existsSync(infoPlistPath)) {
      let infoPlist = fs.readFileSync(infoPlistPath, 'utf8');
      infoPlist = infoPlist.replace(/<key>CFBundleExecutable<\/key>\s*<string>.*?<\/string>/, 
        `<key>CFBundleExecutable</key>\n\t<string>${appName}</string>`);
      fs.writeFileSync(infoPlistPath, infoPlist);
      console.log(`Updated Info.plist CFBundleExecutable to ${appName}`);
    }
  }
  
  console.log(`AfterPack hook completed successfully!`);
};

// afterAllArtifactBuild: 在所有构建完成后重命名 app（仅 macOS）
// 注意：这个 hook 接收的参数是 artifactPaths 数组，不是 context 对象
exports.afterAllArtifactBuild = async function(context) {
  // afterAllArtifactBuild 的参数结构不同，需要检查平台
  // 只在 macOS 构建时执行
  try {
    // 检查是否是 macOS 构建（通过检查输出目录）
    const macOutDir = path.join(process.cwd(), 'release', 'mac');
    const winOutDir = path.join(process.cwd(), 'release', 'win-unpacked');
    
    // 如果 Windows 目录存在且 macOS 目录不存在，说明是 Windows 构建，跳过
    if (fs.existsSync(winOutDir) && !fs.existsSync(macOutDir)) {
      console.log('AfterAllArtifactBuild hook: Skipping (Windows build)');
      return;
    }
    
    // macOS 构建的重命名逻辑
    const appOutDir = path.join(process.cwd(), 'release', 'mac');
    const currentAppName = 'Electron';
    const appName = 'ThreeConstruction'; // 目标应用名称
    const appPath = path.join(appOutDir, `${currentAppName}.app`);
    const targetAppPath = path.join(appOutDir, `${appName}.app`);

    // 只在 macOS app 存在时执行
    if (!fs.existsSync(appPath)) {
      console.log('AfterAllArtifactBuild hook: macOS app not found, skipping');
      return;
    }

    console.log(`AfterAllArtifactBuild hook: Renaming app from ${currentAppName} to ${appName}`);
    console.log(`App path: ${appPath}`);
    console.log(`Target path: ${targetAppPath}`);
    
    // 重命名整个 app（在所有构建和检查完成后）
    if (fs.existsSync(targetAppPath)) {
      fs.rmSync(targetAppPath, { recursive: true, force: true });
    }
    fs.renameSync(appPath, targetAppPath);
    console.log(`Successfully renamed app to ${targetAppPath}`);
    
    console.log(`AfterAllArtifactBuild hook completed successfully!`);
  } catch (err) {
    console.error(`Error in afterAllArtifactBuild: ${err.message}`);
    console.error(err.stack);
    // 不抛出错误，避免中断构建流程
    console.log(`Continuing despite error...`);
  }
};

