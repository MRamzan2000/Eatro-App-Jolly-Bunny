import { Recipe } from '../types/Recipe';

// Google Apps Script URL for fetching recipe data
const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbypHKtYPiWJnjJiLDME_G3JslZA_LXTGVLI4sXZrE6ULWMMFLPkOv3n2SvaIf3NW43w/exec';

// Parse ingredients and steps from newline-separated strings
const parseMultilineText = (text: string): string[] => {
  if (!text) return [];
  return text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
};

// Parse numbered steps from text like "1. Step one. 2. Step two. 3. Step three."
const parseNumberedSteps = (text: string): string[] => {
  if (!text) return [];
  
  // Split by pattern "number + period" but keep the content
  const steps = text.split(/(?=\d+\.\s)/).filter(step => step.trim().length > 0);
  
  return steps.map(step => {
    // Remove the leading number and period, then clean up
    return step.replace(/^\d+\.\s*/, '').replace(/\.\s*$/, '').trim();
  }).filter(step => step.length > 0);
};

// Parse comma-separated values
const parseCommaSeparated = (text: string): string[] => {
  if (!text) return [];
  return text.split(/[,;]/).map(item => item.trim()).filter(item => item.length > 0);
};

// Map JSON object to Recipe object
const mapJsonToRecipe = (jsonRecipe: any, index: number): Recipe => {
  const name = jsonRecipe.Name || '';
  const cuisine = jsonRecipe.Cuisine || '';
  const mealTypes = jsonRecipe['Meal Type'] || '';
  const healthGoals = jsonRecipe['Health Goals'] || '';
  const imageUrl = jsonRecipe.Image || '';
  const notes = jsonRecipe.Notes || '';
  const ingredients = jsonRecipe.Ingredients || '';
  const steps = jsonRecipe.Steps || '';
  const calories = parseFloat(jsonRecipe.Calories) || 0;
  const protein = parseFloat(jsonRecipe.Protein) || 0;
  const fat = parseFloat(jsonRecipe.Fat) || 0;
  const carbs = parseFloat(jsonRecipe.Carbs) || 0;
  
  const recipe: Recipe = {
    id: (index + 1).toString(),
    name: name.trim(),
    cuisine: cuisine.trim(),
    mealType: parseCommaSeparated(mealTypes),
    healthGoals: parseCommaSeparated(healthGoals),
    imageUrl: imageUrl.trim() || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800',
    image: imageUrl.trim() || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: notes.trim(),
    instructions: steps.replace(/\n/g, ' ').trim(),
    ingredients: parseMultilineText(ingredients),
    steps: parseNumberedSteps(steps),
    notes: notes.trim(),
    calories: calories,
    protein: protein,
    fat: fat,
    carbs: carbs,
    nutrition: {
      calories: calories,
      protein: protein,
      fat: fat,
      carbs: carbs
    }
  };

  return recipe;
};

// Fetch recipes from Google Apps Script
export const fetchRecipesFromGoogleAppsScript = async (): Promise<Recipe[]> => {
  try {
    console.log('Fetching recipes from Google Apps Script...');
    const response = await fetch(GOOGLE_APPS_SCRIPT_URL);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!Array.isArray(data) || data.length === 0) {
      console.warn('No data found in Google Apps Script response. Using sample recipes.');
      return getSampleRecipes();
    }
    
    // Map each JSON object to a Recipe object
    const recipes = data.map((jsonRecipe, index) => mapJsonToRecipe(jsonRecipe, index));
    
    console.log(`Successfully loaded ${recipes.length} recipes from Google Apps Script`);
    return recipes;
    
  } catch (error) {
    console.error('Error fetching recipes from Google Apps Script:', error);
    console.log('Falling back to sample recipes');
    return getSampleRecipes();
  }
};

// Enhanced sample recipes with all required fields for Eatro
const getSampleRecipes = (): Recipe[] => {
  return [
    {
      id: '1',
      name: 'Lemon Tofu Bowl',
      cuisine: 'Vegan',
      mealType: ['Lunch'],
      healthGoals: ['Weight Control', 'Low Carb', 'High Protein'],
      imageUrl: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800',
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Crispy tofu with lemon sauce and fresh vegetables. Perfect plant-based protein meal.',
      instructions: 'Press tofu to remove excess water, then cube into bite-sized pieces. Heat olive oil in a large pan over medium-high heat. Add tofu cubes and cook until golden brown on all sides, about 8 minutes. Add garlic and ginger, cook for 1 minute until fragrant. Steam broccoli until tender-crisp, about 4 minutes. In a small bowl, whisk together lemon juice, zest, soy sauce, and sesame oil. Toss tofu and broccoli with the lemon sauce. Season with salt and pepper, serve immediately.',
      ingredients: [
        '200g firm tofu, cubed',
        '1 lemon, juiced and zested',
        '2 cups broccoli florets',
        '1 tbsp olive oil',
        '2 cloves garlic, minced',
        '1 tsp ginger, grated',
        '2 tbsp soy sauce',
        '1 tbsp sesame oil',
        'Salt and pepper to taste'
      ],
      steps: [
        'Press tofu to remove excess water, then cube into bite-sized pieces',
        'Heat olive oil in a large pan over medium-high heat',
        'Add tofu cubes and cook until golden brown on all sides, about 8 minutes',
        'Add garlic and ginger, cook for 1 minute until fragrant',
        'Steam broccoli until tender-crisp, about 4 minutes',
        'In a small bowl, whisk together lemon juice, zest, soy sauce, and sesame oil',
        'Toss tofu and broccoli with the lemon sauce',
        'Season with salt and pepper, serve immediately'
      ],
      notes: 'Contains soy. Perfect for plant-based protein needs.',
      calories: 300,
      protein: 20,
      fat: 10,
      carbs: 15,
      nutrition: {
        calories: 300,
        protein: 20,
        fat: 10,
        carbs: 15
      }
    },
    {
      id: '2',
      name: 'Mediterranean Salmon',
      cuisine: 'Mediterranean',
      mealType: ['Dinner', 'Special Occasion'],
      healthGoals: ['Heart Health', 'Anti-Inflammatory', 'Brain Boost', 'High Protein'],
      imageUrl: 'https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg?auto=compress&cs=tinysrgb&w=800',
      image: 'https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Baked salmon with olives, tomatoes, and herbs. Rich in omega-3 fatty acids.',
      instructions: 'Preheat oven to 400°F (200°C). Place salmon fillets in a baking dish. Drizzle with olive oil and season with salt and pepper. Arrange lemon slices, tomatoes, olives, and onion around salmon. Sprinkle with garlic and oregano. Bake for 15-18 minutes until salmon flakes easily. Let rest for 5 minutes before serving. Garnish with fresh herbs and serve with vegetables.',
      ingredients: [
        '4 salmon fillets (6oz each)',
        '1/4 cup olive oil',
        '2 lemons, sliced',
        '1 cup cherry tomatoes',
        '1/2 cup kalamata olives',
        '1 red onion, sliced',
        '2 tbsp fresh oregano',
        '3 cloves garlic, minced',
        'Salt and black pepper'
      ],
      steps: [
        'Preheat oven to 400°F (200°C)',
        'Place salmon fillets in a baking dish',
        'Drizzle with olive oil and season with salt and pepper',
        'Arrange lemon slices, tomatoes, olives, and onion around salmon',
        'Sprinkle with garlic and oregano',
        'Bake for 15-18 minutes until salmon flakes easily',
        'Let rest for 5 minutes before serving',
        'Garnish with fresh herbs and serve with vegetables'
      ],
      notes: 'Rich in omega-3 fatty acids. Contains fish.',
      calories: 420,
      protein: 35,
      fat: 22,
      carbs: 12,
      nutrition: {
        calories: 420,
        protein: 35,
        fat: 22,
        carbs: 12
      }
    },
    {
      id: '3',
      name: 'Italian Caprese Salad',
      cuisine: 'Italian',
      mealType: ['Lunch', 'Appetizer'],
      healthGoals: ['Heart Health', 'Mediterranean Diet', 'Low Carb'],
      imageUrl: 'https://images.pexels.com/photos/1116558/pexels-photo-1116558.jpeg?auto=compress&cs=tinysrgb&w=800',
      image: 'https://images.pexels.com/photos/1116558/pexels-photo-1116558.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Fresh mozzarella, tomatoes, and basil with balsamic glaze. A classic Italian appetizer.',
      instructions: 'Slice tomatoes and mozzarella into 1/4-inch thick rounds. Arrange alternating slices on a platter. Tuck fresh basil leaves between slices. Drizzle with extra virgin olive oil and balsamic glaze. Season with sea salt and freshly cracked black pepper. Let stand for 10 minutes before serving to allow flavors to meld.',
      ingredients: [
        '3 large ripe tomatoes',
        '8oz fresh mozzarella',
        '1/4 cup fresh basil leaves',
        '3 tbsp extra virgin olive oil',
        '2 tbsp balsamic glaze',
        'Sea salt to taste',
        'Freshly cracked black pepper'
      ],
      steps: [
        'Slice tomatoes and mozzarella into 1/4-inch thick rounds',
        'Arrange alternating slices on a platter',
        'Tuck fresh basil leaves between slices',
        'Drizzle with extra virgin olive oil and balsamic glaze',
        'Season with sea salt and freshly cracked black pepper',
        'Let stand for 10 minutes before serving to allow flavors to meld'
      ],
      notes: 'Use the ripest tomatoes and highest quality mozzarella for best results.',
      calories: 280,
      protein: 18,
      fat: 20,
      carbs: 8,
      nutrition: {
        calories: 280,
        protein: 18,
        fat: 20,
        carbs: 8
      }
    },
    {
      id: '4',
      name: 'Korean Bibimbap',
      cuisine: 'Korean',
      mealType: ['Dinner', 'Lunch'],
      healthGoals: ['Balanced Nutrition', 'High Fiber', 'Immune Support'],
      imageUrl: 'https://images.pexels.com/photos/4958792/pexels-photo-4958792.jpeg?auto=compress&cs=tinysrgb&w=800',
      image: 'https://images.pexels.com/photos/4958792/pexels-photo-4958792.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Mixed rice bowl with vegetables, meat, and gochujang sauce. A nutritious Korean comfort food.',
      instructions: 'Cook rice according to package directions. Prepare vegetables by blanching spinach, julienning carrots, and sautéing mushrooms separately. Cook beef with soy sauce and garlic. Fry eggs sunny-side up. Arrange rice in bowls, top with vegetables and beef in sections. Place fried egg on top. Serve with gochujang sauce on the side.',
      ingredients: [
        '2 cups cooked white rice',
        '200g beef bulgogi',
        '1 cup spinach, blanched',
        '1 carrot, julienned',
        '1 cup shiitake mushrooms',
        '2 eggs',
        '2 tbsp gochujang',
        '1 tbsp sesame oil',
        '2 cloves garlic, minced',
        'Soy sauce to taste'
      ],
      steps: [
        'Cook rice according to package directions',
        'Prepare vegetables by blanching spinach, julienning carrots, and sautéing mushrooms separately',
        'Cook beef with soy sauce and garlic',
        'Fry eggs sunny-side up',
        'Arrange rice in bowls, top with vegetables and beef in sections',
        'Place fried egg on top',
        'Serve with gochujang sauce on the side'
      ],
      notes: 'Mix everything together before eating. Adjust gochujang to taste.',
      calories: 520,
      protein: 28,
      fat: 15,
      carbs: 65,
      nutrition: {
        calories: 520,
        protein: 28,
        fat: 15,
        carbs: 65
      }
    },
    {
      id: '5',
      name: 'Quinoa Power Bowl',
      cuisine: 'Healthy',
      mealType: ['Breakfast', 'Lunch'],
      healthGoals: ['High Protein', 'High Fiber', 'Superfood', 'Weight Control'],
      imageUrl: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=800',
      image: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Nutritious quinoa bowl with avocado, seeds, and fresh greens. Packed with superfoods.',
      instructions: 'Cook quinoa according to package directions and let cool. Massage kale with lemon juice and olive oil. Arrange quinoa in bowls, top with massaged kale, sliced avocado, and cherry tomatoes. Sprinkle with pumpkin seeds, hemp hearts, and feta cheese. Drizzle with lemon vinaigrette.',
      ingredients: [
        '1 cup cooked quinoa',
        '2 cups baby kale',
        '1 avocado, sliced',
        '1 cup cherry tomatoes, halved',
        '2 tbsp pumpkin seeds',
        '1 tbsp hemp hearts',
        '1/4 cup feta cheese',
        '2 tbsp lemon juice',
        '3 tbsp olive oil',
        'Salt and pepper to taste'
      ],
      steps: [
        'Cook quinoa according to package directions and let cool',
        'Massage kale with lemon juice and olive oil',
        'Arrange quinoa in bowls, top with massaged kale',
        'Add sliced avocado and cherry tomatoes',
        'Sprinkle with pumpkin seeds, hemp hearts, and feta cheese',
        'Drizzle with lemon vinaigrette'
      ],
      notes: 'Great source of complete protein and healthy fats.',
      calories: 380,
      protein: 15,
      fat: 22,
      carbs: 35,
      nutrition: {
        calories: 380,
        protein: 15,
        fat: 22,
        carbs: 35
      }
    },
    {
      id: '6',
      name: 'Thai Green Curry',
      cuisine: 'Thai',
      mealType: ['Dinner'],
      healthGoals: ['Anti-Inflammatory', 'Immune Support', 'Digestive Health'],
      imageUrl: 'https://images.pexels.com/photos/2474658/pexels-photo-2474658.jpeg?auto=compress&cs=tinysrgb&w=800',
      image: 'https://images.pexels.com/photos/2474658/pexels-photo-2474658.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Spicy coconut curry with vegetables and herbs. Aromatic and flavorful Thai classic.',
      instructions: 'Heat oil in a large pan and sauté green curry paste for 1 minute. Add thick coconut milk and simmer until oil separates. Add chicken and cook until done. Add remaining coconut milk, vegetables, and seasonings. Simmer until vegetables are tender. Garnish with Thai basil and serve with jasmine rice.',
      ingredients: [
        '2 tbsp green curry paste',
        '400ml coconut milk',
        '300g chicken breast, sliced',
        '1 eggplant, cubed',
        '1 bell pepper, sliced',
        '100g green beans',
        '2 tbsp fish sauce',
        '1 tbsp palm sugar',
        'Thai basil leaves',
        '2 tbsp vegetable oil'
      ],
      steps: [
        'Heat oil in a large pan and sauté green curry paste for 1 minute',
        'Add thick coconut milk and simmer until oil separates',
        'Add chicken and cook until done',
        'Add remaining coconut milk, vegetables, and seasonings',
        'Simmer until vegetables are tender',
        'Garnish with Thai basil and serve with jasmine rice'
      ],
      notes: 'Adjust curry paste amount for desired spice level.',
      calories: 450,
      protein: 25,
      fat: 28,
      carbs: 20,
      nutrition: {
        calories: 450,
        protein: 25,
        fat: 28,
        carbs: 20
      }
    }
  ];
};

// Cache management
let recipesCache: Recipe[] | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 2 * 60 * 1000; // 2 minutes for better data freshness

export const getRecipes = async (forceRefresh = false): Promise<Recipe[]> => {
  const now = Date.now();
  
  // Return cached data if it's still fresh and not forcing refresh
  if (!forceRefresh && recipesCache && (now - lastFetchTime) < CACHE_DURATION) {
    return recipesCache;
  }
  
  // Fetch fresh data
  console.log('Fetching fresh recipe data from Google Apps Script...');
  const recipes = await fetchRecipesFromGoogleAppsScript();
  
  // Update cache
  recipesCache = recipes;
  lastFetchTime = now;
  
  console.log(`Successfully cached ${recipes.length} recipes`);
  return recipes;
};

// Clear cache (useful for manual refresh)
export const clearRecipesCache = () => {
  recipesCache = null;
  lastFetchTime = 0;
};