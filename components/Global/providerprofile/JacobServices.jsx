'use client';
import Image from 'next/image';
import clean from "@/public/clean.png";

export default function JacobsOtherServices() {
  const services = [
    {
      id: 1,
      title: "Appliance Repairs",
      description: "Please add your content here. Keep it short and simple. And smile :)",
      image: clean
    },
    {
      id: 2,
      title: "Appliance Repairs",
      description: "Please add your content here. Keep it short and simple. And smile :)",
      image: clean
    },
    {
      id: 3,
      title: "Appliance Repairs",
      description: "Please add your content here. Keep it short and simple. And smile :)",
      image: clean
    }
  ];

  return (
    <div className="w-full bg-gradient-to-br from-gray-50 to-blue-50 py-16 px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
            Jacob's Other Services
          </h2>
        </div>

        {/* Services List */}
        <div className="space-y-4">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex gap-6 items-start">
                {/* Service Image */}
                <div className="relative w-28 h-28 rounded-xl overflow-hidden flex-shrink-0">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Service Details */}
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {service.description}
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