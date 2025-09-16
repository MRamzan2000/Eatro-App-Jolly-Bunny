import { useState, useEffect } from 'react';
import { User } from '../types/Auth';
import { useOfflineCache } from './useOfflineCache';
import { Recipe } from '../types/Recipe';

export const useFavorites = (user?: User | null, recipes: Recipe[] = []) => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const { cacheRecipe, removeCachedRecipe } = useOfflineCache();

  // Get storage key based on user
  const getStorageKey = () => {
    if (user && user.provider !== 'guest') {
      return `eatro-favorites-${user.id}`;
    }
    return 'eatro-favorites';
  };

  // Load favorites from localStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem(getStorageKey());
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    } else {
      setFavorites([]);
    }
  }, [user]);

  // Save favorites to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(getStorageKey(), JSON.stringify(favorites));
  }, [favorites, user]);

  const toggleFavorite = (recipeId: string) => {
    const recipe = recipes.find(r => r.id === recipeId);
    
    setFavorites(prev => {
      if (prev.includes(recipeId)) {
        // Remove from cache when unfavorited
        removeCachedRecipe(recipeId);
        return prev.filter(id => id !== recipeId);
      } else {
        // Cache recipe when favorited
        if (recipe) {
          cacheRecipe(recipe);
        }
        return [...prev, recipeId];
      }
    });
  };

  const isFavorite = (recipeId: string) => favorites.includes(recipeId);

  return {
    favorites,
    toggleFavorite,
    isFavorite
  };
};