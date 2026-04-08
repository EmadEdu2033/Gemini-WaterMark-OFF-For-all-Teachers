import { useLang } from '../contexts/LanguageContext';

export function Navbar() {
  const { lang, t, toggle } = useLang();

  return (
    <header
      role="banner"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(15,15,15,0.9)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid oklch(1 0 0 / 0.08)',
        height: '56px',
        display: 'flex',
        alignItems: 'center',
        padding: '0 24px',
        gap: '12px',
      }}
    >
      {/* SVG Logo */}
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <circle cx="16" cy="16" r="15" stroke="#3b82f6" strokeWidth="1.5" />
        <line x1="10" y1="10" x2="22" y2="22" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
        <line x1="22" y1="10" x2="10" y2="22" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
      </svg>

      <div>
        <div style={{
          fontFamily: "'Alexandria', sans-serif",
          fontWeight: 600,
          fontSize: 'clamp(1.1rem, 2vw, 1.4rem)',
          color: 'white',
          letterSpacing: '-0.01em',
          lineHeight: 1.1,
        }}>
          {t.appName}
        </div>
        <div style={{
          fontFamily: "'Alexandria', sans-serif",
          fontWeight: 300,
          fontSize: 'clamp(0.65rem, 1vw, 0.75rem)',
          color: '#93c5fd',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          marginTop: '-2px',
          display: 'block',
        }}>
          {t.appSub}
        </div>
      </div>

      <div style={{ flex: 1 }} />

      {/* Language toggle */}
      <button
        onClick={toggle}
        className="lang-toggle"
        aria-label={lang === 'en' ? 'Switch to Arabic' : 'Switch to English'}
        title={lang === 'en' ? 'Switch to Arabic' : 'Switch to English'}
      >
        {lang === 'en' ? 'ع' : 'EN'}
      </button>

      {/* Privacy badge */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'var(--blue-accent-soft)',
          border: '1px solid var(--blue-border-dim)',
          borderRadius: '999px',
          padding: '4px 12px',
          fontSize: '12px',
          color: '#93c5fd',
          fontWeight: 500,
        }}
        title="All processing happens locally in your browser"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path d="M6 1L2 3v4c0 2.2 1.7 3.8 4 4 2.3-.2 4-1.8 4-4V3L6 1z" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="0.8" strokeLinejoin="round" />
          <path d="M4 6l1.5 1.5L8 4.5" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {t.privacyBadge}
      </div>
    </header>
  );
}
