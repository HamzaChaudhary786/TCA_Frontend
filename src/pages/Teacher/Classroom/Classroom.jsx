import React, { useEffect, useState } from "react";
import Loader from "../../../utils/Loader";
import Navbar from "../../../components/Teacher/Navbar";
import DataRow from "../../../components/Teacher/Classroom/DataRow";
import ClassMenu from "../../../components/Teacher/Classroom/ClassMenu";
import ClassModal from "../../../components/Teacher/Classroom/ClassModal";

import { BiSearch } from "react-icons/bi";
import { useBlur } from "../../../context/BlurContext";
import { useMutation, useQuery } from "@tanstack/react-query";
import { deleteClassroom } from "../../../api/Admin/classroomApi";
import { getAllClassrooms } from "../../../api/Teacher/ClassroomApi";
import { toast } from "react-toastify";

const Classroom = () => {
  const [isClassMenuOpen, setIsClassMenuOpen] = useState(false);
  const [editClassData, setEditClassData] = useState({});

  const [editModal, setEditModal] = useState(false);
  const [searchText, setSearchText] = useState("");


  const toggleClassMenuOpen = (data) => {
    console.log("data is in menu ", data)
    setEditClassData(data);
    setIsClassMenuOpen(!isClassMenuOpen);
  };

  const handleEditClass = () => {
    // TODO: Pending this function
    console.log("data on edit clas is : ", editClassData);
  }

  const handleDeleteClass = async () => {
    classroomDellMutate.mutate(editClassData.data.id);
  }


  const { isBlurred, toggleBlur } = useBlur();

  const [createClassModal, setCreateClassModal] = useState(false);

  const onAddClass = () => {
    setCreateClassModal(!createClassModal);
    toggleBlur();
  }


  const classroomDellMutate = useMutation({
    mutationFn: async (id) => await deleteClassroom(id),
    onSettled: async () => {
      await refetch();
      setIsClassMenuOpen(false)
      return toast.success("Classroom deleted successfully");
    }
  });


  const { data, isPending, refetch, isRefetching } = useQuery({ queryKey: ["classroom"], queryFn: getAllClassrooms });


  console.log(data, "data of classroom");


  return (
    isPending || isRefetching ? <div className="flex justify-start flex-1"> <Loader /> </div> :
      <>
        <div className="flex flex-1 bg-[#F9F9F9] font-poppins min-w-0">
          <div className="flex flex-1 min-w-0">
            <div
              className={`w-full h-screen  flex-grow lg:ml-72 min-w-0`}
            >
              <div className="h-screen pt-1">
                <Navbar heading={"Classroom"} />
                <div className={`px-3 lg:px-20 sm:px-10 ${isBlurred ? "blur" : ""}`}>
                  <div className="py-4">
                    <div className="flex items-center justify-end">


                      <div className="flex flex-col w-full md:flex-row md:w-auto  gap-2">

                        <div className="flex items-center gap-2 px-4 py-2 bg-white border border-black/10 rounded-3xl">
                          <BiSearch />
                          <input
                            type="text"
                            value={searchText}
                            placeholder="Search"
                            className="outline-none "
                            onChange={(e) => setSearchText(e.target.value)}
                          />
                        </div>
                        <p onClick={onAddClass} className="flex items-center justify-center px-4 py-2 text-sm text-white cursor-pointer bg-[#6A00FF] rounded-3xl">
                          Add Classroom
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-8 h-[80%] overflow-auto classroom ">
                    <DataRow
                      isQuiz={true}
                      index={"Sr. No"}
                      classname={"Classroom Name"}
                      classesSchedualled={"Classes Scheduled"}
                      students={"Students"}
                      teachers={"Teachers"}
                      levelName={"Level Name"}
                      createdBy={"Created By"}
                      bgColor={"#F9F9F9"}
                      header={true}
                      threeDots={true}

                    />
                    {

                      searchText == "" && data?.map((cls, index) => (
                        <DataRow
                          data={cls}
                          toggleClassMenu={toggleClassMenuOpen}
                          index={index + 1}
                          classname={cls.name}
                          classesSchedualled={cls.classes.length}
                          students={cls.students.length}
                          teachers={cls.teachers.length}
                          levelName={cls.levelName || "Admin not add level yet"}
                          createdBy={cls.creator?.userType || cls.createdBy?.userType}
                          bgColor={"#FFFFFF"}
                          header={false}
                          threeDots={true}
                        />
                      ))}
                    {searchText && data?.map((cls, index) => {
                      if (cls?.name?.toLocaleLowerCase().includes(searchText.toLocaleLowerCase())) {
                        return <DataRow
                          data={cls}
                          toggleClassMenu={toggleClassMenuOpen}
                          index={index + 1}
                          classname={cls.name}
                          classesSchedualled={cls.classes.length}
                          students={cls.students.length}
                          teachers={cls.teachers.length}
                          createdBy={cls.creator?.userType || cls.createdBy?.userType}
                          bgColor={"#FFFFFF"}
                          header={false}
                        />
                      }
                    })}

                    {data?.length == 0 && (
                      <div className="text-center py-4 text-3xl font-medium">
                        No classrooms to display!
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ClassModal
          refetch={refetch}
          open={createClassModal}
          isEditTrue={false}
          setopen={setCreateClassModal}
        />

        {editModal &&
          <ClassModal
            editData={editClassData}
            refetch={refetch}
            isEditTrue={true}
            open={editModal}
            setopen={setEditModal}
          />
        }

        <ClassMenu
          editClassRoom={handleEditClass}
          deleteClassRoom={handleDeleteClass}
          isopen={isClassMenuOpen}
          setIsOpen={setIsClassMenuOpen}
        />
      </>
  );
};

export default Classroom;
