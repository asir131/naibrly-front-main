'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { MoreVertical, Send, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSocket } from '@/hooks/useSocket';
import { useLazyGetQuickChatsQuery, useCreateQuickChatMutation, useDeleteQuickChatMutation, useUpdateQuickChatMutation } from '@/redux/api/quickChatApi';
import { useGetUserProfileQuery, useGetCustomerMoneyRequestsQuery, useAcceptMoneyRequestMutation, useCancelMoneyRequestMutation, usePayMoneyRequestMutation } from '@/redux/api/servicesApi';
import toast from 'react-hot-toast';
import { skipToken } from '@reduxjs/toolkit/query';
import AddQuickChatModal from '@/components/AddQuickChatModal';
import EditQuickChatModal from '@/components/EditQuickChatModal';

const StatusPill = ({ label = 'Accepted', isConnected = false }) => (
  <div className="flex gap-2 flex-wrap">
    {isConnected && (
      <span className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-600">
        <span className="h-2 w-2 rounded-full bg-green-500" />
        Connected
      </span>
    )}
    <span className="inline-flex items-center gap-2 rounded-full bg-[#E8F7EE] px-3 py-1 text-xs font-semibold text-[#0E7A60]">
      <span className="h-2 w-2 rounded-full bg-[#34D399]" />
      {label}
    </span>
  </div>
);

const QuickChatItem = ({ chat, onSend, onDelete, onEdit }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const isAdmin = chat.createdByRole === 'admin';

  return (
    <div
      className="rounded-[14px] border w-full border-amber-200 bg-amber-50 px-4 py-2 shadow-sm cursor-pointer "
      onClick={() => onSend?.(chat)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 flex items-start justify-between gap-2">
          <p className="text-sm text-gray-800 leading-6">{chat.content}</p>
          {isAdmin && (
            <span className="text-xs font-medium flex items-center text-gray-800 opacity-50">Admin</span>
          )}
        </div>
        {!isAdmin && (
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen((v) => !v);
              }}
              className="h-8 w-8 inline-flex items-center justify-center text-gray-700 hover:text-gray-900 transition"
              title="Actions"
            >
              <MoreVertical className="w-4 h-4 opa" />
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-32 rounded-lg border border-gray-200 bg-white shadow-lg z-10" onClick={(e) => e.stopPropagation()}>
                <button
                  className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                  onClick={() => {
                    setMenuOpen(false);
                    setEditOpen(true);
                  }}
                >
                  Edit
                </button>
                <button
                  className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                  onClick={() => {
                    setMenuOpen(false);
                    onDelete?.(chat._id);
                  }}
                >
                  Delete
                </button>
              </div>
            )}
            <EditQuickChatModal
              open={editOpen}
              onClose={() => setEditOpen(false)}
              initialText={chat.content}
              size={10}
              onSubmit={(value) => onEdit?.(chat._id, value)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default function ChatInterface({
  request,
  onCancel,
  status = 'accepted',
  cancellationReason = null,
  cancelledBy = null
}) {
  const messagesEndRef = useRef(null);
  const [localStatus, setLocalStatus] = useState(status);
  const [optimisticMoneyRequests, setOptimisticMoneyRequests] = useState([]);
  const [acceptedRequest, setAcceptedRequest] = useState(null);
  const [tipAmount, setTipAmount] = useState('');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const searchParams = useSearchParams();
  const [showAddQuickChat, setShowAddQuickChat] = useState(false);
  const [imageErrors, setImageErrors] = useState({});

  // Get auth token from localStorage
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

  // Get current user's profile
  const { data: profileData } = useGetUserProfileQuery();
  const currentUser = profileData?.user;

  // Socket connection
  const {
    isConnected,
    messages,
    joinConversation,
    sendQuickChat,
  } = useSocket(token);

  // Quick Chats API
  const [fetchQuickChats, { data: quickChatsData, isLoading: quickChatsLoading, isFetching: quickChatsFetching }] = useLazyGetQuickChatsQuery();
  const [createQuickChat] = useCreateQuickChatMutation();
  const [deleteQuickChat] = useDeleteQuickChatMutation();
  const [updateQuickChat] = useUpdateQuickChatMutation();

  const quickChats = quickChatsData?.data?.quickChats || [];

  // Money request fetching when request is completed
  const isCompleted = (request?.status || localStatus || '').toLowerCase() === 'completed';
  const moneyReqArgs = request?.id
    ? request.type === 'service'
      ? { serviceRequestId: request.id }
      : { bundleId: request.id }
    : skipToken;

  const shouldFetchMoneyReq = moneyReqArgs !== skipToken;

  const {
    data: moneyReqData,
    isLoading: moneyReqLoading,
    refetch: refetchMoneyReq,
  } = useGetCustomerMoneyRequestsQuery(moneyReqArgs, {
    skip: !shouldFetchMoneyReq,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const [acceptMoneyRequest, { isLoading: isAccepting }] = useAcceptMoneyRequestMutation();
  const [cancelMoneyRequest, { isLoading: isCancelling }] = useCancelMoneyRequestMutation();
  const [payMoneyRequest, { isLoading: isPaying }] = usePayMoneyRequestMutation();

  // Keep local status in sync with prop
  useEffect(() => {
    setLocalStatus(status);
  }, [status]);
  const statusLower = (localStatus || '').toLowerCase();
  const isCancelled = statusLower === 'cancelled';
  const canUseQuickChats = ['accepted', 'completed'].includes(statusLower);

  // Listen for direct money-request events from socket
  useEffect(() => {
    const handleMoneyReqCreated = (event) => {
      const payload = event?.detail;
      if (payload) {
        setOptimisticMoneyRequests((prev) => {
          if (payload.moneyRequestId && prev.some((p) => p._id === payload.moneyRequestId)) {
            return prev;
          }
          return [
            ...prev,
            {
              _id: payload.moneyRequestId || `temp-${Date.now()}` ,
              amount: payload.amount || 0,
              status: payload.status || 'pending',
              createdAt: new Date().toISOString(),
              fromRealtime: true,
            },
          ];
        });
        toast.success(`New payment request: $${payload.amount || 0}`);
      }
    };
    window.addEventListener('money-request-created', handleMoneyReqCreated);
    return () => window.removeEventListener('money-request-created', handleMoneyReqCreated);
  }, []);

  useEffect(() => {
    fetchQuickChats();
  }, [fetchQuickChats]);

  // Join conversation on mount
  useEffect(() => {
    if (isConnected && request) {
      const conversationData = {};

      if (request.type === 'service') {
        conversationData.requestId = request.id;
      } else if (request.type === 'bundle') {
        conversationData.bundleId = request.id;
      }

      console.log('🎯 Joining conversation:', conversationData);
      joinConversation(conversationData);
    }
  }, [isConnected, request?.id, request?.type]);

  // Auto-scroll to bottom only when new messages arrive AND user is near bottom
  const prevMessagesLengthRef = useRef(messages.length);
  const scrollContainerRef = useRef(null);
  // Filter out system signals from chat display
  const visibleMessages = messages.filter(
    (msg) => !(msg?.content && msg.content.startsWith('__'))
  );

  // Track last processed message index for system signals
  const lastProcessedIndexRef = useRef(0);

  useEffect(() => {
    // Listen for special system messages to update status/money requests in realtime
    for (let i = lastProcessedIndexRef.current; i < messages.length; i++) {
      const msg = messages[i];
      if (msg?.content?.startsWith('__TASK_COMPLETED__')) {
        setLocalStatus('completed');
        if (shouldFetchMoneyReq) {
          refetchMoneyReq();
        }
      }
      if (msg?.content?.startsWith('__MONEY_REQUEST__')) {
        if (shouldFetchMoneyReq) {
          refetchMoneyReq();
        }
      }
    }
    lastProcessedIndexRef.current = messages.length;

    // Only scroll if messages length increased (new message added)
    if (messages.length > prevMessagesLengthRef.current && messages.length > 0) {
      const container = scrollContainerRef.current;
      const currentUserRole = typeof window !== 'undefined' ? localStorage.getItem('userType') : null;
      const lastMessage = messages[messages.length - 1];
      const isMyMessage = lastMessage?.senderRole === currentUserRole;

      if (!container) {
        prevMessagesLengthRef.current = messages.length;
        return;
      }

      // Always scroll if the current user sent the message
      if (isMyMessage) {
        setTimeout(() => {
          // Scroll the chat container, not the entire page
          container.scrollTo({
            top: container.scrollHeight,
            behavior: 'smooth'
          });
        }, 100);
      } else {
        // For other users' messages, check if user is near the bottom
        const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 150;

        if (isNearBottom) {
          setTimeout(() => {
            container.scrollTo({
              top: container.scrollHeight,
              behavior: 'smooth'
            });
          }, 100);
        }
      }
    }
    prevMessagesLengthRef.current = messages.length;
  }, [messages]);

  // Handle quick chat click
  const handleQuickChatClick = (quickChat) => {
    if (isCancelled) {
      console.warn('Cannot send quick chat - request is cancelled');
      return;
    }
    if (!isConnected) {
      console.warn('⚠️ Cannot send message - not connected');
      return;
    }

    const messageData = {
      quickChatId: quickChat._id,
    };

    if (request.type === 'service') {
      messageData.requestId = request.id;
    } else if (request.type === 'bundle') {
      messageData.bundleId = request.id;
    }

    console.log('⚡ Customer sending quick chat:', messageData);
    console.log('👤 Customer Profile when sending:', {
      currentUser: currentUser,
      profileImage: currentUser?.profileImage,
      profileImageType: typeof currentUser?.profileImage,
      profileImageUrl: currentUser?.profileImage?.url,
      firstName: currentUser?.firstName,
      lastName: currentUser?.lastName
    });
    sendQuickChat(messageData);
  };

  // Handle add new quick chat
  const handleAddQuickChat = async (text) => {
    const value = (text || '').trim();
    if (!value) return;
    try {
      await createQuickChat(value).unwrap();
    } catch (error) {
      console.error('Failed to create quick chat:', error);
    }
  };

  // Handle delete quick chat
  const handleDeleteQuickChat = async (quickChatId) => {
    try {
      await deleteQuickChat(quickChatId).unwrap();
    } catch (error) {
      console.error('Failed to delete quick chat:', error);
    }
  };

  const handleUpdateQuickChat = async (quickChatId, content) => {
    try {
      await updateQuickChat({ quickChatId, content }).unwrap();
    } catch (error) {
      console.error('Failed to update quick chat:', error);
    }
  };

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    try {
      const date = new Date(timestamp);
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      });
    } catch (error) {
      return '';
    }
  };

  const handleAcceptMoneyRequest = async (moneyRequestId) => {
    try {
      const res = await acceptMoneyRequest({ moneyRequestId }).unwrap();
      const accepted = res?.moneyRequest || moneyRequests.find((mr) => mr._id === moneyRequestId);
      setAcceptedRequest(accepted || { _id: moneyRequestId, amount: 0 });
      refetchMoneyReq();
    } catch (error) {
      console.error('Failed to accept money request:', error);
      alert(error?.data?.message || 'Failed to accept money request. Please try again.');
    }
  };

  const handleCancelMoneyRequest = async (moneyRequestId) => {
    try {
      await cancelMoneyRequest({ moneyRequestId }).unwrap();
      refetchMoneyReq();
    } catch (error) {
      console.error('Failed to cancel money request:', error);
      alert(error?.data?.message || 'Failed to cancel money request. Please try again.');
    }
  };

  const moneyRequests = moneyReqData?.moneyRequests || [];
  const mergedMoneyRequests = [
    ...moneyRequests,
    ...optimisticMoneyRequests.filter(
      (opt) => !moneyRequests.some((mr) => mr._id === opt._id)
    ),
  ];

  // Keep accepted request in sync with latest data
  useEffect(() => {
    const accepted = moneyRequests.find((mr) => mr.status === 'accepted');
    setAcceptedRequest(accepted || null);
  }, [moneyRequests]);

  const handleConfirmPayment = async () => {
    try {
      const res = await payMoneyRequest({ moneyRequestId: acceptedRequest?._id }).unwrap();
      const sessionUrl = res?.checkoutUrl || res?.sessionUrl || res?.sessionId;
      if (sessionUrl) {
        window.location.href = sessionUrl;
      } else {
        alert('Payment session created, but no redirect URL returned.');
      }
    } catch (error) {
      console.error('Failed to initiate payment:', error);
      alert(error?.data?.message || 'Failed to initiate payment. Please try again.');
    }
  };

  const handleSubmitReview = async () => {
    if (!reviewRating) return toast.error('Please select a rating');
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
      const apiBase = (process.env.NEXT_PUBLIC_API_BASE_URL || '').replace(/\/$/, '');
      const body = JSON.stringify({ rating: reviewRating, comment: reviewComment });
      const endpoint =
        request.type === 'bundle'
          ? `${apiBase}/bundles/${request.id}/review`
          : `${apiBase}/service-requests/${request.id}/review`;

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body,
      });

      const contentType = res.headers.get('content-type') || '';
      const data = contentType.includes('application/json') ? await res.json() : { message: await res.text() };
      if (!res.ok || !data?.success) {
        throw new Error(data?.message || 'Failed to submit review');
      }

      toast.success('Thanks for your feedback!');
      setShowReviewModal(false);
    } catch (err) {
      console.error('Review submit error:', err);
      toast.error(err.message || 'Failed to submit review');
    }
  };

  // Handle payment success via query params (redirect from Stripe)
  useEffect(() => {
    const paymentSuccess = searchParams.get('paymentSuccess');
    const moneyRequestId = searchParams.get('moneyRequestId');
    const sessionId = searchParams.get('session_id');

    const hasProcessed = sessionStorage.getItem(`paymentSuccess-${moneyRequestId}`);
    if (paymentSuccess === '1' && moneyRequestId && sessionId && !hasProcessed) {
      // Mark processed to avoid loops on re-render
      sessionStorage.setItem(`paymentSuccess-${moneyRequestId}`, '1');

      // Call backend success endpoint to finalize and then show toast/modal
      const finalizePayment = async () => {
        try {
          const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
          await fetch(
            `/api/money-requests/${moneyRequestId}/payment-success?session_id=${sessionId}&format=json`,
            {
              method: 'GET',
              headers: token
                ? { Authorization: `Bearer ${token}`, Accept: 'application/json' }
                : { Accept: 'application/json' },
            }
          );
          toast.success('Payment completed');
          setShowReviewModal(true);
          refetchMoneyReq();
        } catch (err) {
          console.error('Finalize payment error:', err);
          toast.error('Payment processed, but confirmation failed to sync.');
        }
      };

      finalizePayment();
    }
  }, [searchParams, refetchMoneyReq]);

  const baseAmount = parseFloat(acceptedRequest?.amount) || 0;
  const discountPercent =
    request?.type === 'bundle' ? Number(request?.pricing?.discountPercent || 0) : 0;
  const inferredOriginal =
    request?.type === 'bundle' && discountPercent > 0
      ? baseAmount / (1 - discountPercent / 100)
      : baseAmount;
  const inferredDiscount = Math.max(inferredOriginal - baseAmount, 0);
  const totalAmount = baseAmount + (parseFloat(tipAmount) || 0);

  return (
    <div className="min-h-[calc(100vh-140px)] bg-[#F6F7FB] p-4 sm:p-6">
      <div className=" mx-auto space-y-4">
      {/* Service Header */}
      <div className="bg-gray-50 p-4 border-b border-gray-200 flex gap-4">
        {/* Image */}
        <div className="shrink-0">
          <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-200">
            <Image
              src={request.image}
              alt={request.title}
              width={96}
              height={96}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header with title, status, and cancel button */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-2">
            <div>
              <h3 className="text-base font-semibold text-gray-900">{request.title}</h3>
            </div>
            <div className="flex flex-col items-start sm:items-end gap-2">
              <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2">
                {/* Connection Status */}
                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${
                  isConnected ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-600'
                }`}>
                  <span className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-400'}`} />
                  {isConnected ? 'Connected' : 'Connecting...'}
                </span>
                {localStatus === 'accepted' && (
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-600">
                    <span className="h-2 w-2 rounded-full bg-green-500" />
                    Accepted
                  </span>
                )}
                {localStatus === 'completed' && (
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                    <span className="h-2 w-2 rounded-full bg-gray-500" />
                    Done
                  </span>
                )}
                {localStatus === 'cancelled' && (
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-600">
                    <span className="h-2 w-2 rounded-full bg-red-500" />
                    Cancelled
                  </span>
                )}
              </div>
              {['pending', 'accepted'].includes((localStatus || '').toLowerCase()) && onCancel && (
                <Button
                  onClick={onCancel}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 h-8 text-sm rounded-md"
                >
                  Cancel
                </Button>
              )}
            </div>
          </div>
          {/* Description */}
          <p className="text-xs text-gray-600 mb-2 line-clamp-2">
            {request.description}
          </p>

          {/* Price, Rating, and Date */}
          <div className="flex items-center gap-3 text-xs">
            <div>
              <span className="font-semibold text-gray-900">
                {request.type === 'bundle' ? 'Price: ' : 'Avg. price: '}
              </span>
              <span className="text-gray-700">{request.avgPrice}</span>
            </div>
          </div>

          {/* Date */}
      <div className="mt-1 text-xs text-gray-500">
        Date : {request.date}
      </div>
    </div>
  </div>

      {/* Chat Messages */}
      <div ref={scrollContainerRef} className="p-4 space-y-4 max-h-[60vh] min-h-[400px] overflow-y-auto bg-gray-50">
        {visibleMessages.length === 0 ? (
          <div className="text-center text-gray-500 text-sm py-8">
            No messages yet. Start the conversation with a quick chat!
          </div>
        ) : (
          visibleMessages.map((msg, index) => {
            const currentUserRole = typeof window !== 'undefined' ? localStorage.getItem('userType') : null;
            const isCurrentUser = msg.senderRole === currentUserRole;

            // Get sender info - use current user's profile for their messages
            let senderInfo, firstName, lastName, senderName, profileImage;

            if (isCurrentUser && currentUser) {
              // Use current user's profile for messages they sent
              firstName = currentUser.firstName || '';
              lastName = currentUser.lastName || '';
              senderName = `${firstName} ${lastName}`.trim() || 'You';
              // Handle both object and string profileImage
              profileImage = typeof currentUser.profileImage === 'string'
                ? currentUser.profileImage
                : currentUser.profileImage?.url;
            } else {
              // For other users' messages, try to get from message data
              senderInfo = msg.senderInfo || msg.sender || {};
              firstName = senderInfo.firstName || senderInfo.first_name || '';
              lastName = senderInfo.lastName || senderInfo.last_name || '';
              senderName = `${firstName} ${lastName}`.trim() || 'User';
              // Handle both object and string profileImage
              profileImage = typeof senderInfo.profileImage === 'string'
                ? senderInfo.profileImage
                : senderInfo.profileImage?.url || senderInfo.profile_image || senderInfo.avatar;
            }

            // Debug log to check data - show full message object
            if (index === 0) {
              console.log('🔍 FULL Message object:', msg);
              console.log('🔍 Extracted data:', {
                senderRole: msg.senderRole,
                currentUserRole,
                isCurrentUser,
                senderInfo,
                senderName,
                profileImage,
                allMessageKeys: Object.keys(msg)
              });
            }

            return (
              <div key={msg._id || index} className={`flex gap-3 ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-6`}>
                {!isCurrentUser && (
                  <div className="w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center text-sm font-semibold text-gray-700 shrink-0 overflow-hidden">
                    {profileImage && !imageErrors[msg._id] ? (
                      <Image
                        src={profileImage}
                        alt={senderName}
                        width={36}
                        height={36}
                        className="w-full h-full object-cover"
                        onError={() => setImageErrors(prev => ({ ...prev, [msg._id]: true }))}
                        unoptimized
                      />
                    ) : (
                      <span>{firstName?.[0]?.toUpperCase() || lastName?.[0]?.toUpperCase() || 'U'}</span>
                    )}
                  </div>
                )}
                <div className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'} max-w-[65%]`}>
                  {/* Sender name and timestamp above bubble */}
                  <div className={`text-xs text-gray-600 mb-1 px-1 flex items-center gap-2 ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}>
                    <span className="font-semibold">{senderName}</span>
                    <span className="text-gray-400">{formatTimestamp(msg.timestamp)}</span>
                  </div>
                  {/* Message bubble */}
                  <div className={`px-4 py-2.5 rounded-xl ${
                    isCurrentUser
                      ? 'bg-[#0E7A60] text-white'
                      : 'bg-[#2D3748] text-white'
                  }`}>
                    <div className="text-sm leading-relaxed whitespace-pre-wrap break-words">{msg.content}</div>
                    {msg.isQuickChat && (
                      <div className="text-xs opacity-70 mt-1">Quick Chat</div>
                    )}
                  </div>
                </div>
                {isCurrentUser && (
                  <div className="w-9 h-9 rounded-full bg-[#0E7A60] flex items-center justify-center text-sm font-semibold text-white shrink-0 overflow-hidden">
                    {profileImage && !imageErrors[msg._id] ? (
                      <Image
                        src={profileImage}
                        alt={senderName}
                        width={36}
                        height={36}
                        className="w-full h-full object-cover"
                        onError={() => setImageErrors(prev => ({ ...prev, [msg._id]: true }))}
                        unoptimized
                      />
                    ) : (
                      <span>{firstName?.[0]?.toUpperCase() || lastName?.[0]?.toUpperCase() || 'Y'}</span>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Money Request - shown when conversation has any money request */}
      {shouldFetchMoneyReq && mergedMoneyRequests.length > 0 && !acceptedRequest && (
        <div className="border-t border-gray-200 bg-white px-4 py-4 space-y-3">
          <div className="text-sm font-semibold text-gray-900">Payment Request</div>
          {moneyReqLoading ? (
            <div className="text-sm text-gray-500">Loading payment request...</div>
          ) : (
            mergedMoneyRequests.map((mr) => (
              <div key={mr._id} className="rounded-xl border border-gray-200 bg-white shadow-sm">
                {/* Header / summary */}
                <div className="flex gap-4 p-4 border-b border-gray-100">
                  <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                    <Image
                      src={request.image}
                      alt={request.title}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          Request Amount: <span className="text-emerald-600">${mr.amount}</span>
                          {request.type === 'service' ? '/consult' : ''}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">{request.description}</p>
                      </div>
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${
                          mr.status === 'pending'
                            ? 'bg-amber-50 text-amber-700'
                            : mr.status === 'accepted'
                            ? 'bg-green-50 text-green-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {mr.status || 'pending'}
                      </span>
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-700">
                      <span className="font-semibold text-gray-900">
                        Avg. price: <span className="text-emerald-600">{request.avgPrice}</span>
                      </span>
                      <span className="text-gray-500">Date : {request.date}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 px-4 py-3 bg-gray-50 rounded-b-xl">
                  <Button
                    variant="outline"
                    className="h-9 px-4 text-sm border-red-200 text-red-600 hover:bg-red-50"
                    disabled={isAccepting || isCancelling || mr.status !== 'pending'}
                    onClick={() => handleCancelMoneyRequest(mr._id)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="h-9 px-4 text-sm bg-emerald-600 hover:bg-emerald-700"
                    disabled={isAccepting || isCancelling || mr.status !== 'pending'}
                    onClick={() => handleAcceptMoneyRequest(mr._id)}
                  >
                    Accept
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Review and confirm UI after accept */}
      {acceptedRequest?.status === 'accepted' && (
        <div className="border-t border-gray-200 bg-white px-4 py-4 space-y-3">
          <div className="text-sm font-semibold text-gray-900">Review and confirm</div>
          {request?.type === 'bundle' && acceptedRequest?.amount ? (
            <div className="rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-900">
              <span className="font-semibold">Bundle offer: </span>
              <span>
                {discountPercent > 0
                  ? `$${inferredOriginal.toFixed(2)} - $${inferredDiscount.toFixed(2)} (${discountPercent}% off) = $${baseAmount.toFixed(2)}`
                  : `$${baseAmount.toFixed(2)}`}
              </span>
            </div>
          ) : null}
          <div className="flex flex-col gap-3">
            <div className="flex flex-col md:flex-row md:items-center md:gap-3">
              <div className="flex-1">
                <label className="text-xs font-medium text-gray-700 block mb-1">Tips</label>
                <input
                  type="text"
                  value={tipAmount}
                  onChange={(e) => setTipAmount(e.target.value.replace(/[^0-9.]/g, ''))}
                  placeholder="$10"
                  className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <div className="w-full md:w-40">
                <div className="text-xs font-medium text-gray-700 mb-1">Total:</div>
                <div className="h-10 rounded-md border border-gray-200 px-3 flex items-center text-sm font-semibold text-gray-900 bg-gray-50">
                  ${totalAmount.toFixed(2)}
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-5"
                onClick={handleConfirmPayment}
                disabled={isPaying}
              >
                {isPaying ? 'Redirecting...' : 'Confirm and payment'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Chats - disabled only when cancelled */}
      {canUseQuickChats && !isCancelled && (
        <div className="p-4 bg-white rounded-2xl space-y-3 ">
          <div className="flex items-center justify-between">
            
            
          </div>
          {quickChatsLoading || quickChatsFetching ? (
            <div className="text-center text-gray-500 text-sm py-4">Loading quick chats...</div>
          ) : (
            <>
              {quickChats.length === 0 ? (
                <div className="text-sm text-gray-500 py-4 text-center">No quick chats yet.</div>
              ) : (
                <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
                  {quickChats.map((chat) => (
                    <QuickChatItem
                      key={chat._id}
                      chat={chat}
                      onSend={handleQuickChatClick}
                      onDelete={handleDeleteQuickChat}
                      onEdit={handleUpdateQuickChat}
                    />
                  ))}
                </div>
              )}

              <div className="flex justify-end">
                <Button
                  onClick={() => setShowAddQuickChat(true)}
                  variant="outline"
                  className="border border-[#0E7A60] text-[#0E7A60] hover:bg-[#0E7A60]/5 h-10 rounded-lg font-semibold flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Quick Chat
                </Button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Cancellation Reason - Show for cancelled or done status */}
      {(localStatus === 'cancelled' || localStatus === 'completed') && cancellationReason && (
        <div className="p-6 bg-white border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600 mb-2">
            {cancellationReason}
          </p>
          <p className="text-sm font-medium text-gray-900">
            Cancellation reason provided by {cancelledBy === 'user' ? 'you' : (cancelledBy || 'provider')}.
          </p>
        </div>
      )}

      <AddQuickChatModal
        open={showAddQuickChat}
        onClose={() => setShowAddQuickChat(false)}
        onSubmit={handleAddQuickChat}
      />

      {/* Review modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex flex-col items-center space-y-4">
              <div className="h-16 w-16 rounded-full border-2 border-emerald-500 flex items-center justify-center">
                <span className="text-emerald-500 text-3xl">✓</span>
              </div>
              <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-900">Task Completed</h2>
                <p className="text-sm text-gray-600">Average Rating and Feedback</p>
              </div>
              <div className="w-full">
                <p className="text-sm font-medium text-gray-900 mb-2">Avg. Rating</p>
                <div className="flex items-center justify-between">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setReviewRating(star)}
                      className="flex flex-col items-center space-y-1"
                    >
                      <span
                        className={`text-3xl ${
                          reviewRating >= star ? 'text-emerald-500' : 'text-gray-300'
                        }`}
                      >
                        ★
                      </span>
                      <span className="text-xs text-gray-600">
                        {star === 1
                          ? 'Bad'
                          : star === 2
                          ? 'Average'
                          : star === 3
                          ? 'Good'
                          : star === 4
                          ? 'Great'
                          : 'Amazing'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="w-full">
                <p className="text-sm font-medium text-gray-900 mb-1">Feedback Note</p>
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  placeholder="Type here"
                />
              </div>
              <Button
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                onClick={handleSubmitReview}
              >
                Done
              </Button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
