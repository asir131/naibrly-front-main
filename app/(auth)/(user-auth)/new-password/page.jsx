'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useResetPasswordMutation } from '@/redux/api/servicesApi';
import { Suspense } from 'react';

function NewPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const tokenFromQuery = searchParams.get('token');

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resetToken, setResetToken] = useState(null);

  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  // Redirect if no email and load reset token
  useEffect(() => {
    if (!email) {
      router.push('/forgot-password');
    }
    if (tokenFromQuery) {
      setResetToken(tokenFromQuery);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('resetToken', tokenFromQuery);
      }
    } else if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('resetToken');
      if (stored) {
        setResetToken(stored);
      }
    }
  }, [email, router, tokenFromQuery]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate password strength (basic validation)
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    try {
      await resetPassword({
        email,
        newPassword: formData.password,
        confirmPassword: formData.confirmPassword,
        resetToken: resetToken || undefined,
      }).unwrap();

      setSuccess('Password reset successfully! Redirecting to login...');

      // Navigate to login page after short delay
      setTimeout(() => {
        router.push('/Login');
      }, 2000);
    } catch (err) {
      console.error('Reset password error:', err);
      setError(err?.data?.message || err?.message || 'Failed to reset password. Please try again.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-10">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-6 p-2 hover:bg-slate-100 rounded-lg transition-colors inline-flex items-center"
        >
          <ArrowLeft className="w-5 h-5 text-slate-700" />
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Enter New Password
          </h1>
          <p className="text-sm text-slate-500">
            Set Complex passwords to protect
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Password Input */}
          <div>
            <label className="text-sm font-medium text-slate-900 block mb-2">
              Password
            </label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="AbcD@7281"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-slate-50 text-slate-900 pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password Input */}
          <div>
            <label className="text-sm font-medium text-slate-900 block mb-2">
              Re Type Password
            </label>
            <div className="relative">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-slate-50 text-slate-900 pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Success Message */}
          {success && (
            <div className="text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg p-3">
              {success}
            </div>
          )}

          {/* Error Message */}
      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
          {error}
        </div>
      )}

          {/* Missing token warning */}
          {!resetToken && (
            <div className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3">
              Reset link is missing a token. Please restart the password reset flow.
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading || !formData.password || !formData.confirmPassword || !resetToken}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg font-medium text-base disabled:opacity-50 disabled:cursor-not-allowed transition-colors mt-6"
          >
            {isLoading ? 'Setting Password...' : 'Set New Password'}
          </Button>
        </form>

        {/* Footer Links */}
        <div className="mt-6 text-center text-sm text-slate-600">
          <a href="#" className="hover:text-teal-600">Need Help</a>
          <span className="mx-2">|</span>
          <a href="#" className="hover:text-teal-600">FAQ</a>
          <span className="mx-2">|</span>
          <a href="/terms-of-use" className="hover:text-teal-600">Terms Of use</a>
        </div>
      </div>
    </div>
  );
}

export default function NewPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-10">
          <div className="text-center text-slate-600">Loading...</div>
        </div>
      </div>
    }>
      <NewPasswordContent />
    </Suspense>
  );
}
