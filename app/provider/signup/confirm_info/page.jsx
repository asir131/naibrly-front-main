"use client";
import { useRouter } from "next/navigation";
import {
  useGetUserProfileQuery,
  useGetVerifyInfoStatusQuery,
  useGetProviderZipQuery,
} from "@/redux/api/servicesApi";

export default function ConfirmInfo() {
  const router = useRouter();

  // Fetch all required data
  const { data: profileData, isLoading: profileLoading } =
    useGetUserProfileQuery();
  const { data: verifyData, isLoading: verifyLoading } =
    useGetVerifyInfoStatusQuery();
  const { data: zipData, isLoading: zipLoading } = useGetProviderZipQuery();

  const isLoading = profileLoading || verifyLoading || zipLoading;
  const user = profileData?.user;
  const verificationInfo = verifyData?.verificationInfo;
  const provider = zipData?.provider;

  const handleConfirm = () => {
    router.push("/provider/signup/payout_info");
  };

  const handleBack = () => {
    router.back();
  };

  const handleEdit = () => {
    router.push("/provider/signup/user_info");
  };

  // Format business hours
  const formatBusinessHours = () => {
    if (!user?.businessServiceDays || !user?.businessHours) return "Not set";

    const days = user.businessServiceDays;
    const hours = user.businessHours;

    const dayMap = {
      mon: "Mon",
      tue: "Tue",
      wed: "Wed",
      thu: "Thu",
      fri: "Fri",
      sat: "Sat",
      sun: "Sun",
    };

    const startDay = dayMap[days.start] || days.start;
    const endDay = dayMap[days.end] || days.end;

    const formatTime = (time) => {
      if (!time) return "";
      const [hour, minute] = time.split(":");
      const h = parseInt(hour);
      const ampm = h >= 12 ? "pm" : "am";
      const hour12 = h % 12 || 12;
      return `${hour12}:${minute}${ampm}`;
    };

    return `${startDay} - ${endDay} (${formatTime(hours.start)} to ${formatTime(
      hours.end
    )})`;
  };

  // Format business address
  const formatAddress = () => {
    const addr = user?.businessAddress;
    if (!addr) return "Not provided";

    const parts = [addr.street, addr.city, addr.state, addr.zipCode].filter(
      Boolean
    );
    return parts.length > 0 ? parts.join(", ") : "Not provided";
  };

  // Format full name
  const getFullName = () => {
    if (user?.firstName || user?.lastName) {
      return (
        `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
        "Not provided"
      );
    }
    return "Not provided";
  };

  // Format role
  const formatRole = (role) => {
    if (!role) return "Not specified";
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  // Get service areas
  const getServiceAreas = () => {
    const areas = user?.serviceAreas || provider?.serviceAreas || [];
    return areas.filter((area) => area.isActive);
  };

  if (isLoading) {
    return (
      <div className="user_info_layout max-sm:mx-6 max-sm:my-6 md:py-[80px] md:px-[126px]">
        <div className="confirm_info_layout md:px-[200px] md:py-[100px] flex justify-center items-center">
          <div className="flex flex-col items-center gap-4">
            <svg
              className="animate-spin h-10 w-10 text-[#0E7A60]"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <p className="text-gray-600">Loading your information...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="user_info_layout max-sm:mx-6 max-sm:my-6 md:py-[80px] md:px-[126px]">
      <div className="confirm_info_layout md:px-[200px] md:py-[100px] flex justify-center items-center">
        <div className="lg:w-[400px] w-full">
          <div className="user_info_heading flex items-center gap-[98px] pb-5">
            <span>Overview</span>
          </div>
          <div className="flex flex-col justify-center items-center">
            <h1 className="text-[28px] items-start text-black pb-[28px]">
              Confirm your info
            </h1>
            <p className="text-[14px] text-gray-600">
              Make sure your personal information is correct. For legal
              purposes, you will be unable to edit your legal name once it's
              submitted.
            </p>

            {/* Confirm info sections */}
            <div className="w-full px-[9px] flex flex-col gap-[20px] pt-6">
              {/* Legal Full Name */}
              <div className="flex flex-col gap-2">
                <h2 className="confirm_info_heading">LEGAL FULL NAME:</h2>
                <p className="confirm_info_text">{getFullName()}</p>
              </div>

              {/* Email */}
              <div className="flex flex-col gap-2">
                <h2 className="confirm_info_heading">EMAIL:</h2>
                <p className="confirm_info_text">
                  {user?.email || "Not provided"}
                </p>
              </div>

              {/* Your Role */}
              <div className="flex flex-col gap-2">
                <h2 className="confirm_info_heading">YOUR ROLE:</h2>
                <p className="confirm_info_text">
                  {formatRole(user?.providerRole)}
                </p>
              </div>

              {/* Business Name */}
              <div className="flex flex-col gap-2">
                <h2 className="confirm_info_heading">
                  BUSINESS NAME (REGISTERED):
                </h2>
                <p className="confirm_info_text">
                  {user?.businessNameRegistered || "Not provided"}
                </p>
              </div>

              {/* DBA Name */}
              {user?.businessNameDBA && (
                <div className="flex flex-col gap-2">
                  <h2 className="confirm_info_heading">BUSINESS NAME (DBA):</h2>
                  <p className="confirm_info_text">{user.businessNameDBA}</p>
                </div>
              )}

              {/* Business Address */}
              <div className="flex flex-col gap-2">
                <h2 className="confirm_info_heading">BUSINESS ADDRESS:</h2>
                <p className="confirm_info_text">{formatAddress()}</p>
              </div>

              {/* Phone Number */}
              <div className="flex flex-col gap-2">
                <h2 className="confirm_info_heading">PHONE NUMBER:</h2>
                <p className="confirm_info_text">
                  {user?.phone || "Not provided"}
                </p>
              </div>

              {/* Website */}
              {user?.website && (
                <div className="flex flex-col gap-2">
                  <h2 className="confirm_info_heading">WEBSITE:</h2>
                  <p className="confirm_info_text text-blue-600 break-all">
                    {user.website}
                  </p>
                </div>
              )}

              {/* Business Service Days & Hours */}
              <div className="flex flex-col gap-2">
                <h2 className="confirm_info_heading">
                  BUSINESS SERVICE DAYS & HOURS:
                </h2>
                <p className="confirm_info_text">{formatBusinessHours()}</p>
              </div>

              {/* EIN Number */}
              {verificationInfo?.einNumber && (
                <div className="flex flex-col gap-2">
                  <h2 className="confirm_info_heading">EIN NUMBER:</h2>
                  <p className="confirm_info_text">
                    {verificationInfo.einNumber}
                  </p>
                </div>
              )}

              {/* Experience */}
              {user?.experience > 0 && (
                <div className="flex flex-col gap-2">
                  <h2 className="confirm_info_heading">EXPERIENCE:</h2>
                  <p className="confirm_info_text">{user.experience} years</p>
                </div>
              )}

              {/* Hourly Rate */}
              {user?.hourlyRate > 0 && (
                <div className="flex flex-col gap-2">
                  <h2 className="confirm_info_heading">HOURLY RATE:</h2>
                  <p className="confirm_info_text">${user.hourlyRate}/hr</p>
                </div>
              )}

              {/* Service Areas / Zip Codes */}
              <div className="flex flex-col gap-2">
                <h2 className="confirm_info_heading">SERVICE AREAS:</h2>
                <div className="flex flex-wrap gap-2">
                  {getServiceAreas().length > 0 ? (
                    getServiceAreas().map((area, index) => (
                      <span
                        key={index}
                        className="zip_code inline-flex items-center gap-1 px-3 py-1"
                      >
                        <svg
                          className="w-4 h-4 text-green-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="font-medium text-green-800">
                          {area.zipCode}
                          {area.city && ` - ${area.city}`}
                          {area.state && `, ${area.state}`}
                        </span>
                      </span>
                    ))
                  ) : (
                    <p className="confirm_info_text">No service areas added</p>
                  )}
                </div>
              </div>

              {/* Services Provided */}
              <div className="flex flex-col gap-2 w-full">
                <h2 className="confirm_info_heading">SERVICES PROVIDED:</h2>
                <div className="flex flex-col gap-[10px]">
                  {user?.servicesProvided &&
                  user.servicesProvided.length > 0 ? (
                    user.servicesProvided.map((service, index) => {
                      const name =
                        typeof service === "string"
                          ? service
                          : service?.name || "Service";
                      const rate =
                        service &&
                        typeof service === "object" &&
                        service.hourlyRate
                          ? ` - $${service.hourlyRate}/hr`
                          : "";
                      return (
                        <p
                          key={index}
                          className="home_status inline-flex items-center"
                        >
                          <span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
                              viewBox="0 0 20 20"
                              fill="none"
                            >
                              <path
                                d="M10 7.5C9.50555 7.5 9.0222 7.64662 8.61108 7.92133C8.19995 8.19603 7.87952 8.58648 7.6903 9.04329C7.50108 9.50011 7.45157 10.0028 7.54804 10.4877C7.6445 10.9727 7.8826 11.4181 8.23223 11.7678C8.58187 12.1174 9.02732 12.3555 9.51228 12.452C9.99723 12.5484 10.4999 12.4989 10.9567 12.3097C11.4135 12.1205 11.804 11.8 12.0787 11.3889C12.3534 10.9778 12.5 10.4945 12.5 10C12.5 9.33696 12.2366 8.70107 11.7678 8.23223C11.2989 7.76339 10.663 7.5 10 7.5ZM10 11.25C9.75277 11.25 9.5111 11.1767 9.30554 11.0393C9.09998 10.902 8.93976 10.7068 8.84515 10.4784C8.75054 10.2499 8.72579 9.99861 8.77402 9.75614C8.82225 9.51366 8.9413 9.29093 9.11612 9.11612C9.29093 8.9413 9.51366 8.82225 9.75614 8.77402C9.99861 8.72579 10.2499 8.75054 10.4784 8.84515C10.7068 8.93976 10.902 9.09998 11.0393 9.30554C11.1767 9.5111 11.25 9.75277 11.25 10C11.25 10.3315 11.1183 10.6495 10.8839 10.8839C10.6495 11.1183 10.3315 11.25 10 11.25Z"
                                fill="#F3934F"
                              />
                            </svg>
                          </span>
                          <span>
                            {name}
                            {rate}
                          </span>
                        </p>
                      );
                    })
                  ) : (
                    <p className="text-gray-500 text-sm">
                      No services added yet
                    </p>
                  )}
                </div>
              </div>

              {/* Verification Status */}
              <div className="flex flex-col gap-2">
                <h2 className="confirm_info_heading">VERIFICATION STATUS:</h2>
                <p
                  className={`confirm_info_text ${
                    user?.isVerified ? "text-green-600" : "text-yellow-600"
                  }`}
                >
                  {user?.isVerified ? "Verified" : "Pending Verification"}
                </p>
              </div>

              {/* Account Status */}
              <div className="flex flex-col gap-2">
                <h2 className="confirm_info_heading">ACCOUNT STATUS:</h2>
                <p
                  className={`confirm_info_text ${
                    user?.isApproved ? "text-green-600" : "text-yellow-600"
                  }`}
                >
                  {user?.isApproved ? "Approved" : "Pending Approval"}
                </p>
              </div>

              {/* Secure Info Notice */}
              <div className="secure_info mt-4">
                <svg
                  className="w-5 h-5 text-[#0E7A60] inline mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm text-[#0E7A60]">
                  Once you confirm, you will be taken to a secure identity
                  check. This will only take a few minutes.
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center gap-[10px] text-[16px] font-medium text-[#333] mt-4">
                <button
                  onClick={handleEdit}
                  className="edit_button w-full cursor-pointer"
                >
                  Edit
                </button>
                <button
                  onClick={handleConfirm}
                  className="next_button w-full text-white cursor-pointer"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
