import React from 'react';
import { X, FileText } from 'lucide-react';

interface TermsModalProps {
  onClose: () => void;
}

export const TermsModal: React.FC<TermsModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-6 w-6 text-green-600" />
              <h2 className="text-xl font-bold text-gray-900">Terms of Use</h2>
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
            By using this app, you agree to the following terms:
          </p>

          <div className="space-y-3">
            <p className="text-gray-700 text-sm">
              • This app is provided for informational use only.
            </p>

            <p className="text-gray-700 text-sm">
              • We do not guarantee outcomes, results, or accuracy of recipes or nutrition values.
            </p>

            <p className="text-gray-700 text-sm">
              • Users are responsible for their own cooking, health, and safety when following recipes.
            </p>

            <p className="text-gray-700 text-sm">
              • The app and its content are provided "as is," without warranties of any kind.
            </p>

            <p className="text-gray-700 text-sm">
              • We reserve the right to update these terms at any time.
            </p>
          </div>
        </div>

        <div className="p-4 sm:p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors touch-manipulation"
          >
            I Agree
          </button>
        </div>
      </div>
    </div>
  );
};