'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Briefcase, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SelectUserTypePage() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState(null);

  const handleContinue = () => {
    if (selectedType === 'user') {
      router.push('/Login?type=user');
    } else if (selectedType === 'provider') {
      router.push('/provider/login?type=provider');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-10">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-slate-900 mb-3">
            Welcome to Naibrly
          </h1>
          <p className="text-slate-500 text-base">
            Please select how you'd like to continue
          </p>
        </div>

        {/* Selection Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* User Card */}
          <button
            onClick={() => setSelectedType('user')}
            className={`relative p-8 rounded-xl border-2 transition-all duration-200 ${
              selectedType === 'user'
                ? 'border-teal-600 bg-teal-50 shadow-md'
                : 'border-slate-200 bg-white hover:border-teal-300 hover:shadow-sm'
            }`}
          >
            {/* Selection Indicator */}
            {selectedType === 'user' && (
              <div className="absolute top-4 right-4 w-6 h-6 bg-teal-600 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}

            {/* Icon */}
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto ${
              selectedType === 'user' ? 'bg-teal-600' : 'bg-slate-100'
            }`}>
              <User className={`w-8 h-8 ${
                selectedType === 'user' ? 'text-white' : 'text-slate-600'
              }`} />
            </div>

            {/* Title */}
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              I'm a User
            </h3>

            {/* Description */}
            <p className="text-sm text-slate-500 mb-4">
              Looking for home services, maintenance, and professional help
            </p>

            {/* Features */}
            <ul className="text-left space-y-2 text-sm text-slate-600">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-teal-600"></div>
                Find trusted service providers
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-teal-600"></div>
                Book services instantly
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-teal-600"></div>
                Track your service requests
              </li>
            </ul>
          </button>

          {/* Provider Card */}
          <button
            onClick={() => setSelectedType('provider')}
            className={`relative p-8 rounded-xl border-2 transition-all duration-200 ${
              selectedType === 'provider'
                ? 'border-teal-600 bg-teal-50 shadow-md'
                : 'border-slate-200 bg-white hover:border-teal-300 hover:shadow-sm'
            }`}
          >
            {/* Selection Indicator */}
            {selectedType === 'provider' && (
              <div className="absolute top-4 right-4 w-6 h-6 bg-teal-600 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}

            {/* Icon */}
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto ${
              selectedType === 'provider' ? 'bg-teal-600' : 'bg-slate-100'
            }`}>
              <Briefcase className={`w-8 h-8 ${
                selectedType === 'provider' ? 'text-white' : 'text-slate-600'
              }`} />
            </div>

            {/* Title */}
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              I'm a Provider
            </h3>

            {/* Description */}
            <p className="text-sm text-slate-500 mb-4">
              Offering professional services and growing your business
            </p>

            {/* Features */}
            <ul className="text-left space-y-2 text-sm text-slate-600">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-teal-600"></div>
                Reach more customers
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-teal-600"></div>
                Manage your bookings
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-teal-600"></div>
                Grow your business
              </li>
            </ul>
          </button>
        </div>

        {/* Continue Button */}
        <Button
          onClick={handleContinue}
          disabled={!selectedType}
          className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg font-medium text-base disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          Continue as {selectedType ? (selectedType === 'user' ? 'User' : 'Provider') : '...'}
          <ArrowRight className="w-5 h-5" />
        </Button>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
        </div>

        {/* Alternative Actions */}
        <div className="text-center space-y-3">
          <p className="text-sm text-slate-600">
            Don't have an account?{' '}
            <button
              onClick={() => {
                if (selectedType === 'user') {
                  router.push('/create-account?type=user');
                } else if (selectedType === 'provider') {
                  router.push('/provider/signup/user_info');
                } else {
                  // If no type selected, show a message or go to signup selection
                  alert('Please select whether you are a User or Provider first');
                }
              }}
              className="text-teal-600 hover:text-teal-700 font-medium"
            >
              Create an account
            </button>
          </p>

          <p className="text-sm text-slate-600">
            <a href="/" className="text-slate-500 hover:text-teal-600">
              Back to home
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
