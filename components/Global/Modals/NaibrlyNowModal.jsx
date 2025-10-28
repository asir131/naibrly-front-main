'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NaibrlyNowModal({ isOpen, onClose, providerName = 'Jacob Maicle' }) {
  const [problem, setProblem] = useState('');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!problem.trim()) {
      alert('Please describe the problem');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      console.log('Request submitted:', { problem, note });
      setIsSubmitting(false);

      // Reset form
      setProblem('');
      setNote('');

      // Show success message
      alert('Request sent successfully!');

      // Close modal
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative z-10 w-full max-w-xl bg-white rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Naibrly Now
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Average response time: 10 minutes (by {providerName})
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Problem Field */}
          <div>
            <label
              htmlFor="problem"
              className="block text-sm sm:text-base font-semibold text-gray-900 mb-2"
            >
              Problem<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="problem"
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              placeholder="Type here"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent text-sm sm:text-base text-gray-900 placeholder:text-gray-400"
              required
            />
          </div>

          {/* Note Field */}
          <div>
            <label
              htmlFor="note"
              className="block text-sm sm:text-base font-semibold text-gray-900 mb-2"
            >
              Note<span className="text-red-500">*</span>
            </label>
            <textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Type here"
              rows={5}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent text-sm sm:text-base text-gray-900 placeholder:text-gray-400 resize-none"
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-4 rounded-xl text-base sm:text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Sending...' : 'Request Sent'}
          </Button>
        </form>
      </div>
    </div>
  );
}
