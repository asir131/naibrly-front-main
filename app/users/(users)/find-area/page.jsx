"use client"
import { Images } from '@/public/usersImg/ExportImg'
import Image from 'next/image'
import React, { useState, useEffect, Suspense } from 'react'
import { MdArrowBackIosNew, MdArrowForwardIos } from "react-icons/md";
import { IoArrowForwardSharp } from "react-icons/io5";
import { IoArrowBack } from "react-icons/io5";
import { bundlesData } from '../constans';
import NaibrlyLanding from '@/components/User/LandingPage/Mobileapp';
import TopProsSection from '@/components/User/FindArea/TopProsSection';
import TestimonialsSection from '@/components/User/FindArea/TestimonialsSection';
import { useSearchParams } from 'next/navigation';


// this is for opening modal 
const BundleCard = ({ setOpen, modaData }) => {
    return (
        <div className="fixed inset-0 backdrop-blur-lg flex justify-center items-center z-50">
            <div className="bg-white flex rounded-[12px] max-w-[680px] relative">
                {/* ide */}
                <div className='flex-1'>
                    <Image src={Images.modal_img} alt='user' width={297} className='rounded-bl-[12px] rounded-tl-[12px] h-full' />
                </div>
                <div className='modal   '>
                    <div>
                        <h1 className="text-[18px] text-[#000] font-medium">Window Washing</h1>
                        <p className="text-[16px] text-[#333] font-medium">3-Person Bundle (2 Joined, 1 Spot Open)</p>
                    </div>

                    {/* Location & Users */}
                    <div className="mt-3 flex flex-col items-center gap-4 border-b pb-4">
                        <div className="flex items-center gap-2">
                            <div>
                                <Image className='rounded-[6px] w-10 h-10' src={Images.left1} quality={75}
                                    priority alt='' />
                            </div>
                            <div className='flex flex-col gap-[6px]'>
                                <span className="text-sm font-semibold">
                                    Moniru
                                </span>
                                <div className="flex  items-center gap-2 text-sm font-semibold text-[#181818]">
                                    <span>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <path d="M11.9989 13.4295C13.722 13.4295 15.1189 12.0326 15.1189 10.3095C15.1189 8.58633 13.722 7.18945 11.9989 7.18945C10.2758 7.18945 8.87891 8.58633 8.87891 10.3095C8.87891 12.0326 10.2758 13.4295 11.9989 13.4295Z" stroke="#0E7A60" strokeWidth="1.5" />
                                            <path d="M3.62166 8.49C5.59166 -0.169998 18.4217 -0.159997 20.3817 8.5C21.5317 13.58 18.3717 17.88 15.6017 20.54C13.5917 22.48 10.4117 22.48 8.39166 20.54C5.63166 17.88 2.47166 13.57 3.62166 8.49Z" stroke="#0E7A60" strokeWidth="1.5" />
                                        </svg>
                                    </span>
                                    <span className="text-xs text-gray-500">Street Springfield, IL 62704</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div>
                                <Image className='rounded-[6px] w-10 h-10' src={Images.left1} alt=''
                                    quality={75}
                                    priority />
                            </div>
                            <div className='flex flex-col gap-[6px]'>
                                <span className="text-sm font-semibold">Shuvos</span>
                                <div className="flex  items-center gap-2 text-sm font-semibold text-[#181818]">
                                    <span>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <path d="M11.9989 13.4295C13.722 13.4295 15.1189 12.0326 15.1189 10.3095C15.1189 8.58633 13.722 7.18945 11.9989 7.18945C10.2758 7.18945 8.87891 8.58633 8.87891 10.3095C8.87891 12.0326 10.2758 13.4295 11.9989 13.4295Z" stroke="#0E7A60" strokeWidth="1.5" />
                                            <path d="M3.62166 8.49C5.59166 -0.169998 18.4217 -0.159997 20.3817 8.5C21.5317 13.58 18.3717 17.88 15.6017 20.54C13.5917 22.48 10.4117 22.48 8.39166 20.54C5.63166 17.88 2.47166 13.57 3.62166 8.49Z" stroke="#0E7A60" strokeWidth="1.5" />
                                        </svg>
                                    </span>
                                    <span className="text-xs text-gray-500">Street Springfield, IL 62704</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Total Benefits */}
                    <div className="">
                        <h3 className="text-[#000] text-[16px] font-medium">Total Benefits:</h3>
                        <ul className="list-inside list-disc mt-2 text-sm text-gray-600">
                            <li className="flex items-center text-[#7F7F7F] gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM16.78 9.7L11.11 15.37C10.97 15.51 10.78 15.59 10.58 15.59C10.38 15.59 10.19 15.51 10.05 15.37L7.22 12.54C6.93 12.25 6.93 11.77 7.22 11.48C7.51 11.19 7.99 11.19 8.28 11.48L10.58 13.78L15.72 8.64C16.01 8.35 16.49 8.35 16.78 8.64C17.07 8.93 17.07 9.4 16.78 9.7Z" fill="#0E7A60" />
                                </svg>
                                Each user saves around $13/hr
                            </li>
                            <li className="flex items-center gap-2 text-[#7F7F7F]">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM16.78 9.7L11.11 15.37C10.97 15.51 10.78 15.59 10.58 15.59C10.38 15.59 10.19 15.51 10.05 15.37L7.22 12.54C6.93 12.25 6.93 11.77 7.22 11.48C7.51 11.19 7.99 11.19 8.28 11.48L10.58 13.78L15.72 8.64C16.01 8.35 16.49 8.35 16.78 8.64C17.07 8.93 17.07 9.4 16.78 9.7Z" fill="#0E7A60" />
                                </svg>
                                Provider gets 3 jobs together in one trip
                            </li>
                            <li className="flex items-center gap-2 text-[#7F7F7F]">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM16.78 9.7L11.11 15.37C10.97 15.51 10.78 15.59 10.58 15.59C10.38 15.59 10.19 15.51 10.05 15.37L7.22 12.54C6.93 12.25 6.93 11.77 7.22 11.48C7.51 11.19 7.99 11.19 8.28 11.48L10.58 13.78L15.72 8.64C16.01 8.35 16.49 8.35 16.78 8.64C17.07 8.93 17.07 9.4 16.78 9.7Z" fill="#0E7A60" />
                                </svg>
                                Reduced travel and time cost
                            </li>
                            <li className="flex items-center gap-2 text-[#7F7F7F]">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM16.78 9.7L11.11 15.37C10.97 15.51 10.78 15.59 10.58 15.59C10.38 15.59 10.19 15.51 10.05 15.37L7.22 12.54C6.93 12.25 6.93 11.77 7.22 11.48C7.51 11.19 7.99 11.19 8.28 11.48L10.58 13.78L15.72 8.64C16.01 8.35 16.49 8.35 16.78 8.64C17.07 8.93 17.07 9.4 16.78 9.7Z" fill="#0E7A60" />
                                </svg>
                                Higher priority service for bundled requests
                            </li>
                        </ul>
                    </div>

                    <div className='flex justify-between items-center gap-[45px]'>
                        {/* Pricing */}
                        <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                                <div className="text-[#F34F4F] text-[16px] font-semibold">$68/hr</div>
                                <div className="text-[#000] text-[16px] font-semibold">$55/hr</div>
                            </div>
                            <span className="text-[12px] text-[#0E7A60]">-$13</span>
                        </div>

                        {/* Join Bundle Button */}
                        <div className="">
                            <button
                                onClick={() => setOpen(false)} // Close modal on button click
                                className="whitespace-nowrap joinBundle text-[18px] text-white  font-medium"
                            >
                                Join Bundle
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
// Component that uses useSearchParams
const FindAreaContent = () => {
    const searchParams = useSearchParams();

    // Get search parameters from URL
    const serviceParam = searchParams.get('service');
    const zipParam = searchParams.get('zip');

    // this is for modal open and close
    const [open, setOpen] = useState(false)
    // this is for modal data
    const [modaData, setModalData] = useState(null)
    // State for search inputs
    const [searchQuery, setSearchQuery] = useState('');
    const [zipCode, setZipCode] = useState('');

    // Update search inputs when URL parameters change
    useEffect(() => {
        if (serviceParam) setSearchQuery(serviceParam);
        if (zipParam) setZipCode(zipParam);
    }, [serviceParam, zipParam]);

    // this is for handle open function
    const handleOpen = (value) => {
        setModalData(value)
        setOpen(!open)
    }

    return (
        <div className='w-full'>
            {/* Hero section */}
            <div className='px-[126px]'>
                <div className='flex justify-between items-center mt-[138px] mb-[73px] w-full gap-[54px]'>
                    {/* Hero text */}
                    <div className='flex-1 flex flex-col gap-[44px]'>
                        <h1 className='userHero_head'>
                            You. Your Neighbors. Saving time and money on home services with <span className='text-[38px] font-semibold text-[#0E7A60]'>Naibrly</span>.
                        </h1>
                        {/* Search part */}
                        <div className='flex flex-col gap-4'>
                            <div className='relative'>
                                <input
                                    className='search_bar'
                                    type="text"
                                    placeholder='What do you need help With?'
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <div className='absolute right-0 top-0 rounded-[20px] h-full flex justify-center items-center'>
                                    <div className='relative'>
                                        <svg className='absolute right-[80px]' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <path d="M11.9989 13.4295C13.722 13.4295 15.1189 12.0326 15.1189 10.3095C15.1189 8.58633 13.722 7.18945 11.9989 7.18945C10.2758 7.18945 8.87891 8.58633 8.87891 10.3095C8.87891 12.0326 10.2758 13.4295 11.9989 13.4295Z" stroke="#0E7A60" strokeWidth="1.5" />
                                            <path d="M3.62166 8.49C5.59166 -0.169998 18.4217 -0.159997 20.3817 8.5C21.5317 13.58 18.3717 17.88 15.6017 20.54C13.5917 22.48 10.4117 22.48 8.39166 20.54C5.63166 17.88 2.47166 13.57 3.62166 8.49Z" stroke="#0E7A60" strokeWidth="1.5" />
                                        </svg>
                                        {/* Location input */}
                                        <input
                                            className='rounded-[20px] h-full text-end pr-5 text-[16px] font-medium text-[#000]'
                                            type="text"
                                            placeholder='152643'
                                            value={zipCode}
                                            onChange={(e) => setZipCode(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                            {/* Submit button */}
                            <div className='input_submit cursor-pointer'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M22 22L20 20" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <button className='text-[16px] font-semibold text-white cursor-pointer'>Find your area</button>
                            </div>
                        </div>
                    </div>
                    {/* Hero image part */}
                    <div className='flex justify-center items-center flex-1 w-full gap-[29px]'>
                        <div className='w-full flex flex-col gap-[29px]'>
                            <Image className='img1' src={Images.left1} alt='h' />
                            <Image className='img2' src={Images.left2} alt='h' />
                        </div>
                        <div className='w-full'>
                            <Image className='img3' src={Images.right} alt='h' />
                        </div>
                    </div>
                </div>
            </div>

            {/* Plumbers near you section */}
            <div className='px-[126px]'>
                <div className='border-b border-[#E9ECED] pb-[17px]'>
                    <h1 className='Plumbers'>
                        {searchQuery ? `${searchQuery} near you` : 'Plumbers near you'}
                        {zipParam && ` in ${zipParam}`}
                    </h1>
                    <p className='Plumbers_text lg:w-[840px]'>
                        {searchQuery
                            ? `Find professional ${searchQuery.toLowerCase()} services in your area. Save time and money by bundling with your neighbors.`
                            : 'Plumbers often repair clogged drains, leaky faucets, or faulty water heaters — helping protect your home from water damage and keep your systems running smoothly.'}
                    </p>
                </div>
            </div>
            {/* this  is for Bundles */}
            <div className='px-[126px] flex flex-col gap-7 mt-[46px]'>
                <h1 className='text-[#2F3033] text-[28px] font-semibold'>Bundles</h1>
                <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6'>
                    {
                        bundlesData.map(bundle => {
                            return <div key={bundle.id} className="bundle_card">
                                <div className="flex justify-between items-start w-full">
                                    <h2 className="text-[18px] font-medium text-[#000]">Window Washing</h2>
                                    <Image className='rounded-full' src={bundle.image} alt="" height={50} width={50} />
                                </div>

                                <div className="w-full">
                                    <p className="text-[16px] font-medium text-[#333]">3-Person Bundle (2 Joined, 1 Spot Open)</p>
                                    <div className='flex items-center gap-2'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <path d="M11.9989 13.4295C13.722 13.4295 15.1189 12.0326 15.1189 10.3095C15.1189 8.58633 13.722 7.18945 11.9989 7.18945C10.2758 7.18945 8.87891 8.58633 8.87891 10.3095C8.87891 12.0326 10.2758 13.4295 11.9989 13.4295Z" stroke="#292D32" strokeWidth="1.5" />
                                            <path d="M3.62166 8.49C5.59166 -0.169998 18.4217 -0.159997 20.3817 8.5C21.5317 13.58 18.3717 17.88 15.6017 20.54C13.5917 22.48 10.4117 22.48 8.39166 20.54C5.63166 17.88 2.47166 13.57 3.62166 8.49Z" stroke="#292D32" strokeWidth="1.5" />
                                        </svg>
                                        <p className="text-[14px] text-[#666]">Street Springfield, IL 62704</p>
                                    </div>
                                </div>
                                <div className='flex justify-between items-center w-full'>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[#F34F4F] text-[16px] font-semibold">$68/hr</span>
                                        <span className="text-[#000] text-[16px] font-semibold">$55/hr</span>
                                        <span className="text-[#0E7A60] text-[16px] font-semibold">-$13</span>
                                    </div>

                                    <div onClick={() => handleOpen(bundle)} className="flex justify-end">
                                        <button className="bundle_view text-[18px] text-[#0E7A60]">View details</button>
                                    </div>
                                </div>
                            </div>

                        })
                    }
                </div>
                <div className='flex justify-center items-center '>
                    <button className='view_all text-2xl text-[#0E7A60] font-medium'>view_all</button>
                </div>
            </div>
            {/* Top pros for your project */}
            <TopProsSection showPagination={true} />

            {/* What people say about Us */}
            <div className='px-[126px]'>
                <TestimonialsSection />
            </div>
            <div>
                <NaibrlyLanding />
            </div>
            {/*  this is for modal openig*/}
            {
                open && <BundleCard setOpen={setOpen} modaData={modaData} />
            }
        </div>
    );
};

// Wrapper component with Suspense
const FindArea = () => {
    return (
        <Suspense fallback={<div className="w-full px-[126px] py-20">Loading...</div>}>
            <FindAreaContent />
        </Suspense>
    );
};

export default FindArea;