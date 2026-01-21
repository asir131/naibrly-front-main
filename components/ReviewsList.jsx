import React, { useEffect, useState } from "react";

const Star = ({ filled }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="16"
        height="16"
        className="shrink-0"
        fill={filled ? "#F6C94C" : "#E5E7EB"}
    >
        <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
);

const formatTimeAgo = (dateString) => {
    if (!dateString) return '';
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays <= 0) {
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        if (diffHours <= 0) {
            const diffMinutes = Math.max(1, Math.floor(diffMs / (1000 * 60)));
            return `${diffMinutes}m ago`;
        }
        return `${diffHours}h ago`;
    }
    if (diffDays < 30) return `${diffDays}d ago`;
    const diffMonths = Math.floor(diffDays / 30);
    if (diffMonths < 12) return `${diffMonths}mo ago`;
    const diffYears = Math.floor(diffMonths / 12);
    return `${diffYears}y ago`;
};

function ReviewItem({ review }) {
    const rounded = Math.round(review.rating || 0);
    const name = review.customerName || 'Anonymous';
    const serviceInfo = review.serviceName
        ? `${review.serviceName}${review.serviceDate ? ` · ${new Date(review.serviceDate).toLocaleDateString()}` : ''}`
        : null;

    return (
        <div className="w-full">
            <div className="client_feedback_card">
                {/* left: avatar + content */}
                <div className="flex items-start gap-3">
                    {review.customerAvatar ? (
                        <img
                            src={review.customerAvatar}
                            alt={name}
                            className="h-[80px] w-[80px] rounded-full object-cover"
                        />
                    ) : (
                        <div className="h-[80px] w-[80px] rounded-full bg-teal-600 flex items-center justify-center text-white text-2xl font-semibold">
                            {name.charAt(0).toUpperCase()}
                        </div>
                    )}
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <span className="text-[16px] font-semibold text-[#1D1D1F]">
                                {name}
                            </span>
                            <span className="text-[13px] text-[#7F7F7F]">({(review.rating || 0).toFixed(1)})</span>
                        </div>
                        <div className="mt-1 flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} filled={i < rounded} />
                            ))}
                        </div>
                        {serviceInfo && (
                            <p className="text-[13px] text-[#7F7F7F] mt-1">
                                {serviceInfo}
                            </p>
                        )}
                        <p className="mt-2 text-[14px] leading-6 text-[#7F7F7F]">
                            {review.comment || 'No comment provided.'}
                        </p>
                    </div>
                </div>

                {/* right: time ago */}
                <div className="whitespace-nowrap text-[14px] text-[#7F7F7F]">
                    {formatTimeAgo(review.createdAt)}
                </div>
            </div>
        </div>
    );
}

const SummaryBar = ({ label, value, total }) => {
    const percentage = total ? Math.round((value / total) * 100) : 0;
    return (
        <div className="flex items-center gap-3 text-sm text-gray-700">
            <span className="w-10 text-right">{label}★</span>
            <div className="h-2 flex-1 rounded-full bg-gray-200 overflow-hidden">
                <div
                    className="h-full bg-[#0E7A60]"
                    style={{ width: `${percentage}%` }}
                />
            </div>
            <span className="w-10 text-left text-gray-500">{value}</span>
        </div>
    );
};

export default function ReviewsList({ reviewsData, isLoading, isError, onRetry }) {
    const PAGE_SIZE = 5;
    const [page, setPage] = useState(1);

    const statistics = reviewsData?.statistics || {
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    };
    const provider = reviewsData?.provider;
    const reviews = reviewsData?.list || [];
    const totalPages = Math.max(1, Math.ceil(reviews.length / PAGE_SIZE));

    useEffect(() => {
        setPage(1);
    }, [reviewsData]);

    useEffect(() => {
        if (page > totalPages) {
            setPage(totalPages);
        }
    }, [page, totalPages]);

    if (isLoading) {
        return (
            <div className="flex flex-col gap-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="client_feedback_card animate-pulse">
                        <div className="flex items-start gap-3">
                            <div className="h-[80px] w-[80px] rounded-full bg-gray-200" />
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-32" />
                                <div className="h-4 bg-gray-200 rounded w-40" />
                                <div className="h-4 bg-gray-200 rounded w-full" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (isError) {
        return (
            <div className="w-full p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center justify-between gap-3">
                <span>Unable to load client feedback.</span>
                {onRetry && (
                    <button
                        type="button"
                        onClick={onRetry}
                        className="px-3 py-1 rounded-md bg-white border border-red-200 text-red-700 hover:bg-red-100 transition"
                    >
                        Retry
                    </button>
                )}
            </div>
        );
    }

    if (!reviews.length) {
        return (
            <div className="w-full rounded-2xl bg-white shadow-sm ring-1 ring-black/5 p-6 md:p-7 text-center text-[#666]">
                No client feedback yet.
            </div>
        );
    }

    const distribution = statistics.ratingDistribution || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    return (
        <div className="flex flex-col gap-4">
            {/* Summary header */}
            <div className="w-full rounded-2xl bg-white shadow-sm ring-1 ring-black/5 p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-100">
                        {provider?.businessLogo?.url ? (
                            <img src={provider.businessLogo.url} alt={provider.businessName} className="h-full w-full object-cover" />
                        ) : (
                            <div className="h-full w-full flex items-center justify-center text-[#0E7A60] font-semibold">
                                {(provider?.businessName || 'P').charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>
                    <div>
                        <p className="text-sm text-[#7F7F7F]">Provider Rating</p>
                        <p className="text-xl font-semibold text-[#1D1D1F]">
                            {(statistics.averageRating || provider?.rating || 0).toFixed(1)} / 5
                        </p>
                        <p className="text-sm text-[#7F7F7F]">
                            {statistics.totalReviews || provider?.totalReviews || 0} reviews
                        </p>
                    </div>
                </div>
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[5, 4, 3, 2, 1].map((star) => (
                        <SummaryBar
                            key={star}
                            label={star}
                            value={distribution[star] || 0}
                            total={statistics.totalReviews || 0}
                        />
                    ))}
                </div>
            </div>

            {/* Reviews list */}
            <div className="flex flex-col gap-4">
                {reviews
                    .slice((page - 1) * PAGE_SIZE, (page - 1) * PAGE_SIZE + PAGE_SIZE)
                    .map((review) => (
                    <div key={review.id} className="">
                        <ReviewItem review={review} />
                    </div>
                ))}
            </div>
            {reviews.length > PAGE_SIZE && (
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl bg-white shadow-sm ring-1 ring-black/5 p-4">
                    <p className="text-sm text-gray-600">
                        Showing{" "}
                        {Math.min((page - 1) * PAGE_SIZE + 1, reviews.length)}-
                        {Math.min(page * PAGE_SIZE, reviews.length)} of {reviews.length}
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                            disabled={page === 1}
                            className="px-3 py-2 rounded-md border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            Previous
                        </button>
                        <button
                            type="button"
                            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={page >= totalPages}
                            className="px-3 py-2 rounded-md border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
