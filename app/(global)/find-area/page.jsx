'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Hero from '@/components/Global/Search/Hero';
import Middle from '@/components/Global/Search/Middle';
import Mobileapp from '@/components/User/LandingPage/Mobileapp';
import TopProsSectionNotBlured from '@/components/User/FindArea/TopProsSectionNotBlured';
import AboutUs from '@/components/Global/Home/AboutUs';
import { useSearchProvidersMutation, useLazySearchBundlesQuery } from '@/redux/api/servicesApi';

function SearchPageContent() {
    const searchParams = useSearchParams();
    const [searchProviders, { data: providerResults, isLoading: isLoadingProviders }] = useSearchProvidersMutation();
    const [searchBundles, { data: bundleResults, isLoading: isLoadingBundles }] = useLazySearchBundlesQuery();
    const [hasSearched, setHasSearched] = useState(false);

    // Get search params from URL (trim whitespace to handle accidental spaces)
    const serviceParam = searchParams.get('service')?.trim() || null;
    const zipParam = searchParams.get('zip')?.trim() || null;

    // Combined loading state
    const isLoading = isLoadingProviders || isLoadingBundles;

    // Trigger search when page loads with params or when search is triggered
    useEffect(() => {
        if (serviceParam && zipParam) {
            handleSearch(serviceParam, zipParam);
        }
    }, [serviceParam, zipParam]);

    const handleSearch = async (serviceName, zipCode) => {
        if (!serviceName || !zipCode) return;

        try {
            // Fetch both bundles and providers in parallel
            await Promise.all([
                searchProviders({ serviceName, zipCode }),
                searchBundles({ searchQuery: serviceName, zipCode })
            ]);
            setHasSearched(true);
        } catch (err) {
            console.error('Search error:', err);
        }
    };

    return (
        <div>
            <Suspense fallback={<div className="min-h-8 p-2 lg:p-10">Loading...</div>}>
                <Hero
                    onSearch={handleSearch}
                    isSearching={isLoading}
                    providerResults={providerResults}
                    hasSearched={hasSearched}
                />
            </Suspense>
            <Suspense fallback={<div className="py-16 px-8">Loading offers...</div>}>
                <Middle
                    bundles={bundleResults?.bundles || []}
                    searchSummary={bundleResults?.searchSummary}
                    providerResults={providerResults}
                    isLoading={isLoading}
                    hasSearched={hasSearched}
                />
            </Suspense>
            <TopProsSectionNotBlured
                showPagination={true}
                providers={providerResults?.providers || []}
                relatedServices={providerResults?.relatedServices || []}
                isLoading={isLoading}
                hasSearched={hasSearched}
                searchCriteria={providerResults?.searchCriteria}
            />
            <AboutUs/>
            <Mobileapp/>
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <SearchPageContent />
        </Suspense>
    );
}
