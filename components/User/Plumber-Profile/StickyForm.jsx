"use client";
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import RequestEstimateModal from './RequestEstimateModal';
import SuccessModal from './SuccessModal';
import useCustomerZipCode from '@/hooks/useCustomerZipCode';

export default function StickyForm() {

    const [selectedService, setSelectedService] = useState('');
    const customerZipCode = useCustomerZipCode();
    const [zipCode, setZipCode] = useState('');
    const [drainProblem, setDrainProblem] = useState('');
    const [urgency, setUrgency] = useState('');
    const [numDrains, setNumDrains] = useState('');

    useEffect(() => {
        if (!zipCode && customerZipCode) {
            setZipCode(customerZipCode);
        }
    }, [customerZipCode, zipCode]);

    const [showEstimateModal, setShowEstimateModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const handleRequestEstimate = () => {
        // Validate that all fields are filled
        if (!selectedService || !zipCode || !drainProblem || !urgency || !numDrains) {
            alert('Please fill in all fields before requesting an estimate');
            return;
        }
        // Open the estimate modal
        setShowEstimateModal(true);
    };

    const handleEstimateSuccess = () => {
        setShowEstimateModal(false);
        setShowSuccessModal(true);
    };

    const handleCloseModals = () => {
        setShowEstimateModal(false);
        setShowSuccessModal(false);
    };

    return (
        <div className="lg:col-span-1">
            <div className="sticky top-4 z-50">
            <Card className="p-6 shadow-md">
                <div className="flex items-center mb-6">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6.50001 2C4.02001 2 2.00001 4.02 2.00001 6.5C1.99913 7.16391 2.14549 7.81976 2.42856 8.4203C2.71163 9.02085 3.12435 9.55114 3.63701 9.973L4.00001 10.273V12.569L6.76901 10.997L7.01401 11.001H9.50001C11.981 11.001 14 8.981 14 6.501C14 4.02 11.981 2 9.50001 2H6.50001ZM2.00001 16.002V11.19C1.36668 10.5842 0.862882 9.85623 0.519108 9.05007C0.175333 8.24392 -0.00126444 7.37639 6.81483e-06 6.5C6.81483e-06 2.917 2.91601 0 6.50001 0H9.50001C13.084 0 16 2.916 16 6.5C16 10.085 13.084 13.002 9.50001 13.002H7.23901L2.00001 16.002Z" fill="#2F3033" />
                    </svg>
                    <button className="ml-2 text-[#676D73] text-sm font-semibold hover:underline transition-colors">
                        Contact for price
                    </button>
                </div>

                <div className="space-y-5">
                    {/* Service Selection */}
                    <div>
                        <label className="text-[#2F3033] font-bold text-[13px] leading-[20px] mb-2 block">
                            Select a service
                        </label>
                        <Select value={selectedService} onValueChange={setSelectedService}>
                            <SelectTrigger className="w-full text-sm">
                                <SelectValue placeholder="Plumbing Drain Repair" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="drain">Plumbing Drain Repair</SelectItem>
                                <SelectItem value="pipe">Pipe Repair</SelectItem>
                                <SelectItem value="heater">Water Heater</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Zip Code */}
                    <div>
                        <label className="text-[#2F3033] font-bold text-[13px] leading-[20px] mb-2 block">
                            Zip code
                        </label>
                        <Input
                            type="text"
                            placeholder="94040"
                            value={zipCode}
                            onChange={(e) => setZipCode(e.target.value)}
                            className="text-sm"
                        />
                    </div>

                    {/* Drain Problem */}
                    <div>
                        <label className="text-[#2F3033] font-bold text-[13px] leading-[20px] mb-2 block">
                            Drain problem
                        </label>
                        <Select value={drainProblem} onValueChange={setDrainProblem}>
                            <SelectTrigger className="w-full text-sm">
                                <SelectValue placeholder="Select answer(s)" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="clogged">Clogged Drain</SelectItem>
                                <SelectItem value="burst">Burst Pipe</SelectItem>
                                <SelectItem value="slow">Slow Drainage</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Repair Urgency */}
                    <div>
                        <label className="text-[#2F3033] font-bold text-[13px] leading-[20px] mb-2 block">
                            Repair urgency
                        </label>
                        <Select value={urgency} onValueChange={setUrgency}>
                            <SelectTrigger className="w-full text-sm">
                                <SelectValue placeholder="Select answer" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="urgent">Urgent</SelectItem>
                                <SelectItem value="soon">Soon</SelectItem>
                                <SelectItem value="flexible">Flexible</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Number of Drains */}
                    <div>
                        <label className="text-[#2F3033] font-bold text-[13px] leading-[20px] mb-2 block">
                            Number of issue drains
                        </label>
                        <Select value={numDrains} onValueChange={setNumDrains}>
                            <SelectTrigger className="w-full text-sm">
                                <SelectValue placeholder="Select answer" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="one">1</SelectItem>
                                <SelectItem value="two">2</SelectItem>
                                <SelectItem value="three">3+</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Request Estimate Button */}
                    <Button
                        onClick={handleRequestEstimate}
                        className="w-full bg-[#0E7A60] hover:bg-teal-500 text-white font-medium transition-colors"
                    >
                        Request estimate
                    </Button>

                    {/* Online Now */}
                    <div className="text-center pt-2">
                        <p className="text-xs text-gray-700">
                            <span className="inline-block w-2 h-2 bg-teal-600 rounded-full mr-2 animate-pulse"></span>
                            <span>Online now</span>
                        </p>
                    </div>
                </div>
            </Card>
            </div>

            {/* Modals */}
            <RequestEstimateModal
                isOpen={showEstimateModal}
                onClose={handleCloseModals}
                onSuccess={handleEstimateSuccess}
                serviceName="Plumbing Drain Repair"
            />
            <SuccessModal
                isOpen={showSuccessModal}
                onClose={handleCloseModals}
            />
        </div>
    )

};
