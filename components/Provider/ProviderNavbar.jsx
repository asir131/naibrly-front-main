'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { LogOut, User as UserIcon, Menu, X, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import {
    useGetProviderBalanceQuery,
    useGetUserProfileQuery,
} from '@/redux/api/servicesApi';
import NotificationDropdown from '@/components/Global/Modals/NotificationDropdown';
import { useNotificationSocket } from '@/hooks/useNotificationSocket';
import { useSelector, useDispatch } from 'react-redux';
import { markAsRead, setNotifications } from '@/redux/slices/notificationsSlice';

export default function ProviderNavbar() {
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    // Get authentication state
    const { isAuthenticated, user, logout } = useAuth();
    const notifications = useSelector((state) => state.notifications.items);
    const unreadCount = notifications.filter((n) => !n.isRead).length;
    const dispatch = useDispatch();

    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    useNotificationSocket(isAuthenticated ? token : null);
    const isProvider =
        (user?.role || user?.userType)?.toLowerCase?.() === 'provider';

    // Fetch live provider balance (availableBalance, pendingPayout, etc.)
    const { data: balanceData } = useGetProviderBalanceQuery(undefined, {
        skip: !isAuthenticated || !isProvider,
    });

    // Fetch provider profile to get latest profile image/name
    const { data: profileData } = useGetUserProfileQuery(undefined, {
        skip: !isAuthenticated,
    });

    const profileUser = profileData?.user || {};
    // Ensure Image always receives a string src
    const getImageUrl = (img) => {
        if (!img) return null;
        if (typeof img === 'string') return img;
        return img.url || null;
    };

    const profileImageSrc =
        getImageUrl(profileUser?.profileImage) ||
        getImageUrl(profileUser?.businessLogo) ||
        getImageUrl(user?.profileImage) ||
        '/provider/Ellipse  (2).png';

    const providerName =
        profileUser?.businessNameRegistered ||
        profileUser?.businessName ||
        [profileUser?.firstName, profileUser?.lastName].filter(Boolean).join(' ') ||
        user?.name ||
        user?.email?.split('@')[0] ||
        'Jacob';

    const availableBalance = Number(
        balanceData?.availableBalance ?? user?.availableBalance ?? user?.balance ?? 0
    ).toFixed(2);

    // Handle logout with redirect
    const handleLogout = () => {
        logout();
        router.push('/');
    };

    // Close dropdowns when pathname changes
    useEffect(() => {
        setIsUserMenuOpen(false);
        setIsMobileMenuOpen(false);
    }, [pathname]);

    // Close user menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isUserMenuOpen && !event.target.closest('.user-menu-container')) {
                setIsUserMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isUserMenuOpen]);

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

    // Set mounted after component mounts to prevent hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    // Fetch persisted notifications on mount/login
    useEffect(() => {
        const fetchNotifications = async () => {
            if (!isAuthenticated || !token) return;
            const apiBase = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/api\/?$/, "");
            try {
                const res = await fetch(`${apiBase}/api/notifications/me`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                if (data?.success && Array.isArray(data.data)) {
                    dispatch(setNotifications(data.data));
                }
            } catch (err) {
                console.error('Failed to load notifications', err);
            }
        };
        fetchNotifications();
    }, [isAuthenticated, token, dispatch]);

    return (
        <nav className="sticky top-0 bg-white border-b border-gray-200 z-[100] shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
                <Link href="/provider/signup/analytics" className='cursor-pointer'>
                    <div className="inline-flex items-center gap-1">
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
                    {/* Home Button */}
                    <Link href="/provider/signup/analytics">
                        <Button className="bg-transparent text-gray-700 hover:text-teal-600 text-base px-3 sm:px-4 transition-all border-0 shadow-none hover:bg-transparent">
                            Home
                        </Button>
                    </Link>

                    {/* Order Button */}
                    <Link href="/provider/signup/order">
                        <Button className="bg-transparent text-gray-700 hover:text-teal-600 text-base px-3 sm:px-4 transition-all border-0 shadow-none hover:bg-transparent">
                            Order
                        </Button>
                    </Link>

                    {/* Balance Display */}
                    {mounted && isAuthenticated && isProvider && (
                        <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg">
                            <span className="text-gray-900 font-semibold text-base">
                                ${availableBalance}
                            </span>
                        </div>
                    )}

                    {/* User Profile Section */}
                    {mounted && isAuthenticated && (
                        <div className="relative user-menu-container">
                            <button
                                className="flex items-center gap-2 px-1 py-1 pr-4 bg-[#E8F5F3] rounded-full hover:bg-[#D1EBE7] transition-colors border border-transparent hover:border-teal-200"
                                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                            >
                                <Image
                                    src={profileImageSrc}
                                    alt="Provider Profile"
                                    width={40}
                                    height={40}
                                    className="rounded-full w-10 h-10 object-cover"
                                />
                               
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className={`w-5 h-5 text-gray-700 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`}
                                >
                                    <polyline points="6 9 12 15 18 9" />
                                </svg>
                            </button>

                            {isUserMenuOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-[110]">
                                    <div className="py-2">
                                        <Link href="/provider-profile">
                                            <button
                                                onClick={() => setIsUserMenuOpen(false)}
                                                className="w-full text-left px-4 py-2 hover:bg-teal-50 text-sm text-gray-700 hover:text-teal-600 flex items-center gap-2"
                                            >
                                                <UserIcon className="w-4 h-4" />
                                                My Profile
                                            </button>
                                        </Link>
                                        <button
                                            onClick={() => {
                                                setIsUserMenuOpen(false);
                                                handleLogout();
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

                    {/* Notifications */}
                    {mounted && isAuthenticated && (
                        <div className="relative">
                            <button
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors relative"
                                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                            >
                                <Bell className="w-6 h-6 text-gray-700" />
                                {unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full px-1">
                                        {unreadCount}
                                    </span>
                                )}
                            </button>
                            <NotificationDropdown
                                isOpen={isNotificationOpen}
                                notifications={notifications}
                                onClose={() => setIsNotificationOpen(false)}
                                onSelect={(notif) => {
                                    dispatch(markAsRead(notif.id));
                                    setIsNotificationOpen(false);
                                    if (notif.link) router.push(notif.link);
                                }}
                            />
                        </div>
                    )}

                    {/* Help Button */}
                    <button
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors flex items-center gap-1"
                        title="Help"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="w-6 h-6 text-gray-700"
                        >
                            <circle cx="12" cy="12" r="10" />
                            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                            <path d="M12 17h.01" />
                        </svg>
                        <span className="text-gray-700 font-medium">Help</span>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-200 absolute top-full left-0 right-0 max-h-[calc(100vh-80px)] overflow-y-auto shadow-lg">
                    <div className="px-4 py-4 space-y-3">
                        {/* Home Button */}
                        <Link href="/provider/signup/analytics" passHref>
                            <Button
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="w-full bg-white text-teal-600 hover:bg-teal-700 hover:text-white text-sm px-4 rounded-md border border-teal-600"
                            >
                                Home
                            </Button>
                        </Link>

                        {/* Order Button */}
                        <Link href="/provider/signup/order" passHref>
                            <Button
                                onClick={() => setIsMobileMenuOpen(false)}
                                variant="outline"
                                className="w-full bg-white text-teal-600 hover:bg-teal-700 hover:text-white text-sm px-4 rounded-md border border-teal-600"
                            >
                                Order
                            </Button>
                        </Link>

                        {/* User Profile Section */}
                        {isAuthenticated && (
                            <div className="border-t pt-3 space-y-2">
                                <Link href="/provider-profile" className="block">
                                    <button
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="w-full text-left px-4 py-2 hover:bg-teal-50 text-sm text-gray-700 hover:text-teal-600 flex items-center gap-2 rounded-md"
                                    >
                                        <UserIcon className="w-4 h-4" />
                                        My Profile
                                    </button>
                                </Link>
                                <button
                                    onClick={() => {
                                        setIsMobileMenuOpen(false);
                                        handleLogout();
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
        </nav>
    );
}
