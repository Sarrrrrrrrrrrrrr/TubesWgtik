/**
 * ThresholdGuard untuk stabilitas dan filtering prediksi
 * Prevent flicker dengan requirement confidence tinggi dan konsistensi waktu
 */
export class ThresholdGuard {
  // Konstanta
  static THRESHOLD = 0.75; // 75% confidence minimum
  static STABLE_DURATION = 800; // 800ms untuk stabilitas

  constructor() {
    this.threshold = ThresholdGuard.THRESHOLD;
    this.stableDuration = ThresholdGuard.STABLE_DURATION;

    // State tracking
    this.lastConfirmedClass = null;
    this.lastClassName = null;
    this.confirmTimer = null;
    this.startTime = null;
  }

  /**
   * Evaluate predictions dengan threshold dan stability check
   * @param {Array} predictions - [{className, probability}, ...]
   * @param {Function} onConfirmed - Callback saat terdeteksi stabil
   * @param {Function} onLow - Callback saat confidence rendah
   */
  evaluate(predictions, onConfirmed, onLow) {
    if (!predictions || predictions.length === 0) {
      this.reset();
      if (onLow) onLow(null);
      return;
    }

    // Get prediksi dengan probability tertinggi
    const topPrediction = predictions.reduce((max, current) =>
      current.probability > max.probability ? current : max
    );

    // Check threshold
    if (topPrediction.probability < this.threshold) {
      // Confidence terlalu rendah
      this.reset();
      if (onLow) onLow(topPrediction);
      return;
    }

    // Confidence cukup tinggi
    const currentClassName = topPrediction.className;

    // Cek apakah kelas berubah
    if (currentClassName !== this.lastClassName) {
      // Kelas berbeda, reset timer (prevent flicker)
      this.reset();
      this.lastClassName = currentClassName;
      this.startTime = Date.now();

      // Set timer untuk stability check
      this.confirmTimer = setTimeout(() => {
        // Setelah 800ms, confirm bahwa ini stabil
        if (this.lastClassName === currentClassName) {
          this.lastConfirmedClass = currentClassName;
          if (onConfirmed) {
            onConfirmed({
              className: currentClassName,
              probability: topPrediction.probability,
            });
          }
        }
      }, this.stableDuration);
    } else {
      // Kelas sama dengan sebelumnya
      const elapsedTime = Date.now() - this.startTime;

      // Jika sudah stabil dan timer sudah selesai, confirm
      if (
        elapsedTime >= this.stableDuration &&
        this.lastConfirmedClass === currentClassName
      ) {
        if (onConfirmed) {
          onConfirmed({
            className: currentClassName,
            probability: topPrediction.probability,
          });
        }
      }
    }
  }

  /**
   * Reset state
   */
  reset() {
    if (this.confirmTimer) {
      clearTimeout(this.confirmTimer);
      this.confirmTimer = null;
    }
    this.lastClassName = null;
    this.lastConfirmedClass = null;
    this.startTime = null;
  }

  /**
   * Set custom threshold
   * @param {number} value - Nilai antara 0-1
   */
  setThreshold(value) {
    this.threshold = Math.max(0, Math.min(1, value));
  }

  /**
   * Set custom stable duration
   * @param {number} ms - Durasi dalam millisecond
   */
  setStableDuration(ms) {
    this.stableDuration = Math.max(0, ms);
  }

  /**
   * Get last confirmed class
   * @returns {string|null}
   */
  getLastConfirmedClass() {
    return this.lastConfirmedClass;
  }
}
