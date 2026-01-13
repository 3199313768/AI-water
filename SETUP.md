# HydraFlow 设置指南

## 前置要求

- Node.js 18+ 
- Supabase 账户
- Gemini API Key

## 1. 安装依赖

```bash
npm install
```

## 2. 设置 Supabase

### 2.1 创建 Supabase 项目

1. 访问 [Supabase](https://supabase.com) 并登录
2. 创建新项目
3. 等待项目初始化完成

### 2.2 获取 Supabase 凭证

1. 进入项目设置 (Settings) > API
2. 复制以下信息：
   - **Project URL** (SUPABASE_URL)
   - **anon public** key (SUPABASE_ANON_KEY)

### 2.3 创建数据库表

1. 进入 Supabase Dashboard > SQL Editor
2. 运行 `supabase/migrations/001_initial_schema.sql` 文件中的 SQL 语句
3. 确认表创建成功：
   - `water_logs`
   - `user_settings`

## 3. 配置环境变量

在项目根目录创建 `.env` 文件：

```env
# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# Gemini API Key
GEMINI_API_KEY=your_gemini_api_key

# Server Port
PORT=3001
```

在项目根目录创建 `.env.local` 文件（用于前端）：

```env
# API URL (后端服务器地址)
VITE_API_URL=http://localhost:3001/api

# Gemini API Key (可选，如果前端直接调用)
GEMINI_API_KEY=your_gemini_api_key
```

## 4. 运行应用

### 开发模式

**终端 1 - 启动后端服务器：**
```bash
npm run server
```

**终端 2 - 启动前端开发服务器：**
```bash
npm run dev
```

### 生产模式

**构建后端：**
```bash
npm run server:build
```

**启动后端：**
```bash
npm run server:start
```

**构建前端：**
```bash
npm run build
```

**预览前端：**
```bash
npm run preview
```

## 5. 访问应用

- 前端: http://localhost:3000
- 后端 API: http://localhost:3001/api
- 健康检查: http://localhost:3001/api/health

## 6. API 端点

### 饮水记录
- `GET /api/water-logs/:userId` - 获取所有记录
- `GET /api/water-logs/:userId/today` - 获取今日记录
- `POST /api/water-logs` - 创建记录
- `PUT /api/water-logs/:id` - 更新记录
- `DELETE /api/water-logs/:id` - 删除记录

### 用户设置
- `GET /api/user-settings/:userId` - 获取设置
- `POST /api/user-settings` - 创建或更新设置
- `PATCH /api/user-settings/:userId` - 部分更新设置

### AI 建议
- `POST /api/advice` - 获取 AI 饮水建议

## 故障排除

### 后端无法连接 Supabase
- 检查 `.env` 文件中的 Supabase 凭证是否正确
- 确认 Supabase 项目状态为活跃

### 前端无法连接后端
- 确认后端服务器正在运行
- 检查 `VITE_API_URL` 配置是否正确
- 检查浏览器控制台的 CORS 错误

### 数据库表不存在
- 在 Supabase SQL Editor 中运行迁移脚本
- 检查表是否在 Database > Tables 中可见
