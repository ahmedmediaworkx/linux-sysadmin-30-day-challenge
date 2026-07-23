import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Terminal,
  Calculator,
  BookOpen,
  User,
  X,
  Sparkles,
  ChevronRight,
  Sun,
  Moon,
  Monitor,
  CheckCircle2,
  Lock,
  Download,
  Layers
} from 'lucide-react';
import { DAYS_DATA } from '../data/daysData';
import { BLOG_POSTS } from '../data/blogData';
import { DayChallenge } from '../types';
import { useTheme } from '../context/ThemeContext';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDay: (day: DayChallenge) => void;
  onSelectTab?: (tab: 'challenge' | 'playground' | 'blog' | 'about') => void;
  onNavigateTab?: (tab: 'challenge' | 'playground' | 'blog' | 'about') => void;
  onRunCommand?: (cmd: string) => void;
  onOpenExportModal?: () => void;
  userProgressCompletedDays?: string[];
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectDay,
  onSelectTab,
  onNavigateTab,
  onRunCommand,
  onOpenExportModal,
  userProgressCompletedDays = []
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { setTheme } = useTheme();

  const navigate = (tab: 'challenge' | 'playground' | 'blog' | 'about') => {
    if (onNavigateTab) onNavigateTab(tab);
    else if (onSelectTab) onSelectTab(tab);
  };

  // Reset query on open
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Global Keyboard listener for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open handled by parent or state
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Search Items
  const dayResults = DAYS_DATA.filter((d) =>
    d.title.toLowerCase().includes(query.toLowerCase()) ||
    d.category.toLowerCase().includes(query.toLowerCase()) ||
    d.summary.toLowerCase().includes(query.toLowerCase()) ||
    d.dayNumber.toString().includes(query)
  ).slice(0, 5);

  const commandResults = [
    { name: 'uname -a', desc: 'Display Linux Kernel System Info', cat: 'CLI Command' },
    { name: 'df -h', desc: 'Check Mounted Filesystem Disk Usage', cat: 'CLI Command' },
    { name: 'free -m', desc: 'Display System RAM and Swap Memory', cat: 'CLI Command' },
    { name: 'ip a', desc: 'Inspect Network Interfaces and IP Addresses', cat: 'CLI Command' },
    { name: 'ss -tulnp', desc: 'List Active Listening TCP/UDP Ports', cat: 'CLI Command' },
    { name: 'systemctl status nginx', desc: 'Inspect Nginx Web Server Daemon Status', cat: 'CLI Command' },
    { name: 'journalctl -xe', desc: 'Query Recent Systemd Service Error Logs', cat: 'CLI Command' }
  ].filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    c.desc.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 4);

  const blogResults = BLOG_POSTS.filter((b) =>
    b.title.toLowerCase().includes(query.toLowerCase()) ||
    b.excerpt.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 3);

  const actionResults = [
    { id: 'tab-challenge', title: 'Go to 30-Day Challenge Grid', icon: Layers, action: () => { navigate('challenge'); onClose(); } },
    { id: 'tab-playground', title: 'Open Interactive Terminal & Config Tools', icon: Terminal, action: () => { navigate('playground'); onClose(); } },
    { id: 'tab-blog', title: 'Read SysAdmin Architecture Articles', icon: BookOpen, action: () => { navigate('blog'); onClose(); } },
    { id: 'tab-about', title: 'View Author & Curriculum Details', icon: User, action: () => { navigate('about'); onClose(); } },
    { id: 'action-export', title: 'Export / Sync Local Storage Progress', icon: Download, action: () => { if (onOpenExportModal) onOpenExportModal(); onClose(); } },
    { id: 'theme-light', title: 'Switch Theme to Light Mode', icon: Sun, action: () => { setTheme('light'); onClose(); } },
    { id: 'theme-dark', title: 'Switch Theme to Dark Mode', icon: Moon, action: () => { setTheme('dark'); onClose(); } },
    { id: 'theme-system', title: 'Switch Theme to System Preference', icon: Monitor, action: () => { setTheme('system'); onClose(); } }
  ].filter((a) => a.title.toLowerCase().includes(query.toLowerCase()));

  const totalResultsCount = dayResults.length + commandResults.length + blogResults.length + actionResults.length;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/70 backdrop-blur-md">
        {/* Backdrop click */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0"
          onClick={onClose}
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ type: 'spring', stiffness: 450, damping: 30 }}
          className="relative z-10 w-full max-w-2xl bg-white dark:bg-[#111113] border border-slate-200 dark:border-white/[0.1] rounded-2xl shadow-2xl overflow-hidden font-sans"
        >
          {/* Search Header */}
          <div className="flex items-center px-4 border-b border-slate-200 dark:border-white/[0.08] bg-slate-50/50 dark:bg-[#18181B]/50">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type to search challenges, CLI commands, tools, or articles (e.g., Day 1, systemctl, nginx, theme)..."
              className="w-full px-3 py-3.5 bg-transparent border-none text-slate-900 dark:text-[#FAFAFA] text-sm focus:outline-none placeholder-slate-400 font-sans"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 ml-2 text-[10px] font-mono font-medium text-slate-400 bg-slate-200 dark:bg-white/10 rounded border border-slate-300 dark:border-white/10">
              ESC
            </kbd>
          </div>

          {/* Search Results List */}
          <div className="max-h-[380px] overflow-y-auto p-2 space-y-4">
            {totalResultsCount === 0 ? (
              <div className="py-12 text-center text-slate-400 space-y-2">
                <Sparkles className="w-6 h-6 mx-auto text-slate-500" />
                <p className="text-xs font-mono">No matching results for "{query}"</p>
              </div>
            ) : (
              <>
                {/* Challenge Days */}
                {dayResults.length > 0 && (
                  <div>
                    <div className="px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      Challenge Labs ({dayResults.length})
                    </div>
                    <div className="space-y-0.5">
                      {dayResults.map((day) => {
                        const isDone = (userProgressCompletedDays || []).includes(day.id);
                        return (
                          <button
                            key={day.id}
                            onClick={() => {
                              onSelectDay(day);
                              onClose();
                            }}
                            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors group"
                          >
                            <div className="flex items-center gap-3">
                              <span className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-mono font-bold text-xs shrink-0">
                                D{day.dayNumber}
                              </span>
                              <div>
                                <h4 className="text-xs font-semibold text-slate-900 dark:text-[#FAFAFA] group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                  {day.title}
                                </h4>
                                <p className="text-[11px] text-slate-500 dark:text-[#A1A1AA] line-clamp-1">
                                  {day.category} • {day.durationMinutes} mins
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {isDone ? (
                                <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                                  <CheckCircle2 className="w-3 h-3" /> Done
                                </span>
                              ) : (
                                <ChevronRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Commands */}
                {commandResults.length > 0 && (
                  <div>
                    <div className="px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      Terminal Commands
                    </div>
                    <div className="space-y-0.5">
                      {commandResults.map((cmd, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            navigate('playground');
                            if (onRunCommand) onRunCommand(cmd.name);
                            onClose();
                          }}
                          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors group"
                        >
                          <div className="flex items-center gap-2.5">
                            <Terminal className="w-4 h-4 text-emerald-500 shrink-0" />
                            <code className="text-xs font-mono font-bold text-slate-900 dark:text-slate-100 group-hover:text-emerald-500">
                              {cmd.name}
                            </code>
                            <span className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:inline">
                              • {cmd.desc}
                            </span>
                          </div>
                          <span className="text-[10px] font-mono text-slate-400 bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded">
                            Run in Shell
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quick Actions */}
                {actionResults.length > 0 && (
                  <div>
                    <div className="px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      Quick Actions
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                      {actionResults.map((act) => {
                        const Icon = act.icon;
                        return (
                          <button
                            key={act.id}
                            onClick={act.action}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-left hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors group"
                          >
                            <Icon className="w-4 h-4 text-slate-500 dark:text-slate-400 group-hover:text-emerald-500 shrink-0" />
                            <span className="text-xs font-medium text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                              {act.title}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer Info */}
          <div className="px-4 py-2.5 border-t border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-[#18181B] text-[11px] font-mono text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
              <span>Raycast-style Command Palette</span>
            </span>
            <div className="flex items-center gap-2">
              <span>Press <kbd className="px-1 bg-slate-200 dark:bg-white/10 rounded">⌘K</kbd> anytime</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
