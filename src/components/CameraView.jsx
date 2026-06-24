/**
 * CameraView Component
 * Tampilkan video feed dari kamera dengan scan line animasi
 */
export function CameraView({ videoRef, isActive, detectedClass, confidence }) {
  return (
    <div className="relative w-full h-full bg-black rounded-lg overflow-hidden">
      {/* Video Element */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover"
      />

      {/* Corner Brackets */}
      {isActive && (
        <>
          {/* Top-left */}
          <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-green-500 rounded-tl-lg" />
          {/* Top-right */}
          <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-green-500 rounded-tr-lg" />
          {/* Bottom-left */}
          <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-green-500 rounded-bl-lg" />
          {/* Bottom-right */}
          <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-green-500 rounded-br-lg" />
        </>
      )}

      {/* Scan Line Animation */}
      {isActive && (
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="w-full h-1 bg-linear-to-b from-green-500 via-green-400 to-transparent opacity-60"
            style={{
              animation: 'scanLine 2s linear infinite',
            }}
          />
        </div>
      )}

      {/* Detection Overlay */}
      {detectedClass && (
        <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black via-black/50 to-transparent px-4 py-3">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-green-400 font-mono text-sm">DETECTED</p>
              <p className="text-white font-bold text-xl">{detectedClass}</p>
            </div>
            <div className="text-right">
              <p className="text-green-400 font-mono text-lg font-bold">
                {confidence}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Inactive Placeholder */}
      {!isActive && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60">
          <div className="text-center">
            <div className="text-6xl text-green-500 mb-3">📷</div>
            <p className="text-white font-mono">CAMERA INACTIVE</p>
          </div>
        </div>
      )}

      {/* CSS Animation */}
      <style>{`
        @keyframes scanLine {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(100%);
          }
        }
      `}</style>
    </div>
  );
}
