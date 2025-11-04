"use client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { IoIosArrowDown } from "react-icons/io";

export default function PayoutInfo() {
  // this is for navigate
  const router = useRouter();
  // this is for handle back
  const handleBack = () => {
    router.back();
  };
  // useForm setup
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();
  const onSubmit = async (data) => {
    console.log(data);
    router.push("/provider/signup/analytics");
    // (optional) formData upload example here
  };
  return (
    <div className="user_info_layout md:px-[126px] md:py-[80px] max-sm:my-6 max-sm:mx-6">
      <div className="confirm_info_layout md:px-[200px] md:py-[100px] flex  justify-center items-center">
        <form onSubmit={handleSubmit(onSubmit)} className="lg:w-[353px] w-full">
          <div className="user_info_heading flex items-center gap-[98px] pb-5">
            <span className="cursor-pointer" onClick={handleBack}>
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
            <span>Payout Information</span>
          </div>
          <div className="flex flex-col justify-center items-center">
            <h1 className="text-[20px] font-bold text-[#1F2937] pb-[8px]">
              Please enter payout information
            </h1>
            <p className="text-[14px] text-[#6B7280] text-center">
              Complete your business account setup to receive payments
            </p>
            {/* this is for all confirm info in this page */}
            <div className="w-full px-[9px] flex flex-col gap-[18px] pt-6">
              <div className="flex flex-col gap-2 pb-3">
                <label className="text-black text-sm font-semibold">
                  Account Holder Name
                </label>
                <input
                  className="input_box text-[16px] w-full"
                  type="number"
                  placeholder="Jacob Meikle"
                  {...register("account_holder_name", { required: true })}
                />
                {errors.account_holder_name && (
                  <span className="text-red-500 text-[10px]">
                    This field is required
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-2 pb-3">
                <label className="text-black text-sm font-semibold">
                  Bank Name
                </label>
                <div className="mb-3 relative">
                  <IoIosArrowDown className="absolute right-4 top-4" />
                  <select
                    placeholder="Choose your bank"
                    defaultValue={"Choose your bank"}
                    name="role"
                    className="input_box text-[#999] text-[16px]"
                    {...register("bank_name", { required: true })}
                  >
                    <option value="dashbangla_bank">Dash Bangla Bank</option>
                    <option value="Islamic_bank">Islamic Bank</option>
                    <option value="american_bank">American Bank</option>
                    <option value="international_bank">
                      International Bank
                    </option>
                  </select>
                </div>
                {errors.bank_name && (
                  <span className="text-red-500 text-[10px]">
                    This field is required
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-2 pb-3">
                <label className="text-black text-sm font-semibold">
                  Enter Your Bank Account Number
                </label>
                <input
                  className="input_box text-[16px] w-full"
                  type="number"
                  placeholder="0123456789"
                  {...register("bank_account", { required: true })}
                />
                {errors.bank_account && (
                  <span className="text-red-500 text-[10px]">
                    This field is required
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-2 pb-3">
                <label className="text-black text-sm font-semibold">
                  Routing Number
                </label>
                <input
                  className="input_box text-[16px] w-full"
                  type="number"
                  placeholder="0123456789"
                  {...register("routing_number", { required: true })}
                />
                {errors.routing_number && (
                  <span className="text-red-500 text-[10px]">
                    This field is required
                  </span>
                )}
              </div>
              <div className="secure_info flex">
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    viewBox="0 0 22 22"
                    fill="none"
                  >
                    <path
                      d="M14.777 12.5177C15.3025 12.2591 15.9465 12 16.7483 12C17.5501 12 18.1944 12.2591 18.72 12.5176C18.8984 12.6054 19.0528 12.6863 19.1932 12.7599C19.5034 12.9225 19.745 13.0491 20.0259 13.1342C20.2057 13.1887 20.3933 13.2455 20.5242 13.2942C20.6365 13.336 20.855 13.4205 21.0251 13.6C21.1751 13.7583 21.2459 13.9317 21.2864 14.0662C21.3197 14.1772 21.3478 14.3258 21.3676 14.4302C21.9251 17.3667 20.6972 20.206 17.6845 21.3018C17.4113 21.4013 17.1402 21.5 16.7497 21.5C16.3592 21.5 16.0881 21.4013 15.815 21.3018C12.8023 20.2061 11.573 17.367 12.1304 14.4302C12.1502 14.3258 12.1783 14.1773 12.2116 14.0663C12.2521 13.9318 12.3229 13.7584 12.4729 13.6001C12.6429 13.4206 12.8615 13.3361 12.9737 13.2943C13.1046 13.2456 13.2922 13.1887 13.472 13.1342C13.7527 13.0491 13.9941 12.9226 14.304 12.76C14.4443 12.6864 14.5986 12.6055 14.777 12.5177Z"
                      fill="#0E7A60"
                    />
                    <g opacity="0.4">
                      <path
                        d="M9.75 0C6.8505 0 4.5 2.3505 4.5 5.25C4.5 8.14949 6.8505 10.5 9.75 10.5C12.6495 10.5 15 8.14949 15 5.25C15 2.3505 12.6495 0 9.75 0Z"
                        fill="#0E7A60"
                      />
                      <path
                        d="M12.5313 21.334C12.6142 21.168 12.3916 20.8721 11.9466 20.2803C10.6602 18.5697 10.2436 16.3392 10.6587 14.1513L10.6618 14.1349C10.6794 14.0413 10.7202 13.8243 10.7772 13.6347C10.855 13.3755 11.016 12.9592 11.3859 12.5686C11.4091 12.5441 11.4325 12.5204 11.4562 12.4975C11.5837 12.3737 11.5309 12.1374 11.3549 12.1125C10.2911 11.9625 9.20929 11.9625 8.14543 12.1125C6.68096 12.3191 5.24889 12.8102 3.94404 13.5872C3.82778 13.6564 3.68408 13.7375 3.52151 13.8292C2.80869 14.2313 1.73106 14.8393 0.992896 15.5618C0.531228 16.0137 0.092574 16.6092 0.0128283 17.3388C-0.0719782 18.1146 0.266485 18.8427 0.945503 19.4896C2.11695 20.6056 3.52274 21.5 5.34104 21.5H11.4258C12.1075 21.5 12.4484 21.5 12.5313 21.334Z"
                        fill="#0E7A60"
                      />
                    </g>
                  </svg>
                </span>
                <div>
                  <h2 className="text-[16px] font-medium">
                    Your information is secure
                  </h2>
                  <p className="text-[12px]">
                    We use bank-level encryption and Stripe to protect your
                    payment information
                  </p>
                </div>
              </div>
              <button
                type="submit"
                className="next_button w-full mt-[32px] text-[16px] font-medium text-white cursor-pointer"
              >
                Confirm
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

//
