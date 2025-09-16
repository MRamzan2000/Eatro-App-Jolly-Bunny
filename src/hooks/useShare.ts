import { useState } from 'react';
import { Recipe } from '../types/Recipe';
import { generateRecipeMetadata } from '../utils/seoUtils';

export const useShare = () => {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const shareRecipe = async (recipe: Recipe) => {
    const metadata = generateRecipeMetadata(recipe);
    
    const shareData = {
      title: metadata.title,
      text: metadata.description,
      url: metadata.url
    };

    // Try Web Share API first
    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        return;
      } catch (error) {
        // User cancelled or error occurred, fall back to clipboard
        console.log('Web Share cancelled or failed:', error);
      }
    }

    // Fallback to clipboard
    try {
      await navigator.clipboard.writeText(metadata.url);
      showToastMessage('Recipe link copied to clipboard!');
    } catch (error) {
      // Final fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = metadata.url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      showToastMessage('Recipe link copied to clipboard!');
    }
  };

  return {
    shareRecipe,
    showToast,
    toastMessage
  };
};