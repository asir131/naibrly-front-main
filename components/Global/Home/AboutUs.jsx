'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [autoplay, setAutoplay] = useState(true);

  const testimonials = [
    {
      id: 1,
      name: 'Mike taylor',
      location: 'Lahore, Pakistan',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
      text: 'Vitalli assembled the IKEA Norli drawer chest for me in less than 30 minutes, and he assembled a metal wire shelving unit as well in about 10 minutes. He also fixed a drawer on an already assembled desk so it'
    },
    {
      id: 2,
      name: 'Chris Thomas',
      location: 'CEO of Red Button',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
      text: 'Exceptional service! The team was professional, efficient, and went above and beyond to ensure everything was perfect. Highly recommend their services to anyone looking for quality home care solutions.'
    },
    {
      id: 3,
      name: 'Sarah Johnson',
      location: 'New York, USA',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
      text: 'Amazing experience from start to finish. The technician arrived on time, was very knowledgeable, and completed the work efficiently. Will definitely use Naibrly again for future home service needs.'
    }
  ];

  // Autoplay functionality
  useEffect(() => {
    if (!autoplay) return;

    const interval = setInterval(() => {
      handleNext();
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [currentIndex, autoplay]);

  const handlePrevious = () => {
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
    setTimeout(() => setIsAnimating(false), 600);
  };

  const handleNext = () => {
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
    setTimeout(() => setIsAnimating(false), 600);
  };

  const currentTestimonial = testimonials[currentIndex];
  const nextTestimonial = testimonials[(currentIndex + 1) % testimonials.length];
  const afterNextTestimonial = testimonials[(currentIndex + 2) % testimonials.length];

  return (
    <>
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-in-out;
        }
        @keyframes slideForward {
          from {
            transform: translateX(40px) translateY(8px);
            opacity: 0.6;
          }
          to {
            transform: translateX(0) translateY(0);
            opacity: 1;
          }
        }
        .animate-slideForward {
          animation: slideForward 0.6s ease-out;
        }
        @keyframes smoothSlideIn {
          from {
            opacity: 0;
            transform: translateX(100px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }
        @keyframes smoothSlideOut {
          from {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
          to {
            opacity: 0;
            transform: translateX(-100px) scale(0.9);
          }
        }
        @keyframes imageFloat {
          0%, 100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-10px) scale(1.05);
          }
        }
        @keyframes cardStack {
          from {
            transform: translateY(0) translateX(0);
            opacity: 0.8;
          }
          to {
            transform: translateY(12px) translateX(40px);
            opacity: 1;
          }
        }
        .animate-smoothSlideIn {
          animation: smoothSlideIn 0.7s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .animate-imageFloat {
          animation: imageFloat 3s ease-in-out infinite;
        }
        .animate-cardStack {
          animation: cardStack 0.6s ease-out;
        }
        /* Pause animation on hover */
        .testimonial-container:hover .animate-imageFloat {
          animation-play-state: paused;
        }
      `}</style>

    <div className="bg-linear-to-br from-teal-50 to-gray-50 py-16 px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <h2
              style={{
                color: 'var(--Text-Primary-Text, #333)',
                fontFamily: 'var(--Family-Font, Inter)',
                fontSize: '72px',
                fontStyle: 'normal',
                fontWeight: 600,
                lineHeight: 'normal'
              }}
            >
              What people say{' '}
              <span
                style={{
                  color: 'var(--Primary, #0E7A60)',
                  fontFamily: 'var(--Family-Font, Inter)',
                  fontSize: '72px',
                  fontStyle: 'normal',
                  fontWeight: 600,
                  lineHeight: 'normal'
                }}
              >
                about Us.
              </span>
            </h2>

            <p className="text-gray-600 text-3xl leading-relaxed">
              Our Clients send us bunch of smiles with our services and we love them.
            </p>

            {/* Navigation Buttons */}
            <div className="flex gap-3 items-center">
              <Button
                onClick={handlePrevious}
                onMouseEnter={() => setAutoplay(false)}
                onMouseLeave={() => setAutoplay(true)}
                variant="outline"
                size="icon"
                className="rounded-full border-2 border-gray-300 hover:border-teal-600 hover:bg-teal-50 w-12 h-12 transition-all duration-300 hover:scale-110"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button
                onClick={handleNext}
                onMouseEnter={() => setAutoplay(false)}
                onMouseLeave={() => setAutoplay(true)}
                size="icon"
                className="rounded-full bg-teal-600 hover:bg-teal-700 text-white w-12 h-12 transition-all duration-300 hover:scale-110"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>

              {/* Autoplay indicator */}
              <button
                onClick={() => setAutoplay(!autoplay)}
                className="ml-2 text-xs text-gray-500 hover:text-teal-600 transition-colors"
                title={autoplay ? "Pause autoplay" : "Resume autoplay"}
              >
                {autoplay ? (
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-teal-600 rounded-full animate-pulse"></div>
                    <span>Auto</span>
                  </div>
                ) : (
                  <span>Manual</span>
                )}
              </button>
            </div>
          </div>

          {/* Right Testimonial Card */}
          <div
            className="relative pl-12 pb-18 testimonial-container"
            onMouseEnter={() => setAutoplay(false)}
            onMouseLeave={() => setAutoplay(true)}
          >
            {/* Profile Image */}
            <div className="absolute top-[-30px] left-0 z-20 transition-all duration-600">
              <img
                key={currentTestimonial.id}
                src={currentTestimonial.image}
                alt={currentTestimonial.name}
                className="w-24 h-24 rounded-full mb-16 border-4 border-white shadow-2xl object-cover animate-smoothSlideIn hover:animate-imageFloat"
              />
            </div>

            {/* Main Testimonial Card */}
            <div className="relative bg-white rounded-2xl p-10 pl-20 shadow-2xl z-10 transition-all duration-600 hover:shadow-3xl hover:scale-[1.02]">
              {/* Testimonial Text */}
              <div key={currentTestimonial.id} className="animate-smoothSlideIn">
                <p className="text-gray-800 text-lg font-medium leading-relaxed mb-8">
                  {currentTestimonial.text}
                </p>

                {/* Author Info */}
                <div>
                  <h4 className="font-bold text-gray-900 text-xl mb-1">
                    {currentTestimonial.name}
                  </h4>
                  <p className="text-gray-400 text-base">
                    {currentTestimonial.location}
                  </p>
                </div>
              </div>
            </div>

            {/* Ghost Card 1 - Middle Layer (Next Testimonial) */}
            <div className="absolute top-12 left-40 right-[-40px] h-[calc(100%-3rem)] bg-gray-200 rounded-2xl shadow-lg z-[5] pointer-events-none transition-all duration-700 overflow-hidden animate-cardStack">
              <div key={nextTestimonial.id} className="p-10 pl-20 transition-all duration-600">
                <p className="text-gray-600 text-lg font-medium leading-relaxed mb-8 opacity-70">
                  {nextTestimonial.text}
                </p>
                <div>
                  <h4 className="font-bold text-gray-700 text-xl mb-1">
                    {nextTestimonial.name}
                  </h4>
                  <p className="text-gray-500 text-base">
                    {nextTestimonial.location}
                  </p>
                </div>
              </div>
            </div>
            {/* Dot Indicators */}
            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setIsAnimating(true);
                    setCurrentIndex(index);
                    setAutoplay(false);
                    setTimeout(() => {
                      setIsAnimating(false);
                      setAutoplay(true);
                    }, 600);
                  }}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'bg-teal-600 w-8 shadow-lg'
                      : 'bg-gray-300 hover:bg-gray-400 w-2 hover:w-4'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}