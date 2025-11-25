'use client';

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

export default function BundlePublishedModal({ isOpen, onClose, onShareText, onShareQR, sharingData }) {
  const handleShareText = () => {
    if (onShareText) {
      onShareText(sharingData);
    }
  };

  const handleShareQR = () => {
    if (onShareQR) {
      onShareQR(sharingData);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white rounded-3xl p-8">
        <DialogTitle className="sr-only">Bundle Published</DialogTitle>

        <div className="flex flex-col items-center text-center">
          {/* Success Icon */}
          <div className="mb-6 relative">
            {/* Shadow effect */}
            <div className="absolute inset-x-0 bottom-0 h-4 bg-gray-200 rounded-full blur-lg opacity-40"></div>

            {/* Check circle */}
            <div className="relative bg-white rounded-full p-2">
              <div className="w-20 h-20 rounded-full border-4 border-teal-600 flex items-center justify-center bg-white">
                <Check className="w-10 h-10 text-teal-600 stroke-[3]" />
              </div>
            </div>
          </div>

          {/* Success Message */}
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Your Bundle has been Published
          </h2>

          <p className="text-gray-600 mb-8">
            share with friends and neighbors
          </p>

          {/* Action Buttons */}
          <div className="w-full space-y-3">
            <Button
              onClick={handleShareText}
              className="w-full bg-white hover:bg-gray-50 text-teal-600 border-2 border-teal-600 h-12 rounded-lg font-semibold text-base"
            >
              Share with text/email
            </Button>

            <Button
              onClick={handleShareQR}
              className="w-full bg-white hover:bg-gray-50 text-teal-600 border-2 border-teal-600 h-12 rounded-lg font-semibold text-base"
            >
              Share with QR
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
