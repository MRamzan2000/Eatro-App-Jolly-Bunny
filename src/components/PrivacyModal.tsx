import React from 'react';
import { X, Shield } from 'lucide-react';

interface PrivacyModalProps {
  onClose: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ onClose }) => {
  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="privacy-title"
    >
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-blue-600" aria-hidden="true" />
              <h2 id="privacy-title" className="text-xl font-bold text-gray-900">
                Privacy Policy
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors touch-manipulation"
              aria-label="Close privacy policy"
            >
              <X className="h-5 w-5 text-gray-500" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 space-y-6 text-sm text-gray-700">
          <section className="space-y-2">
            <h3 className="font-semibold text-gray-900">Guest mode</h3>
            <p>
              If you do not sign in, your favorites are saved locally on your device only.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-semibold text-gray-900">Signed-in users</h3>
            <p>
              If you sign in, your favorites are linked to your account and may sync across devices.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-semibold text-gray-900">Advertising (AdMob)</h3>
            <p>
              This app uses Google AdMob to display in-app advertisements. AdMob may collect and use
              device information such as cookies, advertising identifiers, and usage data to provide
              more relevant ads and measure performance.
            </p>
            <p className="text-gray-600">
              You can learn more about how Google uses your information here:{" "}
              <a
                href="https://policies.google.com/technologies/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                https://policies.google.com/technologies/ads
              </a>
            </p>
            <p className="text-gray-600">
              If you prefer, you can opt out of personalized advertising by visiting Google’s Ads Settings page:{" "}
              <a
                href="https://www.google.com/settings/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                https://www.google.com/settings/ads
              </a>
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-semibold text-gray-900">Data sharing</h3>
            <p>
              We do not sell your personal information. We only share limited data with service
              providers when necessary to operate the app.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-semibold text-gray-900">Updates</h3>
            <p>
              This privacy policy may be updated as we add new features. We will notify you of any
              significant changes within the app.
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors touch-manipulation"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
