"use client";

import { X, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

import { useRouter } from "next/navigation";

export default function AuthPromptModal({ isOpen, onClose, serviceData }) {
  const router = useRouter();

  if (!isOpen) return null;

  const handleSignUp = () => {
    onClose();
    router.push("/create-account");
  };

  const handleLogin = () => {
    onClose();
    router.push("/Login");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Backdrop overlay with enhanced blur */}
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
              src="/Image.png"
              alt={serviceData?.title || "Service"}
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
            

            {/* Bundle Type */}
            <p className="text-gray-600 mb-6 blur-sm select-none">
              3-Person Bundle (2 Joined, 1 Spot Open!)
            </p>

            {/* Sample Participants */}
            <div className="space-y-4 mb-6 pb-6 border-b border-gray-200 blur-sm select-none">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-teal-600 font-semibold text-sm">MM</span>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">
                    Monty
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <MapPin className="w-4 h-4 text-teal-600" />
                    <span>Street Springfield, IL 62704</span>
                  </div>
                </div>
              </div>
              
            </div>

            {/* Total Benefits */}
            <div className="mb-6 blur-sm select-none">
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
                    className="shrink-0"
                  >
                    <path
                      d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM16.78 9.7L11.11 15.37C10.97 15.51 10.78 15.59 10.58 15.59C10.38 15.59 10.19 15.51 10.05 15.37L7.22 12.54C6.93 12.25 6.93 11.77 7.22 11.48C7.51 11.19 7.99 11.19 8.28 11.48L10.58 13.78L15.72 8.64C16.01 8.35 16.49 8.35 16.78 8.64C17.07 8.93 17.07 9.4 16.78 9.7Z"
                      fill="#0E7A60"
                    />
                  </svg>
                  <span>Each user saves around $13/hr</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-600">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="flex-shrink-0"
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
                    className="flex-shrink-0"
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
                    className="flex-shrink-0"
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

            {/* Sign Up Button */}
            <div className="mt-auto">
              <Button
                onClick={handleSignUp}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-lg font-semibold text-base mb-3"
              >
                Sign Up
              </Button>
              <div className="text-center">
                <span className="text-sm text-gray-600">
                  Already have an account?{" "}
                </span>
                <button
                  onClick={handleLogin}
                  className="text-sm text-teal-600 hover:text-teal-700 font-semibold"
                >
                  Log In
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
