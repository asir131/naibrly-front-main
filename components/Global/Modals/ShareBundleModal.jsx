'use client';

import { Button } from '@/components/ui/button';
import { X, Copy } from 'lucide-react';
import { useState } from 'react';

export default function ShareBundleModal({ isOpen, onClose, bundleData, sharingData }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Use frontend share link first, then fallback to backend shareLink, then generated URL
  const shareUrl = sharingData?.frontendShareLink ||
    sharingData?.shareLink ||
    (bundleData?._id || bundleData?.bundle?._id
      ? `${typeof window !== 'undefined' ? window.location.origin : ''}/join-bundle/${bundleData?._id || bundleData?.bundle?._id}`
      : 'https://youtu.be/0lO4SKpD2E?si=5LDL1E6...');

  const bundleTitle = bundleData?.title || bundleData?.bundle?.title || bundleData?.service || 'Bundle';

  const backendQrMatchesShareUrl =
    Boolean(sharingData?.qrCode) &&
    (!sharingData?.frontendShareLink ||
      !sharingData?.shareLink ||
      sharingData?.frontendShareLink === sharingData?.shareLink);

  const qrCodeFallbackUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(shareUrl)}`;
  const qrCodeSrc = backendQrMatchesShareUrl
    ? sharingData?.qrCode
    : qrCodeFallbackUrl;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGmailShare = () => {
    const subject = `Check out this ${bundleTitle} on Naibrly`;
    const body = `Check out this ${bundleTitle} on Naibrly! ${shareUrl}`;
    window.open(`https://mail.google.com/mail/?view=cm&fs=1&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
  };

  const handleFacebookShare = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const handleTwitterShare = () => {
    const message = `Check out this ${bundleTitle} on Naibrly!`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Backdrop overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal content */}
      <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 flex-1 pr-2">
            Share {bundleTitle} with Your neighbors
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors shrink-0"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          {/* QR Code */}
          <div className="flex justify-center mb-6">
            <div className="bg-white p-3 rounded-lg border-2 border-gray-200">
              <img
                src={qrCodeSrc}
                alt="QR Code"
                className="w-48 h-48 object-contain"
              />
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 mb-6"></div>

          {/* Social Share Options */}
          <div className="flex justify-center gap-6 mb-6">
            {/* Gmail */}
            <button
              onClick={handleGmailShare}
              className="flex flex-col items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-md border border-gray-200">
                <svg
                  className="w-9 h-9"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    d="M3 6.5V19a1.5 1.5 0 001.5 1.5H6V9.8l6 5.2 6-5.2V20.5h1.5A1.5 1.5 0 0021 19V6.5L12 13 3 6.5z"
                    fill="none"
                    stroke="#D93025"
                    strokeWidth="1.8"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <span className="text-xs font-medium text-gray-700">Gmail</span>
            </button>

            {/* Facebook */}
            <button
              onClick={handleFacebookShare}
              className="flex flex-col items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center shadow-md">
                <svg
                  className="w-8 h-8 text-white"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </div>
              <span className="text-xs font-medium text-gray-700">Facebook</span>
            </button>

            {/* Twitter/X */}
            <button
              onClick={handleTwitterShare}
              className="flex flex-col items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="w-14 h-14 bg-black rounded-full flex items-center justify-center shadow-md">
                <svg
                  className="w-7 h-7 text-white"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </div>
              <span className="text-xs font-medium text-gray-700">Twitter</span>
            </button>
          </div>

          {/* Share Link */}
          <div className="bg-gray-50 rounded-lg p-3 flex items-center gap-3">
            <span className="text-sm text-gray-600 truncate flex-1 min-w-0">
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
      </div>
    </div>
  );
}
