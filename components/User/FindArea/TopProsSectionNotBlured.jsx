"use client"
import { Images } from '@/public/usersImg/ExportImg'
import Image from 'next/image'
import React, { useState, useMemo } from 'react'
import PaginationControls from './PaginationControls'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'

const TopProsSectionNotBlured = ({
    showPagination = false,
    providers = [],
    relatedServices = [],
    isLoading = false,
    hasSearched = false,
    searchCriteria = null
}) => {
    const { isAuthenticated } = useAuth();
    const router = useRouter();

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    // Transform API providers to display format
    const transformedProviders = useMemo(() => {
        if (!providers || providers.length === 0) return [];
        return providers.map((item) => ({
            id: item.provider.id,
            name: item.provider.businessName,
            initials: item.provider.businessName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase(),
            rating: item.provider.rating || 0,
            reviews: item.provider.totalReviews || 0,
            location: `${item.provider.serviceArea?.city || ''}, ${item.provider.serviceArea?.state || ''} ${item.provider.serviceArea?.zipCode || ''}`.trim(),
            description: item.provider.description || `${item.service.name} services`,
            price: `$${item.service.hourlyRate}/hr`,
            imageUrl: item.provider.businessLogo?.url || 'https://randomuser.me/api/portraits/men/1.jpg',
            active: item.provider.serviceArea?.isActive || false,
            experience: item.provider.experience,
            phone: item.provider.phone,
            email: item.provider.email,
            serviceName: item.service.name,
            providerServiceId: item.service.providerServiceId
        }));
    }, [providers]);

    // Use API data if available, otherwise fallback to hardcoded data
    const displayProfiles = transformedProviders;

    // Render stars dynamically based on rating
    const renderStars = (rating) => {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - Math.ceil(rating);

        const stars = [];

        // Add full stars
        for (let i = 0; i < fullStars; i++) {
            stars.push(<span key={`full-${i}`}>&#9733;</span>);
        }

        // Add half star if applicable
        if (halfStar) {
            stars.push(<span key="half">&#9733;</span>);
        }

        // Add empty stars
        for (let i = 0; i < emptyStars; i++) {
            stars.push(<span key={`empty-${i}`}>&#9734;</span>);
        }

        return stars;
    };

    // Calculate the range of profiles to display
    const indexOfLastProfile = currentPage * rowsPerPage;
    const indexOfFirstProfile = indexOfLastProfile - rowsPerPage;
    const currentProfiles = displayProfiles.slice(indexOfFirstProfile, indexOfLastProfile);

    // Calculate total pages
    const totalPages = Math.ceil(displayProfiles.length / rowsPerPage);

    return (
        <div className='top_pros relative'>
            <div className='px-4 md:px-8 lg:px-[306px]'>
                <h1 className='top_pros_head'>
                    {searchCriteria ? `${searchCriteria.serviceName} Pros in ${searchCriteria.zipCode}` : 'Top pros for your project'}
                </h1>

                {/* Loading State */}
                {isLoading && (
                    <div className="flex justify-center items-center py-12">
                        <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
                        <span className="ml-3 text-gray-600">Finding providers...</span>
                    </div>
                )}

                {/* No Results State */}
                {hasSearched && !isLoading && transformedProviders.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-600 text-lg">No providers available in your area.</p>
                    </div>
                )}

                <div className={`mt-[28px] flex flex-col gap-[18px] ${!isAuthenticated ? 'filter blur-sm pointer-events-none' : ''} ${isLoading ? 'hidden' : ''}`}>
                    {/* Price Range Bar */}
                    <div className='user_card flex justify-center items-center'>
                        <div className='flex flex-col gap-2'>
                            <div className=''>
                                <Image src={Images.top_group} alt='top_group' />
                            </div>
                            <div className='flex justify-between items-center'>
                                <span className='text-[#000] text-[14px] font-medium'>$10</span>
                                <span className='text-[#7F7F7F] text-[14px] font-medium'>avg. rate is $56.78/hr</span>
                                <span className='text-[#000] text-[14px] font-medium'>$150+</span>
                            </div>
                        </div>
                    </div>

                    {/* User Cards */}
                    {currentProfiles.map((user, index) => {
                        return (
                            <div className='user_card flex justify-between' key={user.id || user.name || index}>
                                {/* Profile icon and details */}
                                <div className='flex justify-center items-start gap-[18px]'>
                                    <div className='user_profile flex justify-center items-center'>
                                        <img src={user.imageUrl} alt={user.name} className="w-16 h-16 rounded-full" />
                                    </div>
                                    <div className='lg:w-[749px] flex flex-col gap-[6px]'>
                                        <div className='flex items-center gap-3'>
                                            <h1 className='text-[#2F3033] text-[18px] font-medium'>{user.name}</h1>
                                            <span>
                                                {
                                                    user.active ? <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none">
                                                        <rect width="28" height="28" rx="14" fill="#00CD49" fillOpacity="0.1" />
                                                        <circle cx="14" cy="14" r="7" fill="#0E7A60" />
                                                    </svg> : <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none">
                                                        <rect width="28" height="28" rx="14" fill="#EBEBEB" />
                                                        <circle cx="14" cy="14" r="7" fill="#666666" />
                                                    </svg>
                                                }
                                            </span>
                                        </div>
                                        {/* Rating */}
                                        <div className='star'>Exceptional {user.rating} {renderStars(user.rating)} ({user.reviews})</div>
                                        {/* Location */}
                                        <div className='flex gap-2 items-center'>
                                            <span>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                    <path d="M11.9989 13.4295C13.722 13.4295 15.1189 12.0326 15.1189 10.3095C15.1189 8.58633 13.722 7.18945 11.9989 7.18945C10.2758 7.18945 8.87891 8.58633 8.87891 10.3095C8.87891 12.0326 10.2758 13.4295 11.9989 13.4295Z" stroke="#0E7A60" strokeWidth="1.5" />
                                                    <path d="M3.62166 8.49C5.59166 -0.169998 18.4217 -0.159997 20.3817 8.5C21.5317 13.58 18.3717 17.88 15.6017 20.54C13.5917 22.48 10.4117 22.48 8.39166 20.54C5.63166 17.88 2.47166 13.57 3.62166 8.49Z" stroke="#0E7A60" strokeWidth="1.5" />
                                                </svg>
                                            </span>
                                            <span>{user.location}</span>
                                        </div>
                                        <p className='star_des'>{user.description}</p>
                                    </div>
                                </div>

                                {/* Estimated price and View Profile */}
                                <div className='flex flex-col justify-between h-full gap-[77px]'>
                                    <div>
                                        <p className='text-[#2F3033] text-[18px] font-medium'>{user.price}</p>
                                        <span className='text-[18px] font-medium text-[#676D73]'>Estimated price</span>
                                    </div>
                                    <div className='mt-auto'>
                                        <button
                                            onClick={() => router.push(`/providerprofile?id=${user.id}&service=${encodeURIComponent(user.serviceName)}`)}
                                            className='view_button text-[18px] font-medium text-[#FFFFFF] bg-teal-600 hover:bg-teal-700 px-6 py-3 rounded-lg transition-colors duration-200 cursor-pointer shadow-md hover:shadow-lg'
                                        >
                                            View Profile
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Pagination Controls */}
                {showPagination && (
                    <PaginationControls
                        currentPage={currentPage}
                        totalPages={totalPages}
                        rowsPerPage={rowsPerPage}
                        setRowsPerPage={setRowsPerPage}
                        setCurrentPage={setCurrentPage}
                    />
                )}
            </div>
        </div>
    )
}

export default TopProsSectionNotBlured;
