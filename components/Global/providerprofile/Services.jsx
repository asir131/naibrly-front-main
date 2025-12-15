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
  const [selectedService, setSelectedService] = useState('');
  const [selectedRate, setSelectedRate] = useState('');
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
    if (currentServices.length === 0) {
      setSelectedService('');
      setSelectedRate('');
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
    setSelectedService('');
    setSelectedRate('');
    setIsEditing(true);
  };

  const handleCancel = () => {
    setSelectedService('');
    setSelectedRate('');
    setIsEditing(false);
  };

  const handleAddService = async () => {
    if (!selectedService) return;
    const hourlyRate = selectedRate === '' ? undefined : Number(selectedRate);
    try {
      await addService({ serviceName: selectedService, hourlyRate }).unwrap();
      await refetch();
      setSelectedService('');
      setSelectedRate('');
      setShowDropdown(false);
      setSearchTerm('');
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to add service:', err);
    }
  };

  const handleRateInputChange = (value) => {
    const sanitized = value === '' ? '' : value.replace(/[^0-9.]/g, '');
    setSelectedRate(sanitized);
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
                  {service.hourlyRate ? ` - $${service.hourlyRate}/hr` : ''}
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
              <div className="text-sm text-gray-600 mb-2">Select a service</div>
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="w-full flex justify-between items-center border border-gray-300 rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:border-teal-500 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                >
                  <span>
                    {selectedService || 'Choose a service'}
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
                            type="radio"
                            name="serviceOption"
                            checked={selectedService === service}
                            onChange={() => {
                              setSelectedService(service);
                              const existing = currentServices.find((s) => s.name === service);
                              setSelectedRate(existing?.hourlyRate ?? '');
                            }}
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

              <div className="mt-4">
                <div className="text-sm font-medium text-gray-700 mb-2">Hourly rate (USD)</div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">$</span>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={selectedRate}
                    onChange={(e) => handleRateInputChange(e.target.value)}
                    className="w-32 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                    placeholder="0"
                  />
                  <span className="text-xs text-gray-500">/hr</span>
                </div>
              </div>

              <div className="mt-6">
                <div className="text-sm font-medium text-gray-700 mb-2">Current services</div>
                <div className="divide-y divide-gray-100 border border-gray-200 rounded-md">
                  {currentServices.length === 0 && (
                    <div className="px-3 py-2 text-sm text-gray-500">No services added yet</div>
                  )}
                  {currentServices.map((svc) => (
                    <div key={svc.name} className="flex items-center justify-between px-3 py-2 text-sm">
                      <div className="text-gray-700">
                        {svc.name} {svc.hourlyRate ? `- $${svc.hourlyRate}/hr` : ''}
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          deleteService(svc.name)
                            .unwrap()
                            .then(() => refetch())
                            .catch((err) => console.error('Failed to delete service:', err))
                        }
                        className="text-red-600 hover:text-red-700 text-xs"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
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
                onClick={handleAddService}
                className="px-6 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors disabled:opacity-60"
                disabled={isAdding || !selectedService}
              >
                {isAdding ? 'Saving...' : 'Save service'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Services;
