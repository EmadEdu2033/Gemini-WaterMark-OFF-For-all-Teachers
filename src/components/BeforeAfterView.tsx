import { useLang } from '../contexts/LanguageContext';

interface BeforeAfterViewProps {
  originalCanvas: HTMLCanvasElement | null;
  resultCanvas: HTMLCanvasElement | null;
  onDownloadPng: () => void;
  onDownloadJpeg: () => void;
  onReset: () => void;
  jpegQuality: number;
  onJpegQualityChange: (q: number) => void;
}

export function BeforeAfterView({
  originalCanvas,
  resultCanvas,
  onDownloadPng,
  onDownloadJpeg,
  onReset,
  jpegQuality,
  onJpegQualityChange,
}: BeforeAfterViewProps) {
  const { t } = useLang();

  const canvasStyle: React.CSSProperties = {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain',
    borderRadius: '8px',
    display: 'block',
  };

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      gap: '0',
    }}>
      {/* Side-by-side canvases */}
      <div style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '12px',
        padding: '20px',
        overflow: 'hidden',
        minHeight: 0,
      }}>
        {/* Before */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          overflow: 'hidden',
          minHeight: 0,
        }}>
          <div style={{
            fontSize: '11px',
            fontWeight: 600,
            color: '#555',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            textAlign: 'center',
          }}>
            {t.beforeLabel}
          </div>
          <div style={{
            flex: 1,
            background: 'repeating-conic-gradient(rgba(255,255,255,0.03) 0% 25%, transparent 0% 50%) 0 0 / 20px 20px',
            borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            minHeight: 0,
            padding: '8px',
          }}>
            {originalCanvas && (
              <canvas
                ref={el => {
                  if (el && originalCanvas) {
                    el.width = originalCanvas.width;
                    el.height = originalCanvas.height;
                    el.getContext('2d')!.drawImage(originalCanvas, 0, 0);
                  }
                }}
                style={canvasStyle}
              />
            )}
          </div>
        </div>

        {/* After */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          overflow: 'hidden',
          minHeight: 0,
        }}>
          <div style={{
            fontSize: '11px',
            fontWeight: 600,
            color: '#3b82f6',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            textAlign: 'center',
          }}>
            {t.afterLabel} ✓
          </div>
          <div style={{
            flex: 1,
            background: 'repeating-conic-gradient(rgba(255,255,255,0.03) 0% 25%, transparent 0% 50%) 0 0 / 20px 20px',
            borderRadius: '8px',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            minHeight: 0,
            padding: '8px',
          }}>
            {resultCanvas && (
              <canvas
                ref={el => {
                  if (el && resultCanvas) {
                    el.width = resultCanvas.width;
                    el.height = resultCanvas.height;
                    el.getContext('2d')!.drawImage(resultCanvas, 0, 0);
                  }
                }}
                style={canvasStyle}
              />
            )}
          </div>
        </div>
      </div>

      {/* Action bar */}
      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.05)',
        padding: '12px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        flexWrap: 'wrap',
        background: 'rgba(0,0,0,0.3)',
      }}>
        {/* JPEG quality */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '12px', color: '#555' }}>JPEG Q:</span>
          <input
            type="range"
            min={60}
            max={100}
            step={5}
            value={jpegQuality}
            onChange={e => onJpegQualityChange(Number(e.target.value))}
            style={{ width: '80px', accentColor: '#3b82f6' }}
            aria-label="JPEG quality"
          />
          <span style={{ fontFamily: 'var(--app-font-mono)', fontSize: '11px', color: '#777', minWidth: '32px' }}>
            {jpegQuality}%
          </span>
        </div>

        <div style={{ flex: 1 }} />

        <button
          onClick={onReset}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'transparent',
            color: '#666',
            fontSize: '13px',
            cursor: 'pointer',
            transition: 'all 180ms ease',
          }}
        >
          {t.resetBtn}
        </button>

        <button
          onClick={onDownloadJpeg}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            background: 'rgba(59, 130, 246, 0.08)',
            color: '#3b82f6',
            fontSize: '13px',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 180ms ease',
          }}
        >
          {t.downloadJpg}
        </button>

        <button
          onClick={onDownloadPng}
          style={{
            padding: '8px 20px',
            borderRadius: '8px',
            border: 'none',
            background: '#1d4ed8',
            color: '#fff',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 180ms ease',
          }}
        >
          {t.downloadPng}
        </button>
      </div>
    </div>
  );
}
