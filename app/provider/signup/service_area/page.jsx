"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { RiSearch2Line } from "react-icons/ri";
import { useUpdateProviderZipCodeMutation } from '@/redux/api/servicesApi';
import { toast } from 'react-hot-toast';
import dynamic from "next/dynamic";

// Dynamically import the map component to avoid SSR issues
const ZipCodeMap = dynamic(() => import("@/components/Global/ZipCodeMap"), {
  ssr: false,
  loading: () => (
    <div className="bg-gray-100 rounded-lg h-[300px] flex items-center justify-center">
      <div className="text-gray-500">Loading map...</div>
    </div>
  ),
});

const ServiceArea = () => {
  // this is for navigate
  const router = useRouter();
  const [updateProviderZipCode, { isLoading }] = useUpdateProviderZipCodeMutation();
  const [zipCodes, setZipCodes] = useState([]);

  // useForm setup
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const handleBack = () => {
    router.back();
  };

  const handleAddZipCode = (e) => {
    const zipCode = watch("zipCode");
    if (zipCode && zipCode.trim() !== "") {
      setZipCodes((prev) => [...prev, zipCode.trim()]);
      setValue("zipCode", ""); // Clear input after adding
    }
  };

  const handleRemoveZipCode = (index) => {
    setZipCodes((prev) => prev.filter((_, i) => i !== index));
  };

  // this is for onsubmit function
  const onSubmit = async (data) => {
    try {
      // The API expects { zipCode: "12345" }
      // If you need to send the current zip code
      const zipCode = data.zipCode || zipCodes[zipCodes.length - 1];

      if (!zipCode) {
        toast.error('Please enter a zip code');
        return;
      }

      await updateProviderZipCode({ zipCode }).unwrap();

      toast.success('Service area updated successfully!');
      router.push("/provider/signup/confirm_info");
    } catch (error) {
      console.error('Zip code update error:', error);
      toast.error(error?.data?.message || error?.message || 'Failed to update service area. Please try again.');
    }
  };
  return (
    <div className="verify_info_layout md:px-[126px] md:py-[80px] max-sm:my-6 max-sm:mx-6">
      <div className="verify_info_form md:px-[126px] md:py-[80px]">
        <div className="lg:w-[526px] w-full">
          <h2 className="user_info_heading flex items-center lg:gap-[145px] pb-5 w-full">
            <span onClick={handleBack} className="cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M9.07 6L3 12.07L9.07 18.14M20.0019 12.0703H3.17188"
                  stroke="#111111"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="whitespace-nowrap">Your Information</span>
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="w-full">
            {/* this is for zip code  */}
            <div className="flex flex-col gap-4 pb-3 w-full">
              <div>
                <label className="text-[#1C5941] text-base font-bold flex items-center gap-2 mb-3">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  Service Area Zip Codes *
                </label>
                <div className="bg-blue-50 border-l-4 border-blue-400 p-3 mb-4">
                  <p className="text-blue-700 text-sm flex items-start gap-2">
                    <svg className="w-5 h-5 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <span>Enter the zip codes where you provide services. You can add multiple locations.</span>
                  </p>
                </div>
                <div className="relative">
                  <RiSearch2Line className="absolute left-4 top-4 text-gray-400 text-xl" />
                  <input
                    className="input_box text-[16px] w-full pl-12 pr-4 focus:border-[#1C5941] transition-colors text-[#333]"
                    type="text"
                    placeholder="Enter zip code (e.g., 10001)"
                    maxLength="5"
                    {...register("zipCode", {
                      required: zipCodes.length === 0,
                      pattern: /^\d{5}$/
                    })}
                  />
                  <button
                    type="button"
                    onClick={handleAddZipCode}
                    className="absolute right-2 top-2 bg-[#1C5941] text-white px-4 py-2 rounded-md hover:bg-[#154432] transition-colors text-sm font-medium"
                  >
                    Add
                  </button>
                </div>
                {errors.zipCode && (
                  <div className="flex items-center gap-1 text-red-500 text-xs mt-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span>Please enter a valid 5-digit zip code</span>
                  </div>
                )}
              </div>

              {zipCodes.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {zipCodes.map((zip, index) => (
                    <div
                      key={index}
                      className="zip_code bg-green-100 border border-green-300 px-3 py-2 rounded-lg flex items-center gap-2 group hover:bg-green-200 transition-colors"
                    >
                      <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      <span className="font-medium text-green-800">{zip}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveZipCode(index)}
                        className="ml-1 text-red-500 hover:text-red-700 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-6 mb-[29px]">
                <ZipCodeMap
                  zipCode={watch("zipCode")}
                  zipCodes={zipCodes}
                  height="300px"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="next_button w-full mt-8 text-[16px] font-semibold text-white cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Saving Service Area...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Complete Registration</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ServiceArea;
