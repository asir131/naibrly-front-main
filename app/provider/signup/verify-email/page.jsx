'use client';

import { useEffect, useRef, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  useVerifyEmailVerificationOtpMutation,
  useResendEmailVerificationOtpMutation,
} from '@/redux/api/servicesApi';
import useAuth from '@/hooks/useAuth';

function VerifyProviderEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const { login } = useAuth();

  const [code, setCode] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [countdown, setCountdown] = useState(60);
  const inputRefs = useRef([]);

  const [verifyEmailOtp, { isLoading }] =
    useVerifyEmailVerificationOtpMutation();
  const [resendEmailOtp, { isLoading: isResending }] =
    useResendEmailVerificationOtpMutation();

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = (index, value) => {
    if (value && !/^\d$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setError('');

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, event) => {
    if (event.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (event) => {
    event.preventDefault();
    const pastedData = event.clipboardData.getData('text').slice(0, 4);
    const newCode = pastedData.split('').slice(0, 4);

    while (newCode.length < 4) {
      newCode.push('');
    }

    setCode(newCode);

    const lastFilledIndex = newCode.findIndex((digit) => !digit);
    const focusIndex = lastFilledIndex === -1 ? 3 : lastFilledIndex;
    inputRefs.current[focusIndex]?.focus();
  };

  const handleResend = async () => {
    setError('');
    setSuccess('');

    if (!email) {
      setError('Email is missing. Please return to signup.');
      return;
    }

    try {
      await resendEmailOtp({ email }).unwrap();
      setSuccess('OTP resent successfully!');
      setCountdown(60);
      setCode(['', '', '', '']);
      inputRefs.current[0]?.focus();

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Resend OTP error:', err);
      setError(
        err?.data?.message ||
          err?.message ||
          'Failed to resend OTP. Please try again.',
      );
    }
  };

  const handleConfirm = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!email) {
      setError('Email is missing. Please return to signup.');
      return;
    }

    const fullCode = code.join('');
    if (fullCode.length !== 4) return;

    try {
      await verifyEmailOtp({ email, otp: fullCode }).unwrap();
      setSuccess('Email verified successfully!');

      if (typeof window !== 'undefined') {
        const pendingRaw = sessionStorage.getItem('pendingProviderSignup');
        if (!pendingRaw) {
          setTimeout(() => router.push('/provider/signup/user_info'), 1000);
          return;
        }

        const pending = JSON.parse(pendingRaw);
        if (pending?.token) {
          localStorage.setItem('authToken', pending.token);
        }

        if (pending?.userType) {
          localStorage.setItem('userType', pending.userType);
        }

        if (pending?.user) {
          localStorage.setItem('user', JSON.stringify(pending.user));
          login({ user: pending.user, userType: pending.userType || 'provider' });
        }

        sessionStorage.removeItem('pendingProviderSignup');

        const redirect = pending?.redirect || '/provider/signup/verify_info';
        setTimeout(() => router.push(redirect), 1000);
      }
    } catch (err) {
      console.error('Verify OTP error:', err);
      setError(
        err?.data?.message ||
          err?.message ||
          'Invalid OTP. Please try again.',
      );
    }
  };

  const isCodeComplete = code.every((digit) => digit !== '');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-10">
        <button
          onClick={() => router.back()}
          className="mb-6 p-2 hover:bg-slate-100 rounded-lg transition-colors inline-flex items-center"
        >
          <ArrowLeft className="w-5 h-5 text-slate-700" />
        </button>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Verify Your Email
          </h1>
          <p className="text-sm text-slate-500">
            Enter the 4-digit code we sent to{' '}
            <span className="font-medium text-slate-700">
              {email || 'your email'}
            </span>
          </p>
        </div>

        <form onSubmit={handleConfirm} className="space-y-6">
          <div className="flex justify-center gap-3 mb-4">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="w-14 h-14 text-center text-2xl font-semibold border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-slate-50 text-slate-900"
              />
            ))}
          </div>

          {success && (
            <div className="text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg p-3 text-center">
              {success}
            </div>
          )}

          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3 text-center">
              {error}
            </div>
          )}

          <div className="text-center text-sm">
            <span className="text-slate-500">
              Don't receive the OTP{' '}
              <span className="text-red-500">
                {Math.floor(countdown / 60)}:
                {String(countdown % 60).padStart(2, '0')}s
              </span>
            </span>
            {countdown === 0 ? (
              <>
                <span className="mx-2 text-slate-300">|</span>
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={isResending}
                  className="text-teal-600 hover:text-teal-700 font-medium disabled:opacity-50"
                >
                  {isResending ? 'Resending...' : 'Resend?'}
                </button>
              </>
            ) : (
              <span className="mx-2 text-slate-300">|</span>
            )}
            {countdown > 0 && <span className="text-slate-400">Resend?</span>}
          </div>

          <Button
            type="submit"
            disabled={!isCodeComplete || isLoading}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg font-medium text-base disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Verifying...' : 'Confirm'}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default function VerifyProviderEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-10">
            <div className="text-center text-slate-600">Loading...</div>
          </div>
        </div>
      }
    >
      <VerifyProviderEmailContent />
    </Suspense>
  );
}
