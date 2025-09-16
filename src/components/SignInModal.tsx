import React, { useState } from 'react';
import { X, Mail, Loader, User, Eye, EyeOff } from 'lucide-react';
import { SignInCredentials } from '../types/Auth';

interface SignInModalProps {
  onClose: () => void;
  onSignInWithGoogle: () => Promise<void>;
  onSignInWithEmail: (credentials: SignInCredentials) => Promise<void>;
  onSignUpWithEmail: (credentials: SignInCredentials & { confirmPassword: string }) => Promise<void>;
  onContinueAsGuest: () => void;
  onForgotPassword: (email: string) => Promise<void>;
  pendingAction?: 'favorites' | 'toggle-favorite';
  pendingRecipeId?: string;
}

type ModalStep = 'identity' | 'auth';
type AuthMode = 'signin' | 'signup';

export const SignInModal: React.FC<SignInModalProps> = ({
  onClose,
  onSignInWithGoogle,
  onSignInWithEmail,
  onSignUpWithEmail,
  onContinueAsGuest,
  onForgotPassword,
  pendingAction,
  pendingRecipeId
}) => {
  const [step, setStep] = useState<ModalStep>('identity');
  const [authMode, setAuthMode] = useState<AuthMode>('signin');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await onSignInWithGoogle();
      onClose();
    } catch (error) {
      console.error('Google sign-in failed:', error);
      setErrors({ general: 'Google sign-in failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!credentials.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(credentials.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!forgotPasswordMode) {
      if (!credentials.password) {
        newErrors.password = 'Password is required';
      } else if (credentials.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }

      if (authMode === 'signup') {
        if (!credentials.confirmPassword) {
          newErrors.confirmPassword = 'Please confirm your password';
        } else if (credentials.password !== credentials.confirmPassword) {
          newErrors.confirmPassword = 'Passwords do not match';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      if (forgotPasswordMode) {
        await onForgotPassword(credentials.email);
        setForgotPasswordMode(false);
        setErrors({ success: 'Password reset link sent to your email!' });
      } else if (authMode === 'signin') {
        await onSignInWithEmail({
          email: credentials.email,
          password: credentials.password
        });
        onClose();
      } else {
        await onSignUpWithEmail({
          email: credentials.email,
          password: credentials.password,
          confirmPassword: credentials.confirmPassword
        });
        onClose();
      }
    } catch (error) {
      console.error('Email auth failed:', error);
      setErrors({ 
        general: forgotPasswordMode 
          ? 'Failed to send reset email. Please try again.'
          : authMode === 'signin' 
            ? 'Sign in failed. Please check your credentials.'
            : 'Sign up failed. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestContinue = () => {
    onContinueAsGuest();
    onClose();
  };

  const resetForm = () => {
    setCredentials({ email: '', password: '', confirmPassword: '' });
    setErrors({});
    setForgotPasswordMode(false);
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleBackToIdentity = () => {
    setStep('identity');
    resetForm();
  };

  const handleAuthModeChange = (mode: AuthMode) => {
    setAuthMode(mode);
    resetForm();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              {step === 'identity' ? 'Save Your Favorites' : 
               forgotPasswordMode ? 'Reset Password' :
               authMode === 'signin' ? 'Sign In' : 'Create Account'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
          {step === 'identity' && (
            <p className="text-sm text-gray-600 mt-2">
              Choose how you'd like to save your favorite recipes
            </p>
          )}
        </div>

        <div className="p-6">
          {/* Step 1: Choose Identity */}
          {step === 'identity' && (
            <div className="space-y-4">
              {/* Continue as Guest */}
              <div className="border border-gray-200 rounded-lg p-4 hover:border-emerald-300 transition-colors">
                <button
                  onClick={handleGuestContinue}
                  className="w-full text-left"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <User className="h-5 w-5 text-emerald-600" />
                    <span className="font-medium text-gray-900">Continue as Guest</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {pendingAction === 'favorites' 
                      ? "Your favorites will be saved only on this device and you'll go straight to your Favorites page."
                      : "Your favorites will be saved only on this device. You can switch to an account anytime to sync across devices."
                    }
                  </p>
                </button>
              </div>

              {/* Sign in / Sign up */}
              <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                <button
                  onClick={() => setStep('auth')}
                  className="w-full text-left"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Mail className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-gray-900">Sign in / Sign up</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Create an account or sign in to keep your favorites safe and available on all your devices.
                  </p>
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Authentication Form */}
          {step === 'auth' && (
            <div className="space-y-4">
              {!forgotPasswordMode && (
                <>
                  {/* Google Sign In */}
                  <button
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    {isLoading ? (
                      <Loader className="h-5 w-5 animate-spin" />
                    ) : (
                      <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">G</span>
                      </div>
                    )}
                    <span className="font-medium text-gray-700">Continue with Google</span>
                  </button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">or</span>
                    </div>
                  </div>

                  {/* Auth Mode Toggle */}
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => handleAuthModeChange('signin')}
                      className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                        authMode === 'signin'
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => handleAuthModeChange('signup')}
                      className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                        authMode === 'signup'
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Sign Up
                    </button>
                  </div>
                </>
              )}

              {/* Email Form */}
              <form onSubmit={handleEmailAuth} className="space-y-4">
                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={credentials.email}
                    onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.email ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="your@email.com"
                    required
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                {/* Password Field */}
                {!forgotPasswordMode && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={credentials.password}
                        onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                        className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.password ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="••••••••"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                    )}
                  </div>
                )}

                {/* Confirm Password Field (Sign Up Only) */}
                {!forgotPasswordMode && authMode === 'signup' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={credentials.confirmPassword}
                        onChange={(e) => setCredentials({ ...credentials, confirmPassword: e.target.value })}
                        className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="••••••••"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                    )}
                  </div>
                )}

                {/* Error Messages */}
                {errors.general && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{errors.general}</p>
                  </div>
                )}

                {/* Success Messages */}
                {errors.success && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-600">{errors.success}</p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader className="h-5 w-5 animate-spin" />
                  ) : (
                    <Mail className="h-5 w-5" />
                  )}
                  <span className="font-medium">
                    {forgotPasswordMode ? 'Send Reset Link' :
                     authMode === 'signin' ? 'Sign In' : 'Create Account'}
                  </span>
                </button>

                {/* Helper Links */}
                {!forgotPasswordMode && (
                  <div className="text-center space-y-2">
                    {authMode === 'signin' && (
                      <button
                        type="button"
                        onClick={() => setForgotPasswordMode(true)}
                        className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        Forgot password?
                      </button>
                    )}
                    <p className="text-xs text-gray-500">
                      {authMode === 'signin' 
                        ? "Don't have an account? Switch to Sign Up above."
                        : "It's free and only takes a moment."}
                    </p>
                  </div>
                )}

                {forgotPasswordMode && (
                  <div className="text-center">
                    <p className="text-xs text-gray-500 mb-2">
                      We'll send a reset link to your email.
                    </p>
                    <button
                      type="button"
                      onClick={() => setForgotPasswordMode(false)}
                      className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      ← Back to sign in
                    </button>
                  </div>
                )}
              </form>

              {/* Back to Identity Choice */}
              <button
                onClick={handleBackToIdentity}
                className="w-full text-sm text-gray-600 hover:text-gray-800 transition-colors mt-4"
              >
                ← Back to identity options
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};