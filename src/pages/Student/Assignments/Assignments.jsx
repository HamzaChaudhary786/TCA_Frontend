import React from "react";
import Navbar from "../../../components/Student/Dashboard/Navbar";
import QuizAssignmentRow from "../../../components/Student/QuizAssignment/QuizAssignmentRow";

import { useBlur } from "../../../context/BlurContext";
import { useStudent } from "../../../context/StudentContext";
import { useSidebar } from "../../../context/SidebarContext";
import { useUser } from "../../../context/UserContext";

const Assignments = () => {
  const { isSidebarOpen } = useSidebar(); // new

  const { isBlurred } = useBlur();
  const { allAssignments } = useStudent();

  const { userData } = useUser();


  const studentAssignments = allAssignments.filter(assignment =>
    !userData.subjects || userData.subjects.length === 0 || userData.subjects.includes(assignment.subjectID._id)
  );
  //console.log("Filtered Assignments:", studentAssignments);
  return (
    <div className="flex flex-1 bg-[#F9F9F9] font-poppins">
      <div className="flex flex-1">
        <div
          className={`w-full h-screen lg:px-20 sm:px-10  flex-grow lg:ml-72`}
        >
          <div className="h-screen pt-1">
            <Navbar heading={"Assignments"} />
            <div className={`px-3 ${isBlurred ? "blur" : ""} relative ${isSidebarOpen ? "-z-10" : "z-auto"} lg:z-auto `}>
              <div className="mt-8 h-[80%] overflow-auto">

                <QuizAssignmentRow
                  isQuiz={false}
                  index={"Sr. No"}
                  subject={"Subject"}
                  title={"Title"}
                  deadline={"Deadline"}
                  bgColor={"#F9F9F9"}
                  header={true}
                  total_marks={"Total Marks"}
                  download={"Download"}
                  upload={"Upload"}
                />
                {studentAssignments?.map((assignment, index) => (
                  <QuizAssignmentRow
                    alldata={assignment}
                    isQuiz={false}
                    index={index + 1}
                    id={assignment._id}
                    key={assignment._id}
                    subject={assignment?.subjectID.name}
                    title={assignment?.title}
                    deadline={assignment?.dueDate}
                    bgColor={"#FFFFFF"}
                    header={false}
                    total_marks={assignment?.totalMarks}
                    download={assignment?.files[0]?.url}
                    upload={true}
                    text={assignment?.text}
                  />
                ))}

                {studentAssignments?.length == 0 &&
                  <div className='flex w-full justify-center'>
                    <p className='font-medium text-2xl py-4'>No assignments to display</p>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assignments;
