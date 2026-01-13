
import React, { useState, useRef } from 'react';
import { UserSettings } from '../types';

interface ProfileViewProps {
  settings: UserSettings;
  onUpdateSettings: (newSettings: Partial<UserSettings>) => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ settings, onUpdateSettings }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempSettings, setTempSettings] = useState<UserSettings>(settings);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    onUpdateSettings(tempSettings);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempSettings(settings);
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let finalValue: any = value;
    
    if (type === 'number' || name === 'dailyGoal' || name === 'weight' || name === 'reminderInterval') {
      finalValue = Number(value);
    }

    setTempSettings(prev => ({
      ...prev,
      [name]: finalValue
    }));
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setTempSettings(prev => ({ ...prev, avatar: base64String }));
        if (!isEditing) setIsEditing(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const testNotification = () => {
    // 触发单次震动反馈
    if ("vibrate" in navigator) {
      navigator.vibrate(300);
    }

    if (!("Notification" in window)) {
      alert("此浏览器不支持桌面通知");
      return;
    }
    Notification.requestPermission().then(permission => {
      if (permission === "granted") {
        new Notification("HydraFlow 测试通知", {
          body: "提醒功能已准备就绪，震动已同步！",
          icon: 'https://cdn-icons-png.flaticon.com/512/3105/3105807.png'
        });
      } else {
        alert("请授予通知权限以使用提醒功能。");
      }
    });
  };

  const currentAvatar = tempSettings.avatar || settings.avatar || 'https://picsum.photos/200';

  return (
    <div className="px-4 py-4 min-h-screen">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
      />
      
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold tracking-tight dark:text-white">设置与个人资料</h1>
        </div>
        {isEditing ? (
          <div className="flex gap-2">
            <button 
              onClick={handleCancel}
              className="p-2 rounded-xl bg-gray-200 dark:bg-slate-800 text-gray-600 dark:text-gray-400 transition-transform active:scale-90"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            <button 
              onClick={handleSave}
              className="p-2 rounded-xl bg-primary text-white shadow-lg shadow-primary/20 transition-transform active:scale-90"
            >
              <span className="material-symbols-outlined">check</span>
            </button>
          </div>
        ) : (
          <button 
            onClick={() => setIsEditing(true)}
            className="p-2 rounded-xl bg-primary/10 text-primary transition-transform active:scale-90"
          >
            <span className="material-symbols-outlined">edit</span>
          </button>
        )}
      </header>

      <main className="space-y-6 pb-12">
        <section className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm mt-2 border border-slate-100 dark:border-slate-800">
          <div className="flex flex-col items-center gap-4">
            <div className="relative group">
              <div className="w-28 h-28 rounded-full border-4 border-primary/20 p-1 overflow-hidden transition-transform group-hover:scale-105">
                <div 
                  className="w-full h-full rounded-full bg-cover bg-center bg-gray-100" 
                  style={{ backgroundImage: `url('${currentAvatar}')` }}
                ></div>
              </div>
              <button 
                onClick={handleAvatarClick}
                className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full border-4 border-white dark:border-slate-900 shadow-md transition-transform hover:scale-110 active:scale-90 cursor-pointer"
                title="更换头像"
              >
                <span className="material-symbols-outlined text-sm">photo_camera</span>
              </button>
            </div>
            
            <div className="text-center w-full">
              {isEditing ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    name="name"
                    value={tempSettings.name}
                    onChange={handleChange}
                    placeholder="昵称"
                    className="w-full px-3 py-2 text-center text-xl font-bold bg-gray-50 dark:bg-slate-800 border-none rounded-lg focus:ring-2 focus:ring-primary dark:text-white"
                  />
                  <div className="flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-primary text-base">flag</span>
                    <input
                      type="number"
                      name="dailyGoal"
                      value={tempSettings.dailyGoal}
                      onChange={handleChange}
                      className="w-32 px-2 py-1 text-center font-bold text-primary bg-gray-50 dark:bg-slate-800 border-none rounded-lg focus:ring-2 focus:ring-primary"
                    />
                    <span className="text-primary font-bold">ml</span>
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-extrabold dark:text-white">{settings.name}</h2>
                  <p className="text-primary font-bold flex items-center justify-center gap-1">
                    <span className="material-symbols-outlined text-base">water_drop</span>
                    每日目标: {settings.dailyGoal} ml
                  </p>
                </>
              )}
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest px-1 mb-3">饮水目标影响因素</h3>
          <div className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-4 px-4 py-4 border-b border-gray-50 dark:border-gray-800">
              <div className="w-11 h-11 rounded-xl bg-orange-100 dark:bg-orange-900/30 text-orange-600 flex items-center justify-center">
                <span className="material-symbols-outlined">monitor_weight</span>
              </div>
              <div className="flex-1">
                <p className="font-bold text-base dark:text-white">体重</p>
                <p className="text-xs text-gray-500">影响基础饮水量</p>
              </div>
              <div className="flex items-center gap-2">
                {isEditing ? (
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      name="weight"
                      value={tempSettings.weight}
                      onChange={handleChange}
                      className="w-16 px-2 py-1 text-right font-bold text-primary bg-gray-50 dark:bg-slate-800 border-none rounded-lg focus:ring-2 focus:ring-primary"
                    />
                    <span className="font-bold text-primary">kg</span>
                  </div>
                ) : (
                  <span className="font-bold text-primary">{settings.weight} kg</span>
                )}
                <span className="material-symbols-outlined text-gray-300">chevron_right</span>
              </div>
            </div>
            <div className="flex items-center gap-4 px-4 py-4">
              <div className="w-11 h-11 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center">
                <span className="material-symbols-outlined">fitness_center</span>
              </div>
              <div className="flex-1">
                <p className="font-bold text-base dark:text-white">活动强度</p>
                <p className="text-xs text-gray-500">根据运动量调整目标</p>
              </div>
              <div className="flex items-center gap-2">
                {isEditing ? (
                  <select
                    name="activityLevel"
                    value={tempSettings.activityLevel}
                    onChange={handleChange}
                    className="px-2 py-1 font-bold text-primary bg-gray-50 dark:bg-slate-800 border-none rounded-lg focus:ring-2 focus:ring-primary appearance-none text-right"
                  >
                    <option value="low">低</option>
                    <option value="medium">适中</option>
                    <option value="high">高</option>
                  </select>
                ) : (
                  <span className="font-bold text-primary">
                    {settings.activityLevel === 'medium' ? '适中' : settings.activityLevel === 'low' ? '低' : '高'}
                  </span>
                )}
                <span className="material-symbols-outlined text-gray-300">chevron_right</span>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest px-1 mb-3">提醒与偏好</h3>
          <div className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800 space-y-1 p-2">
            
            {/* 定时提醒开关 */}
            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-background-light dark:hover:bg-gray-800 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 flex items-center justify-center">
                  <span className="material-symbols-outlined">notifications_active</span>
                </div>
                <div>
                  <p className="font-bold text-sm dark:text-white">定时提醒</p>
                  <p className="text-[10px] text-gray-500">定时发送喝水通知</p>
                </div>
              </div>
              <div 
                onClick={() => onUpdateSettings({ remindersEnabled: !settings.remindersEnabled })}
                className={`w-12 h-6 rounded-full relative p-1 cursor-pointer transition-colors ${settings.remindersEnabled ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full absolute transition-all ${settings.remindersEnabled ? 'right-1' : 'left-1'}`}></div>
              </div>
            </div>

            {/* 提醒间隔设置 */}
            {settings.remindersEnabled && (
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-slate-800/40 ml-1">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-gray-400 text-sm">schedule</span>
                  <p className="text-sm font-medium dark:text-gray-300">提醒间隔</p>
                </div>
                <div className="flex items-center gap-2">
                  <select 
                    value={settings.reminderInterval}
                    onChange={(e) => onUpdateSettings({ reminderInterval: Number(e.target.value) })}
                    className="bg-transparent border-none text-primary font-bold text-sm focus:ring-0 p-0 text-right"
                  >
                    <option value="15">15 分钟</option>
                    <option value="30">30 分钟</option>
                    <option value="45">45 分钟</option>
                    <option value="60">1 小时</option>
                    <option value="90">1.5 小时</option>
                    <option value="120">2 小时</option>
                  </select>
                </div>
              </div>
            )}

            {/* 测试通知按钮 */}
            <button 
              onClick={testNotification}
              className="w-full flex items-center justify-center gap-2 py-2 mt-2 text-xs font-bold text-gray-500 hover:text-primary transition-colors border border-dashed border-gray-200 dark:border-gray-700 rounded-lg"
            >
              <span className="material-symbols-outlined text-sm">send</span>
              发送测试通知 (含震动)
            </button>

            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-background-light dark:hover:bg-gray-800 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined">dark_mode</span>
                </div>
                <div>
                  <p className="font-bold text-sm dark:text-white">深色模式</p>
                  <p className="text-[10px] text-gray-500">切换界面外观</p>
                </div>
              </div>
              <div 
                onClick={() => onUpdateSettings({ isDarkMode: !settings.isDarkMode })}
                className={`w-12 h-6 rounded-full relative p-1 cursor-pointer transition-colors ${settings.isDarkMode ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full absolute transition-all ${settings.isDarkMode ? 'right-1' : 'left-1'}`}></div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ProfileView;
