"use client"
import RequestsTabs from '@/components/RequestsTabs'
import React from 'react'
import { useGetProviderServiceRequestsQuery } from '@/redux/api/servicesApi'

const OrderPage = () => {
    const { data: requestsData, isLoading } = useGetProviderServiceRequestsQuery()

    // Open: accepted status
    const openRequests = requestsData?.serviceRequests?.items?.filter(
        req => req.status === 'accepted'
    ) || []

    const openBundles = requestsData?.bundles?.items?.filter(
        bundle => bundle.status === 'accepted'
    ) || []

    // Closed: completed, cancelled, declined statuses
    const closedRequests = requestsData?.serviceRequests?.items?.filter(
        req => ['completed', 'cancelled', 'declined'].includes(req.status)
    ) || []

    const closedBundles = requestsData?.bundles?.items?.filter(
        bundle => ['completed', 'cancelled', 'declined'].includes(bundle.status)
    ) || []

    return (
        <div className='analytics_layout md:px-[126px] md:py-[80px] max-sm:py-6 max-sm:px-6'>
            <RequestsTabs
                openRequests={openRequests}
                openBundles={openBundles}
                closedRequests={closedRequests}
                closedBundles={closedBundles}
                isLoading={isLoading}
            />
        </div>
    )
}

export default OrderPage
