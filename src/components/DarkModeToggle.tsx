import React, { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Monitor, ChevronDown } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export function DarkModeToggle() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getIcon = () => {
    if (theme === 'dark') return <Moon className="w-3.5 h-3.5 text-amber-400" />;
    if (theme === 'light') return <Sun className="w-3.5 h-3.5 text-amber-500" />;
    return <Monitor className="w-3.5 h-3.5 text-blue-400" />;
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        id="theme-toggle-btn"
        title={`Theme Mode: ${theme.toUpperCase()}`}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-mono font-medium border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#111113] text-slate-800 dark:text-[#FAFAFA] hover:bg-slate-100 dark:hover:bg-[#1F1F23] transition-all min-h-[38px]"
      >
        {getIcon()}
        <span className="capitalize hidden sm:inline">{theme}</span>
        <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-36 rounded-2xl border border-slate-200 dark:border-white/[0.1] bg-white dark:bg-[#111113] p-1.5 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
          <button
            onClick={() => { setTheme('light'); setIsOpen(false); }}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-mono transition-colors ${
              theme === 'light'
                ? 'bg-slate-100 dark:bg-white/10 font-bold text-amber-600 dark:text-amber-400'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/[0.05]'
            }`}
          >
            <Sun className="w-3.5 h-3.5 text-amber-500" />
            <span>Light</span>
          </button>

          <button
            onClick={() => { setTheme('dark'); setIsOpen(false); }}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-mono transition-colors ${
              theme === 'dark'
                ? 'bg-slate-100 dark:bg-white/10 font-bold text-amber-400'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/[0.05]'
            }`}
          >
            <Moon className="w-3.5 h-3.5 text-amber-400" />
            <span>Dark</span>
          </button>

          <button
            onClick={() => { setTheme('system'); setIsOpen(false); }}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-mono transition-colors ${
              theme === 'system'
                ? 'bg-slate-100 dark:bg-white/10 font-bold text-blue-400'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/[0.05]'
            }`}
          >
            <Monitor className="w-3.5 h-3.5 text-blue-400" />
            <span>System</span>
          </button>
        </div>
      )}
    </div>
  );
}

