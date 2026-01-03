'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

export default function GoogleCallbackPage() {
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    const redirect = searchParams.get('redirect');

    if (!token) {
      setError('Missing login token. Please try again.');
      return;
    }

    localStorage.setItem('authToken', token);

    const loadProfile = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data?.message || 'Failed to load profile');
        }

        const userData = data?.data?.user;
        if (!userData) {
          throw new Error('No user profile returned');
        }

        const user = {
          id: userData._id || userData.id,
          name: `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || userData.email,
          email: userData.email,
          profileImage: userData.profileImage || null,
          phone: userData.phone,
          address: userData.address,
          role: userData.role || 'customer',
        };

        login({ user, userType: user.role });
        const destination = redirect && redirect.startsWith('/') ? redirect : '/';
        router.replace(destination);
      } catch (err) {
        setError(err.message || 'Google login failed.');
      }
    };

    loadProfile();
  }, [searchParams, login, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-10 text-center">
        {!error ? (
          <>
            <h1 className="text-2xl font-semibold text-slate-900 mb-2">
              Signing you in...
            </h1>
            <p className="text-slate-500 text-sm">Please wait while we finish Google login.</p>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-semibold text-slate-900 mb-2">
              Google login failed
            </h1>
            <p className="text-slate-500 text-sm mb-4">{error}</p>
            <a
              href="/Login?type=user"
              className="text-teal-700 hover:text-teal-800 underline text-sm"
            >
              Back to login
            </a>
          </>
        )}
      </div>
    </div>
  );
}
