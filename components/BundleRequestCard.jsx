import Link from "next/link";

function BundleRequestCard({ handleCencelOrderConfirm, handleCencelOrderConfirmClose, handleCencelOrderConfirmSubmit, open }) {
    return (
        <div className="relative w-full rounded-2xl bg-white shadow-sm ring-1 ring-black/5 p-5 md:p-6">
            {/* top row: left info + right avatars */}
            <div className="flex items-start justify-between gap-[10px]">
                {/* left content */}
                <div className="flex-1">
                    <h3 className="text-[18px] font-semibold text-[#000]">
                        Window Washing Bundle
                    </h3>

                    <div className="mt-2">
                        <p className="text-[16px] font-medium text-[#333]">3-Person Bundle</p>
                        <p className="mt-1 text-[14px] text-[#666]">
                            Service Date: Jun 10, 2025
                        </p>

                        {/* address */}
                        <div className="flex items-center gap-2 text-[14px] text-[#666]">
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                className="shrink-0"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M12 22s7-5.2 7-11a7 7 0 1 0-14 0c0 5.8 7 11 7 11Z"
                                    stroke="#7F7F7F"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <circle cx="12" cy="11" r="2.5" stroke="#7F7F7F" strokeWidth="1.5" />
                            </svg>
                            <span>Street Springfield, IL 62704</span>
                        </div>
                    </div>
                </div>

                {/* avatar group */}
                <div className="flex -space-x-2">
                    <img
                        src="https://i.pravatar.cc/40?img=11"
                        alt="member"
                        className="h-[50px] w-[50px] rounded-full object-cover ring-2 ring-[#0E7A60]"
                    />
                    <img
                        src="https://i.pravatar.cc/40?img=22"
                        alt="member"
                        className="h-[50px] w-[50px] rounded-full object-cover ring-2 ring-[#0E7A60]"
                    />
                    <img
                        src="https://i.pravatar.cc/40?img=33"
                        alt="member"
                        className="h-[50px] w-[50px] rounded-full object-cover ring-2 ring-[#0E7A60]"
                    />
                </div>
            </div>

            {/* bottom row: date/time/rate + actions */}
            <div className="flex items-end justify-between">
                <div className="text-[15px] mt-[15px] leading-6">
                    <div>
                        <span className="font-semibold text-[#1D1D1F]">Date: </span>
                        <span className="text-[#1D1D1F]">18 Sep 2025</span>
                        <span className="ml-4 font-semibold text-[#0E7A60]">$55/hr</span>
                    </div>
                    <div>
                        <span className="font-semibold text-[#1D1D1F]">Time: </span>
                        <span className="text-[#1D1D1F]">14:00</span>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button onClick={handleCencelOrderConfirm} type="button" className="decline_btn px-4 py-2">
                        Decline
                    </button>
                    <Link href={`/provider/signup/order`}>
                        <button type="button" className="accept_btn px-4 py-2">
                            Accept
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default BundleRequestCard;