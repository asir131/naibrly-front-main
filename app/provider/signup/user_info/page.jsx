"use client";
import { useRouter } from "next/navigation";
import { useRef, useState, useMemo } from "react";
import { IoIosArrowDown } from "react-icons/io";
import {
  useRegisterProviderMutation,
  useGetServicesQuery,
} from "@/redux/api/servicesApi";
import { toast } from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";

const US_STATES = [
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "FL",
  "GA",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VA",
  "WA",
  "WV",
  "WI",
  "WY",
];

export default function UserInfo() {
  // this is for navigate
  const router = useRouter();
  const [registerProvider, { isLoading }] = useRegisterProviderMutation();
  const { data: allServicesData, isLoading: servicesLoading } =
    useGetServicesQuery(undefined, {
      refetchOnFocus: false,
      refetchOnReconnect: false,
      refetchOnMountOrArgChange: false,
    });
  const { login } = useAuth();
  const serviceOptions = useMemo(
    () => allServicesData?.services || allServicesData?.data?.services || [],
    [allServicesData]
  );

  const [formData, setFormData] = useState({
    businessName: "",
    firstName: "",
    lastName: "",
    businessEmail: "",
    password: "",
    confirmPassword: "",
    role: "",
    businessAddress: "",
    businessPhone: "",
    website: "",
    servicesProvided: "",
    businessServiceStart: "mon",
    businessServiceEnd: "fri",
    businessHoursStart: "09:00",
    businessHoursEnd: "17:00",
    hourlyRate: "",
    businessAddressStreet: "",
    businessAddressCity: "",
    businessAddressState: "",
    businessAddressZipCode: "",
    experience: "",
    phone: "",
    countryCode: "+1",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const fileInputRef = useRef(null);
  const [businessLogo, setBusinessLogo] = useState(null);
  const [serviceSelection, setServiceSelection] = useState({
    name: "",
    rate: "",
  });
  const [selectedServicesWithRates, setSelectedServicesWithRates] = useState(
    []
  );

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setBusinessLogo(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Enhanced validation
    if (
      !formData.businessName ||
      !formData.businessEmail ||
      !formData.password ||
      !formData.phone ||
      !formData.role
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    // Validate password length (minimum 6 characters as per backend)
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    // Validate business service days (REQUIRED in backend)
    if (!formData.businessServiceStart || !formData.businessServiceEnd) {
      toast.error("Please select business service days");
      return;
    }

    // Validate business hours (REQUIRED in backend)
    if (!formData.businessHoursStart || !formData.businessHoursEnd) {
      toast.error("Please select business hours");
      return;
    }

    try {
      // Always use FormData to match backend expectations (from Postman example)
      const submitData = new FormData();

      // Required fields - matching Postman exactly
      submitData.append("email", formData.businessEmail.toLowerCase().trim());
      submitData.append("password", formData.password);
      submitData.append("confirmPassword", formData.confirmPassword); // Backend requires this!
      submitData.append("phone", formData.phone);
      submitData.append("businessNameRegistered", formData.businessName.trim());
      submitData.append("providerRole", formData.role);

      // Optional scalar fields
      if (formData.firstName?.trim()) {
        submitData.append("firstName", formData.firstName.trim());
      }
      if (formData.lastName?.trim()) {
        submitData.append("lastName", formData.lastName.trim());
      }

      // Business phone (separate from personal phone)
      if (formData.businessPhone?.trim()) {
        submitData.append("businessPhone", formData.businessPhone.trim());
      }

      if (formData.businessAddressStreet?.trim()) {
        submitData.append(
          "businessAddressStreet",
          formData.businessAddressStreet.trim()
        );
      }
      if (formData.businessAddressCity?.trim()) {
        submitData.append(
          "businessAddressCity",
          formData.businessAddressCity.trim()
        );
      }
      if (formData.businessAddressState?.trim()) {
        submitData.append(
          "businessAddressState",
          formData.businessAddressState.trim()
        );
      }
      if (formData.businessAddressZipCode?.trim()) {
        submitData.append(
          "businessAddressZipCode",
          formData.businessAddressZipCode.trim()
        );
      }

      if (formData.website?.trim()) {
        submitData.append("website", formData.website.trim());
      }

      // Business service days - as SEPARATE fields (not nested JSON)
      submitData.append("businessServiceStart", formData.businessServiceStart);
      submitData.append("businessServiceEnd", formData.businessServiceEnd);

      // Business hours - as SEPARATE fields (not nested JSON)
      submitData.append("businessHoursStart", formData.businessHoursStart);
      submitData.append("businessHoursEnd", formData.businessHoursEnd);

      // Services provided with hourly rates
      if (selectedServicesWithRates.length > 0) {
        selectedServicesWithRates.forEach((svc) => {
          submitData.append("servicesProvidedName", svc.name);
          submitData.append("servicesProvidedHourlyRate", svc.rate);
        });
      } else if (formData.servicesProvided) {
        submitData.append("servicesProvidedName", formData.servicesProvided);
        if (formData.hourlyRate) {
          submitData.append("servicesProvidedHourlyRate", formData.hourlyRate);
        }
      }

      // Business logo image file (provider upload only allows businessLogo)
      if (businessLogo) {
        submitData.append("businessLogo", businessLogo);
      }

      // Optional fields
      if (formData.experience) {
        submitData.append("experience", Number(formData.experience));
      }
      if (formData.hourlyRate) {
        submitData.append("hourlyRate", Number(formData.hourlyRate));
      }

      // Log what we're sending
      console.log("Submitting FormData to API:");
      for (let pair of submitData.entries()) {
        console.log(pair[0] + ":", pair[1]);
      }

      const result = await registerProvider(submitData).unwrap();

      // Success handling
      const token = result?.token || result?.data?.token;
      if (token) {
        localStorage.setItem("authToken", token);
      }
      // Persist user type for downstream API calls (RTK Query header prep)
      localStorage.setItem("userType", "provider");
      const userPayload = result?.data?.user || result?.user;
      if (userPayload) {
        localStorage.setItem("user", JSON.stringify(userPayload));
        login({ user: userPayload, userType: "provider" });
      }

      toast.success("Registration successful!");
      router.push("/provider/signup/verify_info");
    } catch (error) {
      console.error("Registration error:", {
        status: error?.status,
        message: error?.message,
        data: error?.data,
        error: error?.error,
        raw: error,
      });

      // Enhanced error logging
      if (error?.data) {
        console.error("Backend error details:", error.data);

        // Log validation errors specifically
        if (error.data.errors) {
          console.error("Validation errors:");
          error.data.errors.forEach((err, index) => {
            console.error(`Error ${index + 1}:`, err);
          });
        }
      }

      let errorMessage = "Registration failed. Please try again.";

      // Handle different error formats
      if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error?.data?.errors && Array.isArray(error.data.errors)) {
        // Handle validation errors array
        if (error.data.errors.length > 0) {
          if (error.data.errors[0].msg) {
            errorMessage = error.data.errors[0].msg;
          } else if (error.data.errors[0].message) {
            errorMessage = error.data.errors[0].message;
          }
        }
      } else if (error?.data?.error) {
        errorMessage = error.data.error;
      } else if (error?.message) {
        errorMessage = error.message;
      } else if (error?.status === "TIMEOUT_ERROR") {
        errorMessage = "Request timeout. Please check your connection.";
      } else if (error?.status === 400) {
        errorMessage = "Invalid data submitted. Please check all fields.";
      } else if (error?.status === 409) {
        errorMessage = "An account with this email already exists.";
      }

      toast.error(errorMessage);
    }
  };

  return (
    <div className="">
      <form
        onSubmit={handleSubmit}
        className="w-[90%] mx-auto user_info_input md:px-[200px] md:py-[50px] overflow-x-hidden"
      >
        <div className="user_info_heading flex items-center gap-[18px] pb-5"></div>
        <div className="flex items-center justify-center">
          <div className="w-full md:w-[353px]">
            <h3 className="text-[12px] font-medium text-[#333] text-center pb-5">
              We need to collect your personal business information.
            </h3>
            <div className="mb-5 flex flex-col gap-2 relative">
              <div
                className="upload_business cursor-pointer hover:border-[#1C5941] transition-colors duration-200 relative overflow-hidden group"
                onClick={handleClick}
              >
                {businessLogo ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-green-50">
                    <div className="w-20 h-20 mb-2 rounded-full overflow-hidden border-2 border-green-500">
                      <img
                        src={URL.createObjectURL(businessLogo)}
                        alt="Business Logo Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-sm text-green-700 font-medium">
                      {businessLogo.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Click to change
                    </p>
                  </div>
                ) : (
                  <div className="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
                    <div className="p-3 bg-gray-100 rounded-full group-hover:bg-green-50 transition-colors">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 20 22"
                        fill="none"
                      >
                        <path
                          d="M10.75 0.75H11.0227C14.2839 0.75 15.9145 0.75 17.0469 1.54784C17.3714 1.77643 17.6594 2.04752 17.9023 2.35289C18.75 3.41867 18.75 4.95336 18.75 8.02273V10.5682C18.75 13.5314 18.75 15.0129 18.2811 16.1962C17.5272 18.0986 15.9329 19.5991 13.9116 20.3086C12.6544 20.75 11.0802 20.75 7.93182 20.75C6.13275 20.75 5.23322 20.75 4.51478 20.4978C3.35979 20.0924 2.44875 19.2349 2.01796 18.1479C1.75 17.4717 1.75 16.6251 1.75 14.9318V10.75"
                          stroke="#1C5941"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M18.75 10.75C18.75 12.5909 17.2576 14.0833 15.4167 14.0833C14.7509 14.0833 13.966 13.9667 13.3186 14.1401C12.7435 14.2942 12.2942 14.7435 12.1401 15.3186C11.9667 15.966 12.0833 16.7509 12.0833 17.4167C12.0833 19.2576 10.5909 20.75 8.75 20.75"
                          stroke="#1C5941"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M8.75 4.75L0.75 4.75M4.75 0.75V8.75"
                          stroke="#1C5941"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                    <label className="block text-black text-sm font-semibold">
                      Upload Your Business Logo
                    </label>
                    <span className="text-[11px] text-gray-500">
                      PNG, JPG up to 3MB
                    </span>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleLogoChange}
                />
              </div>
            </div>

            <div className="mb-4 relative">
              <label className="text-[#1C5941] text-[10px] font-semibold absolute left-4 -top-1.5 bg-white px-1">
                Business Name (AS REGISTERED) *
              </label>
              <input
                type="text"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                className="input_box text-[#333] text-[16px] focus:border-[#1C5941] transition-colors"
                placeholder="Enter your registered business name"
                required
              />
              <p className="text-xs text-gray-500 mt-1 ml-1">
                Official name as it appears on legal documents
              </p>
            </div>

            <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="relative">
                <label className="text-[#1C5941] text-[10px] font-semibold absolute left-4 -top-1.5 bg-white px-1">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="input_box text-[#333] text-[16px] focus:border-[#1C5941] transition-colors"
                  placeholder="Enter your first name"
                />
              </div>
              <div className="relative">
                <label className="text-[#1C5941] text-[10px] font-semibold absolute left-4 -top-1.5 bg-white px-1">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="input_box text-[#333] text-[16px] focus:border-[#1C5941] transition-colors"
                  placeholder="Enter your last name"
                />
              </div>
            </div>
            <div className="mb-4 relative">
              <label className="text-[#1C5941] text-[10px] font-semibold absolute left-4 -top-1.5 bg-white px-1">
                Email Address *
              </label>
              <input
                type="email"
                name="businessEmail"
                value={formData.businessEmail}
                onChange={handleChange}
                className="input_box text-[#333] text-[16px] focus:border-[#1C5941] transition-colors"
                placeholder="your@email.com"
                required
              />
              {formData.businessEmail && (
                <span className="absolute right-4 top-3 text-green-500">
                  <svg
                    width="20"
                    height="20"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              )}
            </div>

            <div className="mb-4 relative">
              <label className="text-[#1C5941] text-[10px] font-semibold absolute left-4 -top-1.5 bg-white px-1">
                Password *
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input_box text-[#333] text-[16px] focus:border-[#1C5941] transition-colors"
                placeholder="Create a strong password"
                required
              />
              <p className="text-xs text-gray-500 mt-1 ml-1">
                Minimum 8 characters
              </p>
            </div>
            <div className="mb-4 relative">
              <label className="text-[#1C5941] text-[10px] font-semibold absolute left-4 -top-1.5 bg-white px-1">
                Confirm Password *
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`input_box text-[#333] text-[16px] transition-colors ${
                  formData.confirmPassword &&
                  formData.password !== formData.confirmPassword
                    ? "border-red-500 focus:border-red-500"
                    : "focus:border-[#1C5941]"
                }`}
                placeholder="Re-enter your password"
                required
              />
              {formData.confirmPassword && (
                <span
                  className={`absolute right-4 top-3 ${
                    formData.password === formData.confirmPassword
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {formData.password === formData.confirmPassword ? (
                    <svg
                      width="20"
                      height="20"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      width="20"
                      height="20"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </span>
              )}
              {formData.confirmPassword &&
                formData.password !== formData.confirmPassword && (
                  <p className="text-xs text-red-500 mt-1 ml-1">
                    Passwords do not match
                  </p>
                )}
            </div>

            <div className="mb-3 relative">
              <IoIosArrowDown className="absolute right-4 top-4" />
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="input_box text-[#999] text-[16px]"
                required
              >
                <option value="">Select Role *</option>
                <option value="owner">Owner</option>
                <option value="manager">Manager</option>
                <option value="employee">Employee</option>
              </select>
            </div>

            <div className="mb-3">
              <input
                type="text"
                name="businessAddressStreet"
                value={formData.businessAddressStreet}
                onChange={handleChange}
                className="input_box text-[#999] text-[16px]"
                placeholder="Business Address Street"
              />
            </div>

            <div className="mb-3 grid grid-cols-3 gap-3">
              <input
                type="text"
                name="businessAddressCity"
                value={formData.businessAddressCity}
                onChange={handleChange}
                className="input_box text-[#999] text-[16px]"
                placeholder="City"
              />
              <select
                name="businessAddressState"
                value={formData.businessAddressState}
                onChange={handleChange}
                className="input_box text-[#999] text-[16px]"
              >
                <option value="">State</option>
                {US_STATES.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
              <input
                type="text"
                name="businessAddressZipCode"
                value={formData.businessAddressZipCode}
                onChange={handleChange}
                className="input_box text-[#999] text-[16px]"
                placeholder="Zip Code"
              />
            </div>

            <div className="mb-3 input_box flex relative">
              <div className="py-[10px] w-16 text-sm text-[#111] flex items-center justify-center border-r border-gray-200">
                +1
              </div>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full h-full focus:outline-none text-[#999] text-[16px] flex-5"
                placeholder="Phone Number *"
                required
              />
            </div>

            <div className="mb-3">
              <input
                type="text"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="input_box text-[#999] text-[16px]"
                placeholder="Website"
              />
            </div>

            <div className="mb-4 flex flex-col gap-2">
              <label className="text-[#2D3748] text-sm font-semibold">
                Business Service Days
              </label>
              <div className="flex items-center justify-between gap-[10px]">
                <div className="input_box relative flex-2 text-black text-[16px]">
                  <IoIosArrowDown className="absolute right-4" />
                  <select
                    name="businessServiceStart"
                    value={formData.businessServiceStart}
                    onChange={handleChange}
                    className="py-[10px] w-full focus:outline-none flex-1 text-sm"
                  >
                    <option value="mon">Mon</option>
                    <option value="tue">Tue</option>
                    <option value="wed">Wed</option>
                    <option value="thu">Thu</option>
                    <option value="fri">Fri</option>
                    <option value="sat">Sat</option>
                    <option value="sun">Sun</option>
                  </select>
                </div>
                <div className="input_box flex-1 flex justify-center items-center">
                  to
                </div>
                <div className="input_box relative flex-2">
                  <IoIosArrowDown className="absolute right-4" />
                  <select
                    name="businessServiceEnd"
                    value={formData.businessServiceEnd}
                    onChange={handleChange}
                    className="py-[10px] w-full focus:outline-none flex-1 text-sm"
                  >
                    <option value="mon">Mon</option>
                    <option value="tue">Tue</option>
                    <option value="wed">Wed</option>
                    <option value="thu">Thu</option>
                    <option value="fri">Fri</option>
                    <option value="sat">Sat</option>
                    <option value="sun">Sun</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="mb-4 flex flex-col gap-2">
              <label className="text-[#2D3748] text-sm font-semibold">
                Business Hours
              </label>
              <div className="flex items-center justify-between gap-[10px]">
                <div className="input_box relative flex-2 text-black text-[16px]">
                  <IoIosArrowDown className="absolute right-4" />
                  <select
                    name="businessHoursStart"
                    value={formData.businessHoursStart}
                    onChange={handleChange}
                    className="py-[10px] w-full focus:outline-none flex-1 text-sm"
                  >
                    <option value="06:00">6:00 am</option>
                    <option value="07:00">7:00 am</option>
                    <option value="08:00">8:00 am</option>
                    <option value="09:00">9:00 am</option>
                    <option value="10:00">10:00 am</option>
                    <option value="11:00">11:00 am</option>
                    <option value="12:00">12:00 pm</option>
                  </select>
                </div>
                <div className="input_box flex-1 flex justify-center items-center">
                  to
                </div>
                <div className="input_box relative flex-2">
                  <IoIosArrowDown className="absolute right-4" />
                  <select
                    name="businessHoursEnd"
                    value={formData.businessHoursEnd}
                    onChange={handleChange}
                    className="py-[10px] w-full focus:outline-none flex-1 text-sm"
                  >
                    <option value="13:00">1:00 pm</option>
                    <option value="14:00">2:00 pm</option>
                    <option value="15:00">3:00 pm</option>
                    <option value="16:00">4:00 pm</option>
                    <option value="17:00">5:00 pm</option>
                    <option value="18:00">6:00 pm</option>
                    <option value="19:00">7:00 pm</option>
                    <option value="20:00">8:00 pm</option>
                    <option value="21:00">9:00 pm</option>
                    <option value="22:00">10:00 pm</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="mb-3 relative">
              <IoIosArrowDown className="absolute right-4 top-12 pointer-events-none" />
              <label className="text-[#2D3748] text-sm font-semibold">
                Services Provided
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <select
                  value={serviceSelection.name}
                  onChange={(e) =>
                    setServiceSelection({
                      ...serviceSelection,
                      name: e.target.value,
                    })
                  }
                  className="input_box text-[#111] text-[16px] bg-white"
                >
                  <option value="">
                    {servicesLoading
                      ? "Loading services..."
                      : "Select a service"}
                  </option>
                  {serviceOptions.map((svc) => (
                    <option key={svc._id || svc.name} value={svc.name}>
                      {svc.name}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  min="0"
                  step="1"
                  placeholder="Hourly rate ($)"
                  value={serviceSelection.rate}
                  onChange={(e) =>
                    setServiceSelection({
                      ...serviceSelection,
                      rate: e.target.value,
                    })
                  }
                  className="input_box text-[16px]"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  if (!serviceSelection.name || !serviceSelection.rate) return;
                  setSelectedServicesWithRates((prev) => {
                    const filtered = prev.filter(
                      (s) => s.name !== serviceSelection.name
                    );
                    return [
                      ...filtered,
                      {
                        name: serviceSelection.name,
                        rate: Number(serviceSelection.rate),
                      },
                    ];
                  });
                  setServiceSelection({ name: "", rate: "" });
                }}
                className="px-4 py-2 mt-3 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors disabled:opacity-60"
                disabled={servicesLoading}
              >
                Add Service
              </button>

              {selectedServicesWithRates.length > 0 && (
                <div className="space-y-2">
                  <div className="text-sm font-semibold text-gray-700">
                    Selected Services
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedServicesWithRates.map((svc) => (
                      <span
                        key={svc.name}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm bg-teal-50 text-teal-800 border border-teal-200"
                      >
                        <span className="font-medium">{svc.name}</span>
                        <span className="text-xs text-gray-600">
                          ${svc.rate}/hr
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedServicesWithRates((prev) =>
                              prev.filter((item) => item.name !== svc.name)
                            )
                          }
                          className="text-teal-700 hover:text-teal-900"
                          aria-label={`Remove ${svc.name}`}
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="next_button w-full mt-[32px] text-[16px] font-semibold text-white cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
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
                  <span>Registering...</span>
                </>
              ) : (
                <>
                  <span>Continue</span>
                  <svg
                    width="20"
                    height="20"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
