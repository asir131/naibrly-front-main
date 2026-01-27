import Link from "next/link";

function BundleRequestCard({ bundle, handleCencelOrderConfirm, handleAccept, isUpdating }) {
    if (!bundle) return null;

    const serviceDate = new Date(bundle.serviceDate);
    const formattedDate = serviceDate.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });

    const serviceList = bundle.services?.map((service) => service?.name).filter(Boolean) || [];
    const serviceNames = serviceList.join(', ') || 'Service';
    const serviceLabel = serviceList.length === 1 ? 'Service' : 'Services';
    const hourlyRate = bundle.services?.[0]?.hourlyRate || 0;
    const participantCount = bundle.currentParticipants || 0;
    const maxParticipants = bundle.maxParticipants || 0;

    return (
        <div className="relative w-full rounded-2xl bg-white shadow-sm ring-1 ring-black/5 p-5 md:p-6">
            {/* top row: left info + right avatars */}
            <div className="flex items-start justify-between gap-[10px]">
                {/* left content */}
                <div className="flex-1">
                    <h3 className="text-[18px] font-semibold text-[#000]">
                        {bundle.title}
                    </h3>
                    <p className="text-[14px] text-[#0E7A60] font-medium">
                        {serviceLabel}: {serviceNames}
                    </p>

                    <div className="mt-2">
                        <p className="text-[16px] font-medium text-[#333]">
                            {participantCount}-Person Bundle {maxParticipants > 0 && `(Max: ${maxParticipants})`}
                        </p>
                        <p className="mt-1 text-[14px] text-[#666]">
                            Service Date: {formattedDate}
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
                            <span>
                                {bundle.address?.street}, {bundle.address?.city}, {bundle.address?.state} {bundle.zipCode}
                            </span>
                        </div>
                    </div>
                </div>

                {/* avatar group */}
                <div className="flex -space-x-2">
                    {bundle.participants?.slice(0, 3).map((participant, index) => (
                        <img
                            key={participant._id || index}
                            src={participant.customer?.profileImage?.url || `https://i.pravatar.cc/40?img=${index + 1}`}
                            alt="member"
                            className="h-[50px] w-[50px] rounded-full object-cover ring-2 ring-[#0E7A60]"
                        />
                    ))}
                    {participantCount > 3 && (
                        <div className="h-[50px] w-[50px] rounded-full bg-[#0E7A60] ring-2 ring-[#0E7A60] flex items-center justify-center text-white text-sm font-semibold">
                            +{participantCount - 3}
                        </div>
                    )}
                </div>
            </div>

            {/* bottom row: date/time/rate + actions */}
            <div className="flex items-end justify-between">
                <div className="text-[15px] mt-[15px] leading-6">
                    <div>
                        <span className="font-semibold text-[#1D1D1F]">Date: </span>
                        <span className="text-[#1D1D1F]">{formattedDate}</span>
                        <span className="ml-4 font-semibold text-[#0E7A60]">${hourlyRate}/hr</span>
                    </div>
                    <div>
                        <span className="font-semibold text-[#1D1D1F]">Time: </span>
                        <span className="text-[#1D1D1F]">{bundle.serviceTimeStart} - {bundle.serviceTimeEnd}</span>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={handleCencelOrderConfirm}
                        type="button"
                        className="decline_btn px-4 py-2"
                        disabled={isUpdating}
                    >
                        Decline
                    </button>
                    <button
                        onClick={handleAccept}
                        type="button"
                        className="accept_btn px-4 py-2"
                        disabled={isUpdating}
                    >
                        {isUpdating ? 'Processing...' : 'Accept'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default BundleRequestCard;
