"use client";

import React, { useState, useEffect } from "react";
import {
  useGetUserProfileQuery,
  useUpdateProviderProfileMutation,
} from "@/redux/api/servicesApi";

const Account = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileFile, setProfileFile] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [accountData, setAccountData] = useState({
    firstName: "Jacob",
    lastName: "Meikle",
    role: "Owner",
    email: "email@outlook.com",
    phone: "+1 012 345 6987",
    address: "123 Oak Street Springfield, IL 62704",
    businessDaysFrom: "Mon",
    businessDaysTo: "Fri",
    businessHoursFrom: "09:00 AM",
    businessHoursTo: "06:00PM",
    joinedDate: "",
  });

  const [formData, setFormData] = useState({ ...accountData });
  const { data, isLoading, isError, error, refetch } = useGetUserProfileQuery();
  const [updateProfile, { isLoading: isSaving }] =
    useUpdateProviderProfileMutation();
  const user = data?.user;

  // Map API data into local state once loaded
  useEffect(() => {
    const user = data?.user;
    if (!user) return;

    const address = user.businessAddress
      ? [
          user.businessAddress.street,
          user.businessAddress.city,
          user.businessAddress.state,
          user.businessAddress.zipCode,
        ]
          .filter(Boolean)
          .join(", ")
      : "";

    const businessDaysFrom = user.businessServiceDays?.start
      ? user.businessServiceDays.start.charAt(0).toUpperCase() +
        user.businessServiceDays.start.slice(1, 3)
      : "Mon";
    const businessDaysTo = user.businessServiceDays?.end
      ? user.businessServiceDays.end.charAt(0).toUpperCase() +
        user.businessServiceDays.end.slice(1, 3)
      : "Fri";

    const businessHoursFrom = user.businessHours?.start || "09:00 AM";
    const businessHoursTo = user.businessHours?.end || "06:00PM";
    const joinedDate = user.createdAt
      ? new Date(user.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "";

    const mapped = {
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      role: user.providerRole || "Owner",
      email: user.email || "",
      phone: user.phone || "",
      address,
      businessDaysFrom,
      businessDaysTo,
      businessHoursFrom,
      businessHoursTo,
      joinedDate,
    };
    setAccountData(mapped);
    setFormData(mapped);
  }, [data]);

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const period = hour >= 12 ? "pm" : "am";
        const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
        const displayMinute = minute.toString().padStart(2, "0");
        times.push(`${displayHour}:${displayMinute} ${period}`);
      }
    }
    return times;
  };

  const timeOptions = generateTimeOptions();

  const handleEdit = () => {
    setFormData({ ...accountData });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData({ ...accountData });
    setIsEditing(false);
  };

  const handleSave = () => {
    const payload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
      businessNameRegistered:
        formData.businessNameRegistered || user?.businessNameRegistered,
      description: formData.description || user?.description,
      experience: formData.experience || user?.experience,
      maxBundleCapacity: formData.maxBundleCapacity || user?.maxBundleCapacity,
      businessServiceDays: {
        start: (formData.businessDaysFrom || "").toLowerCase(),
        end: (formData.businessDaysTo || "").toLowerCase(),
      },
      businessHours: {
        start: formData.businessHoursFrom,
        end: formData.businessHoursTo,
      },
      profileImage: profileFile || undefined,
      businessLogo: logoFile || undefined,
    };

    updateProfile(payload)
      .unwrap()
      .then(() => {
        setAccountData({ ...formData });
        setIsEditing(false);
      })
      .catch((err) => {
        console.error("Failed to update profile:", err);
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (isLoading) {
    return (
      <div className="flex-1 p-8">
        <p className="text-gray-600">Loading profile...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex-1 p-8">
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center justify-between">
          <span>{error?.data?.message || "Failed to load profile."}</span>
          <button
            onClick={() => refetch()}
            className="px-3 py-1 rounded-md bg-white border border-red-200 text-red-700 hover:bg-red-100 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!isEditing) {
    return (
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Account</h1>
          <button
            onClick={handleEdit}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Edit
          </button>
        </div>

        <div className="flex items-start gap-8">
          {/* Profile Picture */}
          <div className="flex-shrink-0">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-teal-600 flex items-center justify-center">
              {data?.user?.profileImage?.url ||
              data?.user?.businessLogo?.url ? (
                <img
                  src={
                    data.user.profileImage?.url || data.user.businessLogo?.url
                  }
                  alt={accountData.firstName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <svg
                  className="w-12 h-12 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
          </div>

          {/* Account Details */}
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-3">
              <svg
                className="w-5 h-5 text-gray-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-gray-900 font-medium">
                {accountData.firstName} {accountData.lastName}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <svg
                className="w-5 h-5 text-gray-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-gray-700">{accountData.role}</span>
            </div>

            <div className="flex items-center gap-3">
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <span className="text-gray-700">{accountData.email}</span>
            </div>

            <div className="flex items-center gap-3">
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              <span className="text-gray-700">{accountData.phone}</span>
            </div>

            <div className="flex items-center gap-3">
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span className="text-gray-700">{accountData.address}</span>
            </div>

            <div className="flex items-center gap-3">
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className="text-gray-700">
                {accountData.businessDaysFrom} - {accountData.businessDaysTo}{" "}
                &nbsp;&nbsp;
                {accountData.businessHoursFrom} - {accountData.businessHoursTo}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className="text-gray-700">
                Joined: {accountData.joinedDate || "—"}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Update Account</h1>
      </div>

      <div className="flex gap-8">
        {/* Profile Picture Section */}
        <div className="flex-shrink-0">
          <div className="w-24 h-24 rounded-full bg-teal-600 flex items-center justify-center mb-3 overflow-hidden">
            {profileFile ? (
              <img
                src={URL.createObjectURL(profileFile)}
                alt={formData.firstName}
                className="w-full h-full object-cover rounded-full"
              />
            ) : data?.user?.profileImage?.url ||
              data?.user?.businessLogo?.url ? (
              <img
                src={data.user.profileImage?.url || data.user.businessLogo?.url}
                alt={formData.firstName}
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <svg
                className="w-12 h-12 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
          <input
            id="profileImageInput"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => setProfileFile(e.target.files?.[0] || null)}
          />
          <button
            className="text-sm text-teal-600 hover:text-teal-700"
            onClick={() =>
              document.getElementById("profileImageInput")?.click()
            }
          >
            Upload a new photo
          </button>
          <div className="mt-4">
            <input
              id="businessLogoInput"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
            />
            <button
              className="text-sm text-teal-600 hover:text-teal-700"
              onClick={() =>
                document.getElementById("businessLogoInput")?.click()
              }
            >
              Upload/update logo
            </button>
            {logoFile && (
              <p className="text-xs text-gray-500 mt-1 w-48 truncate">
                Selected: {logoFile.name}
              </p>
            )}
          </div>
        </div>

        {/* Form Section */}
        <div className="flex-1 space-y-4 max-w-2xl">
          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Type here"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Type here"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="Type here"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <div className="flex gap-2">
              <select
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                defaultValue="1+"
              >
                <option>1+</option>
                <option>44+</option>
                <option>91+</option>
              </select>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="(239) 555-0108"
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="Type here"
            />
          </div>

          {/* Business Service Days */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Business Service Days
            </label>
            <div className="flex items-center gap-3">
              <select
                name="businessDaysFrom"
                value={formData.businessDaysFrom}
                onChange={handleInputChange}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                {daysOfWeek.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
              <span className="text-gray-500">to</span>
              <select
                name="businessDaysTo"
                value={formData.businessDaysTo}
                onChange={handleInputChange}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                {daysOfWeek.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Business Hours */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Business Hours
            </label>
            <div className="flex items-center gap-3">
              <select
                name="businessHoursFrom"
                value={formData.businessHoursFrom}
                onChange={handleInputChange}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                {timeOptions.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
              <span className="text-gray-500">to</span>
              <select
                name="businessHoursTo"
                value={formData.businessHoursTo}
                onChange={handleInputChange}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                {timeOptions.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleCancel}
              className="px-6 py-2 border border-teal-600 text-teal-600 rounded-md hover:bg-teal-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors disabled:opacity-60"
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
