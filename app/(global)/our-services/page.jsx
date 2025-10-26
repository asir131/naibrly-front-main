import { Suspense } from 'react';
import Hero from '@/components/Global/Search/Hero';
import Services from '@/components/Global/OurServices/Services';
import Mobileapp from '@/components/User/LandingPage/Mobileapp';

export default function OurServicesPage() {
    return (
        <div>
            <Suspense fallback={<div className="min-h-8 p-2 lg:p-10">Loading...</div>}>
                <Hero/>
            </Suspense>
            <Services/>
            <Mobileapp/>
        </div>
    );
}