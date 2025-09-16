import React from 'react';
import { ArrowLeft, Heart, AlertTriangle, Utensils, Wifi, WifiOff, Share2 } from 'lucide-react';
import { Recipe } from '../types/Recipe';
import { useOfflineCache } from '../hooks/useOfflineCache';
import { useShare } from '../hooks/useShare';

interface RecipeDetailProps {
  recipe: Recipe;
  onBack: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: (recipeId: string) => void;
}

export const RecipeDetail: React.FC<RecipeDetailProps> = ({ 
  recipe, 
  onBack, 
  isFavorite = false, 
  onToggleFavorite 
}) => {
  const { isRecipeCached, getCachedRecipe, isOnline } = useOfflineCache();
  const { shareRecipe } = useShare();
  const isCached = isRecipeCached(recipe.id);
  
  // Use cached version if offline and available
  const displayRecipe = !isOnline && isCached ? getCachedRecipe(recipe.id) || recipe : recipe;
  const imageUrl = !isOnline && isCached ? 
    (getCachedRecipe(recipe.id)?.imageBlob || (recipe as any).image) : 
    (recipe as any).image;
  
  const handleToggleFavorite = () => {
    if (onToggleFavorite) {
      onToggleFavorite(recipe.id);
    }
  };

  const handleShare = () => {
    shareRecipe(displayRecipe);
  };
  return (
    <div className="w-full px-3 sm:px-4 sm:max-w-4xl sm:mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 mb-3 sm:mb-4 md:mb-6 transition-colors touch-manipulation py-2"
      >
        <ArrowLeft className="h-5 w-5" />
        <span className="font-medium">Back to recipes</span>
      </button>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 w-full">
        <div className="relative">
          {/* Offline Status Badge */}
          {!isOnline && isCached && (
            <div className="absolute top-3 left-3 z-10 bg-emerald-500 text-white px-3 py-1 rounded-full flex items-center gap-1 text-sm font-medium">
              <WifiOff className="h-4 w-4" />
              <span>Viewing Offline</span>
            </div>
          )}
          
          <img
            src={imageUrl}
            alt={displayRecipe.name}
            className="w-full h-40 sm:h-48 md:h-64 lg:h-80 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

          {/* Action Buttons */}
          <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex gap-2">
            <button
              onClick={handleShare}
              className="bg-white/95 hover:bg-white rounded-full p-2 shadow border border-gray-200 transition-colors"
              title="Share recipe"
            >
              <Share2 className="h-5 w-5 text-blue-500" />
            </button>
            {onToggleFavorite && (
              <button
                onClick={handleToggleFavorite}
                className="bg-white/95 hover:bg-white rounded-full p-2 shadow border border-gray-200 transition-colors"
                title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Heart
                  className="h-5 w-5 text-red-500"
                  fill={isFavorite ? 'currentColor' : 'none'}
                />
              </button>
            )}
          </div>

          <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 md:bottom-6 md:left-6 md:right-6 text-white">
            <h1 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 leading-tight">
              {displayRecipe.name}
            </h1>
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4 text-xs sm:text-sm flex-wrap">
              <div className="flex items-center gap-1">
                <Utensils className="h-4 w-4" />
                <span>{displayRecipe.cuisine}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-3 sm:p-4 md:p-6">
          <div className="mb-3 sm:mb-4 md:mb-6">
            <div className="flex flex-wrap gap-2 mb-4">
              {displayRecipe.mealType.map((type) => (
                <span
                  key={type}
                  className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium whitespace-nowrap flex-shrink-0"
                >
                  {type}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {displayRecipe.healthGoals.map((goal) => (
                <span
                  key={goal}
                  className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full font-medium whitespace-nowrap flex-shrink-0"
                >
                  {goal}
                </span>
              ))}
            </div>

            {displayRecipe.notes && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2 w-full">
                <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <p className="text-amber-800 text-sm leading-relaxed flex-1 min-w-0">
                  {displayRecipe.notes}
                </p>
              </div>
            )}
          </div>

          {/* Nutrition */}
          <div className="mb-4 sm:mb-6 md:mb-8">
            <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-1 sm:mb-2 flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              Nutrition Facts
            </h2>
            <p className="text-xs text-gray-500 mb-3">
              All recipes are designed for 2–3 servings. Nutrition values are calculated per serving.
            </p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
              <div className="bg-gray-50 rounded-lg p-3 text-center min-w-0">
                <div className="text-sm text-gray-600">
                  Calories: {displayRecipe.calories || 0} kcal
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center min-w-0">
                <div className="text-sm text-gray-600">
                  Protein: {displayRecipe.protein || 0} g
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center min-w-0">
                <div className="text-sm text-gray-600">
                  Fat: {displayRecipe.fat || 0} g
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center min-w-0">
                <div className="text-sm text-gray-600">
                  Carbs: {displayRecipe.carbs || 0} g
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 md:gap-8">
            <div>
              <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
                Ingredients
              </h2>
              <ul className="space-y-2">
                {displayRecipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="flex items-start gap-3 w-full">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-sm text-gray-700 leading-relaxed flex-1 min-w-0">
                      {ingredient}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
                Instructions
              </h2>
              <ol className="space-y-4">
                {displayRecipe.steps.map((step, index) => (
                  <li key={index} className="flex gap-3 w-full">
                    <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                      {index + 1}
                    </div>
                    <p className="text-sm text-gray-700 pt-1 leading-relaxed flex-1 min-w-0">
                      {step}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
