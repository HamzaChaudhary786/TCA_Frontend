import React from 'react'

const DataRows = ({ index, subject, instructor, attendance, bgColor, header, onClickFunction }) => {
       if (!header && subject === instructor) {
    return null; 
  }
    return (
        <div className='min-w-full'>
            <div style={{ backgroundColor: bgColor, cursor: "pointer" }} onClick={onClickFunction} className={`px-1 md:py-5 py-2 md:pl-5 md:pr-10 flex flex-row items-center justify-around border-b border-grey mt-2`}>
            
                    
                <p className={`w-full md:flex-[1] flex-[1] md:text-[16px] text-[14px] text-center md:text-left ${header ? 'font-semibold' : ''}`}>{index + "."}</p>
                <p className={`w-full md:flex-[3] my-1 md:my-0 text-center md:text-[16px] text-[14px] md:text-left ${header ? 'font-semibold' : ''}`}>{subject}</p>
                <p className={`w-full md:flex-[3] my-1 md:my-0 text-center md:text-left md:text-[16px]  text-[14px] ${header ? 'font-semibold' : ''}`}>{instructor}</p>
                {
                    header ? (<p className={`w-full md:flex-[3] my-1 md:my-0 text-center md:text-left md:text-[16px] text-[14px] ${header ? 'font-semibold' : ''}`}>{attendance}</p>) : (
                        <div className="md:flex-[3] w-full bg-grey/50 rounded-3xl overflow-hidden">
                            <div style={{width: `${attendance || 10}%` }} className=" text-xs h-4 bg-gradient-to-r from-[#0B1053] to-[#007EEA] rounded-3xl flex justify-center text-white md:text-[16px] text-[14px]">
                                <span className=" ml-[1.26rem]">
                                {attendance || 0} 
                                %


                                </span>
                            </div>
                        </div>
                    )
                }
                
                
            </div>
        </div>
    )
}

export default DataRows
