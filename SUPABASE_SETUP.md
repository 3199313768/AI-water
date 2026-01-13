# Supabase 设置详细指南

## 步骤 1: 创建 Supabase 项目

### 1.1 注册/登录 Supabase

1. 访问 [https://supabase.com](https://supabase.com)
2. 点击右上角 **"Start your project"** 或 **"Sign in"**
3. 使用 GitHub 账号登录（推荐）或创建新账号

### 1.2 创建新项目

1. 登录后，点击 **"New Project"** 按钮
2. 填写项目信息：
   - **Organization**: 选择或创建组织
   - **Name**: 输入项目名称（如：`hydraflow`）
   - **Database Password**: 设置数据库密码（**重要：请保存此密码**）
   - **Region**: 选择离你最近的区域（如：`Southeast Asia (Singapore)`）
   - **Pricing Plan**: 选择 **Free** 计划（免费版足够使用）

3. 点击 **"Create new project"**
4. 等待项目初始化（通常需要 1-2 分钟）

## 步骤 2: 获取 API 凭证

### 2.1 进入项目设置

1. 项目创建完成后，点击左侧菜单的 **"Settings"**（设置图标）
2. 在设置页面，点击 **"API"** 选项

### 2.2 复制凭证

在 API 设置页面，你会看到：

1. **Project URL**
   - 位置：在 "Project URL" 部分
   - 格式：`https://xxxxxxxxxxxxx.supabase.co`
   - 复制这个 URL，这就是 `SUPABASE_URL`

2. **anon public key**
   - 位置：在 "Project API keys" 部分，找到 **"anon" "public"** 这一行
   - 点击右侧的眼睛图标或复制按钮
   - 复制这个 key，这就是 `SUPABASE_ANON_KEY`

3. **service_role key**（可选，用于后端管理操作）
   - 在同一页面，找到 **"service_role" "secret"** 这一行
   - 注意：这个 key 有完整权限，不要在前端使用

### 2.3 保存凭证

将复制的凭证保存到项目的 `.env` 文件中：

```env
SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 步骤 3: 运行数据库迁移

### 3.1 打开 SQL Editor

1. 在 Supabase Dashboard 左侧菜单，点击 **"SQL Editor"**（SQL 编辑器图标）
2. 点击 **"New query"** 按钮创建新查询

### 3.2 复制 SQL 代码

1. 打开项目中的 `supabase/migrations/001_initial_schema.sql` 文件
2. 复制文件中的**全部内容**

### 3.3 执行 SQL

1. 在 Supabase SQL Editor 中，粘贴复制的 SQL 代码
2. 点击右上角的 **"Run"** 按钮（或按 `Ctrl/Cmd + Enter`）
3. 等待执行完成（通常几秒钟）

### 3.4 验证表创建成功

1. 在左侧菜单，点击 **"Table Editor"**（表格编辑器）
2. 你应该能看到两个新表：
   - ✅ `water_logs` - 饮水记录表
   - ✅ `user_settings` - 用户设置表

## 步骤 4: 验证数据库结构

### 4.1 检查表结构

在 **Table Editor** 中：

1. 点击 `water_logs` 表
   - 应该看到列：`id`, `user_id`, `amount`, `timestamp`, `created_at`

2. 点击 `user_settings` 表
   - 应该看到列：`id`, `user_id`, `name`, `daily_goal`, `weight`, `activity_level`, `is_dark_mode`, `avatar`, `reminders_enabled`, `reminder_interval`, `created_at`, `updated_at`

### 4.2 测试插入数据（可选）

在 SQL Editor 中运行测试查询：

```sql
-- 测试插入用户设置
INSERT INTO user_settings (user_id, name, daily_goal, weight, activity_level)
VALUES ('test_user_123', 'Test User', 2000, 70, 'medium')
ON CONFLICT (user_id) DO NOTHING;

-- 测试插入饮水记录
INSERT INTO water_logs (user_id, amount, timestamp)
VALUES ('test_user_123', 250, EXTRACT(EPOCH FROM NOW()) * 1000);

-- 查询验证
SELECT * FROM user_settings WHERE user_id = 'test_user_123';
SELECT * FROM water_logs WHERE user_id = 'test_user_123';
```

如果查询成功返回数据，说明数据库设置正确。

## 步骤 5: 配置 Row Level Security (RLS)

数据库迁移脚本已经自动启用了 RLS 并创建了允许所有操作的策略。在生产环境中，你可能需要更严格的策略。

### 5.1 查看当前策略

1. 在左侧菜单，点击 **"Authentication"** > **"Policies"**
2. 或者直接在 SQL Editor 中运行：

```sql
-- 查看 water_logs 表的策略
SELECT * FROM pg_policies WHERE tablename = 'water_logs';

-- 查看 user_settings 表的策略
SELECT * FROM pg_policies WHERE tablename = 'user_settings';
```

### 5.2 生产环境建议（可选）

如果需要更安全的策略，可以在 SQL Editor 中运行：

```sql
-- 删除现有策略
DROP POLICY IF EXISTS "Allow all operations on water_logs" ON water_logs;
DROP POLICY IF EXISTS "Allow all operations on user_settings" ON user_settings;

-- 创建基于 user_id 的策略（需要认证）
CREATE POLICY "Users can manage their own water logs" ON water_logs
  FOR ALL
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can manage their own settings" ON user_settings
  FOR ALL
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);
```

**注意**：当前实现使用简单的 `user_id` 字符串，所以暂时使用允许所有操作的策略。如果后续集成 Supabase Auth，可以使用上面的策略。

## 常见问题

### Q: 找不到 SQL Editor？
A: 确保你已登录并进入了正确的项目。SQL Editor 在左侧菜单中，图标类似 `</>`。

### Q: SQL 执行失败？
A: 检查：
- 是否复制了完整的 SQL 代码
- 是否有语法错误
- 查看 SQL Editor 下方的错误信息

### Q: 表已存在错误？
A: 如果表已存在，可以：
1. 删除现有表（在 Table Editor 中右键删除）
2. 或者修改 SQL 使用 `CREATE TABLE IF NOT EXISTS`（已在迁移文件中）

### Q: 如何重置数据库？
A: 在 SQL Editor 中运行：

```sql
-- 删除表（会删除所有数据）
DROP TABLE IF EXISTS water_logs CASCADE;
DROP TABLE IF EXISTS user_settings CASCADE;
```

然后重新运行迁移脚本。

## 下一步

完成 Supabase 设置后：

1. ✅ 确认 `.env` 文件已配置 Supabase 凭证
2. ✅ 启动后端服务器：`npm run server`
3. ✅ 测试 API 连接：访问 `http://localhost:3001/api/health`

如果看到 `{"status":"ok","message":"HydraFlow API is running"}`，说明连接成功！
