'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function TermsSection() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors mb-8 group"
          aria-label="Go back"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="group-hover:translate-x-[-4px] transition-transform"
          >
            <path
              d="M9.07 6L3 12.07L9.07 18.14M20.0019 12.0703H3.17188"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="font-medium">Back</span>
        </button>

        <h1 className="text-5xl font-bold text-center text-gray-900 mb-16">Terms</h1>
        
        <div className="space-y-8 text-gray-800">
          {/* Section 1 */}
          <div>
            <h2 className="text-lg text-[#333] mb-3">1. Information We Collect</h2>
            <p className="text-lg text-[#333] mb-3">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
            <ul className="text-lg text-[#333] mb-3">
              <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
              <li>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</li>
              <li>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</li>
            </ul>
          </div>

          {/* Section 2 */}
          <div>
            <h2 className="ttext-lg text-[#333] mb-3">2. How We Use Information</h2>
            <p className="text-lg text-[#333] mb-3">
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.
            </p>
            <ul className="text-lg text-[#333] mb-3">
              <li>At vero eos et accusamus et iusto odio dignissimos ducimus.</li>
              <li>Et harum quidem rerum facilis est et expedita distinctio.</li>
              <li>Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus.</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div>
            <h2 className="text-lg text-[#333] mb-3">3. Sharing of Information</h2>
            <p className="text-lg text-[#333] mb-3">
              Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.
            </p>
            <ul className="text-lg text-[#333] mb-3">
              <li>Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur.</li>
              <li>Vel illum qui dolorem eum fugiat quo voluptas nulla pariatur.</li>
            </ul>
          </div>

          {/* Section 4 */}
          <div>
            <h2 className="text-lg text-[#333] mb-3">4. Data Security</h2>
            <p className="text-lg text-[#333] mb-3">
              Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam.
            </p>
          </div>

          {/* Section 5 */}
          <div>
            <h2 className="text-lg text-[#333] mb-3">5. Your Rights</h2>
            <p className="text-lg text-[#333] mb-3">
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            </p>
          </div>

          {/* Section 6 */}
          <div>
            <h2 className="text-lg text-[#333] mb-3">6. Changes to This Policy</h2>
            <p className="text-lg text-[#333] mb-3">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium.
            </p>
          </div>
        </div>

        {/* Divider at bottom */}
        <div className="text-lg text-[#333] mb-3"></div>
      </div>
    </div>
  );
}