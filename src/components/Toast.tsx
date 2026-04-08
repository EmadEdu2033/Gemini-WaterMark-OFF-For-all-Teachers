import { useEffect, useState } from 'react';

interface ToastMessage {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

let toastIdCounter = 0;
let globalSetToasts: React.Dispatch<React.SetStateAction<ToastMessage[]>> | null = null;

export function showToast(message: string, type: 'success' | 'error' | 'info' = 'success') {
  if (!globalSetToasts) return;
  const id = ++toastIdCounter;
  globalSetToasts(prev => [...prev, { id, message, type }]);
  setTimeout(() => {
    if (globalSetToasts) {
      globalSetToasts(prev => prev.filter(t => t.id !== id));
    }
  }, 4000);
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    globalSetToasts = setToasts;
    return () => { globalSetToasts = null; };
  }, []);

  const colorMap = {
    success: { bg: 'rgba(59, 130, 246, 0.12)', border: 'rgba(59, 130, 246, 0.35)', color: '#93c5fd', icon: '✓' },
    error: { bg: 'rgba(239, 68, 68, 0.12)', border: 'rgba(239, 68, 68, 0.3)', color: '#ef4444', icon: '✕' },
    info: { bg: 'rgba(255, 255, 255, 0.08)', border: 'rgba(255, 255, 255, 0.15)', color: '#e5e5e5', icon: 'ℹ' },
  };

  return (
    <div
      id="toast-container"
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed',
        top: '72px',
        insetInlineEnd: '24px',
        zIndex: 9998,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}
    >
      {toasts.map(toast => {
        const colors = colorMap[toast.type];
        return (
          <div
            key={toast.id}
            className="toast-enter"
            style={{
              background: colors.bg,
              border: `1px solid ${colors.border}`,
              borderRadius: '8px',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              backdropFilter: 'blur(8px)',
              maxWidth: '320px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            }}
          >
            <span style={{ color: colors.color, fontWeight: 700, fontSize: '14px' }}>
              {colors.icon}
            </span>
            <span style={{ color: '#e5e5e5', fontSize: '13px', lineHeight: 1.4 }}>
              {toast.message}
            </span>
          </div>
        );
      })}
    </div>
  );
}
