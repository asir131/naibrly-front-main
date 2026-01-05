'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import clean from "@/public/clean.png";

export default function JacobsOtherServices({ otherServices, providerName, providerId, isLoading }) {
  const router = useRouter();

  const handleServiceSelect = (service) => {
    if (!providerId || !service?.name) return;
    router.push(`/providerprofile?id=${providerId}&service=${encodeURIComponent(service.name)}`);
  };
  // Loading state
  if (isLoading) {
    return (
      <div className="w-full bg-gradient-to-br from-gray-50 to-blue-50 py-16 px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="h-10 bg-gray-200 rounded w-64 animate-pulse"></div>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-md animate-pulse">
                <div className="flex gap-6 items-start">
                  <div className="w-28 h-28 bg-gray-200 rounded-xl shrink-0"></div>
                  <div className="flex-1 space-y-3">
                    <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // No other services or empty
  if (!otherServices || otherServices.length === 0) {
    return (
      <div className="w-full bg-gradient-to-br from-gray-50 to-blue-50 py-16 px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              {providerName ? `${providerName}'s Other Services` : 'Other Services'}
            </h2>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-md text-center">
            <p className="text-gray-500">No other services available from this provider.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gradient-to-br from-gray-50 to-blue-50 py-16 px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
            {providerName ? `${providerName}'s Other Services` : 'Other Services'}
          </h2>
        </div>

        {/* Services List */}
        <div className="space-y-4">
          {otherServices.map((service, index) => (
            <div
              key={service._id || index}
              className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
              onClick={() => handleServiceSelect(service)}
            >
              <div className="flex gap-6 items-start">
                {/* Service Image */}
                <div className="relative w-28 h-28 rounded-xl overflow-hidden shrink-0">
                  <Image
                    src={service?.image?.url || clean}
                    alt={service.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Service Details */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {service.name}
                    </h3>
                    <span className="bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-sm font-semibold">
                      ${service.hourlyRate}/hr
                    </span>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    Professional {service.name.toLowerCase()} services available
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
