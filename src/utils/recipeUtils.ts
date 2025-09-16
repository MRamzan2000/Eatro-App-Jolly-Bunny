import { Recipe, FilterState } from '../types/Recipe';

export const sortRecipes = (recipes: Recipe[], sortBy: string): Recipe[] => {
  const sorted = [...recipes];
  
  switch (sortBy) {
    case 'name':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    
    case 'newest':
      // Simulate newest recipes (higher ID = more recent)
      return sorted.sort((a, b) => parseInt(b.id) - parseInt(a.id));
    
    case 'calories-low':
      return sorted.sort((a, b) => a.nutrition.calories - b.nutrition.calories);
    
    case 'calories-high':
      return sorted.sort((a, b) => b.nutrition.calories - a.nutrition.calories);
    
    case 'protein-high':
      return sorted.sort((a, b) => b.nutrition.protein - a.nutrition.protein);
    
    case 'protein-low':
      return sorted.sort((a, b) => a.nutrition.protein - b.nutrition.protein);
    
    case 'popularity':
      // Simulate popularity based on recipe ID (lower ID = more popular)
      return sorted.sort((a, b) => parseInt(a.id) - parseInt(b.id));
    
    default:
      return sorted;
  }
};

export const filterRecipes = (
  recipes: Recipe[],
  searchTerm: string,
  filters: FilterState
): Recipe[] => {
  if (!recipes || recipes.length === 0) {
    return [];
  }
  
  return recipes.filter((recipe) => {
    // Search filter
    const matchesSearch = recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.ingredients.some(ingredient => 
        ingredient.toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    // Cuisine filter
    const matchesCuisine = filters.cuisines.length === 0 || 
      filters.cuisines.includes(recipe.cuisine);
    
    // Meal type filter
    const matchesMealType = filters.mealTypes.length === 0 || 
      filters.mealTypes.some(filterType => 
        Array.isArray(recipe.mealType) 
          ? recipe.mealType.includes(filterType)
          : recipe.mealType === filterType
      );
    
    // Health goal filter
    const matchesHealthGoal = filters.healthGoals.length === 0 || 
      filters.healthGoals.some(filterGoal => 
        Array.isArray(recipe.healthGoals)
          ? recipe.healthGoals.includes(filterGoal)
          : recipe.healthGoals === filterGoal
      );

    return matchesSearch && matchesCuisine && matchesMealType && matchesHealthGoal;
  });
};