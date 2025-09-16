import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Recipe } from '../types/Recipe';
import { RecipeCard } from './RecipeCard';

interface RecipeListProps {
  recipes: Recipe[];
  onRecipeClick: (recipe: Recipe) => void;
  favorites: string[];
  onToggleFavorite: (recipeId: string) => void;
  // Pagination props
  currentPage?: number;
  totalPages?: number;
  onNextPage?: () => void;
  onPreviousPage?: () => void;
  canGoNext?: boolean;
  canGoPrevious?: boolean;
  totalRecipes?: number;
  startIndex?: number;
  endIndex?: number;
}

export const RecipeList: React.FC<RecipeListProps> = ({ 
  recipes, 
  onRecipeClick, 
  favorites, 
  onToggleFavorite,
  currentPage = 1,
  totalPages = 1,
  onNextPage,
  onPreviousPage,
  canGoNext = false,
  canGoPrevious = false,
  totalRecipes = 0,
  startIndex = 1,
  endIndex = 0
}) => {
  if (recipes.length === 0) {
    return (
      <div className="text-center py-8 sm:py-12 md:py-16 px-3">
        <div className="text-6xl mb-4">🍽️</div>
        <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 mb-2">No recipes found</h3>
        <p className="text-sm text-gray-600">Try adjusting your search or filters to find more recipes.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Recipe Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6 w-full">
        {recipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            onClick={() => onRecipeClick(recipe)}
            isFavorite={favorites.includes(recipe.id)}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </div>
      
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-8 sm:mt-12 flex flex-col items-center gap-4">
          {/* Navigation Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={onPreviousPage}
              disabled={!canGoPrevious}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors touch-manipulation ${
                canGoPrevious
                  ? 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                  : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="font-medium">Previous</span>
            </button>
            
            {/* Page Numbers */}
            <div className="flex items-center gap-1 mx-2">
              <span className="px-3 py-2 text-sm font-medium text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
            </div>
            
            <button
              onClick={onNextPage}
              disabled={!canGoNext}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors touch-manipulation ${
                canGoNext
                  ? 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                  : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <span className="font-medium">Next</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};