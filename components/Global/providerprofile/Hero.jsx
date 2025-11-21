"use client";
import { useState } from "react";
import { MapPin, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import clean from "@/public/clean.png";
import RequestModal from "./RequestModal";

export default function ServiceCard({ providerData, selectedService, isLoading, isError }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Get rating label based on rating value
  const getRatingLabel = (rating) => {
    if (rating >= 4.5) return "Exceptional";
    if (rating >= 4.0) return "Excellent";
    if (rating >= 3.5) return "Very Good";
    if (rating >= 3.0) return "Good";
    return "New";
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="w-full bg-gray-50 py-[50px] px-4 md:px-8 lg:px-[340px]">
        <div className="max-w-6xl mx-auto">
          <Card className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-12">
            <div className="animate-pulse flex flex-col md:flex-row gap-6 items-start">
              <div className="w-32 h-32 bg-gray-200 rounded-md flex-shrink-0"></div>
              <div className="flex-1 space-y-4">
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="flex flex-col items-end gap-4">
                <div className="h-8 bg-gray-200 rounded w-24"></div>
                <div className="h-10 bg-gray-200 rounded w-32"></div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Error state or no data
  if (isError || !providerData || !selectedService) {
    return (
      <div className="w-full bg-gray-50 py-[50px] px-4 md:px-8 lg:px-[340px]">
        <div className="max-w-6xl mx-auto">
          <Card className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-12 text-center">
            <p className="text-gray-500">Unable to load provider information. Please try again.</p>
          </Card>
        </div>
      </div>
    );
  }

  const rating = providerData.rating || 0;
  const totalReviews = providerData.totalReviews || 0;
  const hourlyRate = selectedService.hourlyRate || 0;

  return (
    <>
      <div className="w-full bg-gray-50 py-[50px] px-4 md:px-8 lg:px-[340px]">
        <div className="max-w-6xl mx-auto">
          <Card className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-12">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="flex-shrink-0">
                <img
                  src={clean.src}
                  alt={selectedService.name}
                  className="w-32 h-32 object-cover rounded-md"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-[18px] font-bold mb-2">
                  {selectedService.name}
                </h3>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-teal-600 font-semibold text-[15.75px]">
                    {getRatingLabel(rating)} {rating.toFixed(1)}
                  </span>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.round(rating)
                            ? "fill-teal-600 text-teal-600"
                            : "fill-gray-200 text-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-gray-500 text-sm">({totalReviews})</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11.9999 13.4295C13.723 13.4295 15.1199 12.0326 15.1199 10.3095C15.1199 8.58633 13.723 7.18945 11.9999 7.18945C10.2768 7.18945 8.87988 8.58633 8.87988 10.3095C8.87988 12.0326 10.2768 13.4295 11.9999 13.4295Z"
                      stroke="#0E7A60"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M3.6202 8.49C5.5902 -0.169998 18.4202 -0.159997 20.3802 8.5C21.5302 13.58 18.3702 17.88 15.6002 20.54C13.5902 22.48 10.4102 22.48 8.3902 20.54C5.6302 17.88 2.4702 13.57 3.6202 8.49Z"
                      stroke="#0E7A60"
                      strokeWidth="1.5"
                    />
                  </svg>
                  <span className="text-[#666] text-[16px] mb-2">
                    {providerData.businessName}
                  </span>
                </div>
                <div>
                  <span className="text-[#676D73] text-[15.75px]">
                    <p>Professional {selectedService.name.toLowerCase()} services provided by {providerData.businessName}</p>
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-4 md:min-w-[180px]">
                <div className="text-right">
                  <div className="text-xl font-semibold text-gray-900">${hourlyRate}/hr</div>
                  <div className="text-[18px] text-gray-500">Hourly Rate</div>
                </div>
                <div className="py-6">
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-6 transition-colors whitespace-nowrap rounded-lg"
                  >
                    Naibrly Now
                  </button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Request Modal */}
      <RequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        providerName={providerData.businessName}
        serviceName={selectedService.name}
        providerId={providerData.id}
        serviceId={selectedService._id}
        hourlyRate={hourlyRate}
      />
    </>
  );
}
