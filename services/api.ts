import { WaterLog, UserSettings } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Get or create a default user ID (in production, this would come from authentication)
const getUserId = (): string => {
    let userId = localStorage.getItem('hydraflow_user_id');
    if (!userId) {
        userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('hydraflow_user_id', userId);
    }
    return userId;
};

// Water Logs API
export const waterLogsApi = {
    getAll: async (): Promise<WaterLog[]> => {
        const userId = getUserId();
        const response = await fetch(`${API_BASE_URL}/water-logs/${userId}`);
        if (!response.ok) throw new Error('Failed to fetch water logs');
        const data = await response.json();
        return data.map((log: any) => ({
            id: log.id,
            amount: log.amount,
            timestamp: log.timestamp
        }));
    },

    getToday: async (): Promise<WaterLog[]> => {
        const userId = getUserId();
        const response = await fetch(`${API_BASE_URL}/water-logs/${userId}/today`);
        if (!response.ok) throw new Error('Failed to fetch today\'s water logs');
        const data = await response.json();
        return data.map((log: any) => ({
            id: log.id,
            amount: log.amount,
            timestamp: log.timestamp
        }));
    },

    create: async (amount: number, timestamp: number = Date.now()): Promise<WaterLog> => {
        const userId = getUserId();
        const response = await fetch(`${API_BASE_URL}/water-logs`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: userId, amount, timestamp })
        });
        if (!response.ok) throw new Error('Failed to create water log');
        const data = await response.json();
        return {
            id: data.id,
            amount: data.amount,
            timestamp: data.timestamp
        };
    },

    delete: async (id: string): Promise<void> => {
        const response = await fetch(`${API_BASE_URL}/water-logs/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete water log');
    },

    update: async (id: string, amount: number, timestamp: number): Promise<WaterLog> => {
        const response = await fetch(`${API_BASE_URL}/water-logs/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount, timestamp })
        });
        if (!response.ok) throw new Error('Failed to update water log');
        const data = await response.json();
        return {
            id: data.id,
            amount: data.amount,
            timestamp: data.timestamp
        };
    }
};

// User Settings API
export const userSettingsApi = {
    get: async (): Promise<UserSettings | null> => {
        const userId = getUserId();
        const response = await fetch(`${API_BASE_URL}/user-settings/${userId}`);
        if (!response.ok) throw new Error('Failed to fetch user settings');
        const data = await response.json();
        if (!data) return null;
        return {
            name: data.name,
            dailyGoal: data.daily_goal,
            weight: data.weight,
            activityLevel: data.activity_level,
            isDarkMode: data.is_dark_mode,
            avatar: data.avatar,
            remindersEnabled: data.reminders_enabled,
            reminderInterval: data.reminder_interval
        };
    },

    createOrUpdate: async (settings: Partial<UserSettings>): Promise<UserSettings> => {
        const userId = getUserId();
        const response = await fetch(`${API_BASE_URL}/user-settings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: userId,
                name: settings.name,
                daily_goal: settings.dailyGoal,
                weight: settings.weight,
                activity_level: settings.activityLevel,
                is_dark_mode: settings.isDarkMode,
                avatar: settings.avatar,
                reminders_enabled: settings.remindersEnabled,
                reminder_interval: settings.reminderInterval
            })
        });
        if (!response.ok) throw new Error('Failed to save user settings');
        const data = await response.json();
        return {
            name: data.name,
            dailyGoal: data.daily_goal,
            weight: data.weight,
            activityLevel: data.activity_level,
            isDarkMode: data.is_dark_mode,
            avatar: data.avatar,
            remindersEnabled: data.reminders_enabled,
            reminderInterval: data.reminder_interval
        };
    },

    update: async (updates: Partial<UserSettings>): Promise<UserSettings> => {
        const userId = getUserId();
        const response = await fetch(`${API_BASE_URL}/user-settings/${userId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: updates.name,
                daily_goal: updates.dailyGoal,
                weight: updates.weight,
                activity_level: updates.activityLevel,
                is_dark_mode: updates.isDarkMode,
                avatar: updates.avatar,
                reminders_enabled: updates.remindersEnabled,
                reminder_interval: updates.reminderInterval
            })
        });
        if (!response.ok) throw new Error('Failed to update user settings');
        const data = await response.json();
        return {
            name: data.name,
            dailyGoal: data.daily_goal,
            weight: data.weight,
            activityLevel: data.activity_level,
            isDarkMode: data.is_dark_mode,
            avatar: data.avatar,
            remindersEnabled: data.reminders_enabled,
            reminderInterval: data.reminder_interval
        };
    }
};

// Advice API
export const adviceApi = {
    get: async (currentAmount: number, dailyGoal: number): Promise<string> => {
        const response = await fetch(`${API_BASE_URL}/advice`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ currentAmount, dailyGoal })
        });
        if (!response.ok) {
            const error = await response.json();
            return error.advice || "喝水可以提升您的精力和大脑功能。";
        }
        const data = await response.json();
        return data.advice;
    }
};
