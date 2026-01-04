'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

export default function CancelRequestModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure!',
  description = 'you want to cancel this order?',
  label = 'Note why*',
  placeholder = 'Type here',
  submitLabel = 'Cancelled',
  isSubmitting = false,
}) {
  const [note, setNote] = useState('');

  const handleCancel = () => {
    onConfirm(note);
    setNote('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white rounded-2xl p-0">
        <DialogTitle className="sr-only">Cancel Request</DialogTitle>
        <div className="p-8 flex flex-col items-center text-center">
          {/* Icon */}
          <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mb-6 shadow-md">
            <X className="w-10 h-10 text-red-500" strokeWidth={2.5} />
          </div>

          {/* Title */}
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {title}
          </h2>

          {/* Description */}
          <p className="text-sm text-gray-600 mb-6">
            {description}
          </p>

          {/* Input Field */}
          <div className="w-full mb-6">
            <label className="block text-left text-sm font-medium text-gray-700 mb-2">
              {label}
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={placeholder}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Button */}
          <Button
            onClick={handleCancel}
            disabled={isSubmitting}
            className="w-full bg-red-500 hover:bg-red-600 text-white h-12 rounded-lg font-medium"
          >
            {submitLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
