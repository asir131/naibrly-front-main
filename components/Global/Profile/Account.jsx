import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Mail, Phone, MapPin, Calendar } from 'lucide-react';

const Account = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    aptSuite: '',
    profileImage: null,
    createdAt: ''
  });

  // Fetch profile data on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        console.log('Account - Checking localStorage for token...');
        console.log('Account - All localStorage keys:', Object.keys(localStorage));
        const token = localStorage.getItem('authToken');
        console.log('Account - Token found:', token ? 'Yes' : 'No');
        console.log('Account - Token value:', token);

        if (!token) {
          setError('No authentication token found. Please login again.');
          setIsLoading(false);
          return;
        }

        const response = await fetch('https://naibrly-backend.onrender.com/api/users/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await response.json();

        console.log('===== PROFILE API RESPONSE =====');
        console.log('Response status:', response.status);
        console.log('Full response data:', JSON.stringify(data, null, 2));
        console.log('data.data:', data.data);
        console.log('data.user:', data.user);
        console.log('Direct data fields:', {
          firstName: data.firstName,
          email: data.email,
          _id: data._id
        });
        console.log('================================');

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch profile');
        }

        // Backend returns user data in: { success: true, data: { user: { ... } } }
        const userData = data.data?.user || data.data || data.user || data;

        console.log('Extracted userData:', {
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email
        });

        // Update form data with fetched profile
        setFormData({
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          email: userData.email || '',
          phone: userData.phone || '',
          street: userData.address?.street || '',
          city: userData.address?.city || '',
          state: userData.address?.state || '',
          zipCode: userData.address?.zipCode || '',
          aptSuite: userData.address?.aptSuite || '',
          profileImage: userData.profileImage || null,
          createdAt: userData.createdAt || ''
        });

        console.log('Form data updated:', {
          firstName: userData.firstName,
          email: userData.email
        });

        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError(err.message || 'Failed to load profile');
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError('');

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found. Please login again.');
      }

      const response = await fetch('https://naibrly-backend.onrender.com/api/users/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: {
            street: formData.street,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode,
            aptSuite: formData.aptSuite,
          }
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }

      console.log('Profile updated successfully:', data);
      setIsEditing(false);
      setIsSaving(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.message || 'Failed to update profile');
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError('');
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex-1 p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading profile...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8">
      {/* Error Message */}
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {!isEditing ? (
        <div>
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
            <h1 className="text-3xl font-bold text-gray-900">Account</h1>
            <Button
              variant="outline"
              onClick={() => setIsEditing(true)}
              className="px-6"
            >
              Edit
            </Button>
          </div>

          <div className="flex gap-8">
            <div className="flex-shrink-0">
              {formData.profileImage ? (
                <img
                  src={formData.profileImage}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <div className="w-24 h-24 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center">
                  <User className="w-12 h-12 text-white" />
                </div>
              )}
            </div>

            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-3 text-gray-700">
                <User className="w-5 h-5 text-gray-500" />
                <span className="text-lg">{formData.firstName} {formData.lastName}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <Mail className="w-5 h-5 text-gray-500" />
                <span className="text-lg">{formData.email}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <Phone className="w-5 h-5 text-gray-500" />
                <span className="text-lg">{formData.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <MapPin className="w-5 h-5 text-gray-500" />
                <span className="text-lg">
                  {formData.street}
                  {formData.aptSuite && `, ${formData.aptSuite}`}
                  {formData.city && `, ${formData.city}`}
                  {formData.state && `, ${formData.state}`}
                  {formData.zipCode && ` ${formData.zipCode}`}
                </span>
              </div>
              {formData.createdAt && (
                <div className="flex items-center gap-3 text-gray-700">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <span className="text-lg">Joined: {new Date(formData.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="mb-8 pb-4 border-b border-gray-200">
            <h1 className="text-3xl font-bold text-gray-900">Update Account</h1>
          </div>

          <div className="flex gap-8">
            <div className="flex-shrink-0">
              <div className="w-24 h-24 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center mb-3">
                <User className="w-12 h-12 text-white" />
              </div>
              <button className="text-sm text-gray-600 hover:text-gray-800">
                Upload a new photo
              </button>
            </div>

            <div className="flex-1 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName" className="text-sm font-medium mb-2 block">
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="Type here"
                    className="w-full"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName" className="text-sm font-medium mb-2 block">
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Type here"
                    className="w-full"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email" className="text-sm font-medium mb-2 block">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Type here"
                  className="w-full"
                />
              </div>

              <div>
                <Label htmlFor="phone" className="text-sm font-medium mb-2 block">
                  Phone Number
                </Label>
                <div className="flex gap-2">
                  <Select defaultValue="1">
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1+</SelectItem>
                      <SelectItem value="44">44+</SelectItem>
                      <SelectItem value="91">91+</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    id="phone"
                    name="phone"
                    placeholder="(239) 555-0108"
                    className="flex-1"
                    defaultValue="(239) 555-0108"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="street" className="text-sm font-medium mb-2 block">
                  Street Address
                </Label>
                <Input
                  id="street"
                  name="street"
                  value={formData.street}
                  onChange={handleInputChange}
                  placeholder="Type here"
                  className="w-full"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city" className="text-sm font-medium mb-2 block">
                    City
                  </Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Type here"
                    className="w-full"
                  />
                </div>
                <div>
                  <Label htmlFor="state" className="text-sm font-medium mb-2 block">
                    State
                  </Label>
                  <Input
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="Type here"
                    className="w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="zipCode" className="text-sm font-medium mb-2 block">
                    Zip Code
                  </Label>
                  <Input
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    placeholder="Type here"
                    className="w-full"
                  />
                </div>
                <div>
                  <Label htmlFor="aptSuite" className="text-sm font-medium mb-2 block">
                    Apt / Suite
                  </Label>
                  <Input
                    id="aptSuite"
                    name="aptSuite"
                    value={formData.aptSuite}
                    onChange={handleInputChange}
                    placeholder="Type here"
                    className="w-full"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="px-8"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-8 bg-teal-600 hover:bg-teal-700 text-white disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Account;
