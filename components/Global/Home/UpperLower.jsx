"use client";

import React from "react";
import Image from "next/image";
import Human from "@/public/Man.png";
import { CardContainer, CardBody, CardItem } from "@/components/ui/3d-card";

export default function HowNaibrlyWorksSection() {
  const steps = [
    {
      number: "1.",
      title: "Call us anytime 24/7",
      description:
        "You can contact us directly, we will quickly put you in touch with our home care professionals who are ready anytime",
    },
    {
      number: "2.",
      title: "Schedule Service",
      description:
        "After connecting your call, our home care experts will answer your questions and provide flexible appointment times",
    },
    {
      number: "3.",
      title: "Your request is completed",
      description:
        "Once your technician arrives, he will diagnose the problem and provide an estimate. If you decide to continue, the technician will get to work",
    },
  ];

  return (
    <div className="bg-linear-to-br from-gray-50 to-teal-50 py-16 px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <CardContainer containerClassName="py-0 flex items-center justify-center">
            <CardBody className="w-fit h-fit">
              <CardItem translateZ="80" className="w-fit h-fit">
                <div className="relative">
                  <div className="relative">
                    <Image
                      src={Human}
                      alt="Professional service technician"
                      className="w-full h-auto object-contain"
                      style={{ background: "transparent" }}
                    />
                  </div>
                </div>
              </CardItem>
            </CardBody>
          </CardContainer>
          {/* Left Image */}

          {/* Right Content */}
          <div className="space-y-8">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              How Naibrly works?
            </h2>

            {/* Steps */}
            <div className="space-y-6">
              {steps.map((step, index) => (
                <div key={index} className="flex gap-4">
                  {/* Number */}
                  <div className="flex-shrink-0">
                    <span className="text-3xl font-bold text-gray-400">
                      {step.number}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
