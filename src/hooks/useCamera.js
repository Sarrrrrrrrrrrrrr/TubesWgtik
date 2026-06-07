import { useEffect, useRef, useState } from 'react';

/**
 * Hook untuk mengakses webcam menggunakan getUserMedia
 * @returns {Object} { videoRef, isActive, error, start, stop }
 */
export function useCamera() {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Minta izin kamera dan set stream ke video element
   */
  const start = async () => {
    try {
      setError(null);

      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'environment', // Back camera untuk mobile
        },
        audio: false,
      });

      // Set stream ke video element
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsActive(true);
      }
    } catch (err) {
      setIsActive(false);

      if (err.name === 'NotAllowedError') {
        setError('Camera permission denied');
      } else if (err.name === 'NotFoundError') {
        setError('No camera found on this device');
      } else {
        setError(`Camera error: ${err.message}`);
      }

      console.error('Camera error:', err);
    }
  };

  /**
   * Stop semua track dan cleanup
   */
  const stop = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
      });
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setIsActive(false);
  };

  /**
   * Cleanup saat component unmount
   */
  useEffect(() => {
    return () => {
      stop();
    };
  }, []);

  return {
    videoRef,
    isActive,
    error,
    start,
    stop,
  };
}
