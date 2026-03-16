import React, { useEffect, useState } from "react";
import Loader from "../../../utils/Loader";
import IMAGES from "../../../assets/images";
import LargeLoader from "../../../utils/LargeLoader";
import Navbar from "../../../components/Admin/Navbar";
import Card from "../../../components/Admin/StudentReports/Card";
import ActivityCard from "../../../components/Admin/StudentReports/ActivityCard";
import SystemOverview from "../../../components/Admin/StudentReports/SystemOverview"
import QuizAssignmentsTable from "../../../components/Admin/StudentReports/QuizAssignmentsTable";
import { X } from "lucide-react";
import { LuPhone } from "react-icons/lu";
import { useLocation } from "react-router-dom";
import { IoMailOutline } from "react-icons/io5";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getStudentSubjectsForAdmin, getStudentSubjectsWithLevel, updateStudentSubjects } from "../../../api/Admin/UsersApi";
import { getStudentReport, getStudentSubjectReport } from "../../../api/Admin/AdminApi";
import { toast } from "react-toastify";
import { useGetAllSubjectOfStudent } from "../../../api/Admin/SubjectsApi";
import { useUser } from "../../../context/UserContext";

const SubjectReport = () => {

  const location = useLocation();
  const queryClient = useQueryClient();

  const [studentData, setStudentData] = useState({});
  const [allSubjects, setAllSubjects] = useState([]);
  const [editSubject, setEditSubject] = useState(false)
  const [selectedSubject, setSelectedSubject] = useState("");
  const [subjectQueryFlag, setSubjectQueryFlag] = useState(false);
  const [selectedSubjects, setSelectedSubjects] = useState([]);

  useEffect(() => {
    setStudentData(location.state);
  }, [location.state])

  const { data: report, isPending, isError } = useQuery({
    queryKey: ["report"], queryFn: async () => {
      if (studentData) {
        return await getStudentReport(location.state?._id);
      }
    }
  });

  const { data: subjects, isSuccess, isPending: subjectPending } = useQuery({ 
    queryKey: ["subjectofstudents", location.state?._id], 
    queryFn: async () => await getStudentSubjectsForAdmin(location.state?._id),
    enabled: !!location.state?._id
  });

  const studentAssignmentsQuizes = useQuery({ 
    queryKey: ["student-assignments-quizes"], 
    queryFn: async () => await getStudentSubjectReport(location.state?._id, JSON.parse(selectedSubject).subject._id), 
    enabled: subjectQueryFlag 
  });

  useEffect(() => {
    if (isSuccess) setAllSubjects(subjects);
  }, [isSuccess, subjects]);

  useEffect(() => {
    setSubjectQueryFlag(true);
    studentAssignmentsQuizes.refetch();
    if (!studentAssignmentsQuizes.isPending) {
      console.log("subject report data in subject report section in admin penal is: ", studentAssignmentsQuizes.data);
    }
  }, [selectedSubject, studentAssignmentsQuizes.data, studentAssignmentsQuizes.isPending])

  const { data: studentSubjectWithLevel, isSuccess: studentIsSuccess, isPending: studentSubjectPending } = useQuery({
    queryKey: ["studentSubjectwithLevel"], 
    queryFn: async () => await getStudentSubjectsWithLevel(studentData?.levelID)
  });

  console.log(studentSubjectWithLevel, "student subject with level ");

  const handleCheckboxChange = (subjectId) => {
    setSelectedSubjects((prevSelected) =>
      prevSelected.includes(subjectId)
        ? prevSelected.filter((id) => id !== subjectId)
        : [...prevSelected, subjectId]
    );
  };

  const mutation = useMutation({
    mutationFn: updateStudentSubjects,
    onSuccess: (data) => {
      console.log("Subjects assigned successfully!", data);
      toast.success("Subjects assigned successfully!");
      
      // Invalidate specific queries to trigger refetch
      queryClient.invalidateQueries({ queryKey: ["subjectofstudents", studentData?._id] });
      queryClient.invalidateQueries({ queryKey: ["studentSubjects", studentData?._id] });
      
      // Refetch the student subjects manually
      refetchStudentSubjects();
      
      // Don't close modal immediately, let the data update first
      setTimeout(() => {
        setEditSubject(false);
      }, 100);
    },
    onError: (error) => {
      console.error("Error assigning subjects:", error.message);
      toast.error("Error assigning subjects!");
    },
  });

  // Get student subjects with proper query key
  const { studentSubject, refetch: refetchStudentSubjects } = useGetAllSubjectOfStudent(studentData?._id);

  // This effect runs when editSubject opens OR when studentSubject data changes
  useEffect(() => {
    if (editSubject && studentSubject?.subjects) {
      console.log("Setting selected subjects:", studentSubject.subjects);
      // Initialize selectedSubjects with already assigned subjects
      const assignedSubjects = studentSubject.subjects.map((subj) => subj._id);
      setSelectedSubjects(assignedSubjects || []);
    }
  }, [editSubject, studentSubject]); // Added studentSubject as dependency

  // Additional effect to handle when studentSubject changes while modal is open
  useEffect(() => {
    if (editSubject && studentSubject?.subjects) {
      const assignedSubjects = studentSubject.subjects.map((subj) => subj._id);
      setSelectedSubjects(assignedSubjects || []);
    }
  }, [studentSubject]); // This will run whenever studentSubject data changes

  return (
    isPending || subjectPending ? <div className="flex justify-center flex-1"> <LargeLoader /> </div> :
      <>
        <div className="flex flex-1 bg-[#F9F9F9] font-poppins">
          <div className="flex flex-1">
            <div className="flex-grow w-full px-2 lg:px-20 sm:px-10 lg:ml-72">
              <div className="pt-6">
                <Navbar heading={"Subjects Report"} />
                <div className="mt-7">
                  <div className="flex flex-col items-center justify-center gap-1">
                    {/* <img src={studentData.profilePic || IMAGES.Profile} alt="student profile" className="sm:w-40 sm:h-40 w-20 h-20 rounded-full" /> */}
                    <p className="text-lg font-semibold">{studentData.name}</p>
                    <div className="flex items-center gap-2 text-xs">
                      <LuPhone />
                      <p>{studentData.phoneNumber}</p>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <IoMailOutline />
                      <p>{studentData.email}</p>
                    </div>
                  </div>
                </div>

                <div className="w-full justify-end items-center flex">
                  <button className="mt-5 sm:auto sm:py-3 sm:px-4 py-2 px-2 bg-[#0B1053] text-white rounded-full" onClick={() => {
                    // Refetch student subjects before opening modal
                    refetchStudentSubjects();
                    setEditSubject(!editSubject);
                  }}>Subject Edit</button>
                </div>
                <div className="mt-7">
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col md:flex-row justify-between">
                      <p className="md:text-[20px]">Overview</p>
                      <div className="flex items-center gap-4 border bg-white border-[#00000020] px-4 py-2 rounded-3xl">
                        <select className="outline-none w-60" value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} >
                          <option value={""}>Select Subject</option>
                          {isSuccess && subjects?.subjects?.map((sub) => <option key={sub._id} value={JSON.stringify(sub)}>{sub.subject?.name}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="flex flex-col items-center flex-1 gap-2 sm:flex-row">
                      {selectedSubject !== "" && studentAssignmentsQuizes && studentAssignmentsQuizes.isPending ? <Loader />
                        :
                        <>
                          <Card
                            type={"Percentage"}
                            data={"Assignment"}
                            grade={studentAssignmentsQuizes.data?.assignments.avgGrade}
                            percentage={studentAssignmentsQuizes.data?.assignments?.avgMarksPer ? studentAssignmentsQuizes.data?.assignments?.avgMarksPer !== "NaN" ? studentAssignmentsQuizes.data?.assignments?.avgMarksPer : 0 : 0}
                          />
                          <Card
                            data={"Quizes"}
                            type={"Percentage"}
                            grade={studentAssignmentsQuizes.data?.quizes?.avgGrade}
                            percentage={studentAssignmentsQuizes.data?.quizes?.avgMarksPer ? studentAssignmentsQuizes.data?.quizes?.avgMarksPer !== "NaN" ? studentAssignmentsQuizes.data?.quizes?.avgMarksPer : 0 : 0}
                          />
                          <Card
                            data={"Attendence"}
                            type={"Percentage"}
                            percentage={studentAssignmentsQuizes.data?.attendance?.avgAttendencePer ? studentAssignmentsQuizes.data?.attendance?.avgAttendencePer : 0}
                          />
                        </>
                      }
                    </div>
                  </div>
                </div>

                {selectedSubject !== "" && !studentAssignmentsQuizes.isPending && studentAssignmentsQuizes.data && (
                  <>
                    <div className="mt-7">
                      <div className="flex flex-col gap-2">
                        <p className="md:text-[20px]">Assignments </p>
                        <div className="flex flex-row items-center gap-2">
                          <QuizAssignmentsTable data={studentAssignmentsQuizes.data.assignments.data || []} />
                        </div>
                      </div>
                    </div>
                    <div className="mt-7">
                      <div className="flex flex-col gap-2">
                        <p className="md:text-[20px]">Quizzes</p>
                        <div className="flex flex-row items-center gap-2">
                          <QuizAssignmentsTable data={studentAssignmentsQuizes.data.quizes.data || []} />
                        </div>
                      </div>
                    </div>
                  </>
                )}
                <div className="mt-7">
                  <SystemOverview />
                </div>
              </div>
            </div>
          </div>

          <div>
            {editSubject && studentSubjectWithLevel?.subjects?.length > 0 && (
              <div className="absolute top-0 right-0 py-8 bg-white min-w-72 shadow-lg rounded-md z-50 p-4 space-y-3">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-lg font-semibold">Select Subjects</h2>
                  <button
                    onClick={() => setEditSubject(false)}
                    className="text-black hover:text-gray-300"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {studentSubjectWithLevel?.subjects.map((subject) => (
                    <label
                      key={subject._id}
                      className="flex items-center space-x-2 cursor-pointer hover:bg-white/10 px-2 py-1 rounded-md"
                    >
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-[#0B1053] focus:ring-[#0B1053]"
                        checked={selectedSubjects.includes(subject._id)}
                        onChange={() => handleCheckboxChange(subject._id)}
                      />
                      <span className="text-sm">{subject.subjectName}</span>
                    </label>
                  ))}
                </div>

                <button
                  onClick={() => {
                    console.log(selectedSubjects, "selected subject");

                    if (!studentData?._id) {
                      console.error("Student ID is missing");
                      return;
                    }

                    mutation.mutate({
                      studentId: studentData?._id,
                      subjects: selectedSubjects,
                    });
                  }}
                  disabled={mutation.isPending}
                  className="w-full mt-4 bg-[#0B1053] text-white font-semibold py-2 rounded-md hover:bg-gray-100 transition disabled:opacity-50"
                >
                  {mutation.isPending ? "Submitting..." : "Submit"}
                </button>
              </div>
            )}
          </div>
        </div>
      </>
  );
};

export default SubjectReport;