/**
 * Buat debounce function menggunakan closure pattern
 * Hanya jalankan fn setelah delay ms tidak ada pemanggilan baru
 * @param {Function} fn - Fungsi yang akan di-debounce
 * @param {number} delay - Delay dalam millisecond
 * @returns {Function} Debounced function
 */
export function createDebounce(fn, delay = 300) {
  let timeoutId = null;

  return function debounced(...args) {
    // Clear timeout sebelumnya jika ada
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Set timeout baru
    timeoutId = setTimeout(() => {
      fn(...args);
      timeoutId = null;
    }, delay);
  };
}

/**
 * Debounce dengan tracking waktu terakhir dipanggil
 * @param {Function} callback - Fungsi callback
 * @param {number} delay - Delay dalam millisecond
 * @returns {Function} Debounced function
 */
export function debounceDetection(callback, delay = 500) {
  let timeoutId = null;
  let lastCall = 0;

  return function debounced(...args) {
    const now = Date.now();
    const timeSinceLastCall = now - lastCall;

    const execute = () => {
      lastCall = now;
      callback(...args);
    };

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    if (timeSinceLastCall >= delay) {
      execute();
    } else {
      timeoutId = setTimeout(execute, delay - timeSinceLastCall);
    }
  };
}

/**
 * Throttle function - batasi frekuensi pemanggilan
 * @param {Function} callback - Fungsi callback
 * @param {number} limit - Limit waktu dalam millisecond
 * @returns {Function} Throttled function
 */
export function throttleDetection(callback, limit = 500) {
  let inThrottle = false;
  let lastResult = null;

  return function throttled(...args) {
    if (!inThrottle) {
      lastResult = callback(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
    return lastResult;
  };
}

/**
 * Kombinasi debounce dan throttle untuk stabilitas deteksi
 * @param {Function} callback - Fungsi callback
 * @param {number} debounceMs - Debounce delay
 * @param {number} throttleMs - Throttle limit
 * @returns {Function} Stable detection function
 */
export function stableDetection(callback, debounceMs = 300, throttleMs = 500) {
  const debouncedCallback = debounceDetection(callback, debounceMs);
  return throttleDetection(debouncedCallback, throttleMs);
}
