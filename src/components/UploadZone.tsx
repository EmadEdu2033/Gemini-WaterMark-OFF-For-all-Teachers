import { useRef, useState } from 'react';
import { useLang } from '../contexts/LanguageContext';

interface UploadZoneProps {
  onImageLoad: (img: HTMLImageElement, file: File) => void;
  isReady: boolean;
}

export function UploadZone({ onImageLoad, isReady }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useLang();

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => onImageLoad(img, file);
      img.src = e.target!.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = '';
  };

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px',
    }}>
      <div
        role="button"
        tabIndex={0}
        aria-label={t.uploadTitle}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click(); }}
        className={!isDragging ? 'upload-zone-idle' : ''}
        style={{
          width: '100%',
          maxWidth: '620px',
          aspectRatio: '16/9',
          maxHeight: '420px',
          border: `2px dashed ${isDragging ? '#3b82f6' : 'rgba(255,255,255,0.1)'}`,
          borderRadius: '16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '20px',
          cursor: 'pointer',
          background: isDragging ? 'rgba(59, 130, 246, 0.04)' : 'rgba(255,255,255,0.02)',
          transition: 'all 180ms ease',
          position: 'relative',
        }}
      >
        {/* Gemini sparkle icon suggestion */}
        <div className="float-anim">
          <svg width="72" height="72" viewBox="0 0 72 72" fill="none" aria-hidden="true">
            <circle cx="36" cy="36" r="34" fill="rgba(59,130,246,0.06)" stroke="rgba(59,130,246,0.18)" strokeWidth="1" />
            {/* Upload arrow */}
            <path d="M36 46V30M28 38l8-8 8 8" stroke={isDragging ? '#3b82f6' : '#555'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M26 50h20" stroke={isDragging ? '#3b82f6' : '#444'} strokeWidth="2" strokeLinecap="round" />
            {/* Gemini sparkle hint in corner */}
            <path d="M56 52 L58 56 L62 58 L58 60 L56 64 L54 60 L50 58 L54 56 Z"
              fill={isDragging ? 'rgba(59,130,246,0.8)' : 'rgba(255,255,255,0.2)'}
              style={{ transition: 'fill 180ms ease' }}
            />
          </svg>
        </div>

        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '18px', fontWeight: 600, color: '#ccc', marginBottom: '8px' }}>
            {t.uploadTitle}
          </div>
          <div style={{ fontSize: '13px', color: '#555', marginBottom: '12px' }}>
            {t.uploadSub}
          </div>
          <div style={{ fontSize: '13px', color: '#3b82f6', textDecoration: 'underline', cursor: 'pointer' }}>
            {t.browseFiles}
          </div>
        </div>

        {/* Gemini badge hint */}
        <div style={{
          position: 'absolute',
          bottom: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '11px',
          color: '#444',
        }}>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
            <path d="M5 1L2 2.5v3C2 7.3 3.3 8.7 5 9c1.7-.3 3-1.7 3-3.5v-3L5 1z" fill="rgba(59,130,246,0.3)" stroke="rgba(59,130,246,0.5)" strokeWidth="0.6" strokeLinejoin="round" />
          </svg>
          {t.privacyNote}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
          aria-label="Upload image file"
        />
      </div>
    </div>
  );
}
