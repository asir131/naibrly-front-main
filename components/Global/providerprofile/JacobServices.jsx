'use client';
import clean from "@/public/clean.png";

export default function JacobsOtherServices() {
  const services = [
    {
      id: 1,
      title: "Appliance Repairs",
      description: "Please add your content here. Keep it short and simple. And smile :)",
      image: clean.src
    },
    {
      id: 2,
      title: "Appliance Repairs",
      description: "Please add your content here. Keep it short and simple. And smile :)",
      image: clean.src
    },
    {
      id: 3,
      title: "Appliance Repairs",
      description: "Please add your content here. Keep it short and simple. And smile :)",
      image: clean.src
    }
  ];

  return (
    <div className="w-full bg-gray-50 ">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Jacob's Other Services</h2>
        
        <div className="space-y-4">
          {services.map((service) => (
            <div 
              key={service.id}
              className="bg-white rounded-lg p-6 flex gap-6 items-start hover:shadow-md transition-shadow"
            >
              {/* Service Image */}
              <img 
                  src={service.image}
                  alt={service.title}
                  className="w-28 h-28 rounded-lg object-cover"
                />
              
              

              {/* Service Details */}
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}