'use client';

import React, { useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useUpdatePasswordMutation } from '@/redux/api/servicesApi';

const passwordRules = {
  minLength: 6,
  hasLowercase: /[a-z]/,
  hasUppercase: /[A-Z]/,
  hasSpecial: /[^A-Za-z0-9]/,
};

const getValidation = (password) => ({
  minLength: password.length >= passwordRules.minLength,
  hasLowercase: passwordRules.hasLowercase.test(password),
  hasUppercase: passwordRules.hasUppercase.test(password),
  hasSpecial: passwordRules.hasSpecial.test(password),
});

export default function ChangePassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [updatePassword, { isLoading }] = useUpdatePasswordMutation();

  const validation = useMemo(() => getValidation(newPassword), [newPassword]);
  const isValid =
    validation.minLength &&
    validation.hasLowercase &&
    validation.hasUppercase &&
    validation.hasSpecial;
  const passwordsMatch = newPassword === confirmPassword;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitted(true);

    if (!currentPassword || !isValid || !passwordsMatch) return;

    try {
      await updatePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      }).unwrap();

      toast.success('Password updated successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setSubmitted(false);
    } catch (error) {
      toast.error(
        error?.data?.message ||
          error?.message ||
          'Failed to update password.',
      );
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl">
        <h2 className="text-xl font-semibold text-gray-900">Change Password</h2>
        <p className="text-sm text-gray-600 mt-1">
          Update your password to keep your account secure.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200"
              placeholder="Enter current password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200"
              placeholder="Enter new password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200"
              placeholder="Re-enter new password"
            />
          </div>

          <div className="rounded-lg border border-teal-100 bg-teal-50 px-4 py-3 text-sm text-teal-900">
            [please use minimum 6 characters + 1 letter + capital letter + 1 special character]
          </div>

          {submitted && !isValid && (
            <p className="text-sm text-red-600">
              Please meet all password requirements before continuing.
            </p>
          )}
          {submitted && !currentPassword && (
            <p className="text-sm text-red-600">
              Current password is required.
            </p>
          )}
          {submitted && !passwordsMatch && (
            <p className="text-sm text-red-600">Passwords do not match.</p>
          )}

          <button
            type="submit"
            disabled={!currentPassword || !isValid || !passwordsMatch || isLoading}
            className="inline-flex items-center justify-center rounded-lg bg-teal-600 px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-teal-300"
          >
            {isLoading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
