import React, { useState } from 'react';
import { X, CheckSquare, Square, Lightbulb, ShieldCheck, Terminal, BookOpen, AlertCircle, Sparkles, CheckCircle2, ExternalLink, Globe, Brain } from 'lucide-react';
import { DayChallenge, UserProgress } from '../types';
import { CodeBlock } from './CodeBlock';
import { triggerDayCompleteCelebration } from '../lib/utils';
import { QuickQuizModal } from './QuickQuizModal';

interface DayDetailModalProps {
  day: DayChallenge;
  userProgress: UserProgress;
  onToggleTask: (dayId: string, taskId: string) => void;
  onToggleDayComplete: (dayId: string) => void;
  onSaveNotes: (dayId: string, notes: string) => void;
  onRunTerminalCommand: (cmd: string) => void;
  onClose: () => void;
  onShowToast?: (title: string, description?: string, type?: 'success' | 'unlock' | 'info' | 'warning') => void;
}

export function DayDetailModal({
  day,
  userProgress,
  onToggleTask,
  onToggleDayComplete,
  onSaveNotes,
  onRunTerminalCommand,
  onClose,
  onShowToast
}: DayDetailModalProps) {
  const [openHintIds, setOpenHintIds] = useState<string[]>([]);
  const [notes, setNotes] = useState(() => userProgress.personalNotes[day.id] || '');
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [selectedEnv, setSelectedEnv] = useState<'docker' | 'multipass' | 'vagrant' | 'baremetal'>(
    userProgress.preferredLabEnv || 'docker'
  );

  const completedTasksForDay = userProgress.completedTasks[day.id] || [];
  const isDayCompleted = userProgress.completedDays.includes(day.id);

  const toggleHint = (hintId: string) => {
    setOpenHintIds((prev) =>
      prev.includes(hintId) ? prev.filter((id) => id !== hintId) : [...prev, hintId]
    );
  };

  const handleNotesChange = (val: string) => {
    setNotes(val);
    onSaveNotes(day.id, val);
  };

  const handleTaskClick = (taskId: string) => {
    const isDone = completedTasksForDay.includes(taskId);
    onToggleTask(day.id, taskId);
    if (!isDone && onShowToast) {
      onShowToast('Task Checklist Updated', 'Progress synced to local storage', 'success');
    }
  };

  const handleDayCompleteClick = () => {
    if (!isDayCompleted) {
      triggerDayCompleteCelebration();
      setShowQuizModal(true);
      if (onShowToast) {
        onShowToast(`Day ${day.dayNumber} Lab Completed!`, 'Streak & activity logged in local storage', 'success');
      }
    } else {
      if (onShowToast) {
        onShowToast(`Day ${day.dayNumber} Marked Pending`, 'Local progress updated', 'info');
      }
    }
    onToggleDayComplete(day.id);
  };


  const getEnvSetupSnippet = () => {
    if (selectedEnv === 'docker') {
      return day.labEnvironment.quickSetupCommand;
    } else if (selectedEnv === 'multipass') {
      return `multipass launch 24.04 --name lab-${day.id} && multipass shell lab-${day.id}`;
    } else if (selectedEnv === 'vagrant') {
      return `vagrant init ubuntu/noble64 && vagrant up && vagrant ssh`;
    } else {
      return `# Run commands directly on your local Ubuntu/Debian Linux VM or WSL2 instance`;
    }
  };

  const getLevelBadgeClass = (level: string) => {
    switch (level) {
      case 'junior':
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'mid':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'senior':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-4xl w-full p-5 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
        {/* Top Header */}
        <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                DAY {day.dayNumber}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase border ${getLevelBadgeClass(day.level)}`}>
                {day.level}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                {day.category}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                ~{day.durationMinutes} mins
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100">
              {day.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scenario Box */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800/80 space-y-1.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4" />
            <span>Real-World Scenario</span>
          </h4>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            {day.scenario}
          </p>
        </div>

        {/* Lab Environment Setup */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-emerald-500" />
              <span>Lab Environment Setup</span>
            </h3>

            {/* Selector */}
            <div className="flex gap-1 text-[11px] bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
              {(['docker', 'multipass', 'vagrant', 'baremetal'] as const).map((env) => (
                <button
                  key={env}
                  onClick={() => setSelectedEnv(env)}
                  className={`px-2 py-0.5 rounded capitalize ${
                    selectedEnv === env
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 font-bold shadow-xs'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  {env}
                </button>
              ))}
            </div>
          </div>

          <CodeBlock
            code={getEnvSetupSnippet()}
            title={`Spin up local lab (${selectedEnv})`}
            onRunInTerminal={onRunTerminalCommand}
          />
        </div>

        {/* Checkmark Tasks */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-emerald-500" />
              <span>Step-by-Step Hands-on Tasks ({completedTasksForDay.length}/{day.tasks.length})</span>
            </h3>

            <span className="text-xs font-mono font-semibold text-emerald-500">
              {Math.round((completedTasksForDay.length / day.tasks.length) * 100)}% Tasks Done
            </span>
          </div>

          <div className="space-y-3">
            {day.tasks.map((task, idx) => {
              const isTaskDone = completedTasksForDay.includes(task.id);
              return (
                <div
                  key={task.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    isTaskDone
                      ? 'bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/30'
                      : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => handleTaskClick(task.id)}
                      className="mt-0.5 text-emerald-500 hover:scale-110 transition-transform shrink-0"
                    >
                      {isTaskDone ? (
                        <CheckSquare className="w-5 h-5 fill-emerald-500/20" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-400" />
                      )}
                    </button>

                    <div className="flex-1 space-y-2">
                      <p className={`text-xs sm:text-sm font-medium ${isTaskDone ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-slate-100'}`}>
                        <span className="font-mono text-emerald-500 font-bold mr-1">{idx + 1}.</span> {task.text}
                      </p>

                      {task.codeSnippet && (
                        <CodeBlock
                          code={task.codeSnippet}
                          onRunInTerminal={onRunTerminalCommand}
                        />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Collapsible Hints */}
        {day.hints.length > 0 && (
          <div className="space-y-3 pt-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <span>Need Assistance? Reveal Hints</span>
            </h3>

            <div className="space-y-2">
              {day.hints.map((hint) => {
                const isOpen = openHintIds.includes(hint.id);
                return (
                  <div key={hint.id} className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                    <button
                      onClick={() => toggleHint(hint.id)}
                      className="w-full text-left p-3 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between transition-colors"
                    >
                      <span>{hint.title}</span>
                      <span className="text-amber-500 font-mono text-[10px]">
                        {isOpen ? 'Hide Hint' : 'Reveal Hint'}
                      </span>
                    </button>

                    {isOpen && (
                      <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 space-y-2">
                        <p>{hint.content}</p>
                        {hint.codeSnippet && (
                          <CodeBlock code={hint.codeSnippet} onRunInTerminal={onRunTerminalCommand} />
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Verification Command & Pro-Tip */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-slate-200 space-y-2">
            <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>Lab Verification Command</span>
            </h4>
            <p className="text-[11px] text-slate-400">Run on your local lab terminal to verify success:</p>
            <CodeBlock code={day.verificationCommand} onRunInTerminal={onRunTerminalCommand} />
          </div>

          <div className="p-4 rounded-2xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 text-slate-800 dark:text-slate-200 space-y-1.5">
            <h4 className="text-xs font-bold text-amber-500 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              <span>Senior SysAdmin Pro-Tip</span>
            </h4>
            <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300">
              {day.proTip}
            </p>
          </div>
        </div>

        {/* Official Documentation References */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
          <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
            <Globe className="w-4 h-4" />
            <span>Official Linux Documentation & Manual References</span>
          </h4>
          <p className="text-[11px] text-slate-400">
            Consult canonical man pages and distribution manuals for {day.category}:
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {(day.docReferences && day.docReferences.length > 0 ? day.docReferences : [
              { title: 'Linux Manual Pages (Man7)', url: 'https://man7.org/' },
              { title: 'GNU Bash Manual', url: 'https://www.gnu.org/software/bash/manual/' },
              { title: 'Ubuntu Documentation', url: 'https://documentation.ubuntu.com/' },
              { title: 'Red Hat Documentation', url: 'https://docs.redhat.com/' },
              { title: 'Arch Linux Wiki', url: 'https://wiki.archlinux.org/' }
            ]).map((ref) => (
              <a
                key={ref.url}
                href={ref.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-emerald-500/50 transition-colors"
              >
                <span>{ref.title}</span>
                <ExternalLink className="w-3 h-3 text-emerald-400" />
              </a>
            ))}
          </div>
        </div>

        {/* Personal Lab Notes */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
            Personal Lab Notes & Log (Auto-Saved)
          </label>
          <textarea
            value={notes}
            onChange={(e) => handleNotesChange(e.target.value)}
            placeholder="Write down any command flags, IP addresses, or learning notes for this day..."
            className="w-full h-20 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        {/* Completion Footer Button */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Close Lab Window
            </button>

            <button
              onClick={() => setShowQuizModal(true)}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-amber-500 hover:text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 flex items-center gap-1.5 transition-colors"
            >
              <Brain className="w-3.5 h-3.5" />
              <span>Take Quick Quiz</span>
            </button>
          </div>

          <button
            onClick={handleDayCompleteClick}
            className={`px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-md ${
              isDayCompleted
                ? 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
            }`}
          >
            {isDayCompleted ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Mark as Incomplete</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Complete Day {day.dayNumber} Lab 🎉</span>
              </>
            )}
          </button>
        </div>
      </div>

      {showQuizModal && (
        <QuickQuizModal
          day={day}
          onClose={() => setShowQuizModal(false)}
        />
      )}
    </div>
  );
}
