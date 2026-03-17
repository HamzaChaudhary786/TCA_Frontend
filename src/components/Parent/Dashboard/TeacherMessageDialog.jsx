import React, { useState, useRef } from 'react'
import IMAGES from '../../../assets/images';
import { IoSend } from "react-icons/io5";
import useClickOutside from '../../../hooks/useClickOutlise';
import { useMutation } from '@tanstack/react-query';
import { submitFeedback } from '../../../api/Student/Feedback';
import { toast } from 'react-toastify';
import LoaderSmall from '../../../utils/LoaderSmall';

const TeacherMessageDialog = ({ handleFeedback, item }) => {
    const [feedback, setFeedback] = useState("");
    const [msgText, setMsgText] = useState("");

    const handleSendMessage = () => {
        if (!msgText.trim()) {
            toast.warning("Please enter a message.");
            return;
        }
        // Logic for sending message (if implemented in backend)
        toast.info("Message functionality coming soon!");
    }

    const handleSendFeedback = async () => {
        if (!feedback.trim()) {
            toast.warning("Please enter feedback.");
            return;
        }
        const teacherID = item?.teacher?._id || item?.teacherId;
        if (!teacherID) {
            toast.error("Teacher ID not found.");
            return;
        }
        let data = { message: feedback, teacherID };
        const resp = await submitFeedback(data);
        return resp;
    }

    const feedbackMutation = useMutation({
        mutationKey: ["sendfeedback"],
        mutationFn: handleSendFeedback,
        onSuccess: (data) => {
            if (data) {
                toast.success("Feedback submitted successfully!");
                setFeedback("");
                handleFeedback();
            }
        },
        onError: (error) => {
            toast.error(error?.message || "Error while submitting feedback.");
        }
    })

    const dialogRef = useRef(null);
    useClickOutside(dialogRef, handleFeedback);

    return (
        <div ref={dialogRef} className='fixed z-10 flex py-4 bg-white rounded-lg shadow-lg top-40 w-72'>
            <div className='flex flex-col w-full'>
                <div className='flex items-center gap-4 px-5 py-4 border-b border-b-black/30'>
                    <img src={(item.teacher?.profile && item.teacher?.profile !== "null") ? item.teacher.profile : IMAGES.ProfileSvg} alt="" className='w-16 h-16 rounded-full object-cover' />
                    <div className='flex flex-col'>
                        <p className='font-medium text-black'>{item?.teacher?.name || "Teacher"}</p>
                        <p className='text-sm text-black/70'>Instructor</p>
                    </div>
                </div>
                <div className='flex flex-col items-center justify-center gap-3 py-2'>
                    <div className='flex w-full items-center justify-center gap-2'>
                        <input
                            type="text"
                            value={msgText}
                            onChange={(e) => setMsgText(e.target.value)}
                            className='w-4/5 px-2 py-1 rounded-md outline-none bg-[#919191]/10 text-black text-[12px]'
                            placeholder='Send Quick Message'
                        />
                        <IoSend size={18} onClick={handleSendMessage} className='cursor-pointer' color='#0B1053' />
                    </div>
                    <div className='flex w-full items-center justify-center flex-row px-4 gap-2'>
                        <input
                            type="text"
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            className='px-2 py-1 w-full rounded-md outline-none bg-[#919191]/10 text-black text-[12px]'
                            placeholder='Enter Feedback'
                        />
                        {feedbackMutation.isPending ? <LoaderSmall /> : (
                            <IoSend size={20} onClick={() => feedbackMutation.mutate()} className='cursor-pointer' color='#0B1053' />
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TeacherMessageDialog