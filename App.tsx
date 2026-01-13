
import React, { useState, useEffect, useRef } from 'react';
import { WaterLog, UserSettings, ViewType } from './types';
import TodayView from './views/TodayView';
import StatsView from './views/StatsView';
import ProfileView from './views/ProfileView';
import { waterLogsApi, userSettingsApi } from './services/api';

const DEFAULT_SETTINGS: UserSettings = {
  name: 'Alex',
  dailyGoal: 2000,
  weight: 70,
  activityLevel: 'medium',
  isDarkMode: false,
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
  remindersEnabled: false,
  reminderInterval: 60
};

const App: React.FC = () => {
  const [view, setView] = useState<ViewType>(ViewType.TODAY);
  const [logs, setLogs] = useState<WaterLog[]>([]);
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const timerRef = useRef<number | null>(null);

  // Load data from API
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // Load logs
        const fetchedLogs = await waterLogsApi.getAll();
        setLogs(fetchedLogs);

        // Load settings
        const fetchedSettings = await userSettingsApi.get();
        if (fetchedSettings) {
          setSettings(fetchedSettings);
          if (fetchedSettings.isDarkMode) {
            document.documentElement.classList.add('dark');
          }
        } else {
          // Create default settings if none exist
          const newSettings = await userSettingsApi.createOrUpdate(DEFAULT_SETTINGS);
          setSettings(newSettings);
        }
      } catch (error) {
        console.error('Failed to load data:', error);
        // Fallback to localStorage if API fails
        const savedLogs = localStorage.getItem('hydraflow_logs');
        if (savedLogs) {
          setLogs(JSON.parse(savedLogs));
        }
        const savedSettings = localStorage.getItem('hydraflow_settings');
        if (savedSettings) {
          const parsed = JSON.parse(savedSettings);
          setSettings(prev => ({ ...prev, ...parsed }));
          if (parsed.isDarkMode) {
            document.documentElement.classList.add('dark');
          }
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Save settings to API
  useEffect(() => {
    if (!loading) {
      userSettingsApi.update(settings).catch(error => {
        console.error('Failed to save settings:', error);
        // Fallback to localStorage
        localStorage.setItem('hydraflow_settings', JSON.stringify(settings));
      });
      
      if (settings.isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [settings, loading]);

  // Reminder Logic
  useEffect(() => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
    }

    if (settings.remindersEnabled) {
      timerRef.current = window.setInterval(() => {
        sendNotification("该喝水啦！", "保持身体水分充足，点击记录你的饮水量。");
      }, settings.reminderInterval * 60 * 1000);
    }

    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [settings.remindersEnabled, settings.reminderInterval]);

  const sendNotification = (title: string, body: string) => {
    // 触发震动反馈：[震动200ms, 停100ms, 震动200ms]
    if ("vibrate" in navigator) {
      navigator.vibrate([200, 100, 200]);
    }

    if (!("Notification" in window)) return;
    
    if (Notification.permission === "granted") {
      new Notification(title, {
        body,
        icon: 'https://cdn-icons-png.flaticon.com/512/3105/3105807.png'
      });
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          new Notification(title, { body });
        }
      });
    }
  };

  const addWater = async (amount: number) => {
    try {
      const newLog = await waterLogsApi.create(amount);
      setLogs(prev => [newLog, ...prev]);
    } catch (error) {
      console.error('Failed to add water log:', error);
      // Fallback: add to local state and localStorage
      const fallbackLog: WaterLog = {
        id: Math.random().toString(36).substr(2, 9),
        amount,
        timestamp: Date.now()
      };
      setLogs(prev => [fallbackLog, ...prev]);
      const savedLogs = localStorage.getItem('hydraflow_logs');
      const logs = savedLogs ? JSON.parse(savedLogs) : [];
      localStorage.setItem('hydraflow_logs', JSON.stringify([fallbackLog, ...logs]));
    }
  };

  const updateSettings = async (newSettings: Partial<UserSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    try {
      await userSettingsApi.update(newSettings);
    } catch (error) {
      console.error('Failed to update settings:', error);
      // Fallback to localStorage
      localStorage.setItem('hydraflow_settings', JSON.stringify(updatedSettings));
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full max-w-md mx-auto flex-col items-center justify-center bg-background-light dark:bg-background-dark">
        <div className="text-primary text-lg font-bold">加载中...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full max-w-md mx-auto flex-col overflow-hidden bg-background-light dark:bg-background-dark shadow-2xl relative">
      <div className="flex-1 overflow-y-auto pb-24">
        {view === ViewType.TODAY && (
          <TodayView 
            logs={logs} 
            settings={settings} 
            onAddWater={addWater} 
          />
        )}
        {view === ViewType.STATS && (
          <StatsView 
            logs={logs} 
            settings={settings} 
          />
        )}
        {view === ViewType.PROFILE && (
          <ProfileView 
            settings={settings} 
            onUpdateSettings={updateSettings} 
          />
        )}
      </div>

      {/* Navigation Bar */}
      <nav className="absolute bottom-0 left-0 w-full h-20 glass-card border-t border-gray-100 dark:border-gray-800 flex items-center justify-around px-8 pb-4 z-50">
        <button 
          onClick={() => setView(ViewType.TODAY)}
          className={`flex flex-col items-center gap-1 transition-colors ${view === ViewType.TODAY ? 'text-primary' : 'text-gray-400'}`}
        >
          <span className={`material-symbols-outlined ${view === ViewType.TODAY ? 'fill-1' : ''}`}>water_drop</span>
          <span className="text-[10px] font-bold">今日</span>
        </button>
        
        <button 
          onClick={() => setView(ViewType.STATS)}
          className={`flex flex-col items-center gap-1 transition-colors ${view === ViewType.STATS ? 'text-primary' : 'text-gray-400'}`}
        >
          <span className="material-symbols-outlined">bar_chart</span>
          <span className="text-[10px] font-bold">统计</span>
        </button>

        <div className="relative -top-6">
          <button 
            onClick={() => addWater(250)}
            className="w-14 h-14 bg-primary text-white rounded-full shadow-lg shadow-primary/40 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined text-3xl">add</span>
          </button>
        </div>

        <button 
          onClick={() => setView(ViewType.PROFILE)}
          className={`flex flex-col items-center gap-1 transition-colors ${view === ViewType.PROFILE ? 'text-primary' : 'text-gray-400'}`}
        >
          <span className="material-symbols-outlined">person</span>
          <span className="text-[10px] font-bold">个人</span>
        </button>
      </nav>

      {view === ViewType.TODAY && (
        <div className="absolute bottom-0 left-0 w-full h-32 pointer-events-none z-0">
          <div className="liquid-wave absolute bottom-0 left-0 w-full h-full opacity-40"></div>
          <div className="liquid-wave absolute bottom-[-10px] left-0 w-full h-full opacity-60 scale-x-[-1] translate-y-2"></div>
        </div>
      )}
    </div>
  );
};

export default App;
