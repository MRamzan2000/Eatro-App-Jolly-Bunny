import React from 'react';
import { X } from 'lucide-react';
import { Recipe } from '../types/Recipe';

interface RecipeModalProps {
  recipe: Recipe;
  onClose: () => void;
}

export const RecipeModal: React.FC<RecipeModalProps> = ({ recipe, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative">
          <img
            src={recipe.imageUrl}
            alt={recipe.name}
            className="w-full h-64 object-cover rounded-t-lg"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400';
            }}
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
          <div className="absolute bottom-4 left-4 right-4">
            <h1 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">
              {recipe.name}
            </h1>
            <div className="flex gap-2">
              <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-blue-600">
                {recipe.cuisine}
              </span>
              <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-green-600">
                {recipe.mealType}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Description */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Description</h2>
            <p className="text-gray-700 leading-relaxed">{recipe.description}</p>
          </div>

          {/* Instructions */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Instructions</h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {recipe.instructions}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};