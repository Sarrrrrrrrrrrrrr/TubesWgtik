/**
 * FrameProcessor untuk capture frame dari video dan jalankan inference
 */
export class FrameProcessor {
  constructor(model) {
    this.model = model;
    this.loopId = null;
    this.isRunning = false;
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
  }

  /**
   * Mulai loop inference
   * @param {HTMLVideoElement} videoElement - Video element
   * @param {Object} model - Model dari Teachable Machine
   * @param {Function} callback - Callback untuk hasil predictions
   * @param {number} interval - Interval dalam millisecond (default 200ms)
   */
  startLoop(videoElement, model, callback, interval = 200) {
    if (this.isRunning) {
      console.warn('Loop sudah berjalan');
      return;
    }

    this.model = model;
    this.isRunning = true;

    this.loopId = setInterval(async () => {
      try {
        // Capture frame dari video element
        if (
          videoElement &&
          videoElement.readyState === videoElement.HAVE_ENOUGH_DATA
        ) {
          // Set canvas size sesuai video
          this.canvas.width = videoElement.videoWidth;
          this.canvas.height = videoElement.videoHeight;

          // Draw video frame ke canvas
          this.ctx.drawImage(videoElement, 0, 0);

          // Convert canvas ke image untuk inference
          const img = new Image();
          img.src = this.canvas.toDataURL('image/jpeg');

          img.onload = async () => {
            try {
              // Run prediction
              const predictions = await this.model.predict(img);

              // Convert ke format yang kita inginkan
              const formatted = predictions.map((pred) => ({
                className: pred.className,
                probability: pred.probability,
              }));

              // Panggil callback
              callback(formatted);
            } catch (err) {
              console.error('Prediction error:', err);
            }
          };
        }
      } catch (error) {
        console.error('Frame processing error:', error);
      }
    }, interval);
  }

  /**
   * Stop loop inference
   */
  stopLoop() {
    if (this.loopId) {
      clearInterval(this.loopId);
      this.loopId = null;
      this.isRunning = false;
    }
  }

  /**
   * Check apakah loop sedang berjalan
   * @returns {boolean}
   */
  isRunning() {
    return this.isRunning;
  }

  /**
   * Dispose resources
   */
  dispose() {
    this.stopLoop();
    if (this.canvas) {
      this.canvas = null;
    }
  }
}
