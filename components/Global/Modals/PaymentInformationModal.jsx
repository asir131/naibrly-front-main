'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield } from 'lucide-react';

export default function PaymentInformationModal({ isOpen, onClose, onConfirm }) {
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [cvv, setCvv] = useState('');

  const formatCardName = (value) => {
    // Only allow letters and spaces, capitalize first letter of each word
    return value.replace(/[^a-zA-Z\s]/g, '').substring(0, 50);
  };

  const formatCardNumber = (value) => {
    const cleaned = value.replace(/\s/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted.substring(0, 19); // Max 16 digits + 3 spaces
  };

  const formatExpiration = (value) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
    }
    return cleaned;
  };

  const handleConfirm = () => {
    onConfirm({ cardName, cardNumber, expirationDate, cvv });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-white rounded-2xl p-0">
        <DialogTitle className="sr-only">Payment Information</DialogTitle>
        <div className="p-8">
          {/* Header with Back Button */}
          <div className="flex items-center gap-3 mb-6">
            <button onClick={onClose} className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-semibold text-gray-900">Payment information</h2>
          </div>

          {/* Title */}
          <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
            Please enter payment information
          </h3>

          {/* Name of the card */}
          <div className="mb-6">
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 mb-2 block">Card Name</label>
              <input
                type="text"
                value={cardName}
                onChange={(e) => setCardName(formatCardName(e.target.value))}
                placeholder="John Doe"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                maxLength="50"
              />
            </div>
            

            {/* Card Number */}
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 mb-2 block">Card Number</label>
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                placeholder="1234 5678 9101 1121"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                maxLength="19"
              />
            </div>

            {/* Expiration Date and CVV */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Expiration Date
                </label>
                <input
                  type="text"
                  value={expirationDate}
                  onChange={(e) => setExpirationDate(formatExpiration(e.target.value))}
                  placeholder="MM/YY"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  maxLength="5"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">CVV</label>
                <input
                  type="text"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').substring(0, 3))}
                  placeholder="123"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  maxLength="3"
                />
              </div>
            </div>

            {/* Security Message */}
            <div className="bg-teal-50 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">
                    Your information is secure
                  </h4>
                  <p className="text-xs text-gray-600">
                    We use bank-level encryption and Stripe to protect your payment information
                  </p>
                </div>
              </div>
            </div>

            {/* Confirm Button */}
            <Button
              onClick={handleConfirm}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white h-12 rounded-lg font-medium"
            >
              Confirm
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
