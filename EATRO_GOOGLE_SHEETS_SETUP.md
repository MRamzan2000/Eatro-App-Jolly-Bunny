# Eatro Google Apps Script Integration Setup Guide

## Overview
Your Eatro app now dynamically loads recipes from Google Apps Script! This allows you to add hundreds of recipes without redeploying the app while keeping all existing features like AI Recommendations, Favorites, and Preferences.

## Current Setup
Your app is now configured to fetch recipe data from:
```
https://script.google.com/macros/s/AKfycbypHKtYPiWJnjJiLDME_G3JslZA_LXTGVLI4sXZrE6ULWMMFLPkOv3n2SvaIf3NW43w/exec
```

## Expected JSON Data Format
The Google Apps Script should return a JSON array of recipe objects with these fields:

```json
[
  {
    "Name": "Recipe Name",
    "Cuisine": "Italian",
    "Meal Type": "Lunch, Dinner",
    "Health Goals": "Heart Health, Low Carb",
    "Image": "https://example.com/image.jpg",
    "Notes": "Contains dairy. Great for beginners.",
    "Ingredients": "2 cups flour\n1 cup milk\n3 eggs",
    "Steps": "Mix ingredients\nBake for 30 minutes\nServe hot",
    "Nutrition": "300 Cal, 20g Protein, 10g Fat, 15g Carbs"
  }
]
```

## Field Descriptions

- **Name**: Recipe title
- **Cuisine**: One of the supported cuisines (Chinese, Japanese, Korean, Vietnamese, Thai, Italian, French, Mexican, American, Mediterranean, Global Fusion, Vegetarian, Vegan, Gluten-Free)
- **Meal Type**: Comma-separated values (Breakfast, Lunch, Dinner, Romantic, Birthday, Party, Special Occasion, Dessert, Staple Food)
- **Health Goals**: Comma-separated health goals
- **Image**: URL to recipe image
- **Notes**: Special notes, allergy warnings, or cooking tips
- **Ingredients**: Newline-separated ingredient list
- **Steps**: Newline-separated cooking steps
- **Nutrition**: Format: "XXX Cal, XXg Protein, XXg Fat, XXg Carbs"

## How It Works

1. **App starts** with sample recipes as fallback
2. **Fetches data** from your Google Apps Script URL
3. **Parses JSON** and maps to internal recipe format
4. **Updates UI** with fresh recipe data
5. **Caches data** for 5 minutes to improve performance
6. **Falls back** to sample recipes if fetch fails

## Features That Work

All existing Eatro features work seamlessly with the new data source:

- **AI Recommendations**: Works with Google Apps Script recipes
- **Favorites System**: Save and manage favorite recipes
- **User Preferences**: Customize your experience
- **Search & Filter**: Find recipes by name, cuisine, meal type, health goals
- **Responsive Design**: Perfect mobile experience
- **Recipe Details**: Full ingredient lists and instructions

## Troubleshooting

### Common Issues:

1. **"Unable to Load Recipes"**: Check that your Google Apps Script is deployed and accessible
2. **"No data found"**: Ensure your script returns a valid JSON array
3. **Missing recipe data**: Check that all required fields are present in the JSON
4. **CORS errors**: Ensure your Google Apps Script allows cross-origin requests

### Tips:

- **Use the "Refresh" button** to manually reload data from Google Apps Script
- **Check browser console** for detailed error messages
- **Test your Google Apps Script URL** directly in a browser to verify JSON output
- **Ensure proper JSON formatting** with all required fields

Your Eatro app now supports unlimited recipes managed entirely through Google Apps Script while maintaining all your favorite features! 🎉

## Data Flow

1. **Google Apps Script** → Returns JSON array of recipes
2. **Eatro App** → Fetches and parses JSON data
3. **Recipe Components** → Display data in existing layout
4. **User Interactions** → All existing features work with new data
5. **Local Storage** → Saves favorites and preferences
6. **AI Recommendations** → Uses fetched recipes for suggestions

The integration is seamless - all existing pages, components, and functionality remain exactly the same, just now powered by your Google Apps Script data source!

## Step 4: Get Google Sheets API Key

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

## Step 5: Update Your App Configuration

1. **Open** `src/services/googleSheetsService.ts`

2. **Replace the placeholder values** with your actual credentials:
   ```typescript
   const SHEET_ID = 'YOUR_GOOGLE_SHEET_ID_HERE'; // Replace with your actual Sheet ID
   const API_KEY = 'YOUR_GOOGLE_API_KEY_HERE'; // Replace with your actual API key
   ```

   **Example:**
   ```typescript
   const SHEET_ID = '1BvDYd8C7XwA8B9C0D1E2F3G4H5I6J7K8L9M0N1O2P3Q4R5S6T7U8V9W0X1Y2Z3';
   const API_KEY = 'AIzaSyBcDeFgHiJkLmNoPqRsTuVwXyZ1234567890';
   ```

3. **Save the file** and restart your development server

## Step 6: Test Your Integration

1. **Restart your development server** (`npm run dev`)
2. **Check the browser console** for any error messages
3. **Use the "Refresh" button** in the app to manually reload recipes from Google Sheets
4. **Test all existing features**:
   - AI Recommendations should work with new recipes
   - Favorites functionality remains intact
   - User preferences continue to work
   - Search and filtering work with Google Sheets data

## Adding New Recipes

Once set up, you can easily add new recipes:

1. **Add a new row** to your Google Sheet with recipe data
2. **Fill in all columns** following the format above
3. **Click the "Refresh" button** in your app (or wait 5 minutes for automatic refresh)
4. **See new recipes appear** immediately without redeploying

## Features That Continue to Work

All existing Eatro features are preserved:

- **AI Recommendations**: Works with Google Sheets recipes
- **Favorites**: Save and manage favorite recipes
- **User Preferences**: Customize your experience
- **Search & Filter**: Find recipes by name, cuisine, meal type
- **Responsive Design**: Perfect mobile experience
- **Recipe Details**: Full ingredient lists and instructions

## Troubleshooting

### Common Issues:

1. **"Unable to Load Recipes"**: Check that your Sheet ID and API Key are correct
2. **"No data found"**: Ensure your sheet is public and has data starting from row 2
3. **Missing recipe data**: Check that all columns are filled correctly
4. **AI Recommendations not working**: Ensure health goals and meal types are properly formatted

### Tips:

- **Keep your API key secure** - don't share it publicly
- **Use the sample recipes** as a template for formatting
- **Test with a few recipes first** before adding hundreds
- **Use consistent image URLs** from reliable sources like Pexels
- **Format ingredients and steps** with line breaks for better display

## Scaling to Hundreds of Recipes

For large recipe collections:

1. **Organize by categories** using multiple sheets within the same document
2. **Use consistent formatting** for all entries
3. **Consider using a CDN** for images if you have many recipes
4. **Monitor API usage** in Google Cloud Console

Your Eatro app now supports unlimited recipes managed entirely through Google Sheets while maintaining all your favorite features! 🎉