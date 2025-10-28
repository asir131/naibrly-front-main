"use client"
import Image from "next/image";
import Link from "next/link";
import React, { useMemo, useState } from "react";

const StatusPill = ({ status }) => {
  const isAccepted = status?.toLowerCase() === "accepted";
  const color = isAccepted ? "#16A34A" : "#F3934F"; // green vs orange
  const bg = isAccepted ? "#E8F7EE" : "#FFF3E9";
  const dot = isAccepted ? "#34D399" : "#FBBF24";
  const label = isAccepted ? "Accepted" : "Pending";
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

const RequestRow = ({ item }) => {
  return (
    <div className="request_card relative">
      {/* top-right status */}
      <div className="absolute right-4 top-4">
        <StatusPill status={item.status} />
      </div>

      <div className="flex gap-4">
        <Image
          src={item.image}
          alt={item.title}
          width={140}
          height={146.5}
          className=" rounded-xl object-cover"
        />

        <div className="flex-1">
          <h3 className="text-[18px] font-semibold text-[#1D1D1F]">{item.title}</h3>
          <p className="mt-1 text-[14px] leading-6 text-[#7F7F7F] line-clamp-2 md:line-clamp-none">
            {item.description}
          </p>

          <div className="mt-2 text-[15px]">
            <span className="text-[#71717A]">Avg. price: </span>
            <span className="font-semibold text-[#0E7A60]">${item.rate}/hr</span>
          </div>

          <div className="mt-2 flex items-center gap-2 text-[15px] text-[#1D1D1F]">
            <Star />
            <span className="font-medium">{item.rating.toFixed(1)}</span>
            <span className="text-[#7F7F7F]">({item.reviews} reviews)</span>
          </div>

          <div className="mt-2 text-[15px] text-[#7F7F7F]">
            <span className="text-[#1D1D1F]">Service Date: </span>
            {item.serviceDate}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function RequestsTabs({ open = [], closed = [] }) {
  const [tab, setTab] = useState("open");

  const sampleOpen = useMemo(
    () =>
      open.length
        ? open
        : [
          {
            id: 1,
            title: "Appliance Repairs",
            description:
              "Drain pipe leaking, pipe clogged, replace the pipe lineDrain pipe leaking, pipe clogged, replace the pipe lineDrain pipe leaking, pipe clogged, replace the pipe line",
            rate: 63,
            rating: 5.0,
            reviews: 1513,
            serviceDate: "18 Sep, 14:00",
            status: "accepted",
            image:
              "https://images.unsplash.com/photo-1591453089816-0fbb971b454c?q=80&w=1200&auto=format&fit=crop",
          },
          {
            id: 2,
            title: "Appliance Repairs",
            description:
              "Drain pipe leaking, pipe clogged, replace the pipe lineDrain pipe leaking, pipe clogged, replace the pipe lineDrain pipe leaking, pipe clogged, replace the pipe line",
            rate: 63,
            rating: 5.0,
            reviews: 1513,
            serviceDate: "18 Sep, 14:00",
            status: "pending",
            image:
              "https://images.unsplash.com/photo-1591453089816-0fbb971b454c?q=80&w=1200&auto=format&fit=crop",
          },
        ],
    [open]
  );

  const sampleClosed = useMemo(
    () =>
      closed.length
        ? closed
        : [
          {
            id: 3,
            title: "Appliance Repairs",
            description:
              "Drain pipe leaking, pipe clogged, replace the pipe lineDrain pipe leaking, pipe clogged, replace the pipe line",
            rate: 63,
            rating: 4.9,
            reviews: 1210,
            serviceDate: "10 Sep, 16:30",
            status: "accepted",
            image:
              "https://images.unsplash.com/photo-1591453089816-0fbb971b454c?q=80&w=1200&auto=format&fit=crop",
          },
        ],
    [closed]
  );

  const list = tab === "open" ? sampleOpen : sampleClosed;

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
        {list.map((item) => (
          <Link href={`/provider/signup/message/${item.id}`}>
            <RequestRow key={item.id} item={item} />
          </Link>
        ))}
      </div>
    </div>
  );
}
