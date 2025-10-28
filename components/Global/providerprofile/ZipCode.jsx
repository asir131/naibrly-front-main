'use client';

import React, { useState } from 'react';
import Image from 'next/image';

const ZipCode = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [zipCodes, setZipCodes] = useState(['42574', '78577', '12473']);
  const [selectedZipCodes, setSelectedZipCodes] = useState([...zipCodes]);
  const [searchZip, setSearchZip] = useState('');

  // Mock available zip codes for the map
  const availableZipCodes = ['158258', '158258', '42574', '78577', '12473'];

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

  const handleZipToggle = (zip) => {
    if (selectedZipCodes.includes(zip)) {
      setSelectedZipCodes(selectedZipCodes.filter(z => z !== zip));
    } else {
      setSelectedZipCodes([...selectedZipCodes, zip]);
    }
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
                className="absolute top-4 right-4 w-8 h-8 text-gray-400 border-0 focus:outline-none"
              />

              <div className="flex flex-wrap gap-2 mb-4">
                {selectedZipCodes.map((zip, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-md text-sm bg-teal-100 text-teal-800"
                  >
                    × {zip}
                  </span>
                ))}
              </div>

              {/* Map placeholder */}
              <div className="relative w-full h-64 bg-gray-200 rounded-md overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  {/* You can replace this with an actual map component */}
                  <div className="w-full h-full bg-gradient-to-br from-green-200 via-green-300 to-green-400 relative">
                    {/* Mock map regions */}
                    <div className="absolute top-8 left-12 text-white text-sm font-medium">Edmonds</div>
                    <div className="absolute top-24 left-8 text-white text-sm font-medium">Shoreline</div>
                    <div className="absolute top-24 right-12 text-purple-600 text-sm font-medium">Bothel</div>
                    <div className="absolute bottom-20 left-16 text-white text-sm font-medium">Kirkland</div>
                    <div className="absolute bottom-12 right-12 text-purple-600 text-sm font-medium">Redmond</div>
                    <div className="absolute top-1/2 right-4 text-gray-400 text-sm">Cotta</div>
                    <div className="absolute top-12 right-8 text-gray-400 text-sm">Maltby</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <div className="text-sm text-gray-600 mb-3">Select Zip Codes:</div>
              <div className="grid grid-cols-3 gap-2">
                {availableZipCodes.map((zip, index) => (
                  <label key={index} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedZipCodes.includes(zip)}
                      onChange={() => handleZipToggle(zip)}
                      className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                    />
                    <span className="text-sm text-gray-700">{zip}</span>
                  </label>
                ))}
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
