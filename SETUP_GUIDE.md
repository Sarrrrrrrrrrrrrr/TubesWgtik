# Smart Ingredient Scanner - Complete Setup Guide

## 📋 Table of Contents
1. [System Requirements](#system-requirements)
2. [Initial Setup Commands](#initial-setup-commands)
3. [Configuration Files](#configuration-files)
4. [Teachable Machine Model Setup](#teachable-machine-model-setup)
5. [Running the Application](#running-the-application)
6. [Production Deployment](#production-deployment)
7. [Troubleshooting](#troubleshooting)

---

## System Requirements

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **Browser**: Modern browser with:
  - ES6+ support
  - Camera API support (getUserMedia)
  - WebGL support (for TensorFlow.js)
- **Development Environment**: VS Code recommended

**Check your versions**:
```bash
node --version    # Should be v18+
npm --version     # Should be v9+
```

---

## Initial Setup Commands

### Step 1: Project Already Created
```bash
# The project has been scaffolded with:
# npm create vite@latest . -- --template react
```

### Step 2: Install Dependencies (✅ Already Done)
All dependencies have been installed:
```bash
npm install
npm install -D tailwindcss postcss autoprefixer @teachablemachine/image @tensorflow/tfjs
```

**Installed Packages**:
- ✅ `react@19.2.6`
- ✅ `react-dom@19.2.6`
- ✅ `vite@8.0.13`
- ✅ `tailwindcss@4.3.0`
- ✅ `postcss@8.5.15`
- ✅ `autoprefixer@10.5.0`
- ✅ `@teachablemachine/image@0.8.5`
- ✅ `@tensorflow/tfjs@1.3.1`

### Step 3: Verify Installation
```bash
# Check if Tailwind is working
npm list tailwindcss

# Check if TensorFlow is installed
npm list @tensorflow/tfjs

# Check if Teachable Machine is installed
npm list @teachablemachine/image
```

---

## Configuration Files

### ✅ `vite.config.js` (Already Configured)
```javascript
// Configured with:
// - React plugin enabled
// - HTTPS support for getUserMedia (camera access)
// - Optimized server settings
// - localhost binding for camera permissions
```

**To use with custom HTTPS certificates**:
```bash
# Generate self-signed certificate (optional)
openssl req -x509 -newkey rsa:4096 -nodes -out cert.pem -keyout key.pem -days 365

# Then update vite.config.js:
# server: {
#   https: {
#     key: fs.readFileSync('./key.pem'),
#     cert: fs.readFileSync('./cert.pem'),
#   }
# }
```

### ✅ `tailwind.config.js` (Already Configured)
- Content paths configured for JSX files
- Custom color theme included
- All utilities enabled

### ✅ `postcss.config.js` (Already Configured)
- Tailwind CSS preprocessing
- Autoprefixer for vendor prefixes

### ✅ `src/index.css` (Already Configured)
- Tailwind directives (@tailwind) added
- Global antialiasing applied

---

## Teachable Machine Model Setup

### 📌 Important: You Need to Add Your Model Files

The app won't work without a trained ML model. Follow these steps:

### Step 1: Create Your Model on Teachable Machine

```
1. Go to: https://teachablemachine.withgoogle.com/
2. Click: "Get Started"
3. Select: "Image Project" → "Standard image model"
```

### Step 2: Create Classes (Ingredients)

Add a class for each ingredient you want to detect:

Example classes:
```
Class 1: Tomato
Class 2: Carrot
Class 3: Broccoli
Class 4: Chicken Breast
Class 5: Egg
Class 6: Milk
```

### Step 3: Collect Training Images

For each class:
- ✅ Upload **20-100 images** per ingredient
- ✅ Use variety of angles, lighting, backgrounds
- ✅ Use real camera footage when possible
- ✅ Avoid heavily cropped images
- ⚠️ Ensure good image quality

**Image Requirements**:
- Minimum: 320x320 pixels
- Format: PNG, JPG, GIF
- Total: At least 100+ images

### Step 4: Train the Model

```
1. Click: "Train Model" button
2. Wait for training to complete (may take 5-15 minutes)
3. Review accuracy metrics (aim for >85% accuracy)
4. Test with "webcam test" to verify
```

### Step 5: Export Model

```
1. Click: "Export Model" button
2. Select: "TensorFlow.js"
3. Choose: "Tensorflow.js (Recommended)"
4. Click: "Download my model"
```

### Step 6: Place Model Files

Extract the downloaded zip and copy files to:

```
public/model/
├── model.json         ← Copy here
├── metadata.json      ← Copy here
├── weights.bin        ← Copy here
└── README.md          ← Already exists
```

**Verify the structure**:
```bash
ls -la public/model/
# Should show:
# - model.json (size: ~100-500 KB)
# - metadata.json (size: ~1-10 KB)  
# - weights.bin (size: ~10-50 MB)
```

### Step 7: Test in Browser

The app will automatically load and use the model!

---

## Running the Application

### ▶️ Development Mode

```bash
npm run dev
```

**Output**:
```
  VITE v8.0.13  ready in 445 ms

  ➜  Local:   https://localhost:5173/
  ➜  press h to show help
```

**Access the app**:
- Open: `https://localhost:5173/` in your browser
- ⚠️ Ignore HTTPS certificate warnings (self-signed)
- Click: "Camera" → Grant permission
- Point camera at ingredients to scan

### 🛑 Stop Development Server

```bash
# Press Ctrl+C in terminal
```

### 🧪 Test Production Build

```bash
# Build for production
npm run build

# Preview the build
npm run preview
```

---

## Production Deployment

### Build for Production

```bash
npm run build
```

This creates optimized files in `dist/` directory:
- Minified JavaScript
- Optimized CSS
- Bundled model files
- All necessary assets

### Deployment Options

#### 1. **Vercel (Recommended for Vite)**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

#### 2. **Netlify**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build
npm run build

# Deploy
netlify deploy --prod --dir=dist
```

#### 3. **Docker**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

#### 4. **Traditional Hosting (nginx)**
```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    root /var/www/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /model/ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

### ⚠️ Important: HTTPS is Required

Camera access (getUserMedia) requires HTTPS in production:
- Self-signed certs work on localhost
- Buy SSL certificate for production domain
- Use free SSL from Let's Encrypt

---

## Troubleshooting

### ❌ Problem: Port 5173 Already in Use

```bash
# Find process using port 5173
netstat -ano | findstr :5173

# Or use different port
npm run dev -- --port 3000
```

### ❌ Problem: Camera Permission Denied

**Solution**:
```bash
# Windows
# Settings → Privacy → Camera → Check if app is allowed

# macOS
# System Preferences → Security & Privacy → Camera

# Linux (depends on desktop environment)
# Check AppArmor or SELinux policies
```

### ❌ Problem: Model Files Not Found

**Error**: `Failed to load model. Ensure model files are in public/model/`

**Solution**:
```bash
# Check files exist
ls -la public/model/

# Verify file permissions
chmod 644 public/model/*

# Restart dev server
npm run dev
```

### ❌ Problem: HTTPS Certificate Warning

**Chrome/Edge**:
```
1. Type: thisisunsafe (on the warning page)
2. Browser will proceed
```

**Firefox**:
```
1. Click: "Advanced"
2. Click: "Accept the Risk and Continue"
```

### ❌ Problem: Slow Model Loading

**Solution**:
```javascript
// In src/services/ModelLoader.js
// Add timeout handling
const loadPromise = Promise.race([
  ModelLoader.loadModel(modelUrl),
  new Promise((_, reject) => 
    setTimeout(() => reject(new Error('Model load timeout')), 30000)
  )
]);
```

### ❌ Problem: No Detections Appearing

**Checklist**:
1. ✅ Model files are in `public/model/`
2. ✅ Camera permission granted
3. ✅ Good lighting in environment
4. ✅ Ingredient is in training data
5. ✅ Check browser DevTools console for errors

```bash
# Debug in browser DevTools
# F12 → Console tab
# Look for red errors
```

### ❌ Problem: Model File Size Too Large

**Solution**:
```bash
# Compress model files (after export from Teachable Machine)
gzip -9 public/model/weights.bin
# Rename to weights.bin.gz

# Update ModelLoader.js to handle compression
# Or re-train model with fewer classes
```

---

## Development Workflow

### File Structure Reference

```
project/
├── src/
│   ├── components/          # React UI components
│   ├── hooks/               # Custom React hooks
│   ├── services/            # ML & data services
│   ├── utils/               # Helper functions
│   ├── data/                # Static data (ingredient database)
│   ├── App.jsx              # Main app component
│   ├── App.css              # App styles
│   ├── index.css            # Global styles with Tailwind
│   └── main.jsx             # React entry point
│
├── public/
│   └── model/               # ⚠️ ADD YOUR MODEL FILES HERE
│       ├── model.json       # Required
│       ├── metadata.json    # Required
│       └── weights.bin      # Required
│
├── vite.config.js           # ✅ Configured
├── tailwind.config.js       # ✅ Configured
├── postcss.config.js        # ✅ Configured
├── package.json             # Dependencies list
└── README.md                # Project documentation
```

### npm Scripts

```bash
npm run dev      # Start dev server with HMR
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
npm run lint:fix # Fix ESLint issues
```

### Hot Module Replacement (HMR)

Changes auto-reload in browser:
```bash
# Edit any file in src/
# Browser updates automatically without full reload
```

---

## Next Steps

1. ✅ **Setup Complete!** Project structure is ready
2. 📊 **Create ML Model** on Teachable Machine (see above)
3. 📁 **Add Model Files** to `public/model/`
4. 🚀 **Run Dev Server** with `npm run dev`
5. 🎥 **Grant Camera Permission** when prompted
6. 📸 **Start Scanning** ingredients!

---

## Support & Resources

- **Teachable Machine Docs**: https://teachablemachine.withgoogle.com/faq
- **TensorFlow.js Docs**: https://js.tensorflow.org/
- **React Docs**: https://react.dev/
- **Vite Docs**: https://vite.dev/
- **Tailwind Docs**: https://tailwindcss.com/

---

**Last Updated**: May 2026
**Version**: 1.0.0
