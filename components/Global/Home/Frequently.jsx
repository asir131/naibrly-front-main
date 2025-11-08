'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: 'What is HomePro?',
      answer: 'HomePro is a home care platform that connects homeowners with professional service providers offering a wide range of home services, including repairs, maintenance, cleaning, and more.'
    },
    {
      question: 'Are the service providers on HomePro reliable and qualified?',
      answer: 'Yes, all service providers on HomePro are thoroughly vetted, background-checked, and verified for their qualifications and expertise. We ensure that only trusted professionals join our platform to provide quality services.'
    },
    {
      question: 'What if I have an issue or complaint about a service provider?',
      answer: 'If you experience any issues with a service provider, you can contact our customer support team immediately. We take all complaints seriously and will work to resolve the issue promptly, including mediation or finding an alternative service provider if needed.'
    },
    {
      question: 'How are payments handled on HomePro?',
      answer: 'Payments are processed securely through our platform. You can pay using various methods including credit cards, debit cards, or digital wallets. Payment is typically made after the service is completed to your satisfaction.'
    },
    {
      question: 'How do I leave a review for a service provider?',
      answer: 'After your service is completed, you will receive a notification to rate and review the service provider. Simply log into your account, go to your service history, and submit your feedback. Your reviews help other customers make informed decisions.'
    }
  ];

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
            {faqs.map((faq, index) => (
              <div
                key={index}
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