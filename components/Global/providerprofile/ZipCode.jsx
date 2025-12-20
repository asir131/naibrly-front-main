'use client';

import React, { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { RiSearch2Line } from 'react-icons/ri';
import { toast } from 'react-hot-toast';
import {
  useGetProviderZipQuery,
  useRemoveProviderZipCodeMutation,
  useUpdateProviderZipCodeMutation,
} from '@/redux/api/servicesApi';

const ZipCodeMap = dynamic(() => import('@/components/Global/ZipCodeMap'), {
  ssr: false,
  loading: () => (
    <div className="bg-gray-100 rounded-lg h-[300px] flex items-center justify-center">
      <div className="text-gray-500">Loading map...</div>
    </div>
  ),
});

const ZipCode = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [zipCodes, setZipCodes] = useState([]);
  const [selectedZipCodes, setSelectedZipCodes] = useState([]);
  const [searchZip, setSearchZip] = useState('');
  const [zipError, setZipError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const { data, isLoading, isError, error, refetch } = useGetProviderZipQuery();
  const [updateProviderZipCode] = useUpdateProviderZipCodeMutation();
  const [removeProviderZipCode] = useRemoveProviderZipCodeMutation();

  const serviceAreas = useMemo(
    () => data?.provider?.serviceAreas || [],
    [data]
  );

  useEffect(() => {
    const areaZips = serviceAreas.map((area) => area.zipCode).filter(Boolean);
    setZipCodes(areaZips);
    if (!isEditing) {
      setSelectedZipCodes(areaZips);
    }
  }, [serviceAreas, isEditing]);

  const handleEdit = () => {
    setSelectedZipCodes([...zipCodes]);
    setZipError('');
    setIsEditing(true);
  };

  const handleCancel = () => {
    setSelectedZipCodes([...zipCodes]);
    setSearchZip('');
    setZipError('');
    setIsEditing(false);
  };

  const handleAddZip = () => {
    const val = searchZip.trim();
    if (!val) return;
    if (!/^\d{5}$/.test(val)) {
      setZipError('Please enter a valid 5-digit zip code');
      return;
    }
    setZipError('');
    if (!selectedZipCodes.includes(val)) {
      setSelectedZipCodes((prev) => [...prev, val]);
    }
    setSearchZip('');
  };

  const handleRemoveZip = (zip) => {
    setSelectedZipCodes((prev) => prev.filter((z) => z !== zip));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setZipError('');

    try {
      const toAdd = selectedZipCodes.filter((zip) => !zipCodes.includes(zip));
      const toRemove = zipCodes.filter((zip) => !selectedZipCodes.includes(zip));

      const requests = [
        ...toAdd.map((zip) => updateProviderZipCode({ zipCode: zip }).unwrap()),
        ...toRemove.map((zip) =>
          removeProviderZipCode({ zipCode: zip }).unwrap()
        ),
      ];

      if (requests.length > 0) {
        await Promise.all(requests);
      }

      setZipCodes([...selectedZipCodes]);
      setIsEditing(false);
      toast.success('Service areas updated successfully!');
    } catch (err) {
      console.error('Zip code update error:', err);
      toast.error(
        err?.data?.message ||
          err?.message ||
          'Failed to update service areas. Please try again.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 p-8">
        <p className="text-gray-600">Loading service areas...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex-1 p-8">
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center justify-between">
          <span>{error?.data?.message || 'Failed to load service areas.'}</span>
          <button
            onClick={() => refetch()}
            className="px-3 py-1 rounded-md bg-white border border-red-200 text-red-700 hover:bg-red-100 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8">
      {!isEditing ? (
        <>
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Zip code</h1>
            <button
              onClick={handleEdit}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Edit
            </button>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-medium text-gray-700">
              My Service Area (Zip code)
            </h2>
            {zipCodes.length === 0 ? (
              <p className="text-gray-500">No service areas added yet.</p>
            ) : (
              <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                {zipCodes.map((zip, index) => (
                  <div key={zip} className="text-gray-600">
                    {index + 1}. {zip}
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Edit Zip code</h1>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              zip codes
            </label>

            <div className="relative border border-gray-300 rounded-md p-4">
              <div className="text-sm text-gray-600 mb-3">
                select your zip code
              </div>

              <div className="relative">
                <RiSearch2Line className="absolute left-4 top-3 text-gray-400 text-xl" />
                <input
                  type="text"
                  placeholder="Enter zip code (e.g., 10001)"
                  value={searchZip}
                  onChange={(e) => setSearchZip(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddZip();
                    }
                  }}
                  maxLength="5"
                  className="w-full border border-gray-200 rounded-md px-3 py-2 pl-12 pr-20 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <button
                  type="button"
                  onClick={handleAddZip}
                  className="absolute right-2 top-2 bg-[#1C5941] text-white px-3 py-1 rounded-md hover:bg-[#154432] transition-colors text-sm font-medium"
                >
                  Add
                </button>
              </div>

              {zipError && (
                <p className="text-xs text-red-500 mt-2">{zipError}</p>
              )}

              {selectedZipCodes.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3 mb-4">
                  {selectedZipCodes.map((zip) => (
                    <span
                      key={zip}
                      className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm bg-teal-100 text-teal-800"
                    >
                      {zip}
                      <button
                        type="button"
                        className="text-teal-700 hover:text-teal-900"
                        onClick={() => handleRemoveZip(zip)}
                      >
                        x
                      </button>
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-4">
                <ZipCodeMap
                  zipCode={searchZip}
                  zipCodes={selectedZipCodes}
                  height="300px"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleCancel}
                className="px-6 py-2 border border-teal-600 text-teal-600 rounded-md hover:bg-teal-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors disabled:opacity-60"
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ZipCode;
