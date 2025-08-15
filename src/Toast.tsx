import { useEffect, useState, useCallback } from 'react';
import { CheckCircle, X } from 'lucide-react';

interface Toast {
    id: number;
    message: string;
    type: 'success' | 'info' | 'error';
}

// Simple global event emitter for toasts
const listeners: ((toast: Omit<Toast, 'id'>) => void)[] = [];
let toastId = 0;

export function showToast(message: string, type: 'success' | 'info' | 'error' = 'success') {
    listeners.forEach(l => l({ message, type }));
}

export function ToastContainer() {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
        const id = ++toastId;
        setToasts(prev => [...prev, { ...toast, id }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 3000);
    }, []);

    useEffect(() => {
        listeners.push(addToast);
        return () => {
            const idx = listeners.indexOf(addToast);
            if (idx > -1) listeners.splice(idx, 1);
        };
    }, [addToast]);

    if (toasts.length === 0) return null;

    return (
        <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-2 pointer-events-none">
            {toasts.map(toast => (
                <div
                    key={toast.id}
                    className={`animate-fade-in flex items-center gap-3 glass-panel border-slate-200/60 px-5 py-3 shadow-xl max-w-xs pointer-events-auto ${toast.type === 'error' ? 'bg-red-50/95 border-red-200' : 'bg-white/95'
                        }`}
                >
                    {toast.type === 'error' ? (
                        <X size={18} className="text-red-400 shrink-0" />
                    ) : (
                        <CheckCircle size={18} className="text-green-400 shrink-0" />
                    )}
                    <p className="text-sm text-slate-800 font-medium">{toast.message}</p>
                    <button
                        onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                        className="ml-auto text-slate-400 hover:text-slate-900 transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>
            ))}
        </div>
    );
}
