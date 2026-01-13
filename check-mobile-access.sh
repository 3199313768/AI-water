#!/bin/bash

echo "=== 手机端访问诊断工具 ==="
echo ""

# 获取本机 IP
LOCAL_IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -1)
echo "📱 本机局域网 IP: $LOCAL_IP"
echo ""

# 检查端口监听
echo "🔍 检查端口监听状态："
echo "前端 (3000):"
lsof -i :3000 | grep LISTEN || echo "  ❌ 未监听"
echo "后端 (3001):"
lsof -i :3001 | grep LISTEN || echo "  ❌ 未监听"
echo ""

# 测试本地访问
echo "🧪 测试本地访问："
echo -n "前端: "
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 && echo " ✅" || echo " ❌"
echo -n "后端: "
curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/api/health && echo " ✅" || echo " ❌"
echo ""

# 测试局域网访问
echo "🌐 测试局域网访问："
echo -n "前端 ($LOCAL_IP:3000): "
curl -s -o /dev/null -w "%{http_code}" http://$LOCAL_IP:3000 && echo " ✅" || echo " ❌"
echo -n "后端 ($LOCAL_IP:3001): "
curl -s -o /dev/null -w "%{http_code}" http://$LOCAL_IP:3001/api/health && echo " ✅" || echo " ❌"
echo ""

# 检查防火墙
echo "🔥 防火墙状态："
/usr/libexec/ApplicationFirewall/socketfilterfw --getglobalstate
echo ""

# 检查进程
echo "⚙️  服务进程："
ps aux | grep -E "(vite|tsx.*server)" | grep -v grep | awk '{print "  PID:", $2, "CMD:", $11, $12, $13}'
echo ""

echo "📋 手机端访问地址："
echo "   http://$LOCAL_IP:3000"
echo ""
echo "💡 如果无法访问，请检查："
echo "   1. 手机和电脑是否在同一 WiFi 网络"
echo "   2. 防火墙是否允许 3000 和 3001 端口"
echo "   3. 路由器是否开启了 AP 隔离"
echo "   4. 手机浏览器控制台是否有错误信息"
