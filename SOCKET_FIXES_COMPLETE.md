# Complete Socket & Chat Implementation Fixes

This document contains ALL the changes made to fix the socket/chat implementation.

## Problem Summary
1. Messages appearing twice when sent
2. Provider profile images not showing in chat bubbles (right side)
3. Customer names and profile images not showing in chat bubbles (left side)
4. Auto-scroll scrolling entire page instead of just chat section
5. All messages showing `senderRole: "provider"` even for customer messages
6. Profile images showing as `undefined`
7. Profile images not saving to database
8. CSP errors blocking API requests

---

## 1. Backend Socket Authentication Fix

**File: `naibrly-backend/src/socket/index.js`**

### Lines 34-45 (authenticateSocket function)
```javascript
// Get user role from database to ensure it's correct
let user = await Customer.findById(decoded.userId);
if (user) {
  socket.userRole = "customer"; // Set role based on collection
} else {
  user = await ServiceProvider.findById(decoded.userId);
  if (user) {
    socket.userRole = "provider"; // Set role based on collection
  } else {
    throw new Error("User not found");
  }
}
```

### Lines 824-835 (handleAuthenticate function)
```javascript
// Get user from database
let user = await Customer.findById(socket.userId);
if (user) {
  socket.userRole = "customer"; // Set role based on collection
} else {
  user = await ServiceProvider.findById(socket.userId);
  if (user) {
    socket.userRole = "provider"; // Set role based on collection
  } else {
    throw new Error("User not found");
  }
}
```

**Why**: The role was being set from `user.role` field which doesn't exist. It must be set based on which collection the user is found in.

---

## 2. Backend Auth Middleware Fix

**File: `naibrly-backend/src/middleware/auth.js`**

### Complete replacement:
```javascript
const jwt = require("jsonwebtoken");
const Customer = require("../models/Customer");
const ServiceProvider = require("../models/ServiceProvider");
const Admin = require("../models/Admin");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token, authorization denied",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    let user = await Customer.findById(decoded.userId);
    let userRole = null;

    if (user) {
      userRole = "customer";
    } else {
      user = await ServiceProvider.findById(decoded.userId);
      if (user) {
        userRole = "provider";
      } else {
        user = await Admin.findById(decoded.userId);
        if (user) {
          userRole = "admin";
        }
      }
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Token is not valid",
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Account is deactivated",
      });
    }

    req.user = user;
    req.user.userId = decoded.userId; // Add userId for easy access
    req.user.role = userRole; // Add role based on collection
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({
      success: false,
      message: "Token is not valid",
    });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`,
      });
    }
    next();
  };
};

module.exports = { auth, authorize };
```

**Why**: Added `req.user.userId` and `req.user.role` to be set based on which collection the user is found in.

---

## 3. Frontend Duplicate Message Prevention

**File: `hooks/useSocket.js`**

### Lines 78-90 (in message handler switch case):
```javascript
case 'new_message':
case 'new_quick_message':
  console.log('💬 New message received:', payload);
  // Only add if not already in messages (prevent duplicates)
  setMessages((prev) => {
    const messageExists = prev.some(m => m._id === payload.message._id);
    if (messageExists) {
      console.log('⚠️ Duplicate message detected, skipping');
      return prev;
    }
    return [...prev, payload.message];
  });
  break;
```

**Why**: Backend was emitting both `new_message` AND `new_quick_message` for the same message, causing duplicates.

---

## 4. Chat Container Scroll Fix

**File: `components/ChatInterface.jsx`**

### Lines 66-103 (useEffect for auto-scroll):
```javascript
useEffect(() => {
  if (messages.length > prevMessagesLengthRef.current && messages.length > 0) {
    const container = scrollContainerRef.current;
    const currentUserRole = typeof window !== 'undefined' ? localStorage.getItem('userType') : null;
    const lastMessage = messages[messages.length - 1];
    const isMyMessage = lastMessage?.senderRole === currentUserRole;

    if (!container) {
      prevMessagesLengthRef.current = messages.length;
      return;
    }

    // Always scroll if the current user sent the message
    if (isMyMessage) {
      setTimeout(() => {
        container.scrollTo({
          top: container.scrollHeight,
          behavior: 'smooth'
        });
      }, 100);
    } else {
      // For other users' messages, check if user is near the bottom
      const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 150;
      if (isNearBottom) {
        setTimeout(() => {
          container.scrollTo({
            top: container.scrollHeight,
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  }
  prevMessagesLengthRef.current = messages.length;
}, [messages]);
```

**Why**: Changed from `scrollIntoView()` to `container.scrollTo()` to only scroll the chat container, not the entire page.

### Apply same fix to `components/ProviderChatInterface.jsx`

---

## 5. Profile Image Handling

**File: `components/ChatInterface.jsx`**

### Lines 218-237 (profile image extraction):
```javascript
if (isCurrentUser && currentUser) {
  // Use current user's profile for messages they sent
  firstName = currentUser.firstName || '';
  lastName = currentUser.lastName || '';
  senderName = `${firstName} ${lastName}`.trim() || 'You';
  // Handle both object and string profileImage
  profileImage = typeof currentUser.profileImage === 'string'
    ? currentUser.profileImage
    : currentUser.profileImage?.url;
} else {
  // For other users' messages, try to get from message data
  senderInfo = msg.senderInfo || msg.sender || {};
  firstName = senderInfo.firstName || senderInfo.first_name || '';
  lastName = senderInfo.lastName || senderInfo.last_name || '';
  senderName = `${firstName} ${lastName}`.trim() || 'User';
  // Handle both object and string profileImage
  profileImage = typeof senderInfo.profileImage === 'string'
    ? senderInfo.profileImage
    : senderInfo.profileImage?.url || senderInfo.profile_image || senderInfo.avatar;
}
```

**Why**: Profile images can be either strings or objects with a `url` property. Need to handle both cases.

### Apply same fix to `components/ProviderChatInterface.jsx`

---

## 6. Backend Profile Image Defaults

**File: `naibrly-backend/src/controllers/userController.js`**

### Lines 83-89 (getUserProfile function):
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

---

## 7. Profile Image Saving with markModified()

**File: `naibrly-backend/src/controllers/userController.js`**

### Lines 192-215 (updateProfile function):
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

### Lines 472-527 (updateServiceProviderProfile function):
Add same `markModified('profileImage')` and `markModified('businessLogo')` calls.

**Why**: Mongoose doesn't automatically detect changes to nested objects. Must call `markModified()` to ensure they're saved.

---

## 8. CSP Configuration Fix

**File: `next.config.mjs`**

### Line 36 (in contentSecurityPolicy):
```javascript
connect-src 'self' http://localhost:* ws://localhost:* wss://localhost:* https://*.ngrok-free.dev wss://*.ngrok-free.dev https://naibrly-backend.onrender.com wss://naibrly-backend.onrender.com;
```

**Why**: Added `http://localhost:*` to allow API requests to backend during development.

---

## 9. Provider Profile Page Update

**File: `components/Global/providerprofile/Account.jsx`**

### Line 13 - Add state:
```javascript
const [profileImage, setProfileImage] = useState(null);
```

### Lines 116-186 - Update handleSave:
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

### Lines 172-196 - Update handleFileChange:
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

---

## Testing Checklist

After applying all fixes, test:

1. ✅ Send messages as customer - should appear once
2. ✅ Send messages as provider - should appear once
3. ✅ Check customer profile images show in chat
4. ✅ Check provider profile images show in chat
5. ✅ Verify auto-scroll only scrolls chat container
6. ✅ Verify console shows correct senderRole
7. ✅ Upload profile image and verify it saves
8. ✅ No CSP errors in browser console

---

## Files Changed Summary

### Backend:
1. `naibrly-backend/src/socket/index.js` - Socket authentication role setting
2. `naibrly-backend/src/middleware/auth.js` - Auth middleware role setting
3. `naibrly-backend/src/controllers/userController.js` - Profile image defaults and markModified()

### Frontend:
4. `hooks/useSocket.js` - Duplicate message prevention
5. `components/ChatInterface.jsx` - Scroll fix & profile image handling
6. `components/ProviderChatInterface.jsx` - Scroll fix & profile image handling
7. `components/Global/providerprofile/Account.jsx` - Profile image upload
8. `next.config.mjs` - CSP configuration

---

## Important Notes

- The role MUST be determined by which collection the user is found in (Customer vs ServiceProvider)
- Never use `user.role` field from database as it likely doesn't exist
- Always use `markModified()` when updating nested objects in Mongoose
- Profile images can be either strings OR objects with `.url` property
- Use `scrollTo()` not `scrollIntoView()` for container scrolling
