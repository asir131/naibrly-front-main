'use client';

import { useEffect, useState } from 'react';
import { useAuth as useReduxAuth } from '@/hooks/useAuth';

const normalizeUserRole = (userType, user) => {
  const raw = userType || user?.role || user?.userType || '';
  return typeof raw === 'string' ? raw.toLowerCase() : '';
};

const readCustomerZipFromStorage = () => {
  if (typeof window === 'undefined') return '';
  try {
    const storedUser = localStorage.getItem('user');
    const storedUserType = localStorage.getItem('userType');
    if (!storedUser) return '';
    const user = JSON.parse(storedUser);
    const role = normalizeUserRole(storedUserType, user);
    if (role !== 'user' && role !== 'customer') return '';
    return user?.address?.zipCode || user?.zipCode || '';
  } catch (error) {
    console.error('Error reading customer zip code:', error);
    return '';
  }
};

export const useCustomerZipCode = () => {
  const { user, userType, isAuthenticated } = useReduxAuth();
  const [zipCode, setZipCode] = useState('');

  useEffect(() => {
    const role = normalizeUserRole(userType, user);
    const isCustomer = isAuthenticated && (role === 'user' || role === 'customer');
    const zip =
      (isCustomer && (user?.address?.zipCode || user?.zipCode)) ||
      readCustomerZipFromStorage();

    if (zip && zip !== zipCode) {
      setZipCode(zip);
    }
  }, [user, userType, isAuthenticated, zipCode]);

  return zipCode;
};

export default useCustomerZipCode;
