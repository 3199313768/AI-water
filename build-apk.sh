#!/bin/bash

echo "=== HydraFlow APK 构建脚本 ==="
echo ""

# 检查是否已构建
if [ ! -d "dist" ]; then
    echo "📦 构建 Web 应用..."
    npm run build
fi

# 同步到 Android
echo "🔄 同步到 Android 平台..."
npm run cap:sync

# 检查 Android Studio
if command -v studio &> /dev/null || [ -d "/Applications/Android Studio.app" ]; then
    echo "✅ 检测到 Android Studio"
    echo ""
    echo "📱 下一步："
    echo "1. 运行: npm run cap:open:android"
    echo "2. 在 Android Studio 中："
    echo "   - Build → Build Bundle(s) / APK(s) → Build APK(s)"
    echo "3. APK 文件位置："
    echo "   android/app/build/outputs/apk/debug/app-debug.apk"
    echo ""
    echo "🚀 打开 Android Studio..."
    npm run cap:open:android
else
    echo "⚠️  未检测到 Android Studio"
    echo ""
    echo "📝 选项 1：安装 Android Studio"
    echo "   下载：https://developer.android.com/studio"
    echo ""
    echo "📝 选项 2：使用命令行构建（需要 Android SDK）"
    echo "   cd android"
    echo "   ./gradlew assembleDebug"
    echo ""
    echo "📝 选项 3：使用 PWA（推荐，最简单）"
    echo "   1. 运行: npm run dev"
    echo "   2. 手机访问: http://你的IP:3000"
    echo "   3. 添加到主屏幕"
fi
