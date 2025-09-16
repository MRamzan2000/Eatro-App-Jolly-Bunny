import React, { useState } from 'react';
import { Sparkles, Send, Loader, RefreshCw, Lightbulb } from 'lucide-react';
import { Recipe, UserPreferences, RecommendationRequest } from '../types/Recipe';
import { parseNaturalLanguageQuery, generateFriendlyResponse } from '../utils/aiUtils';

interface AIRecommendationsProps {
  preferences: UserPreferences;
  onRecommendationClick: (recipe: Recipe) => void;
  availableRecipes: Recipe[];
}

export const AIRecommendations: React.FC<AIRecommendationsProps> = ({
  preferences,
  onRecommendationClick,
  availableRecipes
}) => {
  const [prompt, setPrompt] = useState('');
  const [recommendations, setRecommendations] = useState<Recipe[]>([]);
  const [aiResponse, setAiResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInspiring, setIsInspiring] = useState(false);
  const [todaysRecommendations, setTodaysRecommendations] = useState<Recipe[]>([]);
  const [quickPrompts] = useState([
    "A quick salmon dinner under 500 calories",
    "A kid-friendly lunchbox without nuts", 
    "A warm vegetarian soup for rainy days",
    "Something spicy and anti-inflammatory",
    "A Mediterranean dish for heart health",
    "Quick breakfast with high protein"
  ]);

  // Enhanced AI recommendation logic with natural language understanding
  const generateRecommendations = async (request: RecommendationRequest) => {
    setIsLoading(true);
    setAiResponse('');
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Parse natural language query
    const parsedQuery = parseNaturalLanguageQuery(request.prompt);
    
    // Enhanced recommendation logic
    let filtered = availableRecipes;
    
    // Apply parsed filters
    filtered = availableRecipes.filter(recipe => {
      // Cuisine filter from natural language
      const matchesCuisine = parsedQuery.cuisines.length === 0 ||
        parsedQuery.cuisines.some(cuisine => 
          recipe.cuisine.toLowerCase().includes(cuisine.toLowerCase())
        );
      
      // Meal type filter from natural language
      const matchesMealType = parsedQuery.mealTypes.length === 0 ||
        parsedQuery.mealTypes.some(mealType =>
          recipe.mealType.some(mt => 
            mt.toLowerCase().includes(mealType.toLowerCase())
          )
        );
      
      // Health goals filter from natural language
      const matchesHealthGoals = parsedQuery.healthGoals.length === 0 ||
        parsedQuery.healthGoals.some(goal =>
          recipe.healthGoals.some(hg =>
            hg.toLowerCase().includes(goal.toLowerCase())
          )
        );
      
      // Free text search in recipe content
      const matchesFreeText = parsedQuery.freeText.length === 0 ||
        parsedQuery.freeText.some(text => {
          const searchContent = `${recipe.name} ${recipe.description} ${recipe.ingredients.join(' ')}`.toLowerCase();
          return searchContent.includes(text.toLowerCase());
        });
      
      // Calorie filter if specified
      const matchesCalories = !parsedQuery.maxCalories || recipe.calories <= parsedQuery.maxCalories;
      
      return matchesCuisine && matchesMealType && matchesHealthGoals && matchesFreeText && matchesCalories;
    });
    
    // Apply user preferences as secondary filter
    if (request.preferences && filtered.length > 3) {
      const preferenceFiltered = filtered.filter(recipe => {
        const matchesUserHealthGoals = request.preferences!.healthGoals.length === 0 || 
          request.preferences!.healthGoals.some(goal => recipe.healthGoals.includes(goal));
        
        const matchesUserCuisine = request.preferences!.favoritesCuisines.length === 0 ||
          request.preferences!.favoritesCuisines.includes(recipe.cuisine);
        
        return matchesUserHealthGoals || matchesUserCuisine;
      });
      
      if (preferenceFiltered.length > 0) {
        filtered = preferenceFiltered;
      }
    }
    
    // Generate friendly AI response
    const response = generateFriendlyResponse(request.prompt, filtered, parsedQuery);
    setAiResponse(response);
    
    // Return top 3-4 recommendations
    const shuffled = filtered.sort(() => 0.5 - Math.random());
    setRecommendations(shuffled.slice(0, Math.min(4, filtered.length)));
    setIsLoading(false);
  };

  // Inspire Me functionality
  const handleInspireMe = async () => {
    setIsInspiring(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Get a random healthy recipe
    const healthyRecipes = availableRecipes.filter(recipe =>
      recipe.healthGoals.some(goal => 
        ['Heart Health', 'High Protein', 'Anti-Inflammatory', 'Balanced Nutrition', 'Superfood'].includes(goal)
      )
    );
    
    const randomRecipe = healthyRecipes[Math.floor(Math.random() * healthyRecipes.length)];
    
    if (randomRecipe) {
      const inspiringMessages = [
        `How about trying this ${randomRecipe.name} today? It's perfect for ${randomRecipe.healthGoals[0].toLowerCase()}!`,
        `I think you'd love this ${randomRecipe.name}! It's a wonderful ${randomRecipe.cuisine.toLowerCase()} dish.`,
        `Here's something special: ${randomRecipe.name}. Great for ${randomRecipe.mealType[0].toLowerCase()} and so nutritious!`,
        `Let me inspire you with ${randomRecipe.name} - it's one of my favorites for healthy eating!`,
        `Why not try ${randomRecipe.name}? It's delicious and supports ${randomRecipe.healthGoals[0].toLowerCase()}.`
      ];
      
      const randomMessage = inspiringMessages[Math.floor(Math.random() * inspiringMessages.length)];
      setAiResponse(randomMessage);
      setRecommendations([randomRecipe]);
    }
    
    setIsInspiring(false);
  };

  const generateTodaysRecommendations = () => {
    // Generate daily recommendations based on user preferences
    let filtered = availableRecipes;
    
    if (preferences.healthGoals.length > 0) {
      filtered = filtered.filter(recipe =>
        preferences.healthGoals.some(goal => recipe.healthGoals.includes(goal))
      );
    }
    
    if (preferences.favoritesCuisines.length > 0) {
      filtered = filtered.filter(recipe =>
        preferences.favoritesCuisines.includes(recipe.cuisine)
      );
    }
    
    // Get 4 random recommendations
    const shuffled = filtered.sort(() => 0.5 - Math.random());
    setTodaysRecommendations(shuffled.slice(0, 4));
  };

  React.useEffect(() => {
    generateTodaysRecommendations();
  }, [preferences]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      generateRecommendations({ prompt, preferences });
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-8 w-full">
      {/* Today's Recommendations */}
      <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-3 sm:p-4 md:p-6 border border-emerald-200 w-full">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-emerald-600" />
            <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900">Today's Recommendations</h2>
          </div>
          <button
            onClick={generateTodaysRecommendations}
            className="flex items-center gap-1 px-3 py-2 text-sm text-emerald-600 hover:text-emerald-700 hover:bg-emerald-100 rounded-lg transition-colors touch-manipulation flex-shrink-0"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </button>
        </div>
        
        <p className="text-sm text-gray-600 mb-3 sm:mb-4">
          Curated recipes based on your preferences and health goals
        </p>
        
        {todaysRecommendations.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 sm:gap-4">
            {todaysRecommendations.map((recipe) => (
              <div
                key={recipe.id}
                onClick={() => onRecommendationClick(recipe)}
                className="bg-white rounded-lg p-3 cursor-pointer hover:shadow-md transition-shadow border border-gray-100 touch-manipulation w-full"
              >
                <img
                  src={recipe.image}
                  alt={recipe.name}
                  className="w-full h-20 object-cover rounded-lg mb-2"
                />
                <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2 leading-tight min-w-0">
                  {recipe.name}
                </h3>
                <p className="text-xs text-gray-600 mb-2">{recipe.cuisine}</p>
                <div className="flex flex-wrap gap-1 min-w-0">
                  {recipe.healthGoals.slice(0, 1).map((goal) => (
                    <span
                      key={goal}
                      className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full whitespace-nowrap flex-shrink-0"
                    >
                      {goal}
                    </span>
                  ))}
                  {recipe.healthGoals.length > 1 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full whitespace-nowrap">
                      +{recipe.healthGoals.length - 1}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 sm:py-8">
            <p className="text-sm text-gray-500">Set your preferences to get personalized recommendations!</p>
          </div>
        )}
      </div>

      {/* AI-Powered Recommendations */}
      <div className="bg-white rounded-xl p-3 sm:p-4 md:p-6 shadow-sm border border-gray-100 w-full">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-6 w-6 text-green-600" />
          <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900">AI Recipe Assistant</h2>
        </div>
        
        <p className="text-sm text-gray-600 mb-3 sm:mb-4">
          You can ask me anything about recipes, dietary needs, or ingredients. For example:<br/>
          • A quick salmon dinner under 500 calories<br/>
          • A kid-friendly lunchbox without nuts<br/>
          • A warm vegetarian soup for rainy days
        </p>
        
        {/* Quick Prompt Buttons */}
        <div className="mb-3 sm:mb-4">
          <p className="text-sm text-gray-600 mb-2">Quick suggestions:</p>
          <div className="flex flex-wrap gap-2">
            {quickPrompts.map((quickPrompt) => (
              <button
                key={quickPrompt}
                onClick={() => setPrompt(quickPrompt)}
                className="px-3 py-2 text-xs bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-colors touch-manipulation whitespace-nowrap flex-shrink-0"
              >
                {quickPrompt}
              </button>
            ))}
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="mb-4 sm:mb-6">
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask me anything! Try: 'I want Japanese food' or 'Show me anti-inflammatory recipes'"
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-sm sm:text-base touch-manipulation"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isLoading || !prompt.trim()}
                className="flex-1 sm:flex-none px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 touch-manipulation text-sm sm:text-base"
              >
                {isLoading ? (
                  <Loader className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                <span>{isLoading ? 'Thinking...' : 'Ask'}</span>
              </button>
              
              <button
                type="button"
                onClick={handleInspireMe}
                disabled={isInspiring}
                className="px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2 touch-manipulation text-sm sm:text-base flex-shrink-0"
              >
                {isInspiring ? (
                  <Loader className="h-4 w-4 animate-spin" />
                ) : (
                  <Lightbulb className="h-4 w-4" />
                )}
                <span className="hidden sm:inline">{isInspiring ? 'Inspiring...' : 'Inspire Me'}</span>
                <span className="sm:hidden">✨</span>
              </button>
            </div>
          </div>
        </form>

        {/* AI Response */}
        {aiResponse && (
          <div className="mb-4 sm:mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start gap-2">
              <Sparkles className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <p className="text-green-800 text-sm leading-relaxed">{aiResponse}</p>
            </div>
          </div>
        )}

        {/* AI Recommendations Results */}
        {recommendations.length > 0 && (
          <div>
            <h3 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base md:text-lg">
              {aiResponse ? 'Here are your recipes:' : 'AI Recommendations'}
            </h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 sm:gap-4">
              {recommendations.map((recipe) => (
                <div
                  key={recipe.id}
                  onClick={() => onRecommendationClick(recipe)}
                  className="bg-gray-50 rounded-lg p-3 cursor-pointer hover:shadow-md transition-shadow border border-gray-100 touch-manipulation w-full"
                >
                  <img
                    src={recipe.image}
                    alt={recipe.name}
                    className="w-full h-24 object-cover rounded-lg mb-2"
                  />
                  <h4 className="font-semibold text-gray-900 mb-1 text-sm line-clamp-2 min-w-0">{recipe.name}</h4>
                  <p className="text-sm text-gray-600 mb-2">{recipe.cuisine}</p>
                  <div className="flex flex-wrap gap-1 min-w-0">
                    {recipe.healthGoals.slice(0, 1).map((goal) => (
                      <span
                        key={goal}
                        className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full whitespace-nowrap flex-shrink-0"
                      >
                        {goal}
                      </span>
                    ))}
                    {recipe.healthGoals.length > 1 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full whitespace-nowrap">
                        +{recipe.healthGoals.length - 1}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};