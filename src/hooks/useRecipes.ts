import { useState, useEffect } from 'react';
import { Recipe } from '../types/Recipe';
import { getRecipes, clearRecipesCache } from '../services/googleSheetsService';

export const useRecipes = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadRecipes = async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const fetchedRecipes = await getRecipes(forceRefresh);
      setRecipes(fetchedRecipes);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load recipes');
      console.error('Error loading recipes:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshRecipes = async () => {
    clearRecipesCache();
    await loadRecipes(true);
  };

  useEffect(() => {
    loadRecipes();
  }, []);

  return {
    recipes,
    loading,
    error,
    refreshRecipes
  };
};