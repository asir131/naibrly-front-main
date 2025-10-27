"use client";
import React, { useState, useRef, useEffect } from "react";
import { Clock, MapPin, Calendar, Search, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Rectangle1 from "@/public/Home/Rectangle a.png";
import Rectangle2 from "@/public/Home/Rectangle b.png";
import Rectangle3 from "@/public/Home/Rectangle c.png";
import MapBg from "@/public/map image.png";
import { useRouter, useSearchParams } from "next/navigation";
import { CardContainer, CardBody, CardItem } from "@/components/ui/3d-card";

export default function NaibrlyHeroSection() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchOpen, setSearchOpen] = useState(false);
  const [zipOpen, setZipOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [zipCode, setZipCode] = useState("");

  const searchRef = useRef(null);
  const zipRef = useRef(null);

  // Sample dropdown options
  const serviceOptions = [
    "IKEA Assembly",
    "TV Mounting",
    "Furniture Assembly",
    "General Mounting",
    "Truck Assisted Help Moving",
    "Help Moving",
    "Cleaning",
    "Door, Cabinet, & Furniture Repair",
    "Heavy Lifting & Loading",
    "Electrical help",
  ];

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

  // Load search params from URL on mount
  useEffect(() => {
    const service = searchParams.get("service");
    const zip = searchParams.get("zip");
    if (service) setSearchQuery(service);
    if (zip) setZipCode(zip);
  }, [searchParams]);

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
    <div className="min-h-8 relative p-2 lg:p-10">
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
              style={{
                color: "var(--Text-Primary-Text, #333)",
                fontFamily: "var(--Family-Font, Inter)",
                fontSize: "38px",
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
              <div className="flex items-center shadow-lg rounded-[20px] bg-[#F4F7FE] border border-[#EBEBEB] h-[70px]">
                {/* Service Dropdown Button */}
                <div ref={searchRef} className="flex-1 h-full relative">
                  <button
                    onClick={() => {
                      setSearchOpen(!searchOpen);
                      setZipOpen(false);
                    }}
                    className="flex items-center justify-between w-full h-full px-6"
                  >
                    <span
                      className={
                        searchQuery
                          ? "text-gray-900"
                          : "text-gray-400 text-base"
                      }
                    >
                      {searchQuery || "What do you need help With?"}
                    </span>
                  </button>

                  {/* Service Dropdown */}
                  {searchOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-80 overflow-y-auto z-50 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                      {serviceOptions.map((service, index) => (
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
                      ))}
                    </div>
                  )}
                </div>

                <div className="w-px h-10 bg-[#EBEBEB] ml-2"></div>

                {/* Zip Code Section */}
                <div
                  ref={zipRef}
                  className="h-full relative flex items-center pr-24"
                >
                  <button
                    onClick={() => {
                      setZipOpen(!zipOpen);
                      setSearchOpen(false);
                    }}
                    className="flex items-center gap-2"
                  >
                    <MapPin className="w-5 h-5 text-teal-600 flex-shrink-0" />
                    <span
                      className={
                        zipCode
                          ? "text-gray-900 font-medium"
                          : "text-gray-900 font-medium"
                      }
                    >
                      {zipCode || "152643"}
                    </span>
                  </button>

                  {/* Zip Code Dropdown */}
                  {zipOpen && (
                    <div className="absolute top-full right-0 w-44 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto z-50 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                      {zipCodeOptions.map((zip, index) => (
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
                  // Update URL with search parameters
                  const params = new URLSearchParams();
                  if (searchQuery) params.set("service", searchQuery);
                  if (zipCode) params.set("zip", zipCode);
                  router.push(`/find-area?${params.toString()}`);
                }}
                className="w-full bg-teal-700 hover:bg-teal-800 h-[56px] rounded-xl flex items-center justify-center gap-2 shadow-sm text-base font-medium"
              >
                <Search className="w-5 h-5" />
                Find your area
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
