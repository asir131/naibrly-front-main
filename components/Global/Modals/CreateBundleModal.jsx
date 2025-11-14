'use client';

import { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { useGetServicesQuery } from '@/redux/api/servicesApi';

export default function CreateBundleModal({ isOpen, onClose, onPublish }) {
  const [selectedMainCategory, setSelectedMainCategory] = useState('');
  const [selectedCategoryType, setSelectedCategoryType] = useState(''); // Renamed from subCategory
  const [selectedService, setSelectedService] = useState('');
  const [serviceDate, setServiceDate] = useState('');
  const [fromTime, setFromTime] = useState('');
  const [toTime, setToTime] = useState('');

  const [showMainCategoryDropdown, setShowMainCategoryDropdown] = useState(false);
  const [showCategoryTypeDropdown, setShowCategoryTypeDropdown] = useState(false); // Renamed from subCategory
  const [showServiceDropdown, setShowServiceDropdown] = useState(false);

  // Fetch data using Redux Toolkit Query
  const { data, isLoading, isError, error } = useGetServicesQuery();

  const organizedData = data?.organized || {};
  const mainCategories = Object.values(organizedData);

  // Refs for click outside detection
  const mainCategoryRef = useRef(null);
  const categoryTypeRef = useRef(null); // Renamed from subCategoryRef
  const serviceRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mainCategoryRef.current && !mainCategoryRef.current.contains(event.target)) {
        setShowMainCategoryDropdown(false);
      }
      if (categoryTypeRef.current && !categoryTypeRef.current.contains(event.target)) {
        setShowCategoryTypeDropdown(false);
      }
      if (serviceRef.current && !serviceRef.current.contains(event.target)) {
        setShowServiceDropdown(false);
      }
    };

    if (showMainCategoryDropdown || showCategoryTypeDropdown || showServiceDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showMainCategoryDropdown, showCategoryTypeDropdown, showServiceDropdown]);

  // Reset sub-category and service when main category changes
  useEffect(() => {
    setSelectedCategoryType('');
    setSelectedService('');
  }, [selectedMainCategory]);

  // Reset service when sub-category changes
  useEffect(() => {
    setSelectedService('');
  }, [selectedCategoryType]);

  const handlePublish = () => {
    const bundleData = {
      mainCategory: selectedMainCategory,
      categoryType: selectedCategoryType, // Renamed from subCategory
      service: selectedService,
      date: serviceDate,
      fromTime,
      toTime
    };
    onPublish(bundleData);
  };

  if (isLoading) return <Dialog open={isOpen} onOpenChange={onClose}><DialogContent className="sm:max-w-md bg-white rounded-3xl p-8"><p>Loading categories...</p></DialogContent></Dialog>;
  if (isError) return <Dialog open={isOpen} onOpenChange={onClose}><DialogContent className="sm:max-w-md bg-white rounded-3xl p-8"><p>Error: {error.message || 'Failed to load categories'}</p></DialogContent></Dialog>;

  const currentMainCategory = organizedData[selectedMainCategory];
  const currentCategoryTypes = currentMainCategory ? Object.values(currentMainCategory.categoryTypes) : [];
  const currentServices = currentMainCategory && currentMainCategory.categoryTypes[selectedCategoryType]
    ? currentMainCategory.categoryTypes[selectedCategoryType].services
    : [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white rounded-3xl p-8">
        <DialogTitle className="text-center text-2xl font-bold text-gray-900 mb-2">
          Create Bundle
        </DialogTitle>

        <p className="text-center text-gray-600 mb-6">
          Bundle Target: 3 Users (within 10 miles)
        </p>

        <div className="space-y-6">
          {/* Select Category */}
          <div>
            <label className="text-sm font-semibold text-gray-900 mb-3 block">
              Select Category*
            </label>
            <div className="grid grid-cols-2 gap-3">
              {/* Main Category Dropdown */}
              <div className="relative" ref={mainCategoryRef}>
                <button
                  type="button"
                  onClick={() => {
                    setShowMainCategoryDropdown(!showMainCategoryDropdown);
                    setShowCategoryTypeDropdown(false);
                    setShowServiceDropdown(false);
                  }}
                  className="w-full px-4 py-3 bg-gray-100 rounded-lg text-left text-sm text-gray-900 flex items-center justify-between hover:bg-gray-200 transition-colors"
                >
                  <span className="truncate">{selectedMainCategory || 'Select Main Category'}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-600 shrink-0 ml-2 transition-transform ${showMainCategoryDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showMainCategoryDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                    {mainCategories.map((category) => (
                      <button
                        type="button"
                        key={category.name}
                        onClick={() => {
                          setSelectedMainCategory(category.name);
                          setShowMainCategoryDropdown(false);
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 text-sm text-gray-900 transition-colors first:rounded-t-lg last:rounded-b-lg"
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Category Type Dropdown */}
              <div className="relative" ref={categoryTypeRef}>
                <button
                  type="button"
                  onClick={() => {
                    if (selectedMainCategory) {
                      setShowCategoryTypeDropdown(!showCategoryTypeDropdown);
                      setShowMainCategoryDropdown(false);
                      setShowServiceDropdown(false);
                    }
                  }}
                  disabled={!selectedMainCategory}
                  className={`w-full px-4 py-3 bg-gray-100 rounded-lg text-left text-sm text-gray-900 flex items-center justify-between transition-colors ${
                    selectedMainCategory ? 'hover:bg-gray-200 cursor-pointer' : 'opacity-50 cursor-not-allowed'
                  }`}
                >
                  <span className="truncate">{selectedCategoryType || 'Select Category Type'}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-600 shrink-0 ml-2 transition-transform ${showCategoryTypeDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showCategoryTypeDropdown && selectedMainCategory && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                    {currentCategoryTypes.map((catType) => (
                      <button
                        type="button"
                        key={catType.name}
                        onClick={() => {
                          setSelectedCategoryType(catType.name);
                          setShowCategoryTypeDropdown(false);
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 text-sm text-gray-900 transition-colors first:rounded-t-lg last:rounded-b-lg"
                      >
                        {catType.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Select Service */}
          <div className="relative" ref={serviceRef}>
            <label className="text-sm font-semibold text-gray-900 mb-3 block">
              Select Service*
            </label>
            <button
              type="button"
              onClick={() => {
                if (selectedCategoryType) {
                  setShowServiceDropdown(!showServiceDropdown);
                  setShowMainCategoryDropdown(false);
                  setShowCategoryTypeDropdown(false);
                }
              }}
              disabled={!selectedCategoryType}
              className={`w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-left text-sm flex items-center justify-between transition-colors ${
                selectedCategoryType ? 'hover:border-gray-400 cursor-pointer' : 'opacity-50 cursor-not-allowed'
              }`}
            >
              <span className={`truncate ${selectedService ? 'text-gray-900' : 'text-gray-400'}`}>
                {selectedService || 'Select one'}
              </span>
              <ChevronDown className={`w-4 h-4 text-gray-600 shrink-0 ml-2 transition-transform ${showServiceDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showServiceDropdown && selectedCategoryType && currentServices.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                {currentServices.map((service) => (
                  <button
                    type="button"
                    key={service.id}
                    onClick={() => {
                      setSelectedService(service.name);
                      setShowServiceDropdown(false);
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 text-sm text-gray-900 transition-colors first:rounded-t-lg last:rounded-b-lg"
                  >
                    {service.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Service Date */}
          <div>
            <label className="text-sm font-semibold text-gray-900 mb-3 block">
              Service Date*
            </label>
            <input
              type="date"
              value={serviceDate}
              onChange={(e) => setServiceDate(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          {/* Time Range */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-semibold text-gray-900 mb-3 block">
                From*
              </label>
              <input
                type="time"
                value={fromTime}
                onChange={(e) => setFromTime(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-900 mb-3 block">
                To Time*
              </label>
              <input
                type="time"
                value={toTime}
                onChange={(e) => setToTime(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Publish Button */}
          <Button
            onClick={handlePublish}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white h-12 rounded-lg font-semibold text-base"
          >
            Publish
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
