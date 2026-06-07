/**
 * Ubah probability (0-1) menjadi persentase string
 * @param {number} probability - 0.0 to 1.0
 * @returns {string} "87%"
 */
export function formatConfidence(probability) {
  const percentage = Math.round(probability * 100);
  return `${percentage}%`;
}

/**
 * Tentukan level confidence
 * @param {number} probability - 0.0 to 1.0
 * @returns {string} "HIGH" | "MEDIUM" | "LOW"
 */
export function getConfidenceLevel(probability) {
  if (probability >= 0.75) return "HIGH";
  if (probability >= 0.45) return "MEDIUM";
  return "LOW";
}

/**
 * Ambil prediksi dengan probability tertinggi
 * @param {Array} predictions - [{className, probability}, ...]
 * @returns {Object} Prediction object dengan probability tertinggi
 */
export function getTopPrediction(predictions) {
  if (!predictions || predictions.length === 0) {
    return null;
  }
  return predictions.reduce((max, current) =>
    current.probability > max.probability ? current : max
  );
}
