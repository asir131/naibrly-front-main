import React from 'react';

const Sidebar = ({
  activeItem = 'Account',
  onItemClick,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  showChangePassword = false,
}) => {
  const menuItems = [
    'Account',
    'Notifications',
    'Payments History',
    'Contact Support',
    ...(showChangePassword ? ['Change Password'] : []),
    'Delete Account',
  ];

  const handleItemClick = (item) => {
    onItemClick?.(item);
    if (setIsMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-64 lg:w-80 h-screen bg-gray-50 p-4 lg:p-6 border-r border-gray-200 overflow-y-auto">
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <div
              key={item}
              onClick={() => handleItemClick(item)}
              className={`px-3 lg:px-4 py-2.5 lg:py-3 cursor-pointer transition-colors text-sm lg:text-base ${
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

      {/* Mobile Sidebar */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setIsMobileMenuOpen(false)}>
          <div
            className="absolute left-0 top-0 bottom-0 w-64 bg-gray-50 p-4 shadow-xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <nav className="space-y-2">
              {menuItems.map((item) => (
                <div
                  key={item}
                  onClick={() => handleItemClick(item)}
                  className={`px-3 py-2.5 cursor-pointer transition-colors text-sm ${
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
        </div>
      )}
    </>
  );
};

export default Sidebar;
