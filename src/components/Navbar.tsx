import React from 'react';
import { motion } from 'motion/react';
import { Terminal, BookOpen, User, Github, Download, Sparkles, Code2, Award, Search, Keyboard } from 'lucide-react';
import { DarkModeToggle } from './DarkModeToggle';
import { UserProgress } from '../types';

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
  const completedDaysCount = userProgress?.completedDays?.length || 0;

  const getRankBadge = () => {
    if (completedDaysCount >= 30) return { title: 'Principal Architect', color: 'bg-amber-500/10 text-amber-500 border-amber-500/20' };
    if (completedDaysCount >= 20) return { title: 'Senior Engineer', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' };
    if (completedDaysCount >= 10) return { title: 'Mid Systems Admin', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' };
    return { title: 'Junior Trainee', color: 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20' };
  };

  const rank = getRankBadge();

  const navItems = [
    { id: 'challenge', label: '30-Day Labs', icon: Terminal },
    { id: 'playground', label: 'CLI Terminal', icon: Code2 },
    { id: 'blog', label: 'Tutorials', icon: BookOpen },
    { id: 'about', label: 'About', icon: User }
  ] as const;

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="sticky top-0 z-40 bg-white/80 dark:bg-[#09090B]/85 backdrop-blur-xl border-b border-slate-200 dark:border-white/[0.06] transition-colors"
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Rank */}
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setActiveTab('challenge')}>
            <div className="w-9 h-9 rounded-2xl bg-slate-100 dark:bg-[#111113] border border-slate-200 dark:border-white/[0.08] flex items-center justify-center text-[#22C55E] group-hover:border-[#22C55E]/40 group-hover:shadow-[0_0_20px_rgba(34,197,94,0.15)] transition-all">
              <Terminal className="w-4 h-4 text-[#22C55E] stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 dark:text-[#FAFAFA] text-sm tracking-tight group-hover:text-emerald-600 dark:group-hover:text-white transition-colors">
                  Linux Admin Academy
                </span>
                <span className="hidden md:inline-block px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/20">
                  30-Day Labs
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-[#A1A1AA] hidden sm:block font-mono">
                Workstation & Systems Curriculum
              </p>
            </div>
          </div>

          {/* Animated Nav Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100 dark:bg-[#111113] p-1 rounded-2xl border border-slate-200 dark:border-white/[0.06] text-xs font-medium relative">
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
                      : 'text-slate-600 dark:text-[#A1A1AA] hover:text-slate-900 dark:hover:text-[#FAFAFA]'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTabPill"
                      className="absolute inset-0 bg-white dark:bg-[#1F1F23] border border-slate-200 dark:border-white/[0.08] rounded-xl shadow-xs -z-10"
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
            {/* Command Palette Trigger */}
            <button
              onClick={onOpenCommandPalette}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/[0.08] bg-slate-100 dark:bg-[#111113] text-slate-600 dark:text-[#A1A1AA] hover:text-slate-900 dark:hover:text-[#FAFAFA] hover:border-slate-300 dark:hover:border-white/20 transition-all text-xs font-mono group"
              title="Open Command Palette (⌘K)"
            >
              <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-500 transition-colors" />
              <span className="hidden sm:inline">Search</span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] bg-slate-200 dark:bg-white/10 rounded border border-slate-300 dark:border-white/10 text-slate-500 dark:text-slate-400">
                ⌘K
              </kbd>
            </button>

            {/* Keyboard Shortcuts Trigger */}
            {onOpenShortcutsModal && (
              <button
                onClick={onOpenShortcutsModal}
                className="p-2 rounded-xl border border-slate-200 dark:border-white/[0.06] bg-slate-100 dark:bg-[#111113] text-slate-700 dark:text-[#A1A1AA] hover:text-slate-900 dark:hover:text-[#FAFAFA] hover:bg-slate-200 dark:hover:bg-[#1F1F23] transition-all min-h-[38px] min-w-[38px] flex items-center justify-center"
                title="Keyboard Shortcuts Cheat Sheet (?)"
              >
                <Keyboard className="w-4 h-4" />
              </button>
            )}

            {/* Rank Pill */}
            <div className={`hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-xl border text-[11px] font-mono font-medium ${rank.color}`}>
              <Award className="w-3.5 h-3.5" />
              <span>{completedDaysCount}/30 Days</span>
            </div>

            {/* Progress Export */}
            <button
              onClick={onOpenExportModal}
              className="p-2 rounded-xl border border-slate-200 dark:border-white/[0.06] bg-slate-100 dark:bg-[#111113] text-slate-700 dark:text-[#A1A1AA] hover:text-slate-900 dark:hover:text-[#FAFAFA] hover:bg-slate-200 dark:hover:bg-[#1F1F23] transition-all min-h-[38px] min-w-[38px] flex items-center justify-center"
              title="Export / Sync Progress"
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
              title="View Open-Source Repository on GitHub"
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
