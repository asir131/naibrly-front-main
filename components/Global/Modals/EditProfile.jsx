'use client';
import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit2 } from 'lucide-react';
import useCustomerZipCode from '@/hooks/useCustomerZipCode';

export default function EditProfileModal({ isOpen, onClose }) {
  const customerZipCode = useCustomerZipCode();
  const [profileImage, setProfileImage] = useState('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop');
  const [formData, setFormData] = useState({
    name: 'Jane Doe',
    designation: 'Home owner',
    countryCode: '+1',
    phoneNumber: '012 345 6987',
    address: '123 Oak Street Springfield, IL 62704',
    zipCode: ''
  });

  useEffect(() => {
    if (!formData.zipCode && customerZipCode) {
      setFormData((prev) => ({ ...prev, zipCode: customerZipCode }));
    }
  }, [customerZipCode, formData.zipCode]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    console.log('Saving profile:', formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto bg-white rounded-2xl p-0">
          <DialogHeader className="sr-only">
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <div className="p-6 pb-8">
            {/* Profile Image Section */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative mb-3">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200">
                  <img 
                    src={profileImage} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <label 
                  htmlFor="profile-upload" 
                  className="absolute bottom-0 right-0 bg-white rounded-full p-1.5 shadow-md cursor-pointer border border-gray-200 hover:bg-gray-50"
                >
                  <Edit2 className="w-3.5 h-3.5 text-gray-600" />
                </label>
                <input 
                  id="profile-upload" 
                  type="file" 
                  accept="image/*" 
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>
              <p className="text-sm text-gray-600">Upload Profile Photo</p>
            </div>

            {/* Name Field */}
            <div className="mb-5">
              <Label htmlFor="name" className="text-sm font-medium text-gray-700 mb-2 block">
                Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="bg-gray-50 border-gray-200 h-11"
              />
            </div>

            {/* Designation Field */}
            <div className="mb-5">
              <Label htmlFor="designation" className="text-sm font-medium text-gray-700 mb-2 block">
                Designation
              </Label>
              <Input
                id="designation"
                value={formData.designation}
                onChange={(e) => handleInputChange('designation', e.target.value)}
                className="bg-gray-50 border-gray-200 h-11"
              />
            </div>

            {/* Phone Number Field */}
            <div className="mb-5">
              <Label htmlFor="phone" className="text-sm font-medium text-gray-700 mb-2 block">
                Phone Number
              </Label>
              <div className="flex gap-2">
                <Select value={formData.countryCode} onValueChange={(value) => handleInputChange('countryCode', value)}>
                  <SelectTrigger className="w-24 bg-gray-50 border-gray-200 h-11">
                    <SelectValue>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🇺🇸</span>
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="+1">
                      <div className="flex items-center gap-2">
                        <span>🇺🇸</span>
                        <span>+1</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="+44">
                      <div className="flex items-center gap-2">
                        <span>🇬🇧</span>
                        <span>+44</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="+880">
                      <div className="flex items-center gap-2">
                        <span>🇧🇩</span>
                        <span>+880</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex-1 flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-md px-3 h-11">
                  <span className="text-gray-600">{formData.countryCode}</span>
                  <Input
                    id="phone"
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    className="border-0 bg-transparent p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>
              </div>
            </div>

            {/* Address Field */}
            <div className="mb-5">
              <Label htmlFor="address" className="text-sm font-medium text-gray-700 mb-2 block">
                Address
              </Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="bg-gray-50 border-gray-200 h-11"
              />
            </div>

            {/* Zip Code Field */}
            <div className="mb-6">
              <Label htmlFor="zipcode" className="text-sm font-medium text-gray-700 mb-2 block">
                Zip code
              </Label>
              <Input
                id="zipcode"
                value={formData.zipCode}
                onChange={(e) => handleInputChange('zipCode', e.target.value)}
                className="bg-gray-50 border-gray-200 h-11"
              />
            </div>

            {/* Save Button */}
            <Button 
              onClick={handleSave}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white h-12 rounded-lg font-medium"
            >
              Save Changes
            </Button>
          </div>
        </DialogContent>
    </Dialog>
  );
}
