'use client';

import { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

export default function CreateBundleModal({ isOpen, onClose, onPublish }) {
  const [selectedMainCategory, setSelectedMainCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [serviceDate, setServiceDate] = useState('');
  const [fromTime, setFromTime] = useState('');
  const [toTime, setToTime] = useState('');

  const [showMainCategoryDropdown, setShowMainCategoryDropdown] = useState(false);
  const [showSubCategoryDropdown, setShowSubCategoryDropdown] = useState(false);
  const [showServiceDropdown, setShowServiceDropdown] = useState(false);

  // Refs for click outside detection
  const mainCategoryRef = useRef(null);
  const subCategoryRef = useRef(null);
  const serviceRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mainCategoryRef.current && !mainCategoryRef.current.contains(event.target)) {
        setShowMainCategoryDropdown(false);
      }
      if (subCategoryRef.current && !subCategoryRef.current.contains(event.target)) {
        setShowSubCategoryDropdown(false);
      }
      if (serviceRef.current && !serviceRef.current.contains(event.target)) {
        setShowServiceDropdown(false);
      }
    };

    if (showMainCategoryDropdown || showSubCategoryDropdown || showServiceDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showMainCategoryDropdown, showSubCategoryDropdown, showServiceDropdown]);

  // Sample categories data
  const mainCategories = [
    { id: 1, name: 'Interior' },
    { id: 2, name: 'Exterior' },
    { id: 3, name: 'Repair & Maintenance' }
  ];

  const subCategories = {
    'Interior': ['Cleaning', 'Painting', 'Flooring'],
    'Exterior': ['Door & window washing', 'Lawn Care', 'Pressure Washing'],
    'Repair & Maintenance': ['Plumbing', 'Electrical', 'HVAC']
  };

  const services = {
    'Door & window washing': ['Window Washing', 'Door Cleaning', 'Frame Cleaning'],
    'Cleaning': ['Deep Cleaning', 'Regular Cleaning', 'Move-out Cleaning'],
    'Painting': ['Interior Painting', 'Exterior Painting', 'Touch-up']
  };

  const handlePublish = () => {
    const bundleData = {
      mainCategory: selectedMainCategory,
      subCategory: selectedSubCategory,
      service: selectedService,
      date: serviceDate,
      fromTime,
      toTime
    };
    onPublish(bundleData);
  };

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
                    setShowSubCategoryDropdown(false);
                    setShowServiceDropdown(false);
                  }}
                  className="w-full px-4 py-3 bg-gray-100 rounded-lg text-left text-sm text-gray-900 flex items-center justify-between hover:bg-gray-200 transition-colors"
                >
                  <span className="truncate">{selectedMainCategory || 'Interior'}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-600 shrink-0 ml-2 transition-transform ${showMainCategoryDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showMainCategoryDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                    {mainCategories.map((category) => (
                      <button
                        type="button"
                        key={category.id}
                        onClick={() => {
                          setSelectedMainCategory(category.name);
                          setSelectedSubCategory('');
                          setSelectedService('');
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

              {/* Sub Category Dropdown */}
              <div className="relative" ref={subCategoryRef}>
                <button
                  type="button"
                  onClick={() => {
                    if (selectedMainCategory) {
                      setShowSubCategoryDropdown(!showSubCategoryDropdown);
                      setShowMainCategoryDropdown(false);
                      setShowServiceDropdown(false);
                    }
                  }}
                  disabled={!selectedMainCategory}
                  className={`w-full px-4 py-3 bg-gray-100 rounded-lg text-left text-sm text-gray-900 flex items-center justify-between transition-colors ${
                    selectedMainCategory ? 'hover:bg-gray-200 cursor-pointer' : 'opacity-50 cursor-not-allowed'
                  }`}
                >
                  <span className="truncate">{selectedSubCategory || 'Door & window...'}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-600 shrink-0 ml-2 transition-transform ${showSubCategoryDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showSubCategoryDropdown && selectedMainCategory && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                    {subCategories[selectedMainCategory]?.map((subCat, index) => (
                      <button
                        type="button"
                        key={index}
                        onClick={() => {
                          setSelectedSubCategory(subCat);
                          setSelectedService('');
                          setShowSubCategoryDropdown(false);
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 text-sm text-gray-900 transition-colors first:rounded-t-lg last:rounded-b-lg"
                      >
                        {subCat}
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
                if (selectedSubCategory) {
                  setShowServiceDropdown(!showServiceDropdown);
                  setShowMainCategoryDropdown(false);
                  setShowSubCategoryDropdown(false);
                }
              }}
              disabled={!selectedSubCategory}
              className={`w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-left text-sm flex items-center justify-between transition-colors ${
                selectedSubCategory ? 'hover:border-gray-400 cursor-pointer' : 'opacity-50 cursor-not-allowed'
              }`}
            >
              <span className={`truncate ${selectedService ? 'text-gray-900' : 'text-gray-400'}`}>
                {selectedService || 'Select one'}
              </span>
              <ChevronDown className={`w-4 h-4 text-gray-600 shrink-0 ml-2 transition-transform ${showServiceDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showServiceDropdown && selectedSubCategory && services[selectedSubCategory] && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                {services[selectedSubCategory].map((service, index) => (
                  <button
                    type="button"
                    key={index}
                    onClick={() => {
                      setSelectedService(service);
                      setShowServiceDropdown(false);
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 text-sm text-gray-900 transition-colors first:rounded-t-lg last:rounded-b-lg"
                  >
                    {service}
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
