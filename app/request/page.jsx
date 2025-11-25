'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { useGetMyServiceRequestsQuery } from '@/redux/api/servicesApi';
import PendingConfirmationModal from '@/components/Global/Modals/PendingConfirmationModal';
import QuickChatMessaging from '@/components/Global/Modals/QuickChatMessaging';
import CancelRequestModal from '@/components/Global/Modals/CancelRequestModal';
import RequestAmountCard from '@/components/Global/Modals/RequestAmountCard';
import ReviewAndConfirm from '@/components/Global/Modals/ReviewAndConfirm';
import PaymentInformationModal from '@/components/Global/Modals/PaymentInformationModal';
import TaskCompletedModal from '@/components/Global/Modals/TaskCompletedModal';

export default function RequestPage() {
  const [activeTab, setActiveTab] = useState('open');
  const [showPendingModal, setShowPendingModal] = useState(false);
  const [selectedAcceptedRequest, setSelectedAcceptedRequest] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showTaskCompletedModal, setShowTaskCompletedModal] = useState(false);

  // Request flow states
  const [requestFlowState, setRequestFlowState] = useState('accepted');
  // 'accepted' -> 'provider-accepted' -> 'payment' -> 'done' or 'cancelled'
  const [requestAmountStatus, setRequestAmountStatus] = useState('waiting'); // 'waiting' or 'accepted'

  // Fetch service requests from API (uses global caching settings from servicesApi)
  const { data, isLoading, error, refetch } = useGetMyServiceRequestsQuery();


  // Transform API data to component format and filter by status
  const { openRequests, closedRequests } = useMemo(() => {
    if (!data) {
      return { openRequests: [], closedRequests: [] };
    }

    const transformRequest = (request) => {
      // Map status to UI format
      const statusMap = {
        pending: { label: 'Pending', color: 'text-orange-600', bg: 'bg-orange-50' },
        accepted: { label: 'Accepted', color: 'text-green-600', bg: 'bg-green-50' },
        completed: { label: 'Done', color: 'text-gray-700', bg: 'bg-gray-100' },
        cancelled: { label: 'Cancel', color: 'text-red-600', bg: 'bg-red-50' },
      };

      const statusInfo = statusMap[request.status] || statusMap.pending;

      // Format date
      const date = new Date(request.scheduledDate);
      const formattedDate = date.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      });

      return {
        id: request._id,
        type: 'service',
        title: request.serviceType,
        description: request.problem || request.note || 'No description provided',
        avgPrice: request.price ? `$${request.price}/hr` : `$${request.estimatedHours ? request.estimatedHours * 20 : 60}/hr`,
        rating: request.provider?.rating || 0,
        reviews: 0, // API doesn't provide review count
        date: formattedDate,
        status: statusInfo.label,
        statusColor: statusInfo.color,
        statusBg: statusInfo.bg,
        image: request.provider?.profileImage?.url || request.provider?.businessLogo?.url || 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=200&h=200&fit=crop',
        amount: request.price || (request.estimatedHours || 3) * 20,
        providerName: request.provider ? `${request.provider.firstName} ${request.provider.lastName}` : 'Unknown Provider',
        businessName: request.provider?.businessNameRegistered || '',
        originalData: request, // Keep original data for detailed view
      };
    };

    const transformBundle = (bundle) => {
      // Map bundle status to UI format
      const statusMap = {
        pending: { label: 'Pending', color: 'text-orange-600', bg: 'bg-orange-50' },
        accepted: { label: 'Accepted', color: 'text-green-600', bg: 'bg-green-50' },
        completed: { label: 'Done', color: 'text-gray-700', bg: 'bg-gray-100' },
        cancelled: { label: 'Cancel', color: 'text-red-600', bg: 'bg-red-50' },
      };

      const statusInfo = statusMap[bundle.status] || statusMap.pending;

      // Format date
      const date = new Date(bundle.serviceDate);
      const formattedDate = date.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
      });

      // Combine service names
      const serviceNames = bundle.services?.map(s => s.name).join(', ') || 'Bundle Services';

      return {
        id: bundle._id,
        type: 'bundle',
        title: bundle.title,
        description: bundle.description || 'Bundle service package',
        avgPrice: `$${bundle.pricing?.finalPrice || bundle.finalPrice || 0}`,
        rating: bundle.provider?.rating || 0,
        reviews: 0,
        date: formattedDate,
        status: statusInfo.label,
        statusColor: statusInfo.color,
        statusBg: statusInfo.bg,
        image: bundle.provider?.businessLogo?.url || 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=200&h=200&fit=crop',
        amount: bundle.pricing?.finalPrice || bundle.finalPrice || 0,
        providerName: bundle.provider?.businessNameRegistered || 'No Provider Yet',
        businessName: bundle.provider?.businessNameRegistered || '',
        services: serviceNames,
        participants: bundle.currentParticipants || 0,
        maxParticipants: bundle.maxParticipants || 0,
        originalData: bundle, // Keep original data for detailed view
      };
    };

    // Transform service requests
    const transformedRequests = data.serviceRequests?.items?.map(transformRequest) || [];

    // Transform bundles
    const transformedBundles = data.bundles?.items?.map(transformBundle) || [];

    // Combine both arrays
    const allItems = [...transformedRequests, ...transformedBundles];

    // Filter: Open tab = pending + accepted, Closed tab = completed + cancelled
    const open = allItems.filter(item =>
      item.status === 'Pending' || item.status === 'Accepted'
    );
    const closed = allItems.filter(item =>
      item.status === 'Done' || item.status === 'Cancel'
    );

    return { openRequests: open, closedRequests: closed };
  }, [data]);

  const handlePendingClick = () => {
    setShowPendingModal(true);
  };

  const handleAcceptedClick = (request) => {
    setSelectedAcceptedRequest(request);
    setRequestFlowState('accepted');
    setRequestAmountStatus('waiting');
  };

  const handleCancelRequest = (note) => {
    console.log('Request cancelled with note:', note);
    setRequestFlowState('cancelled');
    setShowCancelModal(false);
  };

  const handleAcceptRequestAmount = () => {
    setRequestAmountStatus('accepted');
    setRequestFlowState('provider-accepted');
  };

  const handleConfirmAndPayment = (total) => {
    console.log('Total amount:', total);
    setShowPaymentModal(true);
  };

  const handlePaymentConfirm = (paymentInfo) => {
    console.log('Payment info:', paymentInfo);
    setShowPaymentModal(false);
    setShowTaskCompletedModal(true);
  };

  const handleTaskCompleted = (feedback) => {
    console.log('Task feedback:', feedback);
    setRequestFlowState('done');
    setShowTaskCompletedModal(false);
  };

  const RequestCard = ({ request }) => {
    const isPending = request.status === 'Pending';
    const isAccepted = request.status === 'Accepted';
    const isDone = request.status === 'Done';
    const isCancelled = request.status === 'Cancel';
    const isBundle = request.type === 'bundle';

    return (
      <div
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
        onClick={() => {
          if (isPending) handlePendingClick();
          else if (isAccepted) handleAcceptedClick(request);
          else if (isDone) {
            setSelectedAcceptedRequest(request);
            setRequestFlowState('done');
          }
          else if (isCancelled) {
            setSelectedAcceptedRequest(request);
            setRequestFlowState('cancelled');
          }
        }}
      >
        <div className="flex gap-4">
          {/* Image */}
          <div className="shrink-0">
            <div className="w-32 h-32 rounded-lg overflow-hidden bg-gray-200">
              <Image
                src={request.image}
                alt={request.title}
                width={128}
                height={128}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Header with title, badge, and status */}
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-gray-900">{request.title}</h3>
                {isBundle && (
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded">
                    Bundle
                  </span>
                )}
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${request.statusBg} ${request.statusColor} whitespace-nowrap ml-2`}>
                {request.status === 'Accepted' && '• Accepted'}
                {request.status === 'Pending' && '• Pending'}
                {request.status === 'Done' && '• Done'}
                {request.status === 'Cancel' && '• Cancelled'}
              </span>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {request.description}
            </p>

            {/* Bundle Services (if bundle) */}
            {isBundle && request.services && (
              <p className="text-xs text-teal-600 mb-2 font-medium">
                Services: {request.services}
              </p>
            )}

            {/* Price, Rating, and Date */}
            <div className="flex items-center gap-4 text-sm">
              <div>
                <span className="font-semibold text-gray-900">
                  {isBundle ? 'Price: ' : 'Avg. price: '}
                </span>
                <span className="text-gray-700">{request.avgPrice}</span>
              </div>
              {request.rating > 0 && (
                <div className="flex items-center gap-1">
                  <span className="text-yellow-400">★</span>
                  <span className="font-medium text-gray-900">{request.rating}</span>
                  <span className="text-gray-500">({request.reviews.toLocaleString()} reviews)</span>
                </div>
              )}
              {isBundle && (
                <div className="text-gray-600">
                  {request.participants}/{request.maxParticipants} joined
                </div>
              )}
            </div>

            {/* Date */}
            <div className="mt-2 text-sm text-gray-500">
              Date : {request.date}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-8">
        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-6">
          {/* Tabs */}
          <div className="flex gap-4 mb-8">
            <button
              onClick={() => setActiveTab('open')}
              className={`px-12 py-3 rounded-lg font-medium text-base transition-all ${
                activeTab === 'open'
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-gray-400'
              }`}
            >
              Open
            </button>
            <button
              onClick={() => setActiveTab('closed')}
              className={`px-12 py-3 rounded-lg font-medium text-base transition-all ${
                activeTab === 'closed'
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-gray-400'
              }`}
            >
              Closed
            </button>
          </div>

          {/* Request Cards or Messaging */}
          <div className="space-y-6">
            {/* Loading State */}
            {isLoading && (
              <div className="text-center py-16">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
                <p className="text-gray-500 text-lg mt-4">Loading your requests...</p>
              </div>
            )}

            {/* Error State */}
            {error && !isLoading && (
              <div className="text-center py-16">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                  <p className="text-red-600 text-lg font-medium mb-2">Failed to load requests</p>
                  <p className="text-red-500 text-sm mb-4">
                    {error?.status === 'FETCH_ERROR' || error?.originalStatus === undefined
                      ? 'Unable to connect to the server. Please check your internet connection or try again later.'
                      : error?.data?.message || 'An unexpected error occurred. Please try again later.'}
                  </p>
                  <button
                    onClick={() => refetch()}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                  >
                    Retry
                  </button>
                </div>
              </div>
            )}

            {/* Content - only show when not loading and no error */}
            {!isLoading && !error && (
              <>
                {selectedAcceptedRequest ? (
                  /* Show messaging interface when an accepted request is clicked */
                  <>
                    <QuickChatMessaging
                      request={selectedAcceptedRequest}
                      onCancel={() => setShowCancelModal(true)}
                      status={requestFlowState}
                      cancellationReason={requestFlowState === 'cancelled' || requestFlowState === 'done' ? 'The service was no longer required due to unforeseen circumstances.' : null}
                      cancelledBy={requestFlowState === 'cancelled' ? 'user' : requestFlowState === 'done' ? 'provider' : null}
                    />

                    {/* Request Amount Card - Show only in accepted or provider-accepted state */}
                    {(requestFlowState === 'accepted' || requestFlowState === 'provider-accepted') && (
                      <RequestAmountCard
                        request={selectedAcceptedRequest}
                        onCancel={() => setShowCancelModal(true)}
                        onAccept={handleAcceptRequestAmount}
                        status={requestAmountStatus}
                      />
                    )}

                    {/* Review and Confirm - Show only when provider has accepted */}
                    {requestFlowState === 'provider-accepted' && requestAmountStatus === 'accepted' && (
                      <ReviewAndConfirm
                        amount={selectedAcceptedRequest.amount}
                        onConfirm={handleConfirmAndPayment}
                      />
                    )}
                  </>
                ) : (
                  /* Show request cards when no accepted request is selected */
                  <>
                    {activeTab === 'open' && openRequests.map((request) => (
                      <RequestCard key={request.id} request={request} />
                    ))}
                    {activeTab === 'closed' && closedRequests.map((request) => (
                      <RequestCard key={request.id} request={request} />
                    ))}
                  </>
                )}

                {/* Empty State */}
                {!selectedAcceptedRequest && ((activeTab === 'open' && openRequests.length === 0) ||
                  (activeTab === 'closed' && closedRequests.length === 0)) && (
                  <div className="text-center py-16">
                    <p className="text-gray-500 text-lg">No requests found</p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Back button when viewing messaging */}
          {selectedAcceptedRequest && (
            <button
              onClick={() => setSelectedAcceptedRequest(null)}
              className="mt-4 px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors"
            >
              Back to Requests
            </button>
          )}
        </div>
      </div>

      {/* Pending Confirmation Modal */}
      <PendingConfirmationModal
        isOpen={showPendingModal}
        onClose={() => setShowPendingModal(false)}
      />

      {/* Cancel Request Modal */}
      <CancelRequestModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleCancelRequest}
      />

      {/* Payment Information Modal */}
      <PaymentInformationModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onConfirm={handlePaymentConfirm}
      />

      {/* Task Completed Modal */}
      <TaskCompletedModal
        isOpen={showTaskCompletedModal}
        onClose={() => setShowTaskCompletedModal(false)}
        onSubmit={handleTaskCompleted}
        providerName="Jacob Malcle"
      />
    </>
  );
}
