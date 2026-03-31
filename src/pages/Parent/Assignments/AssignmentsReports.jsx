import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import IMAGES from "../../../assets/images";
import Card from "../../../components/Parent/Reports/Card";
import QuizAssignmentsTable from "../../../components/Parent/QuizAssignment/QuizAssignmentsTable";
import Navbar from "../../../components/Parent/Dashboard/Navbar";
import { useParent } from "../../../context/ParentContext";
import { useQuery } from "@tanstack/react-query";
import { getChildReport } from "../../../api/Parent/ParentApi";

const AssignmentsReports = () => {
  const navigate = useNavigate();

  const location = useLocation();

  const { assignments } = useParams();

  //console.log(assignments, "assignments is");


  const { selectedChild } = useParent();

  const reportQuery = useQuery({
    queryKey: ["report", selectedChild.id, location?.state?.classroom?.id, location?.state?.subject?.id, location?.state?.teacher?.id], // Add dependencies
    queryFn: async () => {
      //console.log("selected child is : ", selectedChild);
      let results = await getChildReport(
        selectedChild.id,
        location?.state?.classroom?.id,
        location?.state?.subject?.id,
        location?.state?.teacher?.id
      );
      //console.log(" report result is : ", results);
      return results;
    },
    staleTime: 0,
    cacheTime: 0,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    enabled: !!location?.state,
  });


  //console.log(reportQuery?.data, "reportQuery data is ");



  const stats = [
    {
      type: "Assignments",
      percentage: parseInt(reportQuery?.data?.averageAssignmentMarks?.percentage),
      grade: `Grade ${reportQuery?.data?.averageAssignmentMarks?.grade}`,
    },
    {
      type: "Quizzes",
      percentage: parseInt(reportQuery?.data?.averageQuizMarks?.percentage),
      grade: `Grade ${reportQuery?.data?.averageAssignmentMarks?.grade}`,
    },
    {
      type: "Attendance",
      percentage: parseInt(reportQuery?.data?.avgAttendancePer),
      grade: "",
    },
  ];

  return (
    <div className="flex flex-1 bg-[#F9F9F9] font-poppins">
      <div className="flex flex-1">
        <div className="flex-grow w-full px-5 lg:px-20 sm:px-10 lg:ml-72">
          <div className="h-screen ">
            <Navbar heading={"Assignment"} />
            <div className="mt-7">
              <div className="flex flex-col gap-2">
                <p className="md:text-[20px]">Overview</p>
                <div className="flex flex-col items-center flex-1 gap-2 sm:flex-row">
                  {stats.map((data) => (
                    <Card
                      percentage={data.percentage}
                      data={data.type}
                      grade={data.grade}
                      type={"Percentage"}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-7">
              <div className="flex flex-col gap-2">
                <p className="md:text-[20px]">Assignments</p>
                <div className="flex flex-row items-center gap-2">
                  <QuizAssignmentsTable data={reportQuery?.data} type={assignments} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AssignmentsReports
