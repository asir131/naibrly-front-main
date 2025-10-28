'use client';
import React, { useState } from 'react';
import { HiOutlineDotsVertical } from "react-icons/hi";
import TaskCompletedModal from './TaskCompletedModal';
import AddQuickChatModal from './AddQuickChatModal';
import EditQuickChatModal from './EditQuickChatModal';
import CancelledNoteModal from './CancelledNoteModal';

const StatusPill = ({ label = 'Accepted' }) => (
    <span className="inline-flex items-center gap-2 rounded-full bg-[#E8F7EE] px-4 py-2 text-sm font-semibold text-[#0E7A60]">
        <span className="h-2 w-2 rounded-full bg-[#34D399]" />
        {label}
    </span>
);

const Dot = () => <span className="mx-1 inline-block h-1 w-1 rounded-full bg-[#C7C7C7]" />;

const OrderHeader = ({ order, onTaskDone }) => {
    // this is for open modal
    const [open, setOpen] = useState(false);
    // demo input state for modal
    const [amount, setAmount] = useState('');

    const handleDotClick = () => setOpen(!open);

    return (
        <div className="rounded-2xl bg-white shadow-sm ring-1 ring-black/5 p-6 md:p-7">
            <div className="flex items-start justify-between gap-4 relative">
                <div className="flex-1">
                    <p className="text-[20px] font-semibold text-[#111]">
                        {order.title}:{' '}
                        <span className="text-[#0E7A60]">${order.price}</span>
                        <span className="text-[#8F8F8F]">/consult</span>
                    </p>

                    <div className="mt-4 flex items-center gap-3">
                        <img
                            src={order.client.avatar}
                            alt={order.client.name}
                            className="h-[44px] w-[44px] rounded-full object-cover"
                        />
                        <div className="flex flex-col">
                            <span className="text-[16px] font-semibold text-[#111]">
                                {order.client.name}
                            </span>
                            <div className="flex items-center gap-2 text-[15px]">
                                <span className="text-[#F1C400]">★</span>
                                <span className="font-medium text-[#1D1D1F]">{order.rating.toFixed(1)}</span>
                                <span className="text-[#8F8F8F]">({order.reviews} reviews)</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-5">
                        <p className="mb-1 text-[16px] font-semibold text-[#111]">Problem Note for Fridge Repair</p>
                        <p className="text-[15px] leading-6 text-[#7F7F7F]">{order.problemNote}</p>
                    </div>

                    <div className="mt-4 text-[15px]">
                        <div className="mb-1">
                            <span className="font-semibold text-[#111]">Address:</span>{' '}
                            <span className="text-[#7F7F7F]">{order.address}</span>
                        </div>
                        <div className="text-[#7F7F7F]">
                            <span className="font-semibold text-[#111]">Service Date:</span>{' '}
                            <span>{order.serviceDate}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-start">
                    <StatusPill label={order.statusLabel || 'Accepted'} />
                </div>
                <div className="absolute right-0 bottom-0">
                    <button
                        onClick={handleDotClick}
                        type="button"
                        className="rounded-[12px] bg-[#0E7A60] px-4 py-2 text-[14px] font-semibold text-white hover:bg-[#0b5f4b] transition"
                    >
                        Task Done
                    </button>
                </div>
            </div>

            <TaskCompletedModal
                open={open}
                onClose={handleDotClick}
                amount={amount}
                setAmount={setAmount}
                onDone={onTaskDone} // <-- triggers waiting → feedback sequence
            />
        </div>
    );
};

const ChatBubble = ({ side = 'left', name, timeAgo, text }) => {
    const isRight = side === 'right';
    return (
        <div className={`flex items-end ${isRight ? 'justify-end' : 'justify-start'}`}>
            {!isRight && (
                <img
                    src="https://i.pravatar.cc/40?img=13"
                    alt={name}
                    className="mr-2 h-8 w-8 rounded-full object-cover"
                />
            )}

            <div className={`max-w-[70%]`}>
                <div className={`mb-1 flex items-center ${isRight ? 'justify-end' : 'justify-start'} text-[12px]`}>
                    {isRight ? (
                        <>
                            <span className="text-[#7F7F7F]">{timeAgo}</span>
                            <Dot />
                            <span className="text-[#1D1D1F] font-medium">{name}</span>
                            <span className="ml-1">📣</span>
                        </>
                    ) : (
                        <>
                            <span className="text-[#1D1D1F] font-medium">{name}</span>
                            <Dot />
                            <span className="text-[#7F7F7F]">{timeAgo}</span>
                        </>
                    )}
                </div>

                <div
                    className={[
                        'rounded-[10px] px-4 py-2 text-[14px] font-semibold leading-6',
                        isRight ? 'bg-[#0E7A60] text-white' : 'bg-[#1F2937] text-white',
                        isRight ? 'rounded-tr-sm' : 'rounded-tl-sm',
                        'shadow-sm',
                    ].join(' ')}
                >
                    {text}
                </div>
            </div>

            {isRight && (
                <img
                    src="https://i.pravatar.cc/40?img=7"
                    alt={name}
                    className="ml-2 h-8 w-8 rounded-full object-cover"
                />
            )}
        </div>
    );
};

const QuickChatItem = ({ text }) => {
    const [click, setClick] = useState(false);
    const [edit, setEdit] = useState(false);
    const [cancel, setCancel] = useState(false);

    const handleEditClick = () => setEdit((v) => !v);
    const handleDotClick = () => setClick((v) => !v);

    const handleDeleteClick = () => {
        setCancel(true);
        setClick(false);
    };

    const handleCancelClick = () => setCancel(false);

    return (
        <div className="ready_message">
            <p className="text-[14px] text-[#584E2B]">{text}</p>
            <div className="relative">
                <button onClick={handleDotClick} className="text-[#7F7F7F] cursor-pointer">
                    <HiOutlineDotsVertical />
                </button>
                {click && (
                    <div className="absolute top-0 right-5 ml-2 z-50 rounded-[10px] bg-[#fff] text-black shadow-lg p-3 w-44">
                        <div
                            onClick={handleEditClick}
                            className="py-2 text-[14px] font-semibold hover:text-[#fff] hover:pl-2 hover:pr-2 hover:rounded-[10px] hover:bg-[#0E7A60] cursor-pointer"
                        >
                            Edit
                        </div>
                        <div
                            onClick={handleDeleteClick}
                            className="pt-2 text-[14px] font-semibold hover:text-[#fff] hover:pl-2 hover:pr-2 hover:rounded-[10px] hover:bg-[#0E7A60] cursor-pointer"
                        >
                            Delete
                        </div>
                    </div>
                )}
            </div>

            {cancel && (
                <CancelledNoteModal
                    open={cancel}
                    onClose={handleCancelClick}
                    onSubmit={(value) => {
                        console.log('Cancelled text:', value);
                        handleCancelClick();
                    }}
                />
            )}

            {edit && (
                <EditQuickChatModal
                    open={edit}
                    initialText={text}
                    onClose={handleEditClick}
                    onSubmit={(value) => {
                        console.log('Updated text:', value);
                        handleEditClick();
                    }}
                />
            )}
        </div>
    );
};

export default function OrderDetailWithChat({
    order = {
        title: 'Appliance Repairs',
        price: 500,
        client: { name: 'Jane Doe', avatar: 'https://i.pravatar.cc/80?img=5' },
        rating: 5.0,
        reviews: 1513,
        problemNote:
            'The fridge is not cooling properly, making strange noises, freezing food, leaking water, etc.',
        address: '123 Oak Street Springfield, IL 62704',
        serviceDate: '18 Sep, 14:00',
        statusLabel: 'Accepted',
    },
    messages = [
        { id: 1, side: 'left', name: 'Mike', timeAgo: '14 days ago', text: 'Hi Bryan, our priorities have just changed 🙂' },
        { id: 2, side: 'right', name: 'Bryan', timeAgo: '5 days ago', text: "No problem, I'm listening for the changes 📣" },
        { id: 3, side: 'left', name: 'Mike', timeAgo: '3 days ago', text: 'Can you prioritize the task from yesterday 🙏' },
        { id: 4, side: 'right', name: 'Bryan', timeAgo: '1 days ago', text: 'Consider it done Mike ✅✨' },
    ],
}) {
    // this is for task complete popup (Add Quick Chat)
    const [click, setClick] = useState(false);
    const [quickChat, setQuickChat] = useState([
        'Can you provide an update on when the service will start?',
        'Can you please confirm the details of the service before we begin?',
        'Can you provide an update on when the service will start?',
    ]);

    const handleDotClick = () => setClick(!click);
    const handleAddQuickChat = (text) => setQuickChat((prev) => [...prev, text]);

    // sequence: idle -> waiting -> feedback
    const [stage, setStage] = useState('idle');
    const handleTaskDoneFlow = () => {
        setStage('waiting');
        setTimeout(() => setStage('feedback'), 2500);
    };

    return (
        <div className="w-full bg-white rounded-[24px] p-[32px]">
            {/* Header card */}
            <OrderHeader order={order} onTaskDone={handleTaskDoneFlow} />

            {/* Conversation */}
            <div className="mt-8 space-y-6">
                {messages.map((m) => (
                    <ChatBubble key={m.id} side={m.side} name={m.name} timeAgo={m.timeAgo} text={m.text} />
                ))}
            </div>

            {/* Center status area (conditional) */}
            <div className="w-full mt-6">
                {stage === 'waiting' && (
                    <div className="flex flex-col gap-[18px] w-full items-center">
                        <h3 className="text-[#7A7A7A] text-2xl">Please wait for acceptance from Jane Doe.</h3>
                        <hr className="w-full" />
                        <p className="text-black font-bold text-xl">Waiting for accepted</p>
                    </div>
                )}

                {stage === 'feedback' && (
                    <div className="flex flex-col w-full items-center">
                        <div className="w-full py-[70px]">
                            <p className="text-xl font-semibold text-[#111] mb-3">Received feedback from the provider.</p>
                            <div className="client_feedback_card border-1 border-[#EBEBEB]">
                                <div className="flex gap-3">
                                    <img src="https://i.pravatar.cc/60?img=15" alt="Provider" className="h-12 w-12 rounded-full object-cover" />
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-[#111]">Jessica R</span>
                                            <span className="text-[#F1C400]">★ ★ ★ ★ ☆</span>
                                            <span className="text-[#8F8F8F] text-sm">(4.0)</span>
                                        </div>
                                        <p className="text-[#7F7F7F] text-sm mt-1">
                                            Thank you for your order! It was a pleasure working on your request. I hope the service met
                                            your expectations. Please feel free to reach out if you need anything else!
                                        </p>
                                    </div>
                                </div>
                                <span className="text-[#8F8F8F] text-sm whitespace-nowrap">2 Days ago</span>
                            </div>
                        </div>

                        <div className="w-full text-center border-b pb-[18px]">
                            <p className="text-[#6B7280] text-lg md:text-2xl">
                                The service was no longer required due to unforeseen circumstances.
                            </p>
                        </div>

                        <div className="w-full text-center pt-[18px]">
                            <p className="text-[#000] text-xl">Cancellation reason provided by you.</p>
                            <p className="text-[#7D7D7D] text-[12px]">1:45 PM</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Quick Chats + Composer (only when not waiting/feedback) */}
            {stage !== 'waiting' && stage !== 'feedback' && (
                <>
                    {/* Quick Chats list */}
                    <div className="mt-8 rounded-2xl bg-white shadow-sm ring-1 ring-black/5 p-4 overflow-y-auto">
                        <div className="space-y-3 max-h-[310px] overflow-y-auto">
                            {quickChat.map((q, i) => (
                                <QuickChatItem key={i} text={q} />
                            ))}
                        </div>
                    </div>

                    {/* Composer */}
                    <div className="mt-4 flex w-full justify-end gap-3">
                        <button
                            onClick={handleDotClick}
                            type="button"
                            className="rounded-[24px] cursor-pointer border border-[#0E7A60] px-5 py-2 text-[14px] font-bold text-[#0E7A60] hover:bg-[#0E7A60]/5 transition"
                        >
                            Add Quick Chats
                        </button>
                    </div>
                </>
            )}

            <AddQuickChatModal open={click} onClose={handleDotClick} onSubmit={handleAddQuickChat} />
        </div>
    );
}