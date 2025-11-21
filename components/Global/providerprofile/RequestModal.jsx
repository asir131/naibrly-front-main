'use client';

import React, { useState } from 'react';
import { X, Check, Calendar, Loader2 } from 'lucide-react';
import { useCreateServiceRequestMutation } from '@/redux/api/servicesApi';
import { useRouter } from 'next/navigation';

const RequestModal = ({
    isOpen,
    onClose,
    providerName = "Jacob Maicle",
    serviceName = "Appliance Repairs",
    providerId,
    serviceId,
    hourlyRate
}) => {
    const router = useRouter();
    const [modalState, setModalState] = useState('form'); // 'form', 'success', 'error'
    const [errorMessage, setErrorMessage] = useState('');
    const [formData, setFormData] = useState({
        problem: '',
        note: '',
        date: ''
    });

    // RTK Query mutation hook
    const [createServiceRequest, { isLoading }] = useCreateServiceRequestMutation();

    // Generate available dates dynamically
    const generateAvailableDates = () => {
        const dates = [];
        const today = new Date();

        for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);

            const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

            let label;
            if (i === 0) {
                label = 'Today';
            } else if (i === 1) {
                label = 'Tomorrow';
            } else {
                label = `${dayNames[date.getDay()]} ${date.getDate()} ${monthNames[date.getMonth()]}`;
            }

            dates.push({
                label,
                value: date.toISOString().split('T')[0]
            });
        }

        return dates;
    };

    const availableDates = generateAvailableDates();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!providerId || !serviceId) {
            setErrorMessage('Missing provider or service information');
            setModalState('error');
            return;
        }

        try {
            const requestBody = {
                providerId,
                serviceId,
                serviceType: serviceName,
                problem: formData.problem,
                note: formData.note,
                scheduledDate: formData.date
            };

            console.log('Submitting service request:', requestBody);
            const result = await createServiceRequest(requestBody).unwrap();

            if (result) {
                setModalState('success');
            }
        } catch (error) {
            console.error('Service request error:', error);
            console.error('Error details:', JSON.stringify(error?.data, null, 2));
            setErrorMessage(error?.data?.message || error?.message || 'Failed to submit request');
            setModalState('error');
        }
    };

    const handleClose = () => {
        setModalState('form');
        setErrorMessage('');
        setFormData({ problem: '', note: '', date: '' });
        onClose();
    };

    const handleGoHome = () => {
        handleClose();
        router.push('/home');
    };

    const handleChooseAnother = () => {
        handleClose();
        router.back();
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
                                    minLength={10}
                                    value={formData.problem}
                                    onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
                                    placeholder="Describe your problem (min 10 characters)"
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
                                disabled={isLoading}
                                className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold py-4 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    'Send Request'
                                )}
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
                            {errorMessage || `It looks like ${providerName} is no longer available at this time.`}
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
