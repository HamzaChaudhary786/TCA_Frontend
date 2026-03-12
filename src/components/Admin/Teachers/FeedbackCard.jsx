import React, { useState } from 'react'
import { PiDotsThreeOutlineVerticalLight } from "react-icons/pi";
import { IoCalendarOutline } from "react-icons/io5";
import { MdOutlinePerson2 } from "react-icons/md";
import { LuClock } from "react-icons/lu";

const FeedbackCard = ({ feedback, onAccept, onReject, onDelete }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [showRejectConfirm, setShowRejectConfirm] = useState(false);

    return (
        <div className='mt-4 sm:mt-0 bg-white border border-black/20 py-2 px-2 rounded-md'>
            <div className='py-2 px-2'>
                {/* Message row */}
                <div className='flex justify-between px-2 py-2 text-sm gap-2'>
                    <p className='flex-1'>{feedback?.message || "No message provided"}</p>
                    <div className='relative shrink-0'>
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className='p-1 rounded-full hover:bg-gray-100 transition'
                        >
                            <PiDotsThreeOutlineVerticalLight size={18} />
                        </button>
                        {menuOpen && (
                            <div className='absolute right-0 top-7 bg-white border border-black/10 rounded-md shadow-md z-10 text-xs w-28'>
                                <p
                                    onClick={() => { onDelete(feedback._id); setMenuOpen(false); }}
                                    className='px-4 py-2 hover:bg-red-50 text-red-500 cursor-pointer rounded-md'
                                >
                                    Delete
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Meta + Actions */}
                <div className='flex flex-wrap justify-between items-center text-xs gap-y-2 px-2'>
                    <div className='flex flex-wrap items-center gap-3'>
                        <div className='flex gap-1 items-center'>
                            <IoCalendarOutline size={14} />
                            <p>{feedback?.userID?.name || "Unknown User"}</p>
                        </div>
                        <div className='flex gap-1 items-center'>
                            <MdOutlinePerson2 size={14} />
                            <p>{feedback?.createdAt ? new Date(feedback.createdAt).toLocaleDateString() : "N/A"}</p>
                        </div>
                        <div className='flex gap-1 items-center'>
                            <LuClock size={14} />
                            <p>{feedback?.createdAt ? new Date(feedback.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "N/A"}</p>
                        </div>
                    </div>

                    {/* Accept / Reject */}
                    <div className='flex gap-2 ml-auto'>
                        <p
                            onClick={() => onAccept(feedback._id)}
                            className={`py-1 px-6 rounded-3xl cursor-pointer ${feedback?.accepted ? "bg-green-100 text-green-700" : "bg-[#2C9B2214] text-[#2C9B22]"}`}>
                            {feedback?.accepted ? "Accepted" : "Accept"}
                        </p>
                        <p
                            onClick={() => setShowRejectConfirm(true)}
                            className='py-1 px-6 rounded-3xl cursor-pointer bg-[#A41D3010] text-[#A41D30]'>
                            Reject
                        </p>
                    </div>
                </div>
            </div>

            {/* Reject Confirm Popup — overlays the card */}
            {showRejectConfirm && (
                <div className='absolute inset-0 bg-white/95 backdrop-blur-sm rounded-md flex flex-col items-center justify-center gap-4 z-20 px-6'>
                    <p className='text-sm font-semibold text-gray-800'>Reject this feedback?</p>
                    <p className='text-xs text-gray-400 text-center'>This action cannot be undone.</p>
                    <div className='flex gap-3'>
                        <button
                            onClick={() => setShowRejectConfirm(false)}
                            className='py-1.5 px-6 rounded-3xl text-xs border border-black/20 text-gray-600 hover:bg-gray-50 transition cursor-pointer'
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => { onReject(feedback._id); setShowRejectConfirm(false); }}
                            className='py-1.5 px-6 rounded-3xl text-xs bg-[#A41D30] text-white hover:bg-[#8a1828] transition cursor-pointer'
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default FeedbackCard