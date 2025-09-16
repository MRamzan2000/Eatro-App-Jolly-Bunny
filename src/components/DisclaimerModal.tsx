import React from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface DisclaimerModalProps {
  onClose: () => void;
}

export const DisclaimerModal: React.FC<DisclaimerModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-amber-600" />
              <h2 className="text-xl font-bold text-gray-900">Disclaimer</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors touch-manipulation"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6 space-y-4">
          <p className="text-gray-700 leading-relaxed">
            All recipes in this app are provided for informational and educational purposes only.
          </p>

          <div className="space-y-3">
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Serving size:</h3>
              <p className="text-gray-700 text-sm">
                All recipes are designed for 2–3 servings.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Nutrition:</h3>
              <p className="text-gray-700 text-sm">
                Nutrition values are estimates calculated per serving and may vary depending on ingredients and cooking methods.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Health:</h3>
              <p className="text-gray-700 text-sm">
                This app does not provide medical advice. For specific dietary needs or medical conditions, please consult a qualified healthcare professional.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Allergens:</h3>
              <p className="text-gray-700 text-sm">
                Users are responsible for checking ingredients and avoiding allergens.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Results:</h3>
              <p className="text-gray-700 text-sm">
                Cooking outcomes may vary in taste, appearance, and nutritional values.
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors touch-manipulation"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};