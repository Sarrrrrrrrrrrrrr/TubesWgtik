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
        <div className="pt-2">
          <p className="text-xs text-slate-400 font-mono uppercase tracking-widest mb-6">
            Recipes
          </p>
          <div className="grid grid-cols-2 gap-3">
            {info.recipes.map((recipe, idx) => (
              <div
                key={idx}
                className="bg-[#F5F0E8] rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.06)] p-4 relative flex flex-col pt-8 mt-2"
              >
                {/* Gambar/ilustrasi bahan yang overflow */}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center text-2xl border-[3px] border-[#F5F0E8] z-10">
                  🍽️
                </div>
                
                <h3 className="font-[Poppins] font-bold uppercase text-[18px] text-[#1A1A1A] text-center leading-tight">
                  {recipe}
                </h3>
                
                <p className="font-[Inter] text-[13px] text-[#666666] text-center mt-1 line-clamp-1">
                  Resep lezat {info.name.toLowerCase()}
                </p>
                
                <div className="mt-3 text-center">
                  <span className="text-[11px] tracking-widest text-[#E67E22] font-bold uppercase cursor-pointer">
                    LIHAT DETAIL →
                  </span>
                </div>
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
