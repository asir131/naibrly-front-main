'use client';

import React, { useState } from 'react';
import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import BundleDetailModal from '@/components/Global/Modals/BundleDetailModal';

export default function NaibrlybundelOfferSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBundle, setSelectedBundle] = useState(null);

  const handleViewDetails = (offer) => {
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
    <div className="bg-linear-to-br from-gray-50 to-blue-50 py-16 px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Naibrly Bundel Offer
          </h2>
          <p className="text-gray-600 text-lg">
            Share home services with your neighborhood — collaborate and cut costs together.
          </p>
        </div>

        {/* Offers Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {offers.map((offer) => (
            <div 
              key={offer.id}
              className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              {/* Header with Service Name and Images */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">
                  {offer.service}
                </h3>
                <div className="flex -space-x-2">
                  {offer.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`Person ${idx + 1}`}
                      className="w-10 h-10 rounded-full border-2 border-white object-cover"
                    />
                  ))}
                </div>
              </div>

              {/* Bundle Info */}
              <p className="text-sm text-gray-700 font-medium mb-2">
                {offer.bundle}
              </p>

              {/* Location */}
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                <MapPin className="w-4 h-4" />
                <span>{offer.location}</span>
              </div>

              {/* Pricing and CTA */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-red-500 line-through font-medium">
                    {offer.originalPrice}
                  </span>
                  <span className="text-xl font-bold text-gray-900">
                    {offer.discountedPrice}
                  </span>
                  <span className="text-sm text-gray-500">
                    {offer.savings}
                  </span>
                </div>
                <Button
                  onClick={() => handleViewDetails(offer)}
                  className="bg-teal-600 hover:bg-teal-700 text-white rounded-lg px-6 py-2"
                >
                  View details
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center">
            <Link href="/bunddle-offer">
              <Button
                variant="outline"
                className="border-2 border-teal-600 text-teal-600 hover:bg-teal-50 rounded-full px-8 py-6 text-base font-semibold"
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
    </div>
  );
}