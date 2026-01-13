# HydraFlow App 打包指南

## 方案一：PWA（渐进式 Web 应用）

### 使用方法

1. **构建项目**
   ```bash
   npm run build
   ```

2. **部署到服务器**
   - 将 `dist` 目录部署到任何静态文件服务器
   - 或使用 `npm run preview` 本地预览

3. **添加到主屏幕**
   - iOS Safari: 点击分享按钮 → "添加到主屏幕"
   - Android Chrome: 点击菜单 → "添加到主屏幕"
   - 桌面浏览器: 地址栏右侧的安装图标

### 优势
- ✅ 无需应用商店审核
- ✅ 跨平台（iOS、Android、桌面）
- ✅ 自动更新
- ✅ 支持离线功能

---

## 方案二：Capacitor 原生 App

### 前置要求

- **iOS**: macOS + Xcode
- **Android**: Android Studio
- Node.js 18+

### 快速开始

#### 1. 构建 Web 应用
```bash
npm run build
```

#### 2. 添加平台

**iOS:**
```bash
npm run cap:add:ios
```

**Android:**
```bash
npm run cap:add:android
```

#### 3. 同步代码
```bash
npm run cap:sync
```

#### 4. 打开原生项目

**iOS:**
```bash
npm run cap:open:ios
```
然后在 Xcode 中：
- 选择开发团队（Signing & Capabilities）
- 连接 iPhone 或选择模拟器
- 点击运行按钮

**Android:**
```bash
npm run cap:open:android
```
然后在 Android Studio 中：
- 等待 Gradle 同步完成
- 连接 Android 设备或启动模拟器
- 点击运行按钮

### 配置说明

#### 修改 App 信息

编辑 `capacitor.config.ts`:
```typescript
{
  appId: 'com.hydraflow.app',  // 修改为你的包名
  appName: 'HydraFlow',        // 修改为你的应用名称
  webDir: 'dist'
}
```

#### iOS 配置

1. 打开 `ios/App/App.xcworkspace`
2. 在 Xcode 中：
   - 选择项目 → General
   - 修改 Display Name、Bundle Identifier
   - 在 Signing & Capabilities 中选择开发团队
   - 添加图标：Assets.xcassets → AppIcon

#### Android 配置

1. 打开 `android/` 目录
2. 编辑 `android/app/build.gradle`:
   ```gradle
   applicationId "com.hydraflow.app"  // 修改包名
   versionCode 1
   versionName "1.0.0"
   ```
3. 替换图标：`android/app/src/main/res/mipmap-*/ic_launcher.png`

### 发布到应用商店

#### iOS (App Store)

1. 在 Xcode 中：
   - Product → Archive
   - 选择 "Distribute App"
   - 选择 "App Store Connect"
   - 上传并提交审核

2. 在 [App Store Connect](https://appstoreconnect.apple.com) 中：
   - 创建应用
   - 填写应用信息、截图、描述
   - 提交审核

#### Android (Google Play)

1. 生成签名 APK/AAB:
   ```bash
   cd android
   ./gradlew bundleRelease  # AAB (推荐)
   # 或
   ./gradlew assembleRelease  # APK
   ```

2. 在 [Google Play Console](https://play.google.com/console) 中：
   - 创建应用
   - 上传 AAB/APK
   - 填写商店信息
   - 提交审核

### 常用命令

```bash
# 构建并同步
npm run cap:build

# 仅同步（不重新构建）
npm run cap:sync

# 打开 iOS 项目
npm run cap:open:ios

# 打开 Android 项目
npm run cap:open:android

# 查看 Capacitor 版本
npx cap --version
```

### 图标和启动画面

#### 创建图标

需要以下尺寸的 PNG 图标：

**iOS:**
- 1024x1024 (App Store)
- 各种尺寸（Xcode 会自动生成）

**Android:**
- 512x512 (Play Store)
- 192x192, 512x512 (应用内)

可以使用在线工具：
- [App Icon Generator](https://www.appicon.co/)
- [Icon Kitchen](https://icon.kitchen/)

#### 启动画面

编辑 `capacitor.config.ts` 中的 `SplashScreen` 配置。

### 环境变量

在原生 App 中，需要将环境变量打包进去：

1. 创建 `src/config.ts`:
   ```typescript
   export const config = {
     apiUrl: import.meta.env.VITE_API_URL || 'https://your-api.com/api',
     geminiApiKey: import.meta.env.GEMINI_API_KEY
   };
   ```

2. 或使用 Capacitor 的 Preferences API 存储配置

### 调试

#### iOS
- 使用 Safari Web Inspector（设备 → 开发 → 选择设备）
- 或 Xcode 控制台

#### Android
- 使用 Chrome DevTools（chrome://inspect）
- 或 Android Studio Logcat

### 常见问题

**Q: 构建后 API 请求失败**
A: 检查 `capacitor.config.ts` 中的 `server.url` 配置，或确保 API 使用 HTTPS

**Q: 图标不显示**
A: 确保图标文件在 `public/` 目录，且已正确配置 manifest.json

**Q: iOS 构建失败**
A: 检查 Xcode 中的 Signing & Capabilities，确保选择了开发团队

**Q: Android 构建失败**
A: 检查 `android/build.gradle` 中的 SDK 版本，确保安装了对应的 Android SDK

---

## 推荐方案

- **快速测试/个人使用**: PWA
- **发布到应用商店**: Capacitor
