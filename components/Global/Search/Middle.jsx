'use client';

import React, { useState } from 'react';
import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import BundleDetailModal from '@/components/Global/Modals/BundleDetailModal';
import AuthPromptModal from '@/components/Global/Modals/AuthPromptModal';

export default function NaibrlybundelOfferSection() {
  const searchParams = useSearchParams();
  const serviceParam = searchParams.get('service');
  const zipParam = searchParams.get('zip');
  const { isAuthenticated } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBundle, setSelectedBundle] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
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
      ],
      modalImage: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=600&fit=crop',
      participants: [
        {
          name: 'Moniru',
          image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
          location: 'Street Springfield, IL 62704'
        },
        {
          name: 'Shuvos',
          image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
          location: 'Street Springfield, IL 62704'
        }
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
      ],
      modalImage: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=600&fit=crop',
      participants: [
        { name: 'Moniru', image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop', location: 'Street Springfield, IL 62704' },
        { name: 'Shuvos', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop', location: 'Street Springfield, IL 62704' }
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
      ],
      modalImage: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=600&fit=crop',
      participants: [
        { name: 'Moniru', image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop', location: 'Street Springfield, IL 62704' },
        { name: 'Shuvos', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop', location: 'Street Springfield, IL 62704' }
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
      ],
      modalImage: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=600&fit=crop',
      participants: [
        { name: 'Moniru', image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop', location: 'Street Springfield, IL 62704' },
        { name: 'Shuvos', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop', location: 'Street Springfield, IL 62704' }
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
      ],
      modalImage: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=600&fit=crop',
      participants: [
        { name: 'Moniru', image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop', location: 'Street Springfield, IL 62704' },
        { name: 'Shuvos', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop', location: 'Street Springfield, IL 62704' }
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
      ],
      modalImage: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=600&fit=crop',
      participants: [
        { name: 'Moniru', image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop', location: 'Street Springfield, IL 62704' },
        { name: 'Shuvos', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop', location: 'Street Springfield, IL 62704' }
      ]
    }
  ];

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
    // If authenticated, show bundle details
    setSelectedBundle(offer);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBundle(null);
  };

  return (
    <>
      <BundleDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        bundleData={selectedBundle}
      />

      {/* Auth Prompt Modal */}
      <AuthPromptModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        serviceData={selectedBundle}
      />

    <div className="bg-linear-to-br from-gray-50 to-blue-50 py-16 px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
            {serviceParam ? `${serviceParam} and Bundles near you` : 'Plumbers and Bundles near you'}
            {zipParam && ` in ${zipParam}`}
          </h2>
          <p className="text-gray-500 text-base max-w-3xl">
            {serviceParam
              ? `Find professional ${serviceParam.toLowerCase()} services in your area. Save time and money by bundling with your neighbors.`
              : 'Plumbers often repair clogged drains, leaky faucets, or faulty water heaters — helping protect your home from water damage and keep your systems running smoothly.'}
          </p>
        </div>

        {/* Offers Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className="bg-white rounded-[24px] p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
            >
              {/* Header with Service Name and Images */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {offer.service}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Published 1hr ago
                  </p>
                </div>
                <div className="flex -space-x-2 ml-3">
                  {offer.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`Person ${idx + 1}`}
                      className="w-12 h-12 rounded-full border-2 border-white object-cover"
                    />
                  ))}
                </div>
              </div>

              {/* Bundle Info */}
              <p className="text-base font-semibold text-gray-900 mb-2">
                {offer.bundle}
              </p>

              {/* Service Date */}
              <p className="text-sm text-gray-600 mb-3">
                Service Date: jun 10, 2025
              </p>

              {/* Location */}
              <div className="flex items-start gap-2 text-sm text-gray-700 mb-4">
                <MapPin className="w-5 h-5 text-gray-900 shrink-0" />
                <span>{offer.location}</span>
              </div>

              {/* Pricing and CTA */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base font-semibold text-gray-900">
                    Standard rates est.
                  </p>
                  <p className="text-sm text-gray-600">
                    5-10% off
                  </p>
                </div>
                <Button
                  onClick={() => handleViewDetails(offer)}
                  className="bg-[#E8F5F3] hover:bg-[#D0EBE7] text-teal-600 font-semibold rounded-lg px-5 py-2 text-sm transition-colors border-0 shadow-none"
                >
                  View details
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <Button
            variant="outline"
            className="border-2 border-teal-600 text-teal-600 hover:bg-teal-50 rounded-full px-8 py-6 text-base font-semibold"
          >
            Explore more Offer
          </Button>
        </div>
      </div>
    </div>
    </>
  );
}