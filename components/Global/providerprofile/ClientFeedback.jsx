'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ClientFeedback = ({ feedback, isLoading }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Use API feedback data or empty array
    const feedbackList = feedback?.list || [];
    const aggregates = feedback?.aggregates || { averageRating: 0, totalReviews: 0 };
    const pagination = feedback?.pagination || { current: 1, total: 0, pages: 0 };

    const totalPages = Math.ceil(feedbackList.length / rowsPerPage) || 1;
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const currentFeedback = feedbackList.slice(startIndex, endIndex);

    const renderStars = (rating) => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        const emptyStars = 5 - Math.ceil(rating);

        return (
            <div className="flex items-center gap-1">
                {[...Array(fullStars)].map((_, i) => (
                    <svg key={`full-${i}`} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="#FFB800">
                        <path d="M10 1.66669L12.575 6.88335L18.3333 7.72502L14.1667 11.7834L15.15 17.5167L10 14.8084L4.85 17.5167L5.83333 11.7834L1.66667 7.72502L7.425 6.88335L10 1.66669Z" />
                    </svg>
                ))}
                {hasHalfStar && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M10 1.66669L12.575 6.88335L18.3333 7.72502L14.1667 11.7834L15.15 17.5167L10 14.8084L4.85 17.5167L5.83333 11.7834L1.66667 7.72502L7.425 6.88335L10 1.66669Z" fill="#FFB800" fillOpacity="0.5" stroke="#FFB800" strokeWidth={1}/>
                    </svg>
                )}
                {[...Array(emptyStars)].map((_, i) => (
                    <svg key={`empty-${i}`} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M10 1.66669L12.575 6.88335L18.3333 7.72502L14.1667 11.7834L15.15 17.5167L10 14.8084L4.85 17.5167L5.83333 11.7834L1.66667 7.72502L7.425 6.88335L10 1.66669Z" stroke="#D1D5DB" strokeWidth={1}/>
                    </svg>
                ))}
            </div>
        );
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="w-full bg-linear-to-br from-gray-50 to-blue-50 py-16 px-8 lg:px-16">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                        <div className="h-10 bg-gray-200 rounded w-48 animate-pulse"></div>
                    </div>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white rounded-2xl p-6 shadow-md animate-pulse">
                                <div className="flex items-start gap-4">
                                    <div className="w-16 h-16 bg-gray-200 rounded-full shrink-0"></div>
                                    <div className="flex-1 space-y-3">
                                        <div className="h-5 bg-gray-200 rounded w-1/4"></div>
                                        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // No feedback available
    if (feedbackList.length === 0) {
        return (
            <div className="w-full bg-linear-to-br from-gray-50 to-blue-50 py-16 px-8 lg:px-16">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                            Client Feedback
                        </h2>
                        <p className="text-gray-600 mt-2">
                            Average Rating: {aggregates.averageRating.toFixed(1)} ({aggregates.totalReviews} reviews)
                        </p>
                    </div>
                    <div className="bg-white rounded-2xl p-8 shadow-md text-center">
                        <p className="text-gray-500">No reviews yet for this provider.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full bg-linear-to-br from-gray-50 to-blue-50 py-16 px-8 lg:px-16">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                        Client Feedback
                    </h2>
                    <p className="text-gray-600 mt-2">
                        Average Rating: {aggregates.averageRating.toFixed(1)} ({aggregates.totalReviews} reviews)
                    </p>
                </div>

                {/* Feedback Cards */}
                <div className="space-y-4 mb-8">
                    {currentFeedback.map((item, index) => (
                        <div
                            key={item._id || index}
                            className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
                        >
                            <div className="flex items-start gap-4">
                                {/* Avatar */}
                                <div className="relative w-16 h-16 rounded-full overflow-hidden shrink-0 bg-teal-100 flex items-center justify-center">
                                    {item.customerAvatar ? (
                                        <Image
                                            src={item.customerAvatar}
                                            alt={item.customerName || 'Customer'}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <span className="text-teal-600 font-semibold text-xl">
                                            {(item.customerName || 'C').charAt(0).toUpperCase()}
                                        </span>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex-1">
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                {item.customerName || 'Anonymous'}
                                            </h3>
                                            <div className="flex items-center gap-3 mt-1">
                                                {renderStars(item.rating || 0)}
                                                <span className="text-sm text-gray-500">
                                                    ({(item.rating || 0).toFixed(1)})
                                                </span>
                                            </div>
                                        </div>
                                        <span className="text-sm text-gray-500">
                                            {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ''}
                                        </span>
                                    </div>

                                    <p className="text-gray-700 leading-relaxed">
                                        {item.comment || item.review || 'No comment provided'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600">Rows Per Page</span>
                        <select
                            value={rowsPerPage}
                            onChange={(e) => {
                                setRowsPerPage(Number(e.target.value));
                                setCurrentPage(1);
                            }}
                            className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600">
                            Page {currentPage} of {totalPages}
                        </span>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronLeft className="w-5 h-5 text-gray-700" />
                            </button>
                            <button
                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronRight className="w-5 h-5 text-gray-700" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClientFeedback;
