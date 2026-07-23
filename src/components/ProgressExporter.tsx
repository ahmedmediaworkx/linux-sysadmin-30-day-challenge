import React, { useState } from 'react';
import { X, Download, Upload, RotateCcw, Check, AlertTriangle } from 'lucide-react';
import { UserProgress } from '../types';

interface ProgressExporterProps {
  userProgress: UserProgress;
  onImportProgress: (imported: UserProgress) => void;
  onResetProgress: () => void;
  onClose: () => void;
  onShowToast?: (title: string, description?: string, type?: 'success' | 'unlock' | 'info' | 'warning') => void;
}

export function ProgressExporter({
  userProgress,
  onImportProgress,
  onResetProgress,
  onClose,
  onShowToast
}: ProgressExporterProps) {
  const [copied, setCopied] = useState(false);
  const [importText, setImportText] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [confirmReset, setConfirmReset] = useState(false);

  const jsonString = JSON.stringify(userProgress, null, 2);

  const handleCopyJSON = async () => {
    try {
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
      if (onShowToast) {
        onShowToast('Copied to Clipboard', 'JSON progress state copied', 'info');
      }
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDownloadFile = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `linux-sysadmin-30day-progress-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    if (onShowToast) {
      onShowToast('Backup Downloaded', 'Saved progress backup to local file', 'success');
    }
  };

  const handleImportSubmit = () => {
    setErrorMsg('');
    try {
      const parsed = JSON.parse(importText);
      if (parsed && Array.isArray(parsed.completedDays)) {
        onImportProgress(parsed);
        if (onShowToast) {
          onShowToast('Progress Restored & Synced', 'Imported data synced to local storage', 'success');
        }
        onClose();
      } else {
        setErrorMsg('Invalid JSON format. Expected completedDays array.');
      }
    } catch (err) {
      setErrorMsg('Syntax error in JSON string.');
    }
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base flex items-center gap-2">
            <Download className="w-5 h-5 text-emerald-500" />
            <span>Sync & Export Progress</span>
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Export Section */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
            Export Your Progress
          </label>
          <div className="flex gap-2">
            <button
              onClick={handleCopyJSON}
              className="flex-1 py-2 px-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              {copied ? <Check className="w-4 h-4" /> : <Download className="w-4 h-4" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy JSON'}</span>
            </button>
            <button
              onClick={handleDownloadFile}
              className="py-2 px-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 font-semibold text-xs transition-colors"
            >
              Download .json File
            </button>
          </div>
        </div>

        {/* Import Section */}
        <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
            Import Progress from Backup
          </label>
          <textarea
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            placeholder="Paste your exported progress JSON snippet here..."
            className="w-full h-24 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
          {errorMsg && (
            <p className="text-xs text-rose-500 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{errorMsg}</span>
            </p>
          )}
          <button
            onClick={handleImportSubmit}
            disabled={!importText.trim()}
            className="w-full py-2 rounded-lg bg-slate-900 dark:bg-slate-100 text-slate-100 dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 disabled:opacity-50 font-bold text-xs transition-colors"
          >
            Load & Overwrite Progress
          </button>
        </div>

        {/* Danger Zone */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
          {!confirmReset ? (
            <button
              onClick={() => setConfirmReset(true)}
              className="text-xs text-rose-500 hover:text-rose-600 flex items-center gap-1 font-semibold"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset all 30-day progress</span>
            </button>
          ) : (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs space-y-2">
              <p className="text-rose-400 font-bold">Are you sure you want to reset all completed tasks?</p>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    onResetProgress();
                    if (onShowToast) {
                      onShowToast('Progress Reset', 'Reset all progress to initial trainee state', 'warning');
                    }
                    onClose();
                  }}
                  className="px-3 py-1 rounded bg-rose-500 text-white font-bold text-xs"
                >
                  Yes, Reset
                </button>
                <button
                  onClick={() => setConfirmReset(false)}
                  className="px-3 py-1 rounded bg-slate-800 text-slate-300 text-xs"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
