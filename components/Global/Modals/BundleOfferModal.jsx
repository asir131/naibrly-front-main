"use client";

import { useState } from "react";
import { X, ChevronRight, Check, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import Link from "next/link";

// Step 1: Bundle List Component
function BundleListStep({ onSelectBundle, onClose }) {
  const [bundles, setBundles] = useState([
    {
      id: 1,
      serviceName: "Window Washing",
      bundleType: "3-Person Bundle (2 Joined, 1 Spot Open)",
      originalPrice: "$48/hr",
      discountedPrice: "$55/hr",
      savings: "-$13",
      participants: [
        { id: 1, image: "/logo.png" },
        { id: 2, image: "/logo.png" },
      ],
    },
    {
      id: 2,
      serviceName: "Window Washing",
      bundleType: "3-Person Bundle (2 Joined, 1 Spot Open)",
      originalPrice: "$48/hr",
      discountedPrice: "$55/hr",
      savings: "-$13",
      participants: [
        { id: 1, image: "/logo.png" },
        { id: 2, image: "/logo.png" },
      ],
    },
    {
      id: 3,
      serviceName: "Window Washing",
      bundleType: "3-Person Bundle (2 Joined, 1 Spot Open)",
      originalPrice: "$48/hr",
      discountedPrice: "$55/hr",
      savings: "-$13",
      participants: [
        { id: 1, image: "/logo.png" },
        { id: 2, image: "/logo.png" },
      ],
    },
  ]);

  return (
    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-white px-6 py-5 border-b border-gray-100">
        <h2 className="text-center text-xl font-semibold text-gray-900">
          Naibrly Bundle Offer
        </h2>
      </div>

      {/* Description */}
      <div className="px-6 py-4 bg-gray-50">
        <p className="text-xs text-gray-600 text-center leading-relaxed">
          "This is a great offer for you. If more than one of you use the app
          together to place an order, you will get up to 7% discount. Anyone
          within a 10 km radius can join."
        </p>
      </div>

      {/* Bundle List - Scrollable */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="space-y-3">
          {bundles.map((bundle) => (
            <div
              key={bundle.id}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all"
            >
              {/* Service Name and Arrow */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-base mb-1">
                    {bundle.serviceName}
                  </h3>
                  <p className="text-xs text-gray-500">{bundle.bundleType}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
              </div>

              {/* Bottom Row: Avatars, Price, Button */}
              <div className="flex items-center justify-between mt-4">
                {/* Participants Avatars */}
                <div className="flex items-center -space-x-3">
                  {bundle.participants.map((participant) => (
                    <div
                      key={participant.id}
                      className="w-9 h-9 rounded-full border-2 border-white overflow-hidden bg-gray-100"
                    >
                      <Image
                        src={participant.image}
                        alt="Participant"
                        width={36}
                        height={36}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>

                {/* Pricing and Join Button */}
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-red-500 line-through text-sm font-medium">
                        {bundle.originalPrice}
                      </span>
                      <span className="text-gray-900 text-lg font-bold">
                        {bundle.discountedPrice}
                      </span>
                    </div>
                    <span className="text-xs text-green-600 font-medium">
                      {bundle.savings}
                    </span>
                  </div>
                  <Link href="/request">
                    <Button
                      onClick={() => onSelectBundle(bundle)}
                      className="bg-white text-teal-600 border-2 border-teal-600 hover:bg-teal-600 hover:text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors h-auto"
                    >
                      Join Bundle
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Bundle Button - Fixed at bottom */}
      <div className="bg-white border-t border-gray-100 px-6 py-4">
        <Button
          onClick={() => onSelectBundle(null)}
          className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3.5 rounded-lg font-semibold text-base shadow-sm"
        >
          Create Bundle
        </Button>
      </div>
    </div>
  );
}

// Step 2: Create Bundle Form Component
function CreateBundleStep({ onBack, onSubmit, onClose }) {
  const [formData, setFormData] = useState({
    category1: "",
    category2: "",
    category3: "",
    fromDate: "",
    toDate: "",
    fromTime: "",
    toTime: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
      {/* Header */}
      <div className="bg-white px-6 py-5 border-b border-gray-100">
        <h2 className="text-center text-xl font-semibold text-gray-900">
          Naibrly Bundle Offer
        </h2>
      </div>

      {/* Description */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
        <p className="text-xs text-gray-600 text-center leading-relaxed">
          "This is a great offer for you. If more than one of you use the app
          together to place an order, you will get up to 7% discount. Anyone
          within a 10 km radius can join."
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="px-6 py-6">
        {/* Create Bundle Heading */}
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Create Bundle</h3>
          <p className="text-xs text-gray-500 mt-1">
            Bundle Target: 3 Users (within 10 miles)
          </p>
        </div>

        {/* Category Selects */}
        <div className="space-y-3 mb-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Select Category*
            </label>
            <Select
              value={formData.category1}
              onValueChange={(value) =>
                setFormData({ ...formData, category1: value })
              }
            >
              <SelectTrigger className="w-full h-11 text-sm">
                <SelectValue placeholder="Interior" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="interior">Interior</SelectItem>
                <SelectItem value="exterior">Exterior</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Select
              value={formData.category2}
              onValueChange={(value) =>
                setFormData({ ...formData, category2: value })
              }
            >
              <SelectTrigger className="w-full h-11 text-sm">
                <SelectValue placeholder="Door & window..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="door-window">Door & window</SelectItem>
                <SelectItem value="plumbing">Plumbing</SelectItem>
                <SelectItem value="electrical">Electrical</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Select
              value={formData.category3}
              onValueChange={(value) =>
                setFormData({ ...formData, category3: value })
              }
            >
              <SelectTrigger className="w-full h-11 text-sm">
                <SelectValue placeholder="Select one" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="window-washing">Window Washing</SelectItem>
                <SelectItem value="door-repair">Door Repair</SelectItem>
                <SelectItem value="installation">Installation</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              From date*
            </label>
            <div className="relative">
              <Input
                type="date"
                value={formData.fromDate}
                onChange={(e) =>
                  setFormData({ ...formData, fromDate: e.target.value })
                }
                className="w-full h-11 text-sm pr-10"
                placeholder="Select date"
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              To date*
            </label>
            <div className="relative">
              <Input
                type="date"
                value={formData.toDate}
                onChange={(e) =>
                  setFormData({ ...formData, toDate: e.target.value })
                }
                className="w-full h-11 text-sm pr-10"
                placeholder="Select date"
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Time Range */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              From*
            </label>
            <div className="relative">
              <Input
                type="time"
                value={formData.fromTime}
                onChange={(e) =>
                  setFormData({ ...formData, fromTime: e.target.value })
                }
                className="w-full h-11 text-sm pr-10"
                placeholder="00:00"
              />
              <Clock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              To Time*
            </label>
            <div className="relative">
              <Input
                type="time"
                value={formData.toTime}
                onChange={(e) =>
                  setFormData({ ...formData, toTime: e.target.value })
                }
                className="w-full h-11 text-sm pr-10"
                placeholder="00:00"
              />
              <Clock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3.5 rounded-lg font-semibold text-base shadow-sm"
        >
          Publish
        </Button>
      </form>
    </div>
  );
}

// Step 3: Success Component
function SuccessStep({ onClose, onShare }) {
  return (
    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
      {/* Header */}
      <div className="bg-white px-6 py-5 border-b border-gray-100">
        <h2 className="text-center text-xl font-semibold text-gray-900">
          Naibrly Bundle Offer
        </h2>
      </div>

      {/* Description */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
        <p className="text-xs text-gray-600 text-center leading-relaxed">
          "This is a great offer for you. If more than one of you use the app
          together to place an order, you will get up to 7% discount. Anyone
          within a 10 km radius can join."
        </p>
      </div>

      {/* Success Content */}
      <div className="px-6 py-10 text-center">
        {/* Success Icon */}
        <div className="flex justify-center mb-8">
          <div className="w-28 h-28 rounded-full border-4 border-teal-500 flex items-center justify-center bg-white">
            <Check className="w-14 h-14 text-teal-500 stroke-[3]" />
          </div>
        </div>

        {/* Success Message */}
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Your Bundle has been Published
        </h3>
        <p className="text-sm text-gray-500 mb-8">
          share with friends and neighbors
        </p>

        {/* Share Buttons */}
        <div className="space-y-3">
          <Button
            onClick={() => onShare("text")}
            className="w-full bg-white text-teal-600 border-2 border-teal-600 hover:bg-teal-50 py-3.5 rounded-lg font-semibold text-base shadow-sm"
          >
            Share with text/email
          </Button>
          <Button
            onClick={() => onShare("qr")}
            className="w-full bg-white text-teal-600 border-2 border-teal-600 hover:bg-teal-50 py-3.5 rounded-lg font-semibold text-base shadow-sm"
          >
            Share with QR
          </Button>
        </div>
      </div>
    </div>
  );
}

// Main BundleOfferModal Component
export default function BundleOfferModal({ isOpen, onClose }) {
  const [step, setStep] = useState(1);
  const [selectedBundle, setSelectedBundle] = useState(null);

  if (!isOpen) return null;

  const handleSelectBundle = (bundle) => {
    if (bundle) {
      // User selected existing bundle - could show join confirmation
      setSelectedBundle(bundle);
      setStep(3); // Skip to success for joining
    } else {
      // User wants to create new bundle
      setStep(2);
    }
  };

  const handleCreateBundle = (formData) => {
    console.log("Bundle created:", formData);
    setStep(3);
  };

  const handleShare = (method) => {
    console.log("Sharing via:", method);
    // Implement sharing logic here
  };

  const handleClose = () => {
    setStep(1);
    setSelectedBundle(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Backdrop overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal content */}
      <div className="relative z-10 w-full max-w-lg animate-in zoom-in-95 duration-200">
        {step === 1 && (
          <BundleListStep
            onSelectBundle={handleSelectBundle}
            onClose={handleClose}
          />
        )}
        {step === 2 && (
          <CreateBundleStep
            onBack={() => setStep(1)}
            onSubmit={handleCreateBundle}
            onClose={handleClose}
          />
        )}
        {step === 3 && (
          <SuccessStep onClose={handleClose} onShare={handleShare} />
        )}
      </div>
    </div>
  );
}
