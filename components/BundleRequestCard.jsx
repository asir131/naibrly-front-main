import Link from "next/link";
import { User as UserIcon } from "lucide-react";
import { useState } from "react";

function BundleRequestCard({ bundle, handleCencelOrderConfirm, handleAccept, isUpdating }) {
    if (!bundle) return null;

    const [isParticipantsOpen, setIsParticipantsOpen] = useState(false);

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
    const participants = Array.isArray(bundle.participants) ? bundle.participants : [];
    const showParticipantsDetails = participants.length > 1;

    const formatAddress = (address) => {
        if (!address) return "";
        const parts = [
            address.street,
            address.aptSuite,
            address.city,
            address.state,
            address.zipCode,
        ].filter(Boolean);
        return parts.join(", ");
    };

    const getParticipantAddress = (participant) =>
        formatAddress(participant?.address) ||
        formatAddress(participant?.customer?.address) ||
        "";

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
                <div className="flex flex-col items-end gap-2">
                    <div className="flex -space-x-2">
                        {bundle.participants?.slice(0, 3).map((participant, index) => {
                            const avatarUrl = participant.customer?.profileImage?.url;
                            const showImage =
                                typeof avatarUrl === "string" &&
                                avatarUrl.trim() &&
                                !avatarUrl.includes("placehold.co");
                            return showImage ? (
                                <img
                                    key={participant._id || index}
                                    src={avatarUrl}
                                    alt="member"
                                    className="h-[50px] w-[50px] rounded-full object-cover ring-2 ring-[#0E7A60]"
                                />
                            ) : (
                                <div
                                    key={participant._id || index}
                                    className="h-[50px] w-[50px] rounded-full bg-teal-600 ring-2 ring-[#0E7A60] flex items-center justify-center"
                                >
                                    <UserIcon className="w-6 h-6 text-white" />
                                </div>
                            );
                        })}
                        {participantCount > 3 && (
                            <div className="h-[50px] w-[50px] rounded-full bg-[#0E7A60] ring-2 ring-[#0E7A60] flex items-center justify-center text-white text-sm font-semibold">
                                +{participantCount - 3}
                            </div>
                        )}
                    </div>
                    {showParticipantsDetails && (
                        <button
                            type="button"
                            onClick={() => setIsParticipantsOpen(true)}
                            className="inline-flex items-center gap-2 rounded-lg border border-[#0E7A60] px-3 py-2 text-[13px] font-semibold text-[#0E7A60] hover:bg-[#E9F7F2] transition"
                        >
                            View Participants ({participants.length})
                        </button>
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

            {isParticipantsOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
                    onClick={() => setIsParticipantsOpen(false)}
                >
                    <div
                        className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-xl"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                            <h3 className="text-lg font-semibold text-[#1D1D1F]">
                                Bundle Participants
                            </h3>
                            <button
                                type="button"
                                onClick={() => setIsParticipantsOpen(false)}
                                className="text-sm font-semibold text-gray-500 hover:text-gray-800"
                            >
                                Close
                            </button>
                        </div>
                        <div className="mt-4 max-h-80 space-y-3 overflow-y-auto pr-1">
                            {participants.map((participant, index) => {
                                const customer = participant?.customer || participant?.user || {};
                                const name = `${customer?.firstName || ""} ${customer?.lastName || ""}`.trim();
                                const address = getParticipantAddress(participant);
                                return (
                                    <div
                                        key={participant?._id || `${bundle._id}-participant-${index}`}
                                        className="rounded-lg border border-gray-200 bg-gray-50 p-3"
                                    >
                                        <div className="text-sm font-semibold text-[#111827]">
                                            {name || "Participant"}
                                        </div>
                                        <div className="text-xs text-gray-600 mt-1">
                                            {address || "Address not available"}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="mt-5 flex justify-end">
                            <button
                                type="button"
                                onClick={() => setIsParticipantsOpen(false)}
                                className="rounded-lg bg-[#0E7A60] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0B6A53]"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default BundleRequestCard;
