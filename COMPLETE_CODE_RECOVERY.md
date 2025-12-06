# Complete Code Recovery - Previous Week's Work

This document contains ALL code files and changes made during the previous week's session.

---

## 1. Backend - Service Request Controller (NEW ENDPOINT)

**File: `naibrly-backend/src/controllers/serviceRequestController.js`**

Add this at the END of the file (after line 1574):

```javascript
// Get service request by ID
exports.getServiceRequestById = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.user.userId;
    const userRole = req.user.role;

    // Find the service request and populate necessary fields
    const serviceRequest = await ServiceRequest.findById(requestId)
      .populate('service', 'name price image rating reviews')
      .populate('customer', 'firstName lastName profileImage email phone')
      .populate('provider', 'firstName lastName businessNameRegistered businessLogo profileImage rating totalReviews')
      .lean();

    if (!serviceRequest) {
      return res.status(404).json({
        success: false,
        message: 'Service request not found'
      });
    }

    // Check if user has access to this service request
    const isCustomer = serviceRequest.customer?._id?.toString() === userId;
    const isProvider = serviceRequest.provider?._id?.toString() === userId;

    if (!isCustomer && !isProvider && userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to view this service request'
      });
    }

    return res.status(200).json({
      success: true,
      data: serviceRequest
    });
  } catch (error) {
    console.error('Get service request by ID error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch service request',
      error: error.message
    });
  }
};
```

---

## 2. Backend - Service Request Routes (NEW ROUTE)

**File: `naibrly-backend/src/routes/serviceRequests.js`**

Update the imports and add new route:

```javascript
const express = require("express");
const {
  createServiceRequest,
  getCustomerRequests,
  getCustomerAllRequests,
  getProviderRequests,
  updateRequestStatus,
  cancelRequest,
  addReview,
  getProvidersByService,
  testProviderServices,
  getProviderRequestsByStatus,
  getProviderDashboardStats,
  getProvidersByServiceAndZip,
  getServiceRequestById,  // ADD THIS LINE
} = require("../controllers/serviceRequestController");
const { auth } = require("../middleware/auth");

const router = express.Router();

// Test route for debugging
router.get("/test-provider/:providerId", testProviderServices);

// Customer routes
router.post("/", auth, createServiceRequest);
router.get("/customer/my-requests", auth, getCustomerRequests);
router.get("/customer/my-all-requests", auth, getCustomerAllRequests);
router.get("/:requestId", auth, getServiceRequestById);  // ADD THIS LINE
router.patch("/:requestId/cancel", auth, cancelRequest);
router.post("/:requestId/review", auth, addReview);

// Rest of the file stays the same...
```

---

## 3. Frontend - Redux API (NEW ENDPOINTS)

**File: `redux/api/servicesApi.js`**

Add these TWO new endpoints. Find the line that says `// Create a new service request` (around line 249) and ADD BEFORE it:

```javascript
    // Get single service request by ID
    getServiceRequestById: builder.query({
      query: (requestId) => `/service-requests/${requestId}`,
      providesTags: (result, error, requestId) => [{ type: 'ServiceRequests', id: requestId }],
    }),
```

Find the line that says `// Create a new bundle` (around line 291) and ADD BEFORE it:

```javascript
    // Get single bundle by ID
    getBundleById: builder.query({
      query: (bundleId) => `/bundles/${bundleId}`,
      providesTags: (result, error, bundleId) => [{ type: 'Bundles', id: bundleId }],
    }),
```

Then find the exports at the bottom of the file and ADD these two hooks:

```javascript
export const {
  // ... existing exports ...
  useGetServiceRequestByIdQuery,  // ADD THIS
  useGetBundleByIdQuery,          // ADD THIS
  // ... rest of exports ...
} = servicesApi;
```

The complete export section should look like:

```javascript
export const {
  useSubmitVerifyInformationMutation,
  useUpdateProviderZipCodeMutation,
  useSubmitPayoutInformationMutation,
  useUpdateProviderProfileMutation,
  // Service hooks
  useGetServicesQuery,
  useGetServicesByCategoryQuery,
  useGetServiceByIdQuery,
  useGetMyServiceRequestsQuery,
  useGetServiceRequestByIdQuery,  // NEW
  useCreateServiceRequestMutation,
  useUpdateServiceRequestStatusMutation,
  useCancelServiceRequestMutation,
  useGetBundleByIdQuery,  // NEW
  useCreateBundleMutation,
  useGetMyBundlesQuery,
  useGetAllBundlesQuery,
  useGetNearbyBundlesQuery,
  useJoinBundleMutation,
  useGetBundleByTokenQuery,
  useJoinBundleByTokenMutation,
  useGetNearbyServicesQuery,
  // Password reset hooks
  useForgotPasswordMutation,
  useVerifyOtpMutation,
  useResendOtpMutation,
  useResetPasswordMutation,
  // Search hooks
  useSearchProvidersMutation,
  useSearchProvidersByServiceQuery,
  useSearchBundlesQuery,
  useLazySearchBundlesQuery,
  // Provider hooks
  useGetProviderServicesQuery,
  useGetUserProfileQuery,
  useGetVerifyInfoStatusQuery,
  useGetProviderZipQuery,
  useGetProviderServiceAreasQuery,
  useAddProviderServiceAreaMutation,
  useGetProviderAnalyticsQuery,
  useGetProviderReviewsQuery,
  useGetProviderBalanceQuery,
  useGetPaymentHistoryQuery,
  useGetProviderServiceRequestsQuery,
  useGetProviderNearbyBundlesQuery,
  // Provider services hooks
  useGetProviderServicesByIdQuery,
  useGetAllAvailableServicesQuery,
  useAddProviderServiceMutation,
  // Bundle status update hook
  useUpdateBundleStatusMutation,
} = servicesApi;
```

---

## 4. Frontend - Conversation Page (COMPLETELY NEW FILE)

**File: `app/(global)/conversation/[slug]/page.jsx`**

Create this NEW file with COMPLETE content:

```jsx
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import ChatInterface from '@/components/ChatInterface';
import { useGetServiceRequestByIdQuery, useGetBundleByIdQuery } from '@/redux/api/servicesApi';

export default function ConversationPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug;

  // Parse slug to determine type and ID
  const [requestType, setRequestType] = useState(null); // 'service' or 'bundle'
  const [itemId, setItemId] = useState(null);

  useEffect(() => {
    if (slug) {
      if (slug.startsWith('request-')) {
        setRequestType('service');
        setItemId(slug.replace('request-', ''));
      } else if (slug.startsWith('bundle-')) {
        setRequestType('bundle');
        setItemId(slug.replace('bundle-', ''));
      }
    }
  }, [slug]);

  // Fetch data based on type
  const { data: serviceData, isLoading: serviceLoading } = useGetServiceRequestByIdQuery(itemId, {
    skip: requestType !== 'service' || !itemId,
  });

  const { data: bundleData, isLoading: bundleLoading } = useGetBundleByIdQuery(itemId, {
    skip: requestType !== 'bundle' || !itemId,
  });

  const isLoading = serviceLoading || bundleLoading;

  // Prepare request object for ChatInterface
  const getRequestObject = () => {
    console.log('🔍 Getting request object:', { requestType, serviceData, bundleData, itemId });

    if (requestType === 'service' && serviceData?.data) {
      const request = serviceData.data;
      console.log('📦 Service request data:', request);
      return {
        id: itemId, // Use the itemId from the slug, not request._id
        type: 'service',
        title: request.serviceType || request.service?.name || 'Service Request',
        description: request.problem || request.note || request.description || 'No description provided',
        image: request.service?.image?.url || request.provider?.profileImage?.url || 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=400&h=300&fit=crop',
        avgPrice: request.price ? `$${request.price}/hr` : request.service?.price ? `$${request.service.price}` : 'N/A',
        rating: request.service?.rating || request.provider?.rating || 0,
        reviews: request.service?.reviews || 0,
        date: request.scheduledDate ? new Date(request.scheduledDate).toLocaleDateString('en-US', {
          day: 'numeric',
          month: 'short',
          hour: '2-digit',
          minute: '2-digit',
        }) : 'N/A',
        status: request.status,
        cancellationReason: request.cancellationReason,
        cancelledBy: request.cancelledBy,
      };
    } else if (requestType === 'bundle' && bundleData?.data) {
      const bundle = bundleData.data;
      console.log('📦 Bundle data:', bundle);
      return {
        id: itemId, // Use the itemId from the slug, not bundle._id
        type: 'bundle',
        title: bundle.title || bundle.name || 'Bundle Request',
        description: bundle.description || 'No description provided',
        image: bundle.image?.url || bundle.provider?.businessLogo?.url || 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=400&h=300&fit=crop',
        avgPrice: bundle.pricing?.finalPrice ? `$${bundle.pricing.finalPrice}` : bundle.finalPrice ? `$${bundle.finalPrice}` : 'N/A',
        rating: bundle.rating || bundle.provider?.rating || 0,
        reviews: bundle.reviews || 0,
        date: bundle.serviceDate ? new Date(bundle.serviceDate).toLocaleDateString('en-US', {
          day: 'numeric',
          month: 'short',
        }) : 'N/A',
        status: bundle.status,
        cancellationReason: bundle.cancellationReason,
        cancelledBy: bundle.cancelledBy,
      };
    }
    return null;
  };

  const requestObject = getRequestObject();

  const handleCancel = () => {
    // TODO: Implement cancel functionality
    console.log('Cancel conversation');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading conversation...</p>
        </div>
      </div>
    );
  }

  if (!requestObject) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Conversation not found</p>
          <button
            onClick={() => router.back()}
            className="text-teal-600 hover:text-teal-700 font-medium"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back</span>
        </button>

        {/* Chat Interface */}
        <ChatInterface
          request={requestObject}
          onCancel={handleCancel}
          status={requestObject.status}
          cancellationReason={requestObject.cancellationReason}
          cancelledBy={requestObject.cancelledBy}
        />
      </div>
    </div>
  );
}
```

---

## 5. Frontend - Customer Request Page Update

**File: `app/request/page.jsx`**

Find the `RequestCard` component (around line 179) and REPLACE the onClick handler:

REPLACE THIS:
```jsx
  const RequestCard = ({ request }) => {
    const isPending = request.status === 'Pending';
    const isAccepted = request.status === 'Accepted';
    const isDone = request.status === 'Done';
    const isCancelled = request.status === 'Cancel';
    const isBundle = request.type === 'bundle';

    return (
      <div
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
        onClick={() => {
          if (isPending) handlePendingClick();
          else if (isAccepted) handleAcceptedClick(request);
          else if (isDone) {
            setSelectedAcceptedRequest(request);
            setRequestFlowState('done');
          }
          else if (isCancelled) {
            setSelectedAcceptedRequest(request);
            setRequestFlowState('cancelled');
          }
        }}
      >
```

WITH THIS:
```jsx
  const RequestCard = ({ request }) => {
    const isPending = request.status === 'Pending';
    const isAccepted = request.status === 'Accepted';
    const isDone = request.status === 'Done';
    const isCancelled = request.status === 'Cancel';
    const isBundle = request.type === 'bundle';

    const handleClick = () => {
      if (isPending) {
        handlePendingClick();
      } else {
        // Navigate to separate conversation page for all other statuses
        const slug = isBundle ? `bundle-${request.id}` : `request-${request.id}`;
        window.location.href = `/conversation/${slug}`;
      }
    };

    return (
      <div
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
        onClick={handleClick}
      >
```

---

## 6. Backend - User Controller Profile Image Fixes

**File: `naibrly-backend/src/controllers/userController.js`**

### Fix 1: getUserProfile (around line 83-89)
Find where provider info is returned and UPDATE to:

```javascript
user = {
  ...provider,
  // Ensure profileImage always has a value
  profileImage: provider.profileImage || {
    url: "https://placehold.co/200x200?text=Profile",
    publicId: null
  },
  balances: isVerified ? {...} : null,
  payoutInformation: isVerified ? payoutInformation : null,
  documents: isVerified ? documents : null,
};
```

### Fix 2: updateProfile (around line 192-215)
Find the profile image upload section and ADD markModified():

```javascript
// Handle profile image upload for ALL user types (Customer, Provider, Admin)
if (req.files && req.files["profileImage"]) {
  const profileImage = req.files["profileImage"][0];

  // Delete old image from Cloudinary if exists
  if (user.profileImage && user.profileImage.publicId && user.profileImage.publicId !== "placeholder_profile") {
    await deleteImageFromCloudinary(user.profileImage.publicId);
  }

  // Update profile image for all user types
  user.profileImage = {
    url: profileImage.path,
    publicId: profileImage.filename,
  };

  // Mark as modified for nested objects
  user.markModified('profileImage');

  console.log('✅ Profile image updated:', {
    url: profileImage.path,
    publicId: profileImage.filename,
    role: req.user.role
  });
}
```

### Fix 3: updateServiceProviderProfile (around line 472-527)
Add markModified() calls for nested objects. Find where profileImage and businessLogo are updated and ADD after each:

```javascript
provider.profileImage = {
  url: profileImage.path,
  publicId: profileImage.filename,
};
provider.markModified('profileImage');  // ADD THIS LINE
```

```javascript
provider.businessLogo = {
  url: businessLogo.path,
  publicId: businessLogo.filename,
};
provider.markModified('businessLogo');  // ADD THIS LINE
```

---

## 7. Provider Profile Account Component Update

**File: `components/Global/providerprofile/Account.jsx`**

This is a MAJOR update. Find these sections and update:

### Add profileImage state (line 13):
```javascript
const [profileImage, setProfileImage] = useState(null);
```

### Update handleFileChange function (around line 172-196):
REPLACE the entire handleFileChange function with:

```javascript
const handleFileChange = (e) => {
  const file = e.target.files[0];
  const fileType = e.target.id;

  if (file) {
    // Create a preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      if (fileType === 'profileImage') {
        setProfileImage(file);
        setFormData(prev => ({
          ...prev,
          profileImageUrl: reader.result
        }));
      } else if (fileType === 'businessLogo') {
        setBusinessLogo(file);
        setFormData(prev => ({
          ...prev,
          businessLogoUrl: reader.result
        }));
      }
    };
    reader.readAsDataURL(file);
  }
};
```

### Update handleSave function (around lines 116-186):
REPLACE the entire handleSave function with:

```javascript
const handleSave = async () => {
  setUpdateError('');
  setUpdateSuccess('');

  try {
    const formDataToSend = new FormData();

    // Add basic fields
    formDataToSend.append('firstName', formData.firstName || '');
    formDataToSend.append('lastName', formData.lastName || '');
    formDataToSend.append('phone', formData.phone || '');
    formDataToSend.append('businessNameRegistered', formData.businessNameRegistered || '');
    formDataToSend.append('businessNameDBA', formData.businessNameDBA || '');
    formDataToSend.append('website', formData.website || '');
    formDataToSend.append('description', formData.description || '');
    formDataToSend.append('experience', formData.experience || 0);
    formDataToSend.append('maxBundleCapacity', formData.maxBundleCapacity || 0);

    // Add business service days
    formDataToSend.append('businessServiceStart', formData.businessDaysFrom?.toLowerCase() || '');
    formDataToSend.append('businessServiceEnd', formData.businessDaysTo?.toLowerCase() || '');

    // Add business hours
    formDataToSend.append('businessHoursStart', formData.businessHoursFrom || '');
    formDataToSend.append('businessHoursEnd', formData.businessHoursTo || '');

    // Add profile image if a new file was selected
    if (profileImage) {
      formDataToSend.append('profileImage', profileImage);
    }

    // Add business logo if a new file was selected
    if (businessLogo) {
      formDataToSend.append('businessLogo', businessLogo);
    }

    // Add services arrays as JSON strings
    if (servicesToRemove.length > 0) {
      formDataToSend.append('servicesToRemove', JSON.stringify(servicesToRemove));
    }
    if (servicesToUpdate.length > 0) {
      formDataToSend.append('servicesToUpdate', JSON.stringify(servicesToUpdate));
    }
    if (servicesToAdd.length > 0) {
      formDataToSend.append('servicesToAdd', JSON.stringify(servicesToAdd));
    }

    // Log the FormData contents for debugging
    console.log('Sending FormData:');
    for (let [key, value] of formDataToSend.entries()) {
      console.log(key, value);
    }

    // Call the API
    const result = await updateProfile(formDataToSend).unwrap();

    console.log('Profile updated successfully:', result);
    setUpdateSuccess('Profile updated successfully!');
    setAccountData({ ...formData });
    setIsEditing(false);
    setProfileImage(null);
    setBusinessLogo(null);

    // Clear success message after 3 seconds
    setTimeout(() => setUpdateSuccess(''), 3000);
  } catch (err) {
    console.error('Failed to update profile:', err);
    setUpdateError(err?.data?.message || err.message || 'Failed to update profile. Please try again.');
  }
};
```

---

## Summary of ALL Files Changed

### Backend Files (3 files):
1. ✅ `naibrly-backend/src/socket/index.js` - Role detection fixes
2. ✅ `naibrly-backend/src/middleware/auth.js` - Role setting with userId
3. ✅ `naibrly-backend/src/controllers/userController.js` - Profile image defaults & markModified
4. ✅ `naibrly-backend/src/controllers/serviceRequestController.js` - NEW getServiceRequestById endpoint
5. ✅ `naibrly-backend/src/routes/serviceRequests.js` - NEW route for getServiceRequestById

### Frontend Files (8 files):
1. ✅ `hooks/useSocket.js` - Duplicate message prevention (ALREADY HAS IT)
2. ✅ `components/ChatInterface.jsx` - Scroll fix & profile images (ALREADY HAS SCROLL FIX)
3. ✅ `components/ProviderChatInterface.jsx` - Same as ChatInterface
4. ✅ `components/Global/providerprofile/Account.jsx` - Profile upload updates
5. ✅ `next.config.mjs` - CSP configuration (ALREADY FIXED)
6. ✅ `redux/api/servicesApi.js` - NEW endpoints added
7. ✅ `app/(global)/conversation/[slug]/page.jsx` - COMPLETELY NEW FILE
8. ✅ `app/request/page.jsx` - Navigation update

---

## Quick Application Checklist

Apply in this order:

1. Backend serviceRequestController.js - Add getServiceRequestById function
2. Backend serviceRequests.js routes - Add new route and import
3. Backend userController.js - Add markModified() calls
4. Frontend servicesApi.js - Add new query endpoints and export hooks
5. Frontend create NEW file: app/(global)/conversation/[slug]/page.jsx
6. Frontend app/request/page.jsx - Update RequestCard onClick
7. Frontend Account.jsx - Add profileImage state, update handleFileChange and handleSave

All other files are already correct based on your file modifications!
