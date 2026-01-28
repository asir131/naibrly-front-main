'use client';

import React, { useState, useMemo } from 'react';
import { MapPin, Calendar, Clock, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import BundleDetailModal from '@/components/Global/Modals/BundleDetailModal';
import CreateBundleModal from '@/components/Global/Modals/CreateBundleModal';
import BundlePublishedModal from '@/components/Global/Modals/BundlePublishedModal';
import ShareBundleModal from '@/components/Global/Modals/ShareBundleModal';
import AuthPromptModal from '@/components/Global/Modals/AuthPromptModal';

export default function NaibrlybundelOfferSection({
  bundles = [],
  searchSummary,
  providerResults,
  isLoading,
  hasSearched
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const serviceParam = searchParams.get('service');
  const zipParam = searchParams.get('zip');
  const { isAuthenticated } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBundle, setSelectedBundle] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCreateBundleOpen, setIsCreateBundleOpen] = useState(false);
  const [isBundlePublishedOpen, setIsBundlePublishedOpen] = useState(false);
  const [isShareBundleOpen, setIsShareBundleOpen] = useState(false);
  const [createdBundleData, setCreatedBundleData] = useState(null);

  // Fallback offers for when no search has been performed
  const fallbackOffers = [
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
      participants: []
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
      participants: []
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
      participants: []
    }
  ];

  // Transform API bundles to display format
  const transformedBundles = useMemo(() => {
    if (!bundles || bundles.length === 0) return [];
    return bundles.map((bundle) => {
      const serviceList =
        bundle.services?.map((service) => service?.name).filter(Boolean) || [];
      const serviceNames = serviceList.join(", ") || bundle.title;
      const serviceLabel = serviceList.length === 1 ? "Service" : "Services";
      // Get participant images
      const participantImages = bundle.participants?.map(p =>
        p.customer?.profileImage?.url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop'
      ) || [];

      // Format service date
      const serviceDate = bundle.serviceDate
        ? new Date(bundle.serviceDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        : 'TBD';

      return {
        id: bundle._id,
        service: serviceNames,
        serviceLabel,
        description: bundle.description,
        bundle: `${bundle.maxParticipants}-Person Bundle (${bundle.currentParticipants} Joined, ${bundle.availableSpots} Spot${bundle.availableSpots !== 1 ? 's' : ''} Open)`,
        location: bundle.zipCode || bundle.address?.zipCode || 'ZIP not provided',
        originalPrice: `$${bundle.pricing?.originalPrice || 0}`,
        discountedPrice: `$${bundle.pricing?.finalPrice || 0}`,
        discountPercent: `${bundle.pricing?.discountPercent || 0}% off`,
        savings: `-$${bundle.pricing?.discountAmount || 0}`,
        serviceDate,
        serviceTime: `${bundle.serviceTimeStart || ''} - ${bundle.serviceTimeEnd || ''}`,
        coverImage: bundle.coverImage || null,
        images: participantImages.length > 0 ? participantImages : [
          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop'
        ],
        participants: bundle.participants || [],
        services: bundle.services || [],
        category: bundle.category,
        categoryTypeName: bundle.categoryTypeName,
        status: bundle.status,
        canJoin: bundle.canJoin,
        userRole: bundle.userRole,
        creator: bundle.creator,
        maxParticipants: bundle.maxParticipants,
        currentParticipants: bundle.currentParticipants,
        availableSpots: bundle.availableSpots
      };
    });
  }, [bundles]);

  // Use API bundles if available, otherwise fallback
  const displayOffers = hasSearched ? transformedBundles : fallbackOffers;

  const handleViewDetails = (offer) => {
    if (!isAuthenticated) {
      const serviceData = {
        title: offer.service,
        image: offer.coverImage || offer.modalImage || null,
      };
      setSelectedBundle(serviceData);
      setIsAuthModalOpen(true);
      return;
    }
    setSelectedBundle(offer);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBundle(null);
  };

  const handleCreateBundle = () => {
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
    const frontendShareLink = createdBundleData?.sharing?.frontendShareLink;
    if (frontendShareLink && navigator.share) {
      navigator.share({
        title: createdBundleData?.bundle?.title || 'Join my Naibrly Bundle',
        text: `I've created a bundle on Naibrly! Join me to save money on ${createdBundleData?.bundle?.title || 'services'}.`,
        url: frontendShareLink,
      }).catch((error) => console.log('Error sharing:', error));
    } else if (frontendShareLink) {
      navigator.clipboard.writeText(frontendShareLink);
      alert('Share link copied to clipboard!');
    } else {
      alert('Share link not available');
    }
  };

  const handleShareWithQR = () => {
    setIsBundlePublishedOpen(false);
    setIsShareBundleOpen(true);
  };

  // Format time ago (for demo purposes, using creation time if available)
  const getTimeAgo = (bundle) => {
    if (!bundle.createdAt) return 'Recently';
    const diff = Date.now() - new Date(bundle.createdAt).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}hr ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <>
      <BundleDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        bundleData={selectedBundle}
      />

      <AuthPromptModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        serviceData={selectedBundle}
      />

      <CreateBundleModal
        isOpen={isCreateBundleOpen}
        onClose={() => setIsCreateBundleOpen(false)}
        onPublish={handlePublishBundle}
      />

      <BundlePublishedModal
        isOpen={isBundlePublishedOpen}
        onClose={() => setIsBundlePublishedOpen(false)}
        onShareText={handleShareWithText}
        onShareQR={handleShareWithQR}
      />

      <ShareBundleModal
        isOpen={isShareBundleOpen}
        onClose={() => setIsShareBundleOpen(false)}
        bundleData={createdBundleData}
        sharingData={createdBundleData?.sharing}
      />

      <div className="bg-linear-to-br from-gray-50 to-blue-50 py-16 px-4 md:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
              {serviceParam ? `${serviceParam} Bundles near you` : 'Service Bundles near you'}
              {zipParam && ` in ${zipParam}`}
            </h2>
            <p className="text-gray-500 text-base max-w-3xl">
              {serviceParam
                ? `Find ${serviceParam.toLowerCase()} bundles in your area. Save time and money by bundling with your neighbors.`
                : 'Find service bundles in your area. Save time and money by bundling with your neighbors.'}
            </p>
            {/* Search Stats */}
            {hasSearched && searchSummary && (
              <p className="text-teal-600 text-sm mt-2">
                Found {searchSummary.totalResults || 0} bundle(s)
                {providerResults?.stats?.totalProviders > 0 && ` and ${providerResults.stats.totalProviders} provider(s)`} in your area
              </p>
            )}
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center py-12">
              <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
              <span className="ml-3 text-gray-600">Searching for bundles...</span>
            </div>
          )}

          {/* No Results State */}
          {hasSearched && !isLoading && transformedBundles.length === 0 && (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No bundles found for "{serviceParam}" in {zipParam}.</p>
              <p className="text-gray-500 text-sm mt-2">Be the first to create a bundle and save with your neighbors!</p>
              <Button
                onClick={handleCreateBundle}
                className="mt-4 bg-teal-600 hover:bg-teal-700"
              >
                Create a Bundle
              </Button>
            </div>
          )}

          {/* Related Services Section - from Provider API */}
          {hasSearched && providerResults?.relatedServices?.length > 0 && (
            <div className="mb-12">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Related Services</h3>
              <div className="flex flex-wrap gap-3">
                {providerResults.relatedServices.map((service) => (
                  <button
                    key={service._id}
                    type="button"
                    onClick={() => {
                      const params = new URLSearchParams();
                      if (service?.name) params.set("service", service.name);
                      if (zipParam) params.set("zip", zipParam);
                      router.push(`/find-area?${params.toString()}`);
                    }}
                    className="bg-white px-4 py-2 rounded-full text-sm text-gray-700 border border-gray-200 hover:border-teal-600 hover:text-teal-600 transition-colors"
                  >
                    {service.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Bundles Grid */}
          {!isLoading && displayOffers.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {displayOffers.map((offer, index) => (
                <div
                  key={offer.id || index}
                  className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
                >
                  {/* Header with Service Name and Participant Images */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {offer.service}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {hasSearched ? getTimeAgo(offer) : 'Published 1hr ago'}
                      </p>
                    </div>
                    <div className="flex -space-x-2 ml-3">
                      {offer.images.slice(0, 3).map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt={`Participant ${idx + 1}`}
                          className="w-10 h-10 rounded-full border-2 border-white object-cover"
                        />
                      ))}
                      {offer.images.length > 3 && (
                        <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs text-gray-600">
                          +{offer.images.length - 3}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bundle Info */}
                  <p className="text-base font-semibold text-gray-900 mb-2">
                    {offer.bundle}
                  </p>
                  {offer.service && (
                    <p className="text-sm text-teal-600 font-medium mb-3">
                      {offer.serviceLabel || "Services"}: {offer.service}
                    </p>
                  )}

                  {/* Service Date & Time */}
                  {hasSearched && offer.serviceDate && (
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{offer.serviceDate}</span>
                      </div>
                      {offer.serviceTime && offer.serviceTime !== ' - ' && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{offer.serviceTime}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Location */}
                  <div className="flex items-start gap-2 text-sm text-gray-700 mb-4">
                    <MapPin className="w-5 h-5 text-teal-600 shrink-0" />
                    <span>{offer.location}</span>
                  </div>

                  {/* Services included (for API data) */}
                  {hasSearched && offer.services?.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 mb-1">Services included:</p>
                      <div className="flex flex-wrap gap-1">
                        {offer.services.slice(0, 2).map((service, idx) => (
                          <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                            {service.name}
                          </span>
                        ))}
                        {offer.services.length > 2 && (
                          <span className="text-xs text-gray-500">+{offer.services.length - 2} more</span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Pricing and CTA */}
                  <div className="flex items-center justify-between">
                    <div>
                      {hasSearched ? (
                        <>
                          <div className="flex items-baseline gap-2">
                            <p className="text-lg font-bold text-teal-600">
                              {offer.discountedPrice}
                            </p>
                            <p className="text-sm text-gray-400 line-through">
                              {offer.originalPrice}
                            </p>
                          </div>
                          <p className="text-sm text-green-600 font-medium">
                            {offer.discountPercent}
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="text-base font-semibold text-gray-900">
                            Standard rates est.
                          </p>
                          <p className="text-sm text-gray-600">
                            5-10% off
                          </p>
                        </>
                      )}
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
          )}

          {/* CTA Button */}
          {displayOffers.length > 0 && (
            <div className="text-center">
              <Button
                variant="outline"
                className="border-2 border-teal-600 text-teal-600 hover:bg-teal-50 rounded-full px-8 py-6 text-base font-semibold"
              >
                Explore more Bundles
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
