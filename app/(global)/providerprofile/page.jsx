'use client';

import { Suspense } from 'react';
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
                isLoading={isLoading}
            />
            <ClientFeedback
                feedback={data?.feedback}
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