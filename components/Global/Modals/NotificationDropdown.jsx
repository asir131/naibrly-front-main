'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function NotificationDropdown({ isOpen, onClose, onNotificationClick }) {
  if (!isOpen) return null;

  // Sample notification data
  const notifications = [
    {
      id: 1,
      title: 'New Request from 19706',
      message: 'Lorem ipsum dolor sit amet consectetur. Dui at netus aliquam felis. Et maecenas nunc pulvinar proin ut. Sed sit quis diam euismod sed commodo at bibendum laoreet.',
      time: '11:30 AM',
      isRead: false,
      isExpanded: false
    },
    {
      id: 2,
      title: 'New Request from 19706',
      time: '11:30 AM',
      isRead: false,
      isExpanded: false
    },
    {
      id: 3,
      title: 'New Request from 19706',
      time: '11:30 AM',
      isRead: false,
      isExpanded: false
    },
    {
      id: 4,
      title: 'New Request from 19706',
      time: 'Yesterday',
      isRead: true,
      isExpanded: false
    },
    {
      id: 5,
      title: 'New Request from 19706',
      time: '15 Jan,2016',
      isRead: true,
      isExpanded: false
    },
    {
      id: 6,
      title: 'New Request from 19706',
      time: '11:30 AM',
      isRead: true,
      isExpanded: false
    }
  ];

  const [notificationsList, setNotificationsList] = useState(notifications);

  const handleNotificationClick = (notificationId) => {
    // Mark as read
    setNotificationsList(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, isRead: true } : notif
      )
    );

    // Call parent handler to open the request modal
    if (onNotificationClick) {
      onNotificationClick(notificationId);
    }
  };

  const handleMouseEnter = (notificationId) => {
    setNotificationsList(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, isExpanded: true } : notif
      )
    );
  };

  const handleMouseLeave = (notificationId) => {
    setNotificationsList(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, isExpanded: false } : notif
      )
    );
  };

  return (
    <div className="absolute right-0 top-full mt-2 w-[90vw] sm:w-96 md:w-[420px] bg-white rounded-3xl shadow-xl z-[110] max-h-[80vh] overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto">
        {notificationsList.map((notification) => (
          <div
            key={notification.id}
            onClick={() => handleNotificationClick(notification.id)}
            onMouseEnter={() => handleMouseEnter(notification.id)}
            onMouseLeave={() => handleMouseLeave(notification.id)}
            className={`p-4 border-b border-gray-100 cursor-pointer transition-all duration-200 ${
              notification.isExpanded ? 'bg-gray-100' : 'bg-white hover:bg-gray-50'
            }`}
          >
            <div className="flex items-start gap-3">
              {/* Status Dot */}
              <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${
                notification.isRead ? 'bg-gray-300' : 'bg-teal-600'
              }`} />

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 text-sm sm:text-base mb-1">
                  {notification.title}
                </h4>

                {notification.message && notification.isExpanded && (
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-2 animate-in fade-in slide-in-from-top-1 duration-200">
                    {notification.message}
                  </p>
                )}

                <p className={`text-xs sm:text-sm ${
                  notification.isRead ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {notification.time}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
