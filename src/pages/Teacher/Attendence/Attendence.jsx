import React, { useEffect, useState } from "react";
import Loader from "../../../utils/Loader";
import Navbar from "../../../components/Teacher/Navbar";
import DataRow from "../../../components/Teacher/Attendence/DataRow";
import ClassMenu from "../../../components/Teacher/Attendence/ClassMenu";
import ClassModal from "../../../components/Teacher/Classroom/ClassModal";

import { BiSearch } from "react-icons/bi";
import { useBlur } from "../../../context/BlurContext";
import { useMutation, useQuery } from "@tanstack/react-query";
import { deleteClassroom } from "../../../api/Admin/classroomApi";
import { getTodayClasses, cancelAttendence } from "../../../api/Teacher/Attendence";
import { getAllClassrooms } from "../../../api/Teacher/ClassroomApi";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../context/UserContext";
import { toast } from "react-toastify";

const Attendence = () => {
  const [isClassMenuOpen, setIsClassMenuOpen] = useState(false);
  const [editClassData, setEditClassData] = useState({});
  const navigate = useNavigate()
  const [editModal, setEditModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const { userData } = useUser();
  const [head, setHead] = useState(false)

  const { data, isPending, refetch, isLoading: isLoadingClass } = useQuery({ queryKey: ["today-classes"], queryFn: getTodayClasses });
  const { data: classrooms, isLoading: isLoadingClassroom } = useQuery({ queryKey: ["classroom"], queryFn: getAllClassrooms });

  const toggleClassMenuOpen = (data) => {
    console.log("Class Menu data:", data);
    setEditClassData(data);
    setIsClassMenuOpen(!isClassMenuOpen);
  };

  const handleEditClass = () => {
    console.log("Redirecting to Mark/Edit Attendance Page for:", editClassData);
    if (editClassData?.allData) {
      navigate("/teacher/attendence/submission", { state: editClassData?.allData });
    }
  }

  const handleDeleteClass = async () => {
    console.log("Cancelling attendance for:", editClassData?.allData?._id);
    cancelAttendenceMutation.mutate(editClassData?.allData?._id);
  }

  const { isBlurred, toggleBlur } = useBlur();


  const cancelAttendenceMutation = useMutation({
    mutationFn: async (id) => await cancelAttendence(id),
    onSuccess: async () => {
      await refetch();
      setIsClassMenuOpen(false);
      return toast.success("Attendance cancelled successfully");
    },
    onError: (error) => {
      console.error("Error cancelling attendance:", error);
      toast.error(error.response?.data?.message || "Failed to cancel attendance");
    }
  });

  useEffect(() => {
    if (!isLoadingClassroom && classrooms) {
      // Check if any teacher has type "head"
      const hasHeadTeacher = classrooms.some((classroom) =>
        classroom.teachers.some((teacher) => teacher.type === "head")
      );
      setHead(hasHeadTeacher);
    }
  }, [classrooms, isLoadingClassroom]);

  return (
    isLoadingClass || isLoadingClassroom ? <div className="flex justify-center items-center flex-1 mt-20 "> <Loader /> </div> :
      <>
        <div className="flex flex-1 bg-[#F9F9F9] font-poppins min-w-0">
          <div className="flex flex-1 min-w-0">
            <div
              className={`w-full h-screen flex-grow lg:ml-72 min-w-0`}
            >
              <div className="h-screen">
                <Navbar heading={"Attendence"} />
                <div className={`px-3 lg:px-10 sm:px-10 ${isBlurred ? "blur" : ""}`}>
                  <div className="py-4">
                    <div className={`flex flex-col md:flex-row  gap-4 w-full justify-between`}>

                      <div className="flex gap-2">
                        <div className="flex items-center gap-2 px-4 py-2 bg-white border border-black/10 rounded-3xl">
                          <BiSearch />
                          <input
                            type="text"
                            value={searchText}
                            placeholder="Search"
                            className="outline-none b"
                            onChange={(e) => setSearchText(e.target.value)}
                          />
                        </div>
                      </div>
                      <div>
                        {
                          head ? (<>
                            <div
                              className={`cursor-pointer bg-[#6A00FF] rounded-3xl`}
                              onClick={() => {
                                console.log("Navigating to Classroom Attendance (Head)");
                                navigate("/teacher/classroom/head-attendence", { state: data });
                              }}
                            >
                              <p className="px-4 py-2 text-white text-center">Classroom Attendance +</p>
                            </div></>) : (<><div></div></>)
                        }
                      </div>

                    </div>

                  </div>
                  <div className="mt-8 h-[80%] overflow-auto   hellowclass">
                    <DataRow
                      isQuiz={true}
                      index={"Sr. No"}
                      classname={"Class Name"}
                      subject={"Subject"}
                      students={"Students"}
                      teachers={"Classroom"}
                      startDate={null}
                      bgColor={"#F9F9F9"}
                      header={true}
                      threeDots={true}
                    />
                    {searchText == "" && data?.map((cls, index) => (
                      <DataRow
                        key={cls._id || index}
                        data={cls}
                        allData={cls}
                        toggleClassMenu={toggleClassMenuOpen}
                        index={index + 1}
                        classname={cls.title}
                        subject={cls.subjectID.name}
                        students={cls.classroom.studentdetails.length}
                        teachers={cls?.classroom?.name}
                        startDate={cls.startTime}
                        bgColor={"#FFFFFF"}
                        header={false}
                        threeDots={true}
                      />
                    ))}
                    {searchText && data?.map((cls, index) => {
                      if (cls.title.toLocaleLowerCase().includes(searchText.toLocaleLowerCase())) {
                        return <div key={cls._id || index}>
                          <DataRow
                            data={cls}
                            subject={cls.subjectID.name}
                            allData={cls}
                            toggleClassMenu={toggleClassMenuOpen}
                            index={index + 1}
                            classname={cls.title}
                            students={cls.classroom.studentdetails.length}
                            teachers={cls.teacher.teacherID.name}
                            startDate={cls.startTime}
                            bgColor={"#FFFFFF"}
                            header={false}
                            threeDots={true}
                          />
                        </div>
                      }
                      return null;
                    })}

                    {data?.length == 0 && (
                      <div className="text-center py-4 text-3xl font-medium">
                        No attendance to display!
                      </div>
                    )}

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <ClassMenu
          editClassRoom={handleEditClass}
          deleteClassRoom={handleDeleteClass}
          isopen={isClassMenuOpen}
          setIsOpen={setIsClassMenuOpen}
          markAttendanceData={editClassData}
        />
      </>
  )
}

export default Attendence;
