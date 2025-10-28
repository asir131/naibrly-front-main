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
    <div className="bg-linear-to-br from-gray-50 to-teal-50 py-16 px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-5 gap-12">
          {/* Left Side - Title */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              Frequently Asked Questions
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Still need help?</span>
              <a 
                href="#contact" 
                className="text-teal-600 font-semibold hover:text-teal-700 transition-colors"
              >
                Get Help Now
              </a>
            </div>
          </div>

          {/* Right Side - Accordion */}
          <div className="lg:col-span-3 space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`rounded-2xl transition-all ${
                  openIndex === index 
                    ? 'bg-blue-50 shadow-md' 
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                {/* Question Header */}
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <span className="text-lg font-bold text-gray-900 pr-4">
                    {faq.question}
                  </span>
                  <div className="flex-shrink-0">
                    {openIndex === index ? (
                      <ChevronUp className="w-6 h-6 text-gray-600" />
                    ) : (
                      <ChevronDown className="w-6 h-6 text-gray-600" />
                    )}
                  </div>
                </button>

                {/* Answer Content */}
                {openIndex === index && (
                  <div className="px-6 pb-6 animate-in slide-in-from-top">
                    <p className="text-gray-600 leading-relaxed">
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