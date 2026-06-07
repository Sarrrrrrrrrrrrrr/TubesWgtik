import { useState, useEffect, useRef } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as tmImage from '@teachablemachine/image';
import './App.css';

// ============================================================================
// RECIPE DATABASE - Database Resep Lokal
// ============================================================================
const RECIPE_DATABASE = [
  {
    id: 1,
    name: 'Sambal Tomat',
    ingredients: ['Bawang Merah', 'Tomat'],
    description: 'Sambal tomat pedas manis yang segar, cocok untuk lauk gorengan.',
    difficulty: 'Mudah',
    cookTime: '15 menit',
  },
  {
    id: 2,
    name: 'Tumis Duo Bawang',
    ingredients: ['Bawang Merah', 'Bawang Putih'],
    description: 'Bumbu tumisan dasar aromatis yang harum khas masakan rumah.',
    difficulty: 'Mudah',
    cookTime: '10 menit',
  },
  {
    id: 3,
    name: 'Sup Tomat Gurih',
    ingredients: ['Bawang Merah', 'Bawang Putih', 'Tomat'],
    description: 'Sup hangat dengan kombinasi rasa asam segar dan kaldu gurih.',
    difficulty: 'Sedang',
    cookTime: '30 menit',
  },
  {
    id: 4,
    name: 'Sambel Rawit Bawang',
    ingredients: ['Bawang Putih', 'Tomat'],
    description: 'Sambel korek dengan sengatan pedas alami yang menggugah selera.',
    difficulty: 'Mudah',
    cookTime: '12 menit',
  },
  {
    id: 5,
    name: 'Sayuran Hijau Tumis',
    ingredients: ['Bawang Merah', 'Bawang Putih', 'Sayuran Hijau'],
    description: 'Tumisan sayur sehat kaya serat, dimasak cepat agar tetap renyah.',
    difficulty: 'Mudah',
    cookTime: '15 menit',
  },
  {
    id: 6,
    name: 'Sambal Matah Bali',
    ingredients: ['Bawang Merah', 'Bawang Putih', 'Cabai Merah'],
    description: 'Sambal iris khas yang segar tanpa diulek maupun dimasak lama.',
    difficulty: 'Sedang',
    cookTime: '20 menit',
  },
  {
    id: 7,
    name: 'Gulai Sayuran Segar',
    ingredients: ['Bawang Merah', 'Bawang Putih', 'Sayuran Hijau', 'Tomat'],
    description: 'Sayur kuah santan kuning yang kaya rasa bumbu rempah tradisional.',
    difficulty: 'Sedang',
    cookTime: '40 menit',
  },
  {
    id: 8,
    name: 'Sambal Ijo Pedas',
    ingredients: ['Bawang Putih', 'Sayuran Hijau', 'Cabai Merah'],
    description: 'Variasi sambal hijau pelengkap hidangan padang.',
    difficulty: 'Mudah',
    cookTime: '15 menit',
  },
];

const INGREDIENT_INFO = {
  'Bawang Merah': { emoji: '🧅', badge: 'bg-rose-100 text-rose-800 border-rose-200' },
  'Bawang Putih': { emoji: '🧄', badge: 'bg-amber-100 text-amber-900 border-amber-200' },
  'Cabai Merah': { emoji: '🌶️', badge: 'bg-red-100 text-red-800 border-red-200' },
  'Sayuran Hijau': { emoji: '🥬', badge: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  'Tomat': { emoji: '🍅', badge: 'bg-orange-100 text-orange-800 border-orange-200' },
  'Background': { emoji: '🍽️', badge: 'bg-slate-100 text-slate-700 border-slate-200' },
};

export default function App() {
  // ========== STATE MANAGEMENT ==========
  const [cart, setCart] = useState([]);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false); // SAKLAR KAMERA YANG BENER
  const [isInferenceRunning, setIsInferenceRunning] = useState(false);
  const [currentDetection, setCurrentDetection] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [modelLoadingProgress, setModelLoadingProgress] = useState(0);
  const [detectionConfidence, setDetectionConfidence] = useState(null);

  // ========== REFS ==========
  const videoRef = useRef(null);
  const modelRef = useRef(null);
  const inferenceIntervalRef = useRef(null);

  // ========== MODEL JALUR LOKAL ==========
  const MODEL_URL = '/model/';

  // ========== LOAD MODEL OTOMATIS ==========
  useEffect(() => {
    const loadModel = async () => {
      try {
        setModelLoadingProgress(30);
        const model = await tmImage.load(MODEL_URL + 'model.json', MODEL_URL + 'metadata.json');
        
        setModelLoadingProgress(70);
        modelRef.current = model;
        setIsModelLoaded(true);
        setModelLoadingProgress(100);
      } catch (err) {
        console.error('Error loading model:', err);
        setIsModelLoaded(false);
      }
    };
    loadModel();

    return () => {
      if (inferenceIntervalRef.current) clearInterval(inferenceIntervalRef.current);
    };
  }, []);

  // ========== LOGIKA KAMERA ANTI-MACET ==========
  const toggleCamera = async () => {
    if (isCameraOn) {
      // PROSES MATIKAN KAMERA
      stopInference(); // Pastikan AI mati dulu
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
      setIsCameraOn(false);
      setPredictions([]);
      setCurrentDetection(null);
    } else {
      // PROSES NYALAKAN KAMERA
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          setIsCameraOn(true);
        }
      } catch (err) {
        console.error('Error accessing camera:', err);
        alert('Gagal mengakses webcam laptop. Cek izin browser lo!');
      }
    }
  };

  const startInference = () => {
    if (!isModelLoaded || !isCameraOn) {
      alert('Nyalakan kamera terlebih dahulu jerr');
      return;
    }

    setIsInferenceRunning(true);

    inferenceIntervalRef.current = setInterval(async () => {
      try {
        if (videoRef.current && modelRef.current && isCameraOn) {
          const preds = await modelRef.current.predict(videoRef.current);
          setPredictions(preds);

          const detected = preds
            .filter((p) => p.className !== 'Background' && p.probability >= 0.75)
            .sort((a, b) => b.probability - a.probability)[0];

          if (detected) {
            setCurrentDetection(detected.className);
            setDetectionConfidence(detected.probability);
          } else {
            setCurrentDetection(null);
            setDetectionConfidence(null);
          }
        }
      } catch (err) {
        console.error('Inference error:', err);
      }
    }, 150);
  };

  const stopInference = () => {
    setIsInferenceRunning(false);
    if (inferenceIntervalRef.current) {
      clearInterval(inferenceIntervalRef.current);
      inferenceIntervalRef.current = null;
    }
    setCurrentDetection(null);
    setDetectionConfidence(null);
  };

  // ========== CART MANAGEMENT ==========
  const addToCart = (ingredient) => {
    if (ingredient && !cart.includes(ingredient)) {
      setCart([...cart, ingredient]);
    }
  };

  const removeFromCart = (ingredient) => {
    setCart(cart.filter((item) => item !== ingredient));
  };

  // ========== RECIPE MATCHING (LOGIKA REKOMENDASI CERDAS) ==========
  const matchedRecipes = RECIPE_DATABASE.filter((recipe) =>
    // Asal ada MINIMAL 1 bahan di keranjang yang cocok dengan resep, resepnya muncul
    recipe.ingredients.some((ingredient) => cart.includes(ingredient))
  ).sort((a, b) => {
    // Urutkan resep dari yang bahan cocoknya paling banyak ke yang paling sedikit
    const matchA = a.ingredients.filter(ing => cart.includes(ing)).length;
    const matchB = b.ingredients.filter(ing => cart.includes(ing)).length;
    return matchB - matchA;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-mono antialiased">
      
      {/* HEADER FRESH CULINARY */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-50 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl"></span>
          <div>
            <h1 className="text-xl font-black tracking-tight text-orange-600">Smart Ingredient Scanner</h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Fresh Kitchen Edition</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
            isInferenceRunning 
              ? 'bg-orange-50 text-orange-600 border-orange-200 animate-pulse' 
              : 'bg-slate-100 text-slate-600 border-slate-200'
          }`}>
            ● STATUS: {!isModelLoaded ? 'LOADING MODEL' : !isCameraOn ? 'KAMERA OFF' : isInferenceRunning ? 'SCANNING ACTIVE' : 'READY'}
          </span>
        </div>
      </header>

      {/* MAIN LAYOUT SPLIT */}
      <div className="max-w-7xl mx-auto p-6 flex flex-col lg:flex-row gap-6 h-[calc(100vh-80px)] overflow-hidden">
        
        {/* ================= LEFT COLUMN ================= */}
        <div className="w-full lg:w-3/5 flex flex-col gap-4 h-full">
          
          <div className="flex-1 relative bg-slate-900 border-2 border-slate-200 rounded-2xl overflow-hidden shadow-inner flex items-center justify-center">
            {isInferenceRunning && (
              <div className="absolute inset-0 z-20 pointer-events-none">
                <div className="absolute w-full h-1 bg-gradient-to-r from-transparent via-orange-400 to-transparent opacity-80 animate-[scanLine_2.5s_ease-in-out_infinite]" style={{ top: '0%' }}></div>
              </div>
            )}

            <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />

            {/* OVERLAY DETEKSI */}
            {isCameraOn && currentDetection && detectionConfidence !== null && (
              <div className="absolute bottom-6 left-6 right-6 z-30 animate-[fadeIn_0.3s_ease-out_forwards]">
                <div className="bg-white/95 backdrop-blur-md border-2 border-orange-400 rounded-xl p-4 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl p-2 bg-orange-50 rounded-lg">
                      {INGREDIENT_INFO[currentDetection]?.emoji || '🥕'}
                    </span>
                    <div>
                      <p className="text-slate-900 font-extrabold text-lg">{currentDetection}</p>
                      <p className="text-orange-600 text-xs font-bold">
                        Akurasi Match: {(detectionConfidence * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => addToCart(currentDetection)}
                    className={`w-full md:w-auto py-2.5 px-6 rounded-lg font-bold text-sm transition-all shadow ${
                      cart.includes(currentDetection)
                        ? 'bg-slate-100 text-slate-400 cursor-default border border-slate-200'
                        : 'bg-orange-500 hover:bg-orange-600 text-white active:scale-95'
                    }`}
                    disabled={cart.includes(currentDetection)}
                  >
                    {cart.includes(currentDetection) ? '✓ Ada di Keranjang' : '+ MASUKKAN KERANJANG'}
                  </button>
                </div>
              </div>
            )}

            {!isModelLoaded && (
              <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center z-40">
                <div className="w-14 h-14 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-slate-800 font-bold text-sm">Menghubungkan ke Teachable Machine...</p>
                <span className="inline-block bg-orange-100 text-orange-700 text-xs px-3 py-1 rounded-full font-bold mt-2">
                  {modelLoadingProgress}% Selesai
                </span>
              </div>
            )}

            {!isCameraOn && isModelLoaded && (
              <div className="absolute inset-0 bg-slate-100 flex flex-col items-center justify-center z-30 p-4 text-center">
                <span className="text-5xl mb-2">📸</span>
                <p className="text-slate-700 font-bold">Sistem Kamera Siap Digunakan</p>
                <p className="text-slate-400 text-xs mt-1">Tekan tombol "Nyalakan Kamera" untuk mengaktifkan WebRTC feed.</p>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={toggleCamera}
              className={`flex-1 py-3 px-4 font-bold rounded-xl transition-all shadow-md active:scale-95 text-center text-sm ${
                isCameraOn ? 'bg-slate-800 hover:bg-slate-900 text-white' : 'bg-orange-500 hover:bg-orange-600 text-white'
              }`}
            >
              {isCameraOn ? '⏸ Matikan Kamera' : '▶ Nyalakan Kamera'}
            </button>

            <button
              onClick={() => (isInferenceRunning ? stopInference() : startInference())}
              disabled={!isModelLoaded || !isCameraOn}
              className="flex-1 py-3 px-4 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed text-sm"
            >
              {isInferenceRunning ? '⏹ Hentikan Scan AI' : '🔍 Deteksi Bahan Masakan'}
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
              <h3 className="text-slate-900 font-black text-sm flex items-center gap-2">
                Bahan di Keranjang 
                <span className="bg-orange-500 text-white text-xs font-bold px-2 py-0.2 rounded-md">{cart.length}</span>
              </h3>
              {cart.length > 0 && (
                <button onClick={() => setCart([])} className="text-red-500 hover:text-red-600 text-xs font-bold transition-colors">
                  [Kosongkan]
                </button>
              )}
            </div>

            {cart.length === 0 ? (
              <p className="text-slate-400 text-xs text-center py-4 italic">Keranjang kosong. Scan bahan masakan di atas.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {cart.map((ingredient) => (
                  <div key={ingredient} className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold border shadow-sm ${INGREDIENT_INFO[ingredient]?.badge || 'bg-slate-100'}`}>
                    <span>{INGREDIENT_INFO[ingredient]?.emoji}</span>
                    <span>{ingredient}</span>
                    <button onClick={() => removeFromCart(ingredient)} className="ml-1 text-slate-400 hover:text-slate-900 font-black">✕</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ================= RIGHT COLUMN ================= */}
        <div className="w-full lg:w-2/5 flex flex-col gap-4 h-full overflow-hidden">
          
          <div className="flex-1 bg-white border border-slate-200 rounded-xl p-5 shadow-sm overflow-y-auto flex flex-col">
            <h3 className="text-slate-900 font-black text-base mb-4 sticky top-0 bg-white pb-2 border-b border-slate-100 flex items-center justify-between">
              <span>📖 Rekomendasi Menu Masak</span>
              <span className="text-xs text-orange-600 bg-orange-50 px-2 py-0.5 rounded font-bold">
                {matchedRecipes.length} Menu Cocok
              </span>
            </h3>

            {cart.length === 0 ? (
              <div className="text-center py-8 my-auto space-y-2">
                <span className="text-4xl block">🥗</span>
                <p className="text-slate-400 text-xs">Belum ada resep terbuka.</p>
              </div>
            ) : matchedRecipes.length === 0 ? (
              <div className="text-center py-8 my-auto p-4 border border-dashed border-amber-200 bg-amber-50/40 rounded-xl text-amber-800 space-y-1">
                <p className="text-xs font-bold">⚠️ Kombinasi Menu Belum Ditemukan</p>
                <p className="text-[11px] text-slate-500">Coba variasikan atau tambahkan komponen bahan.</p>
              </div>
            ) : (
              <div className="space-y-3 pr-1">
                {matchedRecipes.map((recipe) => (
                  <div key={recipe.id} className="p-4 bg-slate-50 hover:bg-orange-50/30 border border-slate-200 hover:border-orange-200 rounded-xl transition-all duration-200">
                    <div className="flex items-start justify-between mb-1">
                      <div>
                        <h4 className="text-slate-900 font-black text-sm">{recipe.name}</h4>
                        <p className="text-slate-500 text-xs mt-0.5 leading-relaxed">{recipe.description}</p>
                      </div>
                      <span className="text-[10px] bg-orange-100 text-orange-800 px-2 py-0.5 rounded font-bold shrink-0">{recipe.difficulty}</span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-3 pt-2 border-t border-slate-200/60">
                      <div className="flex flex-wrap gap-1">
                        {recipe.ingredients.map((ingredient) => (
                          <span key={ingredient} className="text-[10px] px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-600 font-semibold">
                            {INGREDIENT_INFO[ingredient]?.emoji} {ingredient}
                          </span>
                        ))}
                      </div>
                      <span className="text-slate-500 text-[11px] font-bold whitespace-nowrap">⏱️ {recipe.cookTime}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <h3 className="text-slate-900 font-black text-sm mb-3 border-b border-slate-100 pb-2">📊 Live AI Confidence Monitor</h3>

            <div className="space-y-2.5">
              {predictions.length === 0 ? (
                <p className="text-slate-400 text-xs text-center py-2 italic">Nyalakan kamera dan deteksi untuk melihat grafik probabilitas.</p>
              ) : (
                predictions.map((pred, idx) => {
                  const pct = (pred.probability * 100).toFixed(1);
                  const isHigh = pred.probability >= 0.75;
                  
                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <div className="flex items-center gap-1.5 font-bold text-slate-700">
                          <span>{INGREDIENT_INFO[pred.className]?.emoji || '•'}</span>
                          <span className={isHigh ? "text-orange-600 font-extrabold" : ""}>{pred.className}</span>
                        </div>
                        <span className={`font-bold ${isHigh ? 'text-orange-600' : 'text-slate-400'}`}>{pct}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200 shadow-inner">
                        <div className={`h-full transition-all duration-200 rounded-full ${isHigh ? 'bg-gradient-to-r from-orange-400 to-orange-500' : pred.probability >= 0.45 ? 'bg-gradient-to-r from-amber-400 to-yellow-400' : 'bg-slate-300'}`} style={{ width: `${pct}%` }}></div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes scanLine {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}