import React, { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import { FaAngleDown } from "react-icons/fa6";
import { useParent } from "../../../context/ParentContext";
import { useGetAllSubjectAttendence } from "../../../api/Parent/OverallAttendenceApi";

const Attendance = () => {
    const { selectedChild } = useParent();
    const { studentAllSubjectsAttendence } = useGetAllSubjectAttendence(selectedChild?._id);

    // Loading state to ensure the component waits for data
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (studentAllSubjectsAttendence) {
            setIsLoading(false);
        }
    }, [studentAllSubjectsAttendence]);

    // Dummy chart data for initial display
    const chartData = [
        { label: "Present", value: 1 },
        { label: "Absent", value: 1 },
        { label: "Leave", value: 1 },
    ];

    // Check if data exists and contains non-zero values
    const hasData =
        studentAllSubjectsAttendence &&
        studentAllSubjectsAttendence.length > 0 &&
        studentAllSubjectsAttendence.some((data) => data.value > 0);

    const doughnutData = {
        labels: hasData
            ? studentAllSubjectsAttendence.map((data) => data.label)
            : chartData.map((data) => data.label),
        datasets: [
            {
                label: "Count",
                data: hasData
                    ? studentAllSubjectsAttendence.map((data) => data.value)
                    : chartData.map((data) => data.value),
                backgroundColor: ["#11AF03", "#C53F3F", "#EAECF0"],
                borderColor: ["#11AF03", "#C53F3F", "#EAECF0"],
            },
        ],
    };

    return (
        <div className="flex flex-1">
            <div className="flex flex-col flex-1 gap-2">
                <div className="flex">
                    <p className="flex text-xl font-medium">Attendance</p>
                </div>
                <div className="flex py-2 flex-col gap-1 px-0 sm:px-3 sm:py-5 bg-white rounded-lg custom-shadow">
                    <div className="flex px-5 text-sm ">
                        <div className="flex justify-center flex-1">
                            <p></p>
                        </div>
                    </div>
                    <div className="flex flex-1 gap-2 py-2 sm:p-2">
                        <div className="flex items-center flex-1">
                            <div className="flex gap-[2px] sm:gap-2 flex-1 justify-between">
                                <div className="flex w-[210px] h-[210px] flex-1">
                                    {isLoading ? (
                                        <p>Loading...</p> // Show a loader while data is being fetched
                                    ) : (
                                        <Doughnut className="!flex" data={doughnutData} />
                                    )}
                                </div>
                                <div className="flex flex-1 justify-center sm:justify-end items-start">
                                    <div className="flex justify-end items-center">
                                        <p className="px-[3px] sm:px-5 py-2 border border-[#00000020] rounded-md cursor-pointer text-[#101828]/60 flex items-center justify-between gap-[2px] sm:gap-4">
                                            Overall <FaAngleDown className="text-[#101828]/60" />
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Attendance;
