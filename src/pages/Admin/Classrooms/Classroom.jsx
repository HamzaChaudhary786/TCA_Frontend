import React, { useState } from "react";
import Loader from "../../../utils/Loader";
import Navbar from "../../../components/Admin/Navbar";
import DataRow from "../../../components/Admin/Classrooms/DataRow";
import ClassMenu from "../../../components/Admin/Classrooms/ClassMenu";
import ClassModal from "../../../components/Admin/Classrooms/ClassModal";
import EditClassModel from "../../../components/Admin/Classrooms/EditClassModel"
import PromoteModal from "../../../components/Admin/Classrooms/PromoteModal"
import { BiSearch } from "react-icons/bi";
import { useBlur } from "../../../context/BlurContext";
import { useMutation, useQuery } from "@tanstack/react-query";
import { deleteClassroom, getAllClassroom } from "../../../api/Admin/classroomApi";

const Classroom = () => {

  const { isBlurred, toggleBlur } = useBlur();
  const [searchText, setSearchText] = useState("");
  const [editModal, setEditModal] = useState(false);
  const [editClassData, setEditClassData] = useState({});
  const [isClassMenuOpen, setIsClassMenuOpen] = useState(false);
  const [createClassModal, setCreateClassModal] = useState(false);
  const [promotePopupMenu, setPromotePopupMenu] = useState(false)
  const [classroomData, setClassroomData] = useState({})

  const toggleClassMenuOpen = (data) => {
    setEditClassData(data);
    setClassroomData(data)
    console.log("single data of classroom", data);
    setIsClassMenuOpen(!isClassMenuOpen);
  };



  const handleEditClass = () => {
    // TODO: Pending this function
    setEditModal(true)
  }

  const handleDeleteClass = async () => {
    classroomDellMutate.mutate(editClassData._id);
  }


  const onAddClass = () => {
    setCreateClassModal(!createClassModal);
    toggleBlur();
  }

  const classroomDellMutate = useMutation({
    mutationFn: async (id) => await deleteClassroom(id),
    onSettled: async () => {
      await refetch();
      return toast.success("Classroom deleted successfully");
    }
  });

  const handlePromoteStudents = () => {
    setPromotePopupMenu(!promotePopupMenu)
  }

  const { data, isPending, refetch, isRefetching } = useQuery({ queryKey: ["classroom"], queryFn: getAllClassroom });

  return (
    isPending || isRefetching ? (
      <div className="flex flex-1 justify-center items-center min-h-screen">
        <Loader />
      </div>
    ) : (
      <>
        <div className="flex flex-col flex-1 bg-[#F9F9F9] font-poppins w-full">
          <div className="flex flex-1">
           <div className="w-full lg:px-10 px-4 flex-grow lg:ml-72 transition-all duration-300 min-w-0 overflow-x-hidden">
              <div className="min-h-screen pb-6">
                <Navbar heading={"Classroom"} />

                <div className={`${isBlurred ? "blur" : ""}`}>
                  {/* Search & Add Classroom Section */}
                  <div className="py-4">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                      {/* Left Section */}
                      <div>
                        <p className="text-black/60 text-sm">Manage your classrooms efficiently</p>
                      </div>

                      {/* Right Section */}
                      <div className="flex flex-wrap md:flex-row gap-3 w-full md:w-auto">
                        {/* Search Input */}
                        <div className="flex items-center gap-2 px-4 py-2 bg-white border border-black/10 rounded-full w-full md:w-72 shadow-sm hover:shadow-md transition-shadow focus-within:ring-2 focus-within:ring-purple-400">
                          <BiSearch className="text-gray-400" />
                          <input
                            className="outline-none w-full text-gray-700 placeholder-gray-400 bg-transparent"
                            type="text"
                            placeholder="Search"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                          />
                        </div>

                        {/* Add Classroom Button */}
                        <button
                          onClick={onAddClass}
                          className="px-6 py-2 text-sm font-medium text-white bg-[#6A00FF] rounded-full shadow-md hover:shadow-lg transition-all"
                        >
                          Add Classroom
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Data Table Container */}
                  <div className="mt-4 w-full bg-white rounded-xl shadow-sm border border-black/10 overflow-hidden">
                    <div className="overflow-x-auto w-full">
                      <div className="min-w-[550px] lg:min-w-full">
                      <DataRow
                        header={true}
                        isQuiz={true}
                        index={"Sr. No"}
                        bgColor={"#F9F9F9"}
                        students={"Students"}
                        teachers={"Teachers"}
                        createdBy={"Created By"}
                        classname={"Classroom"}
                        classesSchedualled={"Classes Scheduled"}
                      />

                      {searchText === "" &&
                        data.map((cls, index) => (
                          <DataRow
                            data={cls}
                            key={cls._id}
                            header={false}
                            index={index + 1}
                            bgColor={"#FFFFFF"}
                            classname={cls.name}
                            students={cls.students.length}
                            teachers={cls.teachers.length}
                            createdBy={cls.createdBy.userType}
                            toggleClassMenu={toggleClassMenuOpen}
                            classesSchedualled={cls?.classes?.length}
                          />
                        ))}

                      {searchText &&
                        data.map((cls, index) => {
                          if (
                            cls.name.toLowerCase().includes(searchText.toLowerCase()) ||
                            cls.createdBy.userType.toLowerCase().includes(searchText.toLowerCase())
                          ) {
                            return (
                              <DataRow
                                data={cls}
                                key={cls._id}
                                header={false}
                                index={index + 1}
                                bgColor={"#FFFFFF"}
                                classname={cls.name}
                                students={cls.students.length}
                                teachers={cls.teachers.length}
                                createdBy={cls.createdBy.userType}
                                toggleClassMenu={toggleClassMenuOpen}
                                classesSchedualled={cls.classes.length}
                              />
                            );
                          }
                        })}

                      {data.length === 0 && (
                        <div className="text-center py-8 text-xl font-medium text-gray-400">
                          No classrooms to display!
                        </div>
                      )}
                    </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Create Classroom Modal */}
        {createClassModal && (
          <ClassModal
            refetch={refetch}
            isEditTrue={false}
            open={createClassModal}
            setopen={setCreateClassModal}
          />
        )}

        {/* Edit Classroom Modal */}
        {editModal && (
          <EditClassModel
            open={editModal}
            refetch={refetch}
            isEditTrue={true}
            setopen={setEditModal}
            editData={editClassData}
          />
        )}

        {/* Classroom Menu */}
        <ClassMenu
          isopen={isClassMenuOpen}
          setIsOpen={setIsClassMenuOpen}
          editClassRoom={handleEditClass}
          deleteClassRoom={handleDeleteClass}
          promoteStudentsPopup={handlePromoteStudents}
        />

        {/* Promote Students Modal */}
        {promotePopupMenu && (
          <PromoteModal
            classrooms={data}
            setPromotePopupMenu={handlePromoteStudents}
            classroomStudents={classroomData}
          />
        )}
      </>
    )
  );
};

export default Classroom;



