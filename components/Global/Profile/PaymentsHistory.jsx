import React from 'react';
import {
  useGetProviderFinanceHistoryQuery,
  useGetCustomerPaymentHistoryQuery,
} from '@/redux/api/servicesApi';
import { useAuth } from '@/hooks/useAuth';

const PaymentsHistory = () => {
  const { user, userType } = useAuth();
  const role = (userType || user?.role || '').toLowerCase();
  const isCustomer = role === 'customer';

  const {
    data: providerData,
    isLoading: isLoadingProvider,
    isError: isErrorProvider,
    error: errorProvider,
  } = useGetProviderFinanceHistoryQuery(undefined, { skip: isCustomer });

  const {
    data: customerData,
    isLoading: isLoadingCustomer,
    isError: isErrorCustomer,
    error: errorCustomer,
  } = useGetCustomerPaymentHistoryQuery(undefined, { skip: !isCustomer });

  const history = isCustomer
    ? customerData?.payments || customerData?.data?.payments || []
    : providerData?.history || providerData?.data?.history || [];

  const isLoading = isCustomer ? isLoadingCustomer : isLoadingProvider;
  const isError = isCustomer ? isErrorCustomer : isErrorProvider;
  const error = isCustomer ? errorCustomer : errorProvider;

  const formatAmount = (item) => {
    if (item.type === 'withdrawal') return `-$${Number(item.amount || 0).toFixed(2)}`;
    // Customer view shows main amount; provider view shows provider amount
    if (isCustomer) {
      const main = item.amount ?? item.totalAmount ?? 0;
      return `-$${Number(main).toFixed(2)}`;
    }
    const providerAmount = item.commission?.providerAmount ?? item.amount ?? item.totalAmount ?? 0;
    return `+$${Number(providerAmount).toFixed(2)}`;
  };

  const formatTitle = (item) => {
    if (item.type === 'withdrawal') return 'Withdrawal';
    if (item.serviceRequest) return `Service: ${item.serviceRequest.serviceType || 'Payment'}`;
    if (item.bundle) return `Bundle: ${item.bundle.title || 'Payment'}`;
    return 'Payment';
  };

  const formatDescription = (item) => {
    if (item.type === 'withdrawal') return `Status: ${item.status || 'pending'}`;
    if (isCustomer) {
      const provider = item.provider?.businessNameRegistered || item.provider?.email || 'Provider';
      return `${provider} • Status: ${item.status || 'pending'}`;
    }
    const customer =
      item.customer?.firstName || item.customer?.lastName
        ? `${item.customer?.firstName || ''} ${item.customer?.lastName || ''}`.trim()
        : item.customer?.email || 'Customer';
    return `${customer} • Status: ${item.status || 'pending'}`;
  };

  const formatDate = (item) => {
    const ts = item.updatedAt || item.createdAt;
    if (!ts) return '';
    const d = new Date(ts);
    return d.toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="flex-1 p-8">
      <div className="mb-8 pb-4 border-b border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900">Payments & Withdrawals</h1>
      </div>

      {isLoading && <div className="text-gray-600">Loading history...</div>}
      {isError && (
        <div className="text-red-600 text-sm">
          Failed to load history: {error?.data?.message || error?.error || 'Unknown error'}
        </div>
      )}

      <div className="space-y-4">
        {history.map((item) => (
          <div
            key={item._id}
            className="flex items-center pr-4 pl-4 gap-4 py-4 border rounded-2xl border-gray-200"
          >
            <div className="flex-shrink-0 flex items-center justify-center w-16 h-16 bg-gray-100 rounded-lg">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-blue-500 rounded-lg flex items-center justify-center text-white text-xl">
                $
              </div>
            </div>

            <div className="flex-1">
              <div className="font-medium text-gray-900">{formatTitle(item)}</div>
              <div className="text-sm text-gray-500">{formatDescription(item)}</div>
            </div>

            <div className="text-right">
              <div className="font-medium text-gray-900">{formatAmount(item)}</div>
              <div className="text-sm text-gray-500">{formatDate(item)}</div>
            </div>
          </div>
        ))}

        {!isLoading && history.length === 0 && (
          <div className="text-gray-500 text-sm">No transactions found.</div>
        )}
      </div>
    </div>
  );
};

export default PaymentsHistory;
