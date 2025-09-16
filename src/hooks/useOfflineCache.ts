import { useState, useEffect } from 'react';
import { Recipe } from '../types/Recipe';

interface CachedRecipe extends Recipe {
  cachedAt: number;
  imageBlob?: string;
}

const CACHE_KEY = 'eatro-offline-recipes';
const IMAGE_CACHE_KEY = 'eatro-cached-images';

export const useOfflineCache = () => {
  const [cachedRecipes, setCachedRecipes] = useState<Map<string, CachedRecipe>>(new Map());
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // Load cached recipes from localStorage
    const loadCachedRecipes = () => {
      try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const parsedCache = JSON.parse(cached);
          setCachedRecipes(new Map(Object.entries(parsedCache)));
        }
      } catch (error) {
        console.error('Error loading cached recipes:', error);
      }
    };

    loadCachedRecipes();

    // Listen for online/offline events
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const cacheRecipe = async (recipe: Recipe) => {
    try {
      // Cache recipe data
      const cachedRecipe: CachedRecipe = {
        ...recipe,
        cachedAt: Date.now()
      };

      // Try to cache the image
      if (recipe.imageUrl) {
        try {
          const response = await fetch(recipe.imageUrl);
          const blob = await response.blob();
          const reader = new FileReader();
          
          reader.onloadend = () => {
            cachedRecipe.imageBlob = reader.result as string;
            
            // Update cache
            const newCache = new Map(cachedRecipes);
            newCache.set(recipe.id, cachedRecipe);
            setCachedRecipes(newCache);
            
            // Save to localStorage
            const cacheObject = Object.fromEntries(newCache);
            localStorage.setItem(CACHE_KEY, JSON.stringify(cacheObject));
          };
          
          reader.readAsDataURL(blob);
        } catch (imageError) {
          console.warn('Failed to cache image for recipe:', recipe.id, imageError);
          
          // Cache recipe without image
          const newCache = new Map(cachedRecipes);
          newCache.set(recipe.id, cachedRecipe);
          setCachedRecipes(newCache);
          
          const cacheObject = Object.fromEntries(newCache);
          localStorage.setItem(CACHE_KEY, JSON.stringify(cacheObject));
        }
      }
    } catch (error) {
      console.error('Error caching recipe:', error);
    }
  };

  const removeCachedRecipe = (recipeId: string) => {
    const newCache = new Map(cachedRecipes);
    newCache.delete(recipeId);
    setCachedRecipes(newCache);
    
    const cacheObject = Object.fromEntries(newCache);
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheObject));
  };

  const getCachedRecipe = (recipeId: string): CachedRecipe | null => {
    return cachedRecipes.get(recipeId) || null;
  };

  const isRecipeCached = (recipeId: string): boolean => {
    return cachedRecipes.has(recipeId);
  };

  return {
    cacheRecipe,
    removeCachedRecipe,
    getCachedRecipe,
    isRecipeCached,
    isOnline,
    cachedRecipes: Array.from(cachedRecipes.values())
  };
};