import React from 'react';
import { Filter, ArrowUpDown, X } from 'lucide-react';
import { FilterState } from '../types/Recipe';
import { cuisineOptions, mealTypeOptions, healthGoalOptions, sortOptions } from '../data/mockData';
import { MultiSelectFilter } from './MultiSelectFilter';

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({ filters, onFilterChange }) => {
  const handleFilterChange = (key: keyof FilterState, value: string | string[]) => {
    onFilterChange({
      ...filters,
      [key]: value
    });
  };

  const clearAllFilters = () => {
    onFilterChange({
      searchTerm: '',
      cuisines: [],
      mealTypes: [],
      healthGoals: [],
      sortBy: 'name'
    });
  };

  const hasActiveFilters = filters.cuisines.length > 0 || 
                          filters.mealTypes.length > 0 || 
                          filters.healthGoals.length > 0;

  return (
    <div className="bg-white p-3 sm:p-4 rounded-xl shadow-sm border border-gray-100 mb-3 sm:mb-4 md:mb-6 w-full">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900 text-sm">Filter Recipes</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors touch-manipulation self-start sm:self-auto"
          >
            <X className="h-4 w-4" />
            Clear All
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 sm:gap-4">
        <div>
          <MultiSelectFilter
            label="Cuisines"
            options={cuisineOptions.filter(option => option !== 'All Cuisines')}
            selectedValues={filters.cuisines}
            onChange={(values) => handleFilterChange('cuisines', values)}
            placeholder="Select cuisines..."
          />
        </div>

        <div>
          <MultiSelectFilter
            label="Meal Types"
            options={mealTypeOptions.filter(option => option !== 'All Meal Types')}
            selectedValues={filters.mealTypes}
            onChange={(values) => handleFilterChange('mealTypes', values)}
            placeholder="Select meal types..."
          />
        </div>

        <div>
          <MultiSelectFilter
            label="Health Goals"
            options={healthGoalOptions.filter(option => option !== 'All Health Goals')}
            selectedValues={filters.healthGoals}
            onChange={(values) => handleFilterChange('healthGoals', values)}
            placeholder="Select health goals..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
            <ArrowUpDown className="h-4 w-4" />
            Sort By
          </label>
          <select
            value={filters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors text-sm touch-manipulation"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};