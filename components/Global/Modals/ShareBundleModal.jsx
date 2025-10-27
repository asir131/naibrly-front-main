'use client';

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, Copy } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';

export default function ShareBundleModal({ isOpen, onClose, bundleData }) {
  const [copied, setCopied] = useState(false);

  // Generate share URL (you can customize this based on your actual bundle URL structure)
  const shareUrl = bundleData?.shareUrl || 'https://youtu.be/0lO4SKpD2E?si=5LDL1E6...';
  const bundleTitle = bundleData?.service || 'Window Washing Bundle';

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsAppShare = () => {
    const message = `Check out this ${bundleTitle} on Naibrly! ${shareUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleFacebookShare = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const handleTwitterShare = () => {
    const message = `Check out this ${bundleTitle} on Naibrly!`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white rounded-3xl p-0">
        <DialogTitle className="sr-only">Share Bundle</DialogTitle>

        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Share {bundleTitle} with Your neighbors
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          {/* QR Code */}
          <div className="flex justify-center mb-6">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              {/* QR Code Placeholder - In production, you'd use a QR code library like 'qrcode.react' */}
              <div className="w-64 h-64 bg-black flex items-center justify-center">
                <svg
                  viewBox="0 0 256 256"
                  className="w-full h-full"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Simplified QR Code Pattern - Replace with actual QR code library */}
                  <rect width="256" height="256" fill="white" />
                  <rect x="20" y="20" width="60" height="60" fill="black" />
                  <rect x="30" y="30" width="40" height="40" fill="white" />
                  <rect x="176" y="20" width="60" height="60" fill="black" />
                  <rect x="186" y="30" width="40" height="40" fill="white" />
                  <rect x="20" y="176" width="60" height="60" fill="black" />
                  <rect x="30" y="186" width="40" height="40" fill="white" />
                  {/* Add more QR pattern squares as needed */}
                  <rect x="90" y="20" width="10" height="10" fill="black" />
                  <rect x="110" y="20" width="10" height="10" fill="black" />
                  <rect x="130" y="20" width="10" height="10" fill="black" />
                  <rect x="150" y="20" width="10" height="10" fill="black" />
                  <rect x="90" y="40" width="10" height="10" fill="black" />
                  <rect x="110" y="40" width="10" height="10" fill="black" />
                  <rect x="130" y="40" width="10" height="10" fill="black" />
                  <rect x="150" y="40" width="10" height="10" fill="black" />
                  {/* More pattern elements */}
                  <rect x="100" y="90" width="56" height="56" fill="black" />
                  <rect x="110" y="100" width="36" height="36" fill="white" />
                  <rect x="120" y="110" width="16" height="16" fill="black" />
                </svg>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 mb-6"></div>

          {/* Social Share Options */}
          <div className="flex justify-center gap-4 mb-6">
            {/* WhatsApp */}
            <button
              onClick={handleWhatsAppShare}
              className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <svg
                  className="w-7 h-7 text-white"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
              </div>
              <span className="text-xs font-medium text-gray-900">WhatsApp</span>
            </button>

            {/* Facebook */}
            <button
              onClick={handleFacebookShare}
              className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <svg
                  className="w-7 h-7 text-white"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </div>
              <span className="text-xs font-medium text-gray-900">Facebook</span>
            </button>

            {/* Twitter/X */}
            <button
              onClick={handleTwitterShare}
              className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </div>
              <span className="text-xs font-medium text-gray-900">Facebook</span>
            </button>
          </div>

          {/* Share Link */}
          <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
            <span className="text-sm text-gray-600 truncate flex-1 mr-3">
              {shareUrl}
            </span>
            <Button
              onClick={handleCopy}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 shrink-0"
            >
              {copied ? (
                <>
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <polyline points="20 6 9 17 4 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
