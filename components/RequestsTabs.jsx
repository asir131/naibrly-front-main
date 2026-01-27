"use client"
import Link from "next/link";
import React, { useMemo, useState } from "react";
import { User as UserIcon } from "lucide-react";

const StatusPill = ({ status }) => {
  const statusLower = status?.toLowerCase();

  let color, bg, dot, label;

  if (statusLower === "accepted") {
    color = "#16A34A";
    bg = "#E8F7EE";
    dot = "#34D399";
    label = "Accepted";
  } else if (statusLower === "completed") {
    color = "#0E7A60";
    bg = "#E6F7F4";
    dot = "#0E7A60";
    label = "Completed";
  } else if (statusLower === "cancelled" || statusLower === "declined") {
    color = "#DC2626";
    bg = "#FEE2E2";
    dot = "#EF4444";
    label = statusLower === "cancelled" ? "Cancelled" : "Declined";
  } else {
    color = "#F3934F";
    bg = "#FFF3E9";
    dot = "#FBBF24";
    label = "Pending";
  }

  return (
    <span
      className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium"
      style={{ backgroundColor: bg, color }}
    >
      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: dot }} />
      {label}
    </span>
  );
};

const Star = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#F6C94C">
    <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
  </svg>
);

const RequestRow = ({ item, type }) => {
  const isBundle = type === 'bundle';

  const participant = isBundle ? (item.participant || {}) : null;
  const participantCustomer = isBundle ? (item.participantCustomer || item.customer) : null;

  const title = isBundle ? item.title : item.serviceType;
  const description = isBundle
    ? item.description
    : `${item.problem}${item.note ? ` - ${item.note}` : ''}`;
  const bundleServiceList = isBundle
    ? item.services?.map((service) => service?.name).filter(Boolean) || []
    : [];
  const bundleServiceNames = bundleServiceList.join(", ");
  const bundleServiceLabel = bundleServiceList.length === 1 ? "Service" : "Services";
  const price = isBundle
    ? item.pricing?.finalPrice || item.finalPrice || item.services?.[0]?.hourlyRate || 0
    : item.price || 0;
  const customerImage = isBundle
    ? participantCustomer?.profileImage?.url
    : item.customer?.profileImage?.url;
  const customerName = isBundle
    ? `${participantCustomer?.firstName || item.creator?.firstName || ''} ${participantCustomer?.lastName || item.creator?.lastName || ''}`.trim()
    : `${item.customer?.firstName} ${item.customer?.lastName}`;

  const scheduledDate = new Date(isBundle ? item.serviceDate : item.scheduledDate);
  const formattedDate = scheduledDate.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short'
  });
  const formattedTime = isBundle
    ? item.serviceTimeStart
    : scheduledDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });

  return (
    <div className="request_card relative">
      {/* top-right status */}
      <div className="absolute right-4 top-4">
        <StatusPill status={item.status} />
      </div>

      <div className="flex gap-4">
        {customerImage ? (
          <img
            src={customerImage}
            alt={customerName}
            width={140}
            height={146.5}
            className="rounded-xl object-cover w-[140px] h-[146.5px]"
          />
        ) : (
          <div className="rounded-xl w-[140px] h-[146.5px] bg-linear-to-br from-teal-400 to-teal-600 flex items-center justify-center">
            <UserIcon className="w-10 h-10 text-white" />
          </div>
        )}

        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-[18px] font-semibold text-[#1D1D1F]">{title}</h3>
            {isBundle && (
              <span className="rounded-md bg-[#F2E5FF] px-3 py-1 text-xs font-semibold text-[#7B1FA2]">
                Bundle
              </span>
            )}
          </div>
          <p className="mt-1 text-[14px] leading-6 text-[#7F7F7F] line-clamp-2 md:line-clamp-none">
            {description}
          </p>
          {isBundle && bundleServiceNames && (
            <p className="mt-1 text-[13px] text-[#0E7A60] font-medium">
              {bundleServiceLabel}: {bundleServiceNames}
            </p>
          )}

          <div className="mt-2 text-[15px]">
            <span className="text-[#71717A]">Customer: </span>
            <span className="font-semibold text-[#1D1D1F]">{customerName}</span>
          </div>

          <div className="mt-2 text-[15px]">
            <span className="text-[#71717A]">Price: </span>
            <span className="font-semibold text-[#0E7A60]">${price}{isBundle ? '/hr' : ''}</span>
          </div>

          {isBundle && (
            <div className="mt-2 text-[15px]">
              <span className="text-[#71717A]">Participants: </span>
              <span className="font-semibold text-[#1D1D1F]">
                {item.currentParticipants}/{item.maxParticipants}
              </span>
            </div>
          )}

          <div className="mt-2 text-[15px] text-[#7F7F7F]">
            <span className="text-[#1D1D1F]">Service Date: </span>
            {formattedDate}, {formattedTime}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function RequestsTabs({
  openRequests = [],
  openBundles = [],
  closedRequests = [],
  closedBundles = [],
  isLoading = false
}) {
  const [tab, setTab] = useState("open");

  const openList = useMemo(() => {
    const requests = openRequests.map(req => ({ ...req, type: 'request' }));
    const bundles = openBundles.map(bundle => ({ ...bundle, type: 'bundle' }));
    return [...requests, ...bundles];
  }, [openRequests, openBundles]);

  const closedList = useMemo(() => {
    const requests = closedRequests.map(req => ({ ...req, type: 'request' }));
    const bundles = closedBundles.map(bundle => ({ ...bundle, type: 'bundle' }));
    return [...requests, ...bundles];
  }, [closedRequests, closedBundles]);

  const list = tab === "open" ? openList : closedList;

  return (
    <div className="w-full">
      {/* Tabs */}
      <div className="mb-6 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setTab("open")}
          className={`w-[219px] rounded-[12px] px-5 py-2 text-[14px] font-semibold ring-1 transition ${tab === "open"
            ? "bg-[#0E7A60] text-white ring-[#0E7A60]"
            : "bg-white text-[#0E7A60] ring-[#0E7A60]"
            }`}
        >
          Open
        </button>
        <button
          type="button"
          onClick={() => setTab("closed")}
          className={`w-[219px] rounded-[12px] px-5 py-2 text-[14px] font-semibold ring-1 transition ${tab === "closed"
            ? "bg-[#0E7A60] text-white ring-[#0E7A60]"
            : "bg-white text-[#0E7A60] ring-[#0E7A60]"
            }`}
        >
          Closed
        </button>
      </div>

      {/* List */}
      <div className="flex flex-col gap-4">
        {isLoading ? (
          <div className="relative w-full rounded-2xl bg-white shadow-sm ring-1 ring-black/5 p-6 md:p-7">
            <p className="text-center text-[#666]">Loading requests...</p>
          </div>
        ) : list.length > 0 ? (
          list.map((item) => {
            const participantCustomerId = item.type === 'bundle'
              ? item.participantCustomer?._id || item.customer?._id || item.creator?._id
              : item.customer?._id;

            const slug =
              item.type === 'bundle' && participantCustomerId
                ? `${item._id}-${participantCustomerId}`
                : item._id;

            const key =
              item.type === 'bundle' && participantCustomerId
                ? `${item._id}-${participantCustomerId}`
                : item._id;

            return (
              <Link key={key} href={`/provider/signup/message/${slug}`}>
                <RequestRow item={item} type={item.type} />
              </Link>
            );
          })
        ) : (
          <div className="relative w-full rounded-2xl bg-white shadow-sm ring-1 ring-black/5 p-6 md:p-7">
            <p className="text-center text-[#666]">
              No {tab} requests at the moment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
