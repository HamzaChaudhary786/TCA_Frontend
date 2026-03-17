import React, { useEffect, useState } from "react";
import IMAGES from "../../../assets/images";
import LargeLoader from "../../../utils/LargeLoader";
import Card from "../../../components/Student/Reports/Card";
import AttendanceTable from "../../../components/Student/Reports/AttendanceTable";
import QuizAssignmentsTable from "../../../components/Student/Reports/QuizAssignmentsTable";

import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto"; // IMPORTANT
import { useQuery } from "@tanstack/react-query";
import { useUser } from "../../../context/UserContext";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getStudentSubjectReport } from "../../../api/Student/StudentApis";

// File ke top mein add karein:
// File ke top mein add karein:

// Component ke andar:

const SubjectReport = () => {

  const { subject } = useParams();
  const navigate = useNavigate();

  const [chartData, setChartDate] = useState(
    [
      {
        label: "Present",
        value: 0,
      },
      {
        label: "Absent",
        value: 0,
      },
      {
        label: "Late",
        value: 0,
      },
    ]
  )



  const { userData } = useUser();
  const location = useLocation();
  //console.log("location state in subject report is : ", location?.state);

  const reportQuery = useQuery({
    queryKey: ["reports"], queryFn: async () => {
      const result = await getStudentSubjectReport(userData._id, location?.state?.subject?._id);
      return result;
    }
  })

  //console.log("query for subject report data is : ", reportQuery.data);


  useEffect(() => {
    if (reportQuery.data?.attendance) {
      const { presentCount, absentCount, lateCount } = reportQuery.data.attendance;
      setChartDate([
        {
          label: "Present",
          value: presentCount,
        },
        {
          label: "Absent",
          value: absentCount,
        },
        {
          label: "Late",
          value: lateCount,
        },
      ]);
    }
  }, [reportQuery.data]);


  return (
    (reportQuery.isPending || !reportQuery.data) ? <LargeLoader /> :
      <>
        <div className="flex flex-1 bg-[#F9F9F9] font-poppins">
          <div className="flex flex-1">
            <div className="flex-grow w-full px-2 lg:px-20 sm:px-10 lg:ml-72">
              <div className=" pt-20 sm:pt-16 ">
                <div className="flex flex-row items-center justify-between flex-grow">
                  <div className="flex flex-col justify-between gap-1 md:flex-row md:gap-6">
                    <p className="font-semibold md:text-[25px]">
                      {subject + " Report"} 
                    </p>
                    <div className="flex flex-row gap-1 text-[10px] items-center">
                      <p>
                        <img
                          src={IMAGES.Book}
                          alt=""
                          className="md:w-[18px] md:h-[18px] w-[13px] h-[13px]"
                        />
                      </p>
                      <p>
                        <img
                          src={IMAGES.ChevronRight}
                          alt=""
                          className="md:w-[18px] md:h-[18px] w-[13px] h-[13px]"
                        />
                      </p>
                      <p
                        style={{ cursor: "pointer" }}
                        onClick={() => navigate("/reports")}
                      >
                        Reports
                      </p>
                      <p>
                        <img
                          src={IMAGES.ChevronRight}
                          alt=""
                          className="md:w-[18px] md:h-[18px] w-[13px] h-[13px]"
                        />
                      </p>
                      <div className="px-3 bg-[#F6E8EA] flex ">
                        <p className="font-semibold">{subject}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row items-center gap-1 sm:gap-2 md:gap-4">
                    <div className="p-1 bg-white rounded-sm border-1 border-grey">
                      <img
                        src={IMAGES.Notification}
                        alt=""
                        className="md:w-[22px] md:h-[22px] w-[13px] h-[13px]"
                      />
                    </div>
                    <div className="p-1 bg-white rounded-sm border-1 border-grey">
                      <img
                        src={IMAGES.SMS}
                        alt=""
                        className="md:w-[22px] md:h-[22px] w-[13px] h-[13px]"
                      />
                    </div>
                    <p className="text-justify md:text-[16px] text-[12px]">
                      M. {userData.name}
                    </p>
                    <div>
                      <img
                        src={userData.profilePic || IMAGES.ProfilePic}
                        alt=""
                        className= "sm:w-[29px] sm:h-[29px]  w-[34px] h-[34px] rounded-full"
                      />
                    </div>
                    <div>
                      <img
                        src={IMAGES.ArrowLeft}
                        alt=""
                        className="w-[1rem] h-[1rem]"
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-7">
                  <div className="flex flex-col gap-2">
                    <p className="md:text-[20px]">Overview</p>
                <div 
  className="flex flex-col items-center flex-1 gap-2 sm:flex-row" 
 
>
                      <Card
                        data={"Assignment"}
                        type={"Percentage"}
                        grade={reportQuery?.data?.assignments?.avgGrade}
                        percentage={reportQuery?.data?.assignments?.avgMarksPer == "NaN" ? 0 : reportQuery?.data?.assignments?.avgMarksPer}
                      />
                      <Card
                        data={"Quiz"}
                        type={"Percentage"}
                        grade={reportQuery?.data?.quizes?.avgGrade}
                        percentage={reportQuery?.data?.quizes?.avgMarksPer == "NaN" ? 0 : reportQuery?.data?.quizes?.avgMarksPer}
                      />
                      <Card
                        data={"Attendence"}
                        type={"Percentage"}
                        // grade={reportQuery?.data?.quizes?.avgGrade}
                        percentage={reportQuery?.data?.attendance?.avgAttendencePer.toFixed(0)}
                      // percentage={reportQuery?.data?.quizes?.avgMarksPer == "NaN" ? 0 : reportQuery?.data?.quizes?.avgMarksPer}
                      />
                      {/* <Card
                    data={data.type}
                    grade={data.grade}
                    type={"Percentage"}
                    percentage={reportQuery?.data?.marksObtained}
                  /> */}
                    </div>
                  </div>
                </div>
                <div className="mt-7">
                  <div className="flex flex-col gap-2">
                    <p className="md:text-[20px]">Assignments </p>
                    <div className="flex flex-row items-center gap-2">
                      <QuizAssignmentsTable data={reportQuery?.data?.assignments} />
                    </div>
                  </div>
                </div>
                <div className="mt-7">
                  <div className="flex flex-col gap-2">
                    <p className="md:text-[20px]">Quizzes</p>
                    <div className="flex flex-row items-center gap-2">
                      <QuizAssignmentsTable data={reportQuery?.data?.quizes} />
                    </div>
                  </div>
                </div>

                <div className="mt-7">
                  <div className="flex flex-col gap-2">
                    <p className="md:text-[20px]">Attendance</p>
                    <div className="flex flex-row items-center gap-2">
                      <AttendanceTable data={reportQuery?.data?.attendance?.classes} />
                    </div>
                  </div>
                </div>

                {/* <div className="mt-7">
                  <p className="md:text-[20px]">Graph</p>
                </div>
                <div className="flex items-center justify-center mt-3 mb-10">
                  <div className="flex flex-col gap-2">
                    <div className="flex w-[300px] h-[300px]">
                      <Doughnut
                        data={{
                          labels: chartData.map((data) => data.label),
                          datasets: [
                            {
                              label: "Count",
                              data: chartData.map((data) => data.value),
                              backgroundColor: ["#11AF03", "#C53F3F"],
                              borderColor: ["#11AF03", "#C53F3F"],
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
      </>
  );
};

export default SubjectReport;
