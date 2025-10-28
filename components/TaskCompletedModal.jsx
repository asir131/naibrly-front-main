// components/TaskCompletedModal.jsx
'use client';
import React from 'react';

export default function TaskCompletedModal({
    open,
    onClose,
    avgRate = 63,
    amount,
    setAmount,
    onDone, // <-- parent callback
}) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70" onClick={onClose} />
            <div className="relative z-[61] w-[340px] rounded-[12px] bg-white p-6 shadow-xl ring-1 ring-black/5">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#0E7A60]/60">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-[#0E7A60]"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M20 6 9 17l-5-5" />
                    </svg>
                </div>

                <div className="text-center">
                    <h3 className="text-[18px] font-semibold text-[#111]">Task Completed</h3>
                    <p className="mt-1 text-[13px] text-[#7F7F7F]">Your Budget avg. ${avgRate}/hr</p>
                </div>

                <div className="mt-4">
                    <label className="mb-1 block text-[14px] font-medium text-[#111]">Amount*</label>
                    <div className="flex items-center rounded-[10px] border border-[#E5E7EB] bg-white px-3">
                        <span className="text-[#7F7F7F]">$</span>
                        <input
                            value={amount}
                            onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
                            type="text"
                            placeholder="500"
                            className="h-10 flex-1 bg-transparent px-2 text-[14px] outline-none"
                        />
                    </div>
                </div>

                <button
                    onClick={() => {
                        onDone?.();       // <-- inform parent to start the sequence
                        onClose?.();      // <-- then close modal
                    }}
                    className="mt-5 w-full rounded-[10px] bg-[#0E7A60] py-2.5 text-[14px] font-semibold text-white hover:bg-[#0b5f4b] transition"
                    type="button"
                >
                    Done
                </button>
            </div>
        </div>
    );
}