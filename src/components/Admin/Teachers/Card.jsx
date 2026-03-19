import React from 'react'
import { Circle } from "rc-progress"

const Card = (props) => {
    return (
        <div className="px-4 md:px-10 sm:flex-1 w-full py-4 md:py-7 border-2 border-[#00000040] rounded-md flex flex-col justify-center items-center bg-white gap-2 md:gap-3">
            
            <div className='h-[70px] md:h-[100px] w-[70px] md:w-[100px] relative flex justify-center items-center'>
                <Circle percent={props.percentage}
                    strokeColor="#0B1053"
                    strokeWidth={9}
                    trailColor='#EAECF0'
                    trailWidth={9}
                />
                <div className='absolute flex flex-col items-center'>
                    <span className='text-[7px] md:text-[10px]'>{props.type}</span>
                    <span className='text-[12px] md:text-sm font-semibold'>{
                        props.type === 'Marks' ? Math.round(props.percentage) : Math.round(props.percentage) + "%"
                    }</span>
                    <span className='text-[7px] md:text-[10px]'>{props.grade}</span>
                </div>
            </div>
            <p className='text-xs font-semibold text-center md:text-sm'>
                {props.data}
            </p>
        </div>
    )
}

export default Card