'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { MoreVertical, Send, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSocket } from '@/hooks/useSocket';
import { useLazyGetQuickChatsQuery, useCreateQuickChatMutation, useDeleteQuickChatMutation } from '@/redux/api/quickChatApi';
import { useGetUserProfileQuery } from '@/redux/api/servicesApi';

export default function ChatInterface({
  request,
  onCancel,
  status = 'accepted',
  cancellationReason = null,
  cancelledBy = null
}) {
  const messagesEndRef = useRef(null);
  const [newQuickChatText, setNewQuickChatText] = useState('');
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
    setMessages,
    joinConversation,
    sendQuickChat,
  } = useSocket(token);

  // Quick Chats API
  const [fetchQuickChats, { data: quickChatsData, isLoading: quickChatsLoading, isFetching: quickChatsFetching }] = useLazyGetQuickChatsQuery();
  const [createQuickChat] = useCreateQuickChatMutation();
  const [deleteQuickChat] = useDeleteQuickChatMutation();

  const quickChats = quickChatsData?.data?.quickChats || [];

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

  useEffect(() => {
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
  const handleAddQuickChat = async () => {
    if (!newQuickChatText.trim()) return;

    try {
      await createQuickChat(newQuickChatText.trim()).unwrap();
      setNewQuickChatText('');
      setShowAddQuickChat(false);
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

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
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
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-gray-900">{request.title}</h3>
              {/* Connection Status */}
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                isConnected ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-600'
              }`}>
                {isConnected ? '• Connected' : '• Connecting...'}
              </span>
              {status === 'accepted' && (
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-600">
                  • Accepted
                </span>
              )}
              {status === 'done' && (
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                  • Done
                </span>
              )}
              {status === 'cancelled' && (
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-600">
                  • Cancelled
                </span>
              )}
            </div>
            {status === 'accepted' && onCancel && (
              <Button
                onClick={onCancel}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 h-8 text-sm rounded-md"
              >
                Cancel
              </Button>
            )}
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
            {request.rating > 0 && (
              <div className="flex items-center gap-1">
                <span className="text-yellow-400">★</span>
                <span className="font-medium text-gray-900">{request.rating}</span>
                <span className="text-gray-500">({request.reviews.toLocaleString()} reviews)</span>
              </div>
            )}
          </div>

          {/* Date */}
          <div className="mt-1 text-xs text-gray-500">
            Date : {request.date}
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div ref={scrollContainerRef} className="p-4 space-y-3 max-h-96 overflow-y-auto bg-gray-50">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 text-sm py-8">
            No messages yet. Start the conversation with a quick chat!
          </div>
        ) : (
          messages.map((msg, index) => {
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

      {/* Quick Chats - Only show for accepted status */}
      {status === 'accepted' && (
        <div className="p-4 bg-white border-t border-gray-200">
          {quickChatsLoading || quickChatsFetching ? (
            <div className="text-center text-gray-500 text-sm py-4">Loading quick chats...</div>
          ) : (
            <>
              {quickChats.length > 0 && (
                <div className="space-y-2 mb-3">
                  {quickChats.map((chat) => (
                    <div
                      key={chat._id}
                      className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-center justify-between cursor-pointer hover:bg-yellow-100 transition-colors"
                      onClick={() => handleQuickChatClick(chat)}
                    >
                      <p className="text-sm text-gray-700 flex-1">{chat.content}</p>
                      <div className="flex items-center gap-2 ml-2">
                        {chat.createdByRole !== 'admin' && (
                          <button
                            className="text-red-400 hover:text-red-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteQuickChat(chat._id);
                            }}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                        <MoreVertical className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Quick Chat Section */}
              {showAddQuickChat ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={newQuickChatText}
                    onChange={(e) => setNewQuickChatText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddQuickChat()}
                    placeholder="Enter quick chat message..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={handleAddQuickChat}
                      className="flex-1 bg-teal-600 hover:bg-teal-700 text-white"
                    >
                      Create Quick Chat
                    </Button>
                    <Button
                      onClick={() => {
                        setShowAddQuickChat(false);
                        setNewQuickChatText('');
                      }}
                      variant="outline"
                      className="px-4"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  onClick={() => setShowAddQuickChat(true)}
                  variant="outline"
                  className="w-full border-2 border-teal-600 text-teal-600 hover:bg-teal-50 h-10 rounded-lg font-medium flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Quick Chat
                </Button>
              )}
            </>
          )}
        </div>
      )}

      {/* Cancellation Reason - Show for cancelled or done status */}
      {(status === 'cancelled' || status === 'done') && cancellationReason && (
        <div className="p-6 bg-white border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600 mb-2">
            {cancellationReason}
          </p>
          <p className="text-sm font-medium text-gray-900">
            Cancellation reason provided by {cancelledBy === 'user' ? 'you' : (cancelledBy || 'provider')}.
          </p>
        </div>
      )}
    </div>
  );
}
