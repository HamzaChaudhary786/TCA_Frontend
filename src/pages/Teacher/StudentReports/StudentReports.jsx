import React, { useRef, useState } from "react";
import Loader from "../../../utils/Loader";
import IMAGES from "../../../assets/images";
import Navbar from "../../../components/Teacher/Navbar";
import useClickOutside from "../../../hooks/useClickOutlise";
import DataRows from "../../../components/Teacher/StudentReports/DataRows";

import { FiFilter } from "react-icons/fi";
import { IoSearch } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

import { useBlur } from "../../../context/BlurContext";
import { useTeacher } from "../../../context/TeacherContext";
import { getAllStudentsOfTeacher } from "../../../api/Teacher/StudentReport";
import { useUser } from "../../../context/UserContext";
import { getTeacherSubjectsOfClassroom } from "../../../api/Teacher/TeacherSubjectApi";
import { useQuery } from "@tanstack/react-query";

const FilterPopup = ({
  open,
  setopen,
  subject,
  applyFilter,
  setSubject,
  classroom,
  setClassroom,
}) => {
  const ref = useRef(null);

  useClickOutside(ref, () => setopen(false));
  const { allClassrooms, allSubjects } = useTeacher();



  console.log(classroom, "all classroom");


  const {
    data: teacherSubjectOfClassroom,

  } = useQuery({
    queryKey: ["teacherSubjectsOfClassrooms", classroom?.id,],
    queryFn: async () => {

      return await getTeacherSubjectsOfClassroom({ classroomIDs: [classroom.id] });
    },
    enabled: !!classroom?.id,
  });

  console.log(teacherSubjectOfClassroom, "teacherSubjectOfClassroom");



  return (
    <div
      ref={ref}
      className={`absolute z-10 top-40 bg-white p-8 w-[400px] text-black rounded-xl sm:right-48 ${open ? "" : "hidden"
        }`}
    >
      <div className="flex gap-2">
        <div className="flex flex-col w-full gap-4">
          <div className="flex items-center justify-between">
            <div className="flex w-[fit] gap-2 items-center">
              <p className="p-3 text-xl font-semibold cursor-text editingName">
                Filter
              </p>
            </div>
            <div className="flex items-center gap-2">
              <img
                src={IMAGES.CloseIcon}
                className="w-[15px] h-[15px] cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  setopen(false);
                }}
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex flex-col flex-1 gap-1">
              <p className="text-xs font-semibold text-grey_700">Class</p>
              <div className="flex justify-between border-[1.5px] py-2 px-4 rounded-lg w-full items-center border-grey/50">
                <select
                  value={JSON.stringify(classroom)}
                  onChange={(e) => setClassroom(JSON.parse(e.target.value))}
                  className="w-full outline-none cursor-pointer"
                >
                  <option value="">Select Class</option>
                  {allClassrooms?.map((item) => (
                    <option key={item.id} value={JSON.stringify(item)}>{item.name}</option>
                  ))}
                </select>

              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex flex-col flex-1 gap-1">
              <p className="text-xs font-semibold text-grey_700">Subject</p>
              <div className="flex justify-between border-[1.5px] py-2 px-4 rounded-lg w-full items-center border-grey/50">
                <select
                  value={JSON.stringify(subject)}
                  onChange={(e) => setSubject(JSON.parse(e.target.value))}
                  className="w-full outline-none cursor-pointer"
                >
                  <option value="">Select Subject</option>
                  {teacherSubjectOfClassroom?.subjects?.map((item) => (
                    <option key={item.id} value={JSON.stringify(item)}>{item.subjectName}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3"></div>
          <div className="flex items-center gap-3">
            <div
              onClick={() => {
                applyFilter();
                setopen(false);
              }}
              className="flex items-center justify-center w-full py-2 text-center rounded-md cursor-pointer bg-[#6A00FF]"
            >
              <p className="text-sm text-white">Apply</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StudentReports = () => {
  const navigate = useNavigate();
  const { isBlurred } = useBlur();

  const [subject, setSubject] = useState("");
  const [classroom, setClassroom] = useState("");
  const [searchText, setSearchText] = useState("");
  const [openFilterModal, setOpenFilterModal] = useState(false);

  const [filterActive, setFilterActive] = useState(false);
  const [filteredData, setFilteredData] = useState([]);

  const handleFunctionClick = (std) => {
    return () => {
      navigate(`/teacher/reports/${std.name}`, { state: std });
    };
  };

  const { data, isPending, isSuccess, isError, refetch, isRefetching } =
    useQuery({
      queryKey: ["teacherStudets"],
      queryFn: async () => {
        let result = await getAllStudentsOfTeacher();
        // console.log("result is : ", result);
        return result;
      },
    });


  const applyFilter = () => {
    if (!isPending) {

      console.log(classroom, "classroom");
      console.log(subject, "subject");
      console.log(data, "data");



      let temparr = data?.filter((item) => {
        if (
          item?.classroom?.id === classroom?.id &&
          item?.subject?.id === subject?.subjectId

        ) {
          return item;
        }
      });
      console.log(temparr, "temporary");

      setFilterActive(true);
      setFilteredData(temparr);
      console.log("filtered array is : ", temparr);
    }
  };



  return isPending || isRefetching ? (
    <div className="flex justify-start flex-1">
      {" "}
      <Loader />{" "}
    </div>
  ) : (
    <>
      <div className="flex flex-1 bg-[#F9F9F9] font-poppins min-w-0">
        <div className="flex flex-1 min-w-0">
          <div
            className={`w-full h-screen flex-grow lg:ml-72 min-w-0`}
          >
            <div className="h-screen pt-1">
              <Navbar heading={"Student Reports"} />
              <div className={`px-3 lg:px-20 sm:px-10 ${isBlurred ? "blur" : ""}`}>
                <div className="flex sm:flex-row-reverse my-4">
                  <div className="flex items-center gap-1 sm:gap-4">
                    <div className="flex items-center gap-4 border bg-white border-[#00000020] px-2 py-[8px]  sm:px-4 sm:py-3 rounded-3xl">
                      <IoSearch />
                      <input
                        type="text"
                        value={searchText}
                        placeholder="Search"
                        className="bg-transparent outline-none"
                        onChange={(e) => setSearchText(e.target.value)}
                      />
                    </div>
                    <div
                      className="p-2 sm:p-4 text-white rounded-lg cursor-pointer bg-[#0B1053]"
                      onClick={() => {
                        setOpenFilterModal(true);
                      }}
                    >
                      <FiFilter />
                    </div>
                  </div>
                </div>
                <div className="mt-8 h-[80%] overflow-auto">
                  <div className="min-w-[700px] md:min-w-full">
                    <DataRows
                      header={true}
                      index={"Sr. No"}
                      subject={"Subject"}
                      bgColor={"#F9F9F9"}
                      studentName={"Name"}
                      studentClass={"Class"}
                      attendance={"Attendance"}
                    />

                    {!filterActive &&
                      searchText == "" &&
                      data?.map((std, index) => {
                        console.log(std, "fileter");
                        return (
                          <DataRows
                            key={std.id}
                            header={false}
                            index={index + 1}
                            bgColor={"#FFFFFF"}
                            studentName={std.name}
                            subject={std.subject.name}
                            attendance={std?.avgAttendancePer}
                            studentClass={std.classroom.name}
                            onClickFunction={handleFunctionClick(std)}
                            studentProfile={std.profilePic || IMAGES.Profile}
                          />
                        );
                      })}

                    {!filterActive &&
                      searchText &&
                      data?.map((std, index) => {
                        if (
                          std?.classroom?.name?.toLocaleLowerCase().includes(searchText.toLocaleLowerCase()) ||
                          std?.name?.toLocaleLowerCase().includes(searchText.toLocaleLowerCase()) ||
                          std?.subject?.name?.toLocaleLowerCase().includes(searchText.toLocaleLowerCase())
                        ) {
                          return (
                            <DataRows
                              key={std.id}
                              header={false}
                              index={index + 1}
                              bgColor={"#FFFFFF"}
                              studentName={std.name}
                              subject={std.subject.name}
                              attendance={std.avgAttendancePer}
                              studentClass={std.classroom.name}
                              onClickFunction={handleFunctionClick(std)}
                              studentProfile={std.profilePic || IMAGES.Profile}
                            />
                          );
                        }
                        return null;
                      })}

                    {filterActive &&
                      filteredData?.map((std, index) => (
                        <DataRows
                          key={std.id}
                          header={false}
                          index={index + 1}
                          bgColor={"#FFFFFF"}
                          studentName={std.name}
                          subject={std.subject.name}
                          attendance={std.avgAttendancePer}
                          studentClass={std.classroom.name}
                          onClickFunction={handleFunctionClick(std)}
                          studentProfile={std.profilePic || IMAGES.Profile}
                        />
                      ))}

                    {data?.length == 0 && (
                      <div className="text-center py-4 text-3xl font-medium">
                        No student reports to display!
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <FilterPopup
        subject={subject}
        classroom={classroom}
        open={openFilterModal}
        setSubject={setSubject}
        applyFilter={applyFilter}
        setClassroom={setClassroom}
        setopen={setOpenFilterModal}
      />
    </>
  );
};

export default StudentReports;
