import React from "react";
import Loader from "../../../utils/Loader";
import IMAGES from "../../../assets/images";
import Navbar from "../../../components/Teacher/Navbar";
import Card from "../../../components/Teacher/StudentReports/Card";
import AttendanceTable from "../../../components/Teacher/StudentReports/AttendanceTable";
import QuizAssignmentsTable from "../../../components/Teacher/StudentReports/QuizAssignmentsTable";

// import { Doughnut } from "react-chartjs-2";
import { LuPhone } from "react-icons/lu";
import { IoMailOutline } from "react-icons/io5";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { getStudentReport } from "../../../api/Teacher/StudentReport";


import { useBlur } from "../../../context/BlurContext";


const SubjectReport = () => {
  const location = useLocation();
  const { isBlurred } = useBlur();

  const attendanceData = [
    {
      status: "Present",
      date: "8th Jan, 2022",
      time: "8:30am - 9:30am",
    },
    {
      status: "Present",
      date: "8th Jan, 2022",
      time: "8:30am - 9:30am",
    },
    {
      status: "Present",
      date: "8th Jan, 2022",
      time: "8:30am - 9:30am",
    },
  ];

  const { data, isPending, isSuccess, isError, refetch, isRefetching } = useQuery({
    queryKey: ["studentReports", location.state?.id, location.state?.classroom?.id, location.state?.subject?.id],
    queryFn: async () => {
      if (!location.state?.id) return null;
      let result = await getStudentReport(location.state.id, location.state.classroom.id, location.state.subject.id);
      return result;
    },
    enabled: !!location.state?.id
  });

  console.log("report data in student subject is : ", data);

  if (!location.state) return <div className="p-20">Student not found. Please go back and select a student.</div>;

  return (
    isPending || isRefetching ? <div className="flex justify-start flex-1"> <Loader /> </div> :
      (!data || isError) ? <div className="flex justify-center items-center h-screen w-full">Error loading report data.</div> :
      <div className={`flex flex-1 bg-[#F9F9F9] font-poppins ${isBlurred ? "blur" : ""}`}>
        <div className="flex flex-1">
          <div className="flex-grow w-full px-3 lg:px-20 sm:px-10 lg:ml-72">
            <div className="pt-1">
              <Navbar heading={"Student Report"} />
              <div className="mt-7">
                <div className="flex flex-col items-center justify-center gap-1">
                  <img src={location.state?.profilePic || IMAGES.Profile} alt="" className="sm:w-40 sm:h-40 w-20 h-20 rounded-full" />
                  <p className="text-lg font-semibold">{location.state?.name}</p>
                  <div className="flex items-center gap-2 text-xs">
                    <LuPhone />
                    <p>{location.state?.phoneNumber}</p>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <IoMailOutline />
                    <p>{location.state?.email}</p>
                  </div>
                </div>
              </div>
              <div className="mt-7">
                <div className="flex flex-col gap-2">
                  <p className="md:text-[20px]">Overview</p>
                  <div className="flex flex-col items-center flex-1 gap-2 sm:flex-row">
                    <Card
                      percentage={data?.averageAssignmentMarks?.percentage || 0}
                      data={"Assignments"}
                      grade={data?.averageAssignmentMarks?.grade || "F"}
                      type={"Percentage"}
                    />
                    <Card
                      percentage={data?.averageQuizMarks?.percentage || 0}
                      data={"Quizes"}
                      grade={data?.averageQuizMarks?.grade || "F"}
                      type={"Percentage"}
                    />
                    <Card
                      percentage={data?.attendance?.avgAttendancePer?.toFixed(1) || 0}
                      data={"Attendence"}
                      // grade={"F"}
                      type={"Percentage"}
                    />
                  </div>
                </div>
              </div>
              <div className="mt-7">
                <div className="flex flex-col gap-2">
                  <p className="md:text-[20px]">Assignments</p>
                  <div className="flex flex-row items-center gap-2">
                    <QuizAssignmentsTable data={data?.assignments || []} type={"a"} />
                  </div>
                </div>
              </div>
              <div className="mt-7">
                <div className="flex flex-col gap-2">
                  <p className="md:text-[20px]">Quizzes</p>
                  <div className="flex flex-row items-center gap-2">
                    <QuizAssignmentsTable data={data?.quizes || []} type={"q"} />
                  </div>
                </div>
              </div>

              <div className="mt-7">
                <div className="flex flex-col gap-2">
                  <p className="md:text-[20px]">Attendance</p>
                  <div className="flex flex-row items-center gap-2">
                    <AttendanceTable data={data?.attendance?.classes || []} type="att" />
                  </div>
                </div>
              </div>

              <div className="mt-7">
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default SubjectReport;
