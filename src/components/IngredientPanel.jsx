/**
 * IngredientPanel Component
 * Tampilkan info detail bahan yang terdeteksi
 */
export function IngredientPanel({ detectedClass, info, confidence }) {
  // State kosong
  if (!detectedClass || !info) {
    return (
      <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-lg p-6 border border-slate-700 h-full flex flex-col items-center justify-center text-center">
        <div className="text-5xl mb-3">🔍</div>
        <p className="text-slate-300 font-mono">Scan a ingredient to see details</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-lg p-6 border border-slate-700 space-y-5">
      {/* Header - Nama Bahan */}
      <div className="border-b border-slate-600 pb-4">
        <p className="text-xs text-slate-400 font-mono uppercase tracking-widest">
          DETECTED
        </p>
        <h2 className="text-3xl font-bold mt-2" style={{ color: info.color }}>
          {info.name}
        </h2>
        <p className="text-xl font-mono font-bold mt-2" style={{ color: info.color }}>
          {Math.round(confidence.probability * 100)}%
        </p>
      </div>

      {/* Confidence Bar Utama */}
      <div>
        <div className="w-full bg-slate-700 rounded h-3 overflow-hidden">
          <div
            className="h-full transition-all duration-300 rounded"
            style={{
              width: `${confidence.probability * 100}%`,
              backgroundColor: info.color,
            }}
          />
        </div>
      </div>

      {/* Deskripsi Bahan */}
      <div>
        <p className="text-xs text-slate-400 font-mono uppercase tracking-widest mb-2">
          Description
        </p>
        <p className="text-slate-300 text-sm leading-relaxed">
          {info.description}
        </p>
      </div>

      {/* Resep */}
      {info.recipes && info.recipes.length > 0 && (
        <div>
          <p className="text-xs text-slate-400 font-mono uppercase tracking-widest mb-2">
            Recipes
          </p>
          <div className="grid grid-cols-2 gap-2">
            {info.recipes.map((recipe, idx) => (
              <div
                key={idx}
                className="bg-slate-700 rounded px-3 py-2 text-sm text-center text-slate-200 border border-slate-600 hover:border-slate-500 transition-colors"
              >
                {recipe}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tips */}
      {info.tips && (
        <div className="bg-slate-700/50 rounded px-4 py-3 border-l-2" style={{ borderLeftColor: info.color }}>
          <p className="text-xs text-slate-400 font-mono uppercase tracking-widest mb-1">
            Storage Tip
          </p>
          <p className="text-sm text-slate-300">{info.tips}</p>
        </div>
      )}
    </div>
  );
}
