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
      id: 1,
      service: "Window Washing",
      bundle: "3-Person Bundle (2 Joined, 1 Spot Open)",
      location: "Street Springfield, IL 62704",
      originalPrice: "$68/hr",
      discountedPrice: "$55/hr",
      savings: "-$13",
      images: [
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
        "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop",
      ],
    },
    {
      id: 2,
      service: "Window Washing",
      bundle: "3-Person Bundle (2 Joined, 1 Spot Open)",
      location: "Street Springfield, IL 62704",
      originalPrice: "$68/hr",
      discountedPrice: "$55/hr",
      savings: "-$13",
      images: [
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
        "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop",
      ],
    },
    {
      id: 3,
      service: "Window Washing",
      bundle: "3-Person Bundle (2 Joined, 1 Spot Open)",
      location: "Street Springfield, IL 62704",
      originalPrice: "$68/hr",
      discountedPrice: "$55/hr",
      savings: "-$13",
      images: [
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
        "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop",
      ],
    },
    {
      id: 4,
      service: "Window Washing",
      bundle: "3-Person Bundle (2 Joined, 1 Spot Open)",
      location: "Street Springfield, IL 62704",
      originalPrice: "$68/hr",
      discountedPrice: "$55/hr",
      savings: "-$13",
      images: [
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
        "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop",
      ],
    },
    {
      id: 5,
      service: "Window Washing",
      bundle: "3-Person Bundle (2 Joined, 1 Spot Open)",
      location: "Street Springfield, IL 62704",
      originalPrice: "$68/hr",
      discountedPrice: "$55/hr",
      savings: "-$13",
      images: [
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
        "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop",
      ],
    },
    {
      id: 6,
      service: "Window Washing",
      bundle: "3-Person Bundle (2 Joined, 1 Spot Open)",
      location: "Street Springfield, IL 62704",
      originalPrice: "$68/hr",
      discountedPrice: "$55/hr",
      savings: "-$13",
      images: [
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
        "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop",
      ],
    },
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
                  <span className="text-sm text-gray-500">{offer.savings}</span>
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
