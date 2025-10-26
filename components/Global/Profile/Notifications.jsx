import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

const Notifications = () => {
  const [notifications, setNotifications] = useState({
    taskUpdates: {
      sms: true,
      push: false
    }
  });

  const handleCheckboxChange = (category, type) => {
    setNotifications(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [type]: !prev[category][type]
      }
    }));
  };

  const handleSave = () => {
    console.log('Notifications saved:', notifications);
  };

  const handleCancel = () => {
    setNotifications({
      taskUpdates: {
        sms: true,
        push: false
      }
    });
  };

  return (
    <div className="flex-1 p-8">
      <div className="mb-8 pb-4 border-b border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
      </div>

      <div className="space-y-6">
        {/* Header Row */}
        <div className="grid grid-cols-3 gap-4 pb-4 border-b border-gray-200">
          <div className="text-base font-medium text-gray-900">Form of Communication</div>
          <div className="text-base font-medium text-gray-900 text-center">SMS</div>
          <div className="text-base font-medium text-gray-900 text-center">Push Notification</div>
        </div>

        {/* Task Updates Row */}
        <div className="grid grid-cols-3 gap-4 items-center pb-6 border-b border-gray-200">
          <div className="text-base text-gray-700">Task Updates</div>
          <div className="flex justify-center">
            <Checkbox
              checked={notifications.taskUpdates.sms}
              onCheckedChange={() => handleCheckboxChange('taskUpdates', 'sms')}
              className="w-6 h-6 data-[state=checked]:bg-teal-600 data-[state=checked]:border-teal-600"
            />
          </div>
          <div className="flex justify-center">
            <Checkbox
              checked={notifications.taskUpdates.push}
              onCheckedChange={() => handleCheckboxChange('taskUpdates', 'push')}
              className="w-6 h-6 data-[state=checked]:bg-teal-600 data-[state=checked]:border-teal-600"
            />
          </div>
        </div>

        {/* Action Buttons */}
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
  );
};

export default Notifications;
