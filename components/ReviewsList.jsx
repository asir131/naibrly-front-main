import React from "react";

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

function ReviewItem({ review }) {
    const rounded = Math.round(review.rating || 0);
    return (
        <div className="w-full">
            <div className="client_feedback_card">
                {/* left: avatar + content */}
                <div className="flex items-start gap-3">
                    <img
                        src={review.avatar}
                        alt={review.name}
                        className="h-[80px] w-[80px] rounded-full object-cover"
                    />
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <span className="text-[16px] font-semibold text-[#1D1D1F]">
                                {review.name}
                            </span>
                            <span className="text-[13px] text-[#7F7F7F]">({review.rating.toFixed(1)})</span>
                        </div>
                        <div className="mt-1 flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} filled={i < rounded} />
                            ))}
                        </div>
                        <p className="mt-2 text-[14px] leading-6 text-[#7F7F7F]">
                            {review.comment}
                            {" "}
                            <button
                                type="button"
                                className="text-[#000] font-medium hover:underline"
                                onClick={review.onSeeMore}
                            >
                                See more...
                            </button>
                        </p>
                    </div>
                </div>

                {/* right: time ago */}
                <div className="whitespace-nowrap text-[14px] text-[#7F7F7F]">
                    {review.timeAgo}
                </div>
            </div>
        </div>
    );
}

export default function ReviewsList({ reviews }) {
    const data =
        reviews && reviews.length
            ? reviews
            : [
                {
                    id: 1,
                    name: "Jessica R",
                    rating: 4.0,
                    comment:
                        "Thank you for your work! The service met my expectations and I am very happy.",
                    timeAgo: "2 Days ago",
                    avatar: "https://i.pravatar.cc/80?img=5",
                },
                {
                    id: 2,
                    name: "Jessica R",
                    rating: 4.0,
                    comment:
                        "Thank you for your work! The service met my expectations and I am very happy.",
                    timeAgo: "2 Days ago",
                    avatar: "https://i.pravatar.cc/80?img=12",
                },
                {
                    id: 3,
                    name: "Jessica R",
                    rating: 4.0,
                    comment:
                        "Thank you for your work! The service met my expectations and I am very happy.",
                    timeAgo: "2 Days ago",
                    avatar: "https://i.pravatar.cc/80?img=15",
                },
            ];

    return (
        <div className="">
            <div className="flex flex-col gap-4">
                {data.map((r, idx) => (
                    <div key={r.id || idx} className="">
                        <ReviewItem review={r} />
                    </div>
                ))}
            </div>

            <div className="mt-4 flex justify-center">
                <button
                    type="button"
                    className="px-5 py-2 rounded-full border border-[#0E7A60] text-[#0E7A60] bg-white hover:bg-[#0E7A60]/5 transition text-[14px] font-medium"
                >
                    View more
                </button>
            </div>
        </div>
    );
}
