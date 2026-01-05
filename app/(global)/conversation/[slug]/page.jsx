'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect, useMemo } from 'react';
import { ArrowLeft } from 'lucide-react';
import ChatInterface from '@/components/ChatInterface';
import {
  useGetMyServiceRequestsQuery,
  useCancelServiceRequestMutation,
  useCancelBundleParticipationMutation,
} from '@/redux/api/servicesApi';
import toast from 'react-hot-toast';
import CancelRequestModal from '@/components/Global/Modals/CancelRequestModal';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export default function ConversationPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug;

  const [requestType, setRequestType] = useState(null); // 'service' or 'bundle'
  const [itemId, setItemId] = useState(null);
  const [overrideStatus, setOverrideStatus] = useState(null);
  const [overrideCancellation, setOverrideCancellation] = useState({
    reason: null,
    by: null,
  });
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showCancelReason, setShowCancelReason] = useState(false);

  useEffect(() => {
    if (slug) {
      if (slug.startsWith('request-')) {
        setRequestType('service');
        setItemId(slug.replace('request-', ''));
      } else if (slug.startsWith('bundle-')) {
        setRequestType('bundle');
        setItemId(slug.replace('bundle-', ''));
      }
    }
  }, [slug]);

  const { data: myRequestsData, isLoading, error } = useGetMyServiceRequestsQuery();
  const [cancelServiceRequest, { isLoading: isCancellingService }] = useCancelServiceRequestMutation();
  const [cancelBundleParticipation, { isLoading: isCancellingBundle }] = useCancelBundleParticipationMutation();
  const isCancelling = isCancellingService || isCancellingBundle;

  useEffect(() => {
    setOverrideStatus(null);
    setOverrideCancellation({ reason: null, by: null });
    setShowCancelConfirm(false);
    setShowCancelReason(false);
  }, [itemId]);

  const requestObject = useMemo(() => {
    if (!itemId) return null;
    const serviceRequest = myRequestsData?.serviceRequests?.items?.find((r) => r._id === itemId);
    const bundle = myRequestsData?.bundles?.items?.find((b) => b._id === itemId);

    if (requestType === 'service' && serviceRequest) {
      const request = serviceRequest;
      return {
        id: itemId,
        type: 'service',
        title: request.serviceType || request.service?.name || 'Service Request',
        description: request.problem || request.note || request.description || 'No description provided',
        image:
          request.coverImage ||
          request.provider?.profileImage?.url ||
          'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=400&h=300&fit=crop',
        avgPrice: request.price
          ? `$${request.price}/hr`
          : request.service?.price
            ? `$${request.service.price}`
            : 'N/A',
        rating: request.service?.rating || request.provider?.rating || 0,
        reviews: request.service?.reviews || 0,
        date: request.scheduledDate
          ? new Date(request.scheduledDate).toLocaleDateString('en-US', {
              day: 'numeric',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit',
            })
          : 'N/A',
        status: request.status,
        cancellationReason: request.cancellationReason,
        cancelledBy: request.cancelledBy,
      };
    }

    if (requestType === 'bundle' && bundle) {
      return {
        id: itemId,
        type: 'bundle',
        title: bundle.title || bundle.name || 'Bundle Request',
        description: bundle.description || 'No description provided',
        image:
          bundle.coverImage ||
          bundle.provider?.businessLogo?.url ||
          'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=400&h=300&fit=crop',
        avgPrice: bundle.pricing?.finalPrice
          ? `$${bundle.pricing.finalPrice}`
          : bundle.finalPrice
            ? `$${bundle.finalPrice}`
            : 'N/A',
        rating: bundle.rating || bundle.provider?.rating || 0,
        reviews: bundle.reviews || 0,
        date: bundle.serviceDate
          ? new Date(bundle.serviceDate).toLocaleDateString('en-US', {
              day: 'numeric',
              month: 'short',
            })
          : 'N/A',
        status: bundle.status,
        cancellationReason: bundle.cancellationReason,
        cancelledBy: bundle.cancelledBy,
      };
    }

    return null;
  }, [itemId, requestType, myRequestsData]);

  const handleCancelClick = () => {
    if (!requestObject || isCancelling) return;
    setShowCancelConfirm(true);
  };

  const handleConfirmCancel = () => {
    setShowCancelConfirm(false);
    setShowCancelReason(true);
  };

  const handleSubmitCancelReason = async (note) => {
    try {
      if (requestType === 'service') {
        const res = await cancelServiceRequest({
          requestId: requestObject.id,
          ...(note ? { cancellationReason: note } : {}),
        }).unwrap();
        const reason =
          res?.data?.cancellationReason ||
          res?.cancellationReason ||
          note ||
          'Cancelled by customer.';
        setOverrideStatus('cancelled');
        setOverrideCancellation({ reason, by: 'user' });
        toast.success('Request cancelled.');
      } else if (requestType === 'bundle') {
        await cancelBundleParticipation({
          bundleId: requestObject.id,
          ...(note ? { cancellationReason: note } : {}),
        }).unwrap();
        const reason = note || 'Cancelled by customer.';
        setOverrideStatus('cancelled');
        setOverrideCancellation({ reason, by: 'user' });
        toast.success('Bundle participation cancelled.');
      } else {
        toast.error('Unsupported request type.');
        return;
      }
      router.push('/request');
    } catch (err) {
      console.error('Failed to cancel request:', err);
      toast.error(err?.data?.message || 'Failed to cancel request.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading conversation...</p>
        </div>
      </div>
    );
  }

  if (!requestObject || error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Conversation not found</p>
          <button
            onClick={() => router.back()}
            className="text-teal-600 hover:text-teal-700 font-medium"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <div className=" xl:w-full mx-auto p-4 sm:p-6 lg:p-8">
        {/* Back Button */}
        {/* <button
          onClick={() => router.back()}
          className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back</span>
        </button> */}

        {/* Chat Interface */}
        <ChatInterface
          request={requestObject}
          onCancel={handleCancelClick}
          status={overrideStatus || requestObject.status}
          cancellationReason={overrideCancellation.reason || requestObject.cancellationReason}
          cancelledBy={overrideCancellation.by || requestObject.cancelledBy}
        />
      </div>

      {/* Cancel confirmation modal */}
      <Dialog open={showCancelConfirm} onOpenChange={setShowCancelConfirm}>
        <DialogContent className="sm:max-w-md bg-white rounded-2xl">
          <DialogHeader>
            <DialogTitle>
              {requestType === 'bundle' ? 'Cancel this bundle?' : 'Cancel this request?'}
            </DialogTitle>
            <DialogDescription>
              {requestType === 'bundle'
                ? 'This will cancel your participation in the bundle. You can add a reason on the next step.'
                : 'This will cancel the service request. You can add a reason on the next step.'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 flex-row justify-end gap-2">
            <Button variant="outline" onClick={() => setShowCancelConfirm(false)}>
              Keep request
            </Button>
            <Button className="bg-red-500 hover:bg-red-600 text-white" onClick={handleConfirmCancel}>
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel reason modal */}
      <CancelRequestModal
        isOpen={showCancelReason}
        onClose={() => setShowCancelReason(false)}
        onConfirm={handleSubmitCancelReason}
        title="Cancellation reason"
        description="Please share a quick reason so we can improve."
        label="Reason (optional)"
        submitLabel={isCancelling ? 'Cancelling...' : 'Submit and cancel'}
        placeholder="Type here"
        isSubmitting={isCancelling}
      />
    </div>
  );
}
