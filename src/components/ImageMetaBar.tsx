import { useLang } from '../contexts/LanguageContext';

interface ImageMetaBarProps {
  fileName: string;
  fileSize: number;
  width: number;
  height: number;
  showResult: boolean;
  onToggleView: () => void;
  onDownloadPng: () => void;
  onDownloadJpeg: () => void;
  jpegQuality: number;
  onJpegQualityChange: (q: number) => void;
  hasResult: boolean;
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function ImageMetaBar({
  fileName,
  fileSize,
  width,
  height,
  showResult,
  onToggleView,
  onDownloadPng,
  onDownloadJpeg,
  jpegQuality,
  onJpegQualityChange,
  hasResult,
}: ImageMetaBarProps) {
  const { t } = useLang();
  const isBig = width * height > 4_000_000;

  return (
    <div style={{
      background: 'rgba(0,0,0,0.4)',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
      padding: '8px 20px',
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      flexWrap: 'wrap',
    }}>
      {/* File metadata */}
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flex: 1, flexWrap: 'wrap' }}>
        <span style={{ fontSize: '12px', color: '#888', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {fileName}
        </span>
        <span style={{ fontFamily: 'var(--app-font-mono)', fontSize: '11px', color: '#555' }}>
          {width} × {height}
        </span>
        <span style={{ fontFamily: 'var(--app-font-mono)', fontSize: '11px', color: '#555' }}>
          {formatBytes(fileSize)}
        </span>
        {isBig && (
          <span style={{
            fontSize: '11px',
            color: '#f59e0b',
            background: 'rgba(245, 158, 11, 0.1)',
            border: '1px solid rgba(245, 158, 11, 0.2)',
            padding: '2px 8px',
            borderRadius: '4px',
          }}>
            {t.largeImage}
          </span>
        )}
      </div>

      {/* View toggle */}
      {hasResult && (
        <button
          onClick={onToggleView}
          style={{
            padding: '5px 12px',
            borderRadius: '6px',
            border: '1px solid rgba(255,255,255,0.1)',
            background: showResult ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
            color: showResult ? '#3b82f6' : '#888',
            fontSize: '12px',
            cursor: 'pointer',
            transition: 'all 180ms ease',
          }}
        >
          {showResult ? t.viewOriginal : t.viewResult}
        </button>
      )}

      {/* Download controls */}
      {hasResult && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '11px', color: '#555' }}>JPEG Q:</span>
            <input
              type="range"
              min={60}
              max={100}
              step={5}
              value={jpegQuality}
              onChange={e => onJpegQualityChange(Number(e.target.value))}
              style={{ width: '70px', accentColor: '#3b82f6' }}
              aria-label="JPEG quality"
            />
            <span style={{ fontFamily: 'var(--app-font-mono)', fontSize: '11px', color: '#777', minWidth: '32px' }}>
              {jpegQuality}%
            </span>
          </div>

          <button
            onClick={onDownloadPng}
            style={{
              padding: '5px 10px',
              borderRadius: '6px',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              background: 'rgba(59, 130, 246, 0.08)',
              color: '#3b82f6',
              fontSize: '12px',
              cursor: 'pointer',
              fontWeight: 500,
              transition: 'all 180ms ease',
            }}
          >
            {t.downloadPng}
          </button>
          <button
            onClick={onDownloadJpeg}
            style={{
              padding: '5px 10px',
              borderRadius: '6px',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              background: 'rgba(59, 130, 246, 0.08)',
              color: '#3b82f6',
              fontSize: '12px',
              cursor: 'pointer',
              fontWeight: 500,
              transition: 'all 180ms ease',
            }}
          >
            {t.downloadJpg}
          </button>
        </div>
      )}
    </div>
  );
}
