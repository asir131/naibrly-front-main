'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect, useMemo } from 'react';
import { ArrowLeft } from 'lucide-react';
import ChatInterface from '@/components/ChatInterface';
import { useGetMyServiceRequestsQuery } from '@/redux/api/servicesApi';

export default function ConversationPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug;

  const [requestType, setRequestType] = useState(null); // 'service' or 'bundle'
  const [itemId, setItemId] = useState(null);

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
          request.service?.image?.url ||
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
          bundle.image?.url ||
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

  const handleCancel = () => {
    // TODO: Implement cancel functionality
    console.log('Cancel conversation');
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
          onCancel={handleCancel}
          status={requestObject.status}
          cancellationReason={requestObject.cancellationReason}
          cancelledBy={requestObject.cancelledBy}
        />
      </div>
    </div>
  );
}
