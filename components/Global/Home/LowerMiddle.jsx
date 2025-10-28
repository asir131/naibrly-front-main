'use client';

import React, { useState } from 'react';
import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import BundleDetailModal from '@/components/Global/Modals/BundleDetailModal';
import AuthPromptModal from '@/components/Global/Modals/AuthPromptModal';

export default function NaibrlybundelOfferSection() {
  const { isAuthenticated } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBundle, setSelectedBundle] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleViewDetails = (offer) => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      const serviceData = {
        title: offer.service,
        image: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=400&h=600&fit=crop',
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
          name: 'John Smith',
          image: offer.images[0],
          location: offer.location
        },
        {
          name: 'Sarah Johnson',
          image: offer.images[1],
          location: offer.location
        },
        {
          name: 'Open Spot',
          image: offer.images[2],
          location: offer.location
        }
      ],
      modalImage: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=400&h=600&fit=crop'
    };
    setSelectedBundle(bundleWithParticipants);
    setIsModalOpen(true);
  };

  const offers = [
    {
      id: 1,
      service: 'Window Washing',
      bundle: '3-Person Bundle (2 Joined, 1 Spot Open)',
      location: 'Street Springfield, IL 62704',
      originalPrice: '$68/hr',
      discountedPrice: '$55/hr',
      savings: '-$13',
      images: [
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
        'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop'
      ]
    },
    {
      id: 2,
      service: 'Window Washing',
      bundle: '3-Person Bundle (2 Joined, 1 Spot Open)',
      location: 'Street Springfield, IL 62704',
      originalPrice: '$68/hr',
      discountedPrice: '$55/hr',
      savings: '-$13',
      images: [
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
        'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop'
      ]
    },
    {
      id: 3,
      service: 'Window Washing',
      bundle: '3-Person Bundle (2 Joined, 1 Spot Open)',
      location: 'Street Springfield, IL 62704',
      originalPrice: '$68/hr',
      discountedPrice: '$55/hr',
      savings: '-$13',
      images: [
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
        'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop'
      ]
    },
    {
      id: 4,
      service: 'Window Washing',
      bundle: '3-Person Bundle (2 Joined, 1 Spot Open)',
      location: 'Street Springfield, IL 62704',
      originalPrice: '$68/hr',
      discountedPrice: '$55/hr',
      savings: '-$13',
      images: [
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
        'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop'
      ]
    },
    {
      id: 5,
      service: 'Window Washing',
      bundle: '3-Person Bundle (2 Joined, 1 Spot Open)',
      location: 'Street Springfield, IL 62704',
      originalPrice: '$68/hr',
      discountedPrice: '$55/hr',
      savings: '-$13',
      images: [
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
        'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop'
      ]
    },
    {
      id: 6,
      service: 'Window Washing',
      bundle: '3-Person Bundle (2 Joined, 1 Spot Open)',
      location: 'Street Springfield, IL 62704',
      originalPrice: '$68/hr',
      discountedPrice: '$55/hr',
      savings: '-$13',
      images: [
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
        'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop'
      ]
    }
  ];

  return (
    <div className="bg-linear-to-br from-teal-50 to-gray-50 py-8 sm:py-12 md:py-16 px-4 sm:px-6 md:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 px-2">
            Naibrly Bundel Offer
          </h2>
          <p className="text-gray-600 text-sm sm:text-base md:text-lg px-4 sm:px-6">
            Share home services with your neighborhood — collaborate and cut costs together.
          </p>
        </div>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 mb-8 sm:mb-10 md:mb-12">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              {/* Header with Service Name and Images */}
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h3 className="text-base sm:text-lg font-bold text-gray-900">
                  {offer.service}
                </h3>
                <div className="flex -space-x-2">
                  {offer.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`Person ${idx + 1}`}
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white object-cover"
                    />
                  ))}
                </div>
              </div>

              {/* Bundle Info */}
              <p className="text-xs sm:text-sm text-gray-700 font-medium mb-2">
                {offer.bundle}
              </p>

              {/* Location */}
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                <MapPin className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
                <span className="truncate">{offer.location}</span>
              </div>

              {/* Pricing and CTA */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-2">
                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                  <span className="text-red-500 line-through font-medium text-sm sm:text-base">
                    {offer.originalPrice}
                  </span>
                  <span className="text-lg sm:text-xl font-bold text-gray-900">
                    {offer.discountedPrice}
                  </span>
                  <span className="text-xs sm:text-sm text-gray-500">
                    {offer.savings}
                  </span>
                </div>
                <Button
                  onClick={() => handleViewDetails(offer)}
                  className="bg-teal-600 hover:bg-teal-700 text-white rounded-lg px-4 sm:px-6 py-1.5 sm:py-2 text-sm w-full sm:w-auto"
                >
                  View details
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center px-4">
            <Link href="/bunddle-offer">
              <Button
                variant="outline"
                className="border-2 border-teal-600 text-teal-600 hover:bg-teal-50 rounded-full px-6 sm:px-8 py-4 sm:py-6 text-sm sm:text-base font-semibold w-full sm:w-auto"
              >
                Explore more service
              </Button>
            </Link>
          </div>
      </div>

      {/* Bundle Detail Modal */}
      <BundleDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        bundleData={selectedBundle}
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