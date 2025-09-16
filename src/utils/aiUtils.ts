import { Recipe } from '../types/Recipe';

// Synonym mappings for natural language understanding
const CUISINE_SYNONYMS: Record<string, string[]> = {
  'italian': ['italian', 'italy', 'pasta', 'pizza'],
  'chinese': ['chinese', 'china', 'asian', 'stir fry', 'wok'],
  'japanese': ['japanese', 'japan', 'sushi', 'ramen', 'miso'],
  'korean': ['korean', 'korea', 'kimchi', 'bulgogi', 'bibimbap'],
  'thai': ['thai', 'thailand', 'curry', 'pad thai', 'coconut'],
  'mexican': ['mexican', 'mexico', 'taco', 'burrito', 'salsa', 'avocado'],
  'mediterranean': ['mediterranean', 'greek', 'olive', 'feta'],
  'french': ['french', 'france', 'baguette', 'croissant'],
  'american': ['american', 'usa', 'burger', 'bbq'],
  'vegetarian': ['vegetarian', 'veggie', 'plant based', 'no meat'],
  'vegan': ['vegan', 'plant based', 'no dairy', 'no animal'],
  'healthy': ['healthy', 'nutritious', 'wholesome', 'clean eating']
};

const MEAL_TYPE_SYNONYMS: Record<string, string[]> = {
  'breakfast': ['breakfast', 'morning', 'brunch'],
  'lunch': ['lunch', 'midday', 'lunchbox', 'noon'],
  'dinner': ['dinner', 'evening', 'supper', 'night'],
  'dessert': ['dessert', 'sweet', 'cake', 'cookie'],
  'appetizer': ['appetizer', 'starter', 'snack', 'finger food'],
  'party': ['party', 'celebration', 'gathering'],
  'romantic': ['romantic', 'date night', 'special'],
  'birthday': ['birthday', 'celebration']
};

const HEALTH_GOAL_SYNONYMS: Record<string, string[]> = {
  'heart health': ['heart', 'cardiovascular', 'heart healthy', 'heart disease'],
  'anti-inflammatory': ['anti-inflammatory', 'inflammation', 'inflammatory', 'reduce inflammation'],
  'high protein': ['protein', 'high protein', 'muscle', 'strength'],
  'low carb': ['low carb', 'keto', 'ketogenic', 'no carbs', 'low sugar'],
  'digestive health': ['digestive', 'digestion', 'gut health', 'stomach', 'bloating'],
  'weight control': ['weight loss', 'diet', 'slim', 'lose weight', 'healthy weight'],
  'immune support': ['immune', 'immunity', 'cold', 'flu', 'vitamin c'],
  'brain boost': ['brain', 'memory', 'focus', 'concentration', 'mental'],
  'bone health': ['bone', 'calcium', 'osteoporosis', 'strong bones'],
  'balanced nutrition': ['balanced', 'nutritious', 'healthy', 'wholesome']
};

const INGREDIENT_KEYWORDS = [
  'salmon', 'chicken', 'beef', 'tofu', 'eggs', 'cheese', 'avocado', 'spinach',
  'broccoli', 'tomato', 'garlic', 'onion', 'rice', 'quinoa', 'pasta', 'bread',
  'nuts', 'seeds', 'beans', 'lentils', 'mushrooms', 'peppers', 'carrots'
];

interface ParsedQuery {
  cuisines: string[];
  mealTypes: string[];
  healthGoals: string[];
  freeText: string[];
  maxCalories?: number;
  excludeIngredients: string[];
  includeIngredients: string[];
}

export const parseNaturalLanguageQuery = (query: string): ParsedQuery => {
  const lowerQuery = query.toLowerCase();
  const result: ParsedQuery = {
    cuisines: [],
    mealTypes: [],
    healthGoals: [],
    freeText: [],
    excludeIngredients: [],
    includeIngredients: []
  };

  // Extract calorie limits
  const calorieMatch = lowerQuery.match(/under (\d+) calories?|below (\d+) calories?|less than (\d+) calories?/);
  if (calorieMatch) {
    result.maxCalories = parseInt(calorieMatch[1] || calorieMatch[2] || calorieMatch[3]);
  }

  // Extract exclusions (without, no, avoid)
  const exclusionPatterns = [
    /without ([\w\s]+?)(?:\s|$|,|\.|!|\?)/g,
    /no ([\w\s]+?)(?:\s|$|,|\.|!|\?)/g,
    /avoid ([\w\s]+?)(?:\s|$|,|\.|!|\?)/g
  ];

  exclusionPatterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(lowerQuery)) !== null) {
      const excluded = match[1].trim();
      if (INGREDIENT_KEYWORDS.some(ing => excluded.includes(ing))) {
        result.excludeIngredients.push(excluded);
      }
    }
  });

  // Match cuisines
  Object.entries(CUISINE_SYNONYMS).forEach(([cuisine, synonyms]) => {
    if (synonyms.some(synonym => lowerQuery.includes(synonym))) {
      result.cuisines.push(cuisine);
    }
  });

  // Match meal types
  Object.entries(MEAL_TYPE_SYNONYMS).forEach(([mealType, synonyms]) => {
    if (synonyms.some(synonym => lowerQuery.includes(synonym))) {
      result.mealTypes.push(mealType);
    }
  });

  // Match health goals
  Object.entries(HEALTH_GOAL_SYNONYMS).forEach(([healthGoal, synonyms]) => {
    if (synonyms.some(synonym => lowerQuery.includes(synonym))) {
      result.healthGoals.push(healthGoal);
    }
  });

  // Extract ingredient inclusions
  INGREDIENT_KEYWORDS.forEach(ingredient => {
    if (lowerQuery.includes(ingredient) && !result.excludeIngredients.some(ex => ex.includes(ingredient))) {
      result.includeIngredients.push(ingredient);
    }
  });

  // Extract remaining free text (words not matched by categories)
  const words = query.split(/\s+/);
  const matchedWords = new Set([
    ...result.cuisines.flatMap(c => CUISINE_SYNONYMS[c]),
    ...result.mealTypes.flatMap(m => MEAL_TYPE_SYNONYMS[m]),
    ...result.healthGoals.flatMap(h => HEALTH_GOAL_SYNONYMS[h]),
    ...result.includeIngredients,
    ...result.excludeIngredients.flatMap(ex => ex.split(' ')),
    'under', 'calories', 'without', 'no', 'avoid', 'below', 'less', 'than'
  ]);

  result.freeText = words.filter(word => 
    word.length > 2 && 
    !matchedWords.has(word.toLowerCase()) &&
    !word.match(/^\d+$/)
  );

  return result;
};

export const generateFriendlyResponse = (
  query: string, 
  recipes: Recipe[], 
  parsedQuery: ParsedQuery
): string => {
  if (recipes.length === 0) {
    // Fallback suggestions when no exact matches
    const suggestions = [
      "I couldn't find exact matches, but let me suggest some popular healthy options!",
      "No perfect matches, but here are some nutritious recipes you might enjoy:",
      "I don't have exactly what you're looking for, but these healthy alternatives might work:",
      "Let me show you some similar healthy recipes that could be perfect for you!"
    ];
    return suggestions[Math.floor(Math.random() * suggestions.length)];
  }

  const count = recipes.length;
  const isPlural = count > 1;

  // Generate contextual responses based on parsed query
  if (parsedQuery.maxCalories) {
    return `Perfect! I found ${count} delicious recipe${isPlural ? 's' : ''} under ${parsedQuery.maxCalories} calories for you:`;
  }

  if (parsedQuery.excludeIngredients.length > 0) {
    const excluded = parsedQuery.excludeIngredients[0];
    return `Great news! Here ${isPlural ? 'are' : 'is'} ${count} tasty recipe${isPlural ? 's' : ''} without ${excluded}:`;
  }

  if (parsedQuery.cuisines.length > 0) {
    const cuisine = parsedQuery.cuisines[0];
    return `Wonderful choice! I found ${count} amazing ${cuisine} recipe${isPlural ? 's' : ''} for you:`;
  }

  if (parsedQuery.healthGoals.length > 0) {
    const goal = parsedQuery.healthGoals[0];
    return `Excellent! Here ${isPlural ? 'are' : 'is'} ${count} recipe${isPlural ? 's' : ''} perfect for ${goal}:`;
  }

  if (parsedQuery.mealTypes.length > 0) {
    const mealType = parsedQuery.mealTypes[0];
    return `Perfect timing! I have ${count} fantastic ${mealType} recipe${isPlural ? 's' : ''} for you:`;
  }

  if (parsedQuery.includeIngredients.length > 0) {
    const ingredient = parsedQuery.includeIngredients[0];
    return `Great choice! Here ${isPlural ? 'are' : 'is'} ${count} delicious recipe${isPlural ? 's' : ''} featuring ${ingredient}:`;
  }

  // Default friendly responses
  const defaultResponses = [
    `I found ${count} amazing recipe${isPlural ? 's' : ''} that should be perfect for you:`,
    `Here ${isPlural ? 'are' : 'is'} ${count} delicious recipe${isPlural ? 's' : ''} I think you'll love:`,
    `Perfect! I have ${count} wonderful recipe${isPlural ? 's' : ''} to recommend:`,
    `Great question! Here ${isPlural ? 'are' : 'is'} ${count} fantastic recipe${isPlural ? 's' : ''} for you:`
  ];

  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
};