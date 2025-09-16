# Google Sheets Recipe App Setup Guide

## Overview
Your recipe app now loads all recipe data dynamically from Google Sheets! This allows you to add, edit, and manage hundreds of recipes without redeploying the app.

## Step 1: Create Your Google Sheet

1. **Create a new Google Sheet** at [sheets.google.com](https://sheets.google.com)

2. **Set up the column headers** in row 1 exactly as shown:
   ```
   A1: Recipe Name
   B1: Cuisine
   C1: Meal Type
   D1: Image URL
   E1: Description
   F1: Instructions
   ```

3. **Add your sample recipes** starting from row 2. Here are your 6 current recipes formatted for the sheet:

### Sample Data for Your Google Sheet:

**Row 2: Italian Caprese Salad**
```
A2: Italian Caprese Salad
B2: Italian
C2: Lunch
D2: https://images.pexels.com/photos/1116558/pexels-photo-1116558.jpeg?auto=compress&cs=tinysrgb&w=400
E2: Fresh mozzarella, tomatoes, and basil with balsamic glaze. A classic Italian appetizer.
F2: Slice tomatoes and mozzarella. Arrange alternating with basil leaves. Drizzle with olive oil and balsamic glaze. Season with salt and pepper.
```

**Row 3: Korean Bibimbap**
```
A3: Korean Bibimbap
B3: Korean
C3: Dinner
D3: https://images.pexels.com/photos/4958792/pexels-photo-4958792.jpeg?auto=compress&cs=tinysrgb&w=400
E3: Mixed rice bowl with vegetables, meat, and gochujang sauce. A nutritious Korean comfort food.
F3: Prepare rice and vegetables separately. Arrange in bowl with protein. Top with fried egg and serve with gochujang sauce.
```

**Row 4: Lemon Tofu Bowl**
```
A4: Lemon Tofu Bowl
B4: Vegan
C4: Lunch
D4: https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400
E4: Crispy tofu with lemon sauce and fresh vegetables. Perfect plant-based protein meal.
F4: Press and cube tofu. Pan-fry until golden. Toss with lemon sauce and serve over vegetables and rice.
```

**Row 5: Mediterranean Salmon**
```
A5: Mediterranean Salmon
B5: Mediterranean
C5: Dinner
D5: https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg?auto=compress&cs=tinysrgb&w=400
E5: Baked salmon with olives, tomatoes, and herbs. Rich in omega-3 fatty acids.
F5: Season salmon and bake with vegetables, olives, and herbs. Drizzle with olive oil and lemon juice.
```

**Row 6: Quinoa Power Bowl**
```
A6: Quinoa Power Bowl
B6: Healthy
C6: Breakfast
D6: https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=400
E6: Nutritious quinoa bowl with avocado, seeds, and fresh greens. Packed with superfoods.
F6: Cook quinoa and arrange with fresh vegetables, avocado, and seeds. Dress with lemon vinaigrette.
```

**Row 7: Thai Green Curry**
```
A7: Thai Green Curry
B7: Thai
C7: Dinner
D7: https://images.pexels.com/photos/2474658/pexels-photo-2474658.jpeg?auto=compress&cs=tinysrgb&w=400
E7: Spicy coconut curry with vegetables and herbs. Aromatic and flavorful Thai classic.
F7: Sauté curry paste, add coconut milk and vegetables. Simmer until tender and serve with rice.
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

## Step 5: Test Your Integration

1. **Restart your development server** (`npm run dev`)
2. **Check the browser console** for any error messages
3. **Use the "Refresh" button** in the app to manually reload recipes from Google Sheets
4. **Add a new recipe** to your Google Sheet and refresh to see it appear

## Adding New Recipes

Once set up, you can easily add new recipes:

1. **Add a new row** to your Google Sheet with recipe data
2. **Fill in all columns**: Recipe Name, Cuisine, Meal Type, Image URL, Description, Instructions
3. **Click the "Refresh" button** in your app (or wait 5 minutes for automatic refresh)
4. **See new recipes appear** immediately without redeploying

## Image URLs

For the Image URL column, you can use:
- **Pexels**: Free stock photos (e.g., `https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400`)
- **Unsplash**: Free stock photos
- **Your own images**: Upload to Google Drive, Dropbox, or any image hosting service
- **Recipe websites**: Direct links to recipe images (ensure they allow hotlinking)

## Troubleshooting

### Common Issues:

1. **"Unable to Load Recipes"**: Check that your Sheet ID and API Key are correct
2. **"No data found"**: Ensure your sheet is public and has data starting from row 2
3. **Missing recipe data**: Check that all columns are filled correctly
4. **API quota exceeded**: Google Sheets API has usage limits; the app caches data for 5 minutes to reduce calls

### Tips:

- **Keep your API key secure** - don't share it publicly
- **Use the sample recipes** as a template for formatting
- **Test with a few recipes first** before adding hundreds
- **Use consistent image sizes** for better visual appearance
- **Keep descriptions concise** but informative

## Scaling to Hundreds of Recipes

For large recipe collections:

1. **Organize by categories** using multiple sheets within the same Google Sheets document
2. **Use consistent formatting** for all entries
3. **Consider using a CDN** for images if you have many recipes
4. **Monitor API usage** in Google Cloud Console

## Security Notes

- **API Key**: Keep your API key private and don't commit it to public repositories
- **Sheet Access**: Only make your sheet public if you're comfortable with the data being visible
- **Rate Limits**: Google Sheets API has quotas; the app includes caching to minimize requests

Your recipe app now supports unlimited recipes managed entirely through Google Sheets! 🎉

## Need Help?

If you encounter any issues:
1. Check the browser console for error messages
2. Verify your Google Sheet is public and properly formatted
3. Ensure your API key has the Google Sheets API enabled
4. Try the "Refresh" button to reload data manually