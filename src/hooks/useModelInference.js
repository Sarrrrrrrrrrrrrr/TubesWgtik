import { useState, useEffect, useRef } from 'react';
import { ModelLoader } from '../services/ModelLoader';
import { FrameProcessor } from '../services/FrameProcessor';
import { ThresholdGuard } from '../services/ThresholdGuard';

/**
 * Hook untuk ML inference dengan Teachable Machine
 * @param {Object} videoRef - Video ref dari useCamera
 * @param {string} modelUrl - URL model (default: '/model/')
 * @returns {Object} { predictions, confirmedClass, isModelLoaded, startInference, stopInference }
 */
export function useModelInference(videoRef, modelUrl = '/model/') {
  // State
  const [predictions, setPredictions] = useState([]);
  const [confirmedClass, setConfirmedClass] = useState(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [error, setError] = useState(null);

  // Refs
  const modelLoaderRef = useRef(null);
  const frameProcessorRef = useRef(null);
  const thresholdGuardRef = useRef(null);

  /**
   * Load model saat component mount
   */
  useEffect(() => {
    const loadModel = async () => {
      try {
        setError(null);

        // Buat instance ModelLoader
        modelLoaderRef.current = new ModelLoader();

        // Load model
        const model = await modelLoaderRef.current.load(modelUrl);

        // Buat FrameProcessor
        frameProcessorRef.current = new FrameProcessor(model);

        // Buat ThresholdGuard
        thresholdGuardRef.current = new ThresholdGuard();

        setIsModelLoaded(true);
      } catch (err) {
        setError(err.message || 'Failed to load model');
        setIsModelLoaded(false);
        console.error('Model load error:', err);
      }
    };

    loadModel();

    // Cleanup
    return () => {
      if (frameProcessorRef.current) {
        frameProcessorRef.current.dispose();
      }
      if (modelLoaderRef.current) {
        modelLoaderRef.current.dispose();
      }
    };
  }, [modelUrl]);

  /**
   * Start inference loop
   */
  const startInference = () => {
    if (!videoRef?.current || !frameProcessorRef.current) {
      console.warn('VideoRef atau FrameProcessor tidak ready');
      return;
    }

    const model = modelLoaderRef.current.model;
    if (!model) {
      console.warn('Model belum siap');
      return;
    }

    // Start frame processor loop
    frameProcessorRef.current.startLoop(
      videoRef.current,
      model,
      (framePredictions) => {
        // Update predictions state
        setPredictions(framePredictions);

        // Evaluate dengan ThresholdGuard
        if (thresholdGuardRef.current) {
          thresholdGuardRef.current.evaluate(
            framePredictions,
            (confirmed) => {
              // Callback saat confirmed
              if (confirmed.className !== 'Background') {
                setConfirmedClass(confirmed);
              } else {
                setConfirmedClass(null);
              }
            },
            (lowConfidence) => {
              // Callback saat low confidence
              setConfirmedClass(null);
            }
          );
        }
      },
      200 // 200ms interval
    );
  };

  /**
   * Stop inference loop
   */
  const stopInference = () => {
    if (frameProcessorRef.current) {
      frameProcessorRef.current.stopLoop();
    }
    if (thresholdGuardRef.current) {
      thresholdGuardRef.current.reset();
    }
    setConfirmedClass(null);
  };

  return {
    predictions,
    confirmedClass,
    isModelLoaded,
    error,
    startInference,
    stopInference,
  };
}
