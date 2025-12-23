'use client';

import React, { useEffect, useState } from 'react';
import { Menu } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import ProviderSidebar from '@/components/Global/providerprofile/ProviderSidebar';
import Account from '@/components/Global/providerprofile/Account';
import Services from '@/components/Global/providerprofile/Services';
import ZipCode from '@/components/Global/providerprofile/ZipCode';
import Withdraw from '@/components/Global/providerprofile/Withdraw';
import Notifications from '@/components/Global/Profile/Notifications';
import PaymentsHistory from '@/components/Global/Profile/PaymentsHistory';
import ContactSupport from '@/components/Global/Profile/ContactSupport';
import DeleteAccount from '@/components/Global/Profile/DeleteAccount';
import BundleSetup from '@/components/Global/providerprofile/BundleSetup';

export default function ProviderAccountSettings() {
  const [activeSection, setActiveSection] = useState('Account');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    const section = searchParams.get('section');
    if (section) {
      setActiveSection(section);
    }
  }, [searchParams]);

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
      case 'Bundle setup':
        return <BundleSetup />;
      case 'Contact Support':
        return <ContactSupport />;
      case 'Delete Account':
        return <DeleteAccount />;
      default:
        return <Account />;
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-100 to-gray-200 p-2 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl h-screen mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Mobile Header with Menu Button */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-200 bg-white sticky top-0 z-40">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
          <h2 className="text-lg font-semibold text-gray-900">{activeSection}</h2>
          <div className="w-10"></div> {/* Spacer for centering */}
        </div>

        <div className="flex h-full">
          <ProviderSidebar
            activeItem={activeSection}
            onItemClick={setActiveSection}
            isMobileMenuOpen={isMobileMenuOpen}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
          />
          <div className="flex-1 overflow-y-auto">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
