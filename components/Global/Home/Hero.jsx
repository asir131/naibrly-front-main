"use client";
import React, { useState, useRef, useEffect, useMemo } from "react";
import { Clock, MapPin, Calendar, Search, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Rectangle1 from "@/public/Home/Rectangle a.png";
import Rectangle2 from "@/public/Home/Rectangle b.png";
import Rectangle3 from "@/public/Home/Rectangle c.png";
import MapBg from "@/public/map image.png";
import { useRouter } from "next/navigation";
import { CardContainer, CardBody, CardItem } from "@/components/ui/3d-card";
import { useGetServicesQuery } from "@/redux/api/servicesApi";
import useCustomerZipCode from "@/hooks/useCustomerZipCode";

export default function NaibrlyHeroSection() {
  const router = useRouter();
  const customerZipCode = useCustomerZipCode();

  // Fetch services from API
  const { data: servicesData, isLoading: servicesLoading } = useGetServicesQuery();

  // Extract all service names from the API data
  const serviceOptions = useMemo(() => {
    if (!servicesData?.services) return [];
    return servicesData.services.map((service) => service.name);
  }, [servicesData]);

  const zipCodeOptions = [
    "10001",
    "10002",
    "10003",
    "90001",
    "90002",
    "60601",
    "77001",
    "33101",
  ];

  const [searchOpen, setSearchOpen] = useState(false);
  const [zipOpen, setZipOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [filteredServices, setFilteredServices] = useState(serviceOptions);
  const [filteredZipCodes, setFilteredZipCodes] = useState(zipCodeOptions);

  const searchRef = useRef(null);
  const zipRef = useRef(null);

  // Initialize filtered services when data loads
  useEffect(() => {
    if (serviceOptions.length > 0 && filteredServices.length === 0 && !searchQuery) {
      setFilteredServices(serviceOptions);
    }
  }, [serviceOptions, filteredServices.length, searchQuery]);

  useEffect(() => {
    if (!zipCode && customerZipCode) {
      setZipCode(customerZipCode);
    }
  }, [customerZipCode, zipCode]);

  // Filter services based on search query
  const handleServiceSearch = (value) => {
    setSearchQuery(value);
    if (servicesLoading || serviceOptions.length === 0) {
      setFilteredServices([]);
      setSearchOpen(true);
      return;
    }
    const filtered = serviceOptions.filter((service) =>
      service.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredServices(filtered);
    setSearchOpen(true);
  };

  // Filter zip codes based on input
  const handleZipSearch = (value) => {
    setZipCode(value);
    const filtered = zipCodeOptions.filter((zip) =>
      zip.includes(value)
    );
    setFilteredZipCodes(filtered);
    setZipOpen(true);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false);
      }
      if (zipRef.current && !zipRef.current.contains(event.target)) {
        setZipOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="">
      <div className="flex items-center justify-center bg-linear-to-br from-gray-50 to-teal-50 min-h-screen relative overflow-hidden px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12 lg:py-16">
      {/* Map Background */}
      <div className="absolute inset-0 z-0">
        <style jsx>{`
          @keyframes moveMap {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }
          .animate-map {
            animation: moveMap 60s linear infinite;
          }
        `}</style>
        <div className="flex w-[200%] h-full animate-map">
          <div className="relative w-1/2 h-full shrink-0">
            <Image
              src={MapBg}
              alt="Map background"
              fill
              className="object-cover opacity-500"
              priority
            />
          </div>
          <div className="relative w-1/2 h-full shrink-0">
            <Image
              src={MapBg}
              alt="Map background"
              fill
              className="object-cover opacity-100"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6 sm:space-y-7 md:space-y-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[38px] font-semibold text-gray-800 leading-tight">
              You. Your Neighbors. Saving time and money on home services with{" "}
              <span className="text-teal-600">Naibrly.</span>
            </h1>

            {/* Search Bar */}
            <div className="relative">
              {/* Search Bar Container */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center shadow-lg rounded-xl sm:rounded-[20px] bg-[#F4F7FE] border border-[#EBEBEB] min-h-[60px] sm:min-h-[70px]">
                {/* Service Search Input */}
                <div ref={searchRef} className="flex-1 h-full relative min-h-[50px] sm:min-h-[60px]">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleServiceSearch(e.target.value)}
                    onFocus={() => {
                      setSearchOpen(true);
                      setZipOpen(false);
                    }}
                    placeholder="What do you need help with?"
                    className="w-full h-full px-4 sm:px-6 py-3 sm:py-4 bg-transparent border-none outline-none text-gray-900 placeholder:text-gray-400 text-sm sm:text-base"
                  />

                  {/* Service Dropdown */}
                  {searchOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-80 overflow-y-auto z-50 scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                      {servicesLoading ? (
                        <div className="px-5 py-3.5 text-gray-500 text-sm text-center">
                          Loading services...
                        </div>
                      ) : filteredServices.length > 0 ? (
                        filteredServices.map((service, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              setSearchQuery(service);
                              setSearchOpen(false);
                            }}
                            className="w-full text-left px-5 py-3.5 hover:bg-gray-50 text-gray-900 text-sm font-normal transition-colors first:rounded-t-xl last:rounded-b-xl"
                          >
                            {service}
                          </button>
                        ))
                      ) : searchQuery ? (
                        <div className="px-5 py-3.5 text-gray-500 text-sm text-center">
                          No services found
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>

                <div className="hidden sm:block w-px h-10 bg-[#EBEBEB]"></div>
                <div className="block sm:hidden w-full h-px bg-[#EBEBEB]"></div>

                {/* Zip Code Search Input */}
                <div ref={zipRef} className="h-full relative min-h-[50px] sm:min-h-[60px]">
                  <div className="flex items-center gap-3 px-4 sm:px-6 h-full py-3 sm:py-4">
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600 shrink-0" />
                    <input
                      type="text"
                      value={zipCode}
                      onChange={(e) => handleZipSearch(e.target.value)}
                      onFocus={() => {
                        setZipOpen(true);
                        setSearchOpen(false);
                      }}
                      placeholder="Zip code"
                      className="flex-1 sm:w-32 bg-transparent border-none outline-none text-gray-900 placeholder:text-gray-400 text-sm sm:text-base"
                    />
                  </div>

                  {/* Zip Code Dropdown */}
                  {zipOpen && filteredZipCodes.length > 0 && (
                    <div className="absolute top-full right-0 w-44 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto z-50 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                      {filteredZipCodes.map((zip, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setZipCode(zip);
                            setZipOpen(false);
                          }}
                          className="w-full text-left px-5 py-3.5 hover:bg-gray-50 text-gray-900 text-sm font-normal transition-colors first:rounded-t-xl last:rounded-b-xl"
                        >
                          {zip}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Search Button Inside */}
                <Button
                  onClick={() => {
                    setSearchOpen(false);
                    setZipOpen(false);
                    // Navigate to find-area page with search parameters (trim whitespace)
                    const trimmedService = searchQuery.trim();
                    const trimmedZip = zipCode.trim();
                    if (trimmedService || trimmedZip) {
                      const params = new URLSearchParams();
                      if (trimmedService) params.set("service", trimmedService);
                      if (trimmedZip) params.set("zip", trimmedZip);
                      router.push(`/find-area?${params.toString()}`);
                    }
                  }}
                  className="bg-teal-600 hover:bg-teal-700 w-full sm:w-12 md:w-14 h-12 sm:h-12 md:h-14 rounded-xl sm:rounded-[14px] m-2 flex items-center justify-center shadow-md gap-2 sm:gap-0"
                >
                  <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="sm:hidden">Search</span>
                </Button>
              </div>
            </div>

            {/* Features */}
            <div className="flex flex-wrap justify-center sm:justify-start ml-0 sm:ml-8 md:ml-12 lg:ml-16 gap-3 sm:gap-5 md:gap-6 lg:gap-8">
              <CardContainer containerClassName="py-0 flex items-center justify-center">
                <CardBody className="w-fit h-fit">
                  <CardItem translateZ="50" className="w-fit h-fit">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="bg-teal-600 rounded-full p-2 sm:p-2.5 md:p-3">
                        <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 text-sm sm:text-base">24H</div>
                        <div className="text-xs sm:text-sm text-gray-600">
                          Availability
                        </div>
                      </div>
                    </div>
                  </CardItem>
                </CardBody>
              </CardContainer>

              <CardContainer containerClassName="py-0 flex items-center justify-center">
                <CardBody className="w-fit h-fit">
                  <CardItem translateZ="50" className="w-fit h-fit">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="bg-teal-600 rounded-full p-2 sm:p-2.5 md:p-3">
                        <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 text-sm sm:text-base">
                          Local US
                        </div>
                        <div className="text-xs sm:text-sm text-gray-600">
                          Professional
                        </div>
                      </div>
                    </div>
                  </CardItem>
                </CardBody>
              </CardContainer>

              <CardContainer containerClassName="py-0 flex items-center justify-center">
                <CardBody className="w-fit h-fit">
                  <CardItem translateZ="50" className="w-fit h-fit">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="bg-teal-600 rounded-full p-2 sm:p-2.5 md:p-3">
                        <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 text-sm sm:text-base">
                          Flexible
                        </div>
                        <div className="text-xs sm:text-sm text-gray-600">
                          Appointments
                        </div>
                      </div>
                    </div>
                  </CardItem>
                </CardBody>
              </CardContainer>
            </div>
          </div>

          {/* Right Images Grid - Mobile friendly layout */}
          {/* Mobile Layout - Simple stacked grid */}
          <div className="flex lg:hidden justify-center items-center h-[300px] gap-3 px-4">
            <div className="flex flex-col gap-3">
              <div className="rounded-2xl overflow-hidden shadow-lg w-[140px] h-[160px]">
                <Image
                  src={Rectangle3}
                  alt="Kitchen installation service"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="rounded-2xl overflow-hidden shadow-lg w-[140px] h-[120px]">
                <Image
                  src={Rectangle1}
                  alt="Cleaning service"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-lg w-[140px] h-[290px]">
              <Image
                src={Rectangle2}
                alt="Furniture assembly service"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Desktop Layout - Absolute positioned (visible only on desktop) */}
          <div className="relative h-[500px] md:h-[580px] lg:h-[640px] hidden lg:block">
            <div className="relative w-full h-full max-w-[420px] lg:max-w-[480px] xl:max-w-[520px] mx-auto">
              {/* Kitchen Installation - Top Left with 3D Card Effect */}
              <div className="absolute top-10 left-4">
                <CardContainer containerClassName="py-0 flex items-center justify-center">
                  <CardBody className="w-fit h-fit">
                    <CardItem translateZ="50" className="w-fit h-fit">
                      <div
                        className="rounded-3xl overflow-hidden shadow-xl"
                        style={{
                          width: "240px",
                          height: "280px",
                        }}
                      >
                        <Image
                          src={Rectangle3}
                          alt="Kitchen installation service"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </CardItem>
                  </CardBody>
                </CardContainer>
              </div>

              {/* Furniture Assembly - Top Right with 3D Card Effect */}
              <div className="absolute top-10 left-70">
                <CardContainer containerClassName="py-0 flex items-center justify-center">
                  <CardBody className="w-fit h-fit">
                    <CardItem translateZ="50" className="w-fit h-fit">
                      <div
                        className="rounded-3xl mt-0 overflow-hidden shadow-xl"
                        style={{
                          width: "240px",
                          height: "500px",
                        }}
                      >
                        <Image
                          src={Rectangle2}
                          alt="Cleaning service"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </CardItem>
                  </CardBody>
                </CardContainer>
              </div>

              {/* Bottom Left - Cleaning Service with 3D Card Effect */}
              <div className="absolute bottom-25 ml-46 transform -translate-x-[calc(50%+48px)]">
                <CardContainer containerClassName="py-0 flex items-center justify-center">
                  <CardBody className="w-fit h-fit">
                    <CardItem translateZ="80" className="w-fit h-fit">
                      <div
                        className="rounded-3xl overflow-hidden shadow-xl"
                        style={{
                          width: "250px",
                          height: "200px",
                        }}
                      >
                        <Image
                          src={Rectangle1}
                          alt="Cleaning service"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </CardItem>
                  </CardBody>
                </CardContainer>
              </div>

              {/* Join Now Badge - Centered */}
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
