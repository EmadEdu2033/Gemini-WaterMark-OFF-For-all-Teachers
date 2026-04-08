import { useLang } from '../contexts/LanguageContext';
import type { Tool, InpaintAlgorithm } from '../pages/WatermarkEditor';

interface ToolsSidebarProps {
  activeTool: Tool;
  onToolChange: (tool: Tool) => void;
  brushSize: number;
  onBrushSizeChange: (size: number) => void;
  wandTolerance: number;
  onWandToleranceChange: (t: number) => void;
  algorithm: InpaintAlgorithm;
  onAlgorithmChange: (algo: InpaintAlgorithm) => void;
  inpaintRadius: number;
  onInpaintRadiusChange: (r: number) => void;
  mode: 'manual' | 'auto';
  onModeChange: (m: 'manual' | 'auto') => void;
  onClearMask: () => void;
  onAutoDetect: () => void;
  onRemove: () => void;
  onReset: () => void;
  isProcessing: boolean;
  isReady: boolean;
  hasImage: boolean;
  hasMask: boolean;
}

function ToolButton({
  label,
  active,
  disabled,
  onClick,
  icon,
}: {
  label: string;
  active: boolean;
  disabled?: boolean;
  onClick: () => void;
  icon: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '4px',
        padding: '10px 8px',
        borderRadius: '8px',
        border: active ? '1px solid rgba(59, 130, 246, 0.4)' : '1px solid transparent',
        background: active ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
        color: active ? '#3b82f6' : disabled ? '#444' : '#888',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 180ms ease',
        fontSize: '11px',
        fontWeight: 500,
        flex: 1,
        minWidth: '52px',
      }}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function SliderRow({
  label,
  value,
  min,
  max,
  disabled,
  onChange,
  formatValue,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  disabled?: boolean;
  onChange: (v: number) => void;
  formatValue?: (v: number) => string;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#888' }}>
        <span>{label}</span>
        <span style={{ fontFamily: 'var(--app-font-mono)', color: '#aaa' }}>
          {formatValue ? formatValue(value) : value}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        disabled={disabled}
        onChange={e => onChange(Number(e.target.value))}
        style={{ width: '100%', accentColor: '#3b82f6', opacity: disabled ? 0.4 : 1 }}
        aria-label={label}
      />
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: '10px',
      fontWeight: 600,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      color: '#555',
      paddingBottom: '8px',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
      marginBottom: '12px',
    }}>
      {children}
    </div>
  );
}

export function ToolsSidebar({
  activeTool,
  onToolChange,
  brushSize,
  onBrushSizeChange,
  wandTolerance,
  onWandToleranceChange,
  algorithm,
  onAlgorithmChange,
  inpaintRadius,
  onInpaintRadiusChange,
  mode,
  onModeChange,
  onClearMask,
  onAutoDetect,
  onRemove,
  onReset,
  isProcessing,
  isReady,
  hasImage,
  hasMask,
}: ToolsSidebarProps) {
  const { t } = useLang();
  const toolsDisabled = !isReady || !hasImage || isProcessing;

  return (
    <aside
      aria-label="Watermark removal tools"
      style={{
        width: '240px',
        minWidth: '240px',
        background: 'hsl(0 0% 10%)',
        borderInlineEnd: '1px solid rgba(255,255,255,0.06)',
        padding: '20px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        overflowY: 'auto',
      }}
    >
      {/* Mode Toggle */}
      <div>
        <SectionLabel>{t.detectionMode}</SectionLabel>
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.04)', borderRadius: '8px', padding: '3px', gap: '2px' }}>
          {(['manual', 'auto'] as const).map(m => (
            <button
              key={m}
              onClick={() => onModeChange(m)}
              disabled={toolsDisabled}
              style={{
                flex: 1,
                padding: '6px',
                borderRadius: '6px',
                border: 'none',
                background: mode === m ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                color: mode === m ? '#3b82f6' : '#666',
                fontWeight: mode === m ? 600 : 400,
                fontSize: '12px',
                cursor: toolsDisabled ? 'not-allowed' : 'pointer',
                transition: 'all 180ms ease',
              }}
            >
              {m === 'manual' ? t.manualMask : t.autoDetect}
            </button>
          ))}
        </div>
      </div>

      {/* Drawing Tools */}
      {mode === 'manual' && (
        <div>
          <SectionLabel>{t.maskingTools}</SectionLabel>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '16px' }}>
            <ToolButton label={t.brushTool} active={activeTool === 'brush'} disabled={toolsDisabled} onClick={() => onToolChange('brush')}
              icon={<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M14 2L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><circle cx="3.5" cy="14.5" r="2.5" fill="currentColor" fillOpacity="0.5" /></svg>}
            />
            <ToolButton label={t.rectTool} active={activeTool === 'rect'} disabled={toolsDisabled} onClick={() => onToolChange('rect')}
              icon={<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="2" y="4" width="14" height="10" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 1.5" /></svg>}
            />
            <ToolButton label={t.wandTool} active={activeTool === 'wand'} disabled={toolsDisabled} onClick={() => onToolChange('wand')}
              icon={<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><circle cx="7" cy="7" r="4" stroke="currentColor" strokeWidth="1.5" /><circle cx="7" cy="3" r="1" fill="currentColor" /><circle cx="11" cy="7" r="1" fill="currentColor" /><circle cx="7" cy="11" r="1" fill="currentColor" /></svg>}
            />
            <ToolButton label={t.eraserTool} active={activeTool === 'eraser'} disabled={toolsDisabled} onClick={() => onToolChange('eraser')}
              icon={<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3 15h6M14 3L6 11M3 11l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>}
            />
          </div>

          {(activeTool === 'brush' || activeTool === 'eraser') && (
            <SliderRow label={t.brushSize} value={brushSize} min={5} max={100} disabled={toolsDisabled} onChange={onBrushSizeChange} formatValue={v => `${v}px`} />
          )}
          {activeTool === 'wand' && (
            <SliderRow label={t.tolerance} value={wandTolerance} min={1} max={100} disabled={toolsDisabled} onChange={onWandToleranceChange} />
          )}
        </div>
      )}

      {/* Auto detect */}
      {mode === 'auto' && (
        <div>
          <SectionLabel>{t.autoDetect}</SectionLabel>
          <p style={{ fontSize: '12px', color: '#666', marginBottom: '12px', lineHeight: 1.5 }}>
            {t.autoDetectNote}
          </p>
          <button
            onClick={onAutoDetect}
            disabled={toolsDisabled}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '8px',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              background: 'rgba(59, 130, 246, 0.08)',
              color: toolsDisabled ? '#555' : '#3b82f6',
              fontSize: '13px',
              fontWeight: 500,
              cursor: toolsDisabled ? 'not-allowed' : 'pointer',
              transition: 'all 180ms ease',
            }}
          >
            {t.detectBtn}
          </button>
        </div>
      )}

      {/* Algorithm */}
      <div>
        <SectionLabel>{t.algoLabel}</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px' }}>
          {(['TELEA', 'NS'] as InpaintAlgorithm[]).map(algo => (
            <label
              key={algo}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px',
                cursor: toolsDisabled ? 'not-allowed' : 'pointer',
                padding: '8px 10px',
                borderRadius: '6px',
                border: algorithm === algo ? '1px solid rgba(59, 130, 246, 0.25)' : '1px solid transparent',
                background: algorithm === algo ? 'rgba(59, 130, 246, 0.06)' : 'transparent',
                transition: 'all 180ms ease',
              }}
            >
              <input
                type="radio"
                name="algorithm"
                value={algo}
                checked={algorithm === algo}
                disabled={toolsDisabled}
                onChange={() => onAlgorithmChange(algo)}
                style={{ accentColor: '#3b82f6', marginTop: '1px' }}
              />
              <div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: algorithm === algo ? '#3b82f6' : '#888' }}>
                  INPAINT_{algo}
                </div>
                <div style={{ fontSize: '11px', color: '#555', marginTop: '2px' }}>
                  {algo === 'TELEA' ? t.telea : t.ns}
                </div>
              </div>
            </label>
          ))}
        </div>

        <SliderRow label={t.radiusLabel} value={inpaintRadius} min={3} max={21} disabled={toolsDisabled} onChange={onInpaintRadiusChange} formatValue={v => `${v}px`} />
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: 'auto' }}>
        {mode === 'manual' && (
          <button
            onClick={onClearMask}
            disabled={toolsDisabled || !hasMask}
            style={{
              padding: '8px',
              borderRadius: '6px',
              border: '1px solid rgba(255,255,255,0.08)',
              background: 'transparent',
              color: toolsDisabled || !hasMask ? '#444' : '#888',
              fontSize: '12px',
              cursor: toolsDisabled || !hasMask ? 'not-allowed' : 'pointer',
              transition: 'all 180ms ease',
            }}
          >
            {t.clearMask}
          </button>
        )}

        <button
          onClick={onRemove}
          disabled={toolsDisabled || !hasMask || isProcessing}
          style={{
            padding: '12px',
            borderRadius: '8px',
            border: 'none',
            background: toolsDisabled || !hasMask || isProcessing
              ? 'rgba(59, 130, 246, 0.1)'
              : '#1d4ed8',
            color: toolsDisabled || !hasMask || isProcessing ? '#555' : '#fff',
            fontSize: '14px',
            fontWeight: 600,
            cursor: toolsDisabled || !hasMask || isProcessing ? 'not-allowed' : 'pointer',
            transition: 'all 180ms ease',
          }}
        >
          {isProcessing ? t.processing.split(' ')[0] + '...' : t.removeBtn}
        </button>

        <button
          onClick={onReset}
          disabled={!hasImage || isProcessing}
          style={{
            padding: '8px',
            borderRadius: '6px',
            border: '1px solid rgba(255,255,255,0.08)',
            background: 'transparent',
            color: !hasImage || isProcessing ? '#444' : '#666',
            fontSize: '12px',
            cursor: !hasImage || isProcessing ? 'not-allowed' : 'pointer',
            transition: 'all 180ms ease',
          }}
        >
          {t.resetBtn}
        </button>
      </div>
    </aside>
  );
}
