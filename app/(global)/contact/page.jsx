'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ContactSupportSection() {
  const [issue, setIssue] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSend = () => {
    console.log('Issue:', issue);
    console.log('Message:', message);
    // Handle form submission logic here
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-12 px-8">
      <div className="max-w-5xl mx-auto">
        <Card className="shadow-lg">
          <CardContent className="p-8">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Contact Support</h1>
              <div className="border-t-2 border-gray-300"></div>
            </div>

            {!isSubmitted ? (
              <>
                {/* Form */}
                <div className="space-y-6">
                  {/* Address (Issue Selection) */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Address
                    </label>
                    <Select value={issue} onValueChange={setIssue}>
                      <SelectTrigger className="w-full h-12 bg-white border border-gray-300 text-gray-500">
                        <SelectValue placeholder="Select one Issue" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Inquiry</SelectItem>
                        <SelectItem value="account">Account Help</SelectItem>
                        <SelectItem value="billing">Billing & Payments</SelectItem>
                        <SelectItem value="technical">Technical Support (App/Website Issues)</SelectItem>
                        <SelectItem value="verification">Service Provider Verification</SelectItem>
                        <SelectItem value="report-provider">Report a Problem with a Service Provider</SelectItem>
                        <SelectItem value="report-customer">Report a Problem with a Customer</SelectItem>
                        <SelectItem value="scheduling">Scheduling or Booking Issues</SelectItem>
                        <SelectItem value="feedback">Feedback & Suggestions</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Compose Email */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Compose email
                    </label>
                    <Textarea
                      placeholder="Type here"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full min-h-[400px] bg-white border border-gray-300 text-gray-700 placeholder:text-gray-400 resize-none p-4"
                    />
                  </div>

                  {/* Send Button */}
                  <div className="flex justify-end">
                    <Button 
                      onClick={handleSend}
                      className="bg-white text-teal-600 border-2 border-teal-600 hover:bg-teal-50 px-8 py-2 font-semibold rounded-md"
                    >
                      Send
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              /* Thank You Message */
              <div className="flex flex-col items-center justify-center py-20">
                {/* Success Icon */}
                <div className="relative mb-8">
                  {/* Decorative dots */}
                  <div className="absolute -top-4 -left-4 w-3 h-3 bg-teal-400 rounded-full"></div>
                  <div className="absolute -top-2 right-0 w-2 h-2 bg-teal-300 rounded-full"></div>
                  <div className="absolute -bottom-2 -left-6 w-2.5 h-2.5 bg-teal-300 rounded-full"></div>
                  <div className="absolute -bottom-4 right-2 w-2 h-2 bg-teal-400 rounded-full"></div>
                  
                  {/* Main circle with checkmark */}
                  <div className="w-32 h-32 rounded-full border-4 border-teal-500 flex items-center justify-center bg-white">
                    <svg 
                      className="w-16 h-16 text-teal-500" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={3} 
                        d="M5 13l4 4L19 7" 
                      />
                    </svg>
                  </div>
                </div>

                {/* Thank you text */}
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Thank you!</h2>
                <p className="text-center text-gray-600 max-w-md">
                  Thank you! We have received your request and will get back to you soon.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}