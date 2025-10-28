'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';

export default function ProviderLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Mock login for provider
    setTimeout(() => {
      const mockProvider = {
        id: '1',
        name: email.split('@')[0],
        email: email,
        profileImage: null,
        role: 'provider'
      };

      login({ user: mockProvider, userType: 'provider' });
      setIsLoading(false);
      router.push('/provider/signup/analytics');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-slate-900 mb-2">
            Provider Login
          </h1>
          <p className="text-slate-500 text-sm">
            Sign in to manage your business
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email Input */}
          <div>
            <label className="text-xs font-medium text-teal-700 block mb-2">
              Email Address
            </label>
            <Input
              type="email"
              placeholder="provider@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-slate-50 text-slate-900"
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="text-xs font-medium text-teal-700 block mb-2">
              Password
            </label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="AbcD@7281"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

          {/* Forgot Password */}
          <div className="flex justify-end">
            <a href="/forgot-password" className="text-xs text-slate-500 hover:text-teal-600">
              Forgot Password ?
            </a>
          </div>

          {/* Login Button */}
          <Button
            type="submit"
            disabled={isLoading || !email || !password}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg font-medium text-base disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-3 bg-white text-slate-400">Or continue with</span>
          </div>
        </div>

        {/* Social Login Icons */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <button
            type="button"
            className="w-12 h-12 flex items-center justify-center rounded-full border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="black">
              <path d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.9-1.99 1.57-2.987 1.57-.12 0-.23-.02-.3-.03-.01-.06-.04-.22-.04-.39 0-1.15.572-2.27 1.206-2.98.804-.94 2.142-1.64 3.248-1.68.03.13.05.28.05.43zm4.565 15.71c-.03.07-.463 1.58-1.518 3.12-.945 1.34-1.94 2.71-3.43 2.71-1.517 0-1.9-.88-3.63-.88-1.698 0-2.302.91-3.67.91-1.377 0-2.332-1.26-3.428-2.8-1.287-1.82-2.323-4.63-2.323-7.28 0-4.28 2.797-6.55 5.552-6.55 1.448 0 2.675.95 3.6.95.865 0 2.222-1.01 3.902-1.01.613 0 2.886.06 4.374 2.19-.13.09-2.383 1.37-2.383 4.19 0 3.26 2.854 4.42 2.955 4.45z"/>
            </svg>
          </button>
          <button
            type="button"
            className="w-12 h-12 flex items-center justify-center rounded-full border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
          </button>
        </div>

        {/* Create Account Link */}
        <p className="text-center text-slate-600 text-sm">
          <a href="/provider/signup" className="text-slate-700 hover:text-teal-600 underline font-medium">
            Create provider account
          </a>
        </p>
      </div>
    </div>
  );
}
