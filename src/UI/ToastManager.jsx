import { useEffect, useState } from 'react';
import { X, Bell } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { Button } from '../UI/Button';

function ToastItem({ toast, removeToast }) {
  const [visible, setVisible] = useState(true);

  // Auto-close after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => handleClose(), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => removeToast(toast.id), 300); // Match transition duration
  };

  const baseStyles =
    'rounded-lg p-4 flex items-center space-x-3 border shadow-lg transition-all duration-300 transform';
  let bg = '', border = '', icon = null;

  switch (toast.type) {
    case 'success':
      bg = 'bg-emerald-500/20 text-emerald-300';
      border = 'border-emerald-500/30';
      icon = <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />;
      break;
    case 'error':
      bg = 'bg-red-500/20 text-red-300';
      border = 'border-red-500/30';
      icon = <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />;
      break;
    default:
      bg = 'bg-cyan-500/20 text-cyan-300';
      border = 'border-cyan-500/30';
      icon = <Bell className="w-5 h-5 text-cyan-400" />;
  }

  return (
    <div
      className={`${baseStyles} ${bg} ${border} ${
        visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
      }`}
    >
      {icon}
      <div className="flex-1">
        <p className="font-medium">{toast.title}</p>
        {toast.message && <p className="text-sm opacity-80">{toast.message}</p>}
      </div>
      <Button
        variant="ghost"
        size="sm"
        icon={<X className="w-4 h-4" />}
        onClick={handleClose}
      />
    </div>
  );
}

export default function ToastManager() {
  const toasts = useAppStore(state => state.toasts);
  const removeToast = useAppStore(state => state.actions.removeToast);

  if (!toasts.length) return null;

  return (
    <div className="fixed top-6 right-6 space-y-3 z-50">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} removeToast={removeToast} />
      ))}
    </div>
  );
}
