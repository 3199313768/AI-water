# 手机端安装指南

## 方案一：PWA 安装（推荐，最简单）

### Android 手机

1. **在手机上打开浏览器**（Chrome 或 Edge）
2. **访问应用地址**：
   ```
   http://你的电脑IP:3000
   ```
   例如：`http://192.168.1.55:3000`

3. **添加到主屏幕**：
   - 点击浏览器菜单（三个点）
   - 选择"添加到主屏幕"或"安装应用"
   - 确认安装

4. **使用**：
   - 主屏幕会出现 HydraFlow 图标
   - 点击即可像原生 App 一样使用

### iOS 手机

1. **在 Safari 中打开应用**
2. **点击分享按钮**（底部中间的方框箭头）
3. **选择"添加到主屏幕"**
4. **确认添加**

### 优势
- ✅ 无需应用商店
- ✅ 无需开发者账号
- ✅ 自动更新
- ✅ 支持离线使用

---

## 方案二：生成 Android APK（原生应用）

### 前置要求

- Android Studio（用于构建 APK）
- 或使用在线构建服务

### 步骤

#### 1. 安装 Android 平台
```bash
npm install @capacitor/android
npm run cap:add:android
```

#### 2. 打开 Android Studio
```bash
npm run cap:open:android
```

#### 3. 在 Android Studio 中构建 APK

**方法 A：调试版 APK（可直接安装）**
1. Build → Build Bundle(s) / APK(s) → Build APK(s)
2. 等待构建完成
3. 点击 "locate" 链接找到 APK 文件
4. 将 APK 传输到手机并安装

**方法 B：发布版 APK（需要签名）**
1. Build → Generate Signed Bundle / APK
2. 选择 APK
3. 创建或选择密钥库（KeyStore）
4. 选择 release 构建类型
5. 完成构建后，APK 在 `android/app/release/app-release.apk`

#### 4. 安装到手机

**方法 1：USB 连接**
```bash
# 连接手机后
adb install android/app/release/app-release.apk
```

**方法 2：传输文件**
- 通过 USB、云盘、或局域网传输 APK 到手机
- 在手机上打开文件管理器
- 点击 APK 文件安装（需要允许"未知来源"安装）

**方法 3：局域网传输**
```bash
# 在电脑上启动 HTTP 服务器
cd android/app/release
python3 -m http.server 8080

# 在手机浏览器访问
http://你的电脑IP:8080/app-release.apk
```

### 允许安装未知来源应用（Android）

1. 设置 → 安全 → 允许安装未知来源应用
2. 或安装时系统会提示，选择"允许"

---

## 方案三：iOS 安装（需要 macOS + Xcode）

### 前置要求

- macOS 系统
- Xcode
- Apple 开发者账号（免费账号也可用于个人设备）

### 步骤

#### 1. 安装 iOS 平台
```bash
npm install @capacitor/ios
npm run cap:add:ios
```

#### 2. 打开 Xcode
```bash
npm run cap:open:ios
```

#### 3. 配置签名
1. 选择项目 → Signing & Capabilities
2. 选择你的开发团队
3. 修改 Bundle Identifier（如果冲突）

#### 4. 连接 iPhone
1. 用 USB 连接 iPhone
2. 在 Xcode 中选择你的设备
3. 点击运行按钮

#### 5. 信任开发者（首次安装）
1. iPhone 设置 → 通用 → VPN与设备管理
2. 信任你的开发者账号

---

## 快速开始（推荐流程）

### 最简单的方式：PWA

1. **确保服务运行**：
   ```bash
   # 终端 1：启动后端
   npm run server
   
   # 终端 2：启动前端
   npm run dev
   ```

2. **获取电脑 IP**：
   ```bash
   ifconfig | grep "inet " | grep -v 127.0.0.1
   ```

3. **手机访问**：
   - 打开浏览器
   - 访问 `http://你的IP:3000`
   - 添加到主屏幕

### 生成 APK（如果需要原生应用）

```bash
# 1. 构建 Web 应用
npm run build

# 2. 同步到 Capacitor
npm run cap:sync

# 3. 打开 Android Studio
npm run cap:open:android

# 4. 在 Android Studio 中构建 APK
# Build → Build Bundle(s) / APK(s) → Build APK(s)
```

---

## 常见问题

### Q: PWA 安装后无法连接后端？
A: 确保后端服务运行，且手机和电脑在同一网络。检查 `services/api.ts` 中的 API 地址配置。

### Q: APK 安装失败？
A: 
- 检查是否允许"未知来源"安装
- 确保 APK 文件完整下载
- 尝试重新构建 APK

### Q: iOS 安装需要付费吗？
A: 个人设备测试不需要付费。发布到 App Store 需要 $99/年。

### Q: 如何更新应用？
A: 
- PWA：自动更新（刷新即可）
- APK：重新构建并安装新版本

---

## 推荐方案

- **快速测试/个人使用**：PWA（方案一）
- **需要原生功能/发布应用商店**：APK/IPA（方案二/三）
