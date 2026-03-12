import React from 'react'
import IMAGES from '../../../assets/images';
import { useNavigate, useParams } from 'react-router-dom';

const QuizAssignmentsTable = ({ data, type }) => {
    const params = useParams()
    const navigate = useNavigate()
    //console.log(data, "data is detailed");

    return (
        <div className="flex flex-1">
            <div className="flex flex-col flex-1 gap-2">
                <div className="flex flex-1">
                    <table className="flex flex-col flex-1 bg-white rounded-lg table-fixed">
                        <thead className="flex gap-8 px-2 py-3 rounded-tl-lg rounded-tr-lg border-t-[#0B1053] bg-[#b1b5ee]">
                            <tr className="flex flex-1 space-x-5">
                                <td className="flex-[1] flex justify-center md:text-[15px] text-[13px]">Sr No.</td>
                                <td className="flex-[3] flex justify-center md:text-[15px] text-[13px]">Title</td>
                                <td className="flex-[3] flex justify-center md:text-[15px] text-[13px]">Obtained Marks</td>
                                <td className="flex-[3] flex justify-center md:text-[15px] text-[13px]">Total Marks</td>
                                <td className="flex-[3] flex justify-center md:text-[15px] text-[13px]">Grade</td>
                                <td className="flex-[3] flex justify-center md:text-[15px] text-[13px]">Feedback</td>

                            </tr>
                        </thead>

                        <tbody className="flex flex-col">
                            {data?.[type]?.map((item, index) => {
                                return (
                                    <tr style={{ cursor: "pointer" }} onClick={() => navigate(`/parent/${type}/${item.title}`, { state: data })} className="flex flex-1 text-xs border-t border-t-black/10">
                                        <td className="flex-[1] py-2 lg:py-3 flex justify-center">{index + 1}</td>
                                        <td className="flex-[3] py-2 lg:py-3 border-l border-l-black/10 flex justify-center">
                                            {item.title}
                                        </td>
                                        <td className="flex-[3] py-2 lg:py-3 border-l border-l-black/10 flex justify-center">
                                            {item.marksObtained}
                                        </td>
                                        <td className="flex-[3] py-2 lg:py-3 border-l border-l-black/10 flex justify-center">
                                            {item.totalMarks}
                                        </td>
                                        <td className="flex-[3] py-2 lg:py-3 border-l border-l-black/10 flex justify-center">
                                            {
                                                (() => {
                                                    const mod = (item.marksObtained / item.totalMarks) * 100;
                                                    if (mod >= 90) return "A";
                                                    if (mod >= 80) return "B";
                                                    if (mod >= 70) return "C";
                                                    if (mod >= 60) return "D";
                                                    if (mod >= 50) return "E";
                                                    return "F";
                                                })()
                                            }
                                        </td>
                                        <td className="flex-[3] py-2 lg:py-3 border-l border-l-black/10 flex justify-center text-center">
                                            {item.feedback || "No Feedback"}
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

export default QuizAssignmentsTable
