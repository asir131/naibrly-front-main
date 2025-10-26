import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const ContactSupport = () => {
  const [selectedIssue, setSelectedIssue] = useState('');
  const [emailContent, setEmailContent] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const issueOptions = [
    'General Inquiry',
    'Account Help',
    'Billing & Payments',
    'Technical Support (App/Website Issues)',
    'Service Provider Verification',
    'Report a Problem with a Service Provider',
    'Report a Problem with a Customer',
    'Scheduling or Booking Issues',
    'Feedback & Suggestions',
    'Other'
  ];

  const handleSend = () => {
    if (selectedIssue && emailContent) {
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setSelectedIssue('');
        setEmailContent('');
      }, 3000);
    }
  };

  if (isSubmitted) {
    return (
      <div className="flex-1 p-8">
        <div className="mb-8 pb-4 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900">Contact Support</h1>
        </div>

        <div className="flex flex-col items-center justify-center py-20">
          {/* Success Icon with Animation */}
          <div className="relative mb-6">
            <div className="w-32 h-32 rounded-full border-4 border-teal-500 flex items-center justify-center bg-white">
              <svg
                className="w-16 h-16 text-teal-600"
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
            {/* Decorative dots */}
            <div className="absolute -top-2 -right-2 w-3 h-3 bg-teal-400 rounded-full"></div>
            <div className="absolute top-4 -right-6 w-2 h-2 bg-teal-300 rounded-full"></div>
            <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-teal-400 rounded-full"></div>
            <div className="absolute bottom-6 -left-6 w-2 h-2 bg-teal-300 rounded-full"></div>
            <div className="absolute -top-4 left-8 w-2 h-2 bg-teal-300 rounded-full"></div>
            <div className="absolute -bottom-4 right-8 w-2 h-2 bg-teal-300 rounded-full"></div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank you!</h2>
          <p className="text-gray-600 text-center max-w-md">
            Thank you! We have received your request and will get back to you soon.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8">
      <div className="mb-8 pb-4 border-b border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900">Contact Support</h1>
      </div>

      <div className="space-y-6 max-w-2xl">
        {/* Address/Issue Selector */}
        <div>
          <Label htmlFor="issue" className="text-sm font-medium mb-2 block">
            Address
          </Label>
          <Select value={selectedIssue} onValueChange={setSelectedIssue}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select one Issue" />
            </SelectTrigger>
            <SelectContent>
              {issueOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Email Compose */}
        <div>
          <Label htmlFor="email-content" className="text-sm font-medium mb-2 block">
            Compose email
          </Label>
          <textarea
            id="email-content"
            value={emailContent}
            onChange={(e) => setEmailContent(e.target.value)}
            placeholder="Type here"
            rows={8}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
          />
        </div>

        {/* Send Button */}
        <div>
          <Button
            onClick={handleSend}
            disabled={!selectedIssue || !emailContent}
            className="px-8 bg-teal-600 hover:bg-teal-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ContactSupport;
