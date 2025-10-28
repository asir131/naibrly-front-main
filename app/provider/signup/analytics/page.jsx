
"use client"
import BundleRequestCard from '@/components/BundleRequestCard'
import ReviewsList from '@/components/ReviewsList'
import Link from 'next/link'
import React, { useState } from 'react'
import CancelOrderConfirmModal from '@/components/CancelOrderConfirmModal'

const Analytics = () => {
    const [open, setOpen] = useState(false)
    const handleCencelOrderConfirm = () => {
        setOpen(true)
    }
    const handleCencelOrderConfirmClose = () => {
        setOpen(false)
    }
    const handleCencelOrderConfirmSubmit = (note) => {
        setOpen(false)
    }
    return (
        <div className='analytics_layout flex flex-col gap-6'>
            {/* this is for head of analytics */}
            <div className='w-full flex flex-col gap-[18px]'>
                <h1 className='analytics_heading'>Analytics</h1>
                {/* this is for analytics card */}
                <div className='flex gap-[48px] w-full'>
                    <div className='analytics_card w-full'>
                        <div className='flex  items-center justify-center gap-3'>
                            <span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="31" height="31" viewBox="0 0 31 31" fill="none">
                                    <path d="M1.23298 9.71048C1.14328 8.97052 1.09843 8.60054 1.14156 8.2979C1.26715 7.41649 1.88523 6.69451 2.7178 6.45667C3.00368 6.375 3.36526 6.375 4.08843 6.375H26.6616C27.3847 6.375 27.7463 6.375 28.0322 6.45667C28.8648 6.69451 29.4828 7.41649 29.6084 8.2979C29.6516 8.60054 29.6067 8.97052 29.517 9.71048C29.2781 11.6816 29.1586 12.6672 28.8659 13.4816C28.0185 15.839 26.082 17.6018 23.7085 18.1765C22.8884 18.375 21.9252 18.375 19.9989 18.375H10.7511C8.82477 18.375 7.86158 18.375 7.04154 18.1765C4.66797 17.6018 2.7315 15.839 1.88414 13.4816C1.59138 12.6672 1.47191 11.6816 1.23298 9.71048Z" stroke="#0E7A60" strokeWidth="2.25" />
                                    <path d="M15.375 13.875H15.3885" stroke="#0E7A60" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M2.625 15.375L2.625 19.905C2.625 24.4871 2.625 26.7781 4.28473 28.2015C5.94446 29.625 8.61575 29.625 13.9583 29.625H16.7917C22.1343 29.625 24.8055 29.625 26.4653 28.2015C28.125 26.7781 28.125 24.4871 28.125 19.905V15.375" stroke="#0E7A60" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M21.375 6.375L21.2425 5.91141C20.5825 3.60134 20.2525 2.4463 19.4669 1.78565C18.6812 1.125 17.6376 1.125 15.5504 1.125H15.1996C13.1124 1.125 12.0688 1.125 11.2831 1.78565C10.4975 2.4463 10.1675 3.60134 9.50746 5.91141L9.375 6.375" stroke="#0E7A60" strokeWidth="2.25" />
                                </svg>
                            </span>
                            <p className='text-[28px] font-medium text-black'>My Order</p>
                        </div>
                        <div className='flex justify-center items-center gap-6 w-full'>
                            <div className='flex items-center flex-col w-full border-r-[5px] border-[#0E7A60]'>
                                <h2 className='analytics_heading'>05</h2>
                                <h3 className='text-sm text-[#666]'>Today</h3>
                            </div>
                            <div className='flex items-center flex-col w-full'>
                                <h2 className='analytics_heading'>82</h2>
                                <h3 className='text-sm text-[#666]'>This Month</h3>
                            </div>
                        </div>
                    </div>
                    <div className='analytics_card w-full'>
                        <div className='flex  items-center justify-center gap-3'>
                            <span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="31" height="31" viewBox="0 0 31 31" fill="none">
                                    <path d="M1.23298 9.71048C1.14328 8.97052 1.09843 8.60054 1.14156 8.2979C1.26715 7.41649 1.88523 6.69451 2.7178 6.45667C3.00368 6.375 3.36526 6.375 4.08843 6.375H26.6616C27.3847 6.375 27.7463 6.375 28.0322 6.45667C28.8648 6.69451 29.4828 7.41649 29.6084 8.2979C29.6516 8.60054 29.6067 8.97052 29.517 9.71048C29.2781 11.6816 29.1586 12.6672 28.8659 13.4816C28.0185 15.839 26.082 17.6018 23.7085 18.1765C22.8884 18.375 21.9252 18.375 19.9989 18.375H10.7511C8.82477 18.375 7.86158 18.375 7.04154 18.1765C4.66797 17.6018 2.7315 15.839 1.88414 13.4816C1.59138 12.6672 1.47191 11.6816 1.23298 9.71048Z" stroke="#0E7A60" strokeWidth="2.25" />
                                    <path d="M15.375 13.875H15.3885" stroke="#0E7A60" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M2.625 15.375L2.625 19.905C2.625 24.4871 2.625 26.7781 4.28473 28.2015C5.94446 29.625 8.61575 29.625 13.9583 29.625H16.7917C22.1343 29.625 24.8055 29.625 26.4653 28.2015C28.125 26.7781 28.125 24.4871 28.125 19.905V15.375" stroke="#0E7A60" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M21.375 6.375L21.2425 5.91141C20.5825 3.60134 20.2525 2.4463 19.4669 1.78565C18.6812 1.125 17.6376 1.125 15.5504 1.125H15.1996C13.1124 1.125 12.0688 1.125 11.2831 1.78565C10.4975 2.4463 10.1675 3.60134 9.50746 5.91141L9.375 6.375" stroke="#0E7A60" strokeWidth="2.25" />
                                </svg>
                            </span>
                            <p className='text-[28px] font-medium text-black'>My Earnings</p>
                        </div>
                        <div className='flex justify-center items-center gap-6 w-full'>
                            <div className='flex items-center flex-col w-full border-r-[5px] border-[#0E7A60]'>
                                <h2 className='analytics_heading'>$2586</h2>
                                <h3 className='text-sm text-[#666]'>Today</h3>
                            </div>
                            <div className='flex items-center flex-col w-full'>
                                <h2 className='analytics_heading'>$223</h2>
                                <h3 className='text-sm text-[#666]'>This Month</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* this is for active request */}
            <div className='flex flex-col gap-[18px] w-full'>
                <h1 className='analytics_heading'>Active Request</h1>
                <div className="relative w-full rounded-2xl bg-white shadow-sm ring-1 ring-black/5 p-6 md:p-7">
                    {/* status pill */}
                    <div className="absolute right-5 top-5">
                        <span className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 text-sm font-medium text-[#F3934F]">
                            <span className="h-2 w-2 rounded-full bg-[#F3934F]" />
                            Pending
                        </span>
                    </div>

                    {/* header: title + price */}
                    <div className="mb-5">
                        <p className="text-[20px] font-bold text-[#333]">
                            Appliance Repairs:{' '}
                            <span className="text-[#0E7A60]">$500</span>
                            <span className="text-[#0E7A60] text-sm font-medium">/consult</span>
                        </p>
                    </div>

                    {/* user row */}
                    <div className="mb-5 flex items-center gap-3">
                        <img
                            src="https://i.pravatar.cc/64?img=1"
                            alt="Client"
                            className="h-[80px] w-[80px] rounded-full object-cover"
                        />
                        <div className="flex flex-col">
                            <span className="text-[24px] font-semibold text-black">Jane Doe</span>
                            <div className="flex items-center gap-2 text-[16px] text-[#F1C400]">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                >
                                    <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                </svg>
                                <span className=" text-[#8F8F8F]">5.0</span>
                                <span className="text-[#8F8F8F]">(1,513 reviews)</span>
                            </div>
                        </div>
                    </div>

                    {/* problem note */}
                    <div className="mb-4">
                        <p className="mb-1 text-[24px] font-semibold text-black">
                            Problem Note for Fridge Repair
                        </p>
                        <p className="text-[15px] lg:w-[574px] leading-6 text-[#8F8F8F]">
                            The fridge is not cooling properly, making strange noises, freezing
                            food, leaking water, etc.
                        </p>
                    </div>

                    {/* address */}
                    <div className="mb-2 text-[15px]">
                        <span className="font-semibold text-black">Address: </span>
                        <span className="text-[#7F7F7F]">
                            123 Oak Street Springfield, IL 62704
                        </span>
                    </div>
                    <div className="flex items-center justify-between">
                        {/* service date */}
                        <div className="text-[15px] text-[#666] whitespace-nowrap">
                            <span>Service Date: </span>
                            <span>18 Sep, 14:00</span>
                        </div>

                        {/* actions */}
                        <div className="flex w-full justify-end gap-3">
                            <button
                                onClick={handleCencelOrderConfirm}
                                type="button"
                                className="decline_btn"
                            >
                                Decline
                            </button>
                            <Link href={`/provider/signup/order`}>
                                <button
                                    type="button"
                                    className="accept_btn"
                                >
                                    Accept
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            {/* this is for active bundle request */}
            <div className='flex flex-col gap-[18px] w-full'>
                <h1 className='analytics_heading'>Active Bundle Request</h1>
                <div className='flex items-center justify-between w-full gap-[10px]'>
                    <div className='w-full'>
                        <BundleRequestCard handleCencelOrderConfirm={handleCencelOrderConfirm} handleCencelOrderConfirmClose={handleCencelOrderConfirmClose} handleCencelOrderConfirmSubmit={handleCencelOrderConfirmSubmit} open={open} />
                    </div>
                    <div className='w-full'>
                        <BundleRequestCard handleCencelOrderConfirm={handleCencelOrderConfirm} handleCencelOrderConfirmClose={handleCencelOrderConfirmClose} handleCencelOrderConfirmSubmit={handleCencelOrderConfirmSubmit} open={open} />
                    </div>
                </div>
            </div>
            {/* Client Feedback */}
            <div className='flex flex-col gap-[18px] w-full'>
                <h1 className='analytics_heading'>Client Feedback</h1>
                <ReviewsList />
            </div>
            {
                open && (
                    <CancelOrderConfirmModal
                        open={open}
                        onClose={handleCencelOrderConfirmClose}
                        onSubmit={handleCencelOrderConfirmSubmit}
                        title="Are you sure!"
                        subtitle="you want to cancel this order?"
                        label="Note why*"
                        placeholder="Type here"
                        submitLabel="Cancelled"
                    />
                )
            }
        </div>
    )
}

export default Analytics
