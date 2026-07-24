import React, { useState, useMemo } from 'react';
import { Search, Filter, CheckCircle2, Clock, Terminal, Sparkles, ChevronRight, BookOpen, ShieldCheck, Flame, Trophy } from 'lucide-react';
import { DayChallenge, SkillLevel, UserProgress } from '../types';
import { DAYS_DATA } from '../data/daysData';
import { StreaksHeatmap } from './StreaksHeatmap';
import { MotionCard } from './motion/MotionCard';
import { ScrollReveal, ScrollRevealItem } from './motion/ScrollReveal';
import { useLanguage } from '../context/LanguageContext';
import { getLocalizedDay, categoryArabicMap } from '../data/arabicTranslations';

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
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<SkillLevel | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'pending'>('all');

  // Localized days data
  const localizedDaysData = useMemo(() => {
    return DAYS_DATA.map((d) => getLocalizedDay(d, language));
  }, [language]);

  // Categories list
  const categories = useMemo(() => {
    const set = new Set<string>();
    localizedDaysData.forEach((d) => set.add(d.category));
    return Array.from(set);
  }, [localizedDaysData]);

  // Filter handlers
  const handleLevelChange = (level: SkillLevel | 'all') => {
    setSelectedLevel(level);
    if (level !== 'all' && selectedCategory !== 'all') {
      const hasMatch = localizedDaysData.some((d) => d.level === level && d.category === selectedCategory);
      if (!hasMatch) {
        setSelectedCategory('all');
      }
    }
  };

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    if (cat !== 'all' && selectedLevel !== 'all') {
      const hasMatch = localizedDaysData.some((d) => d.category === cat && d.level === selectedLevel);
      if (!hasMatch) {
        setSelectedLevel('all');
      }
    }
  };

  // Filtered days
  const completedDays = userProgress?.completedDays || [];

  const filteredDays = useMemo(() => {
    return localizedDaysData.filter((day) => {
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
        const matchCategory = day.category.toLowerCase().includes(q);
        const matchDayNum = `day ${day.dayNumber}`.includes(q) || `${day.dayNumber}` === q.trim();
        if (!matchTitle && !matchSummary && !matchTags && !matchCategory && !matchDayNum) return false;
      }
      return true;
    });
  }, [localizedDaysData, searchQuery, selectedLevel, selectedCategory, statusFilter, completedDays]);

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
        <div className="relative overflow-hidden rounded-3xl bg-[#0D1117] border border-[#30363D] text-slate-100 p-6 sm:p-10 shadow-2xl">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#DC2626]/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-[#22C55E]/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#DC2626]/10 text-[#EF4444] border border-[#DC2626]/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t('hero.curriculumBadge', 'Open-Source Curriculum • Junior to Senior Infrastructure')}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#F9FAFB] tracking-tight leading-tight">
              {t('hero.title', '30-Day Linux System Administrator Challenge')}
            </h1>

            <p className="text-[#D1D5DB] text-xs sm:text-sm leading-relaxed">
              {t('hero.subtitle', 'Master production Linux administration through hands-on local labs, real-world troubleshooting scenarios, interactive code blocks, and step-by-step task checklists.')}
            </p>

            <div className="flex flex-wrap items-center gap-2.5 pt-2 text-xs">
              <button
                onClick={() => onSelectTab('playground')}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#DC2626] hover:bg-[#EF4444] text-white font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#DC2626]/20 cursor-pointer min-h-[44px] touch-manipulation"
              >
                <Terminal className="w-4 h-4" />
                <span>{t('hero.launchTerminal', 'Launch Terminal Simulator')}</span>
              </button>

              <button
                onClick={() => onSelectTab('about')}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#161B22] hover:bg-[#21262D] text-[#F9FAFB] border border-[#30363D] font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer min-h-[44px] touch-manipulation"
              >
                <BookOpen className="w-4 h-4 text-[#22C55E]" />
                <span>{t('hero.aboutAuthor', 'About Ahmed (ahmedmediaworkx) Wael')}</span>
              </button>
            </div>
          </div>

          {/* Progress Card Overview */}
          <div className="mt-8 pt-6 border-t border-[#30363D] grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-3.5 rounded-2xl bg-[#050505]/70 border border-[#30363D]">
              <span className="text-[11px] text-[#9CA3AF] block font-medium">{t('hero.daysCompleted', 'Days Completed')}</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-xl font-extrabold text-[#22C55E] font-mono">{completedCount}</span>
                <span className="text-xs text-[#6B7280]">/ 30</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#050505]/70 border border-[#30363D]">
              <span className="text-[11px] text-[#9CA3AF] block font-medium">{t('hero.challengeProgress', 'Challenge Progress')}</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-xl font-extrabold text-blue-400 font-mono">{progressPercent}%</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#050505]/70 border border-[#30363D]">
              <span className="text-[11px] text-[#9CA3AF] block font-medium">{t('hero.currentStreak', 'Current Streak')}</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Flame className="w-4 h-4 text-amber-500" />
                <span className="text-xl font-extrabold text-amber-400 font-mono">{userProgress.streakCount || 1} {t('common.days', 'Days')}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#050505]/70 border border-[#30363D]">
              <span className="text-[11px] text-[#9CA3AF] block font-medium">{t('hero.sysadminRank', 'SysAdmin Rank')}</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Trophy className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-bold text-[#F9FAFB] truncate">
                  {completedCount >= 30 ? t('ranks.principal', 'Principal Architect') : completedCount >= 20 ? t('ranks.senior', 'Senior Infra') : completedCount >= 10 ? t('ranks.mid', 'Mid SysAdmin') : t('ranks.junior', 'Junior Trainee')}
                </span>
              </div>
            </div>
          </div>

          {/* Global Progress Bar */}
          <div className="mt-4 w-full bg-[#050505] rounded-full h-2 border border-[#30363D] overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#DC2626] via-[#22C55E] to-blue-500 h-full transition-all duration-500 rounded-full"
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
        <div className="bg-white dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] rounded-2xl p-4 sm:p-6 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row items-center gap-3">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('filters.searchPlaceholder', 'Search labs (e.g. LVM, SSH, Docker, eBPF)...')}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-[#30363D] bg-slate-50 dark:bg-[#0D1117] text-xs text-slate-900 dark:text-[#F9FAFB] focus:outline-none focus:ring-1 focus:ring-[#DC2626]"
              />
            </div>

            {/* Level Filter Tabs */}
            <div className="flex gap-1 overflow-x-auto w-full md:w-auto p-1 bg-slate-100 dark:bg-[#0D1117] rounded-xl text-xs shrink-0 border border-slate-200 dark:border-[#30363D]">
              <button
                type="button"
                onClick={() => handleLevelChange('all')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  selectedLevel === 'all'
                    ? 'bg-white dark:bg-[#161B22] text-slate-900 dark:text-[#F9FAFB] shadow-xs font-bold border border-slate-200 dark:border-[#30363D]'
                    : 'text-slate-600 dark:text-[#9CA3AF] hover:text-slate-900 dark:hover:text-[#F9FAFB]'
                }`}
              >
                {t('filters.allLevels', 'All Levels (30)')}
              </button>
              <button
                type="button"
                onClick={() => handleLevelChange('junior')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  selectedLevel === 'junior'
                    ? 'bg-[#22C55E] text-slate-950 shadow-xs font-bold'
                    : 'text-slate-600 dark:text-[#9CA3AF] hover:text-slate-900 dark:hover:text-[#F9FAFB]'
                }`}
              >
                {t('filters.junior', 'Junior (10)')}
              </button>
              <button
                type="button"
                onClick={() => handleLevelChange('mid')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  selectedLevel === 'mid'
                    ? 'bg-blue-500 text-white shadow-xs font-bold'
                    : 'text-slate-600 dark:text-[#9CA3AF] hover:text-slate-900 dark:hover:text-[#F9FAFB]'
                }`}
              >
                {t('filters.mid', 'Mid-Level (10)')}
              </button>
              <button
                type="button"
                onClick={() => handleLevelChange('senior')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  selectedLevel === 'senior'
                    ? 'bg-[#DC2626] text-white shadow-xs font-bold'
                    : 'text-slate-600 dark:text-[#9CA3AF] hover:text-slate-900 dark:hover:text-[#F9FAFB]'
                }`}
              >
                {t('filters.senior', 'Senior (10)')}
              </button>
            </div>

            {/* Dropdowns for Category & Status */}
            <div className="flex flex-col sm:flex-row flex-wrap items-center gap-2 text-xs w-full md:w-auto md:ml-auto">
              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full sm:w-auto px-3 py-2 rounded-xl border border-slate-200 dark:border-[#30363D] bg-slate-50 dark:bg-[#0D1117] text-slate-700 dark:text-[#D1D5DB] font-medium focus:outline-none focus:ring-1 focus:ring-[#DC2626] cursor-pointer min-h-[40px]"
              >
                <option value="all">{t('filters.allCategories', 'All Categories')}</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="w-full sm:w-auto px-3 py-2 rounded-xl border border-slate-200 dark:border-[#30363D] bg-slate-50 dark:bg-[#0D1117] text-slate-700 dark:text-[#D1D5DB] font-medium focus:outline-none focus:ring-1 focus:ring-[#DC2626] cursor-pointer min-h-[40px]"
              >
                <option value="all">{t('filters.allStatuses', 'All Statuses')}</option>
                <option value="completed">{t('filters.completedOnly', 'Completed Only')}</option>
                <option value="pending">{t('filters.inProgressOnly', 'In-Progress Only')}</option>
              </select>
            </div>
          </div>

          {/* Active Filter Chips & Results Count */}
          {(selectedLevel !== 'all' || selectedCategory !== 'all' || statusFilter !== 'all' || searchQuery.trim() !== '') && (
            <div className="pt-3 border-t border-slate-100 dark:border-[#30363D] flex flex-wrap items-center gap-2 text-xs">
              <span className="text-[#9CA3AF] text-[11px]">
                {t('filters.showing', 'Showing')} {filteredDays.length} {t('filters.of', 'of')} 30 {t('filters.labsMatching', 'labs matching:')}
              </span>
              
              {selectedLevel !== 'all' && (
                <span className="px-2 py-0.5 rounded-md bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/20 font-bold flex items-center gap-1">
                  {t('filters.level', 'Level')}: {selectedLevel}
                  <button type="button" onClick={() => setSelectedLevel('all')} className="hover:opacity-75 font-bold cursor-pointer">×</button>
                </span>
              )}

              {selectedCategory !== 'all' && (
                <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold flex items-center gap-1">
                  {t('filters.category', 'Category')}: {selectedCategory}
                  <button type="button" onClick={() => setSelectedCategory('all')} className="hover:opacity-75 font-bold cursor-pointer">×</button>
                </span>
              )}

              {statusFilter !== 'all' && (
                <span className="px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/20 font-bold flex items-center gap-1">
                  {t('filters.status', 'Status')}: {statusFilter}
                  <button type="button" onClick={() => setStatusFilter('all')} className="hover:opacity-75 font-bold cursor-pointer">×</button>
                </span>
              )}

              {searchQuery.trim() !== '' && (
                <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold flex items-center gap-1">
                  {t('filters.search', 'Search')}: "{searchQuery}"
                  <button type="button" onClick={() => setSearchQuery('')} className="hover:opacity-75 font-bold cursor-pointer">×</button>
                </span>
              )}

              <button
                type="button"
                onClick={() => {
                  setSelectedLevel('all');
                  setSelectedCategory('all');
                  setStatusFilter('all');
                  setSearchQuery('');
                }}
                className="text-[11px] font-bold text-[#9CA3AF] hover:text-[#DC2626] underline ml-auto cursor-pointer"
              >
                {t('filters.clearAll', 'Clear All Filters')}
              </button>
            </div>
          )}
        </div>
      </ScrollReveal>

      {/* Days Grid Cards with Staggered Scroll Reveal */}
      <ScrollReveal
        key={`grid-${selectedLevel}-${selectedCategory}-${statusFilter}-${searchQuery}-${language}`}
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
                className={`group relative rounded-2xl p-5 border cursor-pointer flex flex-col justify-between h-full transition-all ${
                  isCompleted
                    ? 'bg-[#22C55E]/5 dark:bg-[#22C55E]/10 border-[#22C55E]/30'
                    : 'bg-white dark:bg-[#161B22] border-slate-200 dark:border-[#30363D] hover:border-slate-300 dark:hover:border-[#DC2626]/40'
                }`}
              >
                <div className="space-y-3">
                  {/* Header info */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-slate-100 dark:bg-[#0D1117] text-slate-800 dark:text-[#D1D5DB] border border-slate-200 dark:border-[#30363D]">
                        {t('card.day', 'DAY')} {day.dayNumber}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${getLevelBadgeClass(day.level)}`}>
                        {day.level}
                      </span>
                    </div>

                    {isCompleted ? (
                      <span className="flex items-center gap-1 text-xs text-[#22C55E] font-bold bg-[#22C55E]/10 px-2.5 py-0.5 rounded-full border border-[#22C55E]/20">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{t('card.completed', 'Completed')}</span>
                      </span>
                    ) : (
                      <span className="text-[11px] text-[#9CA3AF] font-mono">
                        {day.durationMinutes} {t('common.minutes', 'mins')}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-slate-900 dark:text-[#F9FAFB] text-base group-hover:text-[#DC2626] dark:group-hover:text-[#EF4444] transition-colors leading-snug">
                    {day.title}
                  </h3>

                  {/* Summary */}
                  <p className="text-xs text-slate-500 dark:text-[#9CA3AF] line-clamp-2 leading-relaxed">
                    {day.summary}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {day.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-[#0D1117] text-slate-600 dark:text-[#9CA3AF] border border-slate-200 dark:border-[#30363D]/50"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Footer Progress */}
                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-[#30363D] flex items-center justify-between">
                  <div className="text-[11px] text-[#9CA3AF] font-mono">
                    {t('common.tasks', 'Tasks')}: <span className="text-slate-900 dark:text-[#F9FAFB] font-bold">{tasksCompleted}/{totalTasks}</span>
                  </div>

                  <div className="flex items-center gap-1 text-xs font-bold text-[#22C55E] group-hover:translate-x-0.5 transition-transform">
                    <span>{t('card.openLab', 'Open Lab')}</span>
                    <ChevronRight className="w-4 h-4 rtl:rotate-180" />
                  </div>
                </div>
              </MotionCard>
            </ScrollRevealItem>
          );
        })}
      </ScrollReveal>

      {filteredDays.length === 0 && (
        <div className="text-center py-16 bg-white dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] rounded-3xl p-8 space-y-3">
          <Terminal className="w-8 h-8 text-[#9CA3AF] mx-auto" />
          <h3 className="font-bold text-slate-900 dark:text-[#F9FAFB] text-base">No labs found matching criteria</h3>
          <p className="text-xs text-slate-500 dark:text-[#9CA3AF]">Try adjusting your search keywords or clearing filters.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedLevel('all');
              setSelectedCategory('all');
              setStatusFilter('all');
            }}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-[#0D1117] border border-slate-200 dark:border-[#30363D] text-xs font-bold text-slate-800 dark:text-[#F9FAFB] hover:border-[#DC2626] transition-colors cursor-pointer"
          >
            {t('filters.clearAll', 'Reset Filters')}
          </button>
        </div>
      )}
    </div>
  );
}

