"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Share2, MapPin, Loader2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import ShareBundleModal from "./ShareBundleModal";
import { useJoinBundleMutation } from "@/redux/api/servicesApi";
import { toast } from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";


const SERVICE_CATEGORY_MAP = {
  Electrical: "Home Repairs & Maintenance",
  Plumbing: "Home Repairs & Maintenance",
  "Door, Cabinet, & Furniture Repair": "Home Repairs & Maintenance",
  "Furniture Assembly": "Installation & Assembly",
  "IKEA Assembly": "Installation & Assembly",
  "TV Mounting": "Installation & Assembly",
  Cleaning: "Cleaning & Organization",
  "Bathroom Remodeling": "Renovations & Upgrades",
  Carpenters: "Renovations & Upgrades",
  Moving: "Moving",
};

const CATEGORY_TYPE_IMAGES = {
  "Home Repairs & Maintenance": "/topServices/image (1).png",
  "Cleaning & Organization": "/clean.png",
  "Renovations & Upgrades": "/provider/Paint.png",
  "Exterior Home Care": "/provider/Sessor.png",
  "Landscaping & Outdoor Services": "/provider/Hammer.png",
  Moving: "/provider/design  (1).png",
  "Installation & Assembly": "/provider/design  (2).png",
};

export default function BundleDetailModal({ isOpen, onClose, bundleData }) {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [joinBundle, { isLoading: isJoining }] = useJoinBundleMutation();
  const [participation, setParticipation] = useState(null);
  const [participationLoading, setParticipationLoading] = useState(false);
  const { user } = useAuth();
  const router = useRouter();
  const currentUserId = user?._id || user?.id || user?.userId || null;


  // Treat known placeholder URLs as "no image"
  const normalizeImageUrl = (img) => {
    if (!img) return null;
    if (typeof img === "string") return img;
    if (typeof img === "object") return img.url || null;
    return null;
  };

  const isValidImageUrl = (val) => {
    if (typeof val !== "string") return false;
    const trimmed = val.trim();
    if (!trimmed) return false;
    if (!(trimmed.startsWith("/") || /^https?:\/\//i.test(trimmed))) return false;
    if (trimmed.endsWith("/")) return false;
    const lastSegment = trimmed.split("/").pop() || "";
    if (!lastSegment.includes(".")) return false;
    return true;
  };

  const isPlaceholderImage = (url) => {
    if (!isValidImageUrl(url)) return false;
    const lowered = url.toLowerCase();
    return (
      lowered.includes("i.pravatar.cc") ||
      lowered.includes("placehold") ||
      lowered.includes("placeholder") ||
      lowered.includes("photo-1535713875002-d1d0cf377fde") || // old default avatar
      lowered.includes("photo-1527515637462-cff94eecc1ac") // old modal hero
    );
  };

  const resolveImage = (participant) => {
    const candidate =
      participant?.profileImage?.url ||
      participant?.image?.url ||
      participant?.image ||
      null;
    if (!isValidImageUrl(candidate) || isPlaceholderImage(candidate)) return null;
    return candidate;
  };

  const getCreatorName = () => {
    const creator = bundleData?.creator || null;
    const first = creator?.firstName || creator?.first_name || "";
    const last = creator?.lastName || creator?.last_name || "";
    const full = `${first} ${last}`.trim();
    return full || null;
  };

  const resolveParticipantName = (participant, creatorName) => {
    if (participant?.name) {
      const trimmed = String(participant.name).trim();
      if (trimmed && trimmed.toLowerCase() !== "undefined undefined") {
        return trimmed;
      }
    }
    const customer = participant?.customer || participant?.user || null;
    const first =
      customer?.firstName ||
      customer?.first_name ||
      participant?.firstName ||
      participant?.first_name ||
      "";
    const last =
      customer?.lastName ||
      customer?.last_name ||
      participant?.lastName ||
      participant?.last_name ||
      "";
    const full = `${first} ${last}`.trim();
    if (full) return full;
    if (creatorName) return creatorName;
    return "Participant";
  };

  // Filter out "Open Spot" participants and ensure valid image/name
  const participantsList = Array.isArray(bundleData?.participants)
    ? bundleData.participants
    : [];
  const creatorName = getCreatorName();

  const activeParticipants = useMemo(
    () =>
      participantsList
        .filter((participant) => participant.name !== "Open Spot")
        .map((p) => ({
          ...p,
          image: resolveImage(p),
          name: resolveParticipantName(p, creatorName),
        })),
    [participantsList, creatorName]
  );

  const isCreator = useMemo(() => {
    if (participation?.isCreator) return true;
    const creatorId =
      bundleData?.creator?._id ||
      bundleData?.creator?.id ||
      bundleData?.creator ||
      null;
    return (
      creatorId &&
      currentUserId &&
      creatorId.toString() === currentUserId.toString()
    );
  }, [bundleData, currentUserId]);

  const isAlreadyParticipant = useMemo(() => {
    if (participation?.isParticipant) return true;
    if (isCreator) return true;
    const matchesCurrentUser = participantsList.some((p) => {
      const pid =
        p?.customerId ||
        p?._id ||
        p?.id ||
        p?.customer?._id ||
        p?.customer?.id;
      if (!pid || !currentUserId) return false;
      return pid.toString() === currentUserId.toString();
    });
    return matchesCurrentUser;
  }, [participation?.isParticipant, isCreator, participantsList, currentUserId]);

  const handleShare = () => {
    setIsShareModalOpen(true);
  };

  const handleJoinBundle = async () => {
    try {
      if (isAlreadyParticipant) {
        return;
      }
      // Use the bundle _id or id from bundleData
      const bundleId = bundleData._id || bundleData.id;

      if (!bundleId) {
        console.error("Bundle ID not found");
        toast.error("Unable to join bundle. Please try again.");
        return;
      }

      console.log("Joining bundle:", bundleId);

      // Call the join bundle API
      const result = await joinBundle(bundleId).unwrap();

      console.log("Successfully joined bundle:", result);
      setParticipation({ isParticipant: true, isCreator });

      if (typeof onClose === "function") {
        onClose();
      }
      router.push("/request");
    } catch (error) {
      // Log a concise error for debugging without noisy empty objects
      const rawMessage =
        error?.data?.message ||
        error?.error ||
        error?.message ||
        (typeof error === "string" ? error : "");
      const errorMessage = rawMessage || "Failed to join bundle. Please try again.";

      if (
        typeof errorMessage === "string" &&
        errorMessage.toLowerCase().includes("already part of this bundle")
      ) {
        setParticipation({ isParticipant: true, isCreator });
        console.info("Bundle already joined for this user");
        toast.success("Bundle Joined!");
        return;
      }

      console.error("Failed to join bundle:", errorMessage);
      toast.error(errorMessage);
    }
  };

  const getCategoryTypeName = (bundle) => {
    if (bundle?.categoryTypeName) return bundle.categoryTypeName;
    const firstService = bundle?.services?.[0];
    if (firstService?.categoryTypeName) return firstService.categoryTypeName;
    const firstServiceName = firstService?.name;
    return SERVICE_CATEGORY_MAP[firstServiceName] || null;
  };

  const getCategoryImage = (bundle) => {
    // Prefer bundle cover image when valid
    const coverImage = normalizeImageUrl(bundle?.coverImage);
    if (coverImage && isValidImageUrl(coverImage) && !isPlaceholderImage(coverImage)) {
      return coverImage;
    }

    // Next, prefer the categoryType image derived from the bundle's services
    const categoryTypeImage =
      normalizeImageUrl(bundle?.categoryTypeImage) ||
      normalizeImageUrl(bundle?.categoryTypeImage?.url) ||
      normalizeImageUrl(bundle?.categoryTypeImage?.image);
    if (categoryTypeImage && isValidImageUrl(categoryTypeImage)) {
      return categoryTypeImage;
    }
    const categoryType = getCategoryTypeName(bundle);
    const categoryImage =
      (categoryType && CATEGORY_TYPE_IMAGES[categoryType]) || null;
    if (categoryImage && isValidImageUrl(categoryImage)) {
      return categoryImage;
    }
    return null;
  };

  const heroImage = getCategoryImage(bundleData);

  // Check participation via API when modal opens
  useEffect(() => {
    const checkParticipation = async () => {
      const bundleId = bundleData?._id || bundleData?.id;
      if (!bundleId || !isOpen) return;
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("authToken")
          : null;
      if (!token) return;
      setParticipationLoading(true);
      try {
        const apiBase =
          process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";
        const res = await fetch(`${apiBase}/bundles/${bundleId}/participation`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok && data?.success) {
          setParticipation({
            isParticipant: !!data.data?.isParticipant,
            isCreator: !!data.data?.isCreator,
          });
        } else {
          setParticipation(null);
        }
      } catch (err) {
        setParticipation(null);
      } finally {
        setParticipationLoading(false);
      }
    };
    setParticipation(null);
    checkParticipation();
  }, [isOpen, bundleData?._id, bundleData?.id]);

  if (!isOpen || !bundleData) return null;

  const serviceDateDisplay = bundleData.serviceDate
    ? new Date(bundleData.serviceDate).toISOString().split("T")[0]
    : null;
  const serviceList =
    bundleData.services?.map((service) => service?.name).filter(Boolean) || [];
  const serviceNames = serviceList.join(", ");
  const serviceLabel = serviceList.length === 1 ? "Service" : "Services";

  // Show only ZIP code for location
  const locationDisplay = bundleData.zipCode || bundleData.address?.zipCode || "ZIP not provided";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Backdrop overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal content */}
      <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex flex-col md:flex-row">
          {/* Left side - Image */}
          <div className="md:w-2/5 relative h-64 md:h-auto">
            {heroImage ? (
              <Image
                src={heroImage}
                alt={bundleData.service}
                width={400}
                height={600}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-teal-50 flex items-center justify-center">
                <User className="w-16 h-16 text-teal-600" />
              </div>
            )}
          </div>

          {/* Right side - Content */}
          <div className="md:w-3/5 p-6 md:p-8 flex flex-col">
            {/* Header with title and share button */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  {bundleData.service}
                </h2>
                <p className="text-base text-gray-700 font-medium mb-1">
                  {bundleData.bundle}
                </p>
                {serviceNames && (
                  <p className="text-sm text-teal-600 font-medium mb-1">
                    {serviceLabel}: {serviceNames}
                  </p>
                )}
                {(serviceDateDisplay || bundleData.serviceTimeStart || bundleData.serviceTimeEnd) && (
                  <p className="text-sm text-gray-600">
                    Service Date: {serviceDateDisplay || "TBD"}
                    {(bundleData.serviceTimeStart || bundleData.serviceTimeEnd) && (
                      <>
                        {" "}
                        | Time: {bundleData.serviceTimeStart || "—"} {bundleData.serviceTimeEnd ? `- ${bundleData.serviceTimeEnd}` : ""}
                      </>
                    )}
                  </p>
                )}
              </div>
              <button
                onClick={handleShare}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors shrink-0"
              >
                <Share2 className="w-5 h-5 text-gray-700" />
              </button>
            </div>

            {/* Participants */}
            <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
              {activeParticipants.map((participant, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0">
                    {/* Fallback teal avatar (always rendered behind) */}
                    <div className="absolute inset-0 bg-teal-500 flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    {isValidImageUrl(participant.image) && (
                      <Image
                        src={participant.image}
                        alt={participant.name}
                        width={48}
                        height={48}
                        className="relative z-10 w-full h-full object-cover"
                        onError={(e) => {
                          // Hide broken images so fallback shows
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-base font-semibold text-gray-900 mb-1">
                      {participant.name}
                    </h4>
                    <div className="flex items-center gap-1.5 text-sm text-gray-600">
                      <MapPin className="w-4 h-4 text-teal-600 shrink-0" />
                      <span>{locationDisplay}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pricing Section */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    Standard rates est.
                  </p>
                  <p className="text-lg font-semibold text-gray-900">
                    {bundleData.originalPrice}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 mb-1">
                    Standard rates est.
                  </p>
                  <p className="text-lg font-semibold text-teal-600">
                    {bundleData.savings
                      ? bundleData.savings.replace("-", "") + " off"
                      : bundleData.discountedPrice || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Join Button */}
            <Button
              onClick={handleJoinBundle}
              disabled={isJoining || isAlreadyParticipant || participationLoading}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white py-4 rounded-xl font-semibold text-lg shadow-md mt-auto disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isJoining ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Joining...</span>
                </div>
              ) : (
                isAlreadyParticipant ? "Bundle Joined!" : "Join Bundle"
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Share Bundle Modal */}
      <ShareBundleModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        bundleData={bundleData}
      />
    </div>
  );
}
