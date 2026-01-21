
"use client"
import BundleRequestCard from '@/components/BundleRequestCard'
import ReviewsList from '@/components/ReviewsList'
import Link from 'next/link'
import React, { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { User as UserIcon } from 'lucide-react'
import CancelOrderConfirmModal from '@/components/CancelOrderConfirmModal'
import { useGetProviderAnalyticsQuery, useGetProviderNearbyBundlesQuery, useGetProviderReviewsQuery, useGetProviderServiceRequestsQuery, useUpdateServiceRequestStatusMutation, useUpdateBundleStatusMutation } from '@/redux/api/servicesApi'

const Analytics = () => {
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [selectedRequest, setSelectedRequest] = useState(null)
    const [selectedBundle, setSelectedBundle] = useState(null)
    const [hiddenRequestIds, setHiddenRequestIds] = useState([])
    const [hiddenBundleIds, setHiddenBundleIds] = useState([])
    const [activeRequestPage, setActiveRequestPage] = useState(1)
    const [activeBundlePage, setActiveBundlePage] = useState(1)
    const activeRequestPageSize = 3
    const activeBundlePageSize = 3

    const { data: analytics, isLoading, isError, error } = useGetProviderAnalyticsQuery(undefined, {
        refetchOnFocus: true,
        refetchOnReconnect: true,
    })
    const { data: requestsData, isLoading: requestsLoading, refetch: refetchRequests } = useGetProviderServiceRequestsQuery(undefined, {
        refetchOnFocus: true,
        refetchOnReconnect: true,
    })
    const { data: providerReviews, isLoading: reviewsLoading, isError: reviewsError, error: reviewsErrorData, refetch: refetchReviews } = useGetProviderReviewsQuery(undefined, {
        refetchOnFocus: true,
        refetchOnReconnect: true,
    })
    const { data: nearbyBundlesData, isLoading: nearbyBundlesLoading, isError: nearbyBundlesError, error: nearbyBundlesErrorData, refetch: refetchNearbyBundles } = useGetProviderNearbyBundlesQuery(undefined, {
        refetchOnFocus: true,
        refetchOnReconnect: true,
    })
    const [updateServiceRequestStatus, { isLoading: isUpdatingRequest }] = useUpdateServiceRequestStatusMutation()
    const [updateBundleStatus, { isLoading: isUpdatingBundle }] = useUpdateBundleStatusMutation()

    const handleCencelOrderConfirm = (item, type) => {
        if (type === 'service') {
            setSelectedRequest(item)
            setSelectedBundle(null)
        } else {
            setSelectedBundle(item)
            setSelectedRequest(null)
        }
        setOpen(true)
    }

    const handleAccept = async (item, type) => {
        try {
            if (type === 'service') {
                await updateServiceRequestStatus({
                    requestId: item._id,
                    status: 'accepted',
                    note: 'Service accepted by provider'
                }).unwrap()
            } else {
                await updateBundleStatus({
                    bundleId: item._id,
                    status: 'accepted',
                    note: 'Bundle accepted by provider'
                }).unwrap()
            }
            // Refresh lists so accepted items disappear from pending
            await Promise.all([refetchRequests(), refetchNearbyBundles()])
            // Navigate to orders page where accepted items are shown
            router.push('/provider/signup/order')
            toast.success(type === 'service' ? 'Service request accepted' : 'Bundle accepted')
        } catch (error) {
            console.error('Failed to accept:', error)
        }
    }

    const handleCencelOrderConfirmClose = () => {
        setOpen(false)
        setSelectedRequest(null)
        setSelectedBundle(null)
    }

    const handleCencelOrderConfirmSubmit = async (note) => {
        try {
            if (selectedRequest) {
                await updateServiceRequestStatus({
                    requestId: selectedRequest._id,
                    status: 'cancelled',
                    note: note || 'Service cancelled by provider'
                }).unwrap()
            } else if (selectedBundle) {
                await updateBundleStatus({
                    bundleId: selectedBundle._id,
                    status: 'declined',
                    note: note || 'Bundle declined by provider'
                }).unwrap()
            }
            await Promise.all([refetchRequests(), refetchNearbyBundles()])
            toast.success(selectedRequest ? 'Service request cancelled' : 'Bundle declined')
            setOpen(false)
            if (selectedRequest?._id) {
                setHiddenRequestIds((prev) => prev.includes(selectedRequest._id) ? prev : [...prev, selectedRequest._id])
            }
            if (selectedBundle?._id) {
                setHiddenBundleIds((prev) => prev.includes(selectedBundle._id) ? prev : [...prev, selectedBundle._id])
            }
            setSelectedRequest(null)
            setSelectedBundle(null)
        } catch (error) {
            console.error('Failed to decline:', error)
        }
    }

    const activeRequests = useMemo(() => (
        requestsData?.serviceRequests?.items?.filter(
            req => req.status === 'pending' && !hiddenRequestIds.includes(req._id)
        ) || []
    ), [requestsData, hiddenRequestIds])

    const activeBundles = useMemo(() => (
        (nearbyBundlesData?.bundles || []).filter(
            bundle => !hiddenBundleIds.includes(bundle._id)
        )
    ), [nearbyBundlesData, hiddenBundleIds])

    const activeRequestTotalPages = Math.max(1, Math.ceil(activeRequests.length / activeRequestPageSize))
    const activeBundleTotalPages = Math.max(1, Math.ceil(activeBundles.length / activeBundlePageSize))

    const pagedActiveRequests = activeRequests.slice(
        (activeRequestPage - 1) * activeRequestPageSize,
        activeRequestPage * activeRequestPageSize
    )
    const pagedActiveBundles = activeBundles.slice(
        (activeBundlePage - 1) * activeBundlePageSize,
        activeBundlePage * activeBundlePageSize
    )

    useEffect(() => {
        if (activeRequestPage > activeRequestTotalPages) {
            setActiveRequestPage(1)
        }
    }, [activeRequestPage, activeRequestTotalPages])

    useEffect(() => {
        if (activeBundlePage > activeBundleTotalPages) {
            setActiveBundlePage(1)
        }
    }, [activeBundlePage, activeBundleTotalPages])

    return (
        <div className='analytics_layout md:px-[126px] md:py-[80px] max-sm:py-6 max-sm:px-6 flex flex-col gap-6'>
            {/* this is for head of analytics */}
            <div className='w-full flex flex-col gap-[18px]'>
                <h1 className='analytics_heading'>Analytics</h1>
                {/* Error message if API fails */}
                {isError && (
                    <div className='w-full p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm'>
                        {error?.status === 401
                            ? 'Please log in as a provider to view analytics.'
                            : `Failed to load analytics data. ${error?.data?.message || 'Please try again later.'}`
                        }
                    </div>
                )}
                {/* this is for analytics card */}
                <div className='flex flex-col md:flex-row gap-[48px] w-full'>
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
                                <h2 className='analytics_heading'>
                                    {isLoading ? '...' : analytics?.today?.orders || 0}
                                </h2>
                                <h3 className='text-sm text-[#666]'>Today</h3>
                            </div>
                            <div className='flex items-center flex-col w-full'>
                                <h2 className='analytics_heading'>
                                    {isLoading ? '...' : analytics?.month?.orders || 0}
                                </h2>
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
                                <h2 className='analytics_heading'>
                                    ${isLoading ? '...' : (analytics?.today?.earnings || 0).toFixed(2)}
                                </h2>
                                <h3 className='text-sm text-[#666]'>Today</h3>
                            </div>
                            <div className='flex items-center flex-col w-full'>
                                <h2 className='analytics_heading'>
                                    ${isLoading ? '...' : (analytics?.month?.earnings || 0).toFixed(2)}
                                </h2>
                                <h3 className='text-sm text-[#666]'>This Month</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* this is for active request */}
            <div className='flex flex-col gap-[18px] w-full'>
                <h1 className='analytics_heading'>Active Request</h1>
                {requestsLoading ? (
                    <div className="relative w-full rounded-2xl bg-white shadow-sm ring-1 ring-black/5 p-6 md:p-7">
                        <p className="text-center text-[#666]">Loading active requests...</p>
                    </div>
                ) : activeRequests.length > 0 ? (
                    pagedActiveRequests.map((request) => {
                        const scheduledDate = new Date(request.scheduledDate);
                        const formattedDate = scheduledDate.toLocaleDateString('en-US', {
                            day: 'numeric',
                            month: 'short'
                        });
                        const formattedTime = scheduledDate.toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false
                        });

                        return (
                            <div key={request._id} className="relative w-full rounded-2xl bg-white shadow-sm ring-1 ring-black/5 p-6 md:p-7">
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
                                        {request.serviceType}:{' '}
                                        <span className="text-[#0E7A60]">${request.price}</span>
                                        <span className="text-[#0E7A60] text-sm font-medium">/consult</span>
                                    </p>
                                </div>

                                {/* user row */}
                                <div className="mb-5 flex items-center gap-3">
                                    {request.customer?.profileImage?.url ? (
                                        <img
                                            src={request.customer.profileImage.url}
                                            alt="Client"
                                            className="h-20 w-20 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="h-20 w-20 rounded-full bg-teal-600 flex items-center justify-center text-white">
                                            <UserIcon className="h-10 w-10" />
                                        </div>
                                    )}
                                    <div className="flex flex-col">
                                        <span className="text-[24px] font-semibold text-black">
                                            {request.customer?.firstName} {request.customer?.lastName}
                                        </span>
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
                                        Problem Note
                                    </p>
                                    <p className="text-[15px] lg:w-[574px] leading-6 text-[#8F8F8F]">
                                        <strong>Problem:</strong> {request.problem}
                                        {request.note && (
                                            <>
                                                <br />
                                                <strong>Note:</strong> {request.note}
                                            </>
                                        )}
                                    </p>
                                </div>

                                {/* address */}
                                <div className="mb-2 text-[15px]">
                                    <span className="font-semibold text-black">Address: </span>
                                    <span className="text-[#7F7F7F]">
                                        {request.customer?.address?.street}
                                        {request.customer?.address?.aptSuite && `, ${request.customer.address.aptSuite}`}, {request.customer?.address?.city}, {request.customer?.address?.state} {request.customer?.address?.zipCode}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    {/* service date */}
                                    <div className="text-[15px] text-[#666] whitespace-nowrap">
                                        <span>Service Date: </span>
                                        <span>{formattedDate}, {formattedTime}</span>
                                    </div>

                                    {/* actions */}
                                    <div className="flex w-full justify-end gap-3">
                                        <button
                                            onClick={() => handleCencelOrderConfirm(request, 'service')}
                                            type="button"
                                            className="decline_btn"
                                            disabled={isUpdatingRequest}
                                        >
                                            Decline
                                        </button>
                                        <button
                                            onClick={() => handleAccept(request, 'service')}
                                            type="button"
                                            className="accept_btn"
                                            disabled={isUpdatingRequest}
                                        >
                                            {isUpdatingRequest ? 'Processing...' : 'Accept'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="relative w-full rounded-2xl bg-white shadow-sm ring-1 ring-black/5 p-6 md:p-7">
                        <p className="text-center text-[#666]">No active requests at the moment.</p>
                    </div>
                )}
                {activeRequests.length > 0 && activeRequestTotalPages > 1 && (
                    <div className="flex items-center justify-center gap-3 pt-2">
                        <button
                            type="button"
                            onClick={() => setActiveRequestPage((prev) => Math.max(prev - 1, 1))}
                            className="page_number"
                            disabled={activeRequestPage <= 1}
                        >
                            Previous
                        </button>
                        <span className="text-sm text-gray-600">
                            Page {activeRequestPage} of {activeRequestTotalPages}
                        </span>
                        <button
                            type="button"
                            onClick={() =>
                                setActiveRequestPage((prev) => Math.min(prev + 1, activeRequestTotalPages))
                            }
                            className="page_number"
                            disabled={activeRequestPage >= activeRequestTotalPages}
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
            {/* this is for active bundle request */}
            <div className='flex flex-col gap-[18px] w-full'>
                <h1 className='analytics_heading'>Active Bundle Request</h1>
                {nearbyBundlesLoading ? (
                    <div className="relative w-full rounded-2xl bg-white shadow-sm ring-1 ring-black/5 p-6 md:p-7">
                        <p className="text-center text-[#666]">Loading bundle requests...</p>
                    </div>
                ) : nearbyBundlesError ? (
                    <div className='w-full p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center justify-between gap-3'>
                        <span>
                            {nearbyBundlesErrorData?.status === 401
                                ? 'Please log in as a provider to view bundle requests.'
                                : nearbyBundlesErrorData?.data?.message || 'Failed to load bundle requests. Please try again.'}
                        </span>
                        <button
                            type="button"
                            onClick={() => refetchNearbyBundles()}
                            className="px-3 py-1 rounded-md bg-white border border-red-200 text-red-700 hover:bg-red-100 transition"
                        >
                            Retry
                        </button>
                    </div>
                ) : activeBundles.length > 0 ? (
                    <div className='flex flex-col md:flex-row items-center justify-between w-full gap-[10px]'>
                        {pagedActiveBundles.map((bundle) => (
                            <div key={bundle._id} className='w-full'>
                                <BundleRequestCard
                                    bundle={bundle}
                                    handleCencelOrderConfirm={() => handleCencelOrderConfirm(bundle, 'bundle')}
                                    handleAccept={() => handleAccept(bundle, 'bundle')}
                                    isUpdating={isUpdatingBundle}
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="relative w-full rounded-2xl bg-white shadow-sm ring-1 ring-black/5 p-6 md:p-7">
                        <p className="text-center text-[#666]">No active bundle requests at the moment.</p>
                    </div>
                )}
                {activeBundles.length > 0 && activeBundleTotalPages > 1 && (
                    <div className="flex items-center justify-center gap-3 pt-2">
                        <button
                            type="button"
                            onClick={() => setActiveBundlePage((prev) => Math.max(prev - 1, 1))}
                            className="page_number"
                            disabled={activeBundlePage <= 1}
                        >
                            Previous
                        </button>
                        <span className="text-sm text-gray-600">
                            Page {activeBundlePage} of {activeBundleTotalPages}
                        </span>
                        <button
                            type="button"
                            onClick={() =>
                                setActiveBundlePage((prev) => Math.min(prev + 1, activeBundleTotalPages))
                            }
                            className="page_number"
                            disabled={activeBundlePage >= activeBundleTotalPages}
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
            {/* Client Feedback */}
            <div className='flex flex-col gap-[18px] w-full'>
                <h1 className='analytics_heading'>Client Feedback</h1>
                {reviewsError && (
                    <div className='w-full p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center justify-between gap-3'>
                        <span>
                            {reviewsErrorData?.status === 401
                                ? 'Please log in as a provider to view client feedback.'
                                : reviewsErrorData?.data?.message || 'Failed to load reviews. Please try again.'}
                        </span>
                        <button
                            type="button"
                            onClick={() => refetchReviews()}
                            className="px-3 py-1 rounded-md bg-white border border-red-200 text-red-700 hover:bg-red-100 transition"
                        >
                            Retry
                        </button>
                    </div>
                )}
                <ReviewsList
                    reviewsData={providerReviews}
                    isLoading={reviewsLoading}
                    isError={reviewsError}
                    onRetry={refetchReviews}
                />
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
