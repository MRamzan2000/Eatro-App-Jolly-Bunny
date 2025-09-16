# Google Sheets Integration Setup Guide

## Overview
Your Eatro app now dynamically loads recipes from Google Sheets! This allows you to add hundreds of recipes without redeploying the app.

## Step 1: Create Your Google Sheet

1. **Create a new Google Sheet** at [sheets.google.com](https://sheets.google.com)

2. **Set up the column headers** in row 1:
   ```
   A1: Name
   B1: Cuisine  
   C1: Meal Types
   D1: Health Goals
   E1: Image URL
   F1: Notes
   G1: Ingredients
   H1: Steps
   I1: Calories
   J1: Protein
   K1: Fat
   L1: Carbs
   ```

3. **Add your sample recipes** starting from row 2. Here's the format for each column:

   **Column C (Meal Types)**: Separate multiple values with commas
   ```
   Lunch, Dinner
   ```

   **Column D (Health Goals)**: Separate multiple values with commas
   ```
   Heart Health, Anti-Inflammatory, High Protein
   ```

   **Column G (Ingredients)**: Separate each ingredient with a new line
   ```
   200g firm tofu, cubed
   1 lemon, juiced and zested
   2 cups broccoli florets
   ```

   **Column H (Steps)**: Separate each step with a new line
   ```
   Press tofu to remove excess water
   Heat olive oil in a large pan
   Add tofu cubes and cook until golden
   ```

## Step 2: Make Your Sheet Public

1. **Click "Share"** in the top-right corner of your Google Sheet
2. **Click "Change to anyone with the link"**
3. **Set permission to "Viewer"**
4. **Copy the share link** - it will look like:
   ```
   https://docs.google.com/spreadsheets/d/1BvDYd8C7XwA8B9C0D1E2F3G4H5I6J7K8L9M0N1O2P3Q4R5S6T7U8V9W0X1Y2Z3/edit?usp=sharing
   ```

5. **Extract the Sheet ID** from the URL (the long string between `/d/` and `/edit`):
   ```
   1BvDYd8C7XwA8B9C0D1E2F3G4H5I6J7K8L9M0N1O2P3Q4R5S6T7U8V9W0X1Y2Z3
   ```

## Step 3: Get Google Sheets API Key

1. **Go to** [Google Cloud Console](https://console.cloud.google.com/)
2. **Create a new project** or select an existing one
3. **Enable the Google Sheets API**:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Sheets API"
   - Click "Enable"
4. **Create an API Key**:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy your API key (it will look like: `AIzaSyBcDeFgHiJkLmNoPqRsTuVwXyZ1234567890`)

## Step 4: Update Your App Configuration

1. **Open** `src/services/googleSheetsService.ts`

2. **Replace the placeholder values**:
   ```typescript
   const SHEET_ID = 'YOUR_ACTUAL_SHEET_ID_HERE';
   const API_KEY = 'YOUR_ACTUAL_API_KEY_HERE';
   ```

3. **Update the range** if needed (default is `Sheet1!A2:P` which reads from row 2 to include all your data)

## Step 5: Sample Data Format

Here are your 6 current recipes formatted for the Google Sheet:

### Row 2: Lemon Tofu Bowl
```
A2: Lemon Tofu Bowl
B2: Vegan
C2: Lunch
D2: Weight Control, Low Carb, High Protein
E2: https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800
F2: Contains soy. Perfect for plant-based protein needs.
G2: 200g firm tofu, cubed
1 lemon, juiced and zested
2 cups broccoli florets
1 tbsp olive oil
2 cloves garlic, minced
1 tsp ginger, grated
2 tbsp soy sauce
1 tbsp sesame oil
Salt and pepper to taste
H2: Press tofu to remove excess water, then cube into bite-sized pieces
Heat olive oil in a large pan over medium-high heat
Add tofu cubes and cook until golden brown on all sides, about 8 minutes
Add garlic and ginger, cook for 1 minute until fragrant
Steam broccoli until tender-crisp, about 4 minutes
In a small bowl, whisk together lemon juice, zest, soy sauce, and sesame oil
Toss tofu and broccoli with the lemon sauce
Season with salt and pepper, serve immediately
I2: 300
J2: 20
K2: 10
L2: 15
```

### Row 3: Mediterranean Salmon
```
A3: Mediterranean Salmon
B3: Mediterranean
C3: Dinner, Special Occasion
D3: Heart Health, Anti-Inflammatory, Brain Boost, High Protein
E3: https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg?auto=compress&cs=tinysrgb&w=800
F3: Rich in omega-3 fatty acids. Contains fish.
G3: 4 salmon fillets (6oz each)
1/4 cup olive oil
2 lemons, sliced
1 cup cherry tomatoes
1/2 cup kalamata olives
1 red onion, sliced
2 tbsp fresh oregano
3 cloves garlic, minced
Salt and black pepper
H3: Preheat oven to 400°F (200°C)
Place salmon fillets in a baking dish
Drizzle with olive oil and season with salt and pepper
Arrange lemon slices, tomatoes, olives, and onion around salmon
Sprinkle with garlic and oregano
Bake for 15-18 minutes until salmon flakes easily
Let rest for 5 minutes before serving
Garnish with fresh herbs and serve with vegetables
I3: 420
J3: 35
K3: 22
L3: 12
```

Continue this pattern for the remaining 4 recipes...

## Step 6: Test Your Integration

1. **Save your changes** to the Google Sheets service file
2. **Restart your development server**
3. **Check the browser console** for any error messages
4. **Use the "Refresh" button** in the app to manually reload recipes from Google Sheets

## Adding New Recipes

Once set up, you can:

1. **Add new rows** to your Google Sheet with recipe data
2. **Click the "Refresh" button** in your app (or wait 5 minutes for automatic refresh)
3. **See new recipes appear** immediately without redeploying

## Troubleshooting

### Common Issues:

1. **"Failed to load recipes"**: Check that your Sheet ID and API Key are correct
2. **"No data found"**: Ensure your sheet is public and has data starting from row 2
3. **Missing recipe data**: Check that all columns are filled and formatted correctly
4. **API quota exceeded**: Google Sheets API has usage limits; consider caching for high-traffic apps

### Tips:

- **Keep your API key secure** - don't share it publicly
- **Use the fallback recipes** if Google Sheets is unavailable
- **Test with a few recipes first** before adding hundreds
- **Use consistent formatting** for ingredients and steps (newline-separated)

## Scaling to Hundreds of Recipes

For large recipe collections:

1. **Organize by categories** using multiple sheets within the same Google Sheets document
2. **Use consistent image URLs** from reliable sources like Pexels or your own CDN
3. **Consider pagination** if you have 500+ recipes
4. **Monitor API usage** and implement additional caching if needed

Your app now supports unlimited recipes managed entirely through Google Sheets! 🎉