'use client';

import React, { useState } from 'react';
import { 
  ChevronRight, ChevronLeft, MapPin, Clock, CheckCircle, Users, Star, 
  Check 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

export default function CaptainRooterFullPage() {
  // === State for CaptainRooterProfile ===
  const [profilePhotoIndex, setProfilePhotoIndex] = useState(0);
  const [selectedService, setSelectedService] = useState('');
  const [zipCode, setZipCode] = useState('94040');
  const [drainProblem, setDrainProblem] = useState('');
  const [urgency, setUrgency] = useState('');
  const [numDrains, setNumDrains] = useState('');

  // === State for ReviewsSection ===
  const [reviewPhotoIndex, setReviewPhotoIndex] = useState(0);

  // === State for ServicesOffered ===
  const [selectedDrainProblems, setSelectedDrainProblems] = useState([]);
  const [selectedRepairUrgency, setSelectedRepairUrgency] = useState([]);
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState([]);

  // === Data for Profile Photos ===
  const profilePhotos = [
    { id: 1, src: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=300&fit=crop', label: 'Drain repair project' },
    { id: 2, src: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=300&fit=crop', label: 'Pipe work' },
    { id: 3, src: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=300&fit=crop', label: 'Project showcase' }
  ];

  const nextProfilePhoto = () => {
    setProfilePhotoIndex((prev) => (prev + 1) % profilePhotos.length);
  };

  const prevProfilePhoto = () => {
    setProfilePhotoIndex((prev) => (prev - 1 + profilePhotos.length) % profilePhotos.length);
  };

  const visibleProfilePhotos = [
    profilePhotos[profilePhotoIndex],
    profilePhotos[(profilePhotoIndex + 1) % profilePhotos.length],
    profilePhotos[(profilePhotoIndex + 2) % profilePhotos.length]
  ];

  const handleRequestEstimate = () => {
    if (!selectedService || !zipCode || !drainProblem || !urgency || !numDrains) {
      alert('Please fill in all fields');
      return;
    }
    console.log({ selectedService, zipCode, drainProblem, urgency, numDrains });
  };

  // === Data for Review Photos ===
  const reviewPhotos = [
    'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=200&h=200&fit=crop',
    'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=200&h=200&fit=crop',
    'https://images.unsplash.com/photo-1584622281867-8d4d1d07587f?w=200&h=200&fit=crop',
    'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=200&h=200&fit=crop',
    'https://images.unsplash.com/photo-1584701821503-8c9cd36d4fef?w=200&h=200&fit=crop',
  ];

  const nextReviewPhoto = () => {
    setReviewPhotoIndex((prev) => (prev + 1) % reviewPhotos.length);
  };

  const prevReviewPhoto = () => {
    setReviewPhotoIndex((prev) => (prev - 1 + reviewPhotos.length) % reviewPhotos.length);
  };

  const visibleReviewPhotos = [
    reviewPhotos[reviewPhotoIndex % reviewPhotos.length],
    reviewPhotos[(reviewPhotoIndex + 1) % reviewPhotos.length],
    reviewPhotos[(reviewPhotoIndex + 2) % reviewPhotos.length],
    reviewPhotos[(reviewPhotoIndex + 3) % reviewPhotos.length],
    reviewPhotos[(reviewPhotoIndex + 4) % reviewPhotos.length],
  ];

  // === Services Offered Logic ===
  const drainProblems = [
    'Clogs', 'Slow drains', 'Leaks (area known)', 'Leaks (area unknown)',
    'Gurgles', 'Odors', 'Other drain issue', 'Larger plumbing system issues'
  ];

  const repairUrgencies = [
    { id: 'non-urgent', label: 'I work on non-urgent repairs' },
    { id: 'urgent', label: 'I work on urgent repairs' }
  ];

  const propertyTypes = [
    { id: 'house', label: 'House' },
    { id: 'townhouse', label: 'Townhouse' },
    { id: 'condo', label: 'Condo/Apartment' },
    { id: 'business', label: 'Business' }
  ];

  const toggleDrainProblem = (problem) => {
    setSelectedDrainProblems(prev =>
      prev.includes(problem)
        ? prev.filter(p => p !== problem)
        : [...prev, problem]
    );
  };

  const toggleRepairUrgency = (urgency) => {
    setSelectedRepairUrgency(prev =>
      prev.includes(urgency)
        ? prev.filter(u => u !== urgency)
        : [...prev, urgency]
    );
  };

  const togglePropertyType = (type) => {
    setSelectedPropertyTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const handleExportData = () => {
    const data = {
      drainProblems: selectedDrainProblems,
      repairUrgency: selectedRepairUrgency,
      propertyTypes: selectedPropertyTypes,
      timestamp: new Date().toISOString()
    };
    console.log('Services Data:', data);
    return data;
  };

  return (
    <>
      {/* === HEADER & PROFILE SECTION === */}
      <div className="bg-gray-50 min-h-screen p-4 md:p-8">
        <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-6 md:p-8">
            {/* Left Section */}
            <div className="lg:col-span-2 space-y-8">
              {/* Header */}
              <div className="flex flex-col sm:flex-row items-start gap-6">
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden flex-shrink-0 bg-gray-200 shadow-md">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop"
                    alt="Captain Rooter profile"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1">
                  <h1 className="text-3xl md:text-2xl font-bold mb-4">Captain Rooter</h1>

                  <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-start gap-4">
                        <span className="text-3xl font-bold text-[#0E7A60]">5.0</span>
                        <div className="flex flex-col items-start">
                          <div className="flex text-yellow-400 mb-1">
                            {[...Array(5)].map((_, i) => (
                              <svg key={i} xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none">
                                <path d="M8.84575 5.74612L7.56075 1.75812C7.53932 1.68398 7.49438 1.61881 7.4327 1.57244C7.37101 1.52606 7.29593 1.50098 7.21875 1.50098C7.14158 1.50098 7.06649 1.52606 7.00481 1.57244C6.94313 1.61881 6.89818 1.68398 6.87675 1.75812L5.59175 5.74412L1.57675 5.79312C1.23075 5.79712 1.08775 6.25912 1.36475 6.47512L4.58675 8.98812L3.38975 13.0061C3.28675 13.3511 3.66175 13.6361 3.94275 13.4271L7.21875 10.9941L10.4948 13.4291C10.7768 13.6381 11.1508 13.3531 11.0478 13.0071L9.85075 8.99012L13.0728 6.47712C13.3498 6.26112 13.2068 5.80012 12.8618 5.79512L8.84575 5.74712V5.74612Z" fill="#0E7A60" />
                              </svg>
                            ))}
                          </div>
                          <span className="text-sm text-gray-600">(139)</span>
                        </div>
                      </div>
                      <div className="text-center border-l border-gray-200 pl-4">
                        <span className="text-2xl font-bold text-gray-900 block">169</span>
                        <span className="text-sm text-gray-600 mt-1 block">hires</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* About */}
              <section>
                <h2 className="text-lg font-bold mb-3">About</h2>
                <p className="text-sm text-gray-700 leading-relaxed">
                  We are the repipe, water heater and Trenchless pipe bursting drain experts. We offer FREE sewer camera inspections. Based in Northern California offering free estimates, fair rates, and superior workmanship. Our team has been servicing the bay Area for over 15 years. Our company is licensed, bonded, and insured. Our specialists are on-
                  <button className="text-blue-600 hover:underline ml-1 font-medium">Read More</button>
                </p>
              </section>

              {/* Overview */}
              <section>
                <h2 className="text-lg font-bold mb-4">Overview</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex gap-3">
                    <Users className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-700">Hired 169 times</p>
                  </div>
                  <div className="flex gap-3">
                    <MapPin className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-700">4 similar jobs done near you</p>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-700">Background checked</p>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-700">License verified</p>
                  </div>
                  <div className="flex gap-3">
                    <Clock className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-700">10 years in experience</p>
                  </div>
                </div>
              </section>

              {/* Business Hours */}
              <section className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <h2 className="text-lg font-bold mb-4">Business hours</h2>
                <div className="space-y-2 text-sm">
                  <div className="flex">
                    <span className="text-gray-700 font-medium w-16">Sun</span>
                    <span className="text-gray-900">5:00 am - 11:59 pm</span>
                  </div>
                  <div className="flex">
                    <span className="text-gray-700 font-medium w-16">Mon</span>
                    <span className="text-gray-900">5:00 am - 11:59 pm</span>
                  </div>
                </div>
                <button className="text-blue-600 hover:underline text-sm mt-3 font-medium">Read more</button>
              </section>

              <Button variant="outline" className="w-full border-teal-600 text-teal-600 hover:bg-teal-50 font-medium">
                <CheckCircle className="w-4 h-4 mr-2" />
                Request a quote
              </Button>

              {/* Projects and Media */}
              <section>
                <h2 className="text-lg font-bold mb-4">Projects and media</h2>
                <p className="text-sm text-gray-600 mb-4">217 photos</p>

                <div className="relative bg-gray-100 rounded-lg overflow-hidden">
                  <div className="flex gap-3 overflow-hidden">
                    {visibleProfilePhotos.map((photo, idx) => (
                      <div
                        key={photo.id}
                        className="relative w-64 sm:w-80 h-48 sm:h-56 flex-shrink-0 rounded overflow-hidden"
                      >
                        <img src={photo.src} alt={photo.label} className="w-full h-full object-cover" />
                        {idx === 2 && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center hover:bg-black/60 transition-colors cursor-pointer">
                            <div className="text-center">
                              <p className="text-white font-semibold text-lg">See all</p>
                              <p className="text-white text-sm">(217)</p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={prevProfilePhoto}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100"
                    aria-label="Previous photo"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <button
                    onClick={nextProfilePhoto}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100"
                    aria-label="Next photo"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                    {profilePhotos.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setProfilePhotoIndex(idx)}
                        className={`w-2 h-2 rounded-full transition-colors ${idx === profilePhotoIndex ? 'bg-white' : 'bg-white/50'}`}
                        aria-label={`Go to photo ${idx + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </section>
            </div>

            {/* Right Section - Service Form */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-4 shadow-md">
                <div className="flex items-center mb-6">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.50001 2C4.02001 2 2.00001 4.02 2.00001 6.5C1.99913 7.16391 2.14549 7.81976 2.42856 8.4203C2.71163 9.02085 3.12435 9.55114 3.63701 9.973L4.00001 10.273V12.569L6.76901 10.997L7.01401 11.001H9.50001C11.981 11.001 14 8.981 14 6.501C14 4.02 11.981 2 9.50001 2H6.50001ZM2.00001 16.002V11.19C1.36668 10.5842 0.862882 9.85623 0.519108 9.05007C0.175333 8.24392 -0.00126444 7.37639 6.81483e-06 6.5C6.81483e-06 2.917 2.91601 0 6.50001 0H9.50001C13.084 0 16 2.916 16 6.5C16 10.085 13.084 13.002 9.50001 13.002H7.23901L2.00001 16.002Z" fill="#2F3033" />
                  </svg>
                  <button className="ml-2 text-[#676D73] text-sm font-semibold hover:underline transition-colors">
                    Contact for price
                  </button>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="text-[#2F3033] font-bold text-[13px] leading-[20px] mb-2 block">
                      Select a service
                    </label>
                    <Select value={selectedService} onValueChange={setSelectedService}>
                      <SelectTrigger className="w-full text-sm">
                        <SelectValue placeholder="Plumbing Drain Repair" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="drain">Plumbing Drain Repair</SelectItem>
                        <SelectItem value="pipe">Pipe Repair</SelectItem>
                        <SelectItem value="heater">Water Heater</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-[#2F3033] font-bold text-[13px] leading-[20px] mb-2 block">
                      Zip code
                    </label>
                    <Input
                      type="text"
                      placeholder="94040"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      className="text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-[#2F3033] font-bold text-[13px] leading-[20px] mb-2 block">
                      Drain problem
                    </label>
                    <Select value={drainProblem} onValueChange={setDrainProblem}>
                      <SelectTrigger className="w-full text-sm">
                        <SelectValue placeholder="Select answer(s)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="clogged">Clogged Drain</SelectItem>
                        <SelectItem value="burst">Burst Pipe</SelectItem>
                        <SelectItem value="slow">Slow Drainage</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-[#2F3033] font-bold text-[13px] leading-[20px] mb-2 block">
                      Repair urgency
                    </label>
                    <Select value={urgency} onValueChange={setUrgency}>
                      <SelectTrigger className="w-full text-sm">
                        <SelectValue placeholder="Select answer" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="urgent">Urgent</SelectItem>
                        <SelectItem value="soon">Soon</SelectItem>
                        <SelectItem value="flexible">Flexible</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-[#2F3033] font-bold text-[13px] leading-[20px] mb-2 block">
                      Number of issue drains
                    </label>
                    <Select value={numDrains} onValueChange={setNumDrains}>
                      <SelectTrigger className="w-full text-sm">
                        <SelectValue placeholder="Select answer" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="one">1</SelectItem>
                        <SelectItem value="two">2</SelectItem>
                        <SelectItem value="three">3+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    onClick={handleRequestEstimate}
                    className="w-full bg-[#0E7A60] hover:bg-teal-500 text-white font-medium transition-colors"
                  >
                    Request estimate
                  </Button>

                  <div className="text-center pt-2">
                    <p className="text-xs text-gray-700">
                      <span className="inline-block w-2 h-2 bg-teal-600 rounded-full mr-2 animate-pulse"></span>
                      <span>Online now</span>
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* === REVIEWS SECTION === */}
      <div className="w-full flex justify-center py-8 bg-gray-50">
        <div className="w-full max-w-6xl px-4">
          <h2 className="text-3xl font-bold mb-8">Reviews</h2>

          <div className="mb-12">
            <div className="flex items-start gap-8 mb-10">
              <div>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl font-bold">Exceptional 5.0</span>
                  <span className="text-sm text-gray-500">2</span>
                </div>
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={24} className="fill-green-600 text-green-600" />
                  ))}
                </div>
                <p className="text-base text-gray-600">139 reviews</p>
              </div>

              <div className="flex-1">
                {[
                  { stars: 5, percent: 97 },
                  { stars: 4, percent: 3 },
                  { stars: 3, percent: 0 },
                  { stars: 2, percent: 0 },
                  { stars: 1, percent: 0 },
                ].map((rating) => (
                  <div key={rating.stars} className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-gray-600 w-4">{rating.stars}</span>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-600 rounded-full"
                        style={{ width: `${rating.percent}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-600 w-6 text-right">{rating.percent}%</span>
                  </div>
                ))}
              </div>
            </div>

            <a href="#" className="text-sm text-teal-600 hover:underline">
              Learn about our review guidelines.
            </a>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Customer photos</h3>
            <div className="relative flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={prevReviewPhoto} className="absolute -left-10 z-10">
                <ChevronLeft size={20} />
              </Button>

              <div className="flex gap-2 overflow-hidden">
                {visibleReviewPhotos.map((photo, idx) => (
                  <div key={idx} className="w-24 h-24 flex-shrink-0 rounded-md overflow-hidden bg-gray-200">
                    <img src={photo} alt={`Customer photo ${idx + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>

              <Button variant="ghost" size="icon" onClick={nextReviewPhoto} className="absolute -right-10 z-10">
                <ChevronRight size={20} />
              </Button>
            </div>
            <p className="text-xs text-gray-600 mt-3">Showing 1-5 of 139 reviews</p>
          </div>

          <div className="border-t pt-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white font-bold">
                P
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm">Pedro G.</span>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className="fill-green-600 text-green-600" />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">• Aug 15, 2025</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-600 mb-3">
                  <Check size={14} className="text-green-600 flex-shrink-0" />
                  <span>Hired on Nairbrly</span>
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-800 mb-3 leading-relaxed">
              They responded within minutes of our inquiry and sent out someone the very next morning. Even, the <span className="font-semibold">plumber</span> who came out, was awesome - exactly the kind of professional we were looking for. Not only was he able to resolve the problems with the drains in our kitchen and bathroom, but he also was able to identify the underlying causes of our issues.{' '}
              <a href="#" className="text-teal-600 hover:underline">...Read more</a>
            </p>

            <p className="text-xs text-gray-600 mb-4">
              Details: No, repair is not urgent • Only one drain has issues • Part of a larger issue with the plumbing system • Clogging • Slow draining • House
            </p>

            <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
              <p className="text-xs font-semibold text-gray-900 mb-1">Chandlers Plumbing's reply</p>
              <p className="text-xs text-gray-700">We greatly appreciate your business and review! -Chandlers-</p>
            </div>

            <p className="text-xs text-gray-500 mt-3">Plumbing Drain Repair</p>
          </div>
        </div>
      </div>

      {/* === SERVICES OFFERED SECTION === */}
      <div className="bg-white p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold mb-8 text-gray-900">Services offered</h1>

          <section className="mb-10 pb-10 border-b border-gray-200">
            <div className="mb-4">
              <h2 className="text-lg font-bold text-gray-900">Drain problem</h2>
            </div>
            <div className="flex flex-wrap gap-2 md:gap-3">
              {drainProblems.map((problem) => (
                <button
                  key={problem}
                  onClick={() => toggleDrainProblem(problem)}
                  className={`px-3 md:px-4 py-2 rounded-full text-sm font-medium border-2 transition-all duration-200 whitespace-nowrap ${
                    selectedDrainProblems.includes(problem)
                      ? 'border-teal-600 bg-teal-50 text-teal-700 shadow-sm'
                      : 'border-teal-600 text-teal-600 hover:bg-teal-50 hover:shadow-sm active:bg-teal-100'
                  }`}
                  aria-pressed={selectedDrainProblems.includes(problem)}
                >
                  {problem}
                </button>
              ))}
            </div>
          </section>

          <section className="mb-10 pb-10 border-b border-gray-200">
            <div className="mb-5">
              <h2 className="text-lg font-bold text-gray-900">Repair urgency</h2>
            </div>
            <div className="space-y-3">
              {repairUrgencies.map((urgency) => (
                <label key={urgency.id} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={selectedRepairUrgency.includes(urgency.id)}
                    onChange={() => toggleRepairUrgency(urgency.id)}
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 flex-shrink-0 ${
                      selectedRepairUrgency.includes(urgency.id)
                        ? 'bg-teal-600 border-teal-600 shadow-sm'
                        : 'border-gray-300 group-hover:border-teal-600 group-active:bg-teal-50'
                    }`}
                  >
                    {selectedRepairUrgency.includes(urgency.id) && (
                      <Check size={16} className="text-white" strokeWidth={3} />
                    )}
                  </div>
                  <span className="text-gray-700 font-medium group-hover:text-gray-900 transition-colors">
                    {urgency.label}
                  </span>
                </label>
              ))}
            </div>
          </section>

          <section className="mb-10">
            <div className="mb-5">
              <h2 className="text-lg font-bold text-gray-900">Property type</h2>
              <p className="text-sm text-gray-600 mt-1">
                {selectedPropertyTypes.length > 0 ? `${selectedPropertyTypes.length} selected` : 'Select all that apply'}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              {propertyTypes.map((type) => (
                <label key={type.id} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={selectedPropertyTypes.includes(type.id)}
                    onChange={() => togglePropertyType(type.id)}
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 flex-shrink-0 ${
                      selectedPropertyTypes.includes(type.id)
                        ? 'bg-teal-600 border-teal-600 shadow-sm'
                        : 'border-gray-300 group-hover:border-teal-600 group-active:bg-teal-50'
                    }`}
                  >
                    {selectedPropertyTypes.includes(type.id) && (
                      <Check size={16} className="text-white" strokeWidth={3} />
                    )}
                  </div>
                  <span className="text-gray-700 font-medium group-hover:text-gray-900 transition-colors">
                    {type.label}
                  </span>
                </label>
              ))}
            </div>
          </section>

          {(selectedDrainProblems.length > 0 || selectedRepairUrgency.length > 0 || selectedPropertyTypes.length > 0) && (
            <section className="mt-10 pt-8 border-t border-gray-200">
              <div className="p-5 bg-teal-50 rounded-lg border border-teal-200">
                <p className="text-sm font-semibold text-gray-900 mb-4">Selected Services Summary</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  {selectedDrainProblems.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">Drain Problems</p>
                      <ul className="space-y-1">
                        {selectedDrainProblems.map(problem => (
                          <li key={problem} className="text-sm text-gray-700 flex items-start gap-2">
                            <Check size={14} className="text-teal-600 flex-shrink-0 mt-0.5" />
                            <span>{problem}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {selectedRepairUrgency.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">Urgency</p>
                      <ul className="space-y-1">
                        {selectedRepairUrgency.map(urgency => {
                          const label = repairUrgencies.find(u => u.id === urgency)?.label;
                          return (
                            <li key={urgency} className="text-sm text-gray-700 flex items-start gap-2">
                              <Check size={14} className="text-teal-600 flex-shrink-0 mt-0.5" />
                              <span>{label}</span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                  {selectedPropertyTypes.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">Properties</p>
                      <ul className="space-y-1">
                        {selectedPropertyTypes.map(type => {
                          const label = propertyTypes.find(p => p.id === type)?.label;
                          return (
                            <li key={type} className="text-sm text-gray-700 flex items-start gap-2">
                              <Check size={14} className="text-teal-600 flex-shrink-0 mt-0.5" />
                              <span>{label}</span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </div>
                <button
                  onClick={handleExportData}
                  className="w-full sm:w-auto px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors duration-200 text-sm"
                >
                  Save Services Profile
                </button>
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
}