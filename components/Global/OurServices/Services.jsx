'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import AuthPromptModal from '@/components/Global/Modals/AuthPromptModal';
import { useRouter } from 'next/navigation';
import { useGetNearbyServicesQuery } from '@/redux/api/servicesApi';

export default function OurServicesSection() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  // Fetch nearby services from API
  const { data, isLoading, isError } = useGetNearbyServicesQuery({ limit: 15 });

  // Fallback static services for when API fails or is loading
  const fallbackServices = [
    {
      title: 'Appliance Repairs',
      description: 'Expert repair services for all your home appliances',
      image: "/LandingService/image (7).png",
      hourlyRate: null,
    },
    {
      title: 'House Cleaning',
      description: 'Professional cleaning services for your home',
      image: "/LandingService/image (7).png",
      hourlyRate: null,
    },
    {
      title: 'Window Washing',
      description: 'Crystal clear window cleaning services',
      image: "/LandingService/image (7).png",
      hourlyRate: null,
    },
    {
      title: 'Bathroom Remodeling',
      description: 'Complete bathroom renovation services',
      image: "/LandingService/image (7).png",
      hourlyRate: null,
    },
    {
      title: 'Landscaping Design',
      description: 'Beautiful landscape design and maintenance',
      image: "/LandingService/image (7).png",
      hourlyRate: null,
    },
    {
      title: 'TV Mounting',
      description: 'Professional TV installation and mounting',
      image: "/LandingService/image (7).png",
      hourlyRate: null,
    }
  ];

  // Transform API data to match component structure
  const services = React.useMemo(() => {
    if (isLoading || isError || !data?.services || data.services.length === 0) {
      return fallbackServices;
    }

    return data.services
      .filter(service => service.serviceName) // Only include services with names
      .map(service => ({
        title: service.serviceName,
        description: service.hourlyRate
          ? `Professional ${service.serviceName.toLowerCase()} services - $${service.hourlyRate}/hour`
          : `Professional ${service.serviceName.toLowerCase()} services`,
        image: "/LandingService/image (7).png",
        hourlyRate: service.hourlyRate,
        providerId: service.providerId,
      }));
  }, [data, isLoading, isError]);

  return (
    <div className="bg-linear-to-br from-teal-50 to-gray-50 py-16 px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        {/* Decorative dotted border container */}
        <div className="">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Our Services
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              You have problems with leaking pipes, broken tiles, lost keys or want to tidy up the trees around you, of course you need our help!
            </p>
            {data?.zipCode && (
              <p className="text-teal-600 font-medium mt-2">
                Showing services near {data.zipCode}
              </p>
            )}
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
            </div>
          )}

          {/* Error State */}
          {isError && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 text-center">
              <p className="text-amber-800">
                Unable to load nearby services. Showing default services instead.
              </p>
            </div>
          )}

          {/* Services Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {services.map((service, index) => {
              const handleClick = (e) => {
                e.preventDefault();
                if (!isAuthenticated) {
                  setSelectedService(service);
                  setIsAuthModalOpen(true);
                } else {
                  // Route to provider profile for authenticated users
                  router.push('/providerprofile');
                }
              };

              return (
                <div
                  key={index}
                  onClick={handleClick}
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
              );
            })}
          </div>
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