import React, { useEffect, useState } from "react";
import Loader from "../../../utils/Loader";
import Navbar from "../../../components/Teacher/Navbar";
import DataRow from "../../../components/Teacher/Attendence/Submission/DataRow";
import { BiSearch } from "react-icons/bi";
import { useLocation, useNavigate } from "react-router-dom";
import { useBlur } from "../../../context/BlurContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  markHeadAttendence,
  useGetAttandenceOfClassroom,
  useUpdateAttandenceOfClassroom
} from "../../../api/Teacher/Attendence";
import { toast } from "react-toastify";
import { useUser } from "../../../context/UserContext";

const ClassroomAttendence = () => {
  const location = useLocation();
  const { userData } = useUser();
  const navigate = useNavigate();
  const { isBlurred } = useBlur();

  const allData = location?.state;

  // ✅ Find the logged-in teacher's subject
  const matchedTeacher = allData?.teachers?.find((t) => t.teacher === userData._id);
  const subjectId = matchedTeacher?.subject;
  console.log(matchedTeacher, "matched teacher");
  console.log(subjectId, "subject id");

  const [searchText, setSearchText] = useState("");
  const [attendenceData, setAttendenceData] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split("T")[0]);
  const [showPopup, setShowPopup] = useState(false);

  const { getAttandence } = useGetAttandenceOfClassroom(location?.state?._id, currentDate);
  const { updateAttandence } = useUpdateAttandenceOfClassroom();

  // ✅ Fetch and filter students based on subject
  useEffect(() => {
    if (!location.state || !subjectId) return;

    const students = allData?.studentDetails || [];
    const matchedStudents = students.filter((student) =>
      student.subjects?.includes(subjectId)
    );

    if (getAttandence) {
      const fetchedAttendanceData = getAttandence?.students?.map((attendance) => ({
        studentID: attendance.studentID,
        isPresent: attendance.isPresent,
        late: attendance.late || false
      }));
      setAttendenceData(fetchedAttendanceData);
      setFilteredStudents(matchedStudents);
    } else {
      const initialAttendanceData = matchedStudents.map((student) => ({
        studentID: student._id,
        isPresent: true,
        late: false
      }));
      setAttendenceData(initialAttendanceData);
      setFilteredStudents(matchedStudents);
    }
  }, [getAttandence, location.state, subjectId]);

  // ✅ Filter by search text
  useEffect(() => {
    const students = allData?.studentDetails || [];
    const matchedStudents = students.filter((student) =>
      student.subjects?.includes(subjectId)
    );
    const filtered = searchText
      ? matchedStudents.filter((student) =>
        student.name.toLowerCase().includes(searchText.toLowerCase())
      )
      : matchedStudents;
    setFilteredStudents(filtered || []);
  }, [searchText, allData?.studentDetails, subjectId]);

  const queryClient = useQueryClient();
  const attendenceMutation = useMutation({
    mutationKey: ["mark-attendence"],
    mutationFn: async () => {
      const result = await markHeadAttendence(
        attendenceData,
        location?.state?._id,
        currentDate
      );
      console.log(result, "result");
      return result;
    },
    onSettled: (data, error) => {
      setFilteredStudents(data);
      if (error) {
        toast.error(error?.response?.data?.message);
        navigate("/teacher/classroom/head-attendence");
      } else {
        toast.success("Attendance submitted successfully!");
        // Invalidate all relevant queries for all roles to ensure reports "progress"
        queryClient.invalidateQueries(["reports"]);
        queryClient.invalidateQueries(["report"]);
        queryClient.invalidateQueries(["studentReports"]);
        queryClient.invalidateQueries(["student-assignments-quizes"]);
        queryClient.invalidateQueries(["teacherStudets"]);
        queryClient.invalidateQueries(["fetchAttandenceGet"]);
        navigate("/teacher/classroom/head-attendence");
      }
    }
  });

  const updateFunction = () => setShowPopup(true);
  const handleCancelUpdate = () => setShowPopup(false);

  const handleConfirmUpdate = () => {
    setShowPopup(false);
    try {

      updateAttandence({
        data: attendenceData,
        classroomID: location?.state?._id,
        date: currentDate
      });
      console.log("Attendance updated!");
    } catch (error) {
      console.error("Error updating attendance:", error);
    }
  };

  return (
    <div className="flex flex-1 bg-[#F9F9F9] font-poppins">
      <div className="flex flex-1">
        <div className={`w-full h-screen flex-grow lg:ml-72`}>
          <div className="h-screen pt-1">
            <Navbar heading={"Mark Attendance"} />
            <div className={`px-3 lg:px-20 sm:px-10 ${isBlurred ? "blur" : ""}`}>
              <div className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-2 w-full md:flex-row md:justify-between items-center ">
                    <div className="flex items-center gap-2 px-4 py-2 bg-white border border-black/10 rounded-3xl">
                      <BiSearch />
                      <input
                        type="text"
                        value={searchText}
                        placeholder="Search"
                        className="outline-none"
                        onChange={(e) => setSearchText(e.target.value)}
                      />
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-white border border-black/10 rounded-3xl">
                      <input
                        type="date"
                        value={currentDate}
                        onChange={(e) => setCurrentDate(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 h-[80%] overflow-auto">
                <DataRow
                  isQuiz={true}
                  header={true}
                  index={"Sr. No"}
                  classname={"Name"}
                  bgColor={"#F9F9F9"}
                  students={"Students"}
                  teachers={"Teachers"}
                />
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student, index) => (
                    <DataRow
                      key={index}
                      data={student}
                      header={false}
                      classname={student.name}
                      profile={student.profilePic}
                      index={index + 1}
                      bgColor={"#FFFFFF"}
                      attendeceData={attendenceData}
                      setAttendenceData={setAttendenceData}
                    />
                  ))
                ) : (
                  <p>No students found</p>
                )}
              </div>

              {attendenceMutation.isPending && <Loader />}

              {!attendenceMutation.isPending && (
                <div className="flex justify-end my-4 border-t border-black">
                  <div className="flex justify-end py-4">
                    {!getAttandence ? (
                      <button
                        onClick={attendenceMutation.mutate}
                        className="flex cursor-pointer px-8 py-3 text-sm text-white rounded-3xl bg-[#0B1053]"
                      >
                        Submit
                      </button>
                    ) : (
                      <button
                        onClick={updateFunction}
                        className="flex cursor-pointer px-8 py-3 text-sm text-white rounded-3xl bg-[#0B1053]"
                      >
                        Update
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {showPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <p className="mb-4 text-lg">Are you sure you want to update attendance?</p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={handleCancelUpdate}
                  className="px-4 py-2 text-sm text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  No
                </button>
                <button
                  onClick={handleConfirmUpdate}
                  className="px-4 py-2 text-sm text-white bg-[#0B1053] rounded-md hover:bg-maroon-dark"
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassroomAttendence;
