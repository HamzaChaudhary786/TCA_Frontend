import React, { useState } from 'react'
import { LuClock } from 'react-icons/lu'
import { MdOutlinePerson2 } from 'react-icons/md'
import { PiDotsThreeOutlineVerticalLight } from 'react-icons/pi'
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import moment from 'moment';
import { useSidebar } from '../../../context/SidebarContext';

const audienceConfig = {
    student: { label: 'Student', bg: '#E6F1FB', color: '#0C447C' },
    parent: { label: 'Parent', bg: '#EAF3DE', color: '#27500A' },
    teacher: { label: 'Teacher', bg: '#FAEEDA', color: '#633806' },
    all: { label: 'All', bg: '#EEEDFE', color: '#3C3489' },
};

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
            whiteSpace: 'nowrap',          // ADD: badge ko wrap hone se rokta hai
            flexShrink: 0,                 // ADD: badge squeeze na ho
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

                {/* ADD: Top row — mobile pe column ban jaata hai, desktop pe row rehta hai */}
                <div className='flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center'>

                    {/* Title + Badge */}
                    <div className='flex items-center gap-2 flex-wrap min-w-0'>  {/* ADD: flex-wrap + min-w-0 */}
                        <p className='text-base sm:text-xl font-semibold break-words min-w-0'>  {/* ADD: text-base mobile, break-words */}
                            {announcement.title}
                        </p>
                        <AudienceBadge target={announcement.visibility} />
                    </div>

                    {/* Date/Time + Dots — mobile pe apni line mein */}
                    <div className={`flex gap-3 items-center flex-wrap text-xs relative text-black/50 ${isSidebarOpen ? "-z-50" : "z-auto"}`}>
                        {/* ADD: flex-wrap taake 320px pe date/time wrap ho sake */}

                        <div className='flex gap-1 items-center'>   {/* ADD: gap-1 tighter on small */}
                            <MdOutlinePerson2 size={16} />
                            <p className='whitespace-nowrap'>{announcement?.date?.split("T")[0]}</p>  {/* ADD: whitespace-nowrap */}
                        </div>

                        <div className='flex gap-1 items-center'>
                            <LuClock size={16} />
                            <p className='whitespace-nowrap'>{announcement?.date?.split("T")[1].split(".")[0]}</p>
                        </div>

                        {showMenu && <DotsMenu />}
                        <PiDotsThreeOutlineVerticalLight onClick={toggleMenu} size={20} className='cursor-pointer flex-shrink-0' />  {/* ADD: flex-shrink-0 */}
                    </div>
                </div>

                {/* Description */}
                <div className='flex text-sm'>
                    <p className='flex break-words w-full'>{announcement.description}</p>  {/* ADD: break-words + w-full */}
                </div>

            </div>
        </div>
    )
}

export default AnnouncementCard