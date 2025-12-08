'use client';

import React, { Suspense, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Hero from "@/components/Global/providerprofile/Hero";
import Services from "@/components/Global/providerprofile/JacobServices";
import ClientFeedback from "@/components/Global/providerprofile/ClientFeedback";
import { useGetProviderServicesQuery } from '@/redux/api/servicesApi';

function ProviderProfileContent() {
    const searchParams = useSearchParams();
    const providerId = searchParams.get('id');
    const serviceName = searchParams.get('service');

    // Fetch provider data from API
    const { data, isLoading, isError } = useGetProviderServicesQuery(
        { providerId, serviceName },
        { skip: !providerId || !serviceName }
    );

    // Normalize feedback to match component expectations (avatar/name fields)
    const normalizedFeedback = useMemo(() => {
        if (!data?.feedback) return undefined;

        const list = (data.feedback.list || []).map((item) => ({
            rating: item.rating,
            comment: item.comment,
            createdAt: item.createdAt,
            customerAvatar: item.customer?.profileImage?.url,
            customerName: item.customer
                ? `${item.customer.firstName || ''} ${item.customer.lastName || ''}`.trim() || 'Customer'
                : 'Customer',
            serviceName: item.serviceName,
        }));

        return {
            list,
            pagination: data.feedback.pagination || {},
            aggregates: data.feedback.aggregates || {},
        };
    }, [data]);

    if (!providerId || !serviceName) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center space-y-2">
                    <p className="text-lg font-semibold text-gray-800">No provider selected.</p>
                    <p className="text-sm text-gray-600">Please select a service from the Our Services page to view provider details.</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Hero
                providerData={data?.provider}
                selectedService={data?.selectedService}
                isLoading={isLoading}
                isError={isError}
            />
            <Services
                otherServices={data?.otherServices}
                providerName={data?.provider?.businessName}
                providerId={providerId}
                isLoading={isLoading}
            />
            <ClientFeedback
                feedback={normalizedFeedback}
                isLoading={isLoading}
            />
        </div>
    );
}

export default function ProviderProfilePage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <ProviderProfileContent />
        </Suspense>
    );
}
