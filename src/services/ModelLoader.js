import * as tmImage from '@teachablemachine/image';
import * as tf from '@tensorflow/tfjs';

/**
 * ModelLoader untuk Teachable Machine
 * Load dan manage model untuk inference
 */
export class ModelLoader {
  constructor() {
    this.model = null;
    this.metadata = null;
    this.isLoading = false;
  }

  /**
   * Load Teachable Machine model
   * @param {string} modelUrl - URL path ke folder model (e.g., '/model/')
   * @returns {Promise<Object>} Model object
   */
  async load(modelUrl) {
    if (this.model) {
      return this.model;
    }

    this.isLoading = true;

    try {
      // Ensure TensorFlow backend ready
      await tf.ready();

      // Ensure URL has trailing slash
      const url = modelUrl.endsWith('/') ? modelUrl : modelUrl + '/';

      // Load model dari Teachable Machine
      this.model = await tmImage.load(
        `${url}model.json`,
        `${url}metadata.json`
      );

      // Ambil metadata
      this.metadata = this.model.getMetadata();

      console.log('✓ Model loaded successfully');
      this.isLoading = false;

      return this.model;
    } catch (error) {
      this.isLoading = false;
      console.error('✗ Error loading model:', error);
      throw new Error(
        `Failed to load model from ${modelUrl}: ${error.message}`
      );
    }
  }

  /**
   * Check apakah model sudah siap digunakan
   * @returns {boolean}
   */
  isReady() {
    return this.model !== null && !this.isLoading;
  }

  /**
   * Dispose model dan cleanup memory
   */
  dispose() {
    if (this.model) {
      this.model.dispose();
      this.model = null;
      this.metadata = null;
    }
  }

  /**
   * Get metadata dari model
   * @returns {Object} Model metadata
   */
  getMetadata() {
    return this.metadata;
  }
}

