"use client";
import { Images } from "@/public/usersImg/ExportImg";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { RiSearch2Line } from "react-icons/ri";

const ServiceArea = () => {
  // this is for navigate
  const router = useRouter();
  // useForm setup
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();
  // this is for onsubmit function
  const onSubmit = async (data) => {
    console.log(data);
    router.push("/provider/signup/confirm_info");
    // (optional) formData upload example here
  };
  const handleBack = () => {
    router.back();
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
            <div className="flex flex-col gap-2 pb-3 w-full">
              <label className="text-black text-sm font-semibold">
                zip codes
              </label>
              <div className="relative">
                <RiSearch2Line className="absolute right-4 top-4" />
                <input
                  className="input_box text-[16px] w-full"
                  type="number"
                  placeholder="Enter your 9-digit EIN (e.g., 12-3456789)"
                  {...register("zipCode", { required: true })}
                />
                {errors.zipCode && (
                  <span className="text-red-500 text-[10px]">
                    This field is required
                  </span>
                )}
              </div>
              <div className="flex gap-[10px]">
                <p className="zip_code">
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
                        fill="#0E7A60"
                      />
                    </svg>
                  </span>
                  <span>156256</span>
                </p>
                <p className="zip_code">
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
                        fill="#0E7A60"
                      />
                    </svg>
                  </span>
                  <span>324234</span>
                </p>
              </div>
              <div className="mt-6 mb-[29px]">
                <Image src={Images.map_img} />
              </div>
              <button
                type="submit"
                className="next_button w-full mt-[32px] text-[16px] font-medium text-white cursor-pointer"
              >
                Confirm
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ServiceArea;
