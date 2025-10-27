'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ClientFeedback = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Sample feedback data
    const feedbackData = [
        {
            id: 1,
            name: 'Jessica R',
            rating: 4.0,
            date: '2 Days ago',
            comment: 'Thank you for your work! The service met my expectations and I\'m very happy.',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop'
        },
        {
            id: 2,
            name: 'Jessica R',
            rating: 4.0,
            date: '2 Days ago',
            comment: 'Thank you for your work! The service met my expectations and I\'m very happy.',
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop'
        },
        {
            id: 3,
            name: 'Jessica R',
            rating: 4.0,
            date: '2 Days ago',
            comment: 'Thank you for your work! The service met my expectations and I\'m very happy.',
            avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop'
        },
        {
            id: 4,
            name: 'Michael B',
            rating: 5.0,
            date: '3 Days ago',
            comment: 'Excellent service! Highly professional and completed the job perfectly.',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop'
        },
        {
            id: 5,
            name: 'Sarah K',
            rating: 4.5,
            date: '5 Days ago',
            comment: 'Great work, very satisfied with the results. Will definitely hire again.',
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop'
        },
        {
            id: 6,
            name: 'David L',
            rating: 4.0,
            date: '1 Week ago',
            comment: 'Good service, arrived on time and did a thorough job.',
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop'
        },
        {
            id: 7,
            name: 'Emily T',
            rating: 5.0,
            date: '1 Week ago',
            comment: 'Outstanding! Exceeded all my expectations. Very professional.',
            avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop'
        }
    ];

    const totalPages = Math.ceil(feedbackData.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const currentFeedback = feedbackData.slice(startIndex, endIndex);

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

    return (
        <div className="w-full bg-gradient-to-br from-gray-50 to-blue-50 py-16 px-8 lg:px-16">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                        Client Feedback
                    </h2>
                </div>

                {/* Feedback Cards */}
                <div className="space-y-4 mb-8">
                    {currentFeedback.map((feedback) => (
                        <div
                            key={feedback.id}
                            className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
                        >
                            <div className="flex items-start gap-4">
                                {/* Avatar */}
                                <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                                    <Image
                                        src={feedback.avatar}
                                        alt={feedback.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>

                                {/* Content */}
                                <div className="flex-1">
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                {feedback.name}
                                            </h3>
                                            <div className="flex items-center gap-3 mt-1">
                                                {renderStars(feedback.rating)}
                                                <span className="text-sm text-gray-500">
                                                    ({feedback.rating.toFixed(1)})
                                                </span>
                                            </div>
                                        </div>
                                        <span className="text-sm text-gray-500">
                                            {feedback.date}
                                        </span>
                                    </div>

                                    <p className="text-gray-700 leading-relaxed">
                                        {feedback.comment}{' '}
                                        <button className="text-teal-600 hover:text-teal-700 font-medium">
                                            See more...
                                        </button>
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
