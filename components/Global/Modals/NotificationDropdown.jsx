'use client';

import React from 'react';
import { X } from 'lucide-react';

export default function NotificationDropdown({ isOpen, onClose, notifications = [], onSelect }) {
  if (!isOpen) return null;

  const normalizeBody = (body) => {
    if (!body) return body;
    const text = String(body);
    if (text.includes('__TASK_COMPLETED__SERVICE') || text.includes('__TASK_COMPLETED__')) {
      return 'Service task completed';
    }
    if (text.includes('__TASK_COMPLETED__BUNDLE')) {
      return 'Bundle task completed';
    }
    return text;
  };

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
      <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="max-h-96 overflow-y-auto divide-y divide-gray-100">
        {notifications.length === 0 ? (
          <div className="px-4 py-6 text-center text-sm text-gray-500">No notifications yet</div>
        ) : (
          notifications.map((notification) => (
            <button
              key={notification.id || notification._id || notification.createdAt}
              className={`w-full px-4 py-3 text-left transition ${
                notification.isRead ? 'bg-white' : 'bg-blue-50'
              }`}
              onClick={() => onSelect?.(notification)}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-teal-500" />
                    <span className="text-sm font-semibold text-gray-900">
                      {notification.title}
                    </span>
                  </div>
                  {notification.body && (
                    <p className="mt-1 text-sm text-gray-600 leading-5 line-clamp-2">
                      {normalizeBody(notification.body)}
                    </p>
                  )}
                </div>
                <span className="text-xs text-gray-500">
                  {notification.createdAt
                    ? new Date(notification.createdAt).toLocaleString()
                    : ''}
                </span>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
