'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  useGetUserProfileQuery,
  useGetProviderServicesListQuery,
  useAddProviderServiceMutation,
  useDeleteProviderServiceMutation,
  useGetServicesQuery,
} from '@/redux/api/servicesApi';

const Services = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedServices, setSelectedServices] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);
  useGetUserProfileQuery(); // keep data fresh; id not needed for self-services
  const { data: servicesData, refetch, isLoading } = useGetProviderServicesListQuery();
  const [addService, { isLoading: isAdding }] = useAddProviderServiceMutation();
  const [deleteService, { isLoading: isDeleting }] = useDeleteProviderServiceMutation();
  const { data: allServicesData } = useGetServicesQuery();

  // Available options (from API, fallback static)
  const availableServices = useMemo(() => {
    const svcList = allServicesData?.services || allServicesData?.data?.services;
    if (Array.isArray(svcList) && svcList.length) {
      return Array.from(new Set(svcList.map((s) => s.name))).sort();
    }
    return [
      'Window Washing',
      'Plumbing',
      'Locksmiths',
      'Appliance Repairs',
      'Electrical',
      'HVAC',
      'Carpentry',
      'Painting',
      'Landscaping',
      'Cleaning'
    ];
  }, [allServicesData]);

  const currentServices = useMemo(() => servicesData?.services || [], [servicesData]);

  useEffect(() => {
    if (currentServices.length) {
      setSelectedServices(currentServices.map((s) => s.name));
    }
  }, [currentServices]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleEdit = () => {
    setSelectedServices(currentServices.map((s) => s.name));
    setIsEditing(true);
  };

  const handleCancel = () => {
    setSelectedServices(currentServices.map((s) => s.name));
    setIsEditing(false);
  };

  const handleSave = async () => {
    const currentNames = currentServices.map((s) => s.name);
    const toAdd = selectedServices.filter((name) => !currentNames.includes(name));
    const toRemove = currentServices.filter((s) => !selectedServices.includes(s.name));

    try {
      // Add new services
      for (const name of toAdd) {
        await addService({ serviceName: name }).unwrap();
      }
      // Delete removed services
      for (const svc of toRemove) {
        await deleteService(svc.name).unwrap();
      }
      await refetch();
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update services:', err);
    }
  };

  const handleServiceToggle = (service) => {
    if (selectedServices.includes(service)) {
      setSelectedServices(selectedServices.filter(s => s !== service));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const filteredOptions = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return availableServices.filter((s) => s.toLowerCase().includes(term));
  }, [availableServices, searchTerm]);

  return (
    <div className="flex-1 p-8">
      {!isEditing ? (
        <>
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Services</h1>
            <button
              onClick={handleEdit}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              disabled={isLoading}
            >
              Edit
            </button>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-medium text-gray-700">My Services</h2>
            <div className="grid grid-cols-2 gap-x-8 gap-y-2">
              {currentServices.map((service, index) => (
                <div key={index} className="text-gray-600">
                  {index + 1}. {service.name}
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Update Account</h1>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Services Provided
            </label>

            <div className="border border-gray-300 rounded-md p-4">
              <div className="text-sm text-gray-600 mb-2">Select services</div>
              <div className="flex flex-wrap gap-2 mb-3">
                {selectedServices.map((service) => (
                  <span
                    key={service}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-teal-50 text-teal-800 border border-teal-200"
                  >
                    <span>{service}</span>
                    <button
                      type="button"
                      className="text-teal-700 hover:text-teal-900"
                      onClick={() => handleServiceToggle(service)}
                      aria-label={`Remove ${service}`}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="w-full flex justify-between items-center border border-gray-300 rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:border-teal-500 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                >
                  <span>
                    {selectedServices.length > 0
                      ? `${selectedServices.length} service${selectedServices.length > 1 ? 's' : ''} selected`
                      : 'Choose services'}
                  </span>
                  <svg
                    className={`w-4 h-4 text-gray-500 transition-transform ${showDropdown ? 'rotate-180' : ''}`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                {showDropdown && (
                  <div className="absolute z-20 mt-2 w-full max-h-64 overflow-y-auto rounded-md border border-gray-200 bg-white shadow-lg">
                    <div className="p-2">
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search services..."
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
                      />
                    </div>
                    <div className="max-h-48 overflow-y-auto">
                      {filteredOptions.map((service) => (
                        <label
                          key={service}
                          className="flex items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                        >
                          <span>{service}</span>
                          <input
                            type="checkbox"
                            checked={selectedServices.includes(service)}
                            onChange={() => handleServiceToggle(service)}
                            className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                          />
                        </label>
                      ))}
                      {filteredOptions.length === 0 && (
                        <div className="px-3 py-2 text-sm text-gray-500">No services found</div>
                      )}
                    </div>
                  </div>
                )}
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
                disabled={isAdding || isDeleting}
              >
                {(isAdding || isDeleting) ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Services;
