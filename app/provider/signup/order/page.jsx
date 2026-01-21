"use client"
import RequestsTabs from '@/components/RequestsTabs'
import React from 'react'
import { useGetProviderServiceRequestsQuery } from '@/redux/api/servicesApi'

const OrderPage = () => {
    const { data: requestsData, isLoading } = useGetProviderServiceRequestsQuery(undefined, {
        refetchOnFocus: true,
        refetchOnReconnect: true,
    })

    const deriveBundleParticipantStatus = (bundle) => {
        const participant = bundle?.participant;
        const participantStatus = bundle?.participantStatus || participant?.status;
        const completionStatus = participant?.completionStatus;

        if (participantStatus === 'cancelled') return 'cancelled';
        if (completionStatus === 'completed') return 'completed';
        if (completionStatus === 'accepted') return 'accepted';
        if (completionStatus === 'pending') return 'pending';
        return bundle?.status || 'pending';
    };

    const bundlesWithParticipantStatus = (requestsData?.bundles?.items || []).map((bundle) => ({
        ...bundle,
        status: deriveBundleParticipantStatus(bundle),
    }));

    // Open: accepted status
    const openRequests = requestsData?.serviceRequests?.items?.filter(
        req => req.status === 'accepted'
    ) || []

    const openBundles = bundlesWithParticipantStatus.filter(
        bundle => bundle.status === 'accepted'
    )

    // Closed: completed, cancelled, declined statuses
    const closedRequests = requestsData?.serviceRequests?.items?.filter(
        req => ['completed', 'cancelled', 'declined'].includes(req.status)
    ) || []

    const closedBundles = bundlesWithParticipantStatus.filter(
        bundle => ['completed', 'cancelled', 'declined'].includes(bundle.status)
    )

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
