export interface Recipe {
  id: string;
  name: string;
  cuisine: string;
  mealType: string[];
  healthGoals: string[];
  imageUrl: string;
  image: string; // Alias for imageUrl for compatibility
  description: string;
  instructions: string;
  ingredients: string[];
  steps: string[];
  notes?: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  nutrition: {
    calories: number;
    protein: number;
    fat: number;
    carbs: number;
  };
}

export interface FilterState {
  searchTerm: string;
  cuisines: string[];
  mealTypes: string[];
  healthGoals: string[];
  sortBy: string;
  cuisines: string[];
  mealTypes: string[];
  healthGoals: string[];
  sortBy: string;
}

export interface UserPreferences {
  healthGoals: string[];
  dietaryRestrictions: string[];
  favoritesCuisines: string[];
  mealPreferences: string[];
}

export interface RecommendationRequest {
  prompt: string;
  preferences?: UserPreferences;
}