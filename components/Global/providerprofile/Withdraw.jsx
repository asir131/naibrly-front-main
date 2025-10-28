'use client';

import React, { useState } from 'react';

const Withdraw = () => {
  const [step, setStep] = useState('form'); // 'form' or 'success'
  const [formData, setFormData] = useState({
    accountHolderName: 'Jacob Mehle',
    bankName: '',
    accountNumber: '0123456789',
    routingNumber: '0123456789',
    amount: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdate = () => {
    // Here you would typically make an API call to update bank details
    console.log('Updating bank details:', formData);
    // For now, just show a success message
    alert('Bank details updated successfully');
  };

  const handleTransfer = () => {
    // Validate amount
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    // Here you would typically make an API call to process the withdrawal
    console.log('Processing withdrawal:', formData.amount);
    setStep('success');
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
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="Jacob Mehle"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bank Name
            </label>
            <select
              name="bankName"
              value={formData.bankName}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-500"
            >
              <option value="">Choose your bank</option>
              <option value="Chase">Chase Bank</option>
              <option value="BankOfAmerica">Bank of America</option>
              <option value="Wells Fargo">Wells Fargo</option>
              <option value="Citi">Citibank</option>
              <option value="US Bank">US Bank</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter Your Bank Account Number
            </label>
            <input
              type="text"
              name="accountNumber"
              value={formData.accountNumber}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
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
            onClick={handleUpdate}
            className="px-6 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
          >
            Update
          </button>
        </div>

        {/* Withdrawal Request Section */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-teal-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>

            <h3 className="text-xl font-bold text-center text-gray-900 mb-2">
              Request fund transfer to
            </h3>
            <p className="text-center text-gray-600 text-sm mb-1">Acc: **********6789</p>
            <p className="text-center text-gray-600 text-sm mb-6">Available balance: $500</p>

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
              className="w-full py-3 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors font-medium"
            >
              Transfer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Withdraw;
