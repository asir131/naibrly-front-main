import { Suspense } from 'react';
import Hero from '@/components/Global/Search/Hero';
import LowerMiddle from '@/components/Global/Home/LowerMiddle';
import Mobileapp from '@/components/User/LandingPage/Mobileapp';
import Offers from '@/components/Global/Bunddle-Offer/Offers';


export default function bunddleOfferPage() {
    return (
        <div>
            <Suspense fallback={<div className="min-h-8 p-2 lg:p-10">Loading...</div>}>
                <Hero/>
            </Suspense>
            <Offers/>
            <Mobileapp/>
        </div>
    );
}