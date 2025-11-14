'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronDown, X } from 'lucide-react';
import { useGetServicesQuery, useCreateBundleMutation } from '@/redux/api/servicesApi';

export default function CreateBundleModal({ isOpen, onClose, onPublish }) {
  const [selectedMainCategory, setSelectedMainCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [selectedServices, setSelectedServices] = useState([]);
  const [serviceDate, setServiceDate] = useState('');
  const [fromTime, setFromTime] = useState('');
  const [toTime, setToTime] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const [showMainCategoryDropdown, setShowMainCategoryDropdown] = useState(false);
  const [showSubCategoryDropdown, setShowSubCategoryDropdown] = useState(false);
  const [showServiceDropdown, setShowServiceDropdown] = useState(false);

  // Refs for click outside detection
  const mainCategoryRef = useRef(null);
  const subCategoryRef = useRef(null);
  const serviceRef = useRef(null);

  // Fetch services from API
  const { data: servicesData, isLoading: servicesLoading } = useGetServicesQuery();

  // Create bundle mutation
  const [createBundle, { isLoading: isCreating }] = useCreateBundleMutation();

  // Extract main categories from API data
  const mainCategories = useMemo(() => {
    if (!servicesData?.organized) return [];
    return Object.keys(servicesData.organized).map((name) => ({ name }));
  }, [servicesData]);

  // Get category types for selected main category
  const categoryTypes = useMemo(() => {
    if (!selectedMainCategory || !servicesData?.organized?.[selectedMainCategory]) return [];
    return Object.keys(servicesData.organized[selectedMainCategory].categoryTypes);
  }, [selectedMainCategory, servicesData]);

  // Get services for selected category type
  const availableServices = useMemo(() => {
    if (!selectedMainCategory || !selectedSubCategory || !servicesData?.organized) return [];
    const categoryType = servicesData.organized[selectedMainCategory]?.categoryTypes?.[selectedSubCategory];
    return categoryType?.services || [];
  }, [selectedMainCategory, selectedSubCategory, servicesData]);

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

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedMainCategory('');
      setSelectedSubCategory('');
      setSelectedServices([]);
      setServiceDate('');
      setFromTime('');
      setToTime('');
      setTitle('');
      setDescription('');
    }
  }, [isOpen]);

  const handleServiceToggle = (service) => {
    setSelectedServices((prev) => {
      if (prev.some((s) => s.id === service.id)) {
        return prev.filter((s) => s.id !== service.id);
      } else {
        return [...prev, service];
      }
    });
  };

  const handlePublish = async () => {
    try {
      // Basic validation
      if (!selectedMainCategory || !selectedSubCategory || selectedServices.length === 0 || !serviceDate || !fromTime || !toTime) {
        console.error('Missing required fields for creating bundle');
        return;
      }

      const bundleData = {
        category: selectedMainCategory,
        categoryTypeName: selectedSubCategory,
        // Backend expects service names (strings) rather than internal IDs
        services: selectedServices.map((s) => s.name),
        serviceDate,
        serviceTimeStart: fromTime,
        serviceTimeEnd: toTime,
        title: title || `${selectedSubCategory} Bundle`,
        description: description || `Bundle for ${selectedServices.map((s) => s.name).join(', ')}`,
      };

      console.log('Bundle data being sent to the backend:', JSON.parse(JSON.stringify(bundleData)));

      const response = await createBundle(bundleData).unwrap();
      console.log('Bundle created successfully:', response);

      // Call onPublish callback if provided
      if (onPublish) {
        onPublish(bundleData);
      }

      // Close modal on success
      onClose();
    } catch (error) {
      // RTK Query returns different shapes for errors depending on network/server
      console.error('Failed to create bundle. Full error object:', error);

      // If server returned a JSON error body, log it specifically
      if (error?.data) {
        console.error('Server response (data):', error.data);
      }
      if (error?.status) {
        console.error('HTTP status:', error.status);
      }

      // If fetchBaseQuery returned a serialized error message
      if (error?.error) {
        console.error('Error message:', error.error);
      }

      // You might want to show an error toast here to notify the user
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white rounded-3xl p-8 max-h-[90vh] overflow-y-auto">
        <DialogTitle className="text-center text-2xl font-bold text-gray-900 mb-2">
          Create Bundle
        </DialogTitle>

        <p className="text-center text-gray-600 mb-6">
          Bundle Target: 3 Users (within 10 miles)
        </p>

        <div className="space-y-6">
          {/* Bundle Title */}
          <div>
            <label className="text-sm font-semibold text-gray-900 mb-3 block">
              Bundle Title*
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Weekly Cleaning Bundle"
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-semibold text-gray-900 mb-3 block">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your bundle..."
              rows={3}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
            />
          </div>

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
                  <span className="truncate">{selectedMainCategory || 'Select Category'}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-600 shrink-0 ml-2 transition-transform ${showMainCategoryDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showMainCategoryDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                    {servicesLoading ? (
                      <div className="px-4 py-3 text-sm text-gray-500 text-center">Loading...</div>
                    ) : mainCategories.length > 0 ? (
                      mainCategories.map((category) => (
                        <button
                          type="button"
                          key={category.name}
                          onClick={() => {
                            setSelectedMainCategory(category.name);
                            setSelectedSubCategory('');
                            setSelectedServices([]);
                            setShowMainCategoryDropdown(false);
                          }}
                          className="w-full text-left px-4 py-3 hover:bg-gray-50 text-sm text-gray-900 transition-colors first:rounded-t-lg last:rounded-b-lg"
                        >
                          {category.name}
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-sm text-gray-500 text-center">No categories</div>
                    )}
                  </div>
                )}
              </div>

              {/* Category Type Dropdown */}
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
                  <span className="truncate">{selectedSubCategory || 'Category Type'}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-600 shrink-0 ml-2 transition-transform ${showSubCategoryDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showSubCategoryDropdown && selectedMainCategory && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                    {categoryTypes.length > 0 ? (
                      categoryTypes.map((categoryType) => (
                        <button
                          type="button"
                          key={categoryType}
                          onClick={() => {
                            setSelectedSubCategory(categoryType);
                            setSelectedServices([]);
                            setShowSubCategoryDropdown(false);
                          }}
                          className="w-full text-left px-4 py-3 hover:bg-gray-50 text-sm text-gray-900 transition-colors first:rounded-t-lg last:rounded-b-lg"
                        >
                          {categoryType}
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-sm text-gray-500 text-center">No types</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Select Services (Multiple) */}
          <div className="relative" ref={serviceRef}>
            <label className="text-sm font-semibold text-gray-900 mb-3 block">
              Select Services* (Multiple)
            </label>

            {/* Selected Services Display */}
            {selectedServices.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {selectedServices.map((service) => (
                  <div
                    key={service.id}
                    className="inline-flex items-center gap-1 bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-xs font-medium"
                  >
                    <span>{service.name}</span>
                    <button
                      type="button"
                      onClick={() => handleServiceToggle(service)}
                      className="hover:bg-teal-200 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

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
              <span className={`truncate ${selectedServices.length > 0 ? 'text-gray-900' : 'text-gray-400'}`}>
                {selectedServices.length > 0 ? `${selectedServices.length} selected` : 'Select services'}
              </span>
              <ChevronDown className={`w-4 h-4 text-gray-600 shrink-0 ml-2 transition-transform ${showServiceDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showServiceDropdown && selectedSubCategory && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                {availableServices.length > 0 ? (
                  availableServices.map((service) => (
                    <button
                      type="button"
                      key={service.id}
                      onClick={() => handleServiceToggle(service)}
                      className={`w-full text-left px-4 py-3 hover:bg-gray-50 text-sm transition-colors first:rounded-t-lg last:rounded-b-lg flex items-center justify-between ${
                        selectedServices.some((s) => s.id === service.id) ? 'bg-teal-50 text-teal-900' : 'text-gray-900'
                      }`}
                    >
                      <span>{service.name}</span>
                      {selectedServices.some((s) => s.id === service.id) && (
                        <span className="text-teal-600 text-xs">✓</span>
                      )}
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-3 text-sm text-gray-500 text-center">No services</div>
                )}
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
              min={new Date().toISOString().split('T')[0]}
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
            disabled={
              !selectedMainCategory ||
              !selectedSubCategory ||
              selectedServices.length === 0 ||
              !serviceDate ||
              !fromTime ||
              !toTime ||
              isCreating
            }
            className="w-full bg-orange-500 hover:bg-orange-600 text-white h-12 rounded-lg font-semibold text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCreating ? 'Publishing...' : 'Publish'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
