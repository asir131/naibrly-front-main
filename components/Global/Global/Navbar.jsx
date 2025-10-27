'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ChevronRight, ChevronDown, LogOut, User as UserIcon, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SignInModal from '@/components/Global/Modals/WithoutSignUpModal';
import BundleOfferModal from '@/components/Global/Modals/BundleOfferModal';
import NotificationModal from '@/components/Global/Modals/NotificationModal';
import UserTypeSelectionModal from '@/components/Global/Modals/UserTypeSelectionModal';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

const SubMenuItem = ({ item }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="px-4 py-2 hover:bg-teal-50 rounded-md text-sm text-gray-700 hover:text-teal-600 cursor-pointer flex justify-between items-center">
                <span>{item.name}</span>
                {item.subServices && item.subServices.length > 0 && (
                    <ChevronRight className="w-4 h-4" />
                )}
            </div>
            {isHovered && item.subServices && item.subServices.length > 0 && (
                <div className="absolute left-full top-0 ml-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg">
                    <div className="p-2">
                        {item.subServices.map((subItem, idx) => (
                            <SubMenuItem key={idx} item={subItem} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default function Navbar() {
    const [isServiceOpen, setIsServiceOpen] = useState(false);
    const [hoveredService, setHoveredService] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isBundleModalOpen, setIsBundleModalOpen] = useState(false);
    const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSignInMenuOpen, setIsSignInMenuOpen] = useState(false);
    const [isUserTypeModalOpen, setIsUserTypeModalOpen] = useState(false);
    const [userTypeModalMode, setUserTypeModalMode] = useState('signup'); // 'signup' or 'signin'
    const [mounted, setMounted] = useState(false);
    const pathname = usePathname();

    // Get authentication state (now using Redux under the hood)
    const { isAuthenticated, user, userType, logout } = useAuth();

    // Prevent hydration mismatch by waiting for mount
    useEffect(() => {
        setMounted(true);
    }, []);

    const isHomePage = pathname === '/' || pathname === '/login' || pathname === '/signup';

    // Helper function to check if a button is active
    const isActive = (path) => pathname === path;

    // Close modal when pathname changes (user navigates to different page)
    useEffect(() => {
        setIsModalOpen(false);
        setIsServiceOpen(false);
        setIsUserMenuOpen(false);
        setIsMobileMenuOpen(false);
        setIsSignInMenuOpen(false);
        setIsUserTypeModalOpen(false);
    }, [pathname]);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Close service dropdown if clicked outside
            if (isServiceOpen && !event.target.closest('.service-dropdown-container')) {
                setIsServiceOpen(false);
            }
            // Close user menu if clicked outside
            if (isUserMenuOpen && !event.target.closest('.user-menu-container')) {
                setIsUserMenuOpen(false);
            }
            // Close sign-in menu if clicked outside
            if (isSignInMenuOpen && !event.target.closest('.signin-menu-container')) {
                setIsSignInMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isServiceOpen, isUserMenuOpen, isSignInMenuOpen]);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMobileMenuOpen]);

    const services = [
        {
            name: 'Home Repairs & Maintenance',
            subServices: [
                { name: 'Plumbing', path: '/Plumbing', subServices: [] },
                { name: 'Locksmiths', subServices: [] },
                { name: 'Appliance Repairs', subServices: [] },
                { name: 'Door & window Repairs', subServices: [] },
                { name: 'HVAC', subServices: [] },
                { name: 'Electrical', subServices: [] }
            ]
        },
        {
            name: 'Cleaning & Organization',
            subServices: [
                { name: 'House Cleaning', subServices: [] },
                { name: 'Carpet Cleaning', subServices: [] },
                { name: 'Upholstery Cleaning', subServices: [] },
                { name: 'Home Organization', subServices: [] },
                { name: 'All Furniture Cleaning', subServices: [] },
                { name: 'Junk Removal', subServices: [] },
                { name: 'Duct & Vent Cleaning', subServices: [] },
                { name: 'Pool Cleaning', subServices: [] },
                { name: 'Commercial Cleaners', subServices: [] }
            ]
        },
        {
            name: 'Renovations & Upgrades',
            subServices: [
                { name: 'General Contracting', subServices: [] },
                { name: 'Carpenters', subServices: [] },
                { name: 'Bathroom Remodeling', subServices: [] },
                { name: 'Kitchen Remodeling', subServices: [] },
                { name: 'Flooring Installation', subServices: [] },
                { name: 'Carpet Installation', subServices: [] },
                { name: 'Basement Remodeling', subServices: [] }
            ]
        },
        {
            name: 'Exterior',
            subServices: [
                {
                    name: 'Exterior Home Care', 
                    subServices: [
                        { name: 'Roofing', subServices: [] },
                        { name: 'Window Washing', subServices: [] },
                        { name: 'Chimney Sweeps', subServices: [] },
                        { name: 'Gutter Cleaning', subServices: [] },
                        { name: 'Deck Contractors', subServices: [] },
                        { name: 'Siding', subServices: [] },
                        { name: 'Basement Remodeling', subServices: [] }
                    ]
                },
                { name: 'Landscaping & Outdoor Services', 
                    subServices: [
                        { name: 'Lawn Care', subServices: [] },
                        { name: 'Landscaping Design', subServices: [] },
                        { name: 'Gardening', subServices: [] },
                        { name: 'Sprinkler System Repairs', subServices: [] },
                        { name: 'Artificial Turf Installation', subServices: [] },
                        { name: 'Stump Grinding', subServices: [] },
                        { name: 'Sod Installation', subServices: [] },
                        { name: 'Arborists', subServices: [] }

                    ] }
            ]
        },
        {
            name: 'More Services',
            subServices: [
                { name: 'Moving', 
                    subServices: [
                        { name: 'Local Movers', subServices: [] },
                        { name: 'Long Distance Movers', subServices: [] },
                        { name: 'Piano Movers', subServices: [] },
                        { name: 'Packing & Unpacking', subServices: [] },
                        { name: 'Move In & Move Out Cleaning', subServices: [] },
                        { name: 'Storage Companies', subServices: [] },
                        { name: 'Furniture Movers', subServices: [] }
                    
                    ] },
                { name: 'Installation & Assembly', 
                    subServices: [
                        { name: 'Holiday Light Hanging', subServices: [] },
                        { name: 'TV Mounting', subServices: [] },
                        { name: 'Security Camera Installation', subServices: [] },
                        { name: 'Appliance Installation', subServices: [] },
                        { name: 'Ceiling Fan Installation', subServices: [] },
                        { name: 'Generator Installation', subServices: [] },
                        { name: 'Furniture Assembly', subServices: [] }
                    ] }
            ]
        },
        { name: 'House Painter', subServices: [] }
    ];

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const ModalComponent = () => (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            {/* Backdrop overlay */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={closeModal}
            />

            {/* Modal content */}
            <div className="relative z-10 animate-in zoom-in-95 duration-200">
                <SignInModal />
            </div>
        </div>
    );

    return (
        <nav className="sticky    top-0 bg-white border-b border-gray-200 z-[100] shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
               <Link href="/" className='cursor-pointer'>
                 <div className="inline-flex  items-center gap-1">
                    <Image
                        src="/logo.png"
                        alt="Naibrly Logo"
                        width={36}
                        height={36}
                        className="aspect-square bg-white bg-[url('/logo.png')] bg-lightgray bg-cover bg-center bg-no-repeat"
                    />
                    <span className="text-[#333] font-inter text-base sm:text-xl md:text-[24px] font-bold leading-[24px] uppercase" style={{ fontFeatureSettings: "'ss01' on, 'cv01' on" }}>
                        Naibrly
                    </span>
                </div>
               </Link>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden p-2 text-teal-600 hover:bg-teal-50 rounded-md"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>

                {/* Desktop Navigation */}
                <div className="hidden md:flex gap-2 sm:gap-4 items-center">
                    {/* HOME BUTTON - All states */}
                    <Link href="/home">
                        <Button className={`${
                            isActive('/home')
                                ? 'text-teal-600 relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-teal-600'
                                : 'text-gray-700 hover:text-teal-600'
                        } bg-transparent text-base px-3 sm:px-4 transition-all border-0 shadow-none hover:bg-transparent`}>
                            Home
                        </Button>
                    </Link>

                    {/* EXPLORE SERVICES - Accessible to ALL user types (global, user, provider) */}
                    <div className="relative service-dropdown-container">
                        <Button
                            variant="outline"
                            className={`${
                                isServiceOpen
                                    ? 'text-teal-600'
                                    : 'text-gray-700 hover:text-teal-600'
                            } bg-transparent text-base px-3 sm:px-4 transition-all border-0 shadow-none hover:bg-transparent`}
                            onClick={() => setIsServiceOpen(!isServiceOpen)}
                            onMouseEnter={() => setIsServiceOpen(true)}
                        >
                            <span>Explore Services</span>
                            <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${isServiceOpen ? 'rotate-180' : ''}`} />
                        </Button>

                            {isServiceOpen && (
                                <div
                                    className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-xl z-[110]"
                                    onMouseLeave={() => setIsServiceOpen(false)}
                                >
                                <div className="p-3 space-y-1">
                                    {/* Interior Section */}
                                    <h3 className="font-semibold text-gray-900 text-base px-3 py-2">Interior</h3>
                                    <div
                                        className="relative"
                                        onMouseEnter={() => setHoveredService(0)}
                                        onMouseLeave={() => setHoveredService(null)}
                                    >
                                        <button className="w-full text-left px-2.5 py-2.5 hover:bg-[rgba(14,122,96,0.10)] rounded-md text-sm text-gray-900 transition-colors flex justify-between items-center gap-2.5 group">
                                            <span className="group-hover:text-teal-600">Home Repairs & Maintenance</span>
                                            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-teal-600" />
                                        </button>
                                        {hoveredService === 0 && (
                                            <div className="absolute left-full top-0 ml-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-[120]">
                                                <div className="p-2">
                                                    {services[0].subServices.map((sub, idx) => (
                                                        <Link href="/our-services" key={idx}>
                                                            <button className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md text-sm text-gray-900">
                                                                {sub.name}
                                                            </button>
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div
                                        className="relative"
                                        onMouseEnter={() => setHoveredService(1)}
                                        onMouseLeave={() => setHoveredService(null)}
                                    >
                                        <button className="w-full text-left px-2.5 py-2.5 hover:bg-[rgba(14,122,96,0.10)] rounded-md text-sm text-gray-900 transition-colors flex justify-between items-center gap-2.5 group">
                                            <span className="group-hover:text-teal-600">Cleaning & Organization</span>
                                            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-teal-600" />
                                        </button>
                                        {hoveredService === 1 && (
                                            <div className="absolute left-full top-0 ml-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-[120]">
                                                <div className="p-2">
                                                    {services[1].subServices.map((sub, idx) => (
                                                        <Link href="/our-services" key={idx}>
                                                            <button className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md text-sm text-gray-900">
                                                                {sub.name}
                                                            </button>
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div
                                        className="relative"
                                        onMouseEnter={() => setHoveredService(2)}
                                        onMouseLeave={() => setHoveredService(null)}
                                    >
                                        <button className="w-full text-left px-2.5 py-2.5 hover:bg-[rgba(14,122,96,0.10)] rounded-md text-sm text-gray-900 transition-colors flex justify-between items-center gap-2.5 group">
                                            <span className="group-hover:text-teal-600">Renovations & Upgrades</span>
                                            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-teal-600" />
                                        </button>
                                        {hoveredService === 2 && (
                                            <div className="absolute left-full top-0 ml-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-[120]">
                                                <div className="p-2">
                                                    {services[2].subServices.map((sub, idx) => (
                                                        <Link href="/our-services" key={idx}>
                                                            <button className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md text-sm text-gray-900">
                                                                {sub.name}
                                                            </button>
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Exterior Section */}
                                    <h3 className="font-semibold text-gray-900 text-base px-3 py-2 pt-3">Exterior</h3>
                                    <div
                                        className="relative"
                                        onMouseEnter={() => setHoveredService(3)}
                                        onMouseLeave={() => setHoveredService(null)}
                                    >
                                    <button className="w-full text-left px-2.5 py-2.5 hover:bg-[rgba(14,122,96,0.10)] rounded-md text-sm text-gray-900 transition-colors flex justify-between items-center gap-2.5 group">
                                        <span className="group-hover:text-teal-600">Exterior Home Care</span>
                                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-teal-600" />
                                    </button>
                                    {hoveredService === 3 && (
                                            <div className="absolute left-full top-0 ml-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-[120]">
                                                <div className="p-2">
                                                    {services[3].subServices[0].subServices.map((sub, idx) => (
                                                        <Link href="/our-services" key={idx}>
                                                            <button className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md text-sm text-gray-900">
                                                                {sub.name}
                                                            </button>
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div
                                        className="relative"
                                        onMouseEnter={() => setHoveredService(4)}
                                        onMouseLeave={() => setHoveredService(null)}
                                    >
                                        <button className="w-full text-left px-2.5 py-2.5 hover:bg-[rgba(14,122,96,0.10)] rounded-md text-sm text-gray-900 transition-colors flex justify-between items-center gap-2.5 group">
                                            <span className="group-hover:text-teal-600">Landscaping & Outdoor Services</span>
                                            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-teal-600" />
                                        </button>
                                        {hoveredService === 4 && (
                                            <div className="absolute left-full top-0 ml-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-[120]">
                                                <div className="p-2">
                                                    {services[3].subServices[1].subServices.map((sub, idx) => (
                                                        <Link href="/our-services" key={idx}>
                                                            <button className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md text-sm text-gray-900">
                                                                {sub.name}
                                                            </button>
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* More Services Section */}
                                    <h3 className="font-semibold text-gray-900 text-base px-3 py-2 pt-3">More Services</h3>
                                    <div
                                        className="relative"
                                        onMouseEnter={() => setHoveredService(5)}
                                        onMouseLeave={() => setHoveredService(null)}
                                    >
                                        <button className="w-full text-left px-2.5 py-2.5 hover:bg-[rgba(14,122,96,0.10)] rounded-md text-sm text-gray-900 transition-colors flex justify-between items-center gap-2.5 group">
                                            <span className="group-hover:text-teal-600">Moving</span>
                                            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-teal-600" />
                                        </button>
                                        {hoveredService === 5 && (
                                            <div className="absolute left-full top-0 ml-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-[120]">
                                                <div className="p-2">
                                                    {services[4].subServices[0].subServices.map((sub, idx) => (
                                                        <Link href="/our-services" key={idx}>
                                                            <button className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md text-sm text-gray-900">
                                                                {sub.name}
                                                            </button>
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div
                                        className="relative"
                                        onMouseEnter={() => setHoveredService(6)}
                                        onMouseLeave={() => setHoveredService(null)}
                                    >
                                        <button className="w-full text-left px-2.5 py-2.5 hover:bg-[rgba(14,122,96,0.10)] rounded-md text-sm text-gray-900 transition-colors flex justify-between items-center gap-2.5 group">
                                            <span className="group-hover:text-teal-600">Installation & Assembly</span>
                                            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-teal-600" />
                                        </button>
                                        {hoveredService === 6 && (
                                            <div className="absolute left-full top-0 ml-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-[120]">
                                                <div className="p-2">
                                                    {services[4].subServices[1].subServices.map((sub, idx) => (
                                                        <Link href="/our-services" key={idx}>
                                                            <button className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md text-sm text-gray-900">
                                                                {sub.name}
                                                            </button>
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* House Painter Section */}
                                    <h3 className="font-semibold text-gray-900 text-base px-3 py-2 pt-3">House Painter</h3>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* REQUEST button - For all states */}
                    <Link href={mounted && isAuthenticated ? (userType === 'provider' ? '/provider/requests' : '/request') : '/join-provider'}>
                        <Button className={`${
                            isActive('/request') || isActive('/provider/requests') || isActive('/join-provider')
                                ? 'text-teal-600 relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-teal-600'
                                : 'text-gray-700 hover:text-teal-600'
                        } bg-transparent text-base px-3 sm:px-4 transition-all border-0 shadow-none hover:bg-transparent`}>
                            {mounted && isAuthenticated ? 'Request' : 'Become a Pro'}
                        </Button>
                    </Link>

                    {/* BUNDLES button - Only for authenticated user type */}
                    {mounted && isAuthenticated && userType === 'user' && (
                        <Link href="/bunddle-offer">
                            <Button className={`${
                                isActive('/bundles')
                                    ? 'text-teal-600 relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-teal-600'
                                    : 'text-gray-700 hover:text-teal-600'
                            } bg-transparent text-base px-3 sm:px-4 transition-all border-0 shadow-none hover:bg-transparent`}>
                                Bundles
                            </Button>
                        </Link>
                    )}

                    {/* Authentication Section - Shows different UI based on login state */}
                    {!mounted || !isAuthenticated ? (
                        // NOT LOGGED IN STATE - Show Sign In and Create Account buttons
                        // Also shown during initial mount to prevent hydration mismatch
                        <>
                            <Button
                                onClick={() => {
                                    setUserTypeModalMode('signin');
                                    setIsUserTypeModalOpen(true);
                                }}
                                variant="outline"
                                className="border-teal-600 text-teal-600 hover:bg-teal-50 text-base px-4 sm:px-6 py-2 rounded-md transition-all"
                            >
                                Sign In
                            </Button>
                            <Button
                                onClick={() => {
                                    setUserTypeModalMode('signup');
                                    setIsUserTypeModalOpen(true);
                                }}
                                className="bg-teal-600 text-white hover:bg-teal-700 text-base px-4 sm:px-6 py-2 rounded-md transition-all border-0"
                            >
                                Create Account
                            </Button>
                        </>
                    ) : (
                        // LOGGED IN STATE - Show user profile and menu
                        <div className="relative user-menu-container">
                            <button
                                className="flex items-center gap-2 px-1 py-1 pr-4 bg-[#E8F5F3] rounded-full hover:bg-[#D1EBE7] transition-colors border border-transparent hover:border-teal-200"
                                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                            >
                                <Image
                                    src="/provider/Ellipse  (2).png"
                                    alt="User Profile"
                                    width={40}
                                    height={40}
                                    className="rounded-full w-10 h-10 object-cover"
                                />
                                <ChevronDown className={`w-5 h-5 text-gray-700 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {isUserMenuOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-[110]">
                                    <div className="py-2">
                                        <Link href="/user-profile">
                                            <button
                                                onClick={() => setIsUserMenuOpen(false)}
                                                className="w-full text-left px-4 py-2 hover:bg-teal-50 text-sm text-gray-700 hover:text-teal-600 flex items-center gap-2"
                                            >
                                                <UserIcon className="w-4 h-4" />
                                                Profile
                                            </button>
                                        </Link>
                        <button
                                            onClick={() => {
                                                setIsUserMenuOpen(false);
                                                logout();
                                            }}
                                            className="w-full text-left px-4 py-2 border-t hover:bg-red-50 text-sm text-gray-700 hover:text-red-600 flex items-center gap-2"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-200 absolute top-full left-0 right-0 max-h-[calc(100vh-80px)] overflow-y-auto shadow-lg">
                    <div className="px-4 py-4 space-y-3">
                        {/* HOME - All states */}
                        {!mounted || !isAuthenticated ? (
                            <Button
                                onClick={() => {
                                    setIsMobileMenuOpen(false);
                                    if (isHomePage && !isAuthenticated) {
                                        openModal();
                                    }
                                }}
                                className={`w-full ${
                                    isActive('/')
                                        ? 'bg-teal-600 text-white'
                                        : 'bg-white text-gray-800 hover:text-teal-600'
                                } text-sm px-4 rounded-md border border-transparent`}
                            >
                                Home
                            </Button>
                        ) : (
                            <Link href="/" passHref>
                                <Button
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`w-full ${
                                        isActive('/')
                                            ? 'bg-teal-600 text-white'
                                            : 'bg-white text-gray-800 hover:text-teal-600'
                                    } text-sm px-4 rounded-md border border-transparent`}
                                >
                                    Home
                                </Button>
                            </Link>
                        )}

                        {/* EXPLORE SERVICES - Accessible to ALL user types */}
                        <Button
                            variant="outline"
                            className={`w-full ${
                                isServiceOpen
                                    ? 'bg-teal-600 text-white'
                                    : 'bg-white text-gray-800 hover:text-teal-600'
                            } text-sm px-4 rounded-md border border-transparent`}
                            onClick={() => {
                                setIsMobileMenuOpen(false);
                                setIsServiceOpen(!isServiceOpen);
                            }}
                        >
                            Explore Services
                            <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${isServiceOpen ? 'rotate-180' : ''}`} />
                        </Button>

                        {/* BUNDLES - Only for user type */}
                        {mounted && isAuthenticated && userType === 'user' && (
                            <Link href="/bundles">
                                <Button
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    variant="outline"
                                    className={`w-full ${
                                        isActive('/bundles')
                                            ? 'bg-teal-600 text-white'
                                            : 'bg-white text-gray-800 hover:text-teal-600'
                                    } text-sm px-4 rounded-md border border-transparent`}
                                >
                                    Bundles
                                </Button>
                            </Link>
                        )}

                        {/* REQUEST - For all states */}
                        <Link href={mounted && isAuthenticated ? (userType === 'provider' ? '/provider/requests' : '/request') : '/join-provider'}>
                            <Button
                                onClick={() => setIsMobileMenuOpen(false)}
                                variant="outline"
                                className={`w-full ${
                                    isActive('/request') || isActive('/provider/requests') || isActive('/join-provider')
                                        ? 'bg-teal-600 text-white'
                                        : 'bg-white text-gray-800 hover:text-teal-600'
                                } text-sm px-4 rounded-md border border-transparent`}
                            >
                                {mounted && isAuthenticated ? 'Request' : 'Become a Pro'}
                            </Button>
                        </Link>

                        {!mounted || !isAuthenticated ? (
                            <div className="border-t pt-3 space-y-2">
                                <Button
                                    onClick={() => {
                                        setUserTypeModalMode('signin');
                                        setIsUserTypeModalOpen(true);
                                        setIsMobileMenuOpen(false);
                                    }}
                                    variant="outline"
                                    className="w-full border-teal-600 text-teal-600 hover:bg-teal-50 text-sm px-4 rounded-md"
                                >
                                    Sign In
                                </Button>
                                <Button
                                    onClick={() => {
                                        setUserTypeModalMode('signup');
                                        setIsUserTypeModalOpen(true);
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className="w-full bg-teal-600 text-white hover:bg-teal-700 text-sm px-4 rounded-md"
                                >
                                    Create Account
                                </Button>
                            </div>
                        ) : (
                            <div className="border-t pt-3 space-y-2">
                                <Link href="/user-profile" className="block">
                                    <button
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="w-full text-left px-4 py-2 hover:bg-teal-50 text-sm text-gray-700 hover:text-teal-600 flex items-center gap-2 rounded-md"
                                    >
                                        <UserIcon className="w-4 h-4" />
                                        Profile
                                    </button>
                                </Link>
                                <button
                                    onClick={() => {
                                        setIsMobileMenuOpen(false);
                                        logout();
                                    }}
                                    className="w-full text-left px-4 py-2 hover:bg-red-50 text-sm text-gray-700 hover:text-red-600 flex items-center gap-2 rounded-md"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Only show modal when NOT authenticated */}
            {isModalOpen && (!mounted || !isAuthenticated) && <ModalComponent />}

            {/* Bundle Offer Modal */}
            <BundleOfferModal
                isOpen={isBundleModalOpen}
                onClose={() => setIsBundleModalOpen(false)}
            />

            {/* Notification Modal */}
            <NotificationModal
                isOpen={isNotificationModalOpen}
                onClose={() => setIsNotificationModalOpen(false)}
            />

            {/* User Type Selection Modal */}
            <UserTypeSelectionModal
                isOpen={isUserTypeModalOpen}
                onClose={() => setIsUserTypeModalOpen(false)}
                mode={userTypeModalMode}
            />
        </nav>
    );
}