import { Circle } from "rc-progress";
import React, { useEffect, useState } from "react";
import { useParent } from "../../../context/ParentContext";
import { useQuery } from "@tanstack/react-query";
import { getAllSubjects, getChildLastDeliveredAssignmentReport, getChildReport } from "../../../api/Parent/ParentApi";
import { useSidebar } from "../../../context/SidebarContext";

const LastDeliverables = () => {


  const [enableQuery, setEnableQuery] = useState(false);

  const { allSubjects, setAllSubjects, selectedChild } = useParent();
  const { isSidebarOpen, setIsSidebarOpen, isopen, setIsopen } = useSidebar();


  //console.log(selectedChild, "current selected child: ", allSubjects, "all subject of selected child: ");


  const subjectQuery = useQuery({
    queryKey: ["subjects"], queryFn: async () => {
      const results = await getAllSubjects(selectedChild?._id);
      //console.log("subject in enrolled classes is : ", results);
      setAllSubjects(results);
      return results
    }, staleTime: 300000, enabled: enableQuery
  });

  //console.log(subjectQuery, "subject query");

  useEffect(() => {
    if (allSubjects.length == 0) {
      setEnableQuery(true);
    }
  }, []);

  const lastDeliveredAssignmentreportQuery = useQuery({
    queryKey: ["report", selectedChild?._id],
    queryFn: async () => {
      //console.log("selected child is : ", selectedChild);
      const results = await getChildLastDeliveredAssignmentReport(
        selectedChild?._id,
      );
      //console.log("report result is : ", results);
      return results;
    },
    enabled: !!selectedChild?._id,
    staleTime: 30000, // Cache for 30 seconds
  });

  // Check if data is available or fallback to default values
  const lastAssignment = lastDeliveredAssignmentreportQuery?.data?.lastAssignment || {};
  const percentage = parseFloat(lastAssignment.percentage) || 0; // Fallback to 0 if undefined
  const grade = lastAssignment.grade ? `${lastAssignment.grade}` : "N/A";
  const title = lastAssignment.title ? `${lastAssignment.title}` : "N/A"

  // Stats object
  const stats = {
    type: "Assignments",
    title,
    percentage,
    grade,
  };




  const DeliverableComponent = ({ subjectQuery }) => {
    return (
      <div className="flex flex-col items-center justify-center w-full gap-2 bg-white rounded-md md:px-8 sm:flex-1 md:py-2 md:gap-3">
        <div className="relative flex flex-col items-center justify-center w-28 h-36 md:flex-row">
          {subjectQuery?.data?.length > 0 ? (
            subjectQuery.data.map((item, index) => (
              <div className="text-xs" key={index}>
                {JSON.stringify(item)}
              </div>
            ))
          ) : (
            <div className="text-sm text-gray-500"></div>
          )}


          <Circle
            className=""
            percent={stats.percentage}
            strokeColor="#0B1053"
            strokeWidth={12}
            trailColor="#EAECF0"
            trailWidth={12}
          />
          <div className={`absolute flex flex-col items-center text-[7px] md:text-[10px] ${isSidebarOpen ? "-z-50" : "z-auto"}`}>
            <span className="text-[7px] md:text-[10px]">Percentage</span>
            <div className="flex">
              <span className="text-[7px] md:text-base font-semibold">{stats.percentage} %</span>
            </div>
          </div>

        </div>
        {/* <p className="text-xs text-center">Submissions: 40/100</p> */}
      </div>
    );
  }
  const CustomGradeComponent = () => {
    return (
      <div className="flex flex-col items-center justify-center w-full gap-2 bg-white rounded-md md:px-8 sm:flex-1 md:py-2 md:gap-3">
        <div className="flex flex-col items-center justify-center w-28 h-28 md:flex-row bg-[#bfc3f4] text-[#555555] rounded-full">
          <div className=" flex flex-col items-center ">
            <span className="text-[7px] md:text-[10px]">Average Grade</span>
            <div className="flex">
              <span className="text-3xl  font-semibold">{stats.grade}</span>
            </div>
          </div>
        </div>
        <p className="text-xs text-center">Grade: {stats.grade}</p>
      </div>
    );
  };

  return (
    <div className={`flex flex-1 ${isSidebarOpen ? "-z-50" : "z-auto"}`}>
      <div className="flex flex-col flex-1 gap-2">
        <div className="flex">
          <p className="flex text-xl font-medium">Last Deliverable</p>
        </div>
        <div className="flex flex-col gap-1 px-3 py-5 bg-white rounded-lg custom-shadow">
          <div className="flex px-5 text-sm ">
            <div className="flex justify-center flex-1">
              <p>{stats.type} : {stats.title}</p>
            </div>
          </div>
          <div className="flex flex-1 gap-2 p-2">
            <CustomGradeComponent />
            <DeliverableComponent />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LastDeliverables;
