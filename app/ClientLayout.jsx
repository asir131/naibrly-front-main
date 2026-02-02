'use client';

import NavbarWrapper from "@/components/NavbarWrapper";
import Footer from "@/components/Global/Global/Footer";
import { ReduxProvider } from "@/redux/ReduxProvider";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from 'react-hot-toast';
import { useFcmNotifications } from "@/hooks/useFcmNotifications";

export default function ClientLayout({ children }) {
  useFcmNotifications();
  return (
    <AuthProvider>
      <ReduxProvider>
        <Toaster
          position="top-right"
          reverseOrder={false}
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10B981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#EF4444',
                secondary: '#fff',
              },
            },
          }}
        />
        <NavbarWrapper />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </ReduxProvider>
    </AuthProvider>
  );
}
