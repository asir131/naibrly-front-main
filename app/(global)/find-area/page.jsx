'use client';

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
            <Hero/>
            <Middle/>
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
