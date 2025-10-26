import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Mail, Phone, MapPin, Calendar } from 'lucide-react';

const Account = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: 'Jacob',
    lastName: 'Meikle',
    email: 'email@outlook.com',
    phone: '+1 012 345 6987',
    address: '123 Oak Street Springfield, IL 62704',
    zipCode: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div className="flex-1 p-8">
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
              <div className="w-24 h-24 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center">
                <User className="w-12 h-12 text-white" />
              </div>
            </div>

            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-3 text-gray-700">
                <User className="w-5 h-5 text-gray-500" />
                <span className="text-lg">Jacob Meikle</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <Mail className="w-5 h-5 text-gray-500" />
                <span className="text-lg">email@outlook.com</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <Phone className="w-5 h-5 text-gray-500" />
                <span className="text-lg">+1 012 345 6987</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <MapPin className="w-5 h-5 text-gray-500" />
                <span className="text-lg">123 Oak Street Springfield, IL 62704</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <Calendar className="w-5 h-5 text-gray-500" />
                <span className="text-lg">Joined: Aug 5, 2023</span>
              </div>
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
                <Label htmlFor="address" className="text-sm font-medium mb-2 block">
                  Address
                </Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Type here"
                  className="w-full"
                />
              </div>

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

              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  className="px-8"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  className="px-8 bg-teal-600 hover:bg-teal-700 text-white"
                >
                  Save
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
