import React from 'react'
import { useSidebar } from '../../../context/SidebarContext'

const GradeCard = (props) => {
    const { isSidebarOpen } = useSidebar();
    return (
        <div className={`px-4 md:px-10 sm:flex-1 w-full py-4 md:py-7 border-2 border-[#00000040] rounded-md flex flex-col justify-center items-center bg-white gap-2 md:gap-3 ${isSidebarOpen ? "-z-50" : "z-auto"}`}>
            <div className='h-[70px] md:h-[100px] w-[70px] md:w-[100px] relative flex justify-center items-center'>

                <div className='rounded-full bg-[#e0e2fd] md:w-24 md:h-24 w-20 h-16 flex flex-col items-center justify-center'>
                    <div className='flex flex-col items-center justify-center'>
                        <p className='md:text-[10px] text-[10px] text-center'>{props.data}</p>
                        <p className='md:text-[25px] font-semibold'>{props.grade}</p>
                    </div>

                </div>

            </div>
            <p className='text-xs md:text-sm font-semibold text-center'>{props.type}</p>
        </div>
    )
}

export default GradeCard
