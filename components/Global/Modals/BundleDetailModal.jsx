"use client";

import { useState } from "react";
import { Share2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import ShareBundleModal from "./ShareBundleModal";

export default function BundleDetailModal({ isOpen, onClose, bundleData }) {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  if (!isOpen || !bundleData) return null;

  // Filter out "Open Spot" participants
  const activeParticipants = bundleData.participants?.filter(
    participant => participant.name !== "Open Spot"
  ) || [];

  const handleShare = () => {
    setIsShareModalOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Backdrop overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal content */}
      <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex flex-col md:flex-row">
          {/* Left side - Image */}
          <div className="md:w-2/5 relative h-64 md:h-auto">
            <Image
              src={bundleData.modalImage || bundleData.images[0]}
              alt={bundleData.service}
              width={400}
              height={600}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right side - Content */}
          <div className="md:w-3/5 p-6 md:p-8 flex flex-col">
            {/* Header with title and share button */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  {bundleData.service}
                </h2>
                <p className="text-base text-gray-700 font-medium mb-1">
                  {bundleData.bundle}
                </p>
                <p className="text-sm text-gray-600">
                  Service Date: {bundleData.serviceDate || "jun 10, 2025"}
                </p>
              </div>
              <button
                onClick={handleShare}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors shrink-0"
              >
                <Share2 className="w-5 h-5 text-gray-700" />
              </button>
            </div>

            {/* Participants */}
            <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
              {activeParticipants.map((participant, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 bg-linear-to-br from-pink-100 to-pink-200">
                    <Image
                      src={participant.image}
                      alt={participant.name}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-base font-semibold text-gray-900 mb-1">
                      {participant.name}
                    </h4>
                    <div className="flex items-center gap-1.5 text-sm text-gray-600">
                      <MapPin className="w-4 h-4 text-teal-600 shrink-0" />
                      <span>{participant.location || bundleData.location}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pricing Section */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Standard rates est.</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {bundleData.originalPrice}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 mb-1">Standard rates est.</p>
                  <p className="text-lg font-semibold text-teal-600">
                    {bundleData.savings.replace('-', '')} off
                  </p>
                </div>
              </div>
            </div>

            {/* Join Button */}
            <Link href="/request" className="w-full">
              <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white py-4 rounded-xl font-semibold text-lg shadow-md mt-auto">
                Join Bundle
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Share Bundle Modal */}
      <ShareBundleModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        bundleData={bundleData}
      />
    </div>
  );
}
