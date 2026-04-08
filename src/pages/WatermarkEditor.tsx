import { useRef, useState, useCallback, useEffect } from 'react';
import { useLang } from '../contexts/LanguageContext';
import { UploadZone } from '../components/UploadZone';
import { HowItWorks } from '../components/HowItWorks';
import { removeGeminiWatermark } from '../lib/geminiRemover';
import { showToast } from '../components/Toast';

type AppState = 'idle' | 'processing' | 'done';

export type Tool = 'brush' | 'rect' | 'wand' | 'eraser';
export type InpaintAlgorithm = 'TELEA' | 'NS';

export function WatermarkEditor() {
  const { t } = useLang();

  const [appState, setAppState] = useState<AppState>('idle');
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [jpegQuality, setJpegQuality] = useState(92);

  const [beforeUrl, setBeforeUrl] = useState<string>('');
  const [afterUrl, setAfterUrl] = useState<string>('');
  const [dimensions, setDimensions] = useState<{ w: number; h: number }>({ w: 0, h: 0 });

  const resultCanvasRef = useRef<HTMLCanvasElement>(document.createElement('canvas'));
  const processingIdRef = useRef(0);

  useEffect(() => {
    return () => {
      if (afterUrl && afterUrl.startsWith('blob:')) {
        URL.revokeObjectURL(afterUrl);
      }
    };
  }, [afterUrl]);

  const handleImageLoad = useCallback((img: HTMLImageElement, file: File) => {
    if (afterUrl && afterUrl.startsWith('blob:')) {
      URL.revokeObjectURL(afterUrl);
    }

    const thisId = ++processingIdRef.current;
    setCurrentFile(file);
    setAppState('processing');

    const W = img.naturalWidth;
    const H = img.naturalHeight;
    setDimensions({ w: W, h: H });

    const origCanvas = document.createElement('canvas');
    origCanvas.width = W;
    origCanvas.height = H;
    origCanvas.getContext('2d')!.drawImage(img, 0, 0);
    setBeforeUrl(origCanvas.toDataURL('image/png'));

    const resCanvas = resultCanvasRef.current;
    resCanvas.width = W;
    resCanvas.height = H;
    resCanvas.getContext('2d')!.drawImage(img, 0, 0);

    setTimeout(() => {
      if (processingIdRef.current !== thisId) return;

      const success = removeGeminiWatermark(resCanvas);

      resCanvas.toBlob((blob) => {
        if (processingIdRef.current !== thisId) return;

        if (blob) {
          setAfterUrl(URL.createObjectURL(blob));
        } else {
          setAfterUrl(resCanvas.toDataURL('image/png'));
        }
        setAppState('done');
        if (success) {
          showToast(t.successToast, 'success');
        } else {
          showToast('No watermark detected — showing original', 'info');
        }
      }, 'image/png');
    }, 500);
  }, [t, afterUrl]);

  const handleReset = useCallback(() => {
    processingIdRef.current++;
    setAppState('idle');
    setCurrentFile(null);
    setBeforeUrl('');
    setAfterUrl('');
  }, []);

  const handleDownload = useCallback((format: 'png' | 'jpeg') => {
    const canvas = resultCanvasRef.current;
    if (!canvas || canvas.width < 2) return;

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const base = currentFile?.name.replace(/\.[^.]+$/, '') ?? 'watermark-off-result';
        a.href = url;
        a.download = `${base}-cleaned.${format === 'jpeg' ? 'jpg' : 'png'}`;
        a.click();
        URL.revokeObjectURL(url);
        showToast(t.downloadSuccess, 'success');
      },
      format === 'jpeg' ? 'image/jpeg' : 'image/png',
      format === 'jpeg' ? jpegQuality / 100 : undefined
    );
  }, [currentFile, jpegQuality, t]);

  return (
    <main style={{
      display: 'flex',
      flexDirection: 'column',
      height: 'calc(100vh - 56px - 40px)',
      overflow: 'hidden',
    }}>
      {appState === 'idle' && (
        <>
          <UploadZone onImageLoad={handleImageLoad} isReady />
          <HowItWorks />
        </>
      )}

      {(appState === 'processing' || appState === 'done') && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 }}>

          {/* File info strip */}
          <div style={{
            background: 'rgba(0,0,0,0.5)',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            padding: '8px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            flexShrink: 0,
          }}>
            <span style={{ fontSize: '12px', color: '#888', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '240px' }}>
              {currentFile?.name}
            </span>
            {dimensions.w > 0 && (
              <span style={{ fontFamily: 'var(--app-font-mono)', fontSize: '11px', color: '#555' }}>
                {dimensions.w} × {dimensions.h}
              </span>
            )}
            {appState === 'done' && (
              <span style={{
                fontSize: '11px', color: '#3b82f6',
                background: 'rgba(59,130,246,0.08)',
                border: '1px solid rgba(59,130,246,0.2)',
                padding: '2px 10px', borderRadius: '99px',
              }}>
                {t.watermarkInfo}
              </span>
            )}
          </div>

          {/* Processing overlay */}
          {appState === 'processing' && (
            <div style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: '16px',
            }}>
              <div className="spinner" />
              <div style={{ color: '#3b82f6', fontSize: '15px', fontWeight: 600 }}>{t.processing}</div>
              <div style={{ color: '#555', fontSize: '12px' }}>{t.processingNote}</div>
            </div>
          )}

          {/* Before / After display */}
          {appState === 'done' && beforeUrl && afterUrl && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 }}>

              {/* Side-by-side images */}
              <div style={{
                flex: 1,
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
                padding: '16px',
                minHeight: 0,
                overflow: 'hidden',
              }}>
                {/* Before */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', overflow: 'hidden', minHeight: 0 }}>
                  <div style={{ textAlign: 'center', fontSize: '11px', fontWeight: 600, color: '#555', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    {t.beforeLabel}
                  </div>
                  <div style={{
                    flex: 1,
                    minHeight: 0,
                    background: 'repeating-conic-gradient(rgba(255,255,255,0.03) 0% 25%, transparent 0% 50%) 0 0 / 20px 20px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    padding: '6px',
                  }}>
                    <img
                      src={beforeUrl}
                      alt="Original"
                      style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '4px', display: 'block' }}
                    />
                  </div>
                </div>

                {/* After */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', overflow: 'hidden', minHeight: 0 }}>
                  <div style={{ textAlign: 'center', fontSize: '11px', fontWeight: 600, color: '#3b82f6', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    {t.afterLabel} ✓
                  </div>
                  <div style={{
                    flex: 1,
                    minHeight: 0,
                    background: 'repeating-conic-gradient(rgba(255,255,255,0.03) 0% 25%, transparent 0% 50%) 0 0 / 20px 20px',
                    borderRadius: '8px',
                    border: '1px solid rgba(59,130,246,0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    padding: '6px',
                  }}>
                    <img
                      src={afterUrl}
                      alt="Cleaned"
                      style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '4px', display: 'block' }}
                    />
                  </div>
                </div>
              </div>

              {/* Action bar */}
              <div style={{
                borderTop: '1px solid rgba(255,255,255,0.05)',
                padding: '10px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                flexWrap: 'wrap',
                background: 'rgba(0,0,0,0.4)',
                flexShrink: 0,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '12px', color: '#555' }}>JPEG:</span>
                  <input
                    type="range" min={60} max={100} step={5}
                    value={jpegQuality}
                    onChange={e => setJpegQuality(Number(e.target.value))}
                    style={{ width: '72px', accentColor: '#3b82f6' }}
                  />
                  <span style={{ fontFamily: 'var(--app-font-mono)', fontSize: '11px', color: '#666', minWidth: '32px' }}>
                    {jpegQuality}%
                  </span>
                </div>

                <div style={{ flex: 1 }} />

                <button onClick={handleReset} style={{
                  padding: '8px 14px', borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.08)',
                  background: 'transparent', color: '#555',
                  fontSize: '13px', cursor: 'pointer',
                }}>
                  {t.resetBtn}
                </button>

                <button onClick={() => handleDownload('jpeg')} style={{
                  padding: '8px 14px', borderRadius: '8px',
                  border: '1px solid rgba(59,130,246,0.3)',
                  background: 'rgba(59,130,246,0.08)',
                  color: '#3b82f6', fontSize: '13px', fontWeight: 500, cursor: 'pointer',
                }}>
                  {t.downloadJpg}
                </button>

                <button onClick={() => handleDownload('png')} style={{
                  padding: '8px 20px', borderRadius: '8px',
                  border: 'none', background: '#1d4ed8',
                  color: '#fff', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                }}>
                  {t.downloadPng}
                </button>
              </div>
            </div>
          )}

          <HowItWorks />
        </div>
      )}
    </main>
  );
}
