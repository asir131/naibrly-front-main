"use client";
import { Images } from '@/public/usersImg/ExportImg';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useRef } from 'react'
import { useForm } from 'react-hook-form';

const VerifyInfo = () => {
    // this is for navigate 
    const router = useRouter()
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

    const handleClick = (e) => {
        e.preventDefault();
        fileInputRef.current?.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files && e.target.files[0];
        setValue("insuranceFile", file, { shouldValidate: true });
    };

    const onSubmit = async (data) => {
        console.log(data);
        router.push('/provider/signup/service_area')
        // (optional) formData upload example here
    };

    return (
        <div className='verify_info_layout'>
            <form onSubmit={handleSubmit(onSubmit)} className="verify_info_form">
                <div className='flex flex-col items-start w-[353px]'>
                    <h2 className="user_info_heading flex items-center gap-[18px] pb-5">
                        <span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M9.07 6L3 12.07L9.07 18.14M20.0019 12.0703H3.17188" stroke="#111111" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </span>
                        <span>
                            Verify Your Information
                        </span>
                    </h2>
                    <div className='w-full'>
                        <div className='flex flex-col gap-2 pb-3'>
                            <label className='text-black text-sm font-semibold'>EIN Number</label>
                            <input
                                className='input_box text-[16px] w-full'
                                type="number"
                                placeholder='Enter your 9-digit EIN (e.g., 12-3456789)'
                                {...register("einNumber", { required: true })}
                            />
                            {errors.einNumber && <span className='text-red-500 text-[10px]'>This field is required</span>}
                            <p className='text-[#718096] text-[10px]'>An Employer Identification Number (EIN) is a federal tax ID for Businesses</p>
                        </div>

                        <div className='flex flex-col gap-2'>
                            <label className='text-black text-sm font-semibold'>Upload proof of insurance coverage</label>
                            <div className="pb-2 flex flex-col gap-2 relative">
                                {watchedFile && watchedFile.name ? (
                                    <p className="text-xs text-green-600 absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center">Uploaded: {watchedFile.name}</p>
                                ) : (
                                    <div className='absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center gap-2' onClick={handleClick}>
                                        <span>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="22" viewBox="0 0 20 22" fill="none">
                                                <path d="M10.75 0.75H11.0227C14.2839 0.75 15.9145 0.75 17.0469 1.54784C17.3714 1.77643 17.6594 2.04752 17.9023 2.35289C18.75 3.41867 18.75 4.95336 18.75 8.02273V10.5682C18.75 13.5314 18.75 15.0129 18.2811 16.1962C17.5272 18.0986 15.9329 19.5991 13.9116 20.3086C12.6544 20.75 11.0802 20.75 7.93182 20.75C6.13275 20.75 5.23322 20.75 4.51478 20.4978C3.35979 20.0924 2.44875 19.2349 2.01796 18.1479C1.75 17.4717 1.75 16.6251 1.75 14.9318V10.75" stroke="#666666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M18.75 10.75C18.75 12.5909 17.2576 14.0833 15.4167 14.0833C14.7509 14.0833 13.966 13.9667 13.3186 14.1401C12.7435 14.2942 12.2942 14.7435 12.1401 15.3186C11.9667 15.966 12.0833 16.7509 12.0833 17.4167C12.0833 19.2576 10.5909 20.75 8.75 20.75" stroke="#666666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M8.75 4.75L0.75 4.75M4.75 0.75V8.75" stroke="#666666" strokeWidth="1.5" strokeLinecap="round" />
                                            </svg>
                                        </span>
                                        <label className="block text-[#000] text-sm whitespace-nowrap">Click to upload insurance document</label>
                                        <span className='text-[11px] text-[#999] whitespace-nowrap'>
                                            Acceptable formats: JPG, PNG, PDF (Max 10MB)
                                        </span>
                                    </div>
                                )}

                                <div className='upload_verify'>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept=".jpg,.jpeg,.png,.pdf"
                                        className="hidden"
                                        onChange={handleFileChange}
                                        // {...register("insuranceFile", { required: true })}
                                    />
                                    {errors.insuranceFile && <span className='text-red-500 text-[10px]'>This field is required</span>}
                                </div>
                            </div>
                        </div>

                        <div className='flex items-center gap-3 pb-5'>
                            <input
                                className='verify_checkbox'
                                type="checkbox"
                                {...register("isDifferentOwner", { required: true })}
                            />
                            {errors.isDifferentOwner && <span className='text-red-500 text-[10px]'>This field is required</span>}
                            <p className='text-[11px] text-[#000]'>Information of the Registered Owner/Operator is different than you</p>
                        </div>

                        <div className='nid_upload'>
                            <div className="relative w-full">
                                <label className="text-[#1C5941] text-[10px] font-medium absolute left-4 -top-[6px] bg-white">Owner Operator: First Name</label>
                                <input
                                    type="text"
                                    className="input_box text-[#000] text-[16px] w-full"
                                    placeholder="Mina"
                                    {...register("ownerFirstName", { required: true })}
                                />
                                {errors.ownerFirstName && <span className='text-red-500 text-[10px]'>This field is required</span>}
                            </div>
                            <div className="relative w-full">
                                <label className="text-[#1C5941] text-[10px] font-medium absolute left-4 -top-[6px] bg-white">Owner Operator: Last Name</label>
                                <input
                                    type="text"
                                    className="input_box text-[#000] text-[16px] w-full"
                                    placeholder="Leo"
                                    {...register("ownerLastName", { required: true })}
                                />
                                {errors.ownerLastName && <span className='text-red-500 text-[10px]'>This field is required</span>}
                            </div>
                            <div className='flex flex-col gap-2'>
                                <h1 className='text-sm text-[#000] font-semibold'>Owner Operator ID check</h1>
                                <div>
                                    <Image src={Images.owner_id_check} alt="" />
                                </div>
                            </div>
                        </div>

                        <button type="submit" className="next_button w-full mt-[32px] text-[16px] font-medium text-white cursor-pointer">
                            Next
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default VerifyInfo;
