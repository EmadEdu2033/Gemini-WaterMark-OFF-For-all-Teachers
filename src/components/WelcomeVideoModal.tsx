import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'welcomeVideoShown';

export function WelcomeVideoModal() {
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY)) return;
    sessionStorage.setItem(STORAGE_KEY, '1');
    // small delay so the page renders first
    const id = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(id);
  }, []);

  const close = useCallback(() => {
    setClosing(true);
    setTimeout(() => {
      setVisible(false);
      setClosing(false);
    }, 200);
  }, []);

  if (!visible) return null;

  return (
    <div
      onClick={close}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        opacity: closing ? 0 : 1,
        transition: closing
          ? 'opacity 200ms ease-in'
          : 'opacity 300ms ease-out',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          width: '90vw',
          maxWidth: '800px',
          borderRadius: '12px',
          overflow: 'hidden',
          background: '#000',
          boxShadow: '0 24px 80px rgba(0, 0, 0, 0.6)',
          transform: closing ? 'scale(0.85)' : 'scale(1)',
          opacity: closing ? 0 : 1,
          transition: closing
            ? 'transform 200ms ease-in, opacity 200ms ease-in'
            : 'transform 300ms ease-out, opacity 300ms ease-out',
        }}
      >
        {/* Close button */}
        <button
          onClick={close}
          aria-label="Close"
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            zIndex: 1,
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            border: 'none',
            background: 'rgba(0, 0, 0, 0.6)',
            color: '#fff',
            fontSize: '18px',
            lineHeight: '32px',
            textAlign: 'center',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          ✕
        </button>

        {/* Video */}
        <video
          controls
          autoPlay
          muted
          playsInline
          style={{ display: 'block', width: '100%' }}
          src="/Watermark-Eraser-Apr-8-15-35-06.mp4"
        />
      </div>
    </div>
  );
}
