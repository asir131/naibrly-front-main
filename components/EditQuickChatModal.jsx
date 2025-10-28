'use client';
import React, { useEffect, useRef, useState } from 'react';

export default function EditQuickChatModal({
    open,
    initialText = '',
    onClose,
    onSubmit,
    title = 'Edit Quick Chat',
    subtitle = 'Customize your preset messages for faster responses.',
    submitLabel = 'Done',
}) {
    const [text, setText] = useState('');
    const textareaRef = useRef(null);

    useEffect(() => {
        if (!open) return;
        setText(initialText || '');
        const t = setTimeout(() => textareaRef.current?.focus(), 50);
        const onKey = (e) => e.key === 'Escape' && onClose?.();
        document.addEventListener('keydown', onKey);
        return () => {
            clearTimeout(t);
            document.removeEventListener('keydown', onKey);
        };
    }, [open, initialText, onClose]);

    if (!open) return null;

    const handleSubmit = () => {
        const value = text.trim();
        if (!value) return;
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
                {/* Pencil icon inside green ring */}
                <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#0E7A60]">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-7 w-7 text-[#0E7A60]"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                    >
                        <path d="M12.5 6.5l5 5" />
                        <path d="M4 20l4.5-1.2a2 2 0 0 0 .9-.5L20 8.7a2.1 2.1 0 0 0 0-3l-.7-.7a2.1 2.1 0 0 0-3 0L5.7 15.6a2 2 0 0 0-.5.9L4 21" />
                    </svg>
                </div>
                <div className="mx-auto h-2 w-16 rounded-full bg-black/10 opacity-30 blur-[1px]" />

                {/* Title + subtitle */}
                <div className="mt-2 text-center">
                    <h3 className="text-[18px] font-semibold text-[#111]">{title}</h3>
                    <p className="mt-1 text-[13px] text-[#7F7F7F]">{subtitle}</p>
                </div>

                {/* Textarea */}
                <div className="mt-4">
                    <label className="mb-2 block text-[14px] font-medium text-[#111]">Edit answer</label>
                    <textarea
                        ref={textareaRef}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Type here"
                        rows={4}
                        className="w-full rounded-[10px] border border-[#E5E7EB] bg-white p-3 text-[14px] outline-none focus:ring-2 focus:ring-[#0E7A60]/30"
                    />
                </div>

                {/* Actions */}
                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!text.trim()}
                    className={`mt-5 w-full rounded-[10px] py-2.5 text-[14px] font-semibold transition
            ${text.trim() ? 'bg-[#0E7A60] text-white hover:bg-[#0b5f4b]' : 'bg-[#0E7A60]/60 text-white cursor-not-allowed'}`}
                >
                    {submitLabel}
                </button>
            </div>
        </div>
    );
}