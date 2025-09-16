import React from 'react';
import { Heart, Wifi, WifiOff, Share2 } from 'lucide-react';
import { Recipe } from '../types/Recipe';
import { useOfflineCache } from '../hooks/useOfflineCache';
import { useShare } from '../hooks/useShare';

interface RecipeCardProps {
  recipe: Recipe;
  onClick: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: (recipeId: string) => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ 
  recipe, 
  onClick, 
  isFavorite = false, 
  onToggleFavorite 
}) => {
  const { isRecipeCached, isOnline } = useOfflineCache();
  const { shareRecipe } = useShare();
  const isCached = isRecipeCached(recipe.id);
  
  // Handle both single mealType string and array formats for compatibility
  const mealTypeDisplay = Array.isArray(recipe.mealType) 
    ? recipe.mealType.join(', ') || 'Meal'
    : recipe.mealType || 'Meal';

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(recipe.id);
    }
  };

  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    shareRecipe(recipe);
  };
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1 border border-gray-100 relative"
    >
      {/* Recipe Image */}
      <div className="relative overflow-hidden rounded-t-lg">
        <img
          src={recipe.imageUrl}
          alt={recipe.name}
          className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400';
          }}
        />
        
        {/* Offline Badge */}
        {isCached && (
          <div className="absolute top-2 left-2 bg-emerald-500 text-white px-2 py-1 rounded-full flex items-center gap-1 text-xs font-medium">
            {isOnline ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
            <span>Offline</span>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="absolute top-2 right-2 flex gap-1">
          <button
            onClick={handleShareClick}
            className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
            title="Share recipe"
          >
            <Share2 className="h-4 w-4 text-gray-600 hover:text-blue-500" />
          </button>
          {onToggleFavorite && (
            <button
              onClick={handleFavoriteClick}
              className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart 
                className={`h-4 w-4 ${
                  isFavorite 
                    ? 'text-red-500 fill-current' 
                    : 'text-gray-600 hover:text-red-500'
                }`} 
              />
            </button>
          )}
        </div>
        
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
          <span className="text-sm font-medium text-emerald-600">{recipe.cuisine}</span>
        </div>
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
          <span className="text-sm font-medium text-green-600">{mealTypeDisplay}</span>
        </div>
      </div>

      {/* Recipe Content */}
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
          {recipe.name}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-3">
          {recipe.description}
        </p>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <span className="bg-gray-100 px-2 py-1 rounded-full">
            {recipe.cuisine}
          </span>
          <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full">
            {mealTypeDisplay}
          </span>
        </div>
      </div>
    </div>
  );
};