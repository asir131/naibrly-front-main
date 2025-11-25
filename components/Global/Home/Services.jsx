'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import AuthPromptModal from '@/components/Global/Modals/AuthPromptModal';
import { useRouter } from 'next/navigation';

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

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('https://naibrly-backend.onrender.com/api/categories/services');
        if (!response.ok) {
          throw new Error('Failed to fetch services');
        }
        const data = await response.json();
        // API returns { success: true, data: { services: [...] } }
        const servicesArray = data?.data?.services || [];
        // Shuffle and take 6 random services
        const randomServices = shuffleArray(servicesArray).slice(0, 6);
        setServices(randomServices);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

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
          </div>

          {/* Services Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-500">
              {error}
            </div>
          ) : (
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
                    key={service._id || index}
                    onClick={handleClick}
                    className="bg-white rounded-3xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer"
                  >
                    {/* Image Container with padding */}
                    <div className="pt-6 px-6">
                      <div className="relative w-full h-48 rounded-2xl hover:scale-105 transition-all duration-300 overflow-hidden">
                        <Image
                          src={service.image || "/LandingService/image (7).png"}
                          alt={service.name || service.title}
                          fill
                          className="object-cover"
                        />
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
                        {service.description || 'Professional service available for your needs'}
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