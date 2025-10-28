'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import AuthPromptModal from '@/components/Global/Modals/AuthPromptModal';
import { useRouter } from 'next/navigation';

export default function OurServicesSection() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const services = [
    {
      title: 'Appliance Repairs',
      description: 'Drain pipe leaking, pipe clogged, replace the pipe line',
      image: "/LandingService/image (7).png",
    },
    {
      title: 'House Cleaning',
      description: 'Drain pipe leaking, pipe clogged, replace the pipe line',
      image: "/LandingService/image (7).png",
    },
    {
      title: 'Window Washing',
      description: 'Drain pipe leaking, pipe clogged, replace the pipe line',
      image: "/LandingService/image (7).png",
    },
    {
      title: 'Bathroom Remodeling',
      description: 'Drain pipe leaking, pipe clogged, replace the pipe line',
      image: "/LandingService/image (7).png",
    },
    {
      title: 'Landscaping Design',
      description: 'Drain pipe leaking, pipe clogged, replace the pipe line',
      image: "/LandingService/image (7).png",
    },
    {
      title: 'TV Mounting',
      description: 'Drain pipe leaking, pipe clogged, replace the pipe line',
      image: "/LandingService/image (7).png",
    }
  ];

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
                    {/* Title */}
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      {service.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 text-base leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

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