
import React from 'react';
import { WaterLog, UserSettings } from '../types';

interface StatsViewProps {
  logs: WaterLog[];
  settings: UserSettings;
}

const StatsView: React.FC<StatsViewProps> = ({ logs, settings }) => {
  // Generate last 7 days data
  const getLast7Days = () => {
    const days = [];
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);
      
      const amount = logs
        .filter(log => {
          const logDate = new Date(log.timestamp);
          logDate.setHours(0, 0, 0, 0);
          return logDate.getTime() === d.getTime();
        })
        .reduce((sum, log) => sum + log.amount, 0);

      days.push({
        label: weekdays[d.getDay()],
        amount,
        percentage: Math.min((amount / settings.dailyGoal) * 100, 100)
      });
    }
    return days;
  };

  const weeklyData = getLast7Days();
  const average = weeklyData.reduce((sum, d) => sum + d.amount, 0) / 7;
  const completedDays = weeklyData.filter(d => d.amount >= settings.dailyGoal).length;

  return (
    <div className="px-4 py-4 min-h-screen">
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold tracking-tight dark:text-white">统计报告</h1>
        </div>
        <button className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
          <span className="material-symbols-outlined dark:text-white">calendar_today</span>
        </button>
      </header>

      <section className="mb-6">
        <div className="flex h-12 w-full items-center justify-center rounded-xl bg-slate-200/50 dark:bg-slate-800/50 p-1">
          <button className="flex h-full grow items-center justify-center rounded-lg bg-white dark:bg-slate-700 shadow-sm text-primary font-semibold transition-all text-sm">周</button>
          <button className="flex h-full grow items-center justify-center rounded-lg text-slate-500 font-semibold transition-all text-sm">月</button>
        </div>
      </section>

      <section className="mb-6">
        <div className="rounded-xl bg-white dark:bg-slate-900 p-6 shadow-sm border border-slate-100 dark:border-slate-800">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">日均饮水量</h3>
              <p className="text-3xl font-bold tracking-tight text-primary">
                {(average / 1000).toFixed(1)}
                <span className="text-lg ml-1 font-semibold text-slate-400">L</span>
              </p>
            </div>
            <div className="flex items-center gap-1 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
              <span className="material-symbols-outlined text-green-500 text-sm">trending_up</span>
              <span className="text-green-500 text-xs font-bold">+12%</span>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-3 h-48 items-end relative">
            <div className="absolute w-full border-t border-dashed border-slate-200 dark:border-slate-800 top-[30%] z-0">
              <span className="absolute right-0 -top-5 text-[10px] text-slate-400 font-bold tracking-wider">目标</span>
            </div>
            
            {weeklyData.map((day, idx) => (
              <div key={idx} className="flex flex-col items-center gap-2 z-10 h-full justify-end">
                <div className="w-full bg-primary/20 rounded-t-lg relative overflow-hidden h-full max-h-[100%]">
                  <div 
                    style={{ height: `${day.percentage}%` }}
                    className={`absolute bottom-0 w-full bg-primary rounded-t-lg transition-all duration-700 ${day.percentage < 100 ? 'opacity-60' : ''}`}
                  ></div>
                </div>
                <span className="text-[11px] font-bold text-slate-400 shrink-0">{day.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <h3 className="text-lg font-bold mb-4 flex items-center gap-2 dark:text-white">
        <span className="material-symbols-outlined text-primary">lightbulb</span>
        核心分析
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 rounded-xl bg-white dark:bg-slate-900 p-5 flex items-center justify-between border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex flex-col gap-1">
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">目标达成率</p>
            <p className="text-2xl font-bold tracking-tight dark:text-white">
              {Math.round((completedDays / 7) * 100)}%
            </p>
            <p className="text-xs text-green-500 font-bold">较上周 +5%</p>
          </div>
          <div className="relative w-16 h-16">
            <svg className="w-full h-full -rotate-90">
              <circle className="text-slate-100 dark:text-slate-800" cx="32" cy="32" fill="transparent" r="28" stroke="currentColor" strokeWidth="6"></circle>
              <circle 
                className="text-primary" cx="32" cy="32" fill="transparent" r="28" 
                stroke="currentColor" 
                strokeDasharray="176" 
                strokeDashoffset={176 - (176 * completedDays) / 7} 
                strokeLinecap="round" strokeWidth="6"
              ></circle>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-xl">check_circle</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white dark:bg-slate-900 p-5 border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center mb-4 text-primary">
            <span className="material-symbols-outlined">schedule</span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">饮水高峰期</p>
          <p className="text-lg font-bold mt-1 dark:text-white">10 AM - 12 PM</p>
        </div>

        <div className="rounded-xl bg-white dark:bg-slate-900 p-5 border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="bg-orange-100 w-10 h-10 rounded-full flex items-center justify-center mb-4 text-orange-500">
            <span className="material-symbols-outlined">local_fire_department</span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">连续达标天数</p>
          <p className="text-lg font-bold mt-1 dark:text-white">14 天</p>
        </div>
      </div>

      <section className="mt-6 mb-10">
        <div className="rounded-xl bg-primary/10 p-5 border border-primary/20 relative overflow-hidden">
          <div className="relative z-10">
            <h4 className="font-bold text-primary mb-1">太棒了！</h4>
            <p className="text-sm text-slate-600 dark:text-slate-300">本周你有 {completedDays} 天达成了目标。继续保持！</p>
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-20">
            <span className="material-symbols-outlined text-[120px] text-primary">water_drop</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default StatsView;
