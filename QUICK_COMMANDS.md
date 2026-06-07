# 🚀 Quick Commands Reference

## Installation (Already Complete ✅)

```bash
# Project initialization
npm create vite@latest . -- --template react

# Dependencies installed
npm install
npm install -D tailwindcss postcss autoprefixer @teachablemachine/image @tensorflow/tfjs
```

---

## Development

```bash
# Start development server
npm run dev

# Access at: https://localhost:5173/

# Stop server: Press Ctrl+C
```

---

## Configuration Already Set Up ✅

### Vite Configuration
```javascript
// vite.config.js
{
  plugins: [react()],
  server: {
    https: true,
    host: 'localhost',
    port: 5173
  }
}
```

### Tailwind CSS Configuration
```javascript
// tailwind.config.js
{
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        secondary: '#10B981',
        danger: '#EF4444',
        warning: '#F59E0B'
      }
    }
  }
}
```

### PostCSS Configuration
```javascript
// postcss.config.js
{
  plugins: {
    tailwindcss: {},
    autoprefixer: {}
  }
}
```

---

## Build & Deployment

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Build output directory: dist/
```

---

## Model Setup (YOU MUST DO THIS!)

### Download from Teachable Machine

```
1. Go to: https://teachablemachine.withgoogle.com/
2. Create image classification model
3. Train with ingredient images
4. Export as Tensorflow.js
5. Download ZIP file
```

### Extract Model Files

```bash
# After downloading from Teachable Machine:
# Unzip the file and copy to:

public/model/
  ├── model.json
  ├── metadata.json
  └── weights.bin
```

### Verify Model Files

```bash
# Check if files exist
ls -la public/model/

# Output should show:
# model.json (100-500 KB)
# metadata.json (1-10 KB)
# weights.bin (10-50 MB)
```

---

## Project Structure

```
src/
├── components/
│   ├── CameraView.jsx
│   ├── IngredientPanel.jsx
│   ├── ConfidenceBar.jsx
│   └── OverlayDetection.jsx
├── hooks/
│   ├── useCamera.js
│   ├── useModelInference.js
│   └── useIngredientInfo.js
├── services/
│   ├── ModelLoader.js
│   ├── FrameProcessor.js
│   └── ThresholdGuard.js
├── utils/
│   ├── confidenceFormatter.js
│   └── debounceDetection.js
├── data/
│   └── ingredientInfo.json
├── App.jsx
└── index.css
```

---

## Dependencies Installed

```
React & DOM:
✅ react@19.2.6
✅ react-dom@19.2.6

ML Libraries:
✅ @teachablemachine/image@0.8.5
✅ @tensorflow/tfjs@1.3.1

Build Tools:
✅ vite@8.0.13
✅ @vitejs/plugin-react@6.0.2

Styling:
✅ tailwindcss@4.3.0
✅ postcss@8.5.15
✅ autoprefixer@10.5.0

Dev Tools:
✅ eslint
✅ eslint-plugin-react
✅ @types/react
```

---

## Environment Variables (Optional)

Create `.env` file if needed:

```env
# .env (development)
VITE_API_URL=https://api.example.com
VITE_MODEL_PATH=/model/

# .env.production (production)
VITE_API_URL=https://api.production.com
VITE_MODEL_PATH=https://cdn.example.com/model/
```

Access in code:
```javascript
const modelPath = import.meta.env.VITE_MODEL_PATH;
```

---

## Troubleshooting Commands

```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check Node version
node --version

# Check npm version
npm --version

# List installed packages
npm list

# Update npm
npm install -g npm@latest

# Run with different port
npm run dev -- --port 3000
```

---

## File Size Check

```bash
# Check model file sizes
du -h public/model/*

# Check build size
npm run build
du -h dist/

# Analyze build bundle
npm run build -- --analyze  # If available
```

---

## HTTPS Certificate (Optional for Development)

```bash
# Generate self-signed certificate
openssl req -x509 -newkey rsa:4096 -nodes -out cert.pem -keyout key.pem -days 365

# This creates:
# - cert.pem (certificate)
# - key.pem (private key)

# Then in vite.config.js:
# server: {
#   https: {
#     key: fs.readFileSync('./key.pem'),
#     cert: fs.readFileSync('./cert.pem')
#   }
# }
```

---

## Git Setup (Recommended)

```bash
# Initialize git repository
git init

# Create .gitignore
echo "
node_modules/
dist/
.env.local
.env.*.local
*.pem
" > .gitignore

# Initial commit
git add .
git commit -m "Initial commit: Smart Ingredient Scanner project"
```

---

## Deploy Commands

### Vercel
```bash
npm install -g vercel
npm run build
vercel --prod
```

### Netlify
```bash
npm install -g netlify-cli
npm run build
netlify deploy --prod --dir=dist
```

### GitHub Pages
```bash
npm run build
# Deploy dist/ folder to gh-pages branch
```

---

## Useful URLs

- 🔗 **Dev Server**: https://localhost:5173/
- 📚 **Teachable Machine**: https://teachablemachine.withgoogle.com/
- 📖 **React Docs**: https://react.dev/
- 🔨 **Vite Docs**: https://vite.dev/
- 🎨 **Tailwind Docs**: https://tailwindcss.com/
- ⚙️ **TensorFlow.js**: https://js.tensorflow.org/
- 🎯 **ESLint**: https://eslint.org/

---

## Status Check Commands

```bash
# Check if dev server is running
curl https://localhost:5173/ --insecure

# Check if model files are accessible
curl https://localhost:5173/model/model.json --insecure

# Monitor npm build
npm run build -- --watch

# Check disk usage
du -sh node_modules/ dist/
```

---

**Quick Reference Version: 1.0.0**
**Last Updated: May 2026**
