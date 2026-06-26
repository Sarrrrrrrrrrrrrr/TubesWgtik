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
    image: 'https://images.pexels.com/photos/15661866/pexels-photo-15661866.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
    rating: '4.91',
    likes: '87',
    instructions: [
      'Iris tipis bawang merah dan tomat.',
      'Goreng bawang merah dan tomat hingga layu.',
      'Ulek kasar bawang merah, tomat, cabai rawit, terasi bakar, garam, dan gula.',
      'Sajikan sambal dengan perasan jeruk limau.'
    ],
    fullIngredients: [
      '3 siung Bawang Merah',
      '2 buah Tomat Segar',
      '5 buah Cabai Merah',
      '1 sdt Terasi Bakar',
      'Secukupnya Garam & Gula'
    ],
    videoUrl: 'https://www.youtube.com/watch?v=OCiL-Rj52ro'
  },
  {
    id: 2,
    name: 'Tumis Duo Bawang',
    ingredients: ['Bawang Merah', 'Bawang Putih'],
    description: 'Bumbu tumisan dasar aromatis yang harum khas masakan rumah.',
    difficulty: 'Mudah',
    cookTime: '10 menit',
    image: 'https://images.pexels.com/photos/37073152/pexels-photo-37073152.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
    rating: '4.85',
    likes: '52',
    instructions: [
      'Kupas dan iris tipis bawang merah dan bawang putih.',
      'Panaskan minyak goreng dalam wajan.',
      'Tumis bawang hingga harum dan berwarna kecokelatan.',
      'Tambahkan sedikit garam, merica, dan penyedap rasa.',
      'Sajikan sebagai bumbu siraman atau lauk praktis.'
    ],
    fullIngredients: [
      '5 siung Bawang Merah',
      '5 siung Bawang Putih',
      '2 sdm Minyak Goreng',
      'Secukupnya Garam, Merica, & Penyedap'
    ],
    videoUrl: 'https://www.youtube.com/watch?v=6K4z-pGI3ow'
  },
  {
    id: 3,
    name: 'Sup Tomat Gurih',
    ingredients: ['Bawang Merah', 'Bawang Putih', 'Tomat'],
    description: 'Sup hangat dengan kombinasi rasa asam segar dan kaldu gurih.',
    difficulty: 'Sedang',
    cookTime: '30 menit',
    image: 'https://images.pexels.com/photos/17302314/pexels-photo-17302314.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
    rating: '4.76',
    likes: '41',
    instructions: [
      'Tumis bawang merah dan bawang putih hingga wangi.',
      'Masukkan tomat potong dan air secukupnya, rebus hingga mendidih.',
      'Haluskan sup dengan blender atau saring jika ingin kuah yang lembut.',
      'Bumbui dengan garam, gula, kaldu ayam, dan merica bubuk.',
      'Sajikan hangat dengan taburan daun seledri atau roti panggang.'
    ],
    fullIngredients: [
      '3 buah Tomat Merah Matang',
      '3 siung Bawang Merah',
      '2 siung Bawang Putih',
      '500 ml Air / Kaldu Ayam',
      'Secukupnya Garam, Gula, Kaldu Bubuk, & Seledri'
    ],
    videoUrl: 'https://www.youtube.com/watch?v=7rLJkWmJpE8'
  },
  {
    id: 4,
    name: 'Sambel Rawit Bawang',
    ingredients: ['Bawang Putih', 'Cabai Merah'],
    description: 'Sambel korek dengan sengatan pedas alami yang menggugah selera.',
    difficulty: 'Mudah',
    cookTime: '12 menit',
    image: 'https://images.pexels.com/photos/37081048/pexels-photo-37081048.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
    rating: '4.90',
    likes: '96',
    instructions: [
      'Ulek kasar bawang putih, cabai rawit merah, dan garam.',
      'Panaskan minyak sisa gorengan hingga benar-benar panas.',
      'Siramkan minyak panas ke atas ulekan sambal.',
      'Aduk rata dan sajikan selagi hangat bersama ayam atau bebek goreng.'
    ],
    fullIngredients: [
      '3 siung Bawang Putih',
      '15 buah Cabai Rawit Merah',
      '3 sdm Minyak Goreng Panas',
      '1/2 sdt Garam'
    ],
    videoUrl: 'https://www.youtube.com/watch?v=tXAuwTuniNQ'
  },
  {
    id: 5,
    name: 'Tumis Bayam Bawang',
    ingredients: ['Bawang Merah', 'Bawang Putih', 'Bayam'],
    description: 'Tumisan bayam segar dengan aroma bawang harum, kaya zat besi dan vitamin.',
    difficulty: 'Mudah',
    cookTime: '10 menit',
    image: 'https://images.pexels.com/photos/37107041/pexels-photo-37107041.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
    rating: '4.82',
    likes: '61',
    instructions: [
      'Cuci bersih daun bayam, pisahkan dari batang yang terlalu keras.',
      'Tumis iris bawang merah dan bawang putih hingga harum dan kecokelatan.',
      'Masukkan bayam, besarkan api wajan.',
      'Tambahkan sedikit air, garam, gula, dan saus tiram.',
      'Aduk cepat selama 2-3 menit agar bayam tetap hijau segar, lalu angkat segera.'
    ],
    fullIngredients: [
      '1 ikat Bayam Segar',
      '4 siung Bawang Merah',
      '2 siung Bawang Putih',
      '1 sdm Saus Tiram',
      'Secukupnya Garam, Gula & Air'
    ],
    videoUrl: 'https://www.youtube.com/watch?v=xwPGEtjo6cs'
  },
  {
    id: 6,
    name: 'Sambal Matah Bali',
    ingredients: ['Bawang Merah', 'Cabai Merah'],
    description: 'Sambal iris khas yang segar tanpa diulek maupun dimasak lama.',
    difficulty: 'Sedang',
    cookTime: '20 menit',
    image: 'https://images.pexels.com/photos/37090673/pexels-photo-37090673.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
    rating: '4.88',
    likes: '74',
    instructions: [
      'Iris halus bawang merah, serai bagian putihnya, daun jeruk, dan cabai rawit.',
      'Campurkan semua bahan iris dalam mangkuk.',
      'Tambahkan garam, gula, terasi bakar yang dihaluskan, dan air jeruk nipis.',
      'Panaskan minyak kelapa hingga berasap, lalu siramkan ke dalam mangkuk bahan.',
      'Aduk rata sambil sedikit ditekan-tekan agar aromanya keluar.'
    ],
    fullIngredients: [
      '8 siung Bawang Merah',
      '2 batang Serai (ambil bagian putih)',
      '3 lembar Daun Jeruk (buang tulang daun)',
      '10 buah Cabai Rawit',
      '2 sdm Minyak Kelapa',
      '1 sdt Air Jeruk Nipis'
    ],
    videoUrl: 'https://www.youtube.com/watch?v=2ZiOJg5RqQA'
  },
  {
    id: 7,
    name: 'Gulai Bayam Segar',
    ingredients: ['Bawang Merah', 'Bawang Putih', 'Bayam', 'Tomat'],
    description: 'Bayam dalam kuah santan kuning kaya bumbu rempah tradisional yang menggiurkan.',
    difficulty: 'Sedang',
    cookTime: '40 menit',
    image: 'https://images.pexels.com/photos/17902961/pexels-photo-17902961.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
    rating: '4.79',
    likes: '63',
    instructions: [
      'Haluskan bawang merah, bawang putih, kunyit, kemiri, dan cabai.',
      'Tumis bumbu halus bersama daun salam dan serai hingga harum.',
      'Masukkan santan encer dan potongan tomat, aduk perlahan agar santan tidak pecah.',
      'Setelah mendidih, masukkan daun bayam segar.',
      'Masak hingga bayam layu, tuang santan kental, bumbui garam gula, angkat.'
    ],
    fullIngredients: [
      '1 ikat Daun Bayam',
      '2 buah Tomat (belah 4)',
      '200 ml Santan Kental & 400 ml Santan Encer',
      'Bumbu Halus: 5 Bawang Merah, 3 Bawang Putih, Kunyit, Kemiri',
      '1 batang Serai & 2 lembar Daun Salam'
    ],
    videoUrl: 'https://www.youtube.com/watch?v=YwxzI9bN6vw'
  },
  {
    id: 8,
    name: 'Sambal Ijo Pedas',
    ingredients: ['Cabai Hijau', 'Bawang Putih', 'Tomat'],
    description: 'Sambal ijo autentik khas Padang dari cabai hijau yang segar dan pedas.',
    difficulty: 'Mudah',
    cookTime: '15 menit',
    image: 'https://images.pexels.com/photos/37079579/pexels-photo-37079579.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
    rating: '4.81',
    likes: '58',
    instructions: [
      'Kukus cabai hijau besar, cabai rawit hijau, bawang putih, dan tomat hijau.',
      'Ulek kasar bahan-bahan yang telah dikukus.',
      'Panaskan minyak, tumis sambal ulek bersama daun jeruk hingga harum.',
      'Tambahkan garam, gula pasir, dan perasan jeruk nipis.',
      'Masak dengan api kecil hingga minyaknya keluar dan warna cabai matang merata.'
    ],
    fullIngredients: [
      '10 buah Cabai Hijau Besar',
      '10 buah Cabai Rawit Hijau',
      '3 siung Bawang Putih',
      '2 buah Tomat Hijau',
      '3 lembar Daun Jeruk',
      'Secukupnya Garam, Gula, & Minyak'
    ],
    videoUrl: 'https://www.youtube.com/watch?v=nJkE9iElkdU'
  },
  {
    id: 9,
    name: 'Tumis Buncis Pedas',
    ingredients: ['Buncis', 'Bawang Merah', 'Cabai Merah'],
    description: 'Buncis renyah ditumis dengan bumbu pedas bawang yang menggugah selera.',
    difficulty: 'Mudah',
    cookTime: '15 menit',
    image: 'https://images.pexels.com/photos/3338494/pexels-photo-3338494.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
    rating: '4.78',
    likes: '39',
    instructions: [
      'Cuci buncis, potong serong sekitar 3-4 cm, sisihkan.',
      'Tumis iris bawang merah dan cabai merah hingga harum dan layu.',
      'Masukkan buncis, aduk rata bersama bumbu.',
      'Tambahkan sedikit air, masak dengan api sedang hingga buncis matang tapi masih renyah.',
      'Bumbui garam, gula, dan saus tiram secukupnya, angkat dan sajikan.'
    ],
    fullIngredients: [
      '200 gr Buncis Segar',
      '4 siung Bawang Merah',
      '3 buah Cabai Merah (iris)',
      '1 sdm Saus Tiram',
      'Secukupnya Garam & Gula'
    ],
    videoUrl: 'https://www.youtube.com/watch?v=xn2gvLzQXLA'
  },
  {
    id: 10,
    name: 'Sup Brokoli Gurih',
    ingredients: ['Brokoli', 'Bawang Putih', 'Tomat'],
    description: 'Sup brokoli hangat dengan kaldu gurih dan tomat segar penuh vitamin.',
    difficulty: 'Mudah',
    cookTime: '20 menit',
    image: 'https://images.pexels.com/photos/5644944/pexels-photo-5644944.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
    rating: '4.77',
    likes: '44',
    instructions: [
      'Potong brokoli menjadi kuntum-kuntum kecil, cuci bersih.',
      'Tumis bawang putih iris hingga harum dan keemasan.',
      'Masukkan potongan tomat, aduk hingga lunak dan mengeluarkan air.',
      'Tuang air atau kaldu, didihkan lalu masukkan brokoli.',
      'Masak 5-7 menit, bumbui garam, merica, dan kaldu bubuk, sajikan hangat.'
    ],
    fullIngredients: [
      '1 kepala Brokoli (potong kuntum)',
      '3 siung Bawang Putih',
      '1 buah Tomat (potong dadu)',
      '600 ml Air atau Kaldu Ayam',
      'Secukupnya Garam, Merica & Kaldu Bubuk'
    ],
    videoUrl: 'https://www.youtube.com/watch?v=Pie22LRyOK8'
  },
  {
    id: 11,
    name: 'Capcay Sayur Segar',
    ingredients: ['Brokoli', 'Buncis', 'Bawang Merah', 'Bawang Putih'],
    description: 'Capcay sayuran campuran berkuah gurih ala masakan Chinese-Indonesian.',
    difficulty: 'Sedang',
    cookTime: '20 menit',
    image: 'https://images.pexels.com/photos/2181151/pexels-photo-2181151.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
    rating: '4.83',
    likes: '57',
    instructions: [
      'Potong brokoli dan buncis, cuci bersih semua sayuran.',
      'Tumis bawang merah dan bawang putih hingga harum.',
      'Masukkan buncis, tumis sebentar, lalu masukkan brokoli.',
      'Tuang sedikit air, tambahkan saus tiram, kecap asin, dan merica.',
      'Masak hingga sayur matang merata, koreksi rasa, angkat dan sajikan.'
    ],
    fullIngredients: [
      '1/2 kepala Brokoli',
      '100 gr Buncis (potong serong)',
      '3 siung Bawang Merah',
      '3 siung Bawang Putih',
      '2 sdm Saus Tiram',
      '1 sdm Kecap Asin'
    ],
    videoUrl: 'https://www.youtube.com/watch?v=YTedbOovrVQ'
  },
  {
    id: 12,
    name: 'Tumis Kale Bawang',
    ingredients: ['Kale', 'Bawang Putih', 'Bawang Merah'],
    description: 'Tumisan daun kale super sehat dengan bawang aromatik, kaya antioksidan.',
    difficulty: 'Mudah',
    cookTime: '10 menit',
    image: 'https://images.pexels.com/photos/5589002/pexels-photo-5589002.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
    rating: '4.75',
    likes: '28',
    instructions: [
      'Cuci daun kale, buang batang tengahnya yang keras, sobek-sobek daun.',
      'Tumis bawang merah dan bawang putih dengan minyak hingga harum.',
      'Masukkan kale, tambahkan sedikit air agar tidak gosong.',
      'Tumis dengan api sedang-besar selama 3-4 menit hingga kale sedikit layu.',
      'Bumbui garam, merica, dan saus tiram. Angkat dan sajikan hangat.'
    ],
    fullIngredients: [
      '200 gr Daun Kale',
      '3 siung Bawang Putih',
      '2 siung Bawang Merah',
      '1 sdm Saus Tiram',
      'Secukupnya Garam & Merica'
    ],
    videoUrl: 'https://www.youtube.com/watch?v=DjlhZqvfb20'
  },
  {
    id: 13,
    name: 'Sambal Cabai Hijau',
    ingredients: ['Cabai Hijau', 'Bawang Merah', 'Tomat'],
    description: 'Sambal segar khas Minang dari cabai hijau yang pedas, wangi, dan menggoda.',
    difficulty: 'Mudah',
    cookTime: '15 menit',
    image: 'https://images.pexels.com/photos/70842/pexels-photo-70842.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
    rating: '4.86',
    likes: '72',
    instructions: [
      'Rebus cabai hijau, bawang merah, dan tomat hijau hingga setengah matang.',
      'Tiriskan, lalu ulek kasar — jangan terlalu halus agar tekstur tetap ada.',
      'Tumis dengan sedikit minyak hingga harum dan matang.',
      'Bumbui garam, gula, dan perasan jeruk nipis secukupnya.',
      'Masak hingga minyak keluar, angkat dan sajikan bersama nasi hangat.'
    ],
    fullIngredients: [
      '8 buah Cabai Hijau Besar',
      '5 buah Cabai Rawit Hijau',
      '4 siung Bawang Merah',
      '1 buah Tomat Hijau',
      '2 sdm Minyak Goreng',
      'Secukupnya Garam, Gula & Jeruk Nipis'
    ],
    videoUrl: 'https://www.youtube.com/watch?v=7p9NXSdlOXo'
  },
  {
    id: 14,
    name: 'Tumis Peterseli Bawang',
    ingredients: ['Peterseli', 'Bawang Putih', 'Tomat'],
    description: 'Saus peterseli segar dengan bawang putih dan tomat, cocok untuk pasta atau lauk panggang.',
    difficulty: 'Mudah',
    cookTime: '10 menit',
    image: 'https://images.pexels.com/photos/1412773/pexels-photo-1412773.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
    rating: '4.73',
    likes: '24',
    instructions: [
      'Cuci bersih daun peterseli, cincang kasar.',
      'Tumis bawang putih iris dengan minyak zaitun hingga harum keemasan.',
      'Masukkan tomat potong dadu, masak hingga lunak.',
      'Tambahkan peterseli cincang, aduk rata.',
      'Bumbui garam, merica, dan sedikit perasan jeruk nipis. Sajikan sebagai saus pelengkap.'
    ],
    fullIngredients: [
      '1 genggam Daun Peterseli Segar',
      '4 siung Bawang Putih',
      '2 buah Tomat (potong dadu)',
      '2 sdm Minyak Zaitun',
      'Secukupnya Garam & Merica'
    ],
  },
];

const INGREDIENT_INFO = {
  'Bawang Merah': { emoji: '🧅', badge: 'bg-rose-50 text-rose-700 border-rose-100' },
  'Bawang Putih': { emoji: '🧄', badge: 'bg-amber-50 text-amber-800 border-amber-100' },
  'Cabai Merah': { emoji: '🌶️', badge: 'bg-red-50 text-red-700 border-red-100' },
  'Cabai Hijau': { emoji: '🫑', badge: 'bg-green-50 text-green-700 border-green-100' },
  'Tomat': { emoji: '🍅', badge: 'bg-orange-50 text-orange-700 border-orange-100' },
  'Bayam': { emoji: '🌿', badge: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
  'Buncis': { emoji: '🫛', badge: 'bg-lime-50 text-lime-700 border-lime-100' },
  'Kale': { emoji: '🥬', badge: 'bg-teal-50 text-teal-700 border-teal-100' },
  'Brokoli': { emoji: '🥦', badge: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
  'Peterseli': { emoji: '🌱', badge: 'bg-lime-50 text-lime-800 border-lime-200' },
  'Background': { emoji: '🍽️', badge: 'bg-slate-50 text-slate-700 border-slate-100' },
};

export default function App() {
  // ========== STATE MANAGEMENT ==========
  const [cart, setCart] = useState([]);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isInferenceRunning, setIsInferenceRunning] = useState(false);
  const [currentDetection, setCurrentDetection] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [modelLoadingProgress, setModelLoadingProgress] = useState(0);
  const [detectionConfidence, setDetectionConfidence] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [imageError, setImageError] = useState({});

  const handleImageError = (id) => {
    setImageError((prev) => ({ ...prev, [id]: true }));
  };

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
      stopInference();
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
      setIsCameraOn(false);
      setPredictions([]);
      setCurrentDetection(null);
    } else {
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
            .filter((p) => p.className !== 'Background' && p.className !== 'Backround' && p.probability >= 0.75)
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
    if (ingredient === 'Background' || ingredient === 'Backround') return;
    if (ingredient && !cart.includes(ingredient)) {
      setCart([...cart, ingredient]);
    }
  };

  const removeFromCart = (ingredient) => {
    setCart(cart.filter((item) => item !== ingredient));
  };

  // ========== RECIPE MATCHING (LOGIKA REKOMENDASI CERDAS) ==========
  // Hanya tampilkan resep jika SEMUA bahan yang dibutuhkan ada di keranjang
  const matchedRecipes = RECIPE_DATABASE.filter((recipe) =>
    recipe.ingredients.every((ingredient) => cart.includes(ingredient))
  ).sort((a, b) => b.ingredients.length - a.ingredients.length);

  return (
    <div className="min-h-screen bg-background text-text-main antialiased relative flex flex-col pb-8 font-[Inter]">

      {/* Dekorasi Background */}
      <div className="fixed top-[3%] left-[3%] text-7xl opacity-20 pointer-events-none z-0">🥬</div>
      <div className="fixed top-[8%] left-[25%] text-6xl opacity-20 pointer-events-none z-0">🥦</div>
      <div className="fixed top-[5%] left-[50%] text-7xl opacity-20 pointer-events-none z-0">🍅</div>
      <div className="fixed top-[10%] right-[8%] text-6xl opacity-20 pointer-events-none z-0">🥕</div>

      <div className="fixed top-[18%] left-[12%] text-6xl opacity-20 pointer-events-none z-0">🧄</div>
      <div className="fixed top-[22%] left-[40%] text-7xl opacity-20 pointer-events-none z-0">🌶️</div>
      <div className="fixed top-[20%] right-[15%] text-6xl opacity-20 pointer-events-none z-0">🧅</div>

      <div className="fixed top-[32%] left-[5%] text-7xl opacity-20 pointer-events-none z-0">🥦</div>
      <div className="fixed top-[38%] left-[28%] text-6xl opacity-20 pointer-events-none z-0">🍅</div>
      <div className="fixed top-[35%] left-[55%] text-7xl opacity-20 pointer-events-none z-0">🥬</div>
      <div className="fixed top-[40%] right-[10%] text-6xl opacity-20 pointer-events-none z-0">🌶️</div>

      <div className="fixed top-[52%] left-[15%] text-6xl opacity-20 pointer-events-none z-0">🧄</div>
      <div className="fixed top-[58%] left-[45%] text-7xl opacity-20 pointer-events-none z-0">🥕</div>
      <div className="fixed top-[55%] right-[18%] text-6xl opacity-20 pointer-events-none z-0">🧅</div>

      <div className="fixed top-[68%] left-[8%] text-7xl opacity-20 pointer-events-none z-0">🥬</div>
      <div className="fixed top-[72%] left-[35%] text-6xl opacity-20 pointer-events-none z-0">🍅</div>
      <div className="fixed top-[70%] right-[8%] text-7xl opacity-20 pointer-events-none z-0">🥦</div>

      <div className="fixed top-[82%] left-[18%] text-6xl opacity-20 pointer-events-none z-0">🌶️</div>
      <div className="fixed top-[88%] left-[50%] text-7xl opacity-20 pointer-events-none z-0">🧄</div>
      <div className="fixed top-[85%] right-[15%] text-6xl opacity-20 pointer-events-none z-0">🥕</div>

      {/* HEADER FRESH CULINARY */}
      <header className="bg-white border-b border-border-soft px-6 py-3 sticky top-0 z-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">🌿</span>
          <div>
            <h1 className="font-[Poppins] font-semibold text-[20px] text-text-main m-0 leading-tight">Smart Ingredient Scanner</h1>
            <p className="font-[Inter] text-[12px] text-text-muted m-0 mt-0.5">Identifikasi bahan masakan secara real-time</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-[11px] font-[Inter] transition-all duration-300 ${isInferenceRunning || isCameraOn
            ? 'bg-[#E8F5E9] text-green-fresh'
            : 'bg-[#F0F0F0] text-text-muted'
            }`}>
            ● {!isModelLoaded ? 'LOADING MODEL' : !isCameraOn ? 'KAMERA OFF' : isInferenceRunning ? 'SCANNING ACTIVE' : 'READY'}
          </span>
        </div>
      </header>

      {/* MAIN LAYOUT SPLIT */}
      <div className="relative z-1 max-w-7xl mx-auto w-full p-4 md:p-6 flex flex-col lg:flex-row gap-6 h-[calc(100vh-80px)] overflow-hidden">

        {/* ================= LEFT COLUMN ================= */}
        <div className="w-full lg:w-3/5 flex flex-col gap-4 h-full">

          <div className="flex-1 relative rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.08)] flex items-center justify-center bg-surface-warm">
            {isInferenceRunning && (
              <div className="absolute inset-0 z-20 pointer-events-none">
                <div className="absolute w-full h-1 bg-linear-to-r from-transparent via-primary to-transparent opacity-80 animate-[scanLine_2.5s_ease-in-out_infinite]" style={{ top: '0%' }}></div>
              </div>
            )}

            <video ref={videoRef} className="w-full h-full object-cover rounded-2xl" playsInline muted />

            {/* OVERLAY DETEKSI */}
            {isCameraOn && currentDetection && detectionConfidence !== null && (
              <div className="absolute bottom-6 left-6 right-6 z-30 animate-[fadeIn_0.3s_ease-out_forwards]">
                <div className="bg-white/95 backdrop-blur-md border border-stone-200 shadow-xl rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl p-2 bg-orange-50 rounded-lg border border-orange-100">
                      {INGREDIENT_INFO[currentDetection]?.emoji || '🥕'}
                    </span>
                    <div>
                      <p className="text-stone-900 font-extrabold text-base">{currentDetection}</p>
                      <p className="text-orange-600 text-xs font-bold">
                        Akurasi Match: {(detectionConfidence * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => addToCart(currentDetection)}
                    className={`w-full md:w-auto py-2.5 px-6 rounded-xl font-bold text-xs transition-all shadow active:scale-95 border ${cart.includes(currentDetection)
                      ? 'bg-stone-50 text-stone-400 cursor-default border-stone-200'
                      : 'bg-orange-500 hover:bg-orange-600 text-white border-transparent'
                      }`}
                    disabled={cart.includes(currentDetection)}
                  >
                    {cart.includes(currentDetection) ? '✓ Ada di Keranjang' : '+ MASUKKAN KERANJANG'}
                  </button>
                </div>
              </div>
            )}

            {!isModelLoaded && (
              <div className="absolute inset-0 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center z-40">
                <div className="w-14 h-14 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-stone-850 font-bold text-sm">Menghubungkan ke Teachable Machine...</p>
                <span className="inline-block bg-orange-50 text-orange-600 text-xs px-3 py-1 rounded-full font-bold mt-2 border border-orange-100">
                  {modelLoadingProgress}% Selesai
                </span>
              </div>
            )}

            {!isCameraOn && isModelLoaded && (
              <div className="absolute inset-0 bg-linear-to-br from-surface-warm to-background flex flex-col items-center justify-center z-30 p-4 text-center">
                <svg className="w-16 h-16 text-[#CCBBAA] mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                </svg>
                <p className="text-text-main font-[Poppins] font-semibold text-[16px]">Sistem Kamera Siap</p>
                <p className="font-[Inter] text-[14px] text-[#AAAAAA] mt-1 max-w-sm">Tekan tombol "Nyalakan Kamera" untuk mulai mendeteksi bahan masakan.</p>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={toggleCamera}
              className={`flex-1 py-3 px-8 rounded-full font-[Poppins] font-medium text-[14px] transition-all duration-200 ease-in border-none cursor-pointer ${isCameraOn
                ? 'bg-text-main hover:bg-black text-white shadow-[0_4px_12px_rgba(26,26,26,0.3)]'
                : 'bg-primary hover:bg-primary-dark text-white shadow-[0_4px_12px_rgba(230,126,34,0.3)]'
                }`}
            >
              {isCameraOn ? 'Matikan Kamera' : 'Nyalakan Kamera'}
            </button>

            <button
              onClick={() => (isInferenceRunning ? stopInference() : startInference())}
              disabled={!isModelLoaded || !isCameraOn}
              className="flex-1 py-3 px-8 bg-transparent border-[1.5px] border-primary text-primary hover:bg-surface-warm disabled:opacity-50 disabled:hover:bg-transparent disabled:cursor-not-allowed rounded-full font-[Poppins] font-medium text-[14px] transition-all duration-200 ease-in cursor-pointer"
            >
              {isInferenceRunning ? 'Hentikan Scan AI' : 'Deteksi Bahan'}
            </button>
          </div>

          <div className="bg-surface rounded-xl p-[16px_20px] shadow-[0_2px_8px_rgba(0,0,0,0.05)] border border-border-soft shrink-0">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-border-soft">
              <h3 className="font-[Poppins] font-semibold text-[15px] text-text-main flex items-center gap-2 m-0">
                Bahan di Keranjang
                <span className="bg-primary text-white text-[11px] font-medium px-2 py-0.5 rounded-full">{cart.length}</span>
              </h3>
              {cart.length > 0 && (
                <button onClick={() => setCart([])} className="text-red-500 hover:text-red-600 text-xs font-medium transition-colors p-0 m-0 border-none bg-transparent">
                  [Kosongkan]
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-1.5 mb-3">
              {Object.entries(INGREDIENT_INFO).filter(([k]) => k !== 'Background' && k !== 'Backround').map(([ingredient, info]) => (
                <button
                  key={ingredient}
                  onClick={() => cart.includes(ingredient) ? removeFromCart(ingredient) : addToCart(ingredient)}
                  className={`py-1 px-2.5 rounded-lg text-[11px] font-semibold border transition-all cursor-pointer active:scale-95 ${
                    cart.includes(ingredient)
                      ? 'bg-primary/10 text-primary border-primary'
                      : 'bg-stone-50 text-text-muted border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  {info.emoji} {ingredient}
                </button>
              ))}
            </div>

            {cart.length === 0 ? (
              <p className="font-[Inter] text-[13px] text-[#AAAAAA] text-center py-4 m-0">Klik bahan di atas atau scan kamera untuk mengisi keranjang.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {cart.map((ingredient) => (
                  <div key={ingredient} className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-[13px] font-medium border shadow-sm ${INGREDIENT_INFO[ingredient]?.badge || 'bg-surface-warm text-text-main border-border-soft'}`}>
                    <span>{INGREDIENT_INFO[ingredient]?.emoji}</span>
                    <span>{ingredient}</span>
                    <button onClick={() => removeFromCart(ingredient)} className="ml-1 text-text-muted hover:text-text-main font-bold p-0 m-0 border-none bg-transparent">✕</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ================= RIGHT COLUMN ================= */}
        <div className="w-full lg:w-2/5 flex flex-col gap-4 h-full overflow-hidden">

          <div className="flex-1 bg-surface rounded-xl p-[16px_20px] shadow-[0_2px_8px_rgba(0,0,0,0.05)] border border-border-soft flex flex-col overflow-y-auto">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-border-soft sticky top-0 bg-surface z-10">
              <h3 className="font-[Poppins] font-semibold text-[15px] text-text-main flex items-center gap-2 m-0">
                Rekomendasi Menu Masak
              </h3>
              <span className="text-[11px] text-primary bg-surface-warm px-2.5 py-1 rounded-full font-medium border border-border-soft">
                {matchedRecipes.length} Menu Cocok
              </span>
            </div>

            {cart.length === 0 ? (
              <p className="font-[Inter] text-[13px] text-[#AAAAAA] text-center py-6 m-0">Keranjang belanja kosong. Isi bahan masakan untuk melihat rekomendasi resep.</p>
            ) : matchedRecipes.length === 0 ? (
              <p className="font-[Inter] text-[13px] text-[#AAAAAA] text-center py-6 m-0">Kombinasi Menu Belum Ditemukan. Coba tambahkan bahan lain.</p>
            ) : (
              <div className="space-y-3">
                {matchedRecipes.map((recipe) => {
                  const isExpanded = selectedRecipe === recipe.id;
                  const matchedCount = recipe.ingredients.filter(ing => cart.includes(ing)).length;
                  const totalCount = recipe.ingredients.length;
                  const isFullyMatched = matchedCount === totalCount;

                  return (
                    <div
                      key={recipe.id}
                      onClick={() => setSelectedRecipe(isExpanded ? null : recipe.id)}
                      className={`p-4 bg-white border ${isExpanded ? 'border-primary shadow-md' : 'border-border-soft shadow-[0_2px_8px_rgba(0,0,0,0.03)]'} rounded-xl transition-all duration-300 cursor-pointer hover:shadow-md hover:border-primary/40`}
                    >
                      <div className="flex items-start gap-4">
                        {recipe.image && (
                          <img
                            src={recipe.image}
                            alt={recipe.name}
                            className="w-16 h-16 rounded-lg object-cover bg-stone-50 border border-border-soft shrink-0 shadow-sm"
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        )}
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${isFullyMatched ? 'bg-green-fresh' : 'bg-primary'}`} />
                              <h4 className="text-text-main font-[Poppins] font-bold text-sm leading-snug">{recipe.name}</h4>
                            </div>
                            <span className="text-[10px] bg-surface-warm text-primary font-bold px-2 py-0.5 rounded-md border border-border-soft shrink-0">
                              {recipe.difficulty}
                            </span>
                          </div>
                          <p className="text-text-muted font-[Inter] text-xs mt-1 leading-relaxed">{recipe.description}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-3 border-t border-border-soft/60 text-xs">
                        <div className="flex flex-wrap gap-1">
                          {recipe.ingredients.map((ingredient) => {
                            const isPresent = cart.includes(ingredient);
                            return (
                              <span
                                key={ingredient}
                                className={`text-[10px] px-2 py-0.5 rounded-md font-medium border ${isPresent
                                  ? 'bg-[#E8F5E9] text-green-fresh border-[#C8E6C9]'
                                  : 'bg-stone-50 text-text-muted border-stone-200'
                                }`}
                              >
                                {INGREDIENT_INFO[ingredient]?.emoji || '•'} {ingredient}
                              </span>
                            );
                          })}
                        </div>
                        <div className="flex items-center gap-3 text-[#666666] font-medium text-[11px]">
                          <span>⏱️ {recipe.cookTime}</span>
                          <span className={`transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>▼</span>
                        </div>
                      </div>

                      {/* Expanded Section */}
                      {isExpanded && (
                        <div className="mt-4 pt-4 border-t border-border-soft/80 space-y-4 animate-[fadeIn_0.25s_ease-out_forwards]">
                          <div>
                            <p className="text-xs text-primary font-bold uppercase tracking-wider mb-2">Bahan Lengkap:</p>
                            <ul className="list-disc pl-5 text-xs text-[#555555] space-y-1">
                              {recipe.fullIngredients?.map((ing, idx) => (
                                <li key={idx}>{ing}</li>
                              )) || recipe.ingredients.map((ing, idx) => <li key={idx}>{ing}</li>)}
                            </ul>
                          </div>

                          <div>
                            <p className="text-xs text-primary font-bold uppercase tracking-wider mb-2">Cara Memasak:</p>
                            <ol className="list-decimal pl-5 text-xs text-[#555555] space-y-2">
                              {recipe.instructions?.map((step, idx) => (
                                <li key={idx} className="pl-1 leading-relaxed">{step}</li>
                              )) || <p className="italic text-stone-400">Instruksi belum tersedia.</p>}
                            </ol>
                          </div>

                          {recipe.videoUrl && (
                            <a
                              href={recipe.videoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="flex items-center gap-2 mt-1 text-xs font-semibold text-red-600 hover:text-red-700 transition-colors"
                            >
                              <span className="text-base">▶️</span>
                              Video Tutorial Cara Membuat {recipe.name}
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="bg-surface rounded-xl p-[16px_20px] shadow-[0_2px_8px_rgba(0,0,0,0.05)] border border-border-soft flex flex-col shrink-0">
            <h3 className="font-[Poppins] font-semibold text-[15px] text-text-main mb-4 pb-3 border-b border-border-soft m-0">Live AI Confidence Monitor</h3>

            <div className="space-y-4">
              {predictions.length === 0 ? (
                <p className="font-[Inter] text-[13px] text-[#AAAAAA] text-center py-6 m-0">Nyalakan kamera dan deteksi untuk melihat grafik probabilitas secara real-time.</p>
              ) : (
                predictions
                  .filter((pred) => pred.className !== 'Background' && pred.className !== 'Backround')
                  .map((pred, idx) => {
                  const pct = (pred.probability * 100).toFixed(1);
                  const barColor = pred.probability >= 0.75 ? '#27AE60' : '#E67E22';

                  return (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex items-center justify-between text-[12px]">
                        <div className="flex items-center gap-1.5 font-[Inter] text-[#666666]">
                          <span>{INGREDIENT_INFO[pred.className]?.emoji || '•'}</span>
                          <span>{pred.className}</span>
                        </div>
                        <span className="font-mono text-[11px]" style={{ color: barColor }}>{pct}%</span>
                      </div>
                      <div className="w-full bg-[#F0EBE3] rounded-full h-1.5 overflow-hidden">
                        <div className="h-full transition-all duration-200 rounded-full" style={{ width: `${pct}%`, backgroundColor: barColor }}></div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>
      </div>

      <footer className="relative z-1 bg-surface border-t border-border-soft px-6 py-3">
        <p className="font-[Inter] text-[12px] text-[#AAAAAA] text-center m-0">
          Smart Ingredient Scanner — Kelompok Etanol · Telkom University Purwokerto · 2026
        </p>
      </footer>

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
