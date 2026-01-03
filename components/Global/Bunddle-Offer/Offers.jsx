"use client";

import React, { useState } from "react";
import { MapPin, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import BundleDetailModal from "@/components/Global/Modals/BundleDetailModal";
import CreateBundleModal from "@/components/Global/Modals/CreateBundleModal";
import BundlePublishedModal from "@/components/Global/Modals/BundlePublishedModal";
import ShareBundleModal from "@/components/Global/Modals/ShareBundleModal";
import AuthPromptModal from "@/components/Global/Modals/AuthPromptModal";
import { useGetNearbyBundlesQuery } from "@/redux/api/servicesApi";

export default function NaibrlybundelOfferSection() {
  const { isAuthenticated } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBundle, setSelectedBundle] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [offers, setOffers] = useState([]);
  const [page, setPage] = useState(1);
  const pageSize = 6;

  // Create Bundle Modal Flow States
  const [isCreateBundleOpen, setIsCreateBundleOpen] = useState(false);
  const [isBundlePublishedOpen, setIsBundlePublishedOpen] = useState(false);
  const [isShareBundleOpen, setIsShareBundleOpen] = useState(false);
  const [createdBundleData, setCreatedBundleData] = useState(null);

  // Fetch nearby bundles from API - only fetch if authenticated
  const {
    data: bundlesData,
    isLoading,
    isError,
    error,
  } = useGetNearbyBundlesQuery(
    { page, limit: pageSize },
    { skip: !isAuthenticated } // Skip the query if user is not authenticated
  );

  // Debug logging
  React.useEffect(() => {
    if (error) {
      console.error("Bundle fetch error:", error);
    }
    if (bundlesData) {
      console.log("Bundles data:", bundlesData);
    }
  }, [error, bundlesData]);

  // Sync offers when data loads
  React.useEffect(() => {
    if (bundlesData?.bundles) {
      setOffers(bundlesData.bundles.map(formatBundleForDisplay));
    }
  }, [bundlesData]);

  React.useEffect(() => {
    if (bundlesData?.pagination?.pages && page > bundlesData.pagination.pages) {
      setPage(1);
    }
  }, [bundlesData, page]);

  // Helper function to format bundle data for display
  const formatBundleForDisplay = (bundle) => {
    const getImageUrl = (image) => {
      if (!image) return null;
      if (typeof image === "string") return image;
      return image.url || null;
    };

    const participantImages =
      bundle.participants
        ?.slice(0, 3)
        .map((participant) => participant.customer?.profileImage?.url || null)
        .filter(Boolean) || [];

    const customerImage = getImageUrl(bundle.creator?.profileImage);
    const providerImage = getImageUrl(
      bundle.provider?.profileImage || bundle.provider?.businessLogo
    );
    const cardImages = [customerImage, providerImage].filter(Boolean);

    // Format service date
    const serviceDate = bundle.serviceDate
      ? new Date(bundle.serviceDate).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "Date TBD";

    // Calculate spots
    const spotsOpen = bundle.maxParticipants - bundle.currentParticipants;
    const bundleText =
      spotsOpen > 0
        ? `${bundle.maxParticipants}-Person Bundle (${spotsOpen} Spot${
            spotsOpen !== 1 ? "s" : ""
          } Open)`
        : `${bundle.maxParticipants}-Person Bundle (Full)`;

    // Format location
    const location = bundle.address
      ? `${bundle.address.street}, ${bundle.address.city}, ${
          bundle.address.state
        } ${bundle.zipCode || ""}`
      : `${bundle.zipCode || "Location TBD"}`;

    // Calculate time ago
    const createdAt = new Date(bundle.createdAt);
    const now = new Date();
    const diffInHours = Math.floor((now - createdAt) / (1000 * 60 * 60));
    const timeAgo =
      diffInHours < 1
        ? "Just now"
        : diffInHours < 24
        ? `${diffInHours}hr${diffInHours !== 1 ? "s" : ""} ago`
        : `${Math.floor(diffInHours / 24)} day${
            Math.floor(diffInHours / 24) !== 1 ? "s" : ""
          } ago`;

    return {
      ...bundle,
      service: bundle.title || bundle.services?.[0]?.name || "Service Bundle",
      bundle: bundleText,
      date: `Service Date: ${serviceDate}`,
      location,
      rate: `${
        bundle.pricePerPerson ? `$${bundle.pricePerPerson}/person` : "Price TBD"
      }`,
      originalPrice: `$${bundle.totalPrice || 0}`,
      discountedPrice: `${bundle.bundleDiscount || 0}% off`,
      images: participantImages,
      cardImages,
      timeAgo,
    };
  };

  // Custom Location Icon Component
  const LocationIcon = () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
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

  const handleViewDetails = (bundle) => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      const serviceData = {
        title: bundle.service || bundle.title,
        image: bundle.images?.[0] || bundle.coverImage || null,
      };
      setSelectedBundle(serviceData);
      setIsAuthModalOpen(true);
      return;
    }

    // Format participants data for the modal
    const participantsForModal =
      bundle.participants?.map((p, idx) => ({
        name: p.customer
          ? `${p.customer.firstName} ${p.customer.lastName}`
          : `Participant ${idx + 1}`,
        image:
          p.customer?.profileImage?.url ||
          p.customer?.profileImage ||
          null,
        location: bundle.location,
      })) || [];

    // Add open spots as participants
    const spotsOpen = bundle.maxParticipants - bundle.currentParticipants;
    for (let i = 0; i < spotsOpen && participantsForModal.length < 3; i++) {
      participantsForModal.push({
        name: "Open Spot",
        image: null,
        location: bundle.location,
      });
    }

    const bundleWithParticipants = {
      ...bundle,
      participants: participantsForModal,
      modalImage: bundle.images?.[0] || bundle.coverImage || null,
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

    // Optimistically add the new bundle to the list without reload
    if (bundleData?.bundle) {
      const formatted = formatBundleForDisplay(bundleData.bundle);
      setOffers((prev) => [formatted, ...prev]);
    }
  };

  const handleShareWithText = () => {
    setIsBundlePublishedOpen(false);
    // Use the frontend share link
    const frontendShareLink = createdBundleData?.sharing?.frontendShareLink;
    if (frontendShareLink && navigator.share) {
      // Use native share API if available
      navigator
        .share({
          title: createdBundleData?.bundle?.title || "Join my Naibrly Bundle",
          text: `I've created a bundle on Naibrly! Join me to save money on ${
            createdBundleData?.bundle?.title || "services"
          }.`,
          url: frontendShareLink,
        })
        .catch((error) => console.log("Error sharing:", error));
    } else if (frontendShareLink) {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(frontendShareLink);
      alert("Share link copied to clipboard!");
    } else {
      alert("Share link not available");
    }
  };

  const handleShareWithQR = () => {
    setIsBundlePublishedOpen(false);
    setIsShareBundleOpen(true);
  };

  const showBundlesPagination = (bundlesData?.pagination?.total || 0) > pageSize;

  return (
    <div className="bg-linear-to-br from-teal-50 to-gray-50 py-16 px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-accent mb-12">
          {/* Title and Button Row */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
              Naibrly Bundle Offer
            </h2>
            <Button
              onClick={handleCreateBundle}
              className="bg-teal-600 hover:bg-teal-700 text-white rounded-lg px-8 py-3 text-lg font-semibold w-fit"
            >
              Create Bundle
            </Button>
          </div>

          
        </div>

        {/* Offers Grid */}
        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-teal-600" />
            <span className="ml-3 text-lg text-gray-600">
              Loading bundles...
            </span>
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="text-center py-20">
            <p className="text-lg text-red-600">
              Failed to load bundles. Please try again later.
            </p>
            {error && (
              <p className="text-sm text-gray-500 mt-2">
                Error: {error?.data?.message || error?.error || "Unknown error"}
              </p>
            )}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !isError && offers.length === 0 && (
          <div className="text-center py-20">
            <p className="text-lg text-gray-600">
              No bundles available at the moment.
            </p>
            <p className="text-base text-gray-500 mt-2">
              Be the first to create one!
            </p>
          </div>
        )}

        {/* Offers Grid */}
        {!isLoading && !isError && offers.length > 0 && (
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
                      Published {offer.timeAgo}
                    </p>
                  </div>
                  {offer.cardImages.length > 0 && (
                    <div className="flex -space-x-2 ml-3">
                      {offer.cardImages.map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt={`Person ${idx + 1}`}
                          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-3 border-white object-cover shadow-sm"
                        />
                      ))}
                    </div>
                  )}
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
                      border: "none",
                    }}
                  >
                    View details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
        {!isLoading && !isError && offers.length > 0 && showBundlesPagination && (
          <div className="flex items-center justify-center gap-3 mb-12">
            <Button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page <= 1}
              className="bg-white text-teal-700 border border-teal-200 hover:bg-teal-50"
              variant="outline"
            >
              Previous
            </Button>
            <span className="text-sm text-gray-600">
              Page {bundlesData?.pagination?.current || page} of {bundlesData?.pagination?.pages || 1}
            </span>
            <Button
              onClick={() =>
                setPage((prev) =>
                  bundlesData?.pagination?.pages
                    ? Math.min(prev + 1, bundlesData.pagination.pages)
                    : prev + 1
                )
              }
              disabled={bundlesData?.pagination?.pages ? page >= bundlesData.pagination.pages : false}
              className="bg-teal-600 text-white hover:bg-teal-700"
            >
              Next
            </Button>
          </div>
        )}
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
        sharingData={createdBundleData?.sharing}
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
