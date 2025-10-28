"use client";
import { useRouter } from "next/navigation";

export default function ConfirmInfo() {
  const router = useRouter();
  const handleConfirm = () => {
    router.push("/provider/signup/payout_info");
  };
  const handleBack = () => {
    router.back();
  };
  return (
    <div className="user_info_layout">
      <div className="confirm_info_layout flex  justify-center items-center">
        <div className="lg:w-[353px] w-full">
          <div className="user_info_heading flex items-center gap-[98px] pb-5">
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
            <span>Overview</span>
          </div>
          <div className="flex flex-col justify-center items-center">
            <h1 className="text-[28px] text-black pb-[28px]">
              Confirm your info
            </h1>
            <p className="text-[14px]">
              Make sure your personal information is correct. For legal
              purposes, you will be unable to edit your legal name once it's
              submitted.
            </p>
            {/* this is for all confirm info in this page */}
            <div className="w-full px-[9px] flex flex-col gap-[28px] pt-6">
              <div className="flex flex-col gap-2">
                <h2 className="confirm_info_heading">LEGAL FULL NAME:</h2>
                <p className="confirm_info_text">John Doe</p>
              </div>
              <div className="flex flex-col gap-2">
                <h2 className="confirm_info_heading">Your Role:</h2>
                <p className="confirm_info_text">Owner</p>
              </div>
              <div className="flex flex-col gap-2">
                <h2 className="confirm_info_heading">Business ADDRESS:</h2>
                <p className="confirm_info_text">
                  17 W 47th St, b4 New York, NY 10036
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <h2 className="confirm_info_heading">Phone Number:</h2>
                <p className="confirm_info_text">239-555-0108</p>
              </div>
              <div className="flex flex-col gap-2">
                <h2 className="confirm_info_heading">
                  Business is registered in:
                </h2>
                <p className="confirm_info_text">USA state</p>
              </div>
              <div className="flex flex-col gap-2">
                <h2 className="confirm_info_heading">
                  Business Service day & hours:
                </h2>
                <p className="confirm_info_text">
                  Mon - Fir (9:00am to 5:00pm)
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <h2 className="confirm_info_heading">EIN Number:</h2>
                <p className="confirm_info_text">855-46-3109</p>
              </div>
              <div className="flex flex-col gap-2">
                <h2 className="confirm_info_heading">
                  Business is registered in:
                </h2>
                <p className="confirm_info_text">USA state</p>
              </div>
              <div className="flex flex-col gap-2 w-full">
                <h2 className="confirm_info_heading">Services Provided:</h2>
                <div className="flex flex-col gap-[10px]">
                  <p>
                    <p className="home_status inline-flex items-center">
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
                      <span>Home Repairs & Maintenance</span>
                    </p>
                  </p>
                  <div>
                    <div>
                      <p className="home_status2 inline-flex items-center">
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
                              fill="#F1C400"
                            />
                          </svg>
                        </span>
                        <span>Cleaning & Organization</span>
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="home_status3 inline-flex items-center">
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
                            fill="#F34F4F"
                          />
                        </svg>
                      </span>
                      <span>Renovations & Upgrades</span>
                    </p>
                  </div>
                </div>
                <p className="text-sm">
                  Once you confirm, you will be taken to a secure identity
                  check. This will only take a few minutes
                </p>
              </div>
              <div className="flex justify-between items-center gap-[10px] text-[16px] font-medium text-[#333]">
                <button className="edit_button w-full cursor-pointer">
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
