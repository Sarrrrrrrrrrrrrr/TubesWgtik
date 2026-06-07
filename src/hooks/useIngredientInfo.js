import { useState, useEffect } from 'react';
import ingredientData from '../data/ingredientInfo.json';

/**
 * Hook untuk mendapatkan info detail bahan masakan
 * @param {string} className - Nama kelas bahan
 * @returns {Object} Info lengkap bahan atau null
 */
export function useIngredientInfo(className) {
  const [info, setInfo] = useState(null);

  useEffect(() => {
    if (!className) {
      setInfo(null);
      return;
    }

    // Cari ingredient yang sesuai
    const ingredient = ingredientData.ingredients.find(
      (item) => item.className === className
    );

    if (ingredient) {
      setInfo(ingredient);
    } else {
      setInfo(null);
    }
  }, [className]);

  return info;
}
