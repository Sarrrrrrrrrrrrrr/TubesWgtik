/**
 * OverlayDetection Component
 * Tampilkan overlay teks deteksi di atas video dengan animasi fade in
 */
export function OverlayDetection({ className, confidence, color }) {
  if (!className || !confidence) {
    return null;
  }

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

      {/* Text Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-6 animate-fadeIn">
        <div className="text-center space-y-2">
          {/* Class Name */}
          <p
            className="font-mono text-4xl font-bold"
            style={{ color: color || '#639922' }}
          >
            {className}
          </p>

          {/* Confidence */}
          <p className="font-mono text-lg" style={{ color: color || '#639922' }}>
            CONFIDENCE {Math.round(confidence * 100)}%
          </p>
        </div>
      </div>

      {/* CSS Animation */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
