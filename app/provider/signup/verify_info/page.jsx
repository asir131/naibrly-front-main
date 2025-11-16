"use client";
import { Images } from "@/public/usersImg/ExportImg";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useRef } from "react";
import { useForm } from "react-hook-form";
import { useSubmitVerifyInformationMutation } from '@/redux/api/servicesApi';
import { toast } from 'react-hot-toast';

const VerifyInfo = () => {
  // this is for navigate
  const router = useRouter();
  const [submitVerifyInformation, { isLoading }] = useSubmitVerifyInformationMutation();

  // useForm setup
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();
  const watchedFile = watch("insuranceFile");
  const fileInputRef = useRef(null);
  const idFrontRef = useRef(null);
  const idBackRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setValue("insuranceFile", file, { shouldValidate: true });
    }
  };

  const handleIdFrontClick = (e) => {
    e.preventDefault();
    idFrontRef.current?.click();
  };

  const handleIdBackClick = (e) => {
    e.preventDefault();
    idBackRef.current?.click();
  };

  const handleIdFrontChange = (e) => {
    const file = e.target.files && e.target.files[0];
    setValue("idFront", file, { shouldValidate: true });
  };

  const handleIdBackChange = (e) => {
    const file = e.target.files && e.target.files[0];
    setValue("idBack", file, { shouldValidate: true });
  };

  const onSubmit = async (data) => {
    try {
      // Validate required fields
      if (!data.insuranceFile) {
        toast.error('Insurance document is required');
        return;
      }

      // Create FormData for file upload - matching backend expectations exactly
      const submitData = new FormData();

      // Required fields from Postman: einNumber, firstName, lastName, insuranceDocument
      submitData.append('einNumber', data.einNumber.trim());
      submitData.append('firstName', data.ownerFirstName.trim());
      submitData.append('lastName', data.ownerLastName.trim());

      // Insurance document file (REQUIRED)
      submitData.append('insuranceDocument', data.insuranceFile);

      // Optional: ID front and back (for future development)
      // Keep these for now but they're not in the current backend schema
      if (data.idFront) {
        submitData.append('idFront', data.idFront);
      }

      if (data.idBack) {
        submitData.append('idBack', data.idBack);
      }

      // Log what we're sending
      console.log('Submitting verify information:');
      for (let pair of submitData.entries()) {
        console.log(pair[0] + ':', pair[1]);
      }

      await submitVerifyInformation(submitData).unwrap();

      toast.success('Verification information submitted successfully!');
      router.push("/provider/signup/service_area");
    } catch (error) {
      console.error('Verification submission error:', error);

      // Enhanced error logging
      if (error?.data) {
        console.error('Backend error details:', error.data);
        if (error.data.errors) {
          console.error('Validation errors:', error.data.errors);
        }
      }

      let errorMessage = 'Failed to submit verification information. Please try again.';

      if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error?.data?.errors && Array.isArray(error.data.errors)) {
        if (error.data.errors.length > 0) {
          errorMessage = error.data.errors[0].msg || error.data.errors[0].message || errorMessage;
        }
      } else if (error?.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    }
  };

  return (
    <div className="verify_info_layout max-sm:my-6 max-sm:mx-6 md:px-[126px] md:py-[80px]">
      <form onSubmit={handleSubmit(onSubmit)} className="verify_info_form max-sm:w-full  md:px-[200px] md:py-[100px]">
        <div className="flex flex-col items-start w-full md:w-[353px]">
          <h2 className="user_info_heading flex items-center gap-[18px] pb-5">
            <span>
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
            <span>Verify Your Information</span>
          </h2>
          <div className="w-full">
            <div className="flex flex-col gap-2 pb-4">
              <label className="text-[#1C5941] text-sm font-bold flex items-center gap-1">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                </svg>
                EIN Number *
              </label>
              <input
                className="input_box text-[16px] w-full focus:border-[#1C5941] transition-colors text-[#333]"
                type="text"
                placeholder="12-3456789"
                maxLength="10"
                {...register("einNumber", { required: true, pattern: /^\d{2}-?\d{7}$/ })}
              />
              {errors.einNumber && (
                <div className="flex items-center gap-1 text-red-500 text-xs mt-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span>Valid EIN required (9 digits)</span>
                </div>
              )}
              <div className="bg-blue-50 border-l-4 border-blue-400 p-3 mt-2">
                <p className="text-blue-700 text-xs flex items-start gap-2">
                  <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <span>An Employer Identification Number (EIN) is a federal tax ID for businesses</span>
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2 mb-4">
              <label className="text-[#1C5941] text-sm font-bold flex items-center gap-1">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
                Insurance Document *
              </label>
              <div
                className="upload_verify cursor-pointer border-2 border-dashed rounded-lg p-6 hover:border-[#1C5941] transition-all duration-200 bg-gray-50 hover:bg-green-50 group relative"
                onClick={handleClick}
              >
                {watchedFile && watchedFile.name ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="p-3 bg-green-100 rounded-full">
                      <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-green-700">{watchedFile.name}</p>
                      <p className="text-xs text-gray-500 mt-1">Click to replace</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <div className="p-4 bg-gray-100 rounded-full group-hover:bg-green-100 transition-colors">
                      <svg className="w-8 h-8 text-gray-400 group-hover:text-[#1C5941]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-gray-700 mb-1">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">
                        JPG, PNG, PDF (Max 10MB)
                      </p>
                    </div>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
              {errors.insuranceFile && (
                <div className="flex items-center gap-1 text-red-500 text-xs mt-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span>Insurance document is required</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 pb-5">
              <input
                className="verify_checkbox"
                type="checkbox"
                {...register("isDifferentOwner", { required: true })}
              />
              {errors.isDifferentOwner && (
                <span className="text-red-500 text-[10px]">
                  This field is required
                </span>
              )}
              <p className="text-[11px] text-black">
                Information of the Registered Owner/Operator is different than
                you
              </p>
            </div>

            <div className="nid_upload">
              <div className="relative w-full">
                <label className="text-[#1C5941] text-[10px] font-medium absolute left-4 -top-[6px] bg-white">
                  Owner Operator: First Name
                </label>
                <input
                  type="text"
                  className="input_box text-[#000] text-[16px] w-full"
                  placeholder="Mina"
                  {...register("ownerFirstName", { required: true })}
                />
                {errors.ownerFirstName && (
                  <span className="text-red-500 text-[10px]">
                    This field is required
                  </span>
                )}
              </div>
              <div className="relative w-full">
                <label className="text-[#1C5941] text-[10px] font-medium absolute left-4 -top-[6px] bg-white">
                  Owner Operator: Last Name
                </label>
                <input
                  type="text"
                  className="input_box text-[#000] text-[16px] w-full"
                  placeholder="Leo"
                  {...register("ownerLastName", { required: true })}
                />
                {errors.ownerLastName && (
                  <span className="text-red-500 text-[10px]">
                    This field is required
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-4 w-full">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                  <svg className="w-6 h-6 text-[#1C5941]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  <h1 className="text-base text-[#1C5941] font-bold">
                    Owner Operator ID Verification *
                  </h1>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">
                      ID Front Side
                    </label>
                    <div
                      className="cursor-pointer border-2 border-dashed rounded-lg p-4 hover:border-[#1C5941] transition-all duration-200 bg-gray-50 hover:bg-green-50 group relative overflow-hidden"
                      onClick={handleIdFrontClick}
                    >
                      {watch("idFront") ? (
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-green-100 rounded">
                            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-green-700">{watch("idFront")?.name}</p>
                            <p className="text-xs text-gray-500">Click to replace</p>
                          </div>
                        </div>
                      ) : (
                        <div className="relative">
                          <Image className="w-full opacity-70 group-hover:opacity-100 transition-opacity" src={Images.owner_id_check} alt="Upload ID front" />
                          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all">
                            <div className="bg-white rounded-full p-3 shadow-lg transform scale-0 group-hover:scale-100 transition-transform">
                              <svg className="w-6 h-6 text-[#1C5941]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      )}
                      <input
                        ref={idFrontRef}
                        type="file"
                        accept="image/*,.pdf"
                        className="hidden"
                        onChange={handleIdFrontChange}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">
                      ID Back Side
                    </label>
                    <div
                      className="cursor-pointer border-2 border-dashed rounded-lg p-4 hover:border-[#1C5941] transition-all duration-200 bg-gray-50 hover:bg-green-50 group relative overflow-hidden"
                      onClick={handleIdBackClick}
                    >
                      {watch("idBack") ? (
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-green-100 rounded">
                            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-green-700">{watch("idBack")?.name}</p>
                            <p className="text-xs text-gray-500">Click to replace</p>
                          </div>
                        </div>
                      ) : (
                        <div className="relative">
                          <Image className="w-full opacity-70 group-hover:opacity-100 transition-opacity" src={Images.owner_id_check} alt="Upload ID back" />
                          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all">
                            <div className="bg-white rounded-full p-3 shadow-lg transform scale-0 group-hover:scale-100 transition-transform">
                              <svg className="w-6 h-6 text-[#1C5941]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      )}
                      <input
                        ref={idBackRef}
                        type="file"
                        accept="image/*,.pdf"
                        className="hidden"
                        onChange={handleIdBackChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
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
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <span>Continue to Service Area</span>
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default VerifyInfo;
