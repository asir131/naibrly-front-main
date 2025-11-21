'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Hero from '@/components/Global/Search/Hero';
import Services from '@/components/Global/OurServices/Services';
import Mobileapp from '@/components/User/LandingPage/Mobileapp';

function OurServicesContent() {
    const searchParams = useSearchParams();
    const serviceType = searchParams.get('service');
    const zipCode = searchParams.get('zip');

    return (
        <div>
            <Suspense fallback={<div className="min-h-8 p-2 lg:p-10">Loading...</div>}>
                <Hero />
            </Suspense>
            <Services serviceType={serviceType} zipCode={zipCode} />
            <Mobileapp />
        </div>
    );
}

export default function OurServicesPage() {
    return (
        <Suspense fallback={<div className="min-h-8 p-2 lg:p-10">Loading...</div>}>
            <OurServicesContent />
        </Suspense>
    );
}