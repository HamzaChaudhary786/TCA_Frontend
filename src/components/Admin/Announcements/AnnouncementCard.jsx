import React, { useState } from 'react'
import { LuClock } from 'react-icons/lu'
import { MdOutlinePerson2 } from 'react-icons/md'
import { PiDotsThreeOutlineVerticalLight } from 'react-icons/pi'
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import moment from 'moment';
import { useSidebar } from '../../../context/SidebarContext';

// ADD: har role ka badge color aur label
const audienceConfig = {
    student: { label: 'Student', bg: '#E6F1FB', color: '#0C447C' },
    parent: { label: 'Parent', bg: '#EAF3DE', color: '#27500A' },
    teacher: { label: 'Teacher', bg: '#FAEEDA', color: '#633806' },
    all: { label: 'All', bg: '#EEEDFE', color: '#3C3489' },
};

// ADD: yeh badge component title ke saath dikhega
const AudienceBadge = ({ target }) => {
    const config = audienceConfig[target?.toLowerCase()] || audienceConfig['all'];
    return (
        <span style={{
            backgroundColor: config.bg,
            color: config.color,
            fontSize: '11px',
            fontWeight: 500,
            padding: '2px 8px',
            borderRadius: '999px',
        }}>
            {config.label}
        </span>
    );
};

const AnnouncementCard = ({ announcement, deleteAnnouncement, editAnnouncement, refetch }) => {

    const { isSidebarOpen, setIsSidebarOpen, isopen, setIsopen } = useSidebar();

    const DotsMenu = () => {
        return (
            <>
                <div className='shadow-md absolute z-10 bg-white rounded-md top-2 right-5'>
                    <div className='py-2 px-2'>
                        <div className='py-2 px-2'>
                            <div onClick={() => { editAnnouncement(announcement); toggleMenu(); refetch() }} className='cursor-pointer flex gap-2 items-center py-2 px-2'>
                                <FiEdit size={20} />
                                <p>Edit</p>
                            </div>
                            <div className='border-b border-b-black/10'></div>
                            <div onClick={() => { deleteAnnouncement(announcement._id), toggleMenu(); refetch() }} className='cursor-pointer flex gap-2 items-center py-2 px-2 text-maroon'>
                                <RiDeleteBin6Line size={20} />
                                <p>Delete</p>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }

    const [showMenu, setShowMenu] = useState(false);
    const toggleMenu = () => {
        setShowMenu(!showMenu);
    }

    return (
        <div className='py-4 px-4 bg-white border border-black/20 rounded-md shadow-sm'>
            <div className='flex flex-col gap-2'>
                <div className='flex justify-between items-center'>
                    {/* <p className='text-xl font-semibold'>{announcement.title}</p> */}

                    <div className='flex items-center gap-2'>
                        <p className='text-xl font-semibold'>{announcement.title}</p>
                        <AudienceBadge target={announcement.visibility} />
                    </div>
                    <div className={`flex gap-4 items-center text-xs relative text-black/50 ${isSidebarOpen ? "-z-50" : "z-auto"}`}>
                        <div className='flex gap-2 items-center'>
                            <p><MdOutlinePerson2 size={16} /> </p>
                            <p>{announcement?.date?.split("T")[0]} { /*{moment.utc(announcement.date).format("hh:mm A")} */} </p>
                        </div>
                        <div className='flex gap-2 items-center'>
                            <p><LuClock size={16} /> </p>
                            <p>{announcement?.date?.split("T")[1].split(".")[0]}</p>
                        </div>
                        {showMenu && <DotsMenu />}
                        <PiDotsThreeOutlineVerticalLight onClick={toggleMenu} size={20} className='cursor-pointer' />
                    </div>
                </div>
                <div className='flex text-sm'>
                    <p className='flex'>{announcement.description} </p>
                </div>
            </div>
        </div>
    )
}

export default AnnouncementCard
