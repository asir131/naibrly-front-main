'use client';

import React, { useEffect, useState } from 'react';
import {
  useGetProviderPayoutInformationQuery,
  useGetProviderBalanceQuery,
  useUpdatePayoutInformationMutation,
  useCreateWithdrawalRequestMutation,
  useGetUserProfileQuery,
} from '@/redux/api/servicesApi';

const Withdraw = () => {
  const [step, setStep] = useState('form'); // 'form' or 'success'
  const [isEditing, setIsEditing] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [createWithdrawal, { isLoading: isWithdrawing }] =
    useCreateWithdrawalRequestMutation();
  const [formData, setFormData] = useState({
    accountHolderName: '',
    bankName: '',
    accountNumber: '',
    routingNumber: '',
    amount: '',
  });

  // Fetch payout info (bank details)
  const {
    data: payoutData,
    isLoading: payoutLoading,
  } = useGetProviderPayoutInformationQuery();

  // Fetch balances
  const { data: balanceData } = useGetProviderBalanceQuery(undefined, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });
  const [updatePayout, { isLoading: isUpdating }] =
    useUpdatePayoutInformationMutation();
  const { data: profileData } = useGetUserProfileQuery();

  const profileUser = profileData?.user || profileData?.data?.user;

  // Handle both transformed and raw response shapes defensively
  const payoutInformation =
    payoutData?.payoutInformation ||
    payoutData?.data?.payoutInformation ||
    profileUser?.payoutInformation;
  const hasPayoutSetup =
    payoutData?.hasPayoutSetup ??
    payoutData?.data?.hasPayoutSetup ??
    profileUser?.hasPayoutSetup;

  // Populate form with payout info when fetched
  useEffect(() => {
    if (!payoutInformation) return;
    setFormData((prev) => ({
      ...prev,
      accountHolderName: payoutInformation.accountHolderName || '',
      bankName: payoutInformation.bankName || '',
      accountNumber: payoutInformation.accountNumber || '',
      routingNumber: payoutInformation.routingNumber || '',
    }));
  }, [payoutInformation]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdate = async () => {
    const payload = {
      accountHolderName: formData.accountHolderName,
      bankName: formData.bankName,
      accountNumber: formData.accountNumber,
      routingNumber: formData.routingNumber,
      accountType: payoutInformation?.accountType || 'checking',
    };

    const res = await updatePayout(payload).unwrap();
    const updatedInfo = res?.payoutInformation;
    if (updatedInfo) {
      setFormData((prev) => ({
        ...prev,
        accountHolderName: updatedInfo.accountHolderName || prev.accountHolderName,
        bankName: updatedInfo.bankName || prev.bankName,
        accountNumber: updatedInfo.accountNumber || prev.accountNumber,
        routingNumber: updatedInfo.routingNumber || prev.routingNumber,
      }));
    }
  };

  const handleEditToggle = async () => {
    if (!isEditing) {
      setIsEditing(true);
      return;
    }

    try {
      await handleUpdate();
      setIsEditing(false);
      alert('Bank details updated successfully');
    } catch (err) {
      console.error('Update payout information failed:', err);
      alert(err?.data?.message || err?.message || 'Failed to update payout information');
    }
  };

  const handleTransfer = async () => {
    // Validate amount
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    try {
      await createWithdrawal({ amount: Number(formData.amount) }).unwrap();
      setShowWithdrawModal(false);
      setStep('success');
    } catch (err) {
      console.error('Create withdrawal failed:', err);
      alert(err?.data?.message || err?.message || 'Failed to create withdrawal request');
    }
  };

  const handleGoHome = () => {
    setStep('form');
    setFormData(prev => ({ ...prev, amount: '' }));
  };

  if (step === 'success') {
    return (
      <div className="flex-1 p-8 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full border-4 border-teal-600 flex items-center justify-center">
            <svg className="w-10 h-10 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Your withdrawal request has been successfully sent to Admin
          </h2>

          <p className="text-gray-600 mb-8">
            You don't need to worry, your fund will be transferred within 3 business days.
          </p>

          <button
            onClick={handleGoHome}
            className="w-full py-3 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors font-medium"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Withdraw</h1>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Bank Details Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account Holder Name
            </label>
            <input
              type="text"
              name="accountHolderName"
              value={formData.accountHolderName}
              onChange={handleInputChange}
              readOnly={!isEditing}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:bg-gray-50"
              placeholder="Jacob Mehle"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bank Name
            </label>
            <input
              type="text"
              name="bankName"
              value={formData.bankName}
              onChange={handleInputChange}
              readOnly={!isEditing}
              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900 focus:ring-0 focus:border-gray-300"
              placeholder={payoutLoading ? "Loading..." : "Bank name"}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
             Your Bank Account Number
            </label>
            <input
              type="text"
              name="accountNumber"
              value={formData.accountNumber}
              onChange={handleInputChange}
              readOnly={!isEditing}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:bg-gray-50"
              placeholder="0123456789"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Routing Number
            </label>
            <input
              type="text"
              name="routingNumber"
              value={formData.routingNumber}
              onChange={handleInputChange}
              readOnly={!isEditing}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:bg-gray-50"
              placeholder="0123456789"
            />
          </div>

          <div className="bg-teal-50 border border-teal-200 rounded-md p-4 flex items-start gap-3">
            <svg className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="text-sm font-medium text-teal-900">Your information is secure</p>
              <p className="text-xs text-teal-700">We use bank-level encryption and Stripe to protect your payment information</p>
            </div>
          </div>

          <button
            onClick={handleEditToggle}
            disabled={isUpdating}
            className="px-6 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isEditing ? (isUpdating ? 'Updating...' : 'Update Information') : 'Edit'}
          </button>
        </div>

        <div className="pt-4">
          <button
            onClick={() => setShowWithdrawModal(true)}
            className="px-6 py-3 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors font-medium"
          >
            Withdraw
          </button>
        </div>
      </div>

      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-8 relative">
            <button
              onClick={() => setShowWithdrawModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              aria-label="Close"
            >
              ✕
            </button>

            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-teal-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>

            <h3 className="text-xl font-bold text-center text-gray-900 mb-2">
              Request fund transfer to
            </h3>
            <p className="text-center text-gray-600 text-sm mb-1">
              Acc: {payoutInformation?.accountNumber || 'N/A'}
            </p>
            <p className="text-center text-gray-600 text-sm mb-6">
              Available balance: ${Number(balanceData?.availableBalance || 0).toFixed(2)}
            </p>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount*
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="$ 500"
              />
            </div>

            <button
              onClick={handleTransfer}
              disabled={isWithdrawing}
              className="w-full py-3 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors font-medium disabled:opacity-60 disabled:cursor-not-allowed"
            >
            {isWithdrawing ? 'Processing...' : 'Transfer'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Withdraw;
