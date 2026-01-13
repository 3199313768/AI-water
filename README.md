<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# HydraFlow - AI 智能饮水助手

一个前后端一体的智能饮水追踪应用，使用 Supabase 作为数据库，集成 Gemini AI 提供个性化饮水建议。

## 功能特性

- 💧 记录每日饮水量
- 📊 统计分析和可视化
- 🤖 AI 智能饮水建议（Gemini）
- ⚙️ 个性化设置（目标、提醒等）
- 🌙 深色模式支持
- 📱 响应式设计
## 技术栈

### 前端
- React 19
- TypeScript
- Vite

### 后端
- Node.js + Express
- TypeScript
- Supabase (PostgreSQL)

### AI
- Google Gemini API

## 快速开始

### 前置要求

- Node.js 18+
- Supabase 账户
- Gemini API Key

### 安装步骤

1. **克隆项目并安装依赖**
   ```bash
   npm install
   ```

2. **设置 Supabase**
   - 在 [Supabase](https://supabase.com) 创建新项目
   - 获取 Project URL 和 anon key
   - 在 Supabase SQL Editor 中运行 `supabase/migrations/001_initial_schema.sql`

3. **配置环境变量**
   
   创建 `.env` 文件（后端）：
   ```env
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   GEMINI_API_KEY=your_gemini_api_key
   PORT=3001
   ```
   
   创建 `.env.local` 文件（前端）：
   ```env
   VITE_API_URL=http://localhost:3001/api
   GEMINI_API_KEY=your_gemini_api_key
   ```

4. **运行应用**

   启动后端服务器（终端 1）：
   ```bash
   npm run server
   ```

   启动前端开发服务器（终端 2）：
   ```bash
   npm run dev
   ```

5. **访问应用**
   - 前端: http://localhost:3000
   - 后端 API: http://localhost:3001/api

## 详细设置

查看 [SETUP.md](./SETUP.md) 获取完整的设置指南。

## 项目结构

```
hydraflow---ai-智能饮水助手/
├── server/                 # 后端服务器
│   ├── index.ts           # 服务器入口
│   ├── config/            # 配置文件
│   │   └── supabase.ts    # Supabase 客户端
│   └── routes/            # API 路由
│       ├── waterLogs.ts   # 饮水记录 API
│       ├── userSettings.ts # 用户设置 API
│       └── advice.ts      # AI 建议 API
├── services/              # 前端服务
│   ├── api.ts            # API 客户端
│   └── geminiService.ts  # Gemini 服务（已迁移到后端）
├── views/                 # 页面组件
│   ├── TodayView.tsx     # 今日视图
│   ├── StatsView.tsx     # 统计视图
│   └── ProfileView.tsx   # 个人设置视图
├── supabase/             # 数据库迁移
│   └── migrations/       # SQL 迁移文件
└── App.tsx               # 主应用组件
```

## API 文档

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

## 开发脚本

- `npm run dev` - 启动前端开发服务器
- `npm run server` - 启动后端开发服务器（watch 模式）
- `npm run build` - 构建前端
- `npm run server:build` - 构建后端
- `npm run server:start` - 启动生产后端服务器

## 许可证

MIT
