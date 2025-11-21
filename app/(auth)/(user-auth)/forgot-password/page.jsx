'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForgotPasswordMutation } from '@/redux/api/servicesApi';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await forgotPassword({ email }).unwrap();
      setSuccess('Verification code sent to your email!');

      // Navigate to authentication code page after short delay
      setTimeout(() => {
        router.push(`/authentication-code?email=${encodeURIComponent(email)}`);
      }, 1500);
    } catch (err) {
      console.error('Forgot password error:', err);
      setError(err?.data?.message || err?.message || 'Failed to send verification code. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4 py-8">
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
            Reset Your Password
          </h1>
          <p className="text-sm text-slate-500">
            Enter your email address below and we'll send you a link with instructions
          </p>
        </div>

        {/* Illustration */}
        <div className="flex justify-center mb-8">
          <div className="relative w-48 h-48">
            {/* Password Reset Illustration */}
            <div className="absolute inset-0 bg-slate-100 rounded-full flex items-center justify-center">
              <div className="space-y-4">
                {/* Email icon representation */}
                <div className="flex items-center gap-2 bg-white rounded-lg p-3 shadow-sm">
                  <div className="w-3 h-3 bg-teal-500 rounded-full"></div>
                  <div className="flex-1 space-y-1">
                    <div className="h-2 bg-slate-200 rounded w-16"></div>
                    <div className="h-2 bg-slate-200 rounded w-12"></div>
                  </div>
                </div>

                {/* Password field representation */}
                <div className="bg-slate-700 rounded-lg p-3 shadow-md">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <div className="w-4 h-4 bg-teal-500 rounded-full"></div>
                  </div>
                </div>

                {/* Another email representation */}
                <div className="flex items-center gap-2 bg-white rounded-lg p-3 shadow-sm">
                  <div className="w-3 h-3 bg-teal-500 rounded-full"></div>
                  <div className="flex-1 space-y-1">
                    <div className="h-2 bg-slate-200 rounded w-16"></div>
                    <div className="h-2 bg-slate-200 rounded w-12"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div>
            <label className="text-xs font-medium text-teal-700 block mb-2">
              Email Address
            </label>
            <Input
              type="email"
              placeholder="Jhon@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-slate-50 text-slate-900"
              required
            />
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

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading || !email}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg font-medium text-base disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Sending...' : 'Send Verification Code'}
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
