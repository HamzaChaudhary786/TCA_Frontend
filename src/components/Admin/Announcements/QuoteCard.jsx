import React, { useState } from 'react'
import { FiEdit } from 'react-icons/fi'
import { IoCalendarOutline } from 'react-icons/io5'
import { LuClock } from 'react-icons/lu'
import { MdOutlinePerson2 } from 'react-icons/md'
import { PiDotsThreeOutlineVerticalLight } from 'react-icons/pi'
import { RiDeleteBin6Line } from 'react-icons/ri'

const QuoteCard = ({ quote, deleteQuote, editQuote, refetch }) => {

    const DotsMenu = () => {
        return (
            <>
                <div className='shadow-md absolute z-10 bg-white rounded-md top-36 right-5'>
                    <div className='py-2 px-2'>
                        <div className='py-2 px-2'>
                            <div onClick={() => { editQuote(quote); refetch(); toggleMenu(); }} className='cursor-pointer flex gap-2 items-center py-2 px-2'>
                                <FiEdit size={20} />
                                <p>Edit</p>
                            </div>
                            <div className='border-b border-b-black/10'></div>
                            <div onClick={() => { deleteQuote(quote.id); refetch(); toggleMenu(); }} className='cursor-pointer flex gap-2 items-center py-2 px-2 text-maroon'>
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

    const getDateTimeFormat = (dateStr, type) => {
        if (type == "d") {
            console.log("date str for d is : ", dateStr)
        } else {
            console.log("date str for t is : ", dateStr)
        }
    }

    return (
        <div className='px-2 py-2 flex flex-1 bg-white rounded-md border border-black/20'>
            <div className='flex p-2 flex-1' >
                <div className='flex flex-col-reverse lg:flex-row lg:justify-between flex-1 gap-2'>
                    <div className='flex flex-col justify-between items-center'>
                        <p className='text-xl font-medium flex-[2]'>{quote.title} </p>
                        <div className='flex text-sm mt-4'>
                            <p className='flex  flex-wrap'>{quote.description}</p>
                        </div>
                    </div>
                    <div className='flex flex-row justify-center items-center gap-2 text-xs flex-wrap'>

                        <div className='flex'>
                            <div className='flex items-center gap-2 lg:gap-4'>
                                <div className='flex gap-2 items-center'>
                                    <p> <IoCalendarOutline size={16} /> </p>
                                    <p>{quote.visibility}</p>
                                </div>
                                <div className='flex gap-2 items-center'>
                                    <p><MdOutlinePerson2 size={16} /> </p>
                                    <p>{quote?.date?.split("T")[0]}</p>
                                </div>
                                <div className='flex gap-2 items-center'>
                                    <p><LuClock size={16} /> </p>
                                    <p>{quote?.date?.split("T")[1].split(".")[0]}</p>
                                </div>
                            </div>
                        </div>
                        <div className='flex-1 justify-end flex gap-3'>
                            {showMenu && <DotsMenu />}
                            <PiDotsThreeOutlineVerticalLight onClick={toggleMenu} size={20} className='cursor-pointer' />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default QuoteCard
