import React from 'react';
import { Search, X } from 'lucide-react';
import { useSmartSearch } from '../hooks/useSmartSearch';
import { Recipe } from '../types/Recipe';

interface SearchToken {
  type: 'cuisine' | 'mealType' | 'healthGoal' | 'freeText';
  value: string;
  original: string;
}

interface SmartSearchBarProps {
  recipes: Recipe[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onFilteredRecipes: (recipes: Recipe[]) => void;
}

export const SmartSearchBar: React.FC<SmartSearchBarProps> = ({ 
  recipes, 
  searchTerm, 
  onSearchChange,
  onFilteredRecipes 
}) => {
  const { filteredRecipes, activeFilters } = useSmartSearch(recipes, searchTerm);

  // Update parent with filtered results
  React.useEffect(() => {
    onFilteredRecipes(filteredRecipes);
  }, [filteredRecipes, onFilteredRecipes]);

  const removeFilter = (filterToRemove: SearchToken) => {
    const tokens = searchTerm.split(/\s+/).filter(token => token.length > 0);
    const newTokens = tokens.filter(token => token !== filterToRemove.original);
    onSearchChange(newTokens.join(' '));
  };

  const getFilterColor = (type: string) => {
    switch (type) {
      case 'cuisine': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'mealType': return 'bg-green-100 text-green-700 border-green-200';
      case 'healthGoal': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'freeText': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getFilterLabel = (type: string) => {
    switch (type) {
      case 'cuisine': return 'Cuisine';
      case 'mealType': return 'Meal';
      case 'healthGoal': return 'Health';
      case 'freeText': return 'Text';
      default: return '';
    }
  };

  return (
    <div className="mb-3 sm:mb-4 md:mb-6 w-full">
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 text-base touch-manipulation"
          placeholder="Try: 'Italian Dinner Low Carb' or 'Thai spicy'"
        />
      </div>

      {/* Active Filter Chips */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {activeFilters.map((filter, index) => (
            <div
              key={index}
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm border ${getFilterColor(filter.type)} transition-colors`}
            >
              <span className="text-xs opacity-75">{getFilterLabel(filter.type)}:</span>
              <span className="font-medium">{filter.value}</span>
              <button
                onClick={() => removeFilter(filter)}
                className="ml-1 hover:bg-black/10 rounded-full p-0.5 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Results Summary */}
      {searchTerm && (
        <div className="mt-2 text-sm text-gray-600">
          Found {filteredRecipes.length} recipe{filteredRecipes.length !== 1 ? 's' : ''}
          {activeFilters.length > 0 && (
            <span className="ml-1">
              with {activeFilters.length} filter{activeFilters.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      )}
    </div>
  );
};