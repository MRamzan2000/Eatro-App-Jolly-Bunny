import React, { useState } from 'react';
import { X, User, Trash2, LogOut, AlertTriangle } from 'lucide-react';
import { User as UserType } from '../types/Auth';

interface AccountSettingsModalProps {
  user: UserType;
  onClose: () => void;
  onSignOut: () => void;
  onDeleteAccount: () => void;
}

export const AccountSettingsModal: React.FC<AccountSettingsModalProps> = ({
  user,
  onClose,
  onSignOut,
  onDeleteAccount
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSignOut = () => {
    onSignOut();
    onClose();
  };

  const handleDeleteAccount = () => {
    onDeleteAccount();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Account Settings</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* User Info */}
          <div className="flex items-center gap-4">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-emerald-600" />
              </div>
            )}
            <div>
              <h3 className="font-semibold text-gray-900">{user.name}</h3>
              {user.email && (
                <p className="text-sm text-gray-600">{user.email}</p>
              )}
              <p className="text-xs text-gray-500 capitalize">
                {user.provider === 'guest' ? 'Guest Account' : `${user.provider} Account`}
              </p>
            </div>
          </div>

          {/* Account Actions */}
          <div className="space-y-3">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-3 text-left border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <LogOut className="h-5 w-5 text-gray-600" />
              <span className="font-medium text-gray-700">Sign Out</span>
            </button>

            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
              >
                <Trash2 className="h-5 w-5 text-red-600" />
                <span className="font-medium text-red-700">Delete Account</span>
              </button>
            ) : (
              <div className="border border-red-300 rounded-lg p-4 bg-red-50">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <span className="font-semibold text-red-800">Confirm Deletion</span>
                </div>
                <p className="text-sm text-red-700 mb-4">
                  This will permanently delete your account and all associated data, including favorites and preferences. This action cannot be undone.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={handleDeleteAccount}
                    className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                  >
                    Delete Forever
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {user.provider === 'guest' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Guest Account:</strong> Your favorites are saved locally on this device only. Sign in with Google or Email to sync across devices.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};