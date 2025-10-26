import React from 'react';

const Sidebar = ({ activeItem = 'Account', onItemClick }) => {
  const menuItems = [
    'Account',
    'Notifications',
    'Payments History',
    'Contact Support',
    'Delete Account'
  ];

  return (
    <div className="w-80 h-screen bg-gray-50 p-6 border-r border-gray-200">
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <div
            key={item}
            onClick={() => onItemClick?.(item)}
            className={`px-4 py-3 cursor-pointer transition-colors ${
              item === activeItem
                ? 'bg-white border-l-4 border-teal-600 text-teal-700 font-medium'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            {item}
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
