import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Keyboard, X, Command, Terminal, Sparkles, Navigation, Layers, Moon } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ShortcutItem {
  keys: string[];
  label: string;
  category: 'Navigation' | 'Controls' | 'Lab & Challenge';
  description?: string;
}

const SHORTCUTS: ShortcutItem[] = [
  {
    keys: ['⌘', 'K'],
    label: 'Open Command Palette & Global Search',
    category: 'Navigation',
    description: 'Quickly find any lesson, document, or system command'
  },
  {
    keys: ['Shift', '?'],
    label: 'Show Keyboard Shortcuts Cheat Sheet',
    category: 'Navigation',
    description: 'Toggle this overlay from anywhere'
  },
  {
    keys: ['Alt', '1'],
    label: 'Go to 30-Day Challenge',
    category: 'Navigation'
  },
  {
    keys: ['Alt', '2'],
    label: 'Go to Interactive Terminal Lab',
    category: 'Navigation'
  },
  {
    keys: ['Alt', '3'],
    label: 'Go to Technical Knowledge Base',
    category: 'Navigation'
  },
  {
    keys: ['Alt', '4'],
    label: 'Go to Community & About Page',
    category: 'Navigation'
  },
  {
    keys: ['Alt', 'T'],
    label: 'Toggle Dark / Light Mode Theme',
    category: 'Controls'
  },
  {
    keys: ['Esc'],
    label: 'Close Modal or Overlay',
    category: 'Controls'
  },
  {
    keys: ['['],
    label: 'Previous Day Challenge',
    category: 'Lab & Challenge',
    description: 'Navigate backwards through curriculum days'
  },
  {
    keys: [']'],
    label: 'Next Day Challenge',
    category: 'Lab & Challenge',
    description: 'Navigate forwards through curriculum days'
  },
  {
    keys: ['C'],
    label: 'Toggle Mark Day Complete',
    category: 'Lab & Challenge',
    description: 'Quickly record or unmark day completion status'
  }
];

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const categories: Array<'Navigation' | 'Controls' | 'Lab & Challenge'> = [
    'Navigation',
    'Lab & Challenge',
    'Controls'
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-2xl bg-white dark:bg-[#111113] border border-slate-200 dark:border-white/[0.08] rounded-3xl shadow-2xl overflow-hidden z-10 text-slate-900 dark:text-slate-100 my-auto"
        >
          {/* Top Banner Header */}
          <div className="p-6 sm:p-8 border-b border-slate-100 dark:border-white/[0.08] flex items-start justify-between gap-4 bg-slate-50/50 dark:bg-white/[0.02]">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/20">
                <Keyboard className="w-3.5 h-3.5" />
                <span>SysAdmin Hotkeys & Shortcuts</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Keyboard Shortcuts
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Navigate the 30-Day Linux Admin platform at full velocity using global keybindings.
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              title="Close (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content Body */}
          <div className="p-6 sm:p-8 space-y-6 max-h-[70vh] overflow-y-auto">
            {categories.map((cat) => {
              const catShortcuts = SHORTCUTS.filter((s) => s.category === cat);
              return (
                <div key={cat} className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    {cat === 'Navigation' && <Navigation className="w-3.5 h-3.5 text-[#22C55E]" />}
                    {cat === 'Lab & Challenge' && <Terminal className="w-3.5 h-3.5 text-[#22C55E]" />}
                    {cat === 'Controls' && <Layers className="w-3.5 h-3.5 text-[#22C55E]" />}
                    <span>{cat}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {catShortcuts.map((item) => (
                      <div
                        key={item.label}
                        className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-white/10 flex items-center justify-between gap-3 group hover:border-[#22C55E]/40 transition-colors"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate group-hover:text-[#22C55E] transition-colors">
                            {item.label}
                          </p>
                          {item.description && (
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                              {item.description}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-1 shrink-0 font-mono">
                          {item.keys.map((k, idx) => (
                            <React.Fragment key={idx}>
                              <kbd className="px-2 py-1 text-[11px] font-bold rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 shadow-xs min-w-[24px] text-center">
                                {k}
                              </kbd>
                              {idx < item.keys.length - 1 && (
                                <span className="text-[10px] text-slate-400">+</span>
                              )}
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer note */}
          <div className="p-4 sm:p-6 border-t border-slate-100 dark:border-white/[0.08] bg-slate-50/50 dark:bg-white/[0.02] flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5 font-mono text-[11px]">
              <Sparkles className="w-3.5 h-3.5 text-[#22C55E]" />
              ProTip: Keyboard shortcuts automatically disable while typing in input fields.
            </span>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#22C55E] text-slate-950 font-bold text-xs hover:bg-[#1ea34d] transition-colors shadow-md shadow-[#22C55E]/20"
            >
              Got it
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
