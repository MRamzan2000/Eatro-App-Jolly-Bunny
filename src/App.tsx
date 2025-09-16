import React, { useState, useMemo } from 'react';
import { ChefHat, Loader, Sparkles, Heart, Settings, User, LogOut } from 'lucide-react';
import { Recipe, FilterState } from './types/Recipe';
import { UserPreferences } from './types/Recipe';
import { useRecipes } from './hooks/useRecipes';
import { useFavorites } from './hooks/useFavorites';
import { useAuth } from './hooks/useAuth';
import { usePagination } from './hooks/usePagination';
import { useOfflineCache } from './hooks/useOfflineCache';
import { sortRecipes, filterRecipes } from './utils/recipeUtils';
import { SmartSearchBar } from './components/SmartSearchBar';
import { SearchAndFilter } from './components/SearchAndFilter';
import { FilterBar } from './components/FilterBar';
import { RecipeCard } from './components/RecipeCard';
import { RecipeList } from './components/RecipeList';
import { RecipeDetail } from './components/RecipeDetail';
import { RecipeModal } from './components/RecipeModal';
import { AIRecommendations } from './components/AIRecommendations';
import { UserPreferencesModal } from './components/UserPreferences';
import { FavoritesView } from './components/FavoritesView';
import { SignInModal } from './components/SignInModal';
import { AccountSettingsModal } from './components/AccountSettingsModal';
import { DisclaimerModal } from './components/DisclaimerModal';
import { PrivacyModal } from './components/PrivacyModal';
import { TermsModal } from './components/TermsModal';
import { Toast } from './components/Toast';
import { BottomNavigation } from './components/BottomNavigation';
import { useShare } from './hooks/useShare';
import { generateRecipeMetadata, updateMetaTags, resetMetaTags } from './utils/seoUtils';

function App() {
  const { recipes, loading, error, refreshRecipes } = useRecipes();
  const { user, isAuthenticated, hasChosenIdentity, signInWithGoogle, signInWithEmail, signUpWithEmail, forgotPassword, continueAsGuest, signOut, deleteAccount } = useAuth();
  const { favorites, toggleFavorite, isFavorite } = useFavorites(user, recipes);
  const { getCachedRecipe, isOnline } = useOfflineCache();
  const { showToast, toastMessage } = useShare();
  
  // App state
  const [currentView, setCurrentView] = useState<'recipes' | 'ai' | 'favorites' | 'detail'>('recipes');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [showPreferences, setShowPreferences] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [showAccountSettings, setShowAccountSettings] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [smartFilteredRecipes, setSmartFilteredRecipes] = useState<Recipe[]>([]);
  const [pendingAction, setPendingAction] = useState<'favorites' | 'toggle-favorite' | null>(null);
  const [pendingRecipeId, setPendingRecipeId] = useState<string | null>(null);
  
  // Ad banner state
  const [showAdBanner, setShowAdBanner] = useState(true);
  
  // Handle URL routing for shared recipe links
  React.useEffect(() => {
    const handleRouting = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#recipe-') && recipes.length > 0) {
        const recipeId = hash.replace('#recipe-', '');
        const recipe = recipes.find(r => r.id === recipeId);
        if (recipe) {
          const metadata = generateRecipeMetadata(recipe);
          updateMetaTags(metadata);
          setSelectedRecipe(recipe);
          setCurrentView('detail');
        }
      }
    };

    // Handle initial load and hash changes
    handleRouting();
    window.addEventListener('hashchange', handleRouting);
    
    return () => {
      window.removeEventListener('hashchange', handleRouting);
    };
  }, [recipes]);
  
  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    cuisines: [],
    mealTypes: [],
    healthGoals: [],
    sortBy: 'name'
  });
  
  // Legacy filter state for SearchAndFilter component
  const [legacyFilters, setLegacyFilters] = useState({
    searchTerm: '',
    cuisine: '',
    mealType: ''
  });
  
  // User preferences
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    const saved = localStorage.getItem('eatro-preferences');
    return saved ? JSON.parse(saved) : {
      healthGoals: [],
      dietaryRestrictions: [],
      favoritesCuisines: [],
      mealPreferences: []
    };
  });

  // Save preferences to localStorage
  const handleSavePreferences = (newPreferences: UserPreferences) => {
    setPreferences(newPreferences);
    localStorage.setItem('eatro-preferences', JSON.stringify(newPreferences));
  };

  // Filter and sort recipes
  const filteredRecipes = useMemo(() => {
    // Use smart search results if search term exists, otherwise use regular filtering
    const baseRecipes = searchTerm ? smartFilteredRecipes : recipes;
    const filtered = searchTerm ? baseRecipes : filterRecipes(recipes, searchTerm, filters);
    return sortRecipes(filtered, filters.sortBy);
  }, [recipes, searchTerm, filters, smartFilteredRecipes]);
  
  // Pagination for filtered recipes
  const {
    paginatedItems: paginatedRecipes,
    currentPage,
    totalPages,
    goToNextPage,
    goToPreviousPage,
    canGoNext,
    canGoPrevious,
    totalItems: totalFilteredRecipes,
    startIndex,
    endIndex
  } = usePagination({
    items: filteredRecipes,
    itemsPerPage: 20
  });
  
  // Get favorite recipes
  const favoriteRecipes = useMemo(() => {
    return recipes.filter(recipe => favorites.includes(recipe.id));
  }, [recipes, favorites]);
  
  // Handle favorites click - show identity modal if needed
  const handleFavoritesClick = () => {
    if (!hasChosenIdentity()) {
      setPendingAction('favorites');
      setShowSignIn(true);
    } else {
      setCurrentView('favorites');
    }
  };

  // Handle recipe click
  const handleRecipeClick = (recipe: Recipe) => {
    // Update URL hash for direct linking
    window.location.hash = `recipe-${recipe.id}`;
    
    // Update SEO meta tags for the recipe
    const metadata = generateRecipeMetadata(recipe);
    updateMetaTags(metadata);
    
    setSelectedRecipe(recipe);
    setCurrentView('detail');
  };
  
  // Handle navigation
  const handleBackToRecipes = () => {
    // Clear URL hash when going back
    window.location.hash = '';
    
    // Reset meta tags when going back
    resetMetaTags();
    setCurrentView('recipes');
    setSelectedRecipe(null);
  };

  // Handle recipe click from favorites (goes directly to detail)
  const handleFavoriteRecipeClick = (recipe: Recipe) => {
    // Update URL hash for direct linking
    window.location.hash = `recipe-${recipe.id}`;
    
    // Check if we have cached version when offline
    if (!isOnline) {
      const cachedRecipe = getCachedRecipe(recipe.id);
      if (cachedRecipe) {
        const metadata = generateRecipeMetadata(cachedRecipe);
        updateMetaTags(metadata);
        setSelectedRecipe(cachedRecipe);
        setCurrentView('detail');
        return;
      }
    }
    
    const metadata = generateRecipeMetadata(recipe);
    updateMetaTags(metadata);
    setSelectedRecipe(recipe);
    setCurrentView('detail');
  };

  // Handle sign-in modal close and complete pending actions
  const handleSignInModalClose = () => {
    setShowSignIn(false);
    setPendingAction(null);
    setPendingRecipeId(null);
  };

  // Handle authentication success and complete pending actions
  const handleSignInWithGoogle = async () => {
    await signInWithGoogle();
    completePendingAction();
  };

  const handleSignInWithEmail = async (credentials: any) => {
    await signInWithEmail(credentials);
    completePendingAction();
  };

  const handleSignUpWithEmail = async (credentials: any) => {
    await signUpWithEmail(credentials);
    completePendingAction();
  };

  const handleContinueAsGuest = () => {
    continueAsGuest();
    completePendingAction();
  };

  // Complete the pending action after authentication
  const completePendingAction = () => {
    if (pendingAction === 'favorites') {
      setCurrentView('favorites');
    } else if (pendingAction === 'toggle-favorite' && pendingRecipeId) {
      toggleFavorite(pendingRecipeId);
    }
    
    // Clear pending state
    setPendingAction(null);
    setPendingRecipeId(null);
  };

  // Enhanced toggle favorite with authentication check
  const handleToggleFavorite = (recipeId: string) => {
    if (!hasChosenIdentity()) {
      setPendingAction('toggle-favorite');
      setPendingRecipeId(recipeId);
      setShowSignIn(true);
    } else {
      toggleFavorite(recipeId);
    }
  };

  // Loading state
  if (loading) {
    return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-[#0d7517] rounded-xl flex items-center justify-center mb-4 mx-auto">
          <ChefHat className="h-8 w-8 text-white" />
        </div>
        <Loader className="h-8 w-8 animate-spin text-[#0d7517] mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Eatro...</h2>
        <p className="text-gray-600">Preparing your healthy recipes...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 bg-red-500 rounded-xl flex items-center justify-center mb-4 mx-auto">
            <ChefHat className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Unable to Load Eatro</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={refreshRecipes}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#0d7517] rounded-xl flex items-center justify-center">
                <ChefHat className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Eatro</h1>
              </div>
            </div>
            
            {/* Navigation */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Auth Section */}
              {!isAuthenticated ? (
                <button
                  onClick={() => setShowSignIn(true)}
                  className="px-2 sm:px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors touch-manipulation text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                >
                  <span className="sm:hidden">Sign in</span>
                  <span className="hidden sm:inline">Sign in (optional)</span>
                </button>
              ) : (
                <div className="flex items-center gap-1 sm:gap-2">
                  <div className="flex items-center gap-2 px-2 sm:px-3 py-2">
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-4 w-4 text-gray-600" />
                    )}
                    <span className="text-xs sm:text-sm text-gray-700 hidden sm:inline">
                      Hi, {user?.name}
                    </span>
                  </div>
                  <button
                    onClick={() => setShowAccountSettings(true)}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors touch-manipulation"
                    title="Account Settings"
                  >
                    <Settings className="h-4 w-4" />
                  </button>
                  <button
                    onClick={signOut}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors touch-manipulation sm:hidden"
                    title="Sign Out"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              )}
              
              {/* Desktop Navigation - Hidden on Mobile */}
              <div className="hidden sm:flex items-center gap-1 sm:gap-2">
                <button
                  onClick={() => setCurrentView('recipes')}
                  className={`px-2 sm:px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors touch-manipulation ${
                    currentView === 'recipes'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <span className="sm:hidden">Recipes</span>
                  <span className="hidden sm:inline">All Recipes</span>
                </button>
                
                <button
                  onClick={() => setCurrentView('ai')}
                  className={`px-2 sm:px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors touch-manipulation flex items-center gap-1 ${
                    currentView === 'ai'
                      ? 'bg-green-100 text-green-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Sparkles className="h-4 w-4" />
                  <span className="sm:hidden">AI</span>
                  <span className="hidden sm:inline">AI Recommendations</span>
                </button>
                
                <button
                  onClick={handleFavoritesClick}
                  className={`px-2 sm:px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors touch-manipulation flex items-center gap-1 relative ${
                    currentView === 'favorites'
                      ? 'bg-red-100 text-red-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Heart className="h-4 w-4" />
                  <span className="sm:hidden">Favorites</span>
                  <span className="hidden sm:inline">Favorites</span>
                  {favorites.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {favorites.length > 9 ? '9+' : favorites.length}
                    </span>
                  )}
                </button>
                
                <button
                  onClick={() => setShowPreferences(true)}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors touch-manipulation"
                  title="Recipe Preferences"
                >
                  <Settings className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-4 sm:py-6 md:py-8 pb-20 sm:pb-4">
        {/* Recipe Detail View */}
        {currentView === 'detail' && selectedRecipe && (
          <RecipeDetail
            recipe={selectedRecipe}
            onBack={handleBackToRecipes}
            isFavorite={isFavorite(selectedRecipe.id)}
            onToggleFavorite={handleToggleFavorite}
          />
        )}
        
        {/* AI Recommendations View */}
        {currentView === 'ai' && (
          <AIRecommendations
            preferences={preferences}
            onRecommendationClick={handleRecipeClick}
            availableRecipes={recipes}
          />
        )}
        
        {/* Favorites View */}
        {currentView === 'favorites' && (
          <FavoritesView
            favoriteRecipes={favoriteRecipes}
            onRecipeClick={handleFavoriteRecipeClick}
            onBack={() => setCurrentView('recipes')}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
          />
        )}
        
        {/* Main Recipes View */}
        {currentView === 'recipes' && (
          <>
            {/* Smart Search Bar */}
            <SmartSearchBar
              recipes={recipes}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              onFilteredRecipes={setSmartFilteredRecipes}
            />
            
            {/* Filter Bar */}
            <FilterBar
              filters={filters}
              onFilterChange={setFilters}
            />
            
            {/* Search and Filter (for refresh button) */}
            <SearchAndFilter
              filters={legacyFilters}
              onFiltersChange={setLegacyFilters}
              onRefresh={refreshRecipes}
              cuisines={[...new Set(recipes.map(r => r.cuisine))]}
              mealTypes={[...new Set(recipes.flatMap(r => r.mealType))]}
            />

            {/* Recipe List */}
            <RecipeList
              recipes={paginatedRecipes}
              onRecipeClick={handleRecipeClick}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              currentPage={currentPage}
              totalPages={totalPages}
              onNextPage={goToNextPage}
              onPreviousPage={goToPreviousPage}
              canGoNext={canGoNext}
              canGoPrevious={canGoPrevious}
              totalRecipes={totalFilteredRecipes}
              startIndex={startIndex}
              endIndex={endIndex}
            />
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-8 sm:mt-12">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6">
          <div className="text-center space-y-3">
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
              <button
                onClick={() => setShowDisclaimer(true)}
                className="text-xs text-gray-500 hover:text-gray-700 transition-colors touch-manipulation"
              >
                Disclaimer
              </button>
              <button
                onClick={() => setShowPrivacy(true)}
                className="text-xs text-gray-500 hover:text-gray-700 transition-colors touch-manipulation"
              >
                Privacy
              </button>
              <button
                onClick={() => setShowTerms(true)}
                className="text-xs text-gray-500 hover:text-gray-700 transition-colors touch-manipulation"
              >
                Terms
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              © 2025 Eatro. Made with ❤️ for healthy cooking.
            </p>
          </div>
        </div>
      </footer>

      {/* User Preferences Modal */}
      {showPreferences && (
        <UserPreferencesModal
          preferences={preferences}
          onSave={handleSavePreferences}
          onClose={() => setShowPreferences(false)}
        />
      )}

      {/* Sign In Modal */}
      {showSignIn && (
        <SignInModal
          onClose={handleSignInModalClose}
          onSignInWithGoogle={handleSignInWithGoogle}
          onSignInWithEmail={handleSignInWithEmail}
          onSignUpWithEmail={handleSignUpWithEmail}
          onForgotPassword={forgotPassword}
          onContinueAsGuest={handleContinueAsGuest}
          pendingAction={pendingAction || undefined}
          pendingRecipeId={pendingRecipeId || undefined}
        />
      )}

      {/* Account Settings Modal */}
      {showAccountSettings && user && (
        <AccountSettingsModal
          user={user}
          onClose={() => setShowAccountSettings(false)}
          onSignOut={signOut}
          onDeleteAccount={deleteAccount}
        />
      )}

      {/* Legal Modals */}
      {showDisclaimer && (
        <DisclaimerModal onClose={() => setShowDisclaimer(false)} />
      )}

      {showPrivacy && (
        <PrivacyModal onClose={() => setShowPrivacy(false)} />
      )}

      {showTerms && (
        <TermsModal onClose={() => setShowTerms(false)} />
      )}

      {/* Toast Notification */}
      <Toast message={toastMessage} show={showToast} />

      {/* Mobile Bottom Navigation */}
      <BottomNavigation
        currentView={currentView}
        onNavigate={setCurrentView}
        onPreferences={() => setShowPreferences(true)}
        favoritesCount={favorites.length}
      />

    </div>
  );
}

export default App;
