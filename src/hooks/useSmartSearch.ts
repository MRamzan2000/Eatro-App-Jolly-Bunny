import { useMemo } from 'react';
import { Recipe } from '../types/Recipe';

interface SearchToken {
  type: 'cuisine' | 'mealType' | 'healthGoal' | 'freeText';
  value: string;
  original: string;
}

interface SmartSearchResult {
  filteredRecipes: Recipe[];
  activeFilters: SearchToken[];
}

// Fuzzy matching function
const fuzzyMatch = (text: string, pattern: string): boolean => {
  const textLower = text.toLowerCase();
  const patternLower = pattern.toLowerCase();
  
  // Exact match
  if (textLower.includes(patternLower)) return true;
  
  // Simple typo tolerance (1-2 character differences)
  if (Math.abs(text.length - pattern.length) <= 2) {
    let differences = 0;
    const minLength = Math.min(textLower.length, patternLower.length);
    
    for (let i = 0; i < minLength; i++) {
      if (textLower[i] !== patternLower[i]) {
        differences++;
        if (differences > 2) return false;
      }
    }
    
    return differences <= 2;
  }
  
  return false;
};

// Known filter options for matching
const CUISINE_OPTIONS = [
  'Chinese', 'Japanese', 'Korean', 'Vietnamese', 'Thai', 'Italian', 'French', 
  'Mexican', 'American', 'Mediterranean', 'Global Fusion', 'Vegetarian', 'Vegan', 'Healthy'
];

const MEAL_TYPE_OPTIONS = [
  'Breakfast', 'Lunch', 'Dinner', 'Romantic', 'Birthday', 'Party', 
  'Special Occasion', 'Dessert', 'Staple Food', 'Appetizer'
];

const HEALTH_GOAL_OPTIONS = [
  'Cardiovascular Wellness', 'Blood Sugar Friendly', 'Cholesterol Friendly',
  'Kidney Friendly', 'Liver Friendly', 'Digestive Health', 'Gut Health',
  'Healthy Weight', 'Lower Sodium', 'Lower Carb', 'Low Carb', 'High Fiber',
  'Immune Wellness', 'Senior-Friendly', 'Iron Rich', 'Higher in Protein',
  'High Protein', 'Bone Health', 'Brain Boost', 'Supports Thyroid Health',
  'Supports Lung Health', 'Skin & Hair Health', 'Heart Health', 'Anti-Inflammatory',
  'Weight Control', 'Mediterranean Diet', 'Balanced Nutrition', 'Immune Support',
  'Superfood'
];

export const useSmartSearch = (recipes: Recipe[], searchQuery: string): SmartSearchResult => {
  return useMemo(() => {
    if (!searchQuery.trim()) {
      return {
        filteredRecipes: recipes,
        activeFilters: []
      };
    }

    const tokens = searchQuery.split(/\s+/).filter(token => token.length > 0);
    const searchTokens: SearchToken[] = [];
    const freeTextTokens: string[] = [];

    // Classify each token
    tokens.forEach(token => {
      let matched = false;

      // Check cuisines
      for (const cuisine of CUISINE_OPTIONS) {
        if (fuzzyMatch(cuisine, token)) {
          searchTokens.push({
            type: 'cuisine',
            value: cuisine,
            original: token
          });
          matched = true;
          break;
        }
      }

      if (!matched) {
        // Check meal types
        for (const mealType of MEAL_TYPE_OPTIONS) {
          if (fuzzyMatch(mealType, token)) {
            searchTokens.push({
              type: 'mealType',
              value: mealType,
              original: token
            });
            matched = true;
            break;
          }
        }
      }

      if (!matched) {
        // Check health goals
        for (const healthGoal of HEALTH_GOAL_OPTIONS) {
          if (fuzzyMatch(healthGoal, token)) {
            searchTokens.push({
              type: 'healthGoal',
              value: healthGoal,
              original: token
            });
            matched = true;
            break;
          }
        }
      }

      if (!matched) {
        freeTextTokens.push(token);
      }
    });

    // Add free text as a single token if any
    if (freeTextTokens.length > 0) {
      searchTokens.push({
        type: 'freeText',
        value: freeTextTokens.join(' '),
        original: freeTextTokens.join(' ')
      });
    }

    // Filter recipes based on tokens
    const filteredRecipes = recipes.filter(recipe => {
      // Check each filter type (AND logic across categories)
      const cuisineFilters = searchTokens.filter(t => t.type === 'cuisine');
      const mealTypeFilters = searchTokens.filter(t => t.type === 'mealType');
      const healthGoalFilters = searchTokens.filter(t => t.type === 'healthGoal');
      const freeTextFilters = searchTokens.filter(t => t.type === 'freeText');

      // Cuisine filter
      if (cuisineFilters.length > 0) {
        const matchesCuisine = cuisineFilters.some(filter => 
          fuzzyMatch(recipe.cuisine, filter.value)
        );
        if (!matchesCuisine) return false;
      }

      // Meal type filter
      if (mealTypeFilters.length > 0) {
        const matchesMealType = mealTypeFilters.some(filter =>
          Array.isArray(recipe.mealType)
            ? recipe.mealType.some(mt => fuzzyMatch(mt, filter.value))
            : fuzzyMatch(recipe.mealType, filter.value)
        );
        if (!matchesMealType) return false;
      }

      // Health goal filter
      if (healthGoalFilters.length > 0) {
        const matchesHealthGoal = healthGoalFilters.some(filter =>
          Array.isArray(recipe.healthGoals)
            ? recipe.healthGoals.some(hg => fuzzyMatch(hg, filter.value))
            : fuzzyMatch(recipe.healthGoals, filter.value)
        );
        if (!matchesHealthGoal) return false;
      }

      // Free text search
      if (freeTextFilters.length > 0) {
        const searchText = `${recipe.name} ${recipe.description} ${recipe.ingredients.join(' ')}`.toLowerCase();
        const matchesFreeText = freeTextFilters.some(filter =>
          filter.value.toLowerCase().split(' ').every(word =>
            searchText.includes(word)
          )
        );
        if (!matchesFreeText) return false;
      }

      return true;
    });

    return {
      filteredRecipes,
      activeFilters: searchTokens
    };
  }, [recipes, searchQuery]);
};