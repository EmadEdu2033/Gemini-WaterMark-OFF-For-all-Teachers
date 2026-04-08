import { useState, useEffect } from 'react';

export type OpenCVStatus = 'loading' | 'ready' | 'error';

let cvLoaded = false;
let cvLoadPromise: Promise<void> | null = null;

function loadOpenCV(): Promise<void> {
  if (cvLoaded) return Promise.resolve();
  if (cvLoadPromise) return cvLoadPromise;

  cvLoadPromise = new Promise((resolve, reject) => {
    if (typeof window !== 'undefined' && window.cv) {
      cvLoaded = true;
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://docs.opencv.org/4.8.0/opencv.js';
    script.async = true;

    script.onload = () => {
      const checkReady = () => {
        if (window.cv && window.cv.Mat) {
          cvLoaded = true;
          resolve();
        } else {
          setTimeout(checkReady, 100);
        }
      };
      checkReady();
    };

    script.onerror = () => reject(new Error('Failed to load OpenCV.js'));
    document.head.appendChild(script);
  });

  return cvLoadPromise;
}

export function useOpenCV() {
  const [status, setStatus] = useState<OpenCVStatus>(cvLoaded ? 'ready' : 'loading');

  useEffect(() => {
    if (cvLoaded) {
      setStatus('ready');
      return;
    }

    loadOpenCV()
      .then(() => setStatus('ready'))
      .catch(() => setStatus('error'));
  }, []);

  return { status, isReady: status === 'ready' };
}
