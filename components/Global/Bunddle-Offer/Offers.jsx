"use client";

import React, { useState } from "react";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import BundleDetailModal from "@/components/Global/Modals/BundleDetailModal";
import CreateBundleModal from "@/components/Global/Modals/CreateBundleModal";
import BundlePublishedModal from "@/components/Global/Modals/BundlePublishedModal";
import ShareBundleModal from "@/components/Global/Modals/ShareBundleModal";
import AuthPromptModal from "@/components/Global/Modals/AuthPromptModal";

export default function NaibrlybundelOfferSection() {
  const { isAuthenticated } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBundle, setSelectedBundle] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Create Bundle Modal Flow States
  const [isCreateBundleOpen, setIsCreateBundleOpen] = useState(false);
  const [isBundlePublishedOpen, setIsBundlePublishedOpen] = useState(false);
  const [isShareBundleOpen, setIsShareBundleOpen] = useState(false);
  const [createdBundleData, setCreatedBundleData] = useState(null);

  // Custom Location Icon Component
const LocationIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
    <path d="M11.9999 13.4295C13.723 13.4295 15.1199 12.0326 15.1199 10.3095C15.1199 8.58633 13.723 7.18945 11.9999 7.18945C10.2768 7.18945 8.87988 8.58633 8.87988 10.3095C8.87988 12.0326 10.2768 13.4295 11.9999 13.4295Z" stroke="#292D32" strokeWidth="1.5"/>
    <path d="M3.61995 8.49C5.58995 -0.169998 18.42 -0.159997 20.38 8.5C21.53 13.58 18.37 17.88 15.6 20.54C13.59 22.48 10.41 22.48 8.38995 20.54C5.62995 17.88 2.46995 13.57 3.61995 8.49Z" stroke="#292D32" strokeWidth="1.5"/>
  </svg>
);

  const handleViewDetails = (offer) => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      const serviceData = {
        title: offer.service,
        image: "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=400&h=600&fit=crop",
      };
      setSelectedBundle(serviceData);
      setIsAuthModalOpen(true);
      return;
    }
    // Add participants data for the modal
    const bundleWithParticipants = {
      ...offer,
      participants: [
        {
          name: "John Smith",
          image: offer.images[0],
          location: offer.location,
        },
        {
          name: "Sarah Johnson",
          image: offer.images[1],
          location: offer.location,
        },
        {
          name: "Open Spot",
          image: offer.images[2],
          location: offer.location,
        },
      ],
      modalImage:
        "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=400&h=600&fit=crop",
    };
    setSelectedBundle(bundleWithParticipants);
    setIsModalOpen(true);
  };

  // Handler for Create Bundle flow
  const handleCreateBundle = () => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }
    setIsCreateBundleOpen(true);
  };

  const handlePublishBundle = (bundleData) => {
    setCreatedBundleData(bundleData);
    setIsCreateBundleOpen(false);
    setIsBundlePublishedOpen(true);
  };

  const handleShareWithText = () => {
    setIsBundlePublishedOpen(false);
    // In a real app, you would open the native share dialog or email client
    alert('Opening text/email share...');
  };

  const handleShareWithQR = () => {
    setIsBundlePublishedOpen(false);
    setIsShareBundleOpen(true);
  };

  const offers = [
    {
      id: 6,
      service: 'Window Washing',
      bundle: '3-Person Bundle (1 Spot Open)',
      date: 'Service Date: jun 10, 2025',
      location: 'Street Springfield, IL 62704',
      rate: 'Standard rates est.',
      originalPrice: '$68/hr',
      discountedPrice: '5-10% off',
      images: [
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
        'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop'
      ]
    },
    {
      id: 6,
      service: 'Window Washing',
      bundle: '3-Person Bundle (1 Spot Open)',
      date: 'Service Date: jun 10, 2025',
      location: 'Street Springfield, IL 62704',
      rate: 'Standard rates est.',
      originalPrice: '$68/hr',
      discountedPrice: '5-10% off',
      images: [
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
        'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop'
      ]
    },
    {
      id: 6,
      service: 'Window Washing',
      bundle: '3-Person Bundle (1 Spot Open)',
      date: 'Service Date: jun 10, 2025',
      location: 'Street Springfield, IL 62704',
      rate: 'Standard rates est.',
      originalPrice: '$68/hr',
      discountedPrice: '5-10% off',
      images: [
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
        'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop'
      ]
    },
    {
      id: 6,
      service: 'Window Washing',
      bundle: '3-Person Bundle (1 Spot Open)',
      date: 'Service Date: jun 10, 2025',
      location: 'Street Springfield, IL 62704',
      rate: 'Standard rates est.',
      originalPrice: '$68/hr',
      discountedPrice: '5-10% off',
      images: [
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
        'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop'
      ]
    },
    {
      id: 6,
      service: 'Window Washing',
      bundle: '3-Person Bundle (1 Spot Open)',
      date: 'Service Date: jun 10, 2025',
      location: 'Street Springfield, IL 62704',
      rate: 'Standard rates est.',
      originalPrice: '$68/hr',
      discountedPrice: '5-10% off',
      images: [
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
        'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop'
      ]
    },
    {
      id: 6,
      service: 'Window Washing',
      bundle: '3-Person Bundle (1 Spot Open)',
      date: 'Service Date: jun 10, 2025',
      location: 'Street Springfield, IL 62704',
      rate: 'Standard rates est.',
      originalPrice: '$68/hr',
      discountedPrice: '5-10% off',
      images: [
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
        'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop'
      ]
    }
  ];

  return (
    <div className="bg-linear-to-br from-teal-50 to-gray-50 py-16 px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-accent mb-12">
          {/* Title and Button Row */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
              Naibrly Bundel Offer
            </h2>
            <Button
              onClick={handleCreateBundle}
              className="bg-teal-600 hover:bg-teal-700 text-white rounded-lg px-8 py-3 text-lg font-semibold w-fit"
            >
              Create Bundle
            </Button>
          </div>

          <div className="space-y-2">
            <p className="text-gray-600 text-lg">
              "This is a great offer for you. If more than one of you use the app together to place an order,
            </p>
            <p className="text-gray-600 text-lg">
              you will get up to 7% discount. Anyone within a 10 km radius can join."
            </p>
          </div>
        </div>

        {/* Offers Grid */}
        {/* Offers Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 mb-8 sm:mb-10 md:mb-12">
                  {offers.map((offer, index) => (
                    <div
                      key={`${offer.id}-${index}`}
                      className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100"
                    >
                      {/* Header with Service Name and Images */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
                            {offer.service}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-500">
                            Published 1hr ago
                          </p>
                        </div>
                        <div className="flex -space-x-2 ml-3">
                          {offer.images.map((img, idx) => (
                            <img
                              key={idx}
                              src={img}
                              alt={`Person ${idx + 1}`}
                              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-3 border-white object-cover shadow-sm"
                            />
                          ))}
                        </div>
                      </div>
        
                      {/* Bundle Info */}
                      <p className="text-base sm:text-lg text-gray-900 font-semibold mb-3">
                        {offer.bundle}
                      </p>
        
                      {/* Service Date */}
                      <p className="text-sm sm:text-base text-gray-600 mb-3">
                        {offer.date}
                      </p>
        
                      {/* Location */}
                      <div className="flex items-start gap-2 text-sm sm:text-base text-gray-700 mb-4">
                        <LocationIcon />
                        <span className="leading-snug">{offer.location}</span>
                      </div>
        
                      {/* Rate Info and CTA Button */}
                      <div className="flex items-center justify-between mt-4">
                        <div>
                          <p className="text-base sm:text-lg text-gray-900 font-semibold">
                            {offer.rate}
                          </p>
                          <p className="text-sm sm:text-base text-gray-600">
                            {offer.discountedPrice}
                          </p>
                        </div>
                        <Button
                          onClick={() => handleViewDetails(offer)}
                          className="bg-[#0E7A601A] text-teal-700 font-semibold rounded-xl px-6 py-2.5 text-sm transition-colors whitespace-nowrap hover:bg-[#0E7A60] hover:text-white"
                          style={{
                            border: 'none'
                          }}
                        >
                          View details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                </div>

      {/* Bundle Detail Modal */}
      <BundleDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        bundleData={selectedBundle}
      />

      {/* Create Bundle Modal */}
      <CreateBundleModal
        isOpen={isCreateBundleOpen}
        onClose={() => setIsCreateBundleOpen(false)}
        onPublish={handlePublishBundle}
      />

      {/* Bundle Published Modal */}
      <BundlePublishedModal
        isOpen={isBundlePublishedOpen}
        onClose={() => setIsBundlePublishedOpen(false)}
        onShareText={handleShareWithText}
        onShareQR={handleShareWithQR}
      />

      {/* Share Bundle Modal */}
      <ShareBundleModal
        isOpen={isShareBundleOpen}
        onClose={() => setIsShareBundleOpen(false)}
        bundleData={createdBundleData}
      />

      {/* Auth Prompt Modal */}
      <AuthPromptModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        serviceData={selectedBundle}
      />
    </div>
  );
}
