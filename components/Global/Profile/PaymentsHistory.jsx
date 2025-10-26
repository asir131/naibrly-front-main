import React from 'react';

const PaymentsHistory = () => {
  const payments = [
    {
      id: 1,
      title: 'Stripe payment',
      description: 'Jacob, Window Cleaner.',
      amount: '-500.00₮',
      date: '15:42 11 Sep, 2025'
    },
    {
      id: 2,
      title: 'Stripe payment',
      description: 'Jacob, Window Cleaner.',
      amount: '-500.00₮',
      date: '15:42 11 Sep, 2025'
    },
    {
      id: 3,
      title: 'Stripe payment',
      description: 'Jacob, Window Cleaner.',
      amount: '-500.00₮',
      date: '15:42 11 Sep, 2025'
    },
    {
      id: 4,
      title: 'Stripe payment',
      description: 'Jacob, Window Cleaner.',
      amount: '-500.00₮',
      date: '15:42 11 Sep, 2025'
    },
    {
      id: 5,
      title: 'Stripe payment',
      description: 'Jacob, Window Cleaner.',
      amount: '-500.00₮',
      date: '15:42 11 Sep, 2025'
    }
  ];

  return (
    <div className="flex-1 h-screen p-8">
      <div className="mb-8 pb-4 border-b border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900">Payments History</h1>
      </div>

      <div className="space-y-4 ">
        {payments.map((payment) => (
          <div
            key={payment.id}
            className="flex items-center pr-4 pl-4 gap-4 py-4 border-1 rounded-2xl border-gray-200 last:border-b-2"
          >
            {/* Icon */}
            <div className="flex-shrink-0 flex items-center justify-center w-16 h-16 bg-gray-100 rounded-lg">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-blue-500 rounded-lg flex items-center justify-center text-white text-xl">
                🏠
              </div>
            </div>

            {/* Payment Details */}
            <div className="flex-1">
              <div className="font-medium text-gray-900">{payment.title}</div>
              <div className="text-sm text-gray-500">{payment.description}</div>
            </div>

            {/* Amount and Date */}
            <div className="text-right">
              <div className="font-medium text-gray-900">{payment.amount}</div>
              <div className="text-sm text-gray-500">{payment.date}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentsHistory;
