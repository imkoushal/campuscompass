"use client";
import { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

interface ToastContextType {
  showToast: (message: string, type?: "success" | "error" | "info") => void;
}

const ToastContext = createContext<ToastContextType>({ showToast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: "success" | "error" | "info" = "success") => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const icons: Record<string, string> = {
    success: "check_circle",
    error: "error",
    info: "info",
  };

  const colors: Record<string, string> = {
    success: "text-green-400 border-green-500/30",
    error: "text-red-400 border-red-500/30",
    info: "text-primary border-primary/30",
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Container */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto glass-card rounded-xl px-5 py-3.5 flex items-center gap-3 min-w-[280px] max-w-[400px] border ${colors[toast.type]} animate-fade-in-up shadow-2xl`}
            role="alert"
            aria-live="polite"
          >
            <span className={`material-symbols-outlined text-xl ${colors[toast.type].split(" ")[0]}`} style={{ fontVariationSettings: "'FILL' 1" }}>
              {icons[toast.type]}
            </span>
            <p className="text-sm flex-1">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-on-surface-variant hover:text-on-surface transition-colors ml-2"
              aria-label="Dismiss notification"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
