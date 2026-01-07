"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import AuthPromptModal from "@/components/Global/Modals/AuthPromptModal";
import { useRouter } from "next/navigation";
import { useGetServicesWithProvidersQuery } from "@/redux/api/servicesApi";
import { toast } from "react-hot-toast";

// Helper function to shuffle array randomly
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export default function OurServicesSection() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {
    data: servicesData,
    isLoading: isServicesLoading,
    isError: isServicesError,
  } = useGetServicesWithProvidersQuery();

  const getSafeImageSrc = (image) => {
    // Handle string URLs, object URLs (e.g., { url }), and fall back when empty
    if (typeof image === "string" && image.trim()) return image.trim();
    if (image && typeof image.url === "string" && image.url.trim())
      return image.url.trim();
    return "/LandingService/image (7).png";
  };

  useEffect(() => {
    if (isServicesLoading) {
      setLoading(true);
      return;
    }
    if (isServicesError) {
      setError("Failed to fetch services");
      setLoading(false);
      return;
    }
    const apiServices = servicesData?.services || [];
    const withProviders = apiServices.flatMap((service) => {
      const providers = Array.isArray(service.providers)
        ? service.providers
        : [];
      if (providers.length === 0) {
        return [
          {
            ...service,
            providerId: null,
          },
        ];
      }
      return providers.map((providerId) => ({
        ...service,
        providerId,
      }));
    });
    const randomServices = shuffleArray(withProviders).slice(0, 6);
    setServices(randomServices);
    setError(null);
    setLoading(false);
  }, [isServicesLoading, isServicesError, servicesData]);

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
              You have problems with leaking pipes, broken tiles, lost keys or
              want to tidy up the trees around you, of course you need our help!
            </p>
          </div>

          {/* Services Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-500">{error}</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {services.map((service, index) => {
                const handleClick = (e) => {
                  e.preventDefault();
                  if (!service.providerId) {
                    toast.error(
                      "No provider available for this service in your area"
                    );
                    return;
                  }
                  if (!isAuthenticated) {
                    setSelectedService(service);
                    setIsAuthModalOpen(true);
                  } else {
                    // Route to provider profile for authenticated users
                    router.push(
                      `/providerprofile?id=${
                        service.providerId
                      }&service=${encodeURIComponent(
                        service.name || service.title
                      )}`
                    );
                  }
                };

                return (
                  <div
                    key={`${service._id || "service"}-${index}`}
                    onClick={handleClick}
                    className="bg-white rounded-3xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer"
                  >
                    {/* Image Container with padding */}
                    <div className="pt-6 px-6">
                      <div className="relative w-full h-48 rounded-2xl hover:scale-105 transition-all duration-300 overflow-hidden">
                        <Image
                          src={getSafeImageSrc(service.categoryType?.image)}
                          alt={service.name || service.title || "Service"}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute top-3 left-3">
                          {service.providerId ? (
                            <span className="bg-white/90 text-teal-700 px-3 py-1 rounded-full text-xs font-semibold shadow">
                              ${service.defaultHourlyRate || 0}/hr
                            </span>
                          ) : (
                            <span className="bg-white/90 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold shadow">
                              No providers available
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      {/* Title */}
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">
                        {service.name || service.title}
                      </h3>

                      {/* Description */}
                      <p className="text-gray-600 text-base leading-relaxed">
                        {service.description ||
                          "Professional service available for your needs"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* CTA Button */}
          <div className="text-center">
            <Link href="/our-services">
              <Button
                variant="outline"
                className="border-2 border-teal-600 text-teal-600 hover:bg-teal-50 rounded-full px-8 py-6 text-base font-semibold"
              >
                Explore more service
              </Button>
            </Link>
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
