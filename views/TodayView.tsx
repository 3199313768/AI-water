
import React, { useState, useEffect } from 'react';
import { WaterLog, UserSettings } from '../types';
import { getDrinkingAdvice } from '../services/geminiService';

interface TodayViewProps {
  logs: WaterLog[];
  settings: UserSettings;
  onAddWater: (amount: number) => void;
}

const TodayView: React.FC<TodayViewProps> = ({ logs, settings, onAddWater }) => {
  const [advice, setAdvice] = useState<string>("喝水可以提升您的精力和大脑功能。");
  const [loadingAdvice, setLoadingAdvice] = useState(false);

  // Filter logs for today
  const today = new Date().setHours(0,0,0,0);
  const todayLogs = logs.filter(log => log.timestamp >= today);
  const totalAmount = todayLogs.reduce((sum, log) => sum + log.amount, 0);
  const percentage = Math.min(Math.round((totalAmount / settings.dailyGoal) * 100), 100);
  const remaining = Math.max(settings.dailyGoal - totalAmount, 0);

  useEffect(() => {
    const fetchAdvice = async () => {
      setLoadingAdvice(true);
      const tip = await getDrinkingAdvice(totalAmount, settings.dailyGoal);
      setAdvice(tip);
      setLoadingAdvice(false);
    };
    
    // Fetch advice initially and whenever goal changes significantly (simplified)
    fetchAdvice();
  }, [settings.dailyGoal]);

  const progressOffset = 753.98 - (753.98 * percentage) / 100;

  return (
    <div className="p-6 pb-2">
      <header className="flex items-center justify-between mb-6">
        <div className="flex flex-col">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">下午好，{settings.name}</p>
          <h1 className="text-2xl font-bold tracking-tight dark:text-white">今日饮水</h1>
        </div>
        <button className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <span className="material-symbols-outlined text-gray-700 dark:text-gray-200">notifications</span>
          <span className="absolute top-2 right-2 flex h-2 w-2 rounded-full bg-orange-400"></span>
        </button>
      </header>

      {/* Advice Card */}
      <div className="glass-card flex items-center gap-4 rounded-xl p-4 shadow-sm mb-8">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
          <span className="material-symbols-outlined">lightbulb</span>
        </div>
        <div className="flex-1">
          <p className="text-xs font-bold text-primary tracking-wider mb-0.5">AI 饮水建议</p>
          <p className={`text-sm font-normal leading-tight text-gray-600 dark:text-gray-300 ${loadingAdvice ? 'animate-pulse' : ''}`}>
            {advice}
          </p>
        </div>
      </div>

      {/* Progress Ring */}
      <div className="flex flex-col items-center justify-center relative my-10">
        <div className="relative flex items-center justify-center w-64 h-64 rounded-full border-[12px] border-gray-100 dark:border-gray-800 shadow-inner">
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle 
              className="text-primary transition-all duration-1000 ease-out" 
              cx="50%" cy="50%" fill="transparent" r="120" 
              stroke="currentColor" 
              strokeDasharray="753.98" 
              strokeDashoffset={progressOffset} 
              strokeLinecap="round" 
              strokeWidth="12"
            ></circle>
          </svg>
          <div className="text-center z-10">
            <span className="text-5xl font-black block text-primary">{percentage}%</span>
            <span className="text-lg font-bold text-gray-700 dark:text-gray-200">
              {(totalAmount/1000).toFixed(1)}升 / {(settings.dailyGoal/1000).toFixed(1)}升
            </span>
            <p className="text-xs font-bold text-gray-400 mt-1">每日目标</p>
          </div>
          <div className="absolute bottom-4 w-40 h-40 opacity-10 pointer-events-none">
            <div className="w-full h-full bg-primary rounded-full filter blur-3xl"></div>
          </div>
        </div>
        <p className="mt-8 text-sm font-medium text-gray-500 dark:text-gray-400">
          {percentage >= 100 ? (
            <span className="text-green-500 font-bold">太棒了！你已达成目标！</span>
          ) : (
            <>就快要达标了！还差 <span className="text-primary font-bold">{remaining}毫升</span>。</>
          )}
        </p>
      </div>

      {/* Quick Add */}
      <div className="z-10 mt-6">
        <h3 className="text-base font-bold mb-4 dark:text-white">快速添加</h3>
        <div className="grid grid-cols-3 gap-3">
          <QuickAddButton 
            amount={250} 
            label="杯子" 
            icon="local_cafe" 
            onClick={() => onAddWater(250)} 
          />
          <QuickAddButton 
            amount={330} 
            label="水杯" 
            icon="local_drink" 
            primary 
            onClick={() => onAddWater(330)} 
          />
          <QuickAddButton 
            amount={500} 
            label="瓶子" 
            icon="water_bottle" 
            onClick={() => onAddWater(500)} 
          />
        </div>
      </div>
    </div>
  );
};

interface QuickAddButtonProps {
  amount: number;
  label: string;
  icon: string;
  onClick: () => void;
  primary?: boolean;
}

const QuickAddButton: React.FC<QuickAddButtonProps> = ({ amount, label, icon, onClick, primary }) => {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center gap-3 p-4 rounded-xl transition-all active:scale-95 ${primary ? 'border-2 border-primary/20 bg-primary/5' : 'glass-card hover:border-primary'}`}
    >
      <div className={`w-12 h-12 flex items-center justify-center rounded-lg ${primary ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-primary/10 text-primary'}`}>
        <span className="material-symbols-outlined text-3xl">{icon}</span>
      </div>
      <div className="text-center">
        <p className="text-sm font-bold leading-none dark:text-white">{amount}毫升</p>
        <p className="text-[10px] font-bold text-gray-500 mt-1">{label}</p>
      </div>
    </button>
  );
};

export default TodayView;
