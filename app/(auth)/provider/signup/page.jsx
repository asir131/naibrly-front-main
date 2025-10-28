"use client";

import { useState } from "react";
import { Eye, EyeOff, Upload, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

export default function ProviderSignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    businessName: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    countryCode: "+1",
    businessAddress: "",
    city: "",
    state: "",
    zipCode: "",
    serviceCategory: "",
    agreeToTerms: false,
    profileImage: null,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, profileImage: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Provider signup:", formData);
    // Navigate to provider dashboard or information page
    // router.push("/provider/signup/user_info");
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Create Provider Account
          </h1>
          <p className="text-slate-500 text-sm">
            Join Naibrly and grow your business
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Profile Image Upload */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-teal-100 flex items-center justify-center overflow-hidden border-2 border-teal-200">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-10 h-10 text-teal-600" />
                )}
              </div>
            </div>
            <label
              htmlFor="profileImage"
              className="mt-3 text-sm text-teal-600 hover:text-teal-700 cursor-pointer flex items-center gap-1"
            >
              <Upload className="w-4 h-4" />
              upload Image
            </label>
            <input
              id="profileImage"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          {/* Business Name */}
          <div>
            <label className="text-xs font-medium text-teal-700 block mb-2">
              Business Name
            </label>
            <Input
              type="text"
              name="businessName"
              placeholder="ABC Services LLC"
              value={formData.businessName}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-slate-50 text-slate-900"
              required
            />
          </div>

          {/* First Name & Last Name */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-teal-700 block mb-2">
                First Name
              </label>
              <Input
                type="text"
                name="firstName"
                placeholder="John"
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-slate-50 text-slate-900"
                required
              />
            </div>
            <div>
              <label className="text-xs font-medium text-teal-700 block mb-2">
                Last Name
              </label>
              <Input
                type="text"
                name="lastName"
                placeholder="Doe"
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-slate-50 text-slate-900"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="text-xs font-medium text-teal-700 block mb-2">
              Email Address
            </label>
            <Input
              type="email"
              name="email"
              placeholder="provider@gmail.com"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-slate-50 text-slate-900"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-xs font-medium text-teal-700 block mb-2">
              Password
            </label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="AbcD@7281"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-slate-50 text-slate-900 pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="text-xs font-medium text-teal-700 block mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-slate-50 text-slate-900 pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label className="text-xs font-medium text-teal-700 block mb-2">
              Phone Number
            </label>
            <div className="flex gap-2">
              <select
                name="countryCode"
                value={formData.countryCode}
                onChange={handleInputChange}
                className="w-24 px-3 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-slate-50 text-slate-900"
              >
                <option value="+1">+1</option>
                <option value="+44">+44</option>
                <option value="+91">+91</option>
              </select>
              <Input
                type="tel"
                name="phoneNumber"
                placeholder="(239) 555-0108"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="flex-1 px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-slate-50 text-slate-900"
                required
              />
            </div>
          </div>

          {/* Service Category */}
          <div>
            <label className="text-xs font-medium text-teal-700 block mb-2">
              Service Category
            </label>
            <select
              name="serviceCategory"
              value={formData.serviceCategory}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-slate-50 text-slate-900"
              required
            >
              <option value="">Select category</option>
              <option value="plumbing">Plumbing</option>
              <option value="electrical">Electrical</option>
              <option value="cleaning">Cleaning</option>
              <option value="hvac">HVAC</option>
              <option value="landscaping">Landscaping</option>
              <option value="repairs">Home Repairs</option>
              <option value="renovations">Renovations</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Business Address */}
          <div>
            <label className="text-xs font-medium text-teal-700 block mb-2">
              Business Address
            </label>
            <Input
              type="text"
              name="businessAddress"
              placeholder="Street Address"
              value={formData.businessAddress}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-slate-50 text-slate-900"
              required
            />
          </div>

          {/* City, State, Zip */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-medium text-teal-700 block mb-2">
                City
              </label>
              <Input
                type="text"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-slate-50 text-slate-900"
                required
              />
            </div>
            <div>
              <label className="text-xs font-medium text-teal-700 block mb-2">
                State
              </label>
              <Input
                type="text"
                name="state"
                placeholder="State"
                value={formData.state}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-slate-50 text-slate-900"
                required
              />
            </div>
            <div>
              <label className="text-xs font-medium text-teal-700 block mb-2">
                Zip Code
              </label>
              <Input
                type="text"
                name="zipCode"
                placeholder="Zip"
                value={formData.zipCode}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-slate-50 text-slate-900"
                required
              />
            </div>
          </div>

          {/* Terms Agreement */}
          <div className="flex items-start gap-3 pt-2">
            <input
              type="checkbox"
              id="agreeToTerms"
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleInputChange}
              className="mt-1 w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500 cursor-pointer"
              required
            />
            <label
              htmlFor="agreeToTerms"
              className="text-sm text-slate-600 cursor-pointer"
            >
              I agree to the{" "}
              <a
                href="/terms-of-use"
                className="text-teal-600 hover:text-teal-700 underline"
              >
                Terms of Service
              </a>
              {" & "}
              <a
                href="/privacy-policy"
                className="text-teal-600 hover:text-teal-700 underline"
              >
                Privacy Policy
              </a>
            </label>
          </div>

          {/* Sign Up Button */}
          <Button
            type="submit"
            disabled={!formData.agreeToTerms}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg font-medium text-base disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Create Provider Account
          </Button>

          {/* Login Link */}
          <p className="text-center text-slate-600 text-sm">
            Already have an account?{" "}
            <a
              href="/provider/login"
              className="text-teal-600 hover:text-teal-700 font-medium"
            >
              Login
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
