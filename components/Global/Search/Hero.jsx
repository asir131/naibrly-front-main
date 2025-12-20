"use client";
import React, { useState, useRef, useEffect, useMemo } from "react";
import { Clock, MapPin, Calendar, Search, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Rectangle1 from "@/public/Home/Rectangle a.png";
import Rectangle2 from "@/public/Home/Rectangle b.png";
import Rectangle3 from "@/public/Home/Rectangle c.png";
import MapBg from "@/public/map image.png";
import { useRouter, useSearchParams } from "next/navigation";
import { CardContainer, CardBody, CardItem } from "@/components/ui/3d-card";
import { useGetServicesQuery } from "@/redux/api/servicesApi";
import useCustomerZipCode from "@/hooks/useCustomerZipCode";

export default function NaibrlyHeroSection({ onSearch, isSearching }) {
  const router = useRouter();
  const searchParams = useSearchParams();
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

  // Load search params from URL on mount
  useEffect(() => {
    const service = searchParams.get("service");
    const zip = searchParams.get("zip");
    if (service) setSearchQuery(service);
    if (zip) setZipCode(zip);
  }, [searchParams]);

  useEffect(() => {
    if (!zipCode && customerZipCode) {
      setZipCode(customerZipCode);
    }
  }, [customerZipCode, zipCode]);

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
    <div className="bg-linear-to-br from-gray-50 to-teal-50 min-h-8 relative p-2 lg:p-10 overflow-hidden">
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
                    className="object-cover opacity-100"
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
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <h1
              className="text-2xl sm:text-3xl lg:text-[38px] font-semibold text-gray-800"
              style={{
                color: "var(--Text-Primary-Text, #333)",
                fontFamily: "var(--Family-Font, Inter)",
                fontStyle: "normal",
                fontWeight: 600,
                lineHeight: "normal",
                alignSelf: "stretch",
              }}
            >
              You. Your Neighbors. Saving time and money on home services with{" "}
              <span className="text-teal-600">Naibrly.</span>
            </h1>

            {/* Search Bar */}
            <div className="space-y-3">
              {/* Search Bar Container */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center shadow-lg rounded-[20px] bg-[#F4F7FE] border border-[#EBEBEB] min-h-[70px]">
                {/* Service Search Input */}
                <div ref={searchRef} className="flex-1 h-full relative min-h-[60px] sm:min-h-0">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleServiceSearch(e.target.value)}
                    onFocus={() => {
                      setSearchOpen(true);
                      setZipOpen(false);
                    }}
                    placeholder="What do you need help With?"
                    className="w-full h-full px-4 sm:px-6 py-4 sm:py-0 bg-transparent border-none outline-none text-gray-900 placeholder:text-gray-400 text-sm sm:text-base"
                  />

                  {/* Service Dropdown */}
                  {searchOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-80 overflow-y-auto z-50 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
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

                <div className="hidden sm:block w-px h-10 bg-[#EBEBEB] ml-2"></div>
                <div className="block sm:hidden w-full h-px bg-[#EBEBEB]"></div>

                {/* Zip Code Search Input */}
                <div
                  ref={zipRef}
                  className="h-full relative flex items-center pr-4 sm:pr-24 min-h-[60px] sm:min-h-0"
                >
                  <div className="flex items-center gap-2 px-4 sm:px-0 w-full sm:w-auto py-4 sm:py-0">
                    <MapPin className="w-5 h-5 text-teal-600 flex-shrink-0" />
                    <input
                      type="text"
                      value={zipCode}
                      onChange={(e) => handleZipSearch(e.target.value)}
                      onFocus={() => {
                        setZipOpen(true);
                        setSearchOpen(false);
                      }}
                      placeholder="152643"
                      className="flex-1 sm:w-24 bg-transparent border-none outline-none text-gray-900 font-medium placeholder:text-gray-900 placeholder:font-medium text-sm sm:text-base"
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
              </div>

              {/* Search Button - Full Width */}
              <Button
                onClick={() => {
                  setSearchOpen(false);
                  setZipOpen(false);
                  // Update URL with search parameters (trim whitespace)
                  const params = new URLSearchParams();
                  const trimmedService = searchQuery.trim();
                  const trimmedZip = zipCode.trim();
                  if (trimmedService) params.set("service", trimmedService);
                  if (trimmedZip) params.set("zip", trimmedZip);
                  router.push(`/find-area?${params.toString()}`);
                  // Trigger search if onSearch callback is provided
                  if (onSearch && trimmedService && trimmedZip) {
                    onSearch(trimmedService, trimmedZip);
                  }
                }}
                disabled={isSearching}
                className="w-full bg-teal-700 hover:bg-teal-800 h-14 rounded-xl flex items-center justify-center gap-2 shadow-sm text-sm sm:text-base font-medium disabled:opacity-50"
              >
                {isSearching ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    Find your area
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Right Images Grid */}
          <div className="relative h-[640px] hidden lg:block">
            <div className="relative w-full h-full max-w-[520px] mx-auto">
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
  );
}
