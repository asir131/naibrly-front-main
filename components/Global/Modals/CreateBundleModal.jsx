'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronDown, Calendar, Clock } from 'lucide-react';

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
              <div className="relative">
                <button
                  onClick={() => setShowMainCategoryDropdown(!showMainCategoryDropdown)}
                  className="w-full px-4 py-3 bg-gray-100 rounded-lg text-left text-sm text-gray-900 flex items-center justify-between hover:bg-gray-200 transition-colors"
                >
                  <span>{selectedMainCategory || 'Interior'}</span>
                  <ChevronDown className="w-4 h-4 text-gray-600" />
                </button>

                {showMainCategoryDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                    {mainCategories.map((category) => (
                      <button
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
              <div className="relative">
                <button
                  onClick={() => setShowSubCategoryDropdown(!showSubCategoryDropdown)}
                  className="w-full px-4 py-3 bg-gray-100 rounded-lg text-left text-sm text-gray-900 flex items-center justify-between hover:bg-gray-200 transition-colors"
                >
                  <span>{selectedSubCategory || 'Door & window...'}</span>
                  <ChevronDown className="w-4 h-4 text-gray-600" />
                </button>

                {showSubCategoryDropdown && selectedMainCategory && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                    {subCategories[selectedMainCategory]?.map((subCat, index) => (
                      <button
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
          <div className="relative">
            <label className="text-sm font-semibold text-gray-900 mb-3 block">
              Select Service*
            </label>
            <button
              onClick={() => setShowServiceDropdown(!showServiceDropdown)}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-left text-sm flex items-center justify-between hover:border-gray-400 transition-colors"
            >
              <span className={selectedService ? 'text-gray-900' : 'text-gray-400'}>
                {selectedService || 'Select one'}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-600" />
            </button>

            {showServiceDropdown && selectedSubCategory && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                {services[selectedSubCategory]?.map((service, index) => (
                  <button
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
            <div className="relative">
              <input
                type="date"
                value={serviceDate}
                onChange={(e) => setServiceDate(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Select date"
              />
              <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Time Range */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-semibold text-gray-900 mb-3 block">
                From*
              </label>
              <div className="relative">
                <input
                  type="time"
                  value={fromTime}
                  onChange={(e) => setFromTime(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="00:00"
                />
                <Clock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-900 mb-3 block">
                To Time*
              </label>
              <div className="relative">
                <input
                  type="time"
                  value={toTime}
                  onChange={(e) => setToTime(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="00:00"
                />
                <Clock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
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
