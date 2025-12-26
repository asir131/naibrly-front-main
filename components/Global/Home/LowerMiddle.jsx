"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import BundleDetailModal from "@/components/Global/Modals/BundleDetailModal";
import AuthPromptModal from "@/components/Global/Modals/AuthPromptModal";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

// Custom Location Icon Component
const LocationIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="flex-shrink-0"
  >
    <path
      d="M11.9999 13.4295C13.723 13.4295 15.1199 12.0326 15.1199 10.3095C15.1199 8.58633 13.723 7.18945 11.9999 7.18945C10.2768 7.18945 8.87988 8.58633 8.87988 10.3095C8.87988 12.0326 10.2768 13.4295 11.9999 13.4295Z"
      stroke="#292D32"
      strokeWidth="1.5"
    />
    <path
      d="M3.61995 8.49C5.58995 -0.169998 18.42 -0.159997 20.38 8.5C21.53 13.58 18.37 17.88 15.6 20.54C13.59 22.48 10.41 22.48 8.38995 20.54C5.62995 17.88 2.46995 13.57 3.61995 8.49Z"
      stroke="#292D32"
      strokeWidth="1.5"
    />
  </svg>
);

// Helper function to shuffle array randomly
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Helper function to format date
const formatServiceDate = (dateString) => {
  const date = new Date(dateString);
  const options = { month: "short", day: "numeric", year: "numeric" };
  return `Service Date: ${date.toLocaleDateString("en-US", options)}`;
};

// Default avatar placeholder
const DEFAULT_AVATAR =
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop";

export default function NaibrlybundelOfferSection() {
  const { isAuthenticated } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBundle, setSelectedBundle] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [bundles, setBundles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBundles = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/bundles/all`);
        if (!response.ok) {
          throw new Error("Failed to fetch bundles");
        }
        const data = await response.json();
        // API returns { success: true, data: { bundles: [...] } }
        const bundlesArray = data?.data?.bundles || [];
        // Shuffle and take only 6 bundles
        const randomBundles = shuffleArray(bundlesArray).slice(0, 6);
        setBundles(randomBundles);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBundles();
  }, []);

  const handleViewDetails = (bundle) => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      const serviceData = {
        title: bundle.title,
        image:
          "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=400&h=600&fit=crop",
      };
      setSelectedBundle(serviceData);
      setIsAuthModalOpen(true);
      return;
    }

    // Map participants to the format expected by the modal
    const mappedParticipants =
      bundle.participants?.map((p) => ({
        name: p.customer
          ? `${p.customer.firstName} ${p.customer.lastName}`
          : "Participant",
        image: p.customer?.profileImage?.url || DEFAULT_AVATAR,
        location: p.address ? `${p.address.city}, ${p.address.state}` : "",
      })) || [];

    // Format location
    const location = bundle.address
      ? `${bundle.address.street}, ${bundle.address.city}, ${bundle.address.state}`
      : "Location not specified";

    // Pass the full bundle data to the modal
    const bundleWithModalData = {
      ...bundle,
      service: bundle.title,
      location: location,
      originalPrice: `$${bundle.pricing?.originalPrice || 0}`,
      discountedPrice: `${
        bundle.pricing?.discountPercent || bundle.bundleDiscount
      }% off`,
      participants: mappedParticipants,
      modalImage:
        "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=400&h=600&fit=crop",
    };
    setSelectedBundle(bundleWithModalData);
    setIsModalOpen(true);
  };

  return (
    <div className="bg-linear-to-br from-teal-50 to-gray-50 py-8 sm:py-12 md:py-16 px-4 sm:px-6 md:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 px-2">
            Naibrly Bundle Offer
          </h2>
          <p className="text-gray-600 text-sm sm:text-base md:text-lg px-4 sm:px-6">
            Share home services with your neighborhood — collaborate and cut
            costs together.
          </p>
        </div>

        {/* Offers Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">{error}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 mb-8 sm:mb-10 md:mb-12">
            {bundles.map((bundle, index) => {
              // Calculate time since creation
              const createdAt = new Date(bundle.createdAt);
              const now = new Date();
              const hoursAgo = Math.floor((now - createdAt) / (1000 * 60 * 60));
              const timeAgoText =
                hoursAgo < 1
                  ? "Just now"
                  : hoursAgo < 24
                  ? `Published ${hoursAgo}hr ago`
                  : `Published ${Math.floor(hoursAgo / 24)}d ago`;

              // Get participant images
              const participantImages =
                bundle.participants?.map(
                  (p) => p.customer?.profileImage?.url || DEFAULT_AVATAR
                ) || [];

              // Format location
              const location = bundle.address
                ? `${bundle.address.street}, ${bundle.address.city}, ${
                    bundle.address.state
                  } ${bundle.zipCode || ""}`
                : "Location not specified";

              return (
                <div
                  key={bundle._id || index}
                  className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100"
                >
                  {/* Header with Service Name and Images */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
                        {bundle.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-500">
                        {timeAgoText}
                      </p>
                    </div>
                    <div className="flex -space-x-2 ml-3">
                      {participantImages.slice(0, 3).map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt={`Participant ${idx + 1}`}
                          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-3 border-white object-cover shadow-sm"
                        />
                      ))}
                      {bundle.availableSpots > 0 && (
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-3 border-white bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                          +{bundle.availableSpots}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bundle Info */}
                  <p className="text-base sm:text-lg text-gray-900 font-semibold mb-3">
                    {bundle.maxParticipants}-Person Bundle (
                    {bundle.availableSpots} Spot
                    {bundle.availableSpots !== 1 ? "s" : ""} Open)
                  </p>

                  {/* Service Date */}
                  <p className="text-sm sm:text-base text-gray-600 mb-3">
                    {formatServiceDate(bundle.serviceDate)}
                  </p>

                  {/* Location */}
                  <div className="flex items-start gap-2 text-sm sm:text-base text-gray-700 mb-4">
                    <LocationIcon />
                    <span className="leading-snug">{location}</span>
                  </div>

                  {/* Rate Info and CTA Button */}
                  <div className="flex items-center justify-between mt-4">
                    <div>
                      <p className="text-base sm:text-lg text-gray-900 font-semibold">
                        ${bundle.pricing?.finalPrice || bundle.finalPrice}
                      </p>
                      <p className="text-sm sm:text-base text-gray-600">
                        {bundle.pricing?.discountPercent ||
                          bundle.bundleDiscount}
                        % off
                      </p>
                    </div>
                    <Button
                      onClick={() => handleViewDetails(bundle)}
                      className="bg-[#0E7A601A] text-teal-700 font-semibold rounded-xl px-6 py-2.5 text-sm transition-colors whitespace-nowrap hover:bg-[#0E7A60] hover:text-white"
                      style={{
                        border: "none",
                      }}
                    >
                      View details
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* CTA Button */}
        <div className="text-center px-4">
          <Link href="/bunddle-offer">
            <Button
              variant="outline"
              className="border-2 bg-transparent border-teal-600 text-teal-600 hover:bg-teal-50 rounded-full px-6 sm:px-8 py-4 sm:py-6 text-sm sm:text-base font-semibold w-full sm:w-auto"
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
