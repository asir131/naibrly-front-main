'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';

export default function UserTypeSelectionModal({ isOpen, onClose, mode = 'signup' }) {
  const router = useRouter();

  if (!isOpen) return null;

  const handleUserTypeSelect = (userType) => {
    // Close modal
    onClose();

    // Determine the type parameter to pass in URL
    const typeParam = userType === 'customer' ? 'user' : 'provider';

    // Navigate based on mode (signup or signin) and user type
    if (mode === 'signup') {
      if (userType === 'customer') {
        // Route to customer signup: app/(auth)/(user-auth)/create-account/page.jsx
        router.push(`/create-account?type=${typeParam}`);
      } else if (userType === 'provider') {
        // Route to provider signup: app/(auth)/provider/signup/page.jsx
        router.push(`provider/signup/user_info`);
      }
    } else if (mode === 'signin') {
      if (userType === 'customer') {
        // Route to customer login: app/(auth)/(user-auth)/Login/page.jsx
        router.push(`/Login?type=${typeParam}`);
      } else if (userType === 'provider') {
        // Route to provider login: app/(auth)/provider/login/page.jsx
        router.push(`/provider/login?type=${typeParam}`);
      }
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200]"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-[201] p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative animate-in zoom-in-95 duration-200">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>

          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Please select:
            </h2>
          </div>

          {/* User Type Options */}
          <div className="space-y-4">
            {/* Customer Option */}
            <button
              onClick={() => handleUserTypeSelect('customer')}
              className="w-full bg-teal-50 hover:bg-teal-100 text-teal-700 font-semibold py-5 px-6 rounded-xl transition-all duration-200 hover:scale-[1.02] hover:shadow-md"
            >
              Customer
            </button>

            {/* Service Provider Option */}
            <button
              onClick={() => handleUserTypeSelect('provider')}
              className="w-full bg-teal-50 hover:bg-teal-100 text-teal-700 font-semibold py-5 px-6 rounded-xl transition-all duration-200 hover:scale-[1.02] hover:shadow-md"
            >
              Service Provider
            </button>
          </div>
        </div>
      </div>
    </>
  );
}