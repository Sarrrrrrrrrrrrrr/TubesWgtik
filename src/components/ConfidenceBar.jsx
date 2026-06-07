/**
 * ConfidenceBar Component
 * Tampilkan bar confidence untuk setiap prediksi
 */
export function ConfidenceBar({ predictions = [] }) {
  return (
    <div className="space-y-3">
      {predictions.length === 0 ? (
        <div className="text-gray-400 text-sm text-center py-4">
          No predictions yet
        </div>
      ) : (
        predictions.map((pred, idx) => (
          <div key={idx} className="space-y-1">
            {/* Class Name */}
            <div className="flex justify-between items-center">
              <span className="text-white font-mono text-sm font-semibold">
                {pred.className}
              </span>
              <span
                className="font-mono text-sm font-bold"
                style={{ color: pred.color || '#639922' }}
              >
                {Math.round(pred.probability * 100)}%
              </span>
            </div>

            {/* Confidence Bar */}
            <div className="w-full bg-gray-700 rounded h-2 overflow-hidden">
              <div
                className="h-full transition-all duration-300 rounded"
                style={{
                  width: `${pred.probability * 100}%`,
                  backgroundColor: pred.color || '#639922',
                }}
              />
            </div>
          </div>
        ))
      )}
    </div>
  );
}
