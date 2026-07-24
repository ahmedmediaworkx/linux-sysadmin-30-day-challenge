import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { useLanguage, Language } from '../context/LanguageContext';

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage, isRTL, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard navigation escape
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') setIsOpen(false);
  };

  const languages: { id: Language; label: string; flag: string; nativeName: string }[] = [
    { id: 'en', label: 'English', flag: '🇺🇸', nativeName: 'English' },
    { id: 'ar-EG', label: 'العربية (مصر)', flag: '🇪🇬', nativeName: 'العربية المصرية' }
  ];

  const currentLangObj = languages.find((l) => l.id === language) || languages[0];

  return (
    <div className="relative inline-block text-left" ref={containerRef} onKeyDown={handleKeyDown}>
      {/* Desktop & Tablet Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={t('common.selectLanguage', 'Select Language')}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/[0.08] bg-slate-100 dark:bg-[#111113] hover:bg-slate-200 dark:hover:bg-[#1A1A1E] text-slate-800 dark:text-[#FAFAFA] font-medium text-xs transition-all shadow-2xs cursor-pointer min-h-[38px]"
      >
        <Globe className="w-3.5 h-3.5 text-[#22C55E] shrink-0" />
        <span className="flex items-center gap-1.5">
          <span className="text-sm leading-none">{currentLangObj.flag}</span>
          <span className="hidden sm:inline font-semibold">{currentLangObj.nativeName}</span>
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            role="listbox"
            className={`absolute top-full mt-2 w-48 z-50 rounded-2xl bg-white dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] shadow-2xl p-1.5 overflow-hidden backdrop-blur-xl ${
              isRTL ? 'left-0' : 'right-0'
            }`}
          >
            <div className="px-2.5 py-1.5 text-[10px] font-bold text-slate-400 dark:text-[#9CA3AF] uppercase tracking-wider border-b border-slate-100 dark:border-[#30363D]">
              {t('common.selectLanguage', 'Select Language')}
            </div>

            <div className="pt-1 space-y-0.5">
              {languages.map((lang) => {
                const isSelected = language === lang.id;
                return (
                  <button
                    key={lang.id}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      setLanguage(lang.id);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#22C55E]/10 text-[#22C55E] dark:text-[#22C55E] border border-[#22C55E]/20'
                        : 'text-slate-700 dark:text-[#D1D5DB] hover:bg-slate-100 dark:hover:bg-[#21262D] hover:text-slate-900 dark:hover:text-[#F9FAFB]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base leading-none">{lang.flag}</span>
                      <span>{lang.nativeName}</span>
                    </div>

                    {isSelected && <Check className="w-3.5 h-3.5 text-[#22C55E]" />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
