'use client';

import { Suspense } from 'react';
import Hero from '@/components/Global/Search/Hero';
import Middle from '@/components/Global/Search/Middle';
import Mobileapp from '@/components/User/LandingPage/Mobileapp';
import TopProsSectionBlured from '@/components/User/FindArea/TopProsSectionBlured';
import TopProsSectionNotBlured from '@/components/User/FindArea/TopProsSectionNotBlured';
import AboutUs from '@/components/Global/Home/AboutUs';
import { useAuth } from '@/hooks/useAuth';

export default function SearchPage() {
    const { isAuthenticated } = useAuth();

    return (
        <div>
            <Suspense fallback={<div className="min-h-8 p-2 lg:p-10">Loading...</div>}>
                <Hero/>
            </Suspense>
            <Suspense fallback={<div className="py-16 px-8">Loading offers...</div>}>
                <Middle/>
            </Suspense>
            {isAuthenticated ? (
                <TopProsSectionNotBlured showPagination={true} />
            ) : (
                <TopProsSectionBlured showPagination={true} />
            )}
            <AboutUs/>
            <Mobileapp/>
        </div>
    );
}
