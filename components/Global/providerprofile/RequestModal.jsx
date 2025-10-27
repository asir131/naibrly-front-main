'use client';

import React, { useState } from 'react';
import { X, Check, Calendar } from 'lucide-react';

const RequestModal = ({ isOpen, onClose, providerName = "Jacob Maicle", serviceName = "Appliance Repairs" }) => {
    const [modalState, setModalState] = useState('form'); // 'form', 'success', 'error'
    const [formData, setFormData] = useState({
        problem: '',
        note: '',
        date: ''
    });

    // Available dates
    const availableDates = [
        { label: 'Today', value: new Date().toISOString().split('T')[0] },
        { label: 'Tomorrow', value: new Date(Date.now() + 86400000).toISOString().split('T')[0] },
        { label: 'Thu 11 Sep', value: '2025-09-11' },
        { label: 'Fri 12 Sep', value: '2025-09-12' },
        { label: 'Sat 13 Sep', value: '2025-09-13' },
        { label: 'Sun 14 Sep', value: '2025-09-14' }
    ];

    const handleSubmit = (e) => {
        e.preventDefault();

        // Simulate random success/error for demo
        const isSuccess = Math.random() > 0.3; // 70% success rate

        if (isSuccess) {
            setModalState('success');
        } else {
            setModalState('error');
        }
    };

    const handleClose = () => {
        setModalState('form');
        setFormData({ problem: '', note: '', date: '' });
        onClose();
    };

    const handleGoHome = () => {
        handleClose();
        // You can add router.push('/home') here if needed
    };

    const handleChooseAnother = () => {
        handleClose();
        // You can add logic to go back to provider selection
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 bg-opacity-50"
                onClick={handleClose}
            />

            {/* Modal Content */}
            <div className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full mx-4 overflow-hidden">
                {/* Form State */}
                {modalState === 'form' && (
                    <div className="p-8">
                        {/* Header */}
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                {serviceName}
                            </h2>
                            <p className="text-gray-500">
                                Average response time: 10 minutes (by {providerName})
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Problem Field */}
                            <div>
                                <label className="block text-gray-900 font-medium mb-2">
                                    Problem<span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.problem}
                                    onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
                                    placeholder="Describe your problem"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                />
                            </div>

                            {/* Note Field */}
                            <div>
                                <label className="block text-gray-900 font-medium mb-2">
                                    Note<span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    required
                                    value={formData.note}
                                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                                    placeholder="Add any additional notes"
                                    rows="3"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                                />
                            </div>

                            {/* Date Field */}
                            <div>
                                <label className="block text-gray-900 font-medium mb-2">
                                    date<span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <select
                                        required
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent appearance-none cursor-pointer"
                                    >
                                        <option value="">Select date</option>
                                        {availableDates.map((date) => (
                                            <option key={date.value} value={date.value}>
                                                {date.label}
                                            </option>
                                        ))}
                                    </select>
                                    <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl transition-colors duration-200"
                            >
                                Request Sent
                            </button>
                        </form>
                    </div>
                )}

                {/* Success State */}
                {modalState === 'success' && (
                    <div className="p-8 text-center">
                        {/* Success Icon */}
                        <div className="mb-6 flex justify-center">
                            <div className="w-32 h-32 rounded-full bg-teal-50 border-4 border-teal-600 flex items-center justify-center">
                                <Check className="w-16 h-16 text-teal-600 stroke-[3]" />
                            </div>
                        </div>

                        {/* Success Message */}
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Your request has been submitted
                        </h2>
                        <p className="text-gray-500 text-lg mb-8">
                            Average response time: 10 minutes (by {providerName})
                        </p>

                        {/* Go Home Button */}
                        <button
                            onClick={handleGoHome}
                            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 rounded-xl transition-colors duration-200"
                        >
                            Go Home
                        </button>
                    </div>
                )}

                {/* Error State */}
                {modalState === 'error' && (
                    <div className="p-8 text-center">
                        {/* Error Icon */}
                        <div className="mb-6 flex justify-center">
                            <div className="w-32 h-32 rounded-full bg-red-50 border-4 border-red-500 flex items-center justify-center">
                                <X className="w-16 h-16 text-red-500 stroke-[3]" />
                            </div>
                        </div>

                        {/* Error Message */}
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            We're sorry
                        </h2>
                        <p className="text-gray-600 text-lg mb-8">
                            It looks like {providerName} is no longer available at this time.
                        </p>

                        {/* Choose Another Provider Button */}
                        <button
                            onClick={handleChooseAnother}
                            className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-4 rounded-xl transition-colors duration-200"
                        >
                            Choose another provider
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RequestModal;
