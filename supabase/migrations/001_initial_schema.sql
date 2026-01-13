-- Create water_logs table
CREATE TABLE IF NOT EXISTS water_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  amount INTEGER NOT NULL CHECK (amount > 0),
  timestamp BIGINT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_settings table
CREATE TABLE IF NOT EXISTS user_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL DEFAULT 'User',
  daily_goal INTEGER NOT NULL DEFAULT 2000 CHECK (daily_goal > 0),
  weight INTEGER NOT NULL DEFAULT 70 CHECK (weight > 0),
  activity_level TEXT NOT NULL DEFAULT 'medium' CHECK (activity_level IN ('low', 'medium', 'high')),
  is_dark_mode BOOLEAN NOT NULL DEFAULT false,
  avatar TEXT,
  reminders_enabled BOOLEAN NOT NULL DEFAULT false,
  reminder_interval INTEGER NOT NULL DEFAULT 60 CHECK (reminder_interval > 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_water_logs_user_id ON water_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_water_logs_timestamp ON water_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON user_settings(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE water_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for water_logs (allow all operations for now, can be restricted later)
CREATE POLICY "Allow all operations on water_logs" ON water_logs
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create policies for user_settings (allow all operations for now, can be restricted later)
CREATE POLICY "Allow all operations on user_settings" ON user_settings
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_user_settings_updated_at
  BEFORE UPDATE ON user_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
