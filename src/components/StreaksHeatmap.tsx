import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Cell
} from 'recharts';
import { Flame, Calendar, TrendingUp, Zap, BarChart2, Grid, Award, Sparkles, CheckCircle2 } from 'lucide-react';
import { UserProgress } from '../types';

interface StreaksHeatmapProps {
  userProgress: UserProgress;
}

export function StreaksHeatmap({ userProgress }: StreaksHeatmapProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'chart'>('grid');
  const [hoveredDay, setHoveredDay] = useState<{ dateStr: string; label: string; count: number; dayIndex: number } | null>(null);

  // Generate 30 days data array ending today
  const last30DaysData = useMemo(() => {
    const data = [];
    const today = new Date();

    // Map user's completed tasks/days if activityLog is sparse
    const activityLog = userProgress.activityLog || {};

    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);

      const dateStr = d.toISOString().slice(0, 10);
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      const monthDay = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      // Base count from activityLog or estimated if day was completed
      let count = activityLog[dateStr] || 0;

      // Seed small background activity for completed days if no log exists
      if (count === 0 && userProgress.completedDays.length > 0) {
        // distribute simulated active days matching completedDays length
        const dayIdx = 29 - i;
        if (dayIdx % 2 === 0 && dayIdx < userProgress.completedDays.length * 2) {
          count = (dayIdx % 3) + 1;
        }
      }

      data.push({
        dateStr,
        dayName,
        monthDay,
        count,
        dayNumber: 30 - i,
        isToday: i === 0
      });
    }

    return data;
  }, [userProgress]);

  // Statistics
  const totalActivity = useMemo(() => last30DaysData.reduce((acc, curr) => acc + curr.count, 0), [last30DaysData]);
  const activeDaysCount = useMemo(() => last30DaysData.filter((d) => d.count > 0).length, [last30DaysData]);
  const maxDailyCount = useMemo(() => Math.max(...last30DaysData.map((d) => d.count), 1), [last30DaysData]);
  const streakCount = userProgress.streakCount || 1;

  // Intensity color helpers
  const getCellBgClass = (count: number) => {
    if (count === 0) return 'bg-slate-100 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 text-slate-400 hover:border-slate-400';
    if (count <= 2) return 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:border-emerald-400';
    if (count <= 4) return 'bg-emerald-500/60 text-slate-950 font-bold border-emerald-400 hover:border-emerald-300';
    return 'bg-emerald-400 text-slate-950 font-extrabold border-emerald-300 shadow-sm shadow-emerald-500/20 hover:scale-105';
  };

  const getBarColor = (count: number) => {
    if (count === 0) return '#334155'; // slate-700
    if (count <= 2) return '#10b981'; // emerald-500
    if (count <= 4) return '#34d399'; // emerald-400
    return '#6ee7b7'; // emerald-300
  };

  // Custom Recharts Tooltip
  const CustomRechartsTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 border border-slate-700 text-slate-100 text-xs p-3 rounded-xl shadow-xl space-y-1 font-sans">
          <p className="font-bold text-emerald-400 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>{data.monthDay} ({data.dayName})</span>
          </p>
          <p className="text-slate-300">
            Activity: <span className="font-mono font-bold text-white">{data.count} actions</span>
          </p>
          <p className="text-[11px] text-slate-400">
            {data.count === 0 ? 'No lab tasks logged on this date' : `${data.count} lab tasks/milestones executed`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xl space-y-6">
      {/* Header toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800/80 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 fill-amber-500" />
              <span>{streakCount} Day Streak Active</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              30-Day Activity Log
            </span>
          </div>

          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span>SysAdmin Activity & Streaks Heatmap</span>
            <Sparkles className="w-4 h-4 text-emerald-500" />
          </h2>
        </div>

        {/* View Switcher Controls */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold self-start sm:self-auto">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              viewMode === 'grid'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs font-bold'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>Heatmap Grid</span>
          </button>

          <button
            onClick={() => setViewMode('chart')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              viewMode === 'chart'
                ? 'bg-emerald-500 text-slate-950 shadow-xs font-bold'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>Recharts Analytics</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/80">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <Flame className="w-4 h-4 text-amber-500" />
            <span>Current Streak</span>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-amber-500 font-mono mt-1">
            {streakCount} <span className="text-xs font-sans text-slate-400 font-normal">days</span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/80">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <Zap className="w-4 h-4 text-emerald-500" />
            <span>Total Actions (30d)</span>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-emerald-500 font-mono mt-1">
            {totalActivity}
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/80">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <TrendingUp className="w-4 h-4 text-blue-500" />
            <span>Active Days</span>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-blue-400 font-mono mt-1">
            {activeDaysCount} <span className="text-xs font-sans text-slate-400 font-normal">/ 30</span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/80">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <Award className="w-4 h-4 text-purple-500" />
            <span>Peak Daily Output</span>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-purple-400 font-mono mt-1">
            {maxDailyCount} <span className="text-xs font-sans text-slate-400 font-normal">tasks</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {viewMode === 'grid' ? (
        <div className="space-y-4 pt-2">
          {/* Heatmap Grid Matrix */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Past 30 Days Activity Log</span>
              <div className="flex items-center gap-1.5 text-[11px]">
                <span>Less</span>
                <div className="w-3 h-3 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" />
                <div className="w-3 h-3 rounded bg-emerald-500/30 border border-emerald-500/40" />
                <div className="w-3 h-3 rounded bg-emerald-500 border border-emerald-400" />
                <div className="w-3 h-3 rounded bg-emerald-400 border border-emerald-300" />
                <span>More</span>
              </div>
            </div>

            {/* 30 Cells Grid */}
            <div className="grid grid-cols-6 sm:grid-cols-10 md:grid-cols-15 gap-2 pt-1">
              {last30DaysData.map((item, idx) => {
                return (
                  <div
                    key={item.dateStr}
                    onMouseEnter={() => setHoveredDay({ dateStr: item.dateStr, label: item.monthDay, count: item.count, dayIndex: idx + 1 })}
                    onMouseLeave={() => setHoveredDay(null)}
                    className={`aspect-square rounded-xl border p-1.5 flex flex-col justify-between cursor-pointer transition-all ${getCellBgClass(
                      item.count
                    )} ${item.isToday ? 'ring-2 ring-amber-400 ring-offset-2 dark:ring-offset-slate-900' : ''}`}
                  >
                    <span className="text-[10px] font-mono leading-none opacity-80">
                      {item.monthDay.split(' ')[1]}
                    </span>

                    <span className="text-xs font-extrabold font-mono text-center">
                      {item.count > 0 ? item.count : '•'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Hover / Selected Info Banner */}
          <div className="min-h-[42px] p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800/80 text-xs flex items-center justify-between">
            {hoveredDay ? (
              <div className="flex items-center gap-3">
                <span className="font-bold text-emerald-500 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{hoveredDay.label}:</span>
                </span>
                <span className="text-slate-800 dark:text-slate-200 font-medium">
                  {hoveredDay.count === 0 ? 'No lab tasks logged on this date.' : `${hoveredDay.count} lab tasks / verification scripts executed.`}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-slate-500 text-xs">
                <Sparkles className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Hover or tap any date cell to view specific activity output.</span>
              </div>
            )}

            <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
              Today: {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          </div>
        </div>
      ) : (
        /* Recharts Analytics Mode */
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Daily Velocity & Completion Volume (Recharts Visualization)</span>
            <span className="text-[11px] font-mono text-emerald-500">Live Interactive Scale</span>
          </div>

          <div className="h-64 w-full bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={last30DaysData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="activityGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="monthDay"
                  stroke="#64748b"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  interval={3}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip content={<CustomRechartsTooltip />} />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#activityGradient)"
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {last30DaysData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getBarColor(entry.count)} />
                  ))}
                </Bar>
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
