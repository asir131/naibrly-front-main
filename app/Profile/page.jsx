'use client';
import React, { useState } from 'react';
import { Star, MapPin, Briefcase, CheckCircle, Clock, MessageCircle } from 'lucide-react';

export default function ServicePage() {
  const [selectedService, setSelectedService] = useState('Plumbing Drain Repair');
  const [zipCode, setZipCode] = useState('94040');
  const [selectedDrain, setSelectedDrain] = useState('');
  const [selectedUrgency, setSelectedUrgency] = useState('');
  const [selectedNumber, setSelectedNumber] = useState('');

  return (
    <div className="min-h-screen bg-white py-8 px-4 md:px-8 ">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Section */}
        <div className="lg:col-span-1 space-y-9">
          {/* Header with Profile */}
          <div className="flex items-start gap-6">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=140&h=140&fit=crop"
              alt="Olex Fix"
              className="w-32 h-32 rounded-full object-cover flex-shrink-0"
            />
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-3">Olex Fix</h1>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl font-bold text-teal-600">5.0</span>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-teal-600 text-teal-600" />
                  ))}
                </div>
                <span className="text-sm text-gray-600">(139)</span>
              </div>
              <div className="text-lg font-semibold">169 <span className="text-gray-600 font-normal">hires</span></div>
            </div>
          </div>

          {/* About */}
          <div>
            <h2 className="text-lg font-bold mb-3">About</h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              We are the repipe , water heater and Trenchless pipe bursting drain experts. We offer FREE sewer camera inspections. Based in Northern California offering free estimates, fair rates, and superior workmanship. Our team has been servicing the Bay Area for over 15 years. Our company is licensed, bonded, and insured. Our specialists are eq...
              <button className="text-teal-600 font-semibold hover:underline ml-1">Read More</button>
            </p>
          </div>

          {/* Overview */}
          <div>
            <h2 className="text-lg font-bold mb-4">Overview</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Briefcase className="w-5 h-5 text-gray-700 flex-shrink-0" />
                <span className="text-sm text-gray-700">Hired 169 times</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gray-700 flex-shrink-0" />
                <span className="text-sm text-gray-700">4 similar jobs done near you</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-gray-700 flex-shrink-0" />
                <span className="text-sm text-gray-700">Background checked</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-gray-700 flex-shrink-0" />
                <span className="text-sm text-gray-700">License verified</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-gray-700 flex-shrink-0" />
                <span className="text-sm text-gray-700">10 years in experience</span>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div>
            <h2 className="text-lg font-bold mb-3">Payment methods</h2>
            <p className="text-sm text-gray-700">
              This pro accepts payments via Apple Pay, Cash, Check, Credit card, Google Pay, Square cash app, and Venmo.
            </p>
          </div>

          {/* Top Pro Status */}
          <div>
            <h2 className="text-lg font-bold mb-3">Top Pro status</h2>
            <p className="text-sm text-gray-700">
              Top Pros are among the highest-rated, most popular professionals on Thumbtack.
            </p>
          </div>

          {/* Business Hours */}
          <div>
            <h2 className="text-lg font-bold mb-4">Business hours</h2>
            <div className="bg-gray-50 p-4 rounded-lg space-y-3 mb-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-700">Sun</span>
                <span className="text-gray-700">5:00 am - 11:59 pm</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-700">Mon</span>
                <span className="text-gray-700">5:00 am - 11:59 pm</span>
              </div>
            </div>
            <button className="text-teal-600 text-sm font-semibold hover:underline">Read more</button>
          </div>

          {/* Request Quote Button */}
          <button className="w-full border-2 border-gray-300 text-teal-600 py-3 rounded-lg font-semibold hover:bg-gray-50 flex items-center justify-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Request a quote
          </button>
        </div>

        {/* Right Section - Form */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-lg p-8 sticky top-8">
            {/* Header */}
            <div className="flex items-center gap-2 mb-8 pb-4 border-b-4 border-teal-500">
              <MessageCircle className="w-5 h-5 text-gray-600" />
              <span className="text-gray-600 font-medium">Contact for price</span>
            </div>

            {/* Form Fields */}
            <div className="space-y-6">
              {/* Select a service */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Select a service</label>
                <select
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 font-medium appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500"
                  style={{
                    backgroundImage: "url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22currentColor%22 stroke-width=%222%22%3e%3cpolyline points=%226 9 12 15 18 9%22%3e%3c/polyline%3e%3c/svg%3e')",
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 1rem center',
                    backgroundSize: '1.5em 1.5em',
                    paddingRight: '2.5rem'
                  }}
                >
                  <option>Plumbing Drain Repair</option>
                  <option>Sewer Camera Inspection</option>
                </select>
              </div>

              {/* Zip code */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Zip code</label>
                <input
                  type="text"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  placeholder="94040"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-700"
                />
              </div>

              {/* Drain problem */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Drain problem</label>
                <select
                  value={selectedDrain}
                  onChange={(e) => setSelectedDrain(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-600 font-medium appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500"
                  style={{
                    backgroundImage: "url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22currentColor%22 stroke-width=%222%22%3e%3cpolyline points=%226 9 12 15 18 9%22%3e%3c/polyline%3e%3c/svg%3e')",
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 1rem center',
                    backgroundSize: '1.5em 1.5em',
                    paddingRight: '2.5rem'
                  }}
                >
                  <option value="">Select answer(s)</option>
                  <option>Clogged Drain</option>
                </select>
              </div>

              {/* Repair urgency */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Repair urgency</label>
                <select
                  value={selectedUrgency}
                  onChange={(e) => setSelectedUrgency(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-600 font-medium appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500"
                  style={{
                    backgroundImage: "url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22currentColor%22 stroke-width=%222%22%3e%3cpolyline points=%226 9 12 15 18 9%22%3e%3c/polyline%3e%3c/svg%3e')",
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 1rem center',
                    backgroundSize: '1.5em 1.5em',
                    paddingRight: '2.5rem'
                  }}
                >
                  <option value="">Select answer</option>
                  <option>Emergency</option>
                </select>
              </div>

              {/* Number of issue drains */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Number of issue drains</label>
                <select
                  value={selectedNumber}
                  onChange={(e) => setSelectedNumber(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-600 font-medium appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500"
                  style={{
                    backgroundImage: "url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22currentColor%22 stroke-width=%222%22%3e%3cpolyline points=%226 9 12 15 18 9%22%3e%3c/polyline%3e%3c/svg%3e')",
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 1rem center',
                    backgroundSize: '1.5em 1.5em',
                    paddingRight: '2.5rem'
                  }}
                >
                  <option value="">Select answer</option>
                  <option>1</option>
                </select>
              </div>

              {/* Request Estimate Button */}
              <button className="w-full bg-teal-600 hover:bg-teal-700 text-white py-4 rounded-lg font-bold text-base transition">
                Request estimate
              </button>

              {/* Offline status */}
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                <span className="text-sm text-gray-500">Offline Now</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}