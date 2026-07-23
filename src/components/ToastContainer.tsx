import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Sparkles, Info, AlertTriangle, X } from 'lucide-react';
import { ToastNotification } from '../types';

interface ToastContainerProps {
  toasts: ToastNotification[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
        ))}
      </AnimatePresence>
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastNotification; onDismiss: (id: string) => void }> = ({
  toast,
  onDismiss
}) => {
  const duration = toast.duration || 3500;

  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, duration);
    return () => clearTimeout(timer);
  }, [toast.id, duration, onDismiss]);

  const getIcon = () => {
    switch (toast.type) {
      case 'unlock':
        return <Sparkles className="w-5 h-5 text-cyan-400 shrink-0 animate-pulse" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-400 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />;
      case 'success':
      default:
        return <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />;
    }
  };

  const getStyle = () => {
    switch (toast.type) {
      case 'unlock':
        return 'border-cyan-500/30 bg-[#0c1929] dark:bg-[#0c1929] text-slate-100 shadow-[0_10px_30px_rgba(34,211,238,0.2)]';
      case 'info':
        return 'border-blue-500/30 bg-[#0f172a] text-slate-100 shadow-xl';
      case 'warning':
        return 'border-amber-500/30 bg-[#1c1917] text-slate-100 shadow-xl';
      case 'success':
      default:
        return 'border-emerald-500/30 bg-[#0d1f17] dark:bg-[#0d1f17] text-slate-100 shadow-[0_10px_30px_rgba(34,197,94,0.15)]';
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 25, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 50, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`pointer-events-auto relative overflow-hidden rounded-2xl border p-4 backdrop-blur-xl ${getStyle()}`}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5">{getIcon()}</div>
        <div className="flex-1 space-y-0.5">
          <h4 className="text-xs font-bold tracking-tight text-white flex items-center gap-1.5">
            {toast.title}
          </h4>
          {toast.description && (
            <p className="text-[11px] text-slate-300 font-mono leading-relaxed">
              {toast.description}
            </p>
          )}
        </div>
        <button
          onClick={() => onDismiss(toast.id)}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors shrink-0"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Progress Bar Timer */}
      <motion.div
        initial={{ width: '100%' }}
        animate={{ width: '0%' }}
        transition={{ duration: duration / 1000, ease: 'linear' }}
        className={`absolute bottom-0 left-0 h-0.5 ${
          toast.type === 'unlock'
            ? 'bg-cyan-400'
            : toast.type === 'info'
            ? 'bg-blue-400'
            : toast.type === 'warning'
            ? 'bg-amber-400'
            : 'bg-emerald-400'
        }`}
      />
    </motion.div>
  );
};
