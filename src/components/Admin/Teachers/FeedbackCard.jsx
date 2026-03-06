import React from 'react'
import { PiDotsThreeOutlineVerticalLight } from "react-icons/pi";
import { IoCalendarOutline } from "react-icons/io5";
import { MdOutlinePerson2 } from "react-icons/md";
import { LuClock } from "react-icons/lu";

const FeedbackCard = ({ feedback }) => {
    return (
        <div className='bg-white border border-black/20 py-2 px-2 rounded-md '>
            <div className='py-2 px-2'>
                <div className=''>
                    <div className='flex justify-between px-2 py-2 text-sm'>
                        <p>{feedback?.message || "No message provided"}</p>
                        <PiDotsThreeOutlineVerticalLight size={50} />
                    </div>
                    <div className='flex justify-between items-center text-xs'>
                        <div className='flex items-center gap-4'>
                            <div className='flex gap-2 items-center'>
                                <p> <IoCalendarOutline size={16} /> </p>
                                <p>{feedback?.userID?.name || "Unknown User"}</p>
                            </div>
                            <div className='flex gap-2 items-center'>
                                <p><MdOutlinePerson2 size={16} /> </p>
                                <p>{feedback?.createdAt ? new Date(feedback.createdAt).toLocaleDateString() : "N/A"}</p>
                            </div>
                            <div className='flex gap-2 items-center'>
                                <p><LuClock size={16} /> </p>
                                <p>{feedback?.createdAt ? new Date(feedback.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "N/A"}</p>
                            </div>
                        </div>
                        <div className='flex gap-2'>
                            <p className={`flex py-1 px-6 rounded-3xl cursor-pointer ${feedback?.accepted ? "bg-green-100 text-green-700" : "bg-[#2C9B2214] text-[#2C9B22]"}`}>
                                {feedback?.accepted ? "Accepted" : "Accept"}
                            </p>
                            <p className='flex py-1 px-6 rounded-3xl cursor-pointer bg-[#A41D3010] text-[#A41D30] '>Reject</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FeedbackCard
