"use client";

import React from "react";
import Image from "next/image";
import { Youtube, Instagram, Facebook, Twitter, Mail } from "lucide-react";
import { BsTwitterX } from "react-icons/bs";

export default function NaibrlyFooter() {
  return (
    <footer className="bg-[#0a4d3c] text-white py-12 px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-8">
          {/* Left Column - Brand */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center gap-3">
              <div className=" rounded-xl flex items-center justify-center">
                <Image
                  src="/logo.png"
                  alt="Naibrly Logo"
                  width={42}
                  height={42}
                  className="object-contain"
                />
              </div>
              <h3 className="text-2xl font-bold">NAIBRLY</h3>
            </div>
            <p className="text-white leading-relaxed max-w-md">
              Naibrly is your premier destination for top-notch smart home
              service and repair.
            </p>

            {/* Social Icons */}
            <div className="flex gap-4 pt-2">
              <a
                href="https://www.youtube.com/channel/UCSzuDyaC1dH5EQeW-vD_TOQ"
                className="hover:text-gray-300 transition-colors"
                aria-label="YouTube"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M21.8392 5.15941C22.1799 5.51057 22.4218 5.94541 22.5406 6.42C22.8578 8.1787 23.0118 9.96295 23.0006 11.75C23.0069 13.5103 22.8529 15.2676 22.5406 17C22.4218 17.4746 22.1799 17.9094 21.8392 18.2606C21.4986 18.6118 21.0713 18.8668 20.6006 19C18.8806 19.46 12.0006 19.46 12.0006 19.46C12.0006 19.46 5.12057 19.46 3.40057 19C2.93939 18.8738 2.51855 18.6308 2.17872 18.2945C1.83888 17.9581 1.59153 17.5398 1.46057 17.08C1.14334 15.3213 0.989351 13.537 1.00057 11.75C0.991808 9.97631 1.14579 8.20556 1.46057 6.46C1.57936 5.98541 1.82129 5.55057 2.16192 5.19941C2.50255 4.84824 2.92982 4.59318 3.40057 4.46C5.12057 4 12.0006 4 12.0006 4C12.0006 4 18.8806 4 20.6006 4.42C21.0713 4.55318 21.4986 4.80824 21.8392 5.15941ZM15.5 11.75L9.75 15.02V8.47998L15.5 11.75Z"
                    fill="white"
                  />
                </svg>
              </a>
              <a
                href="https://www.tiktok.com/@naibrly"
                className="hover:text-gray-300 transition-colors"
                aria-label="TikTok"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13.2 3h1.9c.1 1 .5 2 1.2 2.7.7.7 1.7 1.2 2.7 1.3v1.9c-1.4-.1-2.7-.6-3.8-1.4v7.1c0 2.7-2.2 4.9-4.9 4.9-2.2 0-4-1.5-4.6-3.5-.1-.5-.2-.9-.2-1.4 0-2.7 2.2-4.9 4.9-4.9.3 0 .6 0 .9.1v2.1c-.3-.1-.6-.2-.9-.2-1.6 0-2.9 1.3-2.9 2.9 0 .3.1.6.2.9.4 1.1 1.4 2 2.7 2 1.6 0 2.9-1.3 2.9-2.9V3z"
                    fill="white"
                  />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/naibrly"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-300 transition-colors"
                aria-label="Instagram"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M17 2H7C4.23858 2 2 4.23858 2 7V17C2 19.7614 4.23858 22 7 22H17C19.7614 22 22 19.7614 22 17V7C22 4.23858 19.7614 2 17 2Z"
                    fill="white"
                  />
                  <path
                    d="M15.9997 11.3703C16.1231 12.2025 15.981 13.0525 15.5935 13.7993C15.206 14.5461 14.5929 15.1517 13.8413 15.53C13.0898 15.9082 12.2382 16.0399 11.4075 15.9062C10.5768 15.7726 9.80947 15.3804 9.21455 14.7855C8.61962 14.1905 8.22744 13.4232 8.09377 12.5925C7.96011 11.7619 8.09177 10.9102 8.47003 10.1587C8.84829 9.40716 9.45389 8.79404 10.2007 8.40654C10.9475 8.01904 11.7975 7.87689 12.6297 8.0003C13.4786 8.12619 14.2646 8.52176 14.8714 9.12861C15.4782 9.73545 15.8738 10.5214 15.9997 11.3703Z"
                    stroke="#0E7A60"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M17.5 6.5H17.51"
                    stroke="#0E7A60"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61578943356510"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-300 transition-colors"
                aria-label="Facebook"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18 2H15C13.6739 2 12.4021 2.52678 11.4645 3.46447C10.5268 4.40215 10 5.67392 10 7V10H7V14H10V22H14V14H17L18 10H14V7C14 6.73478 14.1054 6.48043 14.2929 6.29289C14.4804 6.10536 14.7348 6 15 6H18V2Z"
                    fill="white"
                  />
                </svg>
              </a>

              <a
                href="https://x.com/naibrly"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-300 transition-colors"
                aria-label="X"
              >
                <BsTwitterX className="mt-1" />
              </a>

              <a
                href="mailto:contact@naibrly.com"
                className="hover:text-gray-300 transition-colors"
                aria-label="Email"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z"
                    fill="white"
                  />
                  <path
                    d="M22 6L12 13L2 6"
                    stroke="#0E7A60"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </div>
          </div>

          {/* Right Side - Company and Legal Columns */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-8 lg:gap-12 lg:justify-items-end lg:pl-12">
            {/* Company Column */}
            <div>
              <h4 className="text-xl font-bold mb-6">Company</h4>
              <ul className="space-y-4">
                <li>
                  <a
                    href="/aboutus"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    About us
                  </a>
                </li>
                <li>
                  <a
                    href="/our-services"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Services
                  </a>
                </li>
                <li>
                  <a
                    href="/contact"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal Column */}
            <div>
              <h4 className="text-xl font-bold mb-6">Legal</h4>
              <ul className="space-y-4">
                <li>
                  <a
                    href="/terms-of-use"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Terms
                  </a>
                </li>
                <li>
                  <a
                    href="/privacy-policy"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Privacy
                  </a>
                </li>
                <li>
                  <a
                    href="/join-provider"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Become A Pro
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-teal-700/40 my-8"></div>

        {/* Bottom Copyright */}
        <div className="text-center text-gray-400">
          <p>©2025 Naibrly . All rights reserved</p>
        </div>
      </div>
    </footer>
  );
}
