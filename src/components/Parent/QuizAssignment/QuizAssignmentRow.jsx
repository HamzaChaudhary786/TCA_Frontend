import React, { useEffect, useState } from 'react'
import IMAGES from '../../../assets/images/index';

const QuizAssignmentRow = (props) => {
    const [timePassed, setTimePassed] = useState(false);
    const [timeLeft, setTimeLeft] = useState('');

    const compareDateAndTime = (dateTimeString) => {
        const eventDateTime = new Date(dateTimeString);
        const currentDateTime = new Date();

        if (eventDateTime < currentDateTime) {
            setTimePassed(true);
        } else {
            setTimePassed(false);
            // Calculate the difference in milliseconds
            const difference = eventDateTime - currentDateTime;
            // Convert the difference to days, hours, minutes, and seconds
            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((difference / (1000 * 60)) % 60);
            const seconds = Math.floor((difference / 1000) % 60);
            // Update the timeLeft state with days included
            setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
        }
    };

    useEffect(() => {
        const formattedDateTimeString = props.deadline
            .replace(/(\d+)(st|nd|rd|th)/, '$1') // Removes 'st', 'nd', 'rd', 'th'
            .replace(',', '') // Removes the comma
            .replace(/(\d+)([ap]m)$/i, (match, p1, p2) => `${p1} ${p2.toUpperCase()}`); // Ensures AM/PM is capitalized and properly spaced

        compareDateAndTime(formattedDateTimeString);


        const intervalId = setInterval(() => {
            compareDateAndTime(formattedDateTimeString);
        }, 1000);

        // Clear the interval on component unmount
        return () => clearInterval(intervalId);
    }, [props.deadline]); // Dependency array ensures useEffect is only run when props.deadline changes



    return (
        <div className='min-w-full'>
            <div onClick={props.onlineclick} style={{ backgroundColor: props.bgColor, }} className={`md:py-5 py-2 md:pl-3 md:pr-5 flex flex-row items-center cursor-pointer border-b border-grey mt-2`}>
                <p className={`w-full md:flex-[1] flex-[1] md:text-[14px] text-[11px] text-center md:text-left ${props.header ? 'font-semibold' : ''}`}>{props.index + "."}</p>
                <p className={`w-full md:flex-[3] my-1 md:my-0  md:text-[14px] text-[11px] md:text-center ${props.header ? 'font-semibold' : ''}`}>{props.subject}</p>
                <p className={`w-full md:flex-[3] my-1 md:my-0 text-center md:text-center md:text-[14px]  text-[11px] ${props.header ? 'font-semibold' : ''}`}>{props.title}</p>
                <p className={`w-full md:flex-[3] my-1 md:my-0 text-center md:text-center md:text-[14px]  text-[11px] ${props.header ? 'font-semibold' : ''}`}>{props.deadline}</p>
                <p className={`w-full md:flex-[3] my-1 md:my-0 text-center md:text-center md:text-[14px]  text-[11px] ${props.header ? 'font-semibold' : ''}`}>{props.total_marks}</p>
                <p className={`w-full md:flex-[3] my-1 md:my-0 text-center md:text-center md:text-[14px]  text-[11px] ${props.header ? 'font-semibold' : ''}`}>
                    {props.header ? (
                        props.download
                    ) : (
                        <a href={props.download} download target='_blank' rel="noopener noreferrer">
                            <img src={IMAGES.Download} alt='' className='md:w-[18px] md:h-[18px] mx-auto block w-[16px] h-[16px] cursor-pointer' />
                        </a>
                    )}
                </p>
                {
                    props.header ? (
                        <p className={`w-full md:flex-[2] my-1 md:my-0 text-center md:text-center md:text-[14px]  text-[11px] ${props.header ? 'font-semibold' : ''}`}>
                            Upload
                        </p>

                    ) : (
                        props.upload ? (
                            <div className={`w-full md:flex-[2] my-1 md:my-0 text-center md:text-center`}>
                                <div className='bg-[#0B1053] rounded-xl flex items-center justify-center py-1 text-white md:text-[14px] text-[11px]'>
                                    Upload
                                </div>
                            </div>
                        ) : (
                            <div className={`w-full md:flex-[2] my-1 md:my-0 text-center md:text-center`}>
                                <div className='bg-[#91919133] rounded-xl flex items-center justify-center py-1 text-black md:text-[14px]  text-[11px]'>
                                    Uploaded
                                </div>
                            </div>
                        )

                    )
                }



            </div>
            {
                props.isQuiz && !props.header && (

                    props.upload ? (
                        <div className='flex flex-row items-center justify-end'>
                            {timePassed ? (
                                <div className='[#0B1053] md:text-[10px] text-[8px]'>
                                    Time Up!
                                </div>
                            ) : (
                                <div className='flex flex-row items-center justify-end'>
                                    <div className='bg-[#A41D30]/10 rounded-xl flex items-center justify-center py-1 px-2 text-[#0B1053] md:text-[10px] text-[8px]'>
                                        {timeLeft}
                                    </div>
                                </div>
                            )}

                        </div>
                    ) : (
                        <div className='flex flex-row items-center justify-end'>
                            <div className='bg-[#108206]/10 rounded-xl flex items-center justify-center py-1 px-2 text-[#108206] md:text-[10px] text-[8px]'>
                                Submitted On Time!
                            </div>
                        </div>
                    )

                )
            }

        </div>
    )
}

export default QuizAssignmentRow