'use client';

import React, { useState } from 'react';
import { useUpdateProviderCapacityMutation } from '@/redux/api/servicesApi';

export default function BundleSetup() {
  const [persons, setPersons] = useState('');
  const [updateCapacity, { isLoading }] = useUpdateProviderCapacityMutation();
  const [message, setMessage] = useState(null);

  const handleSave = async () => {
    setMessage(null);
    const parsed = Number(persons);
    if (!Number.isInteger(parsed) || parsed < 1 || parsed > 10) {
      setMessage('Please enter a whole number between 1 and 10.');
      return;
    }

    try {
      await updateCapacity({ maxBundleCapacity: parsed }).unwrap();
      setMessage('Capacity updated successfully.');
    } catch (err) {
      setMessage(err?.data?.message || 'Failed to update capacity');
    }
  };

  return (
    <div className="flex-1 p-4 sm:p-6 md:p-8 lg:p-10 overflow-y-auto">
      <div className="max-w-3xl">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6 sm:mb-8 md:mb-10">
          Bundle setup
        </h1>

        <div className="space-y-4 sm:space-y-6">
          <div>
            <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
              Persons
            </label>
            <input
              type="number"
              value={persons}
              onChange={(e) => setPersons(e.target.value)}
              className="w-full sm:w-64 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none text-sm sm:text-base"
              placeholder="Enter number of persons"
              min={1}
              max={10}
            />
            {message && (
              <p className="mt-2 text-sm text-gray-600">{message}</p>
            )}
          </div>

          <div className="pt-4 sm:pt-6">
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium text-sm sm:text-base disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
