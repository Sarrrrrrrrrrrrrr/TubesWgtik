# 🥬 Smart Ingredient Scanner

A modern React + Vite web application that uses machine learning to scan and identify ingredients in real-time. Powered by Google's Teachable Machine and TensorFlow.

## Features

✨ **Real-time Ingredient Detection** - Point your camera to identify ingredients instantly
🎯 **High Accuracy ML Model** - Uses Teachable Machine for custom ingredient classification
📊 **Confidence Scoring** - Shows detection confidence levels with visual indicators
📱 **Responsive Design** - Works on desktop, tablet, and mobile devices
⚡ **Fast Performance** - Optimized with debouncing and frame throttling
💾 **Nutritional Database** - Built-in ingredient information including calories, macros, and benefits
🎨 **Beautiful UI** - Modern interface with Tailwind CSS styling

## Tech Stack

- **Frontend Framework**: React 19.2.6
- **Build Tool**: Vite 8.0.13
- **ML Libraries**:
  - TensorFlow.js 1.3.1
  - Teachable Machine (@teachablemachine/image 0.8.5)
- **Styling**: Tailwind CSS 4.3.0
- **Additional**: PostCSS, Autoprefixer

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/           # React components
│   ├── CameraView.jsx   # Camera feed capture
│   ├── IngredientPanel.jsx # Detection results panel
│   ├── ConfidenceBar.jsx # Confidence visualization
│   └── OverlayDetection.jsx # Visual overlay on camera
├── hooks/               # Custom React hooks
│   ├── useCamera.js     # Camera access management
│   ├── useModelInference.js # ML inference logic
│   └── useIngredientInfo.js # Ingredient data lookup
├── services/            # Business logic services
│   ├── ModelLoader.js   # Teachable Machine model loading
│   ├── FrameProcessor.js # Frame to prediction conversion
│   └── ThresholdGuard.js # Prediction stability & filtering
├── data/                # Static data
│   └── ingredientInfo.json # Ingredient database
├── utils/               # Utility functions
│   ├── confidenceFormatter.js # Format confidence scores
│   └── debounceDetection.js # Debouncing & throttling
├── App.jsx              # Main application component
└── index.css            # Global styles

public/
└── model/               # Teachable Machine model files
    ├── model.json       # Model architecture
    ├── metadata.json    # Model metadata
    └── weights.bin      # Model weights
```

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```
All required packages are already listed in package.json:
- React & React DOM
- Vite & plugins
- TensorFlow.js & Teachable Machine
- Tailwind CSS

### 2. Setup Teachable Machine Model

1. Go to [Google Teachable Machine](https://teachablemachine.withgoogle.com/)
2. Create a new "Image Project" → "Standard image model"
3. Add classes for each ingredient you want to detect
4. Upload training images (minimum 20 images per ingredient)
5. Train the model
6. Export as **Tensorflow.js**
7. Download the zip file
8. Extract to `public/model/`:
   - `model.json`
   - `metadata.json`
   - `weights.bin`

### 3. Run Development Server

```bash
npm run dev
```

Access the app at: `https://localhost:5173`

**Note**: Uses HTTPS for camera access (browser security requirement)

### 4. Build for Production

```bash
npm run build
npm run preview  # Preview the build locally
```

## Configuration Files

### `vite.config.js`
- React Fast Refresh enabled
- HTTPS support for development (camera access)
- Optimized build settings

### `tailwind.config.js`
- Custom color scheme (primary, secondary, danger, warning)
- Responsive design utilities

### `postcss.config.js`
- Tailwind CSS preprocessing
- Autoprefixer for cross-browser support

## Available Scripts

```bash
npm run dev      # Start development server with HMR
npm run build    # Build optimized production bundle
npm run preview  # Preview production build locally
npm run lint     # Run ESLint checks
```

## Performance Tips

- **Model Size**: Keep Teachable Machine model under 50MB
- **Camera Resolution**: Default 1280x720, adjust in `src/hooks/useCamera.js` if needed
- **Frame Processing**: Debounced at 300ms, adjust in `App.jsx`
- **Stability**: 3-frame voting mechanism prevents false detections

## Troubleshooting

### Camera Permission Denied
- Check browser camera settings
- Ensure app runs on HTTPS (localhost works)
- For Chrome: chrome://settings/contentExceptions#mediaStream

### Model Not Loading
- Verify files exist in `public/model/`
- Check browser DevTools Console for errors
- Ensure model files are not corrupted

### Slow Performance
- Reduce camera resolution
- Check device GPU acceleration
- Verify model file size

### No Detections
- Ensure good lighting
- Test with high-confidence sample images
- Verify Teachable Machine model is trained properly

## Browser Support

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome | ✅ Full | Best performance |
| Firefox | ✅ Full | Recommended |
| Safari | ✅ Full | iOS 11+ for camera |
| Edge | ✅ Full | Chromium-based |

## Dependencies

```json
{
  "react": "^19.2.6",
  "react-dom": "^19.2.6",
  "@teachablemachine/image": "^0.8.5",
  "@tensorflow/tfjs": "^1.3.1",
  "tailwindcss": "^4.3.0",
  "postcss": "^8.5.15",
  "autoprefixer": "^10.5.0"
}
```

## Future Roadmap

- [ ] Multi-ingredient recipe suggestions
- [ ] Allergen filtering
- [ ] Nutritional calculator
- [ ] Image history
- [ ] PWA support for offline use
- [ ] Mobile native app
- [ ] Voice guidance

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support & Documentation

For detailed component and service documentation, check individual files:
- Components: `src/components/[Component].jsx`
- Hooks: `src/hooks/use[Hook].js`
- Services: `src/services/[Service].js`

---

**Made with ❤️ for ingredient scanning excellence**

