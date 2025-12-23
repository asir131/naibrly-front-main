'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import AuthPromptModal from '@/components/Global/Modals/AuthPromptModal';
import { useRouter } from 'next/navigation';
import { useGetNearbyServicesQuery, useSearchProvidersByServiceQuery } from '@/redux/api/servicesApi';
import { Star, Clock, MapPin } from 'lucide-react';
import useCustomerZipCode from '@/hooks/useCustomerZipCode';

export default function OurServicesSection({ serviceType, zipCode }) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const customerZipCode = useCustomerZipCode();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [localZipCode, setLocalZipCode] = useState(zipCode || '');

  // Fetch providers by service type if serviceType is provided
  const {
    data: providersData,
    isLoading: providersLoading,
    isError: providersError,
    refetch: refetchProviders
  } = useSearchProvidersByServiceQuery(
    { serviceType, zipCode: localZipCode },
    { skip: !serviceType } // Skip query if no serviceType
  );

  // Fetch nearby services from API (fallback when no specific service is selected)
  const { data, isLoading, isError } = useGetNearbyServicesQuery(
    { limit: 15 },
    { skip: !!serviceType } // Skip if serviceType is provided
  );

  useEffect(() => {
    if (zipCode) {
      setLocalZipCode(zipCode);
      return;
    }
    if (!localZipCode && customerZipCode) {
      setLocalZipCode(customerZipCode);
    }
  }, [zipCode, customerZipCode, localZipCode]);

  // Transform provider data from search API
  const providers = React.useMemo(() => {
    if (!serviceType || providersLoading || providersError || !providersData?.providers) {
      return [];
    }

    return providersData.providers.map(item => ({
      id: item.provider.id,
      businessName: item.provider.businessName,
      businessLogo: item.provider.businessLogo?.url || "/LandingService/image (7).png",
      profileImage: item.provider.profileImage?.url,
      serviceName: item.service.name,
      hourlyRate: item.service.hourlyRate,
      rating: item.provider.rating || 0,
      totalReviews: item.provider.totalReviews || 0,
      totalJobsCompleted: item.provider.totalJobsCompleted || 0,
      experience: item.provider.experience,
      description: item.provider.description,
      phone: item.provider.phone,
      email: item.provider.email,
      city: item.serviceArea?.city || item.provider.businessAddress?.city,
      state: item.serviceArea?.state || item.provider.businessAddress?.state,
      estimatedResponseTime: item.bookingInfo?.estimatedResponseTime,
      canBookDirectly: item.bookingInfo?.canBookDirectly,
      matchScore: item.matchDetails?.matchScore,
      availability: item.matchDetails?.availability,
    }));
  }, [providersData, providersLoading, providersError, serviceType]);

  // Transform API data to match component structure (fallback services)
  const services = React.useMemo(() => {
    if (isLoading || isError || !data?.services || data.services.length === 0) {
      return [];
    }

    return data.services
      .filter(service => service.serviceName) // Only include services with names
      .map(service => ({
        title: service.serviceName,
        serviceName: service.serviceName,
        description: service.hourlyRate
          ? `Professional ${service.serviceName.toLowerCase()} services - $${service.hourlyRate}/hour`
          : `Professional ${service.serviceName.toLowerCase()} services`,
        image: service.categoryType?.image?.url || "/LandingService/image (7).png",
        hourlyRate: service.hourlyRate,
        providerId: service.providerId,
      }));
  }, [data, isLoading, isError]);

  // Determine loading state
  const currentLoading = serviceType ? providersLoading : isLoading;
  const currentError = serviceType ? providersError : isError;

  // Handle provider card click
  const handleProviderClick = (provider) => {
    if (!isAuthenticated) {
      setSelectedService(provider);
      setIsAuthModalOpen(true);
    } else {
      router.push(`/providerprofile?id=${provider.id}&service=${encodeURIComponent(provider.serviceName)}`);
    }
  };

  // Handle service card click (fallback)
  const handleServiceClick = (service) => {
    if (!isAuthenticated) {
      setSelectedService(service);
      setIsAuthModalOpen(true);
    } else {
      if (service.providerId && (service.serviceName || service.title)) {
        router.push(
          `/providerprofile?id=${service.providerId}&service=${encodeURIComponent(
            service.serviceName || service.title
          )}`
        );
      } else {
        router.push('/providerprofile');
      }
    }
  };

  return (
    <div className="bg-linear-to-br from-teal-50 to-gray-50 py-16 px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        {/* Decorative dotted border container */}
        <div className="">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              {serviceType ? `${serviceType} Providers` : 'Our Services'}
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              {serviceType
                ? `Find the best ${serviceType.toLowerCase()} professionals in your area`
                : 'You have problems with leaking pipes, broken tiles, lost keys or want to tidy up the trees around you, of course you need our help!'}
            </p>

            {/* Zip Code Search for Providers */}
            {serviceType && (
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
                <div className="flex items-center gap-2 bg-white rounded-lg px-4 py-2 shadow-sm border border-gray-200">
                  <MapPin className="w-5 h-5 text-teal-600" />
                  <input
                    type="text"
                    value={localZipCode}
                    onChange={(e) => setLocalZipCode(e.target.value)}
                    placeholder="Enter zip code"
                    className="border-none outline-none text-gray-900 placeholder:text-gray-400 w-32"
                  />
                </div>
                <Button
                  onClick={() => refetchProviders()}
                  className="bg-teal-600 hover:bg-teal-700 text-white px-6"
                >
                  Search
                </Button>
              </div>
            )}

            {/* Summary info */}
            {serviceType && providersData?.summary && (
              <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-sm text-gray-600">
                <span>
                  Found <strong className="text-teal-600">{providersData.summary.totalMatches || 0}</strong> providers
                </span>
                {providersData.summary.availableNow > 0 && (
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    {providersData.summary.availableNow} available now
                  </span>
                )}
                {providersData.summary.priceRange && (
                  <span>
                    ${providersData.summary.priceRange.min} - ${providersData.summary.priceRange.max}/hr
                  </span>
                )}
              </div>
            )}

            {!serviceType && data?.zipCode && (
              <p className="text-teal-600 font-medium mt-2">
                Showing services near {data.zipCode}
              </p>
            )}
          </div>

          {/* Loading State */}
          {currentLoading && (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
            </div>
          )}

          {/* Error State */}
          {currentError && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 text-center">
              <p className="text-amber-800">
                {serviceType
                  ? 'Unable to load providers. Please try again.'
                  : 'Unable to load nearby services. Showing default services instead.'}
              </p>
            </div>
          )}

          {/* Provider Cards Grid (when serviceType is provided) */}
          {serviceType && !currentLoading && providers.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {providers.map((provider, index) => (
                <div
                  key={provider.id || index}
                  onClick={() => handleProviderClick(provider)}
                  className="bg-white rounded-3xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer overflow-hidden"
                >
                  {/* Image Container */}
                  <div className="pt-6 px-6">
                    <div className="relative w-full h-48 rounded-2xl overflow-hidden bg-gray-100">
                      <Image
                        src={provider.businessLogo || "/LandingService/image (7).png"}
                        alt={provider.businessName}
                        fill
                        className="object-cover"
                      />
                      {/* Availability Badge */}
                      {provider.availability && (
                        <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                          Available
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Business Name and Service */}
                    <div className="mb-3">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {provider.businessName}
                      </h3>
                      <p className="text-teal-600 font-medium text-sm">
                        {provider.serviceName}
                      </p>
                    </div>

                    {/* Rating and Reviews */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-gray-900 font-semibold">
                          {provider.rating.toFixed(1)}
                        </span>
                      </div>
                      <span className="text-gray-500 text-sm">
                        ({provider.totalReviews} reviews)
                      </span>
                      {provider.totalJobsCompleted > 0 && (
                        <span className="text-gray-500 text-sm">
                          • {provider.totalJobsCompleted} jobs
                        </span>
                      )}
                    </div>

                    {/* Location */}
                    {(provider.city || provider.state) && (
                      <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
                        <MapPin className="w-4 h-4" />
                        <span>
                          {[provider.city, provider.state].filter(Boolean).join(', ')}
                        </span>
                      </div>
                    )}

                    {/* Hourly Rate and Response Time */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <span className="bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-sm font-semibold">
                        ${provider.hourlyRate}/hr
                      </span>
                      {provider.estimatedResponseTime && (
                        <div className="flex items-center gap-1 text-gray-500 text-sm">
                          <Clock className="w-4 h-4" />
                          <span>{provider.estimatedResponseTime}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No Providers Found */}
          {serviceType && !currentLoading && providers.length === 0 && !currentError && (
            <div className="text-center py-16">
              <div className="text-gray-400 mb-4">
                <MapPin className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No providers found
              </h3>
              <p className="text-gray-600 mb-4">
                {localZipCode
                  ? `No ${serviceType} providers available in ${localZipCode}`
                  : `Enter a zip code to find ${serviceType} providers in your area`}
              </p>
            </div>
          )}

          {/* Services Grid (Fallback when no serviceType) */}
          {!serviceType && !currentLoading && services.length === 0 && !currentError && (
            <div className="text-center py-16">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No providers available
              </h3>
              <p className="text-gray-600">
                There’s no provider providing any services in your area.
              </p>
            </div>
          )}

          {!serviceType && !currentLoading && services.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {services.map((service, index) => (
                <div
                  key={index}
                  onClick={() => handleServiceClick(service)}
                  className="bg-white rounded-3xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer"
                >
                  {/* Image Container with padding */}
                  <div className="pt-6 px-6">
                    <div className="relative w-full h-48 rounded-2xl hover:scale-105 transition-all duration-300 overflow-hidden">
                      <Image
                        src={service.image}
                        alt={service.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Title and Rate */}
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-2xl font-bold text-gray-900">
                        {service.title}
                      </h3>
                      {service.hourlyRate && (
                        <span className="bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-sm font-semibold whitespace-nowrap ml-2">
                          ${service.hourlyRate}/hr
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 text-base leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Auth Prompt Modal */}
      <AuthPromptModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        serviceData={selectedService}
      />
    </div>
  );
}
