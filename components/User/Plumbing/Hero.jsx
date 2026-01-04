"use client";

import { Link as LinkIcon, MapPin } from "lucide-react";
import Link from "next/link"; // Make sure to import Next.js Link
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import React from "react";
import useCustomerZipCode from "@/hooks/useCustomerZipCode";

export default function PlumberFinder() {
  const customerZipCode = useCustomerZipCode();
  const [zipCode, setZipCode] = useState("");

  useEffect(() => {
    if (!zipCode && customerZipCode) {
      setZipCode(customerZipCode);
    }
  }, [customerZipCode, zipCode]);

  return (
    <div className="bg-white px-4 py-12 md:py-0.5">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 pl-20">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                Check out 7 plumbers in your area
              </h1>
              <p className="text-gray-600 text-lg">
                Confirm your location to see highly-rated pros near you.
              </p>
            </div>

            {/* Input and Button */}
            <div className="space-y-4">
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="51502"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  className="pl-12 h-12 text-lg border-gray-300 focus:border-teal-600 focus:ring-teal-600"
                />
              </div>
              <Link href="/Plumber-list">
                <Button className="w-full h-12 bg-[#0E7A60] hover:bg-[#076650] text-white text-lg font-medium rounded-lg transition-colors">
                  Find in your area
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Image - Bottom Half Circle */}
          <div className="relative h-80 md:h-96 overflow-hidden">
            <div className="absolute -top-1/2 right-0 w-80 h-80 md:w-96 md:h-96 rounded-full overflow-hidden bg-gray-100 shadow-lg">
              <img
                src="/round.jpg"
                alt="Professional plumber at work"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
