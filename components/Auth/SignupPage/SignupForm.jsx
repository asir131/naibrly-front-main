'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Upload, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';

function SignupFormContent() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    streetAddress: '',
    state: '',
    zipCode: '',
    city: '',
    aptSuite: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    countryCode: '+1',
    agreeToTerms: false,
    profileImage: null,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState('user'); // Default to 'user'
  const [error, setError] = useState('');

  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get user type from URL query parameter
  useEffect(() => {
    const type = searchParams.get('type');
    if (type === 'provider' || type === 'user') {
      setUserType(type);
    }
  }, [searchParams]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, profileImage: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    setIsLoading(true);

    try {
      // Prepare form data matching backend expectations
      const formDataToSend = new FormData();

      // Backend expects these exact field names (from Postman collection):
      formDataToSend.append('firstName', formData.firstName);
      formDataToSend.append('lastName', formData.lastName);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('password', formData.password);
      formDataToSend.append('confirmPassword', formData.confirmPassword);
      formDataToSend.append('phone', `${formData.countryCode}${formData.phoneNumber}`);
      formDataToSend.append('street', formData.streetAddress);
      formDataToSend.append('city', formData.city);
      formDataToSend.append('state', formData.state);
      formDataToSend.append('zipCode', formData.zipCode);
      formDataToSend.append('aptSuite', formData.aptSuite);

      // Append profile image if exists
      if (formData.profileImage) {
        formDataToSend.append('profileImage', formData.profileImage);
      }

      // Debug: Log request data
      console.log('=== Signup Request Data (FormData) ===');
      for (let [key, value] of formDataToSend.entries()) {
        console.log(`${key}:`, value);
      }
      console.log('======================================');

      // Make API call to backend with FormData
      const response = await fetch('https://naibrly-backend.onrender.com/api/auth/register/customer', {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Signup failed. Please try again.');
      }

      console.log('SignupForm - Account created successfully:', data);

      // Store auth token if provided by backend
      // Backend returns token in data.token
      const token = data.data?.token || data.token;
      if (token) {
        console.log('SignupForm - Storing token:', token);
        localStorage.setItem('authToken', token);
        console.log('SignupForm - Token stored. Verifying:', localStorage.getItem('authToken'));
      } else {
        console.error('SignupForm - No token received from backend!');
      }

      // Create user object from response
      // Backend returns user data in data.user
      const userData = data.data?.user || data.user;
      const user = {
        id: userData?.id || data.id,
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        profileImage: userData?.profileImage || imagePreview,
        phone: `${formData.countryCode} ${formData.phoneNumber}`,
        address: {
          street: formData.streetAddress,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          aptSuite: formData.aptSuite,
        },
        role: userType
      };

      // Call the login function to set authenticated state
      login({ user, userType });

      // Redirect based on user type
      if (userType === 'provider') {
        console.log('SignupForm - Redirecting to /business');
        window.location.href = '/business';
      } else {
        console.log('SignupForm - Redirecting to /');
        window.location.href = '/';
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError(err.message || 'An error occurred during signup. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-10">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Profile Image Upload */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-teal-100 flex items-center justify-center overflow-hidden border-2 border-teal-200">
                {imagePreview ? (
                  <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-10 h-10 text-teal-600" />
                )}
              </div>
            </div>
            <label htmlFor="profileImage" className="mt-3 text-sm text-teal-600 hover:text-teal-700 cursor-pointer flex items-center gap-1">
              <Upload className="w-4 h-4" />
              upload Image
            </label>
            <input
              id="profileImage"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          {/* First Name & Last Name */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-teal-700 block mb-2">
                First Name
              </label>
              <Input
                type="text"
                name="firstName"
                placeholder="Mina"
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-slate-50 text-slate-900"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-teal-700 block mb-2">
                Last Name
              </label>
              <Input
                type="text"
                name="lastName"
                placeholder="Leo"
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-slate-50 text-slate-900"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="text-xs font-medium text-teal-700 block mb-2">
              Email Address
            </label>
            <Input
              type="email"
              name="email"
              placeholder="Jhon@gmail.com"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-slate-50 text-slate-900"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-xs font-medium text-teal-700 block mb-2">
              Password
            </label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="AbcD@7281"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-slate-50 text-slate-900 pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="text-xs font-medium text-teal-700 block mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-slate-50 text-slate-900 pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Phone Number with Country Code */}
          <div>
            <label className="text-xs font-medium text-teal-700 block mb-2">
              Phone Number
            </label>
            <div className="flex gap-2">
              <select
                name="countryCode"
                value={formData.countryCode}
                onChange={handleInputChange}
                className="w-24 px-3 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-slate-50 text-slate-900"
              >
                <option value="+1">+1</option>
                <option value="+44">+44</option>
                <option value="+91">+91</option>
                <option value="+86">+86</option>
                <option value="+81">+81</option>
              </select>
              <Input
                type="tel"
                name="phoneNumber"
                placeholder="(239) 555-0108"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="flex-1 px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-slate-50 text-slate-900"
              />
            </div>
          </div>

          {/* Street Number and Name */}
          <div>
            <label className="text-xs font-medium text-teal-700 block mb-2">
              Street Number and Name
            </label>
            <Input
              type="text"
              name="streetAddress"
              placeholder="Street Number and Name"
              value={formData.streetAddress}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-slate-50 text-slate-900"
            />
          </div>

          {/* State & Zip Code */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-teal-700 block mb-2">
                State
              </label>
              <Input
                type="text"
                name="state"
                placeholder="State"
                value={formData.state}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-slate-50 text-slate-900"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-teal-700 block mb-2">
                Zip Code
              </label>
              <Input
                type="text"
                name="zipCode"
                placeholder="Zip Code"
                value={formData.zipCode}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-slate-50 text-slate-900"
              />
            </div>
          </div>

          {/* City & Apt/Suite */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-teal-700 block mb-2">
                City
              </label>
              <Input
                type="text"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-slate-50 text-slate-900"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-teal-700 block mb-2">
                Apt / Suite
              </label>
              <Input
                type="text"
                name="aptSuite"
                placeholder="Apt / Suite"
                value={formData.aptSuite}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-slate-50 text-slate-900"
              />
            </div>
          </div>

          {/* Terms Agreement Checkbox */}
          <div className="flex items-start gap-3 pt-2">
            <input
              type="checkbox"
              id="agreeToTerms"
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleInputChange}
              className="mt-1 w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500 cursor-pointer"
            />
            <label htmlFor="agreeToTerms" className="text-sm text-slate-600 cursor-pointer">
              I agree to the{' '}
              <a href="/terms-of-use" className="text-teal-600 hover:text-teal-700 underline">
                Terms of Service
              </a>
              {' & '}
              <a href="/privacy-policy" className="text-teal-600 hover:text-teal-700 underline">
                Privacy Policy
              </a>
            </label>
          </div>

          {/* Sign Up Button */}
          <Button
            type="submit"
            disabled={!formData.agreeToTerms || isLoading}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg font-medium text-base disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Creating Account...' : 'Sign up'}
          </Button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-white text-slate-400">Or continue with</span>
            </div>
          </div>

          {/* Social Login Icons */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <button
              type="button"
              className="w-12 h-12 flex items-center justify-center rounded-full border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="black">
                <path d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.9-1.99 1.57-2.987 1.57-.12 0-.23-.02-.3-.03-.01-.06-.04-.22-.04-.39 0-1.15.572-2.27 1.206-2.98.804-.94 2.142-1.64 3.248-1.68.03.13.05.28.05.43zm4.565 15.71c-.03.07-.463 1.58-1.518 3.12-.945 1.34-1.94 2.71-3.43 2.71-1.517 0-1.9-.88-3.63-.88-1.698 0-2.302.91-3.67.91-1.377 0-2.332-1.26-3.428-2.8-1.287-1.82-2.323-4.63-2.323-7.28 0-4.28 2.797-6.55 5.552-6.55 1.448 0 2.675.95 3.6.95.865 0 2.222-1.01 3.902-1.01.613 0 2.886.06 4.374 2.19-.13.09-2.383 1.37-2.383 4.19 0 3.26 2.854 4.42 2.955 4.45z"/>
              </svg>
            </button>
            <button
              type="button"
              className="w-12 h-12 flex items-center justify-center rounded-full border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Wrapper component with Suspense boundary
export default function CreateAccount() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-10">
          <div className="text-center text-slate-600">Loading...</div>
        </div>
      </div>
    }>
      <SignupFormContent />
    </Suspense>
  );
}