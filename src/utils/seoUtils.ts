import { Recipe } from '../types/Recipe';

export const generateRecipeMetadata = (recipe: Recipe) => {
  const title = `${recipe.name} - Eatro Recipe`;
  
  const description = recipe.description || 
    `A ${recipe.cuisine} recipe from Eatro. 2–3 servings, nutrition per serving.`;
  
  const imageUrl = recipe.imageUrl || recipe.image || 
    'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800';
  
  const url = `${window.location.origin}/#recipe-${recipe.id}`;
  
  return {
    title,
    description,
    imageUrl,
    url,
    type: 'article',
    siteName: 'Eatro - Healthy Recipe App'
  };
};

export const updateMetaTags = (metadata: ReturnType<typeof generateRecipeMetadata>) => {
  // Update document title
  document.title = metadata.title;
  
  // Helper function to update or create meta tag
  const updateMetaTag = (property: string, content: string, isProperty = true) => {
    const attribute = isProperty ? 'property' : 'name';
    let meta = document.querySelector(`meta[${attribute}="${property}"]`) as HTMLMetaElement;
    
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute(attribute, property);
      document.head.appendChild(meta);
    }
    
    meta.content = content;
  };
  
  // Open Graph tags
  updateMetaTag('og:title', metadata.title);
  updateMetaTag('og:description', metadata.description);
  updateMetaTag('og:image', metadata.imageUrl);
  updateMetaTag('og:url', metadata.url);
  updateMetaTag('og:type', metadata.type);
  updateMetaTag('og:site_name', metadata.siteName);
  
  // Twitter Card tags
  updateMetaTag('twitter:card', 'summary_large_image', false);
  updateMetaTag('twitter:title', metadata.title, false);
  updateMetaTag('twitter:description', metadata.description, false);
  updateMetaTag('twitter:image', metadata.imageUrl, false);
  
  // Standard meta tags
  updateMetaTag('description', metadata.description, false);
};

export const resetMetaTags = () => {
  document.title = 'Eatro Recipe App - Complete Implementation';
  
  const defaultDescription = 'Discover healthy recipes with AI recommendations, favorites, and personalized preferences. Your complete recipe companion.';
  
  updateMetaTags({
    title: 'Eatro Recipe App - Complete Implementation',
    description: defaultDescription,
    imageUrl: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800',
    url: window.location.origin,
    type: 'website',
    siteName: 'Eatro - Healthy Recipe App'
  });
};