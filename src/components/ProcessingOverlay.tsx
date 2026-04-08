import { useLang } from '../contexts/LanguageContext';

interface ProcessingOverlayProps {
  visible: boolean;
}

export function ProcessingOverlay({ visible }: ProcessingOverlayProps) {
  const { t } = useLang();
  if (!visible) return null;

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 50,
      borderRadius: '12px',
    }}>
      <div style={{ textAlign: 'center' }}>
        <div className="spinner" style={{ margin: '0 auto 16px' }} />
        <div style={{ color: '#3b82f6', fontSize: '15px', fontWeight: 600, marginBottom: '8px' }}>
          {t.processing}
        </div>
        <div style={{ color: '#555', fontSize: '12px' }}>
          {t.processingNote}
        </div>
      </div>
    </div>
  );
}
