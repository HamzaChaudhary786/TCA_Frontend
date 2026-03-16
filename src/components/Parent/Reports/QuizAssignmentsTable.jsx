import React from 'react'
import IMAGES from '../../../assets/images';
import { useNavigate, useParams } from 'react-router-dom';

const QuizAssignmentsTable = ({ data }) => {
    const params = useParams()
    const navigate = useNavigate()

    const thClass = "flex justify-center items-center text-center md:text-[15px] text-[11px] font-medium min-w-0 break-words";
    const tdClass = "flex justify-center items-center text-center px-[2px] md:px-[4px] text-[10px] md:text-[14px] py-2 lg:py-3 border-l border-l-black/10 min-w-0 break-words leading-tight";

    return (
        <div className="flex flex-1">
            <div className="flex flex-col flex-1 gap-2">
                <div className="flex flex-1 overflow-x-auto">
                    <table className="flex flex-col flex-1 bg-white rounded-lg w-full">
                        <thead className="flex px-2 py-3 rounded-tl-lg rounded-tr-lg bg-[#c5c8f5]">
                            <tr className="flex flex-1 w-full">
                                <td className={`flex-[1] ${thClass}`}>Sr No.</td>
                                <td className={`flex-[3] ${thClass}`}>Title</td>
                                <td className={`flex-[3] ${thClass}`}>Obtained Marks</td>
                                <td className={`flex-[3] ${thClass}`}>Total Marks</td>
                                <td className={`flex-[2] ${thClass}`}>Grade</td>
                                <td className={`flex-[3] ${thClass}`}>Feedback</td>
                            </tr>
                        </thead>

                        <tbody className="flex flex-col w-full">
                            {data?.map((item, index) => {
                                const mod = (item.marksObtained / item.totalMarks) * 100;
                                let grade = "F";
                                if (mod >= 90) grade = "A";
                                else if (mod >= 80) grade = "B";
                                else if (mod >= 70) grade = "C";
                                else if (mod >= 60) grade = "D";
                                else if (mod >= 50) grade = "E";

                                return (
                                    <tr
                                        key={index}
                                        style={{ cursor: "pointer" }}
                                        className="flex flex-1 w-full border-t border-t-black/10 items-stretch"
                                    >
                                        <td className="flex-[1] py-2 lg:py-3 flex justify-center items-center text-[10px] md:text-[14px] min-w-0">
                                            {index + 1}
                                        </td>
                                        <td className={`flex-[3] ${tdClass}`}>
                                            {item.title}
                                        </td>
                                        <td className={`flex-[3] ${tdClass}`}>
                                            {item.marksObtained}
                                        </td>
                                        <td className={`flex-[3] ${tdClass}`}>
                                            {item.totalMarks}
                                        </td>
                                        <td className={`flex-[2] ${tdClass}`}>
                                            {grade}
                                        </td>
                                        <td className={`flex-[3] ${tdClass}`}>
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