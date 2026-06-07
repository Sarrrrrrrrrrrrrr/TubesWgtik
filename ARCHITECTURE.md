# Architecture & Code Documentation

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Smart Ingredient Scanner                  │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐         ┌────────────────┐                │
│  │   Camera     │         │   Teachable    │                │
│  │   Device     │────────▶│   Machine      │                │
│  │ (getUserMedia)         │   Model        │                │
│  └──────────────┘         └────────────────┘                │
│         │                         │                          │
│         │                         │                          │
│         ▼                         ▼                          │
│  ┌──────────────────────────────────────────┐               │
│  │       CameraView Component               │               │
│  │  - Capture video frames                  │               │
│  │  - Canvas rendering                      │               │
│  │  - Permission handling                   │               │
│  └──────────────────────────────────────────┘               │
│         │                                                    │
│         ▼                                                    │
│  ┌──────────────────────────────────────────┐               │
│  │     useModelInference Hook                │               │
│  │  - Load ML model                          │               │
│  │  - Manage inference state                 │               │
│  │  - Handle predictions                     │               │
│  └──────────────────────────────────────────┘               │
│         │                                                    │
│         ▼                                                    │
│  ┌──────────────────────────────────────────┐               │
│  │     FrameProcessor Service                │               │
│  │  - Convert canvas to predictions          │               │
│  │  - Filter by confidence                   │               │
│  │  - Sort by probability                    │               │
│  └──────────────────────────────────────────┘               │
│         │                                                    │
│         ▼                                                    │
│  ┌──────────────────────────────────────────┐               │
│  │     ThresholdGuard Service                │               │
│  │  - Apply confidence threshold             │               │
│  │  - Stability voting (3-frame)             │               │
│  │  - Reduce false positives                 │               │
│  └──────────────────────────────────────────┘               │
│         │                                                    │
│         ▼                                                    │
│  ┌──────────────────────────────────────────┐               │
│  │   Presentation Layer Components           │               │
│  │  - IngredientPanel                        │               │
│  │  - ConfidenceBar                          │               │
│  │  - OverlayDetection                       │               │
│  └──────────────────────────────────────────┘               │
│         │                                                    │
│         ▼                                                    │
│  ┌──────────────────────────────────────────┐               │
│  │     React UI (Rendered in Browser)        │               │
│  │  - Display results                        │               │
│  │  - Interactive controls                   │               │
│  │  - Real-time feedback                     │               │
│  └──────────────────────────────────────────┘               │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## Component Hierarchy

```
App.jsx (Main Container)
│
├── CameraView Component
│   ├── useCamera Hook
│   │   └── getUserMedia API
│   └── Video Element
│
├── OverlayDetection Component
│   └── SVG Rendering of Detections
│
├── Button Group (Pause/Resume)
│
├── IngredientPanel Component
│   ├── ConfidenceBar Component (multiple)
│   └── Ingredient List
│
└── Sidebar
    ├── Statistics Section
    └── Tips Section
```

---

## Data Flow

### 1. Camera Capture
```
User Browser
    │
    ├─▶ CameraView Component
    │      │
    │      └─▶ useCamera Hook
    │         │
    │         └─▶ navigator.mediaDevices.getUserMedia()
    │            │
    │            └─▶ Returns: MediaStream
    │
    └─▶ Video Element renders stream
```

### 2. Frame Processing
```
Video Element
    │
    ├─▶ requestAnimationFrame (60 FPS)
    │      │
    │      ├─▶ Canvas Element
    │      │   │
    │      │   └─▶ ctx.drawImage() from video
    │      │
    │      └─▶ Emit onFrame callback
    │         │
    │         └─▶ App.jsx receives canvas
```

### 3. Debounced Inference
```
App.jsx (handleFrameCapture)
    │
    ├─▶ debounceDetection() [300ms throttle]
    │      │
    │      └─▶ useModelInference.predict()
    │         │
    │         └─▶ FrameProcessor.processFrame()
    │            │
    │            └─▶ model.predict(image)
```

### 4. ML Inference
```
FrameProcessor.processFrame()
    │
    ├─▶ Canvas to Image conversion
    │
    ├─▶ Teachable Machine Model.predict()
    │   │
    │   └─▶ Returns: Predictions Array
    │       [
    │         { className: 'Tomato', probability: 0.92 },
    │         { className: 'Carrot', probability: 0.05 },
    │         { className: 'Broccoli', probability: 0.03 }
    │       ]
    │
    ├─▶ Filter by threshold (>0.1)
    │
    └─▶ Sort by probability (descending)
```

### 5. Stability Guarding
```
ThresholdGuard.guard()
    │
    ├─▶ Apply confidence threshold (0.5)
    │
    ├─▶ Maintain 3-frame history
    │
    ├─▶ Vote mechanism
    │   │
    │   └─▶ Keep predictions appearing in ≥2/3 frames
    │
    └─▶ Return stable predictions
```

### 6. UI Rendering
```
Stable Predictions
    │
    ├─▶ IngredientPanel Component
    │   │
    │   └─▶ Renders ingredient list with confidence
    │
    ├─▶ OverlayDetection Component
    │   │
    │   └─▶ SVG bounding boxes on video
    │
    ├─▶ ConfidenceBar Components
    │   │
    │   └─▶ Visual progress bars
    │
    └─▶ Statistics Section
        │
        └─▶ Detection count, avg confidence, etc.
```

---

## Key Services

### ModelLoader Service
```javascript
// Location: src/services/ModelLoader.js

static async loadModel(modelUrl)
  Purpose: Load Teachable Machine model from public/model/
  Input: modelUrl - path to model directory
  Output: Trained model object
  
  Steps:
  1. Initialize TensorFlow backend
  2. Load model.json
  3. Load metadata.json
  4. Return ready-to-use model
```

### FrameProcessor Service
```javascript
// Location: src/services/FrameProcessor.js

constructor(model)
  - Stores ML model reference
  - Creates ThresholdGuard instance
  - Maintains prediction history

async processFrame(canvas)
  Purpose: Convert canvas frame to predictions
  Input: Canvas element with camera frame
  Output: Array of predictions
  
  Steps:
  1. Convert canvas to image
  2. Run model.predict()
  3. Filter by confidence (>0.1)
  4. Sort by probability
  5. Apply threshold guarding
  6. Return top predictions
```

### ThresholdGuard Service
```javascript
// Location: src/services/ThresholdGuard.js

guard(predictions)
  Purpose: Stabilize predictions across frames
  Input: Raw predictions from model
  Output: Filtered & stable predictions
  
  Features:
  - Confidence thresholding (default: 0.5)
  - 3-frame voting mechanism
  - Prevents false positives
  - Maintains prediction history
```

---

## Custom Hooks

### useCamera Hook
```javascript
// Location: src/hooks/useCamera.js

Returns: {
  startCamera(videoRef),     // Async function
  stopCamera(),              // Cleanup function
  isLoading: boolean,        // Loading state
  error: string | null       // Error message
}

Usage in Component:
const { startCamera, stopCamera, isLoading, error } = useCamera();

useEffect(() => {
  startCamera(videoRef);
  return () => stopCamera();
}, []);
```

### useModelInference Hook
```javascript
// Location: src/hooks/useModelInference.js

Parameters:
- modelUrl: string (default: '/model/')

Returns: {
  predict: async (canvas),   // Inference function
  predictions: array,        // Current predictions
  isLoading: boolean,        // Model loading state
  error: string | null,      // Error message
  model: object              // Loaded model reference
}

Usage:
const { predict, predictions, isLoading } = useModelInference();
```

### useIngredientInfo Hook
```javascript
// Location: src/hooks/useIngredientInfo.js

Parameters:
- ingredientName: string

Returns: {
  info: object | null,       // Ingredient data
  loading: boolean           // Loading state
}

Usage:
const { info, loading } = useIngredientInfo('Tomato');
// Returns: { name, calories, protein, carbs, ... }
```

---

## Utility Functions

### Confidence Formatter
```javascript
// Location: src/utils/confidenceFormatter.js

formatConfidence(confidence)
  Input: 0-1 float
  Output: "95.2%" string

getConfidenceColor(confidence, lowThreshold, highThreshold)
  Input: confidence score, thresholds
  Output: CSS color (green/yellow/red)

getConfidenceLevel(confidence)
  Input: confidence score
  Output: "High" | "Medium" | "Low"

formatPredictions(predictions, minConfidence)
  Input: Raw predictions array
  Output: Formatted with colors & levels
```

### Debounce Detection
```javascript
// Location: src/utils/debounceDetection.js

debounceDetection(callback, delay)
  Purpose: Prevent excessive inference calls
  Input: callback function, delay in ms
  Output: Debounced function
  
  Example:
  const debouncedPredict = debounceDetection(predict, 300);
  // Inference max once every 300ms

throttleDetection(callback, limit)
  Purpose: Rate-limit inference
  Input: callback, throttle duration
  Output: Throttled function

stableDetection(callback, debounceMs, throttleMs)
  Purpose: Combine debounce + throttle
  Returns: Very stable inference rate
```

---

## Data Models

### Prediction Object
```javascript
{
  className: string,        // "Tomato"
  probability: number,      // 0.0-1.0 (0.92)
  x?: number,              // Optional: bbox x
  y?: number,              // Optional: bbox y
  width?: number,          // Optional: bbox width
  height?: number          // Optional: bbox height
}
```

### Ingredient Data
```javascript
{
  id: number,
  name: string,            // "Tomato"
  category: string,        // "Vegetable"
  calories: number,        // 18
  protein: number,         // 0.9g
  carbs: number,           // 3.9g
  fat: number,             // 0.2g
  fiber: number,           // 1.2g
  benefits: string[],      // ["Rich in lycopene", ...]
  allergens: string[]      // []
}
```

---

## Performance Considerations

### Frame Rate Management
```
Camera: 30-60 FPS (from getUserMedia)
Inference: Debounced to ~3 FPS (300ms intervals)
Rendering: 60 FPS (React/browser default)

Reason: ML inference is computationally expensive
Solution: Process every 10th frame instead of every frame
```

### Memory Usage
```
Video Element: ~5-10 MB (depends on resolution)
Model Weights: 10-50 MB (depends on model size)
Prediction History: ~1-2 MB (3 frames cached)
Total: ~15-65 MB typical

Optimization: Disable video mirrors, limit prediction history
```

### Optimization Tips
```javascript
// In App.jsx - Reduce inference frequency
const debouncedPredict = debounceDetection(predict, 500); // 500ms instead of 300ms

// In vite.config.js - Enable compression
build: {
  minify: 'terser',
  terserOptions: {
    compress: { drop_console: true }
  }
}

// In CameraView.jsx - Lower camera resolution
video: {
  width: { ideal: 640 },   // Lower than default
  height: { ideal: 480 }
}
```

---

## Configuration Points

### Model Path
```javascript
// In useModelInference.js
const defaultPath = '/model/'; // Change if needed

// Or use environment variable
const modelPath = import.meta.env.VITE_MODEL_PATH || '/model/';
```

### Confidence Threshold
```javascript
// In ThresholdGuard.js
new ThresholdGuard(0.5, 3) // threshold, stabilityFrames
// Adjust first param to filter weaker predictions
```

### Debounce Delay
```javascript
// In App.jsx
debounceDetection(predict, 300) // delay in ms
// Increase for slower devices, decrease for more responsiveness
```

### Stability Frames
```javascript
// In ThresholdGuard.js
this.stabilityFrames = 3 // number of frames for voting
// Higher = more stable but slower response
// Lower = faster response but more false positives
```

---

## Extending the Application

### Add New Component
```javascript
// 1. Create file: src/components/YourComponent.jsx
// 2. Export component
// 3. Import in App.jsx
// 4. Add to JSX

import { YourComponent } from './components/YourComponent'

function App() {
  return (
    <div>
      <YourComponent />
    </div>
  )
}
```

### Add Custom Hook
```javascript
// 1. Create: src/hooks/useYourHook.js
export function useYourHook() {
  return { /* your state/logic */ }
}

// 2. Use in component
import { useYourHook } from '../hooks/useYourHook'
const data = useYourHook()
```

### Add New Service
```javascript
// 1. Create: src/services/YourService.js
export class YourService {
  static method() { /* logic */ }
}

// 2. Use in component/hook
import { YourService } from '../services/YourService'
YourService.method()
```

### Modify Ingredient Database
```javascript
// Edit: src/data/ingredientInfo.json
{
  "ingredients": [
    { "id": 9, "name": "NewIngredient", ... },
    ...
  ]
}
```

---

## Testing & Debugging

### Console Logging
```javascript
// Enable detailed logging
console.log('Model loaded:', model);
console.log('Predictions:', predictions);
console.log('Filtered:', filtered);
```

### Browser DevTools
```
F12 → Console tab
  - Check for errors
  - View network requests
  - Monitor performance

F12 → Performance tab
  - Record inference time
  - Check frame rates
  - Identify bottlenecks

F12 → Network tab
  - Monitor model file downloads
  - Check cache headers
```

### Performance Profiling
```javascript
// In FrameProcessor.js
const start = performance.now();
const predictions = await this.model.predict(image);
const end = performance.now();
console.log(`Inference time: ${end - start}ms`);
```

---

## Best Practices

✅ **Do**:
- Use debouncing for inference
- Apply confidence thresholds
- Cache model reference
- Use requestAnimationFrame for video
- Handle errors gracefully
- Optimize image preprocessing

❌ **Don't**:
- Process every frame
- Load model on every render
- Store large prediction history
- Use synchronous operations
- Ignore memory leaks
- Skip error handling

---

**Documentation Version**: 1.0.0
**Last Updated**: May 2026
