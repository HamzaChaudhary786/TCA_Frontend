import moment from 'moment';
import React from 'react'

const AttendanceTable = ({ data }) => {
    return (
        <div className="flex flex-1">
            <div className="flex flex-col flex-1 gap-2">
                <div className="flex flex-1">
                    <table className="flex flex-col flex-1 bg-white rounded-lg table-fixed">
                        <thead className="flex gap-5 px-2 py-3 rounded-tl-lg rounded-tr-lg border-t-[#0B1053] bg-[#afb3f7]">
                            <tr className="flex flex-1">
                                <td className="flex-[1] flex justify-center items-center text-center md:text-[15px] text-[11px] font-medium min-w-0 break-words">Sr No.</td>
                                <td className="flex-[3] flex justify-center items-center text-center md:text-[15px] text-[11px] font-medium min-w-0 break-words">Status</td>
                                <td className="flex-[3] flex justify-center items-center text-center md:text-[15px] text-[11px] font-medium min-w-0 break-words">Date</td>
                                <td className="flex-[3] flex justify-center items-center text-center md:text-[15px] text-[11px] font-medium min-w-0 break-words">Time</td>

                            </tr>
                        </thead>
                        <tbody className="flex flex-col">
                            {data?.map((item, index) => {
                                return (
                                    <tr className="flex flex-1 text-xs border-t border-t-black/10">
                                        <td className="flex-[1] py-2 lg:py-3 flex justify-center">{index + 1}</td>
                                        <td className="flex-[3] py-2 lg:py-3 border-l border-l-black/10 flex justify-center">
                                            {item?.matchedAttendance[0]?.isPresent ? "Present" : "Absent"}
                                        </td>
                                        <td className="flex-[3] py-2 lg:py-3 border-l border-l-black/10 flex justify-center">
                                            {moment.utc(item.startTime).format("Do MMM YYYY")}
                                        </td>
                                        <td className="flex-[3] py-2 lg:py-3 border-l border-l-black/10 flex justify-center">
                                            {moment.utc(item.startTime).format("hh:mm a")} - {moment.utc(item.endTime).format("hh:mm a")}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default AttendanceTable