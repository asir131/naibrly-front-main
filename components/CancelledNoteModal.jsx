'use client';
import React, { useEffect, useRef, useState } from 'react';

export default function CancelledNoteModal({
    open,
    onClose,
    onSubmit,
    label = 'Note why*',
    placeholder = 'Type here',
    submitLabel = 'Cancelled',
}) {
    const [note, setNote] = useState('');
    const textareaRef = useRef(null);

    useEffect(() => {
        if (!open) return;
        setNote('');
        const t = setTimeout(() => textareaRef.current?.focus(), 50);
        const onKey = (e) => e.key === 'Escape' && onClose?.();
        document.addEventListener('keydown', onKey);
        return () => {
            clearTimeout(t);
            document.removeEventListener('keydown', onKey);
        };
    }, [open, onClose]);

    if (!open) return null;

    const handleSubmit = () => {
        const value = note.trim();
        if (!value) return; // required
        onSubmit?.(value);
        onClose?.();
    };

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />
            <div
                role="dialog"
                aria-modal="true"
                className="relative z-[71] w-[360px] rounded-[12px] bg-white p-6 shadow-xl ring-1 ring-black/5"
            >
                {/* Red X icon in ring */}
                <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#EF4444]">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-7 w-7 text-[#EF4444]"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                    >
                        <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                </div>
                <div className="mx-auto h-2 w-16 rounded-full bg-black/10 opacity-30 blur-[1px]" />

                {/* Label + textarea */}
                <div className="mt-4">
                    <label className="mb-2 block text-[14px] font-medium text-[#111]">{label}</label>
                    <textarea
                        ref={textareaRef}
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder={placeholder}
                        rows={4}
                        className="w-full rounded-[10px] border border-[#E5E7EB] bg-white p-3 text-[14px] outline-none focus:ring-2 focus:ring-[#EF4444]/30"
                    />
                </div>

                {/* Submit */}
                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!note.trim()}
                    className={`mt-5 w-full rounded-[10px] py-2.5 text-[14px] font-semibold transition
            ${note.trim() ? 'bg-[#EF4444] text-white hover:bg-[#dc2626]' : 'bg-[#EF4444]/60 text-white cursor-not-allowed'}`}
                >
                    {submitLabel}
                </button>
            </div>
        </div>
    );
}