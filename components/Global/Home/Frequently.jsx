'use client';

import React, { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);
  const [faqs, setFaqs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const baseUrl =
          process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';
        const response = await fetch(`${baseUrl}/faq`);
        const data = await response.json();

        if (response.ok && data?.success) {
          const items = data?.data?.faqs || [];
          setFaqs(items);
          setOpenIndex(items.length > 0 ? 0 : -1);
        } else {
          setFaqs([]);
          setOpenIndex(-1);
        }
      } catch (error) {
        console.error('Failed to load FAQs:', error);
        setFaqs([]);
        setOpenIndex(-1);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFaqs();
  }, []);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <div className="bg-linear-to-br from-gray-50 to-teal-50 py-8 sm:py-12 md:py-16 px-4 sm:px-6 md:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 sm:gap-8 md:gap-10 lg:gap-12">
          {/* Left Side - Title */}
          <div className="lg:col-span-2 space-y-3 sm:space-y-4 text-center lg:text-left">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight px-2 sm:px-0">
              Frequently Asked Questions
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-1 sm:gap-2">
              <span className="text-gray-600 text-sm sm:text-base">Still need help?</span>
              <a
                href="/contact"
                className="text-teal-600 font-semibold hover:text-teal-700 transition-colors text-sm sm:text-base"
              >
                Get Help Now
              </a>
            </div>
          </div>

          {/* Right Side - Accordion */}
          <div className="lg:col-span-3 space-y-3 sm:space-y-4">
            {isLoading && (
              <div className="rounded-xl sm:rounded-2xl bg-gray-50 p-5 text-sm text-gray-600">
                Loading FAQs...
              </div>
            )}
            {!isLoading && faqs.length === 0 && (
              <div className="rounded-xl sm:rounded-2xl bg-gray-50 p-5 text-sm text-gray-600">
                No FAQs available yet.
              </div>
            )}
            {!isLoading && faqs.map((faq, index) => (
              <div
                key={faq.id || index}
                className={`rounded-xl sm:rounded-2xl transition-all ${
                  openIndex === index
                    ? 'bg-blue-50 shadow-md'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                {/* Question Header */}
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 md:p-6 text-left"
                >
                  <span className="text-sm sm:text-base md:text-lg font-bold text-gray-900 pr-3 sm:pr-4">
                    {faq.question}
                  </span>
                  <div className="shrink-0">
                    {openIndex === index ? (
                      <ChevronUp className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                    ) : (
                      <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                    )}
                  </div>
                </button>

                {/* Answer Content */}
                {openIndex === index && (
                  <div className="px-4 sm:px-5 md:px-6 pb-4 sm:pb-5 md:pb-6 animate-in slide-in-from-top">
                    <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
