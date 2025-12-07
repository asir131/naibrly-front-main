"use client";

import React, { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import ProviderChatInterface from "@/components/ProviderChatInterface";
import { useGetProviderServiceRequestsQuery } from "@/redux/api/servicesApi";

// Helper to build display-friendly order info for the header
const buildOrderData = (item, type) => {
  if (type === "service" && item) {
    const addr = item.locationInfo?.customerAddress || item.customer?.address || {};
    const customer = item.customer || {};
    const date = item.scheduledDate
      ? new Date(item.scheduledDate).toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "N/A";

    return {
      title: item.serviceType || "Service Request",
      price: item.price || 0,
      client: {
        name: `${customer.firstName || ""} ${customer.lastName || ""}`.trim() || "Customer",
        avatar:
          customer.profileImage?.url ||
          "https://i.pravatar.cc/80?img=5",
      },
      rating: item.provider?.rating || 0,
      reviews: item.review?.rating || 0,
      problemNote: item.problem || item.note || "No problem note provided.",
      description: item.note || "",
      address: [addr.street, addr.city, addr.state, addr.zipCode].filter(Boolean).join(", "),
      serviceDate: date,
      statusLabel: item.status || "pending",
      requests: item.requestedServices || [],
    };
  }

  if (type === "bundle" && item) {
    const participant = item.participant || {};
    const customer = item.participantCustomer || item.customer || item.creator || {};
    const addr = participant.address || item.address || customer.address || {};
    const date = item.serviceDate
      ? new Date(item.serviceDate).toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
        })
      : "N/A";

    return {
      title: item.title || "Bundle Request",
      price: item.pricing?.finalPrice || item.finalPrice || 0,
      client: {
        name: `${customer.firstName || ""} ${customer.lastName || ""}`.trim() || "Customer",
        avatar:
          customer.profileImage?.url ||
          "https://i.pravatar.cc/80?img=5",
      },
      rating: item.provider?.rating || 0,
      reviews: Array.isArray(item.reviews) ? item.reviews.length : 0,
      problemNote: item.description || "Bundle details",
      description: item.description || "",
      address: [addr.street, addr.city, addr.state, addr.zipCode].filter(Boolean).join(", "),
      serviceDate: `${date}${item.serviceTimeStart ? `, ${item.serviceTimeStart}` : ""}`,
      statusLabel: item.status || "pending",
      requests: item.services || [],
    };
  }

  return null;
};

const ProviderMessagePage = () => {
  const params = useParams();
  const router = useRouter();
  const slug = params.id; // format: requestId-customerId or bundleId-customerId

  // Fetch provider requests/bundles
  const { data, isLoading, error } = useGetProviderServiceRequestsQuery();

  // Parse slug
  const { requestId, bundleId, customerId } = useMemo(() => {
    if (!slug) return {};
    const parts = slug.split("-");
    if (parts.length === 2) {
      return { requestId: parts[0], customerId: parts[1] };
    }
    // fallback: treat entire slug as id (no customer id)
    return { requestId: slug };
  }, [slug]);

  // Locate the matching request/bundle
  const { activeItem, itemType } = useMemo(() => {
    const services = data?.serviceRequests?.items || [];
    const bundles = data?.bundles?.items || [];
    const foundService = services.find((r) => r._id === requestId);
    const foundBundle = bundles.find((b) => b._id === requestId || b._id === bundleId);
    if (foundService) return { activeItem: foundService, itemType: "service" };
    if (foundBundle) return { activeItem: foundBundle, itemType: "bundle" };
    return { activeItem: null, itemType: null };
  }, [data, requestId, bundleId]);

  const headerData = activeItem ? buildOrderData(activeItem, itemType) : null;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin h-10 w-10 rounded-full border-b-2 border-teal-600 mx-auto mb-3" />
          <p className="text-gray-600">Loading conversation...</p>
        </div>
      </div>
    );
  }

  if (error || !activeItem) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Conversation not found</p>
          <button
            onClick={() => router.back()}
            className="text-teal-600 hover:text-teal-700 font-medium"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="analytics_layout bg-white">
      <ProviderChatInterface
        requestId={itemType === "service" ? activeItem._id : undefined}
        bundleId={itemType === "bundle" ? activeItem._id : undefined}
        customerId={customerId}
        orderData={headerData}
      />
    </div>
  );
};

export default ProviderMessagePage;
