import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Navbar } from './components/Navbar';
import { ChallengeView } from './components/ChallengeView';
import { TerminalSimulator } from './components/TerminalSimulator';
import { CommandTools } from './components/CommandTools';
import { BlogView } from './components/BlogView';
import { AboutView } from './components/AboutView';
import { DayDetailModal } from './components/DayDetailModal';
import { ProgressExporter } from './components/ProgressExporter';
import { CommandPalette } from './components/CommandPalette';
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal';
import { DayChallenge, UserProgress } from './types';
import { DAYS_DATA } from './data/daysData';
import { useTheme } from './context/ThemeContext';

const STORAGE_KEY = 'linux_sysadmin_challenge_progress_v1';

const defaultProgress: UserProgress = {
  completedDays: [],
  completedTasks: {},
  personalNotes: {},
  preferredLabEnv: 'docker',
  streakCount: 1,
  lastActiveDate: new Date().toISOString().slice(0, 10),
  bookmarkedBlogs: [],
  activityLog: {
    [new Date().toISOString().slice(0, 10)]: 2
  }
};

// Calculate max unlocked day number (Day 1 is unlocked by default; completing Day N unlocks Day N+1)
const getUnlockedDayNumber = (completedDays: string[]) => {
  let maxUnlocked = 1;
  DAYS_DATA.forEach((d) => {
    if (completedDays.includes(d.id) && d.dayNumber < 30) {
      maxUnlocked = Math.max(maxUnlocked, d.dayNumber + 1);
    }
  });
  return maxUnlocked;
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'challenge' | 'playground' | 'blog' | 'about'>('challenge');
  const [selectedDay, setSelectedDay] = useState<DayChallenge | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);
  const [terminalCommand, setTerminalCommand] = useState<string | undefined>(undefined);
  const { setTheme, resolvedTheme } = useTheme();

  const [userProgress, setUserProgress] = useState<UserProgress>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Calculate streak
        const today = new Date().toISOString().slice(0, 10);
        if (parsed.lastActiveDate !== today) {
          parsed.streakCount = (parsed.streakCount || 0) + 1;
          parsed.lastActiveDate = today;
        }
        return { ...defaultProgress, ...parsed };
      }
    } catch (err) {
      console.error('Error loading user progress', err);
    }
    return defaultProgress;
  });

  const isInitialMount = useRef(true);
  const prevUnlockedRef = useRef<number>(getUnlockedDayNumber(userProgress.completedDays));

  // Global Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 1. Command Palette: ⌘K / Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
        return;
      }

      // Check if user is active in an editable input element
      const target = e.target as HTMLElement | null;
      const isTyping =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable);

      // Escape key handles overlay closing
      if (e.key === 'Escape') {
        if (isCommandPaletteOpen) {
          setIsCommandPaletteOpen(false);
          return;
        }
        if (isShortcutsModalOpen) {
          setIsShortcutsModalOpen(false);
          return;
        }
        if (isExportModalOpen) {
          setIsExportModalOpen(false);
          return;
        }
        if (selectedDay) {
          setSelectedDay(null);
          return;
        }
      }

      if (isTyping) return;

      // 2. Toggle Shortcuts modal with ? or Shift+/
      if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        e.preventDefault();
        setIsShortcutsModalOpen((prev) => !prev);
        return;
      }

      // 3. Tab Navigation: Alt+1, Alt+2, Alt+3, Alt+4
      if (e.altKey) {
        if (e.key === '1') {
          e.preventDefault();
          setActiveTab('challenge');
          return;
        }
        if (e.key === '2') {
          e.preventDefault();
          setActiveTab('playground');
          return;
        }
        if (e.key === '3') {
          e.preventDefault();
          setActiveTab('blog');
          return;
        }
        if (e.key === '4') {
          e.preventDefault();
          setActiveTab('about');
          return;
        }
      }

      // 4. Toggle theme with Alt+T
      if (e.altKey && e.key.toLowerCase() === 't') {
        e.preventDefault();
        setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
        return;
      }

      // 5. Day navigation with '[' and ']'
      if (e.key === '[') {
        e.preventDefault();
        setSelectedDay((current) => {
          const activeDayNum = current ? current.dayNumber : 1;
          const prevDay = DAYS_DATA.find((d) => d.dayNumber === Math.max(1, activeDayNum - 1));
          return prevDay || current;
        });
        return;
      }

      if (e.key === ']') {
        e.preventDefault();
        setSelectedDay((current) => {
          const activeDayNum = current ? current.dayNumber : 1;
          const nextDay = DAYS_DATA.find((d) => d.dayNumber === Math.min(30, activeDayNum + 1));
          return nextDay || current;
        });
        return;
      }

      // 6. Toggle day complete with 'c' or 'C'
      if (e.key.toLowerCase() === 'c' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        if (selectedDay) {
          handleToggleDayComplete(selectedDay.id);
        } else {
          const firstDay = DAYS_DATA[0];
          if (firstDay) handleToggleDayComplete(firstDay.id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    isCommandPaletteOpen,
    isShortcutsModalOpen,
    isExportModalOpen,
    selectedDay,
    resolvedTheme,
    setTheme
  ]);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userProgress));

      if (isInitialMount.current) {
        isInitialMount.current = false;
        return;
      }

      const currentUnlocked = getUnlockedDayNumber(userProgress.completedDays);
      if (currentUnlocked > prevUnlockedRef.current) {
        prevUnlockedRef.current = currentUnlocked;
      }
    } catch (err) {
      console.error('Error saving user progress', err);
    }
  }, [userProgress]);

  const handleToggleTask = (dayId: string, taskId: string) => {
    setUserProgress((prev) => {
      const currentTasks = prev.completedTasks[dayId] || [];
      const isTaskDone = currentTasks.includes(taskId);
      const updatedTasks = isTaskDone
        ? currentTasks.filter((id) => id !== taskId)
        : [...currentTasks, taskId];

      const today = new Date().toISOString().slice(0, 10);
      const currentLog = prev.activityLog || {};
      const todayCount = currentLog[today] || 0;
      const updatedTodayCount = isTaskDone ? Math.max(0, todayCount - 1) : todayCount + 1;

      return {
        ...prev,
        completedTasks: {
          ...prev.completedTasks,
          [dayId]: updatedTasks
        },
        activityLog: {
          ...currentLog,
          [today]: updatedTodayCount
        }
      };
    });
  };

  const handleToggleDayComplete = (dayId: string) => {
    setUserProgress((prev) => {
      const isDone = prev.completedDays.includes(dayId);
      const updatedDays = isDone
        ? prev.completedDays.filter((id) => id !== dayId)
        : [...prev.completedDays, dayId];

      const today = new Date().toISOString().slice(0, 10);
      const currentLog = prev.activityLog || {};
      const todayCount = currentLog[today] || 0;
      const updatedTodayCount = isDone ? Math.max(0, todayCount - 3) : todayCount + 3;

      return {
        ...prev,
        completedDays: updatedDays,
        activityLog: {
          ...currentLog,
          [today]: updatedTodayCount
        }
      };
    });
  };

  const handleSaveNotes = (dayId: string, notes: string) => {
    setUserProgress((prev) => ({
      ...prev,
      personalNotes: {
        ...prev.personalNotes,
        [dayId]: notes
      }
    }));
  };

  const handleRunTerminalCommand = (cmd: string) => {
    setTerminalCommand(cmd);
    setActiveTab('playground');
  };

  const handleImportProgress = (imported: UserProgress) => {
    setUserProgress(imported);
  };

  const handleResetProgress = () => {
    setUserProgress(defaultProgress);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#09090B] text-slate-900 dark:text-[#FAFAFA] transition-colors flex flex-col font-sans relative selection:bg-[#22C55E]/20 selection:text-[#22C55E]">
      {/* Background radial glow & grid mesh */}
      <div className="fixed inset-0 bg-grid-pattern pointer-events-none opacity-20 dark:opacity-40 z-0" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-[#22C55E]/[0.08] via-[#22D3EE]/[0.03] to-transparent blur-3xl pointer-events-none z-0" />

      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userProgress={userProgress}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onOpenShortcutsModal={() => setIsShortcutsModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <AnimatePresence mode="wait">
          {activeTab === 'challenge' && (
            <motion.div
              key="challenge"
              initial={{ opacity: 0, y: 15, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.99 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <ChallengeView
                userProgress={userProgress}
                onSelectDay={(day) => setSelectedDay(day)}
                onSelectTab={setActiveTab}
              />
            </motion.div>
          )}

          {activeTab === 'playground' && (
            <motion.div
              key="playground"
              initial={{ opacity: 0, y: 15, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.99 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-8 pb-12"
            >
              <div className="bg-white dark:bg-[#111113] border border-slate-200 dark:border-white/[0.06] rounded-[24px] p-6 text-slate-900 dark:text-[#FAFAFA] shadow-xl space-y-2">
                <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
                  <span>Interactive Terminal Workstation & SysAdmin Tools</span>
                </h1>
                <p className="text-xs text-slate-500 dark:text-[#A1A1AA] font-mono">
                  Real-time browser shell execution environment with system config generators and live CLI output.
                </p>
              </div>

              {/* Terminal Simulator */}
              <TerminalSimulator initialCommand={terminalCommand} />

              {/* Quick Command Generators */}
              <CommandTools />
            </motion.div>
          )}

          {activeTab === 'blog' && (
            <motion.div
              key="blog"
              initial={{ opacity: 0, y: 15, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.99 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <BlogView />
            </motion.div>
          )}

          {activeTab === 'about' && (
            <motion.div
              key="about"
              initial={{ opacity: 0, y: 15, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.99 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <AboutView />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Day Detail Lab Modal */}
      {selectedDay && (
        <DayDetailModal
          day={selectedDay}
          userProgress={userProgress}
          onToggleTask={handleToggleTask}
          onToggleDayComplete={handleToggleDayComplete}
          onSaveNotes={handleSaveNotes}
          onRunTerminalCommand={handleRunTerminalCommand}
          onClose={() => setSelectedDay(null)}
        />
      )}

      {/* Command Palette (⌘K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectDay={(day) => {
          setSelectedDay(day);
          setActiveTab('challenge');
        }}
        onSelectTab={setActiveTab}
        onNavigateTab={setActiveTab}
        onRunCommand={handleRunTerminalCommand}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        userProgressCompletedDays={userProgress?.completedDays || []}
      />

      {/* Progress Sync & Export Modal */}
      {isExportModalOpen && (
        <ProgressExporter
          userProgress={userProgress}
          onImportProgress={handleImportProgress}
          onResetProgress={handleResetProgress}
          onClose={() => setIsExportModalOpen(false)}
        />
      )}

      {/* Keyboard Shortcuts Help Modal */}
      <KeyboardShortcutsModal
        isOpen={isShortcutsModalOpen}
        onClose={() => setIsShortcutsModalOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-white/[0.06] bg-slate-100 dark:bg-[#09090B] py-8 text-center text-xs text-slate-600 dark:text-[#A1A1AA] relative z-10 transition-colors">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono">
          <p>
            Designed & Built for <span className="font-semibold text-slate-900 dark:text-[#FAFAFA]">Linux Admin Academy</span> • Cloud & DevOps Platform
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px]">
            <button
              onClick={() => setIsShortcutsModalOpen(true)}
              className="text-[#22C55E] hover:underline font-semibold flex items-center gap-1"
            >
              Shortcuts <kbd className="px-1 py-0.2 bg-slate-200 dark:bg-white/10 rounded border border-slate-300 dark:border-white/10 text-[10px]">?</kbd>
            </button>
            <span>•</span>
            <span>100% Open-Source Curriculum</span>
            <span>•</span>
            <a
              href="https://github.com/ahmedmediaworkx/linux-sysadmin-30-day-challenge"
              target="_blank"
              rel="noreferrer"
              className="text-[#22C55E] hover:underline font-semibold"
            >
              GitHub Repository
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
