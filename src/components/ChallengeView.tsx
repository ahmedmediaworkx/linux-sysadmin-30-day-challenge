import React, { useState, useMemo } from 'react';
import { Search, Filter, CheckCircle2, Clock, Terminal, Sparkles, ChevronRight, BookOpen, ShieldCheck, Flame, Trophy } from 'lucide-react';
import { DayChallenge, SkillLevel, UserProgress } from '../types';
import { DAYS_DATA } from '../data/daysData';
import { StreaksHeatmap } from './StreaksHeatmap';
import { MotionCard } from './motion/MotionCard';
import { ScrollReveal, ScrollRevealItem } from './motion/ScrollReveal';

interface ChallengeViewProps {
  userProgress: UserProgress;
  onSelectDay: (day: DayChallenge) => void;
  onSelectTab: (tab: 'challenge' | 'playground' | 'blog' | 'about') => void;
}

export function ChallengeView({
  userProgress,
  onSelectDay,
  onSelectTab
}: ChallengeViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<SkillLevel | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'pending'>('all');

  // Categories list
  const categories = useMemo(() => {
    const set = new Set<string>();
    DAYS_DATA.forEach((d) => set.add(d.category));
    return Array.from(set);
  }, []);

  // Filtered days
  const completedDays = userProgress?.completedDays || [];

  const filteredDays = useMemo(() => {
    return DAYS_DATA.filter((day) => {
      // Level
      if (selectedLevel !== 'all' && day.level !== selectedLevel) return false;
      // Category
      if (selectedCategory !== 'all' && day.category !== selectedCategory) return false;
      // Status
      const isCompleted = completedDays.includes(day.id);
      if (statusFilter === 'completed' && !isCompleted) return false;
      if (statusFilter === 'pending' && isCompleted) return false;
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = day.title.toLowerCase().includes(q);
        const matchSummary = day.summary.toLowerCase().includes(q);
        const matchTags = day.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchTitle && !matchSummary && !matchTags) return false;
      }
      return true;
    });
  }, [searchQuery, selectedLevel, selectedCategory, statusFilter, completedDays]);

  const completedCount = completedDays.length;
  const totalDays = 30;
  const progressPercent = Math.round((completedCount / totalDays) * 100);

  const getLevelBadgeClass = (level: SkillLevel) => {
    switch (level) {
      case 'junior':
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'mid':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'senior':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Section */}
      <ScrollReveal distance={40} duration={0.6}>
        <div className="relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 text-slate-100 p-6 sm:p-10 shadow-2xl">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Open-Source Curriculum • Junior to Senior Infrastructure</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              30-Day Linux System Administrator Challenge
            </h1>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Master production Linux administration through hands-on local labs, real-world troubleshooting scenarios, interactive code blocks, and step-by-step task checklists.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
              <button
                onClick={() => onSelectTab('playground')}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20"
              >
                <Terminal className="w-4 h-4" />
                <span>Launch Terminal Simulator</span>
              </button>

              <button
                onClick={() => onSelectTab('about')}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium flex items-center gap-1.5 transition-colors"
              >
                <BookOpen className="w-4 h-4 text-emerald-400" />
                <span>About Ahmed (ahmedmediaworkx) Wael</span>
              </button>
            </div>
          </div>

          {/* Progress Card Overview */}
          <div className="mt-8 pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/60">
              <span className="text-[11px] text-slate-400 block font-medium">Days Completed</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-xl font-extrabold text-emerald-400 font-mono">{completedCount}</span>
                <span className="text-xs text-slate-500">/ 30</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/60">
              <span className="text-[11px] text-slate-400 block font-medium">Challenge Progress</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-xl font-extrabold text-blue-400 font-mono">{progressPercent}%</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/60">
              <span className="text-[11px] text-slate-400 block font-medium">Current Streak</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Flame className="w-4 h-4 text-amber-500" />
                <span className="text-xl font-extrabold text-amber-400 font-mono">{userProgress.streakCount || 1} Days</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/60">
              <span className="text-[11px] text-slate-400 block font-medium">SysAdmin Rank</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Trophy className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-bold text-slate-200 truncate">
                  {completedCount >= 30 ? 'Principal Architect' : completedCount >= 20 ? 'Senior Infra' : completedCount >= 10 ? 'Mid SysAdmin' : 'Junior Trainee'}
                </span>
              </div>
            </div>
          </div>

          {/* Global Progress Bar */}
          <div className="mt-4 w-full bg-slate-950 rounded-full h-2 border border-slate-800 overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-500 via-teal-400 to-blue-500 h-full transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </ScrollReveal>

      {/* Visual Streaks Heatmap Section */}
      <ScrollReveal distance={40} duration={0.6} delay={0.1}>
        <StreaksHeatmap userProgress={userProgress} />
      </ScrollReveal>

      {/* Filter & Search Toolbar */}
      <ScrollReveal distance={40} duration={0.6} delay={0.15}>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row items-center gap-3">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search labs (e.g. LVM, SSH, Docker, eBPF)..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* Level Filter Tabs */}
            <div className="flex gap-1 overflow-x-auto w-full md:w-auto p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs">
              <button
                onClick={() => setSelectedLevel('all')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  selectedLevel === 'all'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                All Levels (1-30)
              </button>
              <button
                onClick={() => setSelectedLevel('junior')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  selectedLevel === 'junior'
                    ? 'bg-emerald-500 text-slate-950 shadow-xs font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                Junior (1-10)
              </button>
              <button
                onClick={() => setSelectedLevel('mid')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  selectedLevel === 'mid'
                    ? 'bg-blue-500 text-slate-950 shadow-xs font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                Mid-Level (11-20)
              </button>
              <button
                onClick={() => setSelectedLevel('senior')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  selectedLevel === 'senior'
                    ? 'bg-purple-500 text-slate-950 shadow-xs font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                Senior (21-30)
              </button>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1 text-xs ml-auto">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 font-medium focus:outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="completed">Completed Only</option>
                <option value="pending">Pending Only</option>
              </select>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Days Grid Cards with Staggered Scroll Reveal */}
      <ScrollReveal
        staggerChildren={0.06}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
      >
        {filteredDays.map((day) => {
          const isCompleted = userProgress.completedDays.includes(day.id);
          const tasksCompleted = userProgress.completedTasks[day.id]?.length || 0;
          const totalTasks = day.tasks.length;

          return (
            <ScrollRevealItem key={day.id} distance={40} duration={0.6}>
              <MotionCard
                onClick={() => onSelectDay(day)}
                className={`group relative rounded-2xl p-5 border cursor-pointer flex flex-col justify-between h-full ${
                  isCompleted
                    ? 'bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/30'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="space-y-3">
                  {/* Header info */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                        DAY {day.dayNumber}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${getLevelBadgeClass(day.level)}`}>
                        {day.level}
                      </span>
                    </div>

                    {isCompleted ? (
                      <span className="flex items-center gap-1 text-xs text-emerald-500 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Completed</span>
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-400 font-mono">
                        {day.durationMinutes} mins
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base group-hover:text-emerald-500 transition-colors leading-snug">
                    {day.title}
                  </h3>

                  {/* Summary */}
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {day.summary}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {day.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Footer Progress */}
                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                  <div className="text-[11px] text-slate-400 font-mono">
                    Tasks: <span className="text-slate-900 dark:text-slate-100 font-bold">{tasksCompleted}/{totalTasks}</span>
                  </div>

                  <div className="flex items-center gap-1 text-xs font-bold text-emerald-500 group-hover:translate-x-0.5 transition-transform">
                    <span>Open Lab</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </MotionCard>
            </ScrollRevealItem>
          );
        })}
      </ScrollReveal>

      {filteredDays.length === 0 && (
        <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 space-y-3">
          <Terminal className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">No labs found matching criteria</h3>
          <p className="text-xs text-slate-500">Try adjusting your search keywords or clearing filters.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedLevel('all');
              setSelectedCategory('all');
              setStatusFilter('all');
            }}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
