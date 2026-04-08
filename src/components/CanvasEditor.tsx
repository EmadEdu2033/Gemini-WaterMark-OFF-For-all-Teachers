import { useRef, useEffect, useCallback, useState, forwardRef, useImperativeHandle } from 'react';
import { floodFill } from '../lib/floodFill';
import type { Tool } from '../pages/WatermarkEditor';

interface CanvasEditorProps {
  image: HTMLImageElement;
  activeTool: Tool;
  brushSize: number;
  wandTolerance: number;
  onMaskChange: (hasMask: boolean) => void;
  isProcessing: boolean;
  processingText?: string;
  processingNote?: string;
}

export interface CanvasEditorHandle {
  clearMask: () => void;
  getSourceCanvas: () => HTMLCanvasElement | null;
  getMaskCanvas: () => HTMLCanvasElement | null;
  getResultCanvas: () => HTMLCanvasElement | null;
  showResult: (show: boolean) => void;
}

const MASK_COLOR = 'rgba(255, 0, 0, 0.4)';

export const CanvasEditor = forwardRef<CanvasEditorHandle, CanvasEditorProps>(({
  image,
  activeTool,
  brushSize,
  wandTolerance,
  onMaskChange,
  isProcessing,
  processingText = 'Processing locally on your device...',
  processingNote = 'Your image never leaves your browser',
}, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sourceCanvasRef = useRef<HTMLCanvasElement>(null);
  const maskCanvasRef = useRef<HTMLCanvasElement>(null);
  const resultCanvasRef = useRef<HTMLCanvasElement>(null);

  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
  const [showResult, setShowResult] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const isDrawing = useRef(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);
  const rectStart = useRef<{ x: number; y: number } | null>(null);
  const isPanning = useRef(false);
  const panStart = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);

  useImperativeHandle(ref, () => ({
    clearMask: () => {
      const maskCanvas = maskCanvasRef.current;
      if (!maskCanvas) return;
      const ctx = maskCanvas.getContext('2d')!;
      ctx.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
      onMaskChange(false);
    },
    getSourceCanvas: () => sourceCanvasRef.current,
    getMaskCanvas: () => maskCanvasRef.current,
    getResultCanvas: () => resultCanvasRef.current,
    showResult: (show: boolean) => setShowResult(show),
  }));

  // Draw image on source canvas
  useEffect(() => {
    const container = containerRef.current;
    const sourceCanvas = sourceCanvasRef.current;
    const maskCanvas = maskCanvasRef.current;
    const resultCanvas = resultCanvasRef.current;
    if (!container || !sourceCanvas || !maskCanvas || !resultCanvas) return;

    const cw = container.clientWidth;
    const ch = container.clientHeight;
    const scale = Math.min(cw / image.naturalWidth, ch / image.naturalHeight, 1);
    const w = Math.floor(image.naturalWidth * scale);
    const h = Math.floor(image.naturalHeight * scale);

    setCanvasSize({ width: w, height: h });

    for (const canvas of [sourceCanvas, maskCanvas, resultCanvas]) {
      canvas.width = w;
      canvas.height = h;
    }

    const ctx = sourceCanvas.getContext('2d')!;
    ctx.drawImage(image, 0, 0, w, h);

    setShowResult(false);
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  }, [image]);

  const getCanvasPos = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const canvas = maskCanvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) / zoom,
      y: (e.clientY - rect.top) / zoom,
    };
  }, [zoom]);

  const checkHasMask = useCallback(() => {
    const maskCanvas = maskCanvasRef.current;
    if (!maskCanvas) return;
    const ctx = maskCanvas.getContext('2d')!;
    const data = ctx.getImageData(0, 0, maskCanvas.width, maskCanvas.height).data;
    let hasMask = false;
    for (let i = 3; i < data.length; i += 4) {
      if (data[i] > 0) { hasMask = true; break; }
    }
    onMaskChange(hasMask);
  }, [onMaskChange]);

  const paintBrush = useCallback((x: number, y: number, erase = false) => {
    const maskCanvas = maskCanvasRef.current;
    if (!maskCanvas) return;
    const ctx = maskCanvas.getContext('2d')!;
    ctx.globalCompositeOperation = erase ? 'destination-out' : 'source-over';
    ctx.fillStyle = MASK_COLOR;
    ctx.beginPath();
    ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
  }, [brushSize]);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (isProcessing) return;

    if (e.button === 1 || (e.button === 0 && e.altKey)) {
      isPanning.current = true;
      panStart.current = { x: e.clientX, y: e.clientY, ox: offset.x, oy: offset.y };
      return;
    }

    const pos = getCanvasPos(e);
    isDrawing.current = true;
    lastPos.current = pos;

    if (activeTool === 'brush' || activeTool === 'eraser') {
      paintBrush(pos.x, pos.y, activeTool === 'eraser');
    } else if (activeTool === 'wand') {
      const sourceCanvas = sourceCanvasRef.current;
      const maskCanvas = maskCanvasRef.current;
      if (!sourceCanvas || !maskCanvas) return;
      const ctx = sourceCanvas.getContext('2d')!;
      const imgData = ctx.getImageData(0, 0, sourceCanvas.width, sourceCanvas.height);
      const filled = floodFill(imgData, Math.floor(pos.x), Math.floor(pos.y), wandTolerance, sourceCanvas.width, sourceCanvas.height);
      const maskCtx = maskCanvas.getContext('2d')!;
      const maskData = maskCtx.getImageData(0, 0, maskCanvas.width, maskCanvas.height);
      for (let i = 0; i < filled.length; i++) {
        if (filled[i]) {
          maskData.data[i * 4] = 255;
          maskData.data[i * 4 + 1] = 0;
          maskData.data[i * 4 + 2] = 0;
          maskData.data[i * 4 + 3] = 102;
        }
      }
      maskCtx.putImageData(maskData, 0, 0);
      checkHasMask();
    } else if (activeTool === 'rect') {
      rectStart.current = pos;
    }
  }, [activeTool, brushSize, getCanvasPos, isProcessing, offset, paintBrush, wandTolerance, checkHasMask]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (isPanning.current && panStart.current) {
      const dx = e.clientX - panStart.current.x;
      const dy = e.clientY - panStart.current.y;
      setOffset({ x: panStart.current.ox + dx, y: panStart.current.oy + dy });
      return;
    }

    if (!isDrawing.current || isProcessing) return;
    const pos = getCanvasPos(e);

    if (activeTool === 'brush' || activeTool === 'eraser') {
      if (lastPos.current) {
        const maskCanvas = maskCanvasRef.current;
        if (maskCanvas) {
          const ctx = maskCanvas.getContext('2d')!;
          ctx.globalCompositeOperation = activeTool === 'eraser' ? 'destination-out' : 'source-over';
          ctx.strokeStyle = MASK_COLOR;
          ctx.lineWidth = brushSize;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(lastPos.current.x, lastPos.current.y);
          ctx.lineTo(pos.x, pos.y);
          ctx.stroke();
          ctx.globalCompositeOperation = 'source-over';
        }
      }
      lastPos.current = pos;
      paintBrush(pos.x, pos.y, activeTool === 'eraser');
    }
  }, [activeTool, brushSize, getCanvasPos, isProcessing, paintBrush]);

  const handleMouseUp = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (isPanning.current) {
      isPanning.current = false;
      panStart.current = null;
      return;
    }

    if (activeTool === 'rect' && rectStart.current) {
      const pos = getCanvasPos(e);
      const maskCanvas = maskCanvasRef.current;
      if (maskCanvas) {
        const ctx = maskCanvas.getContext('2d')!;
        const x = Math.min(rectStart.current.x, pos.x);
        const y = Math.min(rectStart.current.y, pos.y);
        const w = Math.abs(pos.x - rectStart.current.x);
        const h = Math.abs(pos.y - rectStart.current.y);
        ctx.fillStyle = MASK_COLOR;
        ctx.fillRect(x, y, w, h);
      }
      rectStart.current = null;
    }

    isDrawing.current = false;
    lastPos.current = null;
    checkHasMask();
  }, [activeTool, getCanvasPos, checkHasMask]);

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(prev => Math.min(Math.max(prev * delta, 0.2), 5));
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [handleWheel]);

  const cursorClass = {
    brush: 'cursor-brush',
    rect: 'cursor-rect',
    wand: 'cursor-wand',
    eraser: 'cursor-eraser',
  }[activeTool] || 'cursor-default';

  return (
    <div
      ref={containerRef}
      className={cursorClass}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={() => {
        if (isDrawing.current) {
          isDrawing.current = false;
          checkHasMask();
        }
        isPanning.current = false;
      }}
      style={{
        flex: 1,
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'repeating-conic-gradient(rgba(255,255,255,0.03) 0% 25%, transparent 0% 50%) 0 0 / 20px 20px',
      }}
    >
      <div
        style={{
          position: 'absolute',
          transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
          transformOrigin: 'center',
          transition: isPanning.current ? 'none' : 'transform 80ms ease',
        }}
      >
        {/* Source canvas (always visible) */}
        <canvas
          ref={sourceCanvasRef}
          style={{
            display: showResult ? 'none' : 'block',
            maxWidth: '100%',
          }}
        />

        {/* Mask overlay canvas */}
        <canvas
          ref={maskCanvasRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            display: showResult ? 'none' : 'block',
            pointerEvents: 'none',
          }}
        />

        {/* Result canvas */}
        <canvas
          ref={resultCanvasRef}
          style={{
            display: showResult ? 'block' : 'none',
            maxWidth: '100%',
          }}
        />
      </div>

      {/* Processing overlay */}
      {isProcessing && (
        <div className="processing-overlay">
          <div style={{ textAlign: 'center' }}>
            <div className="spinner" style={{ margin: '0 auto 16px' }} />
            <div style={{ color: '#3b82f6', fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>
              {processingText}
            </div>
            <div style={{ color: '#555', fontSize: '12px' }}>
              {processingNote}
            </div>
          </div>
        </div>
      )}

      {/* Zoom hint */}
      <div style={{
        position: 'absolute',
        bottom: '16px',
        right: '16px',
        background: 'rgba(0,0,0,0.6)',
        color: '#555',
        fontSize: '11px',
        padding: '4px 8px',
        borderRadius: '4px',
        fontFamily: 'var(--app-font-mono)',
        pointerEvents: 'none',
      }}>
        {Math.round(zoom * 100)}% · Scroll to zoom
      </div>
    </div>
  );
});

CanvasEditor.displayName = 'CanvasEditor';
