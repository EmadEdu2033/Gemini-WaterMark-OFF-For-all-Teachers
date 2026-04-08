export type InpaintAlgorithm = 'TELEA' | 'NS';

export interface InpaintOptions {
  algorithm: InpaintAlgorithm;
  radius: number;
}

export interface InpaintResult {
  success: boolean;
  error?: string;
}

export function performInpainting(
  sourceCanvas: HTMLCanvasElement,
  maskCanvas: HTMLCanvasElement,
  resultCanvas: HTMLCanvasElement,
  options: InpaintOptions
): InpaintResult {
  const cv = window.cv;

  if (!cv) {
    return { success: false, error: 'OpenCV not loaded' };
  }

  let src: any = null;
  let mask: any = null;
  let dst: any = null;
  let maskGray: any = null;
  let maskBin: any = null;
  let dilated: any = null;
  let kernel: any = null;

  try {
    src = cv.imread(sourceCanvas);
    const maskCtx = maskCanvas.getContext('2d')!;
    const maskData = maskCtx.getImageData(0, 0, maskCanvas.width, maskCanvas.height);

    mask = new cv.Mat(maskCanvas.height, maskCanvas.width, cv.CV_8UC1);
    for (let i = 0; i < maskData.data.length; i += 4) {
      const r = maskData.data[i];
      const a = maskData.data[i + 3];
      const pixelIdx = i / 4;
      mask.data[pixelIdx] = (a > 10 && r > 100) ? 255 : 0;
    }

    dilated = new cv.Mat();
    kernel = cv.Mat.ones(3, 3, cv.CV_8U);
    cv.dilate(mask, dilated, kernel);

    dst = new cv.Mat();
    const flags = options.algorithm === 'TELEA' ? cv.INPAINT_TELEA : cv.INPAINT_NS;
    cv.inpaint(src, dilated, dst, options.radius, flags);

    cv.imshow(resultCanvas, dst);

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Inpainting failed' };
  } finally {
    if (src) src.delete();
    if (mask) mask.delete();
    if (dst) dst.delete();
    if (maskGray) maskGray.delete();
    if (maskBin) maskBin.delete();
    if (dilated) dilated.delete();
    if (kernel) kernel.delete();
  }
}

export function autoDetectWatermark(
  sourceCanvas: HTMLCanvasElement,
  maskCanvas: HTMLCanvasElement
): boolean {
  const cv = window.cv;
  if (!cv) return false;

  let src: any = null;
  let gray: any = null;
  let thresh: any = null;
  let contours: any = null;
  let hierarchy: any = null;

  try {
    src = cv.imread(sourceCanvas);
    gray = new cv.Mat();
    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);

    thresh = new cv.Mat();
    cv.threshold(gray, thresh, 200, 255, cv.THRESH_BINARY);

    contours = new cv.MatVector();
    hierarchy = new cv.Mat();
    cv.findContours(thresh, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

    const ctx = maskCanvas.getContext('2d')!;
    ctx.clearRect(0, 0, maskCanvas.width, maskCanvas.height);

    let found = false;
    for (let i = 0; i < contours.size(); i++) {
      const cnt = contours.get(i);
      const area = cv.contourArea(cnt);
      const canvasArea = maskCanvas.width * maskCanvas.height;

      if (area > canvasArea * 0.005 && area < canvasArea * 0.5) {
        const rect = cv.boundingRect(cnt);
        ctx.fillStyle = 'rgba(255, 0, 0, 0.6)';
        ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
        found = true;
      }
      cnt.delete();
    }

    return found;
  } catch {
    return false;
  } finally {
    if (src) src.delete();
    if (gray) gray.delete();
    if (thresh) thresh.delete();
    if (contours) contours.delete();
    if (hierarchy) hierarchy.delete();
  }
}
