'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useGetBundleByTokenQuery, useJoinBundleByTokenMutation } from '@/redux/api/servicesApi';
import { Button } from '@/components/ui/button';
import { Loader2, Calendar, Clock, MapPin, Users, DollarSign, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function JoinBundlePage() {
  const params = useParams();
  const router = useRouter();
  const shareToken = params.shareToken;
  const [isJoining, setIsJoining] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Check if user is logged in
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      if (!token) {
        // If not logged in, redirect to login with return URL
        const returnUrl = `/join-bundle/${shareToken}`;
        router.push(`/Login?redirect=${encodeURIComponent(returnUrl)}`);
      } else {
        setIsAuthenticated(true);
      }
    }
  }, [shareToken, router]);

  // Fetch bundle details only if authenticated
  const { data: bundleResponse, isLoading: isFetchingBundle, error } = useGetBundleByTokenQuery(shareToken, {
    skip: !isAuthenticated,
  });

  const [joinBundleByToken] = useJoinBundleByTokenMutation();

  const handleJoinBundle = async () => {
    try {
      setIsJoining(true);
      const response = await joinBundleByToken(shareToken).unwrap();

      console.log('Successfully joined bundle:', response);

      // Show success modal instead of immediate redirect
      setIsJoining(false);
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Failed to join bundle:', error);

      // Check if the error is "already part of this bundle"
      const errorMessage = error?.data?.message || error?.message || '';

      if (errorMessage.toLowerCase().includes('already part of this bundle') ||
          errorMessage.toLowerCase().includes('already joined')) {
        // Show success modal anyway since they're already in the bundle
        setIsJoining(false);
        setShowSuccessModal(true);
      } else {
        // Show error for other issues
        toast.error(
          errorMessage || 'Failed to join bundle. Please try again.'
        );
        setIsJoining(false);
      }
    }
  };

  const handleGoToRequests = () => {
    router.push('/request');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-teal-500" />
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  if (isFetchingBundle) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-teal-500" />
          <p className="text-gray-600">Loading bundle details...</p>
        </div>
      </div>
    );
  }

  if (error || !bundleResponse?.data?.bundle) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Bundle Not Found</h1>
          <p className="text-gray-600 mb-6">
            This bundle may have expired or is no longer available.
          </p>
          <Button
            onClick={() => router.push('/')}
            className="bg-teal-500 hover:bg-teal-600 text-white"
          >
            Go to Home
          </Button>
        </div>
      </div>
    );
  }

  const bundle = bundleResponse.data.bundle;
  const pricing = bundle.pricing || {};

  // Check if the current user is already a participant
  let currentUserId = null;
  if (typeof window !== 'undefined') {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        currentUserId = user._id || user.id;
      }
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
    }
  }

  const isAlreadyParticipant = currentUserId && bundle.participants?.some(
    (participant) => {
      const participantId = typeof participant.customer === 'string'
        ? participant.customer
        : participant.customer?._id;
      return participantId === currentUserId;
    }
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-500 to-teal-600 p-6 text-white">
            <h1 className="text-3xl font-bold mb-2">Join Bundle</h1>
            <p className="text-teal-50">You've been invited to join this service bundle</p>
          </div>

          {/* Bundle Details */}
          <div className="p-6 space-y-6">
            {/* Title & Description */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{bundle.title}</h2>
              <p className="text-gray-600">{bundle.description}</p>
            </div>

            {/* Category */}
            <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Category</h3>
                <p className="text-gray-600">{bundle.category} - {bundle.categoryTypeName}</p>
              </div>
            </div>

            {/* Services */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Included Services</h3>
              <div className="space-y-2">
                {bundle.services && bundle.services.map((service, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{service.name}</p>
                      <p className="text-sm text-gray-500">
                        ${service.hourlyRate}/hr × {service.estimatedHours} hours
                      </p>
                    </div>
                    <p className="font-semibold text-gray-900">
                      ${service.hourlyRate * service.estimatedHours}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                <Calendar className="w-5 h-5 text-teal-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900">Service Date</h3>
                  <p className="text-gray-600">
                    {new Date(bundle.serviceDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                <Clock className="w-5 h-5 text-teal-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900">Time</h3>
                  <p className="text-gray-600">{bundle.serviceTimeStart} - {bundle.serviceTimeEnd}</p>
                </div>
              </div>
            </div>

            {/* Location */}
            {bundle.address && (
              <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                <MapPin className="w-5 h-5 text-teal-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900">Location</h3>
                  <p className="text-gray-600">
                    {bundle.address.street}
                    {bundle.address.aptSuite && `, ${bundle.address.aptSuite}`}
                    <br />
                    {bundle.address.city}, {bundle.address.state} {bundle.zipCode}
                  </p>
                </div>
              </div>
            )}

            {/* Participants */}
            <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
              <Users className="w-5 h-5 text-teal-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Available Spots</h3>
                <p className="text-gray-600">
                  {bundle.availableSpots} of {bundle.maxParticipants} spots remaining
                </p>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-teal-500 h-2 rounded-full transition-all"
                    style={{ width: `${((bundle.maxParticipants - bundle.availableSpots) / bundle.maxParticipants) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-gradient-to-r from-green-50 to-teal-50 p-6 rounded-lg border-2 border-green-200">
              <div className="flex items-start space-x-3">
                <DollarSign className="w-6 h-6 text-green-600 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">Bundle Pricing</h3>
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl font-bold text-gray-900">${pricing.finalPrice || 0}</span>
                    {pricing.originalPrice > pricing.finalPrice && (
                      <>
                        <span className="text-lg line-through text-gray-400">${pricing.originalPrice || 0}</span>
                        <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          Save {pricing.discountPercent || 0}%
                        </span>
                      </>
                    )}
                  </div>
                  {pricing.discountAmount > 0 && (
                    <p className="text-sm text-green-700 mt-1">
                      You save ${pricing.discountAmount} by bundling!
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Creator Info */}
            {bundle.creator && (
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {bundle.creator.firstName?.[0]}{bundle.creator.lastName?.[0]}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Bundle Creator</h3>
                  <p className="text-gray-600">
                    {bundle.creator.firstName} {bundle.creator.lastName}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Action Button or Already Joined Message */}
          <div className="p-6 bg-gray-50 border-t">
            {isAlreadyParticipant ? (
              /* Already Joined - Show Success Message */
              <div className="text-center">
                <div className="mb-4 flex justify-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  You Have Already Joined This Bundle!
                </h3>
                <p className="text-gray-600 mb-6">
                  You're all set! You can view this bundle in your requests.
                </p>
                <Button
                  onClick={handleGoToRequests}
                  className="w-full bg-teal-500 hover:bg-teal-600 text-white h-12 rounded-lg font-semibold text-base"
                >
                  Go to My Requests
                </Button>
              </div>
            ) : (
              /* Not Joined Yet - Show Join Button */
              <>
                <Button
                  onClick={handleJoinBundle}
                  disabled={isJoining || bundle.availableSpots === 0 || bundle.status !== 'pending'}
                  className="w-full bg-teal-500 hover:bg-teal-600 text-white h-14 text-lg font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isJoining ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      Joining Bundle...
                    </>
                  ) : bundle.availableSpots === 0 ? (
                    'Bundle is Full'
                  ) : bundle.status !== 'pending' ? (
                    'Bundle is No Longer Available'
                  ) : (
                    'Join This Bundle'
                  )}
                </Button>

                {bundle.availableSpots > 0 && bundle.status === 'pending' && (
                  <p className="text-center text-sm text-gray-500 mt-3">
                    By joining, you agree to the bundle terms and pricing
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowSuccessModal(false)} />

          {/* Modal Content */}
          <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-in zoom-in-95 duration-200">
            <div className="text-center">
              {/* Success Icon */}
              <div className="mb-6 flex justify-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-12 h-12 text-green-600" />
                </div>
              </div>

              {/* Success Message */}
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                You Have Joined the Bundle!
              </h2>

              <p className="text-gray-600 mb-8">
                Great! You've successfully joined this bundle. You can now view it in your requests.
              </p>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={handleGoToRequests}
                  className="w-full bg-teal-500 hover:bg-teal-600 text-white h-12 rounded-lg font-semibold text-base"
                >
                  Go to My Requests
                </Button>

                <Button
                  onClick={() => setShowSuccessModal(false)}
                  className="w-full bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-300 h-12 rounded-lg font-semibold text-base"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
