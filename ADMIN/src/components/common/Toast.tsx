import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiAlertCircle, FiCheckCircle, FiInfo, FiX, FiXCircle } from 'react-icons/fi';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  message: string;
  type?: ToastType;
  onClose: () => void;
  duration?: number;
}

const icons = {
  success: <FiCheckCircle className="h-5 w-5 text-emerald-500" />,
  error: <FiXCircle className="h-5 w-5 text-rose-500" />,
  warning: <FiAlertCircle className="h-5 w-5 text-amber-500" />,
  info: <FiInfo className="h-5 w-5 text-cyan-600" />,
};

const bgColors = {
  success: 'border-emerald-100 bg-white/90',
  error: 'border-rose-100 bg-white/90',
  warning: 'border-amber-100 bg-white/90',
  info: 'border-cyan-100 bg-white/90',
};

const Toast: React.FC<ToastProps> = ({ message, type = 'info', onClose, duration = 4000 }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.96 }}
      className={`flex w-full max-w-sm items-start gap-3 rounded-[24px] border p-4 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.75)] backdrop-blur-2xl ${bgColors[type]}`}
      role="alert"
    >
      {icons[type]}
      <p className="flex-1 text-sm font-medium text-slate-700">{message}</p>
      <button onClick={onClose} className="mt-0.5 text-slate-400 hover:text-slate-700">
        <FiX className="h-4 w-4" />
      </button>
    </motion.div>
  );
};

interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

export const ToastContainer: React.FC<{
  toasts: ToastItem[];
  onRemove: (id: string) => void;
}> = ({ toasts, onRemove }) => (
  <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
    <AnimatePresence>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => onRemove(toast.id)}
        />
      ))}
    </AnimatePresence>
  </div>
);

export const useToast = () => {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);

  const addToast = React.useCallback((message: string, type: ToastType = 'info') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((previous) => [...previous, { id, message, type }]);
  }, []);

  const removeToast = React.useCallback((id: string) => {
    setToasts((previous) => previous.filter((toast) => toast.id !== id));
  }, []);

  return { toasts, addToast, removeToast };
};

export default Toast;