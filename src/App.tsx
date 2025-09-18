import React, { useState, useMemo, useEffect } from 'react';
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
import { AdMob, BannerAdSize, BannerAdPosition } from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';

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
  const [bannerVisible, setBannerVisible] = useState(false);
  const [adError, setAdError] = useState<string | null>(null);
  const [platform, setPlatform] = useState(Capacitor.getPlatform());

  // Initialize AdMob with platform-specific UMP consent handling
  useEffect(() => {
    const isNativePlatform = Capacitor.isNativePlatform();
    console.log('Platform:', platform, 'Is Native:', isNativePlatform);

    if (!isNativePlatform) {
      console.log('AdMob skipped: Not running on a native platform (iOS/Android)');
      return;
    }

    const initAds = async () => {
      try {
        console.log('Requesting consent info...');
        const { status } = await AdMob.requestConsentInfo();
        console.log('Consent status:', status);

        let consentObtained = false;

        if (status === 'REQUIRED') {
          console.log('Showing consent form...');
          try {
            await AdMob.showConsentForm();
            // On Android, after showing form, assume consent is handled by native SDK
            // For iOS, we can check; for Android, skip check to avoid "Not Implemented" error
            if (platform === 'ios') {
              const { consentStatus } = await AdMob.checkConsentInfo();
              consentObtained = consentStatus === 'OBTAINED';
              console.log('iOS Consent status after form:', consentStatus);
            } else {
              // On Android, proceed assuming consent is obtained after form (or if not required)
              consentObtained = true;
              console.log('Android: Assuming consent obtained after form');
            }
          } catch (formError) {
            console.error('Consent form error:', formError);
            // Fallback: Proceed without consent for testing
            consentObtained = true;
          }
        } else {
          // No consent required, proceed
          consentObtained = true;
          console.log('No consent required, proceeding...');
        }

        if (consentObtained) {
          console.log('Initializing AdMob...');
          await AdMob.initialize({
            initializeForTesting: true, // TODO: Remove when going live
          });

          console.log('Showing banner ad...');
          await AdMob.showBanner({
            adId: 'ca-app-pub-3940256099942544/6300978111', // Test ad unit ID
            adSize: BannerAdSize.BANNER,
            position: BannerAdPosition.BOTTOM_CENTER,
          });
          console.log('Banner ad requested');
          setBannerVisible(true);
          setAdError(null);

          // Handle ad events
          AdMob.addListener('onAdLoaded', () => {
            console.log('Banner ad loaded successfully');
            setBannerVisible(true);
            setAdError(null);
          });

          AdMob.addListener('onAdFailedToLoad', (error) => {
            console.error('Ad failed to load:', error);
            setBannerVisible(false);
            setAdError(`Ad Failed: ${JSON.stringify(error)}`);
            // Retry after 5 seconds
            setTimeout(() => {
              console.log('Retrying banner ad load...');
              try {
                AdMob.showBanner({
                  adId: 'ca-app-pub-3940256099942544/6300978111',
                  adSize: BannerAdSize.BANNER,
                  position: BannerAdPosition.BOTTOM_CENTER,
                });
              } catch (retryError) {
                console.error('Retry failed:', retryError);
              }
            }, 5000);
          });

          AdMob.addListener('onAdDismissedFullScreenContent', () => {  // Updated for banner dismissal if applicable
            console.log('Ad dismissed');
            setBannerVisible(false);
            setAdError(null);
          });
        } else {
          console.log('AdMob not initialized: Consent not obtained');
          setBannerVisible(false);
          setAdError('Consent not obtained');
        }
      } catch (err: any) {
        console.error('Ad initialization error:', err);
        // Specific handling for Android "Not Implemented" error
        if (err.message && err.message.includes('Not Implemented') && platform === 'android') {
          console.log('Android: Bypassing consent check due to Not Implemented error, proceeding with initialization...');
          try {
            await AdMob.initialize({
              initializeForTesting: true,
            });
            await AdMob.showBanner({
              adId: 'ca-app-pub-3940256099942544/6300978111',
              adSize: BannerAdSize.BANNER,
              position: BannerAdPosition.BOTTOM_CENTER,
            });
            setBannerVisible(true);
            setAdError(null);
            console.log('Android fallback: Banner requested after bypass');
          } catch (fallbackError) {
            console.error('Fallback initialization failed:', fallbackError);
            setAdError(`Fallback Failed: ${String(fallbackError)}`);
          }
        } else {
          setBannerVisible(false);
          setAdError(String(err));
        }
      }
    };

    initAds();

    return () => {
      console.log('Cleaning up AdMob...');
      try {
        AdMob.removeBanner();
      } catch (cleanupError) {
        console.error('Cleanup error:', cleanupError);
      }
      setBannerVisible(false);
      setAdError(null);
    };
  }, [platform]);

  // Handle URL routing for shared recipe links
  useEffect(() => {
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

  // Handle favorites click
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
    window.location.hash = `recipe-${recipe.id}`;
    const metadata = generateRecipeMetadata(recipe);
    updateMetaTags(metadata);
    setSelectedRecipe(recipe);
    setCurrentView('detail');
  };

  // Handle navigation
  const handleBackToRecipes = () => {
    window.location.hash = '';
    resetMetaTags();
    setCurrentView('recipes');
    setSelectedRecipe(null);
  };

  // Handle recipe click from favorites
  const handleFavoriteRecipeClick = (recipe: Recipe) => {
    window.location.hash = `recipe-${recipe.id}`;
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

  // Handle sign-in modal close
  const handleSignInModalClose = () => {
    setShowSignIn(false);
    setPendingAction(null);
    setPendingRecipeId(null);
  };

  // Handle authentication success
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

  const completePendingAction = () => {
    if (pendingAction === 'favorites') {
      setCurrentView('favorites');
    } else if (pendingAction === 'toggle-favorite' && pendingRecipeId) {
      toggleFavorite(pendingRecipeId);
    }
    setPendingAction(null);
    setPendingRecipeId(null);
  };

  // Enhanced toggle favorite
  const handleToggleFavorite = (recipeId: string) => {
    if (!hasChosenIdentity()) {
      setPendingAction('toggle-favorite');
      setPendingRecipeId(recipeId);
      setShowSignIn(true);
    } else {
      toggleFavorite(recipeId);
    }
  };

//   // Manual banner toggle for testing
//   const toggleBanner = async () => {
//     if (bannerVisible) {
//       await AdMob.hideBanner();
//       setBannerVisible(false);
//       console.log('Banner hidden manually');
//     } else {
//       try {
//         await AdMob.showBanner({
//           adId: 'ca-app-pub-3940256099942544/6300978111',
//           adSize: BannerAdSize.BANNER,
//           position: BannerAdPosition.BOTTOM_CENTER,
//         });
//         setBannerVisible(true);
//         console.log('Banner shown manually');
//       } catch (toggleError) {
//         console.error('Manual toggle error:', toggleError);
//         setAdError(`Toggle Error: ${String(toggleError)}`);
//       }
//     }
//   };

  // Reload ads for testing (bypasses consent if needed)
  const reloadAds = async () => {
    setAdError(null);
    try {
      await AdMob.initialize({ initializeForTesting: true });
      await AdMob.showBanner({
        adId: 'ca-app-pub-3940256099942544/6300978111',
        adSize: BannerAdSize.BANNER,
        position: BannerAdPosition.BOTTOM_CENTER,
      });
      setBannerVisible(true);
      console.log('Ads reloaded manually');
    } catch (reloadError) {
      console.error('Reload error:', reloadError);
      setAdError(`Reload Error: ${String(reloadError)}`);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center" style={{ paddingBottom: bannerVisible ? '60px' : '0px' }}>
        <div className="text-center">
          <div className="w-16 h-16 bg-[#0d7517] rounded-xl flex items-center justify-center mb-4 mx-auto">
            <ChefHat className="h-8 w-8 text-white" />
          </div>
          <Loader className="h-8 w-8 animate-spin text-[#0d7517] mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Eatro...</h2>
          <p className="text-gray-600">Preparing your healthy recipes...</p>
          {adError && <p className="text-red-500 mt-2">Ad Error: {adError}</p>}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" style={{ paddingBottom: bannerVisible ? '60px' : '0px' }}>
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 bg-red-500 rounded-xl flex items-center justify-center mb-4 mx-auto">
            <ChefHat className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Unable to Load Eatro</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          {adError && <p className="text-red-500 mb-4">Ad Error: {adError}</p>}
          <button
            onClick={refreshRecipes}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            style={{ position: 'fixed', bottom: bannerVisible ? '60px' : '10px', left: '10px', right: '10px' }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" style={{ paddingBottom: bannerVisible ? '60px' : '0px' }}>
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
        {/* Debug Buttons for Testing Banner (top-right) */}
        <div style={{ position: 'fixed', top: '10px', right: '10px', zIndex: 1000, display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <button
            onClick={toggleBanner}
            className="px-3 py-1 bg-gray-200 text-gray-800 text-sm rounded"
          >
            {bannerVisible ? 'Hide Banner' : 'Show Banner'}
          </button>
          <button
            onClick={reloadAds}
            className="px-3 py-1 bg-blue-200 text-blue-800 text-sm rounded"
          >
            Reload Ads
          </button>
        </div>

        {adError && (
          <div className="fixed top-20 right-10 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded z-1000 text-sm max-w-xs">
            Ad Error: {adError}
          </div>
        )}

        {console.log('Render - Banner Visible:', bannerVisible, 'Platform:', platform)} {/* Debug log */}

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
        style={{ position: 'fixed', bottom: bannerVisible ? '60px' : '0px', left: '0px', right: '0px', zIndex: 1000 }}
      />

    </div>
  );
}

export default App;