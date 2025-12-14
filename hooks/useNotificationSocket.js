'use client';

import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { useDispatch } from 'react-redux';
import { addNotification } from '@/redux/slices/notificationsSlice';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';

export function useNotificationSocket(token) {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!token) return;

    const socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
    });

    const onMessage = (data) => {
      if (data?.type === 'notification' && data.data) {
        dispatch(addNotification(data.data));
      }
    };

    socket.on('message', onMessage);

    return () => {
      socket.off('message', onMessage);
      socket.disconnect();
    };
  }, [token, dispatch]);
}
