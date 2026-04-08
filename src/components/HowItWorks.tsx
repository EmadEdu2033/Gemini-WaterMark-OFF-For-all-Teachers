import { useState } from 'react';
import { useLang } from '../contexts/LanguageContext';

export function HowItWorks() {
  const [open, setOpen] = useState(false);
  const { t } = useLang();

  return (
    <div style={{
      borderTop: '1px solid rgba(255,255,255,0.05)',
      background: 'rgba(0,0,0,0.2)',
    }}>
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        style={{
          width: '100%',
          padding: '12px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: '#555',
          fontSize: '12px',
          transition: 'color 180ms ease',
        }}
      >
        <span>{t.howItWorks}</span>
        <span style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 180ms ease' }}>▾</span>
      </button>

      {open && (
        <div style={{ padding: '0 20px 16px', color: '#555', fontSize: '12px', lineHeight: 1.8, maxWidth: '800px' }}>
          <p style={{ marginBottom: '10px' }}>{t.howItWorksP1}</p>
          <p style={{ marginBottom: '8px' }}>{t.howItWorksP2}</p>
          <div style={{
            fontFamily: 'var(--app-font-mono)',
            fontSize: '12px',
            color: '#93c5fd',
            background: 'rgba(59, 130, 246, 0.06)',
            border: '1px solid rgba(59, 130, 246, 0.15)',
            borderRadius: '6px',
            padding: '8px 12px',
            margin: '8px 0 10px',
          }}>
            {t.howItWorksFormula}
          </div>
          <p style={{ marginBottom: '8px' }}>{t.howItWorksP3}</p>
          <p style={{ color: '#3b82f6' }}>{t.howItWorksPrivacy}</p>
        </div>
      )}
    </div>
  );
}
