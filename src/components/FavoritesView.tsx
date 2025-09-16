import React, { useEffect, useState } from 'react';
import { Heart, ArrowLeft } from 'lucide-react';
import { Recipe } from '../types/Recipe';

interface FavoritesViewProps {
  favoriteRecipes: Recipe[];
  onRecipeClick: (recipe: Recipe) => void;
  onBack: () => void;
  favorites: string[];
  onToggleFavorite: (recipeId: string) => void;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({ 
  favoriteRecipes, 
  onRecipeClick, 
  onBack, 
  favorites, 
  onToggleFavorite 
}) => {
  const hasFavs = favoriteRecipes.length > 0;

  return (
    <div className="w-full px-3 sm:px-4 py-4 sm:py-6 md:py-8 sm:max-w-7xl sm:mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 mb-3 sm:mb-4 md:mb-6 transition-colors touch-manipulation py-2"
      >
        <ArrowLeft className="h-5 w-5" />
        <span className="font-medium">Back to recipes</span>
      </button>

      <div className="mb-4 sm:mb-6 md:mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Heart className="h-8 w-8 text-red-500 fill-current" />
          <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">
            Your Favorite Recipes
          </h1>
        </div>
        <p className="text-sm text-gray-600">
          {hasFavs
            ? `You have ${favoriteRecipes.length} favorite recipe${favoriteRecipes.length === 1 ? '' : 's'}`
            : "You haven't saved any favorite recipes yet"}
        </p>
      </div>

      {hasFavs ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6 w-full">
          {favoriteRecipes.map((recipe) => (
            <div key={recipe.id} className="border rounded-lg overflow-hidden relative bg-white shadow-md hover:shadow-lg transition-shadow">
              {recipe.imageUrl ? (
                <img 
                  src={recipe.imageUrl} 
                  alt={recipe.name} 
                  className="w-full h-40 object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400';
                  }}
                />
              ) : (
                <div className="w-full h-40 bg-gray-100" />
              )}
              <div className="p-3">
                <div className="font-semibold text-gray-900 mb-1">{recipe.name}</div>
                {recipe.cuisine && (
                  <div className="text-sm text-gray-500 mb-2">{recipe.cuisine}</div>
                )}
                
                {/* Meal Types */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {recipe.mealType.slice(0, 2).map((type) => (
                    <span
                      key={type}
                      className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full whitespace-nowrap"
                    >
                      {type}
                    </span>
                  ))}
                  {recipe.mealType.length > 2 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      +{recipe.mealType.length - 2}
                    </span>
                  )}
                </div>
                
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => onRecipeClick(recipe)}
                    className="flex-1 px-3 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    View
                  </button>
                  <button
                    onClick={() => onToggleFavorite(recipe.id)}
                    className="px-3 py-2 text-sm border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                    title="Remove from favorites"
                  >
                    Remove
                  </button>
                </div>
              </div>

              {/* Corner remove button */}
              <button
                onClick={() => onToggleFavorite(recipe.id)}
                className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow border border-gray-200 hover:bg-white transition-colors"
                title="Remove from favorites"
              >
                <Heart className="h-4 w-4 text-red-500 fill-current" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 sm:py-12 md:py-16 px-3">
          <div className="text-6xl mb-4">💝</div>
          <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 mb-2">
            No favorite recipes yet
          </h3>
          <p className="text-sm text-gray-600 mb-4 sm:mb-6">
            Start exploring recipes and click the heart icon to save your favorites!
          </p>
          <button
            onClick={onBack}
            className="px-4 sm:px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors touch-manipulation text-sm sm:text-base"
          >
            Discover Recipes
          </button>
        </div>
      )}
    </div>
  );
};
