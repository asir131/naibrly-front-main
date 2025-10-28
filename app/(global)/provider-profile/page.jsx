'use client';

import React, { useState } from 'react';
import ProviderSidebar from '@/components/Global/ProviderProfile/ProviderSidebar';
import Account from '@/components/Global/ProviderProfile/Account';
import Services from '@/components/Global/ProviderProfile/Services';
import ZipCode from '@/components/Global/ProviderProfile/ZipCode';
import Withdraw from '@/components/Global/ProviderProfile/Withdraw';
import Notifications from '@/components/Global/Profile/Notifications';
import PaymentsHistory from '@/components/Global/Profile/PaymentsHistory';
import ContactSupport from '@/components/Global/Profile/ContactSupport';
import DeleteAccount from '@/components/Global/Profile/DeleteAccount';

export default function ProviderAccountSettings() {
  const [activeSection, setActiveSection] = useState('Account');

  const renderContent = () => {
    switch (activeSection) {
      case 'Account':
        return <Account />;
      case 'Services':
        return <Services />;
      case 'Zip code':
        return <ZipCode />;
      case 'Withdraw':
        return <Withdraw />;
      case 'Notifications':
        return <Notifications />;
      case 'Payments History':
        return <PaymentsHistory />;
      case 'Contact Support':
        return <ContactSupport />;
      case 'Delete Account':
        return <DeleteAccount />;
      default:
        return <Account />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-8">
      <div className="max-w-6xl h-screen mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="flex">
          <ProviderSidebar activeItem={activeSection} onItemClick={setActiveSection} />
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
