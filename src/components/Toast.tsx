import React from 'react';
import { Check } from 'lucide-react';

interface ToastProps {
  message: string;
  show: boolean;
}

export const Toast: React.FC<ToastProps> = ({ message, show }) => {
  if (!show) return null;

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in">
      <div className="bg-gray-900 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 max-w-sm">
        <Check className="h-4 w-4 text-green-400 flex-shrink-0" />
        <span className="text-sm font-medium">{message}</span>
      </div>
    </div>
  );
};