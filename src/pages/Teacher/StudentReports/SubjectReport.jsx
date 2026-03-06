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


const SubjectReport = () => {
  const location = useLocation();

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
    queryKey: ["studentReports", location.state._id, location.state.classroom._id, location.state.subject._id],
    queryFn: async () => {
      let result = await getStudentReport(location.state._id, location.state.classroom._id, location.state.subject._id);
      return result;
    }
  });

  console.log("report data in student subject is : ", data);

  return (
    isPending || isRefetching ? <div className="flex justify-start flex-1"> <Loader /> </div> :
      <div className="flex flex-1 bg-[#F9F9F9] font-poppins">
        <div className="flex flex-1">
          <div className="flex-grow w-full px-5 lg:px-20 sm:px-10 lg:ml-72">
            <div className="pt-1">
              <Navbar heading={"Student Report"} />
              <div className="mt-7">
                <div className="flex flex-col items-center justify-center gap-1">
                  <img src={location.state.profilePic || IMAGES.Profile} alt="" className="sm:w-40 sm:h-40 w-20 h-20 rounded-full" />
                  <p className="text-lg font-semibold">{location.state.name}</p>
                  <div className="flex items-center gap-2 text-xs">
                    <LuPhone />
                    <p>{location.state.phoneNumber}</p>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <IoMailOutline />
                    <p>{location.state.email}</p>
                  </div>
                </div>
              </div>
              <div className="mt-7">
                <div className="flex flex-col gap-2">
                  <p className="md:text-[20px]">Overview</p>
                  <div className="flex flex-col items-center flex-1 gap-2 sm:flex-row">
                    <Card
                      percentage={data.averageAssignmentMarks.percentage}
                      data={"Assignments"}
                      grade={data.averageAssignmentMarks.grade}
                      type={"Percentage"}
                    />
                    <Card
                      percentage={data.averageQuizMarks.percentage}
                      data={"Quizes"}
                      grade={data.averageQuizMarks.grade}
                      type={"Percentage"}
                    />
                    <Card
                      percentage={data.attendance.avgAttendencePer.toFixed(1)}
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
                    <QuizAssignmentsTable data={data.assignments} type={"a"} />
                  </div>
                </div>
              </div>
              <div className="mt-7">
                <div className="flex flex-col gap-2">
                  <p className="md:text-[20px]">Quizzes</p>
                  <div className="flex flex-row items-center gap-2">
                    <QuizAssignmentsTable data={data.quizes} type={"q"} />
                  </div>
                </div>
              </div>

              <div className="mt-7">
                <div className="flex flex-col gap-2">
                  <p className="md:text-[20px]">Attendance</p>
                  <div className="flex flex-row items-center gap-2">
                    <AttendanceTable data={data?.attendance?.classes} type="att" />
                  </div>
                </div>
              </div>

              <div className="mt-7">
                {/* <p className="md:text-[20px]">Graph</p> */}
              </div>
              {/* <div className="flex items-center justify-center mt-3 mb-10">
              <div className="flex flex-col gap-2">
                <div className="flex w-[300px] h-[300px]">
                  <Doughnut
                    data={{
                      labels: chartData.map((data) => data.label),
                      datasets: [
                        {
                          label: "Count",
                          data: chartData.map((data) => data.value),
                          backgroundColor: ["#11AF03", "#C53F3F", "#EAECF0"],
                          borderColor: ["#11AF03", "#C53F3F", "#EAECF0"],
                        },
                      ],
                    }}
                  />
                </div>
              </div>
            </div> */}
            </div>
          </div>
        </div>
      </div>
  );
};

export default SubjectReport;
