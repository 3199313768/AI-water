
export interface WaterLog {
  id: string;
  amount: number; // in ml
  timestamp: number;
}

export interface UserSettings {
  name: string;
  dailyGoal: number; // in ml
  weight: number; // in kg
  activityLevel: 'low' | 'medium' | 'high';
  isDarkMode: boolean;
  avatar?: string; // 用户头像的 Base64 或 URL
  remindersEnabled: boolean;
  reminderInterval: number; // 提醒间隔（分钟）
}

export enum ViewType {
  TODAY = 'today',
  STATS = 'stats',
  PROFILE = 'profile'
}
