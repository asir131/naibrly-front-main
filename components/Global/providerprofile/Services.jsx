'use client';

import React, { useState, useEffect, useMemo } from 'react';
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
              <div className="flex flex-wrap gap-2">
                {selectedServices.map((service, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm"
                    style={{
                      backgroundColor: index === 0 ? '#FED7AA' : index === 1 ? '#FEF3C7' : '#FEE2E2',
                      color: '#000'
                    }}
                  >
                    <span>{service}</span>
                    <button
                      type="button"
                      className="text-gray-700 hover:text-gray-900"
                      onClick={() => handleServiceToggle(service)}
                      aria-label={`Remove ${service}`}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <div className="text-sm text-gray-600 mb-3">Available Services:</div>
              <div className="grid grid-cols-2 gap-2">
                {availableServices.map((service) => (
                  <label key={service} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedServices.includes(service)}
                      onChange={() => handleServiceToggle(service)}
                      className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                    />
                    <span className="text-sm text-gray-700">{service}</span>
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
