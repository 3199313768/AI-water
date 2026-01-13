# 快速安装到手机

## 🚀 最简单方法：PWA（推荐）

### 步骤

1. **启动服务**
   ```bash
   # 终端 1：启动后端
   npm run server
   
   # 终端 2：启动前端
   npm run dev
   ```

2. **获取电脑 IP 地址**
   ```bash
   ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -1
   ```
   或手动查看：系统设置 → 网络 → 查看 IP 地址

3. **手机访问并安装**
   - 确保手机和电脑连接**同一 WiFi**
   - 打开手机浏览器（Chrome/Safari）
   - 访问：`http://你的IP:3000`
     - 例如：`http://192.168.1.55:3000`
   - 点击浏览器菜单 → **"添加到主屏幕"**
   - 完成！现在可以像 App 一样使用

### 优势
- ✅ 无需安装任何开发工具
- ✅ 无需应用商店
- ✅ 自动更新
- ✅ 支持离线使用

---

## 📱 生成 Android APK（原生应用）

### 方法一：使用 Android Studio（推荐）

1. **安装 Android Studio**
   - 下载：https://developer.android.com/studio
   - 安装并打开

2. **构建 APK**
   ```bash
   # 构建 Web 应用
   npm run build
   
   # 同步到 Android
   npm run cap:sync
   
   # 打开 Android Studio
   npm run cap:open:android
   ```

3. **在 Android Studio 中**
   - 等待 Gradle 同步完成（首次需要几分钟）
   - 菜单：**Build → Build Bundle(s) / APK(s) → Build APK(s)**
   - 等待构建完成
   - 点击通知中的 "locate" 查看 APK 文件

4. **安装到手机**
   - 将 APK 文件传输到手机（USB/云盘/局域网）
   - 在手机上打开文件管理器
   - 点击 APK 文件安装
   - 允许"未知来源"安装（如提示）

### 方法二：命令行构建（需要 Android SDK）

```bash
cd android
./gradlew assembleDebug
```

APK 位置：`android/app/build/outputs/apk/debug/app-debug.apk`

### 方法三：使用构建脚本

```bash
./build-apk.sh
```

---

## 🍎 iOS 安装（需要 macOS）

1. **安装 Xcode**
   - 从 App Store 安装 Xcode

2. **构建并安装**
   ```bash
   npm install @capacitor/ios
   npm run cap:add:ios
   npm run build
   npm run cap:sync
   npm run cap:open:ios
   ```

3. **在 Xcode 中**
   - 选择你的 iPhone（USB 连接）
   - 选择开发团队（Signing & Capabilities）
   - 点击运行按钮

---

## 🔧 配置 API 地址（原生 App）

如果使用原生 App，需要配置后端 API 地址：

1. **创建 `.env.production`**
   ```env
   VITE_API_URL=https://your-api-server.com/api
   ```

2. **或修改 `capacitor.config.ts`**
   ```typescript
   server: {
     url: 'https://your-api-server.com',
     cleartext: false
   }
   ```

3. **重新构建**
   ```bash
   npm run build
   npm run cap:sync
   ```

---

## 📋 检查清单

### PWA 安装
- [ ] 前后端服务运行中
- [ ] 手机和电脑同一 WiFi
- [ ] 可以访问 `http://IP:3000`
- [ ] 已添加到主屏幕

### APK 安装
- [ ] 已安装 Android Studio
- [ ] 已构建 APK
- [ ] 手机允许安装未知来源
- [ ] APK 文件已传输到手机

---

## ❓ 常见问题

**Q: 手机无法访问？**
- 检查防火墙设置
- 确认手机和电脑同一网络
- 尝试关闭 VPN

**Q: PWA 安装后无法连接后端？**
- 确保后端服务运行：`npm run server`
- 检查 API 地址配置

**Q: APK 安装失败？**
- Android 设置 → 安全 → 允许未知来源
- 检查 APK 文件是否完整

**Q: 如何更新应用？**
- PWA：刷新页面即可
- APK：重新构建并安装新版本

---

## 🎯 推荐流程

1. **首次使用**：PWA（最简单，5分钟搞定）
2. **需要原生功能**：生成 APK
3. **发布应用商店**：使用 Android Studio 构建发布版
