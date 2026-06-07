# Teachable Machine Model Files

This directory should contain the trained Teachable Machine model files:

1. **model.json** - Model architecture and metadata
2. **metadata.json** - Class labels and other metadata
3. **weights.bin** - Model weights

## How to export your Teachable Machine model:

1. Visit [Teachable Machine](https://teachablemachine.withgoogle.com/)
2. Train your image classification model with ingredient images
3. Go to Export → Export Model → Tensorflow.js
4. Download the three files: model.json, metadata.json, weights.bin
5. Extract and place them in this directory

## File Structure:
```
public/model/
├── model.json
├── metadata.json
└── weights.bin
```

The app will look for these files automatically when loading the model.
