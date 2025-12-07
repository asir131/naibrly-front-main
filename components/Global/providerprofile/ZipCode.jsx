'use client';

import React, { useState } from 'react';
import Image from 'next/image';

const ZipCode = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [zipCodes, setZipCodes] = useState(['156256', '156256']);
  const [selectedZipCodes, setSelectedZipCodes] = useState([...zipCodes]);
  const [searchZip, setSearchZip] = useState('');

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setSelectedZipCodes([...zipCodes]);
    setIsEditing(false);
  };

  const handleSave = () => {
    setZipCodes([...selectedZipCodes]);
    setIsEditing(false);
  };

  const handleAddZip = () => {
    const val = searchZip.trim();
    if (!val) return;
    if (!selectedZipCodes.includes(val)) {
      setSelectedZipCodes(prev => [...prev, val]);
    }
    setSearchZip('');
  };

  const handleRemoveZip = (zip) => {
    setSelectedZipCodes(prev => prev.filter(z => z !== zip));
  };

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
            <h2 className="text-lg font-medium text-gray-700">My Service Area (Zip code)</h2>
            <div className="grid grid-cols-2 gap-x-8 gap-y-2">
              {zipCodes.map((zip, index) => (
                <div key={index} className="text-gray-600">
                  {index + 1}. {zip}
                </div>
              ))}
            </div>
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
              <div className="text-sm text-gray-600 mb-3">select your zip code</div>

              <input
                type="text"
                placeholder="Search zip code..."
                value={searchZip}
                onChange={(e) => setSearchZip(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddZip();
                  }
                }}
                className="w-full border border-gray-200 rounded-md px-3 py-2 pr-10 text-sm text-gray-700 focus:outline-none"
              />

              <div className="flex flex-wrap gap-2 mt-3 mb-4">
                {selectedZipCodes.map((zip, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm bg-teal-100 text-teal-800"
                  >
                    • {zip}
                    <button
                      type="button"
                      className="text-teal-700 hover:text-teal-900"
                      onClick={() => handleRemoveZip(zip)}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              {/* Map placeholder */}
              <div className="relative w-full h-64 bg-gray-200 rounded-md overflow-hidden">
                <img
                  src="/usersImg/map_img.png"
                  alt="Service area map"
                  className="w-full h-full object-cover"
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
                className="px-6 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ZipCode;
