import React from 'react';
import { motion } from 'motion/react';
import { Terminal, BookOpen, User, Github, Download, Code2, Award, Search, Keyboard } from 'lucide-react';
import { DarkModeToggle } from './DarkModeToggle';
import { LanguageSwitcher } from './LanguageSwitcher';
import { UserProgress } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface NavbarProps {
  activeTab: 'challenge' | 'playground' | 'blog' | 'about';
  setActiveTab: (tab: 'challenge' | 'playground' | 'blog' | 'about') => void;
  userProgress: UserProgress;
  onOpenExportModal: () => void;
  onOpenCommandPalette: () => void;
  onOpenShortcutsModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  userProgress,
  onOpenExportModal,
  onOpenCommandPalette,
  onOpenShortcutsModal
}) => {
  const { t } = useLanguage();
  const completedDaysCount = userProgress?.completedDays?.length || 0;

  const getRankBadge = () => {
    if (completedDaysCount >= 30) return { title: t('ranks.principal', 'Principal Architect'), color: 'bg-amber-500/10 text-amber-500 border-amber-500/20' };
    if (completedDaysCount >= 20) return { title: t('ranks.senior', 'Senior Infra'), color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' };
    if (completedDaysCount >= 10) return { title: t('ranks.mid', 'Mid SysAdmin'), color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' };
    return { title: t('ranks.junior', 'Junior Trainee'), color: 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20' };
  };

  const rank = getRankBadge();

  const navItems = [
    { id: 'challenge', label: t('nav.tabs.challenge', '30-Day Labs'), icon: Terminal },
    { id: 'playground', label: t('nav.tabs.playground', 'CLI Terminal'), icon: Code2 },
    { id: 'blog', label: t('nav.tabs.blog', 'Tutorials'), icon: BookOpen },
    { id: 'about', label: t('nav.tabs.about', 'About'), icon: User }
  ] as const;

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="sticky top-0 z-40 bg-white/80 dark:bg-[#050505]/90 backdrop-blur-xl border-b border-slate-200 dark:border-[#30363D] transition-colors"
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px]">
          {/* Brand & Rank */}
          <div className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group min-w-0" onClick={() => setActiveTab('challenge')}>
            <div className="w-9 h-9 rounded-2xl bg-slate-100 dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] flex items-center justify-center text-[#DC2626] group-hover:border-[#DC2626]/50 group-hover:shadow-[0_0_20px_rgba(220,38,38,0.2)] transition-all shrink-0">
              <Terminal className="w-4 h-4 text-[#DC2626] stroke-[2.2]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 dark:text-[#F9FAFB] text-xs sm:text-sm tracking-tight group-hover:text-red-500 transition-colors truncate">
                  {t('nav.brandTitle', 'Linux Admin Challenge')}
                </span>
                <span className="hidden md:inline-block px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-[#DC2626]/10 text-[#EF4444] border border-[#DC2626]/20 shrink-0">
                  {t('nav.brandBadge', '30-Day Labs')}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-[#9CA3AF] hidden sm:block font-mono truncate">
                {t('nav.brandSubtitle', 'Production SysAdmin Curriculum')}
              </p>
            </div>
          </div>

          {/* Animated Nav Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100 dark:bg-[#0D1117] p-1 rounded-2xl border border-slate-200 dark:border-[#30363D] text-xs font-medium relative">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition-colors z-10 ${
                    isActive
                      ? 'text-[#22C55E] font-semibold'
                      : 'text-slate-600 dark:text-[#9CA3AF] hover:text-slate-900 dark:hover:text-[#F9FAFB]'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTabPill"
                      className="absolute inset-0 bg-white dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] rounded-xl shadow-xs -z-10"
                      transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                    />
                  )}
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Command Palette Trigger */}
            <button
              onClick={onOpenCommandPalette}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/[0.08] bg-slate-100 dark:bg-[#111113] text-slate-600 dark:text-[#A1A1AA] hover:text-slate-900 dark:hover:text-[#FAFAFA] hover:border-slate-300 dark:hover:border-white/20 transition-all text-xs font-mono group"
              title={t('nav.searchTooltip', 'Search Labs & Commands (⌘K)')}
              aria-label={t('nav.searchTooltip', 'Search Labs & Commands (⌘K)')}
            >
              <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-500 transition-colors" />
              <span className="hidden sm:inline">{t('common.search', 'Search')}</span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] bg-slate-200 dark:bg-white/10 rounded border border-slate-300 dark:border-white/10 text-slate-500 dark:text-slate-400">
                ⌘K
              </kbd>
            </button>

            {/* Keyboard Shortcuts Trigger */}
            {onOpenShortcutsModal && (
              <button
                onClick={onOpenShortcutsModal}
                className="p-2 rounded-xl border border-slate-200 dark:border-white/[0.06] bg-slate-100 dark:bg-[#111113] text-slate-700 dark:text-[#A1A1AA] hover:text-slate-900 dark:hover:text-[#FAFAFA] hover:bg-slate-200 dark:hover:bg-[#1F1F23] transition-all min-h-[38px] min-w-[38px] flex items-center justify-center"
                title={t('nav.shortcutsTooltip', 'Keyboard Shortcuts (?)')}
                aria-label={t('nav.shortcutsTooltip', 'Keyboard Shortcuts (?)')}
              >
                <Keyboard className="w-4 h-4" />
              </button>
            )}

            {/* Rank Pill */}
            <div className={`hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-xl border text-[11px] font-mono font-medium ${rank.color}`}>
              <Award className="w-3.5 h-3.5" />
              <span>{completedDaysCount}/30 {t('common.days', 'Days')}</span>
            </div>

            {/* Progress Export */}
            <button
              onClick={onOpenExportModal}
              className="p-2 rounded-xl border border-slate-200 dark:border-white/[0.06] bg-slate-100 dark:bg-[#111113] text-slate-700 dark:text-[#A1A1AA] hover:text-slate-900 dark:hover:text-[#FAFAFA] hover:bg-slate-200 dark:hover:bg-[#1F1F23] transition-all min-h-[38px] min-w-[38px] flex items-center justify-center"
              title={t('nav.exportTooltip', 'Export / Sync Progress')}
              aria-label={t('nav.exportTooltip', 'Export / Sync Progress')}
            >
              <Download className="w-4 h-4" />
            </button>

            {/* Dark Mode Toggle */}
            <DarkModeToggle />

            {/* GitHub Repo */}
            <a
              href="https://github.com/ahmedmediaworkx/linux-sysadmin-30-day-challenge"
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-xl border border-slate-200 dark:border-white/[0.06] bg-slate-100 dark:bg-[#111113] text-slate-700 dark:text-[#A1A1AA] hover:text-slate-900 dark:hover:text-[#FAFAFA] hover:bg-slate-200 dark:hover:bg-[#1F1F23] transition-all min-h-[38px] min-w-[38px] flex items-center justify-center"
              title={t('nav.githubTooltip', 'View Open-Source Repository on GitHub')}
              aria-label={t('nav.githubTooltip', 'View Open-Source Repository on GitHub')}
            >
              <Github className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Mobile Navigation Tabs */}
        <div className="md:hidden flex items-center gap-1.5 py-2 border-t border-slate-200 dark:border-white/[0.06] text-xs font-medium overflow-x-auto no-scrollbar scroll-smooth whitespace-nowrap px-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3 py-2 rounded-xl transition-all shrink-0 flex items-center gap-1.5 min-h-[40px] touch-manipulation ${
                  isActive
                    ? 'text-[#22C55E] font-bold bg-[#22C55E]/10 border border-[#22C55E]/20'
                    : 'text-slate-600 dark:text-[#A1A1AA] hover:text-slate-900 dark:hover:text-[#FAFAFA]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </motion.header>
  );
};
