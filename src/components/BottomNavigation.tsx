import React from 'react';
import { Home, Sparkles, Heart, Settings } from 'lucide-react';

interface BottomNavigationProps {
  currentView: 'recipes' | 'ai' | 'favorites' | 'detail';
  onNavigate: (view: 'recipes' | 'ai' | 'favorites') => void;
  onPreferences: () => void;
  favoritesCount: number;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  currentView,
  onNavigate,
  onPreferences,
  favoritesCount
}) => {
  const navItems = [
    {
      id: 'recipes' as const,
      icon: Home,
      label: 'Home',
      action: () => onNavigate('recipes')
    },
    {
      id: 'ai' as const,
      icon: Sparkles,
      label: 'AI',
      action: () => onNavigate('ai')
    },
    {
      id: 'favorites' as const,
      icon: Heart,
      label: 'Favorites',
      action: () => onNavigate('favorites'),
      badge: favoritesCount > 0 ? favoritesCount : undefined
    },
    {
      id: 'preferences' as const,
      icon: Settings,
      label: 'Reference',
      action: onPreferences
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-40 sm:hidden">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={item.action}
              className={`flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-colors touch-manipulation relative ${
                isActive
                  ? 'text-emerald-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="relative">
                <Icon className={`h-5 w-5 ${isActive ? 'text-emerald-600' : 'text-gray-600'}`} />
                {item.badge && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                )}
              </div>
              <span className={`text-xs font-medium ${
                isActive ? 'text-emerald-600' : 'text-gray-600'
              }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};