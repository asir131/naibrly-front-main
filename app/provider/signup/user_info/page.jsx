"use client";
import { useRouter } from "next/navigation";
import { useRef, useState } from 'react';
import { IoIosArrowDown } from "react-icons/io";

export default function UserInfo() {
    // this is for navigate 
    const router = useRouter()
    const [formData, setFormData] = useState({
        businessName: '',
        businessEmail: '',
        role: '',
        businessAddress: '',
        phoneNumber: '',
        website: '',
        serviceDays: 'Mon',
        startTime: '9:00 am',
        endTime: '5:00 pm',
        services: []
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSelectChange = (e) => {
        const { name, value } = e.target;
        if (name === 'services') {
            setFormData((prevState) => ({
                ...prevState,
                services: [...prevState.services, value],
            }));
        } else {
            setFormData((prevState) => ({
                ...prevState,
                [name]: value,
            }));
        }
    };
    const fileInputRef = useRef(null);

    const handleClick = () => {
        fileInputRef.current.click();
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        console.log(data);
        router.push('/provider/signup/verify_info')
    };

    return (
        <div className="user_info_layout">
            <form onSubmit={handleSubmit} className="user_info_input">
                <div className="user_info_heading flex items-center gap-[18px] pb-5">
                    <span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M9.07 6L3 12.07L9.07 18.14M20.0019 12.0703H3.17188" stroke="#111111" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </span>
                    <span>
                        Your Information
                    </span>
                </div>
                <div className='flex items-center justify-center'>
                    <div className='md:w-[353px]'>
                        <h3 className='text-[12px] font-medium text-[#333] text-center pb-5'>We need to collect your personal business information.</h3>
                        <div className="mb-5 flex flex-col gap-2 relative">
                            <div className='absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center gap-2' onClick={handleClick}>
                                <span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="22" viewBox="0 0 20 22" fill="none">
                                        <path d="M10.75 0.75H11.0227C14.2839 0.75 15.9145 0.75 17.0469 1.54784C17.3714 1.77643 17.6594 2.04752 17.9023 2.35289C18.75 3.41867 18.75 4.95336 18.75 8.02273V10.5682C18.75 13.5314 18.75 15.0129 18.2811 16.1962C17.5272 18.0986 15.9329 19.5991 13.9116 20.3086C12.6544 20.75 11.0802 20.75 7.93182 20.75C6.13275 20.75 5.23322 20.75 4.51478 20.4978C3.35979 20.0924 2.44875 19.2349 2.01796 18.1479C1.75 17.4717 1.75 16.6251 1.75 14.9318V10.75" stroke="#666666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M18.75 10.75C18.75 12.5909 17.2576 14.0833 15.4167 14.0833C14.7509 14.0833 13.966 13.9667 13.3186 14.1401C12.7435 14.2942 12.2942 14.7435 12.1401 15.3186C11.9667 15.966 12.0833 16.7509 12.0833 17.4167C12.0833 19.2576 10.5909 20.75 8.75 20.75" stroke="#666666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M8.75 4.75L0.75 4.75M4.75 0.75V8.75" stroke="#666666" strokeWidth="1.5" strokeLinecap="round" />
                                    </svg>
                                </span>
                                <label className="block text-[#000] text-sm ">Upload Your Business Logo</label>
                                <span className='text-[11px] text-[#999]'>
                                    Max 3 MB
                                </span>
                            </div>
                            <div className='upload_business'>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    className="hidden"
                                />
                            </div>
                        </div>

                        <div className="mb-3 relative">
                            <label className="text-[#1C5941] text-[10px] absolute left-4 -top-[6px] bg-white">Business Name (AS REGISTERED)</label>
                            <input
                                type="text"
                                name="businessName"
                                value={formData.businessName}
                                onChange={handleChange}
                                className="input_box text-[#999] text-[16px]"
                                placeholder="Business Name (AS REGISTERED)"
                            />
                        </div>

                        <div className="mb-3 relative">
                            <label className="text-[#1C5941] text-[10px] absolute left-4 -top-[6px] bg-white">Business Name (DBA)</label>
                            <input
                                type="email"
                                name="businessEmail"
                                value={formData.businessEmail}
                                onChange={handleChange}
                                className="input_box text-[#999] text-[16px]"
                                placeholder="Business Name (DBA)"
                            />
                        </div>

                        <div className="mb-3 relative">
                            <IoIosArrowDown className='absolute right-4 top-4' />
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="input_box text-[#999] text-[16px]"
                            >
                                <option value="">Select Role</option>
                                <option value="Owner">Owner</option>
                                <option value="Manager">Manager</option>
                                <option value="Employee">Employee</option>
                            </select>
                        </div>

                        <div className="mb-3">
                            <input
                                type="text"
                                name="businessAddress"
                                value={formData.businessAddress}
                                onChange={handleChange}
                                className="input_box text-[#999] text-[16px]"
                                placeholder="Bussiness Address"
                            />
                        </div>

                        <div className="mb-3 input_box flex relative">
                            <IoIosArrowDown className='absolute left-[55px]' />
                            <select name="country_code " className='py-[10px] w-full focus:outline-none flex-1 text-sm' id="">
                                <option value="+088">+088</option>
                                <option value="+088">+088</option>
                                <option value="+033">+033</option>
                                <option value="+055">+055</option>
                            </select>
                            <input
                                type="tel"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                className="w-full h-full focus:outline-none text-[#999] text-[16px] flex-5"
                                placeholder="Phone Number"
                            />
                        </div>

                        <div className="mb-3">
                            <input
                                type="url"
                                name="website"
                                value={formData.website}
                                onChange={handleChange}
                                className="input_box text-[#999] text-[16px]"
                                placeholder="Website website"
                            />
                        </div>


                        <div className="mb-4 flex flex-col gap-2">
                            <label className="text-[#2D3748] text-sm font-semibold">Business Service Days</label>
                            <div className='flex items-center justify-between gap-[10px]'>
                                <div className='input_box relative flex-2 text-black text-[16px]'>
                                    <IoIosArrowDown className='absolute right-4' />
                                    <select name="country_code " className='py-[10px] w-full focus:outline-none flex-1 text-sm' id="">
                                        <option value="sun">Sun</option>
                                        <option value="Mon">Mon</option>
                                        <option value="Tue">Tue</option>
                                        <option value="Thu">Thu</option>
                                        <option value="Fri">Fri</option>
                                    </select>
                                </div>
                                <div className='input_box flex-1 flex justify-center items-center'>
                                    to
                                </div>
                                <div className='input_box relative flex-2'>
                                    <IoIosArrowDown className='absolute right-4' />
                                    <select name="country_code " className='py-[10px] w-full focus:outline-none flex-1 text-sm' id="">
                                        <option value="sun">Sun</option>
                                        <option value="Mon">Mon</option>
                                        <option value="Tue">Tue</option>
                                        <option value="Thu">Thu</option>
                                        <option value="Fri">Fri</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="mb-4 flex flex-col gap-2">
                            <label className="text-[#2D3748] text-sm font-semibold">Business Hours</label>
                            <div className='flex items-center justify-between gap-[10px]'>
                                <div className='input_box relative flex-2 text-black text-[16px]'>
                                    <IoIosArrowDown className='absolute right-4' />
                                    <select name="country_code " className='py-[10px] w-full focus:outline-none flex-1 text-sm' id="">
                                        <option value="1:00">1:00 am</option>
                                        <option value="2:00">2:00 am</option>
                                        <option value="3:00">1:00 am</option>
                                        <option value="4:00">4:00 am</option>
                                    </select>
                                </div>
                                <div className='input_box flex-1 flex justify-center items-center'>
                                    to
                                </div>
                                <div className='input_box relative flex-2'>
                                    <IoIosArrowDown className='absolute right-4' />
                                    <select name="country_code " className='py-[10px] w-full focus:outline-none flex-1 text-sm' id="">
                                        <option value="1:00">1:00 pm</option>
                                        <option value="2:00">2:00 pm</option>
                                        <option value="3:00">1:00 pm</option>
                                        <option value="4:00">4:00 pm</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="mb-3 relative">
                            <IoIosArrowDown className='absolute right-4 top-12' />
                            <label className="text-[#2D3748] text-sm font-semibold">Services Provided</label>
                            <select
                                name="services"
                                onChange={handleSelectChange}
                                className="input_box text-[#999] text-[16px] mt-2"
                            >
                                <option value="">Select services</option>
                                <option value="Home Repairs & Maintenance">Home Repairs & Maintenance</option>
                                <option value="Cleaning & Organization">Cleaning & Organization</option>
                                <option value="Renovations & Upgrades">Renovations & Upgrades</option>
                            </select>
                        </div>
                        <div className='flex flex-col gap-[10px]'>
                            <p>
                                <p className='home_status inline-flex items-center'>
                                    <span>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                            <path d="M10 7.5C9.50555 7.5 9.0222 7.64662 8.61108 7.92133C8.19995 8.19603 7.87952 8.58648 7.6903 9.04329C7.50108 9.50011 7.45157 10.0028 7.54804 10.4877C7.6445 10.9727 7.8826 11.4181 8.23223 11.7678C8.58187 12.1174 9.02732 12.3555 9.51228 12.452C9.99723 12.5484 10.4999 12.4989 10.9567 12.3097C11.4135 12.1205 11.804 11.8 12.0787 11.3889C12.3534 10.9778 12.5 10.4945 12.5 10C12.5 9.33696 12.2366 8.70107 11.7678 8.23223C11.2989 7.76339 10.663 7.5 10 7.5ZM10 11.25C9.75277 11.25 9.5111 11.1767 9.30554 11.0393C9.09998 10.902 8.93976 10.7068 8.84515 10.4784C8.75054 10.2499 8.72579 9.99861 8.77402 9.75614C8.82225 9.51366 8.9413 9.29093 9.11612 9.11612C9.29093 8.9413 9.51366 8.82225 9.75614 8.77402C9.99861 8.72579 10.2499 8.75054 10.4784 8.84515C10.7068 8.93976 10.902 9.09998 11.0393 9.30554C11.1767 9.5111 11.25 9.75277 11.25 10C11.25 10.3315 11.1183 10.6495 10.8839 10.8839C10.6495 11.1183 10.3315 11.25 10 11.25Z" fill="#F3934F" />
                                        </svg>
                                    </span>
                                    <span>
                                        Home Repairs & Maintenance
                                    </span>
                                </p>
                            </p>
                            <div>
                                <div>
                                    <p className='home_status2 inline-flex items-center'>
                                        <span>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                <path d="M10 7.5C9.50555 7.5 9.0222 7.64662 8.61108 7.92133C8.19995 8.19603 7.87952 8.58648 7.6903 9.04329C7.50108 9.50011 7.45157 10.0028 7.54804 10.4877C7.6445 10.9727 7.8826 11.4181 8.23223 11.7678C8.58187 12.1174 9.02732 12.3555 9.51228 12.452C9.99723 12.5484 10.4999 12.4989 10.9567 12.3097C11.4135 12.1205 11.804 11.8 12.0787 11.3889C12.3534 10.9778 12.5 10.4945 12.5 10C12.5 9.33696 12.2366 8.70107 11.7678 8.23223C11.2989 7.76339 10.663 7.5 10 7.5ZM10 11.25C9.75277 11.25 9.5111 11.1767 9.30554 11.0393C9.09998 10.902 8.93976 10.7068 8.84515 10.4784C8.75054 10.2499 8.72579 9.99861 8.77402 9.75614C8.82225 9.51366 8.9413 9.29093 9.11612 9.11612C9.29093 8.9413 9.51366 8.82225 9.75614 8.77402C9.99861 8.72579 10.2499 8.75054 10.4784 8.84515C10.7068 8.93976 10.902 9.09998 11.0393 9.30554C11.1767 9.5111 11.25 9.75277 11.25 10C11.25 10.3315 11.1183 10.6495 10.8839 10.8839C10.6495 11.1183 10.3315 11.25 10 11.25Z" fill="#F1C400" />
                                            </svg>
                                        </span>
                                        <span>
                                            Cleaning & Organization
                                        </span>
                                    </p>
                                </div>

                            </div>
                            <div>
                                <p className='home_status3 inline-flex items-center'>
                                    <span>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                            <path d="M10 7.5C9.50555 7.5 9.0222 7.64662 8.61108 7.92133C8.19995 8.19603 7.87952 8.58648 7.6903 9.04329C7.50108 9.50011 7.45157 10.0028 7.54804 10.4877C7.6445 10.9727 7.8826 11.4181 8.23223 11.7678C8.58187 12.1174 9.02732 12.3555 9.51228 12.452C9.99723 12.5484 10.4999 12.4989 10.9567 12.3097C11.4135 12.1205 11.804 11.8 12.0787 11.3889C12.3534 10.9778 12.5 10.4945 12.5 10C12.5 9.33696 12.2366 8.70107 11.7678 8.23223C11.2989 7.76339 10.663 7.5 10 7.5ZM10 11.25C9.75277 11.25 9.5111 11.1767 9.30554 11.0393C9.09998 10.902 8.93976 10.7068 8.84515 10.4784C8.75054 10.2499 8.72579 9.99861 8.77402 9.75614C8.82225 9.51366 8.9413 9.29093 9.11612 9.11612C9.29093 8.9413 9.51366 8.82225 9.75614 8.77402C9.99861 8.72579 10.2499 8.75054 10.4784 8.84515C10.7068 8.93976 10.902 9.09998 11.0393 9.30554C11.1767 9.5111 11.25 9.75277 11.25 10C11.25 10.3315 11.1183 10.6495 10.8839 10.8839C10.6495 11.1183 10.3315 11.25 10 11.25Z" fill="#F34F4F" />
                                        </svg>
                                    </span>
                                    <span>
                                        Renovations & Upgrades
                                    </span>
                                </p>
                            </div>
                        </div>
                        <button type="submit" className="next_button w-full mt-[32px] text-[16px] font-medium text-white cursor-pointer">
                            Next
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

