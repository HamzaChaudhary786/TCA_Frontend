import React from 'react'
import IMAGES from '../../../assets/images';

import { useNavigate, useParams } from 'react-router-dom';


const QuizAssignmentsTable = ({ data }) => {
    const params = useParams();
    const navigate = useNavigate();
    return (
        <div className="flex flex-1">
            <div className="flex flex-col flex-1 gap-2">
                <div className="flex flex-1">
                    <table className="flex flex-col flex-1 bg-white rounded-lg table-fixed">
                        <thead className="flex gap-5 px-2 py-3 rounded-tl-lg rounded-tr-lg border-t-[#0B1053] bg-[#afb3f7]">
                            <tr className="flex flex-1">
                                <td className="flex-[1] flex justify-center md:text-[15px] text-[13px]">Sr No.</td>
                                <td className="flex-[3] flex justify-center md:text-[15px] text-[13px]">Title</td>
                                <td className="flex-[3] flex justify-center md:text-[15px] text-[13px]">Obtained Marks</td>
                                <td className="flex-[3] flex justify-center md:text-[15px] text-[13px]">Total Marks</td>
                                <td className="flex-[3] flex justify-center md:text-[15px] text-[13px]">Grade</td>
                                <td className="flex-[3] flex justify-center md:text-[15px] text-[13px]">Feedback</td>
                            </tr>
                        </thead>
                        <tbody className="flex flex-col">
                            {data?.data?.map((item, index) => {
                                let grade = "";
                                let mod = (item.obtainedMarks / item.totalMarks) * 100;
                                if (mod >= 90) grade = "A";
                                else if (mod >= 80) grade = "B";
                                else if (mod >= 70) grade = "C";
                                else if (mod >= 60) grade = "D";
                                else if (mod >= 50) grade = "E";
                                else grade = "F";
                                if (item._id) {
                                    return (
                                        <tr style={{ cursor: "pointer" }} onClick={() => navigate(`/reports/${params.subject}/${item.title}`, { state: {...item, grade} })} className="flex flex-1 text-xs border-t border-t-black/10">
                                            <td className="flex-[1] py-2 lg:py-3 flex justify-center">{index + 1}</td>
                                            <td className="flex-[3] py-2 lg:py-3 border-l border-l-black/10 flex justify-center">
                                                {item?.title}
                                            </td>
                                            <td className="flex-[3] py-2 lg:py-3 border-l border-l-black/10 flex justify-center">
                                                {item?.obtainedMarks}
                                            </td>
                                            <td className="flex-[3] py-2 lg:py-3 border-l border-l-black/10 flex justify-center">
                                                {item?.totalMarks}
                                            </td>
                                            <td className="flex-[3] py-2 lg:py-3 border-l border-l-black/10 flex justify-center">
                                                {grade}
                                            </td>
                                            <td className="flex-[3] py-2 lg:py-3 border-l border-l-black/10 flex justify-center text-center">
                                                {item.feedback || "No Feedback"}
                                            </td>
                                        </tr>
                                    );
                                }
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default QuizAssignmentsTable
