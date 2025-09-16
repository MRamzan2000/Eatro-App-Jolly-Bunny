import React, { useState } from 'react';
import { Settings, Save, X } from 'lucide-react';
import { UserPreferences } from '../types/Recipe';
import { healthGoalOptions, cuisineOptions, mealTypeOptions, dietaryRestrictions } from '../data/mockData';

interface UserPreferencesProps {
  preferences: UserPreferences;
  onSave: (preferences: UserPreferences) => void;
  onClose: () => void;
}

export const UserPreferencesModal: React.FC<UserPreferencesProps> = ({
  preferences,
  onSave,
  onClose
}) => {
  const [localPreferences, setLocalPreferences] = useState<UserPreferences>(preferences);

  const handleMultiSelect = (category: keyof UserPreferences, value: string) => {
    const currentValues = localPreferences[category] as string[];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    
    setLocalPreferences({
      ...localPreferences,
      [category]: newValues
    });
  };

  const handleSave = () => {
    onSave(localPreferences);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-2 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[95vh] overflow-y-auto mx-2">
        <div className="p-3 sm:p-4 md:p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Settings className="h-6 w-6 text-emerald-600" />
              <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900">Your Preferences</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors touch-manipulation"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Customize your experience to get better recipe recommendations
          </p>
        </div>

        <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
          {/* Health Goals */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-2 sm:mb-3 text-sm">Health Goals</h3>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
              {healthGoalOptions.filter(goal => goal !== 'All Health Goals').map((goal) => (
                <button
                  key={goal}
                  onClick={() => handleMultiSelect('healthGoals', goal)}
                  className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                    localPreferences.healthGoals.includes(goal)
                      ? 'bg-emerald-100 border-emerald-300 text-emerald-700'
                      : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                  } touch-manipulation text-left w-full min-w-0 truncate`}
                >
                  {goal}
                </button>
              ))}
            </div>
          </div>

          {/* Dietary Restrictions */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-2 sm:mb-3 text-sm">Dietary Restrictions</h3>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
              {dietaryRestrictions.map((restriction) => (
                <button
                  key={restriction}
                  onClick={() => handleMultiSelect('dietaryRestrictions', restriction)}
                  className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                    localPreferences.dietaryRestrictions.includes(restriction)
                      ? 'bg-red-100 border-red-300 text-red-700'
                      : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                  } touch-manipulation text-left w-full min-w-0 truncate`}
                >
                  {restriction}
                </button>
              ))}
            </div>
          </div>

          {/* Favorite Cuisines */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-2 sm:mb-3 text-sm">Favorite Cuisines</h3>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
              {cuisineOptions.filter(cuisine => cuisine !== 'All Cuisines').map((cuisine) => (
                <button
                  key={cuisine}
                  onClick={() => handleMultiSelect('favoritesCuisines', cuisine)}
                  className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                    localPreferences.favoritesCuisines.includes(cuisine)
                      ? 'bg-green-100 border-green-300 text-green-700'
                      : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                  } touch-manipulation text-left w-full min-w-0 truncate`}
                >
                  {cuisine}
                </button>
              ))}
            </div>
          </div>

          {/* Meal Preferences */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-2 sm:mb-3 text-sm">Meal Preferences</h3>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
              {mealTypeOptions.filter(meal => meal !== 'All Meal Types').map((meal) => (
                <button
                  key={meal}
                  onClick={() => handleMultiSelect('mealPreferences', meal)}
                  className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                    localPreferences.mealPreferences.includes(meal)
                      ? 'bg-green-100 border-green-300 text-green-700'
                      : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                  } touch-manipulation text-left w-full min-w-0 truncate`}
                >
                  {meal}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-3 sm:p-4 md:p-6 border-t border-gray-200 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={handleSave}
            className="w-full sm:flex-1 bg-emerald-600 text-white px-4 py-3 rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 touch-manipulation text-sm sm:text-base"
          >
            <Save className="h-4 w-4" />
            Save Preferences
          </button>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors touch-manipulation text-sm sm:text-base"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};