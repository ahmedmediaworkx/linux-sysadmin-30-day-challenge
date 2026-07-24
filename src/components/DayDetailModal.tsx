import React, { useState } from 'react';
import { X, CheckSquare, Square, Lightbulb, ShieldCheck, Terminal, BookOpen, AlertCircle, Sparkles, CheckCircle2, ExternalLink, Globe, Brain, Ticket, AlertTriangle, Briefcase, Award, HelpCircle, FileText, Download, Copy, Check, Server } from 'lucide-react';
import { DayChallenge, UserProgress } from '../types';
import { CodeBlock } from './CodeBlock';
import { triggerDayCompleteCelebration } from '../lib/utils';
import { QuickQuizModal } from './QuickQuizModal';
import { useLanguage } from '../context/LanguageContext';
import { getLocalizedDay } from '../data/arabicTranslations';

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
  day: rawDay,
  userProgress,
  onToggleTask,
  onToggleDayComplete,
  onSaveNotes,
  onRunTerminalCommand,
  onClose,
  onShowToast
}: DayDetailModalProps) {
  const { t, language } = useLanguage();
  const day = getLocalizedDay(rawDay, language);

  const [openHintIds, setOpenHintIds] = useState<string[]>([]);
  const [showAnswer, setShowAnswer] = useState(false);
  const [copiedDoc, setCopiedDoc] = useState(false);
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

  const getPriorityBadgeClass = (priority?: string) => {
    switch (priority) {
      case 'Critical':
        return 'bg-rose-500/10 text-rose-500 border-rose-500/20 font-extrabold';
      case 'High':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/20 font-bold';
      case 'Medium':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20 font-medium';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  const generateMarkdownReport = () => {
    const ticket = day.ticket;
    const biz = day.businessContext;
    const doc = day.documentationChallenge;

    return `# [INCIDENT REPORT] Day ${day.dayNumber}: ${day.title}
Date: ${new Date().toISOString().split('T')[0]}
Level: ${day.level.toUpperCase()} | Category: ${day.category}

## 1. Incoming Ticket
- **Ticket ID**: INC-${1000 + day.dayNumber}
- **From**: ${ticket?.from || 'Operations / Monitoring Team'}
- **Priority**: ${ticket?.priority || 'High'}
- **Subject**: ${ticket?.subject || day.title}
- **Description**: ${ticket?.message || day.scenario}

## 2. Business Impact & Context
- **Why Important**: ${biz?.whyImportant || 'Prevents unexpected outages and service degradation.'}
- **If Unfixed**: ${biz?.ifUnfixed || 'Elevated downtime and SLA breach risks.'}
- **Users Affected**: ${biz?.affectedUsers || 'Internal developers and external customers.'}
- **Business Impact**: ${biz?.businessImpact || 'Potential revenue loss and customer dissatisfaction.'}

## 3. Incident Investigation & Root Cause
- **Problem Summary**: ${doc?.problem || day.summary}
- **Investigation Steps**: ${doc?.investigation || 'Checked system logs, process statuses, networking sockets, and service permissions.'}
- **Root Cause**: ${doc?.rootCause || 'Misconfigured configuration file / resource bottleneck.'}

## 4. Remediation & Solution
${doc?.solution || 'Applied corrective configuration changes and restarted affected services.'}

## 5. Lessons Learned & Preventive Action
- ${doc?.lessonsLearned || 'Enforced proactive monitoring, alerting, and automated configuration backups.'}

---
*Report generated via Linux Admin Academy Workstation*`;
  };

  const copyMarkdownReport = () => {
    navigator.clipboard.writeText(generateMarkdownReport());
    setCopiedDoc(true);
    if (onShowToast) onShowToast('Markdown Copied', 'Incident report copied to clipboard', 'success');
    setTimeout(() => setCopiedDoc(false), 2000);
  };

  const downloadMarkdownReport = () => {
    const element = document.createElement('a');
    const file = new Blob([generateMarkdownReport()], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = `incident-report-day${day.dayNumber}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    if (onShowToast) onShowToast('Downloaded', `Saved incident-report-day${day.dayNumber}.md`, 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-4xl w-full p-5 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
        {/* Top Header */}
        <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {t('card.day', 'DAY')} {day.dayNumber}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase border ${getLevelBadgeClass(day.level)}`}>
                {day.level}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                {day.category}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                ~{day.durationMinutes} {t('common.minutes', 'mins')}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100">
              {day.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Company Situation / Story */}
        {day.story && (
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800/80 space-y-1.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" />
              <span>{t('dayModal.scenarioStory', 'Production Incident Scenario & Context')}</span>
            </h4>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {day.story}
            </p>
          </div>
        )}

        {/* Incoming Ticket */}
        {day.ticket ? (
          <div className="rounded-2xl border border-amber-500/30 dark:border-amber-500/20 bg-amber-500/5 overflow-hidden">
            <div className="px-4 py-2.5 bg-amber-500/10 border-b border-amber-500/20 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Ticket className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  {t('dayModal.ticketId', 'Ticket ID')} #INC-{1000 + day.dayNumber}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500 font-mono">From: <strong className="text-slate-800 dark:text-slate-200">{day.ticket.from}</strong></span>
                <span className={`px-2 py-0.5 rounded-md border text-[11px] uppercase ${getPriorityBadgeClass(day.ticket.priority)}`}>
                  {day.ticket.priority} Priority
                </span>
              </div>
            </div>
            <div className="p-4 space-y-2">
              <h5 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                Subject: {day.ticket.subject}
              </h5>
              <div className="p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 font-mono leading-relaxed whitespace-pre-wrap">
                "{day.ticket.message}"
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800/80 space-y-1.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" />
              <span>{t('dayModal.scenarioStory', 'Real-World Scenario')}</span>
            </h4>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {day.scenario}
            </p>
          </div>
        )}

        {/* Student Mission Objective */}
        {day.studentObjective && (
          <div className="p-4 rounded-2xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <Award className="w-4 h-4" />
              <span>{t('dayModal.labObjectives', 'Lab Objectives & Task Checklist')}</span>
            </h4>
            <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
              {day.studentObjective}
            </p>
          </div>
        )}

        {/* Lab Environment Setup */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-emerald-500" />
              <span>{t('terminal.activeEnv', 'Lab Environment Setup')}</span>
            </h3>

            {/* Selector */}
            <div className="flex flex-wrap gap-1 text-[11px] bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
              {(['docker', 'multipass', 'vagrant', 'baremetal'] as const).map((env) => (
                <button
                  key={env}
                  onClick={() => setSelectedEnv(env)}
                  className={`px-2.5 py-1 rounded capitalize cursor-pointer touch-manipulation min-h-[32px] ${
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
              <span>{t('dayModal.labObjectives', 'Hands-on Tasks')} ({completedTasksForDay.length}/{day.tasks.length})</span>
            </h3>

            <span className="text-xs font-mono font-semibold text-emerald-500">
              {Math.round((completedTasksForDay.length / day.tasks.length) * 100)}% {t('card.completed', 'Done')}
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
                      className="mt-0.5 text-emerald-500 hover:scale-110 transition-transform shrink-0 cursor-pointer"
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

        {/* Common Mistakes & Senior Advice */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {day.commonMistakes && day.commonMistakes.length > 0 && (
            <div className="p-4 rounded-2xl bg-rose-500/5 dark:bg-rose-500/10 border border-rose-500/20 text-slate-800 dark:text-slate-200 space-y-2">
              <h4 className="text-xs font-bold text-rose-500 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" />
                <span>{t('dayModal.commonMistakes', 'Common Mistakes to Avoid')}</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300 list-disc list-inside">
                {day.commonMistakes.map((mistake, idx) => (
                  <li key={idx} className="leading-relaxed">{mistake}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="p-4 rounded-2xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 text-slate-800 dark:text-slate-200 space-y-1.5">
            <h4 className="text-xs font-bold text-amber-500 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              <span>{t('dayModal.seniorAdvice', 'Senior SysAdmin Pro-Tip')}</span>
            </h4>
            <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300">
              {day.seniorAdvice || day.proTip}
            </p>
          </div>
        </div>

        {/* Personal Notes Section */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-emerald-500" />
              <span>{t('dayModal.notes', 'Personal Lab Notes & Commands Executed')}</span>
            </h4>

            <button
              onClick={() => handleNotesChange(notes)}
              className="px-3 py-1.5 rounded-xl text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{t('dayModal.saveNotes', 'Save Notes')}</span>
            </button>
          </div>

          <textarea
            value={notes}
            onChange={(e) => handleNotesChange(e.target.value)}
            placeholder={t('dayModal.notesPlaceholder', 'Write down custom configuration paths, log outputs, or takeaways from this lab...')}
            className="w-full h-28 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-slate-100 font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        {/* Completion Footer Button */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              {t('common.close', 'Close')}
            </button>

            <button
              onClick={() => setShowQuizModal(true)}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-amber-500 hover:text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Brain className="w-3.5 h-3.5" />
              <span>Quiz</span>
            </button>
          </div>

          <button
            onClick={handleDayCompleteClick}
            className={`px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-md cursor-pointer ${
              isDayCompleted
                ? 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
            }`}
          >
            {isDayCompleted ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>{t('dayModal.markAsIncomplete', 'Mark as Incomplete')}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>{t('dayModal.markAsCompleted', 'Mark Day as Completed')} 🎉</span>
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


