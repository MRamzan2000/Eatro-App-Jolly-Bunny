import React from 'react';
import { Search, Filter, RefreshCw } from 'lucide-react';
import { FilterState } from '../types/Recipe';

interface SearchAndFilterProps {
  filters: { searchTerm: string; cuisine: string; mealType: string };
  onFiltersChange: (filters: { searchTerm: string; cuisine: string; mealType: string }) => void;
  onRefresh: () => void;
  cuisines: string[];
  mealTypes: string[];
}

export const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  filters,
  onFiltersChange,
  onRefresh,
  cuisines,
  mealTypes
}) => {
  const handleSearchChange = (searchTerm: string) => {
    onFiltersChange({ ...filters, searchTerm });
  };

  const handleCuisineChange = (cuisine: string) => {
    onFiltersChange({ ...filters, cuisine });
  };

  const handleMealTypeChange = (mealType: string) => {
    onFiltersChange({ ...filters, mealType });
  };

  const clearFilters = () => {
    onFiltersChange({ searchTerm: '', cuisine: '', mealType: '' });
  };

  const hasActiveFilters = filters.searchTerm || filters.cuisine || filters.mealType;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6 hidden">
      <div className="flex flex-col space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search recipes..."
            value={filters.searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Filters Row */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Cuisine Filter */}
          <div className="flex-1">
            <select
              value={filters.cuisine}
              onChange={(e) => handleCuisineChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="">All Cuisines</option>
              {cuisines.map((cuisine) => (
                <option key={cuisine} value={cuisine}>
                  {cuisine}
                </option>
              ))}
            </select>
          </div>

          {/* Meal Type Filter */}
          <div className="flex-1">
            <select
              value={filters.mealType}
              onChange={(e) => handleMealTypeChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="">All Meal Types</option>
              {mealTypes.map((mealType) => (
                <option key={mealType} value={mealType}>
                  {mealType}
                </option>
              ))}
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={onRefresh}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
              title="Refresh recipes from Google Apps Script"
            >
              <RefreshCw className="h-4 w-4" />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">Clear</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};