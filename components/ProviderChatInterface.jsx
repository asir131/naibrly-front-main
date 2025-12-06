'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { HiOutlineDotsVertical } from "react-icons/hi";
import { Plus, X } from 'lucide-react';
import { useSocket } from '@/hooks/useSocket';
import { useLazyGetQuickChatsQuery, useCreateQuickChatMutation, useUpdateQuickChatMutation, useDeleteQuickChatMutation } from '@/redux/api/quickChatApi';
import { useGetUserProfileQuery } from '@/redux/api/servicesApi';
import TaskCompletedModal from './TaskCompletedModal';
import AddQuickChatModal from './AddQuickChatModal';
import EditQuickChatModal from './EditQuickChatModal';
import CancelledNoteModal from './CancelledNoteModal';

const StatusPill = ({ label = 'Accepted', isConnected = false }) => (
    <div className="flex gap-2">
        {isConnected && (
            <span className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-600">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                Connected
            </span>
        )}
        <span className="inline-flex items-center gap-2 rounded-full bg-[#E8F7EE] px-4 py-2 text-sm font-semibold text-[#0E7A60]">
            <span className="h-2 w-2 rounded-full bg-[#34D399]" />
            {label}
        </span>
    </div>
);

const Dot = () => <span className="mx-1 inline-block h-1 w-1 rounded-full bg-[#C7C7C7]" />;

const OrderHeader = ({ order, onTaskDone, isConnected }) => {
    const [open, setOpen] = useState(false);
    const [amount, setAmount] = useState('');

    const handleDotClick = () => setOpen(!open);

    return (
        <div className="rounded-2xl bg-white shadow-sm ring-1 ring-black/5 p-6 md:p-7">
            <div className="flex items-start justify-between gap-4 relative">
                <div className="flex-1">
                    <p className="text-[20px] font-semibold text-[#111]">
                        {order.title}:{' '}
                        <span className="text-[#0E7A60]">${order.price}</span>
                        <span className="text-[#8F8F8F]">/consult</span>
                    </p>

                    <div className="mt-4 flex items-center gap-3">
                        <img
                            src={order.client?.avatar || 'https://i.pravatar.cc/80?img=5'}
                            alt={order.client?.name || 'Client'}
                            className="h-[44px] w-[44px] rounded-full object-cover"
                        />
                        <div className="flex flex-col">
                            <span className="text-[16px] font-semibold text-[#111]">
                                {order.client?.name || 'Client'}
                            </span>
                            <div className="flex items-center gap-2 text-[15px]">
                                <span className="text-[#F1C400]">★</span>
                                <span className="font-medium text-[#1D1D1F]">{order.rating?.toFixed(1) || '5.0'}</span>
                                <span className="text-[#8F8F8F]">({order.reviews || 0} reviews)</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-5">
                        <p className="mb-1 text-[16px] font-semibold text-[#111]">Problem Note for {order.title}</p>
                        <p className="text-[15px] leading-6 text-[#7F7F7F]">{order.problemNote || order.description}</p>
                    </div>

                    <div className="mt-4 text-[15px]">
                        <div className="mb-1">
                            <span className="font-semibold text-[#111]">Address:</span>{' '}
                            <span className="text-[#7F7F7F]">{order.address}</span>
                        </div>
                        <div className="text-[#7F7F7F]">
                            <span className="font-semibold text-[#111]">Service Date:</span>{' '}
                            <span>{order.serviceDate}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-start">
                    <StatusPill label={order.statusLabel || 'Accepted'} isConnected={isConnected} />
                </div>
                <div className="absolute right-0 bottom-0">
                    <button
                        onClick={handleDotClick}
                        type="button"
                        className="rounded-[12px] bg-[#0E7A60] px-4 py-2 text-[14px] font-semibold text-white hover:bg-[#0b5f4b] transition"
                    >
                        Task Done
                    </button>
                </div>
            </div>

            <TaskCompletedModal
                open={open}
                onClose={handleDotClick}
                amount={amount}
                setAmount={setAmount}
                onDone={onTaskDone}
            />
        </div>
    );
};

const ChatBubble = ({ side = 'left', name, timeAgo, text, senderInfo, profileImage }) => {
    const isRight = side === 'right';
    const avatarInitial = name?.[0]?.toUpperCase() || (isRight ? 'P' : 'C');
    const [imageError, setImageError] = useState(false);

    // Debug: Log what image URL we're trying to load
    useEffect(() => {
        console.log(`🖼️ ChatBubble (${side}):`, { name, profileImage, imageError, hasImage: !!profileImage });
    }, [profileImage, imageError, name, side]);

    return (
        <div className={`flex gap-3 ${isRight ? 'justify-end' : 'justify-start'} mb-6`}>
            {!isRight && (
                <div className="w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center text-sm font-semibold text-gray-700 shrink-0 overflow-hidden">
                    {profileImage && !imageError ? (
                        <Image
                            src={profileImage}
                            alt={name}
                            width={36}
                            height={36}
                            className="w-full h-full object-cover"
                            onError={() => setImageError(true)}
                            unoptimized
                        />
                    ) : (
                        <span>{avatarInitial}</span>
                    )}
                </div>
            )}

            <div className={`flex flex-col ${isRight ? 'items-end' : 'items-start'} max-w-[65%]`}>
                {/* Sender name and timestamp above bubble */}
                <div className={`text-xs text-gray-600 mb-1 px-1 flex items-center gap-2 ${isRight ? 'flex-row-reverse' : 'flex-row'}`}>
                    <span className="font-semibold">{name}</span>
                    <span className="text-gray-400">{timeAgo}</span>
                </div>

                {/* Message bubble */}
                <div className={`px-4 py-2.5 rounded-xl ${
                    isRight
                        ? 'bg-[#0E7A60] text-white'
                        : 'bg-[#2D3748] text-white'
                }`}>
                    <div className="text-sm leading-relaxed whitespace-pre-wrap break-words">{text}</div>
                </div>
            </div>

            {isRight && (
                <div className="w-9 h-9 rounded-full bg-[#0E7A60] flex items-center justify-center text-sm font-semibold text-white shrink-0 overflow-hidden">
                    {profileImage && !imageError ? (
                        <Image
                            src={profileImage}
                            alt={name}
                            width={36}
                            height={36}
                            className="w-full h-full object-cover"
                            onError={() => setImageError(true)}
                            unoptimized
                        />
                    ) : (
                        <span>{avatarInitial}</span>
                    )}
                </div>
            )}
        </div>
    );
};


const QuickChatItem = ({ quickChat, onSend, onUpdate, onDelete }) => {
    const [click, setClick] = useState(false);
    const [edit, setEdit] = useState(false);
    const [cancel, setCancel] = useState(false);

    const isAdminCreated = quickChat.createdByRole === 'admin';

    const handleEditClick = () => {
        setEdit(true);
        setClick(false);
    };

    const handleDotClick = () => setClick((v) => !v);

    const handleDeleteClick = () => {
        setCancel(true);
        setClick(false);
    };

    const handleCancelClick = () => setCancel(false);

    const handleConfirmDelete = () => {
        onDelete(quickChat._id);
        setCancel(false);
    };

    const handleSendClick = () => {
        onSend(quickChat);
    };

    const handleUpdateSubmit = async (value) => {
        await onUpdate({ quickChatId: quickChat._id, content: value });
        setEdit(false);
    };

    return (
        <div className="ready_message cursor-pointer" onClick={handleSendClick}>
            <p className="text-[14px] text-[#584E2B] flex-1">{quickChat.content}</p>
            <div className="relative">
                {!isAdminCreated && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDotClick();
                        }}
                        className="text-[#7F7F7F] cursor-pointer"
                    >
                        <HiOutlineDotsVertical />
                    </button>
                )}
                {isAdminCreated && (
                    <span className="text-xs text-gray-400">Admin</span>
                )}
                {click && (
                    <div className="absolute top-0 right-5 ml-2 z-50 rounded-[10px] bg-[#fff] text-black shadow-lg p-3 w-44">
                        <div
                            onClick={(e) => {
                                e.stopPropagation();
                                handleEditClick();
                            }}
                            className="py-2 text-[14px] font-semibold hover:text-[#fff] hover:pl-2 hover:pr-2 hover:rounded-[10px] hover:bg-[#0E7A60] cursor-pointer"
                        >
                            Edit
                        </div>
                        <div
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteClick();
                            }}
                            className="pt-2 text-[14px] font-semibold hover:text-[#fff] hover:pl-2 hover:pr-2 hover:rounded-[10px] hover:bg-[#0E7A60] cursor-pointer"
                        >
                            Delete
                        </div>
                    </div>
                )}
            </div>

            {cancel && (
                <CancelledNoteModal
                    open={cancel}
                    onClose={handleCancelClick}
                    onSubmit={handleConfirmDelete}
                    title="Delete Quick Chat"
                    message="Are you sure you want to delete this quick chat?"
                />
            )}

            {edit && (
                <EditQuickChatModal
                    open={edit}
                    initialText={quickChat.content}
                    onClose={() => setEdit(false)}
                    onSubmit={handleUpdateSubmit}
                />
            )}
        </div>
    );
};

export default function ProviderChatInterface({
    requestId,
    bundleId,
    customerId,
    orderData = null
}) {
    const messagesEndRef = useRef(null);
    const [click, setClick] = useState(false);
    const [stage, setStage] = useState('idle');

    // Initialize with default order data if not provided
    const defaultOrderData = {
        title: 'Service Request',
        price: 0,
        client: {
            name: 'Customer',
            avatar: 'https://i.pravatar.cc/80?img=5'
        },
        rating: 5.0,
        reviews: 0,
        problemNote: 'Connecting to conversation...',
        description: 'Service request',
        address: 'Loading...',
        serviceDate: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
        statusLabel: 'Accepted'
    };

    const [localOrderData, setLocalOrderData] = useState(orderData || defaultOrderData);

    // Get auth token
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    const currentUserRole = typeof window !== 'undefined' ? localStorage.getItem('userType') : null;

    // Get current user's profile
    const { data: profileData } = useGetUserProfileQuery();
    const currentUser = profileData?.user;

    // Debug: Log current user role
    useEffect(() => {
        console.log('🎭 Current User Role from localStorage:', currentUserRole);
        console.log('🎭 Current User from API:', currentUser);
    }, [currentUserRole, currentUser]);

    // Socket connection
    const {
        isConnected,
        messages,
        setMessages,
        joinConversation,
        sendQuickChat,
        getConversation,
    } = useSocket(token);

    // Quick Chats API
    const [fetchQuickChats, { data: quickChatsData, isLoading: quickChatsLoading, isFetching: quickChatsFetching, refetch: refetchQuickChats }] = useLazyGetQuickChatsQuery();
    const [createQuickChat] = useCreateQuickChatMutation();
    const [updateQuickChat] = useUpdateQuickChatMutation();
    const [deleteQuickChat] = useDeleteQuickChatMutation();

    const quickChats = quickChatsData?.data?.quickChats || [];

    useEffect(() => {
        fetchQuickChats();
    }, [fetchQuickChats]);

    // Join conversation on mount and fetch history
    useEffect(() => {
        if (!isConnected || (!requestId && !bundleId)) return;

        const conversationData = {};

        if (requestId) {
            conversationData.requestId = requestId;
        } else if (bundleId) {
            conversationData.bundleId = bundleId;
            if (customerId) {
                conversationData.customerId = customerId;
            }
        }

        console.log('👥 Provider joining conversation:', conversationData);
        joinConversation(conversationData);
        getConversation(conversationData);
    }, [isConnected, requestId, bundleId, customerId, joinConversation, getConversation]);

    // Auto-scroll to bottom only when new messages arrive AND user is near bottom
    const prevMessagesLengthRef = useRef(messages.length);
    const scrollContainerRef = useRef(null);

    useEffect(() => {
        // Only scroll if messages length increased (new message added)
        if (messages.length > prevMessagesLengthRef.current && messages.length > 0) {
            const container = scrollContainerRef.current;
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
    }, [messages, currentUserRole]);

    // Build order data from messages if not provided
    useEffect(() => {
        if (!localOrderData && messages.length > 0) {
            // Get customer info from first message
            const firstMessage = messages[0];
            const customerInfo = firstMessage.senderRole === 'customer'
                ? firstMessage.senderInfo
                : messages.find(m => m.senderRole === 'customer')?.senderInfo;

            // Create default order data
            setLocalOrderData({
                title: 'Service Request',
                price: 0,
                client: {
                    name: customerInfo ? `${customerInfo.firstName} ${customerInfo.lastName}` : 'Customer',
                    avatar: 'https://i.pravatar.cc/80?img=5'
                },
                rating: 5.0,
                reviews: 0,
                problemNote: 'Loading service details...',
                description: 'Service request in progress',
                address: 'Address not available',
                serviceDate: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
                statusLabel: 'Accepted'
            });
        }
    }, [messages, localOrderData]);

    // Format timestamp
    const formatTimestamp = (timestamp) => {
        if (!timestamp) return '';
        try {
            const now = new Date();
            const msgDate = new Date(timestamp);
            const diffInDays = Math.floor((now - msgDate) / (1000 * 60 * 60 * 24));

            if (diffInDays === 0) return 'Today';
            if (diffInDays === 1) return '1 day ago';
            if (diffInDays < 7) return `${diffInDays} days ago`;

            return msgDate.toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
            });
        } catch (error) {
            return '';
        }
    };

    // Handle quick chat send
    const handleQuickChatSend = (quickChat) => {
        if (!isConnected) {
            console.warn('⚠️ Socket not connected');
            return;
        }

        const messageData = {
            quickChatId: quickChat._id,
        };

        if (requestId) {
            messageData.requestId = requestId;
        } else if (bundleId) {
            messageData.bundleId = bundleId;
            if (customerId) {
                messageData.customerId = customerId;
            }
        }

        console.log('⚡ Provider sending quick chat:', messageData);
        console.log('👤 Current User Profile when sending:', {
            currentUser: currentUser,
            profileImage: currentUser?.profileImage,
            profileImageType: typeof currentUser?.profileImage,
            profileImageUrl: currentUser?.profileImage?.url,
            firstName: currentUser?.firstName,
            lastName: currentUser?.lastName
        });

        sendQuickChat(messageData);
    };

    // Handle add quick chat
    const handleAddQuickChat = async (text) => {
        if (!text?.trim()) return;

        try {
            await createQuickChat(text.trim()).unwrap();
            await refetchQuickChats();
            setClick(false);
        } catch (error) {
            console.error('Failed to create quick chat:', error);
        }
    };

    // Handle update quick chat
    const handleUpdateQuickChat = async ({ quickChatId, content }) => {
        try {
            await updateQuickChat({ quickChatId, content }).unwrap();
            await refetchQuickChats();
        } catch (error) {
            console.error('Failed to update quick chat:', error);
        }
    };

    // Handle delete quick chat
    const handleDeleteQuickChat = async (quickChatId) => {
        try {
            await deleteQuickChat(quickChatId).unwrap();
            await refetchQuickChats();
        } catch (error) {
            console.error('Failed to delete quick chat:', error);
        }
    };

    const handleTaskDoneFlow = () => {
        setStage('waiting');
        setTimeout(() => setStage('feedback'), 2500);
    };

    return (
        <div className="w-full bg-white rounded-[24px] p-[32px]">
            {/* Header card */}
            <OrderHeader order={localOrderData} onTaskDone={handleTaskDoneFlow} isConnected={isConnected} />

            {/* Conversation */}
            <div ref={scrollContainerRef} className="mt-8 space-y-6 max-h-[400px] overflow-y-auto">
                {messages.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                        No messages yet. Start the conversation with a quick chat!
                    </div>
                ) : (
                    messages.map((msg, index) => {
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

                        // Debug log for EVERY message to see profile images
                        console.log(`📸 Message ${index} (${msg.content?.substring(0, 20)}...):`, {
                            messageId: msg._id,
                            senderRole: msg.senderRole,
                            currentUserRole,
                            isCurrentUser,
                            senderName,
                            profileImage,
                            rawSenderInfo: msg.senderInfo,
                            currentUserProfileImage: currentUser?.profileImage,
                            '🔍 CHECK THIS': msg.senderRole === currentUserRole ? '✅ MY MESSAGE (RIGHT SIDE)' : '❌ OTHER USER MESSAGE (LEFT SIDE)'
                        });

                        return (
                            <ChatBubble
                                key={msg._id || index}
                                side={isCurrentUser ? 'right' : 'left'}
                                name={senderName}
                                timeAgo={formatTimestamp(msg.timestamp)}
                                text={msg.content}
                                senderInfo={senderInfo}
                                profileImage={profileImage}
                            />
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Center status area (conditional) */}
            <div className="w-full mt-6">
                {stage === 'waiting' && (
                    <div className="flex flex-col gap-[18px] w-full items-center">
                        <h3 className="text-[#7A7A7A] text-2xl">Please wait for acceptance from {orderData.client?.name || 'client'}.</h3>
                        <hr className="w-full" />
                        <p className="text-black font-bold text-xl">Waiting for accepted</p>
                    </div>
                )}

                {stage === 'feedback' && (
                    <div className="flex flex-col w-full items-center">
                        <div className="w-full py-[70px]">
                            <p className="text-xl font-semibold text-[#111] mb-3">Received feedback from the client.</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Quick Chats + Composer (only when not waiting/feedback) */}
            {stage !== 'waiting' && stage !== 'feedback' && (
                <>
                    {/* Quick Chats list */}
                    <div className="mt-8 rounded-2xl bg-white shadow-sm ring-1 ring-black/5 p-4 overflow-y-auto">
                        {quickChatsLoading || quickChatsFetching ? (
                            <div className="text-center text-gray-500 py-4">Loading quick chats...</div>
                        ) : (
                            <div className="space-y-3 max-h-[310px] overflow-y-auto">
                                {quickChats.map((qc) => (
                                    <QuickChatItem
                                        key={qc._id}
                                        quickChat={qc}
                                        onSend={handleQuickChatSend}
                                        onUpdate={handleUpdateQuickChat}
                                        onDelete={handleDeleteQuickChat}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Composer */}
                    <div className="mt-4 flex w-full justify-end gap-3">
                        <button
                            onClick={() => setClick(true)}
                            type="button"
                            className="rounded-[24px] cursor-pointer border border-[#0E7A60] px-5 py-2 text-[14px] font-bold text-[#0E7A60] hover:bg-[#0E7A60]/5 transition"
                        >
                            Add Quick Chats
                        </button>
                    </div>
                </>
            )}

            <AddQuickChatModal
                open={click}
                onClose={() => setClick(false)}
                onSubmit={handleAddQuickChat}
            />
        </div>
    );
}
