"use client";

import { X, MapPin, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function BundleDetailModal({ isOpen, onClose, bundleData }) {
  if (!isOpen || !bundleData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Backdrop overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal content */}
      <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex">
          {/* Left side - Image */}
          <div className="w-2/5 relative">
            <Image
              src={bundleData.modalImage || bundleData.images[0]}
              alt={bundleData.service}
              width={400}
              height={600}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right side - Content */}
          <div className="w-3/5 p-8 flex flex-col">
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>

            {/* Service Name */}
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              {bundleData.service}
            </h2>

            {/* Bundle Type */}
            <p className=" text-gray-900 font-semibold mb-6">{bundleData.bundle}</p>

            {/* Participants */}
            <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
              {bundleData.participants?.map((participant, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={participant.image}
                      alt={participant.name}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-gray-900 mb-1">
                      {participant.name}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <MapPin className="w-4 h-4 text-teal-600" />
                      <span>{participant.location || bundleData.location}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Total Benefits */}
            <div className="mb-6">
              <h3 className="text-base font-semibold text-gray-900 mb-3">
                Total Benefits:
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm text-gray-600">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM16.78 9.7L11.11 15.37C10.97 15.51 10.78 15.59 10.58 15.59C10.38 15.59 10.19 15.51 10.05 15.37L7.22 12.54C6.93 12.25 6.93 11.77 7.22 11.48C7.51 11.19 7.99 11.19 8.28 11.48L10.58 13.78L15.72 8.64C16.01 8.35 16.49 8.35 16.78 8.64C17.07 8.93 17.07 9.4 16.78 9.7Z"
                      fill="#0E7A60"
                    />
                  </svg>
                  <span>Each user saves around {bundleData.savings}/hr</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-600">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM16.78 9.7L11.11 15.37C10.97 15.51 10.78 15.59 10.58 15.59C10.38 15.59 10.19 15.51 10.05 15.37L7.22 12.54C6.93 12.25 6.93 11.77 7.22 11.48C7.51 11.19 7.99 11.19 8.28 11.48L10.58 13.78L15.72 8.64C16.01 8.35 16.49 8.35 16.78 8.64C17.07 8.93 17.07 9.4 16.78 9.7Z"
                      fill="#0E7A60"
                    />
                  </svg>
                  <span>Provider gets 3 jobs together in one trip</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-600">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM16.78 9.7L11.11 15.37C10.97 15.51 10.78 15.59 10.58 15.59C10.38 15.59 10.19 15.51 10.05 15.37L7.22 12.54C6.93 12.25 6.93 11.77 7.22 11.48C7.51 11.19 7.99 11.19 8.28 11.48L10.58 13.78L15.72 8.64C16.01 8.35 16.49 8.35 16.78 8.64C17.07 8.93 17.07 9.4 16.78 9.7Z"
                      fill="#0E7A60"
                    />
                  </svg>
                  <span>Reduced travel and time cost</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-600">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM16.78 9.7L11.11 15.37C10.97 15.51 10.78 15.59 10.58 15.59C10.38 15.59 10.19 15.51 10.05 15.37L7.22 12.54C6.93 12.25 6.93 11.77 7.22 11.48C7.51 11.19 7.99 11.19 8.28 11.48L10.58 13.78L15.72 8.64C16.01 8.35 16.49 8.35 16.78 8.64C17.07 8.93 17.07 9.4 16.78 9.7Z"
                      fill="#0E7A60"
                    />
                  </svg>
                  <span>Higher priority service for bundled requests</span>
                </li>
              </ul>
            </div>

            {/* Price and Join Button */}
            <div className="mt-auto flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-red-500 line-through text-lg font-semibold">
                  {bundleData.originalPrice}
                </span>
                <span className="text-2xl font-bold text-gray-900">
                  {bundleData.discountedPrice}
                </span>
                <span className="text-sm text-teal-600 font-semibold">
                  {bundleData.savings}
                </span>
              </div>
              <Button className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-lg font-semibold text-base">
                Join Bundle
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
