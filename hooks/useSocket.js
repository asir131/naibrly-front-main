"use client";

import { useEffect, useState, useCallback, useRef } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';

export const useSocket = (token) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const socketRef = useRef(null);

  // Initialize socket connection
  useEffect(() => {
    if (!token) return;

    console.log('🔌 Initializing socket connection...');

    const newSocket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    // Connection event handlers
    newSocket.on('connect', () => {
      console.log('✅ Socket connected:', newSocket.id);
      setIsConnected(true);
    });

    newSocket.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason);
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('🔴 Connection error:', error.message);
      setIsConnected(false);
    });

    // Listen for all messages from server
    newSocket.on('message', (data) => {
      console.log('📨 Received message:', data);
      handleServerMessage(data);
    });

    // Cleanup on unmount
    return () => {
      console.log('🔌 Disconnecting socket...');
      newSocket.disconnect();
    };
  }, [token]);

  // Handle different message types from server
  const handleServerMessage = useCallback((data) => {
    const { type, data: payload } = data;

    switch (type) {
      case 'welcome':
      case 'authenticated':
        console.log('👋', payload.message);
        break;

      case 'conversation_history':
        console.log('📜 Conversation history received:', payload);
        if (payload.messages) {
          setMessages(payload.messages);
        }
        break;

      case 'new_message':
      case 'new_quick_message':
        console.log('💬 New message received:', payload);
        // Only add if not already in messages (prevent duplicates)
        setMessages((prev) => {
          const messageExists = prev.some(m => m._id === payload.message._id);
          if (messageExists) {
            console.log('⚠️ Duplicate message detected, skipping');
            return prev;
          }
          return [...prev, payload.message];
        });
        break;

      case 'joined_conversation':
        console.log('✅ Joined conversation:', payload.conversationId);
        break;

      case 'message_sent':
      case 'quick_chat_sent':
        console.log('✅ Message sent successfully');
        break;

      case 'customer_conversations':
      case 'conversations_list':
        console.log('📋 Conversations list received:', payload);
        setConversations(payload.conversations || []);
        break;

      case 'conversation_updated':
        console.log('🔔 Conversation updated:', payload);
        break;

      case 'money_request_created':
        // Add a synthetic message to trigger money-request UI refresh
        setMessages((prev) => [
          ...prev,
          {
            _id: payload.moneyRequestId || Date.now().toString(),
            senderId: payload.providerId || 'system',
            senderRole: 'provider',
            content: '__MONEY_REQUEST__',
            timestamp: new Date().toISOString(),
            meta: {
              moneyRequestId: payload.moneyRequestId,
              amount: payload.amount,
              serviceRequestId: payload.serviceRequestId,
              bundleId: payload.bundleId,
              status: payload.status,
            },
          },
        ]);
        // Fire a DOM event so screens can refetch immediately
        if (typeof window !== 'undefined') {
          window.dispatchEvent(
            new CustomEvent('money-request-created', { detail: payload })
          );
        }
        break;

      case 'error':
        console.error('❌ Socket error:', payload.message);
        break;

      default:
        console.log('❓ Unknown message type:', type, payload);
    }
  }, []);

  // Join a conversation
  const joinConversation = useCallback(({ requestId, bundleId, customerId }) => {
    if (!socket || !isConnected) {
      console.warn('⚠️ Socket not connected');
      return;
    }

    console.log('👥 Joining conversation:', { requestId, bundleId, customerId });
    socket.emit('message', {
      type: 'join_conversation',
      data: { requestId, bundleId, customerId },
    });
  }, [socket, isConnected]);

  // Send a regular text message
  const sendMessage = useCallback(({ requestId, bundleId, customerId, content }) => {
    if (!socket || !isConnected) {
      console.warn('⚠️ Socket not connected');
      return;
    }

    console.log('💬 Sending message:', content);
    socket.emit('message', {
      type: 'send_message',
      data: { requestId, bundleId, customerId, content },
    });
  }, [socket, isConnected]);

  // Send a quick chat message
  const sendQuickChat = useCallback(({ requestId, bundleId, customerId, quickChatId }) => {
    if (!socket || !isConnected) {
      console.warn('⚠️ Socket not connected');
      return;
    }

    console.log('⚡ Sending quick chat:', quickChatId);
    socket.emit('message', {
      type: 'send_quick_chat',
      data: { requestId, bundleId, customerId, quickChatId },
    });
  }, [socket, isConnected]);

  // Get conversation history
  const getConversation = useCallback(({ requestId, bundleId, customerId }) => {
    if (!socket || !isConnected) {
      console.warn('⚠️ Socket not connected');
      return;
    }

    console.log('📜 Getting conversation history');
    socket.emit('message', {
      type: 'get_conversation',
      data: { requestId, bundleId, customerId },
    });
  }, [socket, isConnected]);

  // Get available quick chats
  const getAvailableQuickChats = useCallback(() => {
    if (!socket || !isConnected) {
      console.warn('⚠️ Socket not connected');
      return Promise.resolve([]);
    }

    return new Promise((resolve) => {
      const listener = (data) => {
        if (data.type === 'available_quick_chats') {
          socket.off('message', listener);
          resolve(data.data.quickChats || []);
        }
      };

      socket.on('message', listener);
      socket.emit('message', { type: 'get_available_quick_chats', data: {} });

      // Timeout after 5 seconds
      setTimeout(() => {
        socket.off('message', listener);
        resolve([]);
      }, 5000);
    });
  }, [socket, isConnected]);

  // Get all conversations
  const getConversations = useCallback(() => {
    if (!socket || !isConnected) {
      console.warn('⚠️ Socket not connected');
      return;
    }

    console.log('📋 Getting all conversations');
    socket.emit('message', {
      type: 'list_conversations',
      data: {},
    });
  }, [socket, isConnected]);

  // Join all conversations for realtime updates
  const joinAllConversations = useCallback(() => {
    if (!socket || !isConnected) {
      console.warn('⚠️ Socket not connected');
      return;
    }

    console.log('🔗 Joining all conversations');
    socket.emit('message', {
      type: 'join_all_conversations',
      data: {},
    });
  }, [socket, isConnected]);

  return {
    socket,
    isConnected,
    messages,
    conversations,
    setMessages,
    joinConversation,
    sendMessage,
    sendQuickChat,
    getConversation,
    getAvailableQuickChats,
    getConversations,
    joinAllConversations,
  };
};
