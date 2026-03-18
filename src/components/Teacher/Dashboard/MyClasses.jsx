import React from "react";
import IMAGES from "../../../assets/images";
import { useTeacher } from "../../../context/TeacherContext";

const MyClasses = () => {
  const { allClassrooms } = useTeacher();

  const SubjectComponent = ({ data }) => {
    return (
      <div className="p-4 rounded-md custom-shadow bg-white border border-gray-100 md:border-none">
        {/* Desktop View: Horizontal Row | Mobile View: Stacked Layout */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Section 1: Icon and Subject Name */}
          <div className="flex items-center gap-4 md:w-[30%]">
            <img
              className="w-12 h-12 md:w-10 md:h-10 rounded-md shrink-0"
              src={
                data.subject === "Maths"
                  ? IMAGES.MathIcon
                  : data.subject === "Chemistry"
                    ? IMAGES.ChemistryIcon
                    : IMAGES.MathIcon
              }
              alt="icon"
            />
            <div>
              <p className="font-bold md:font-medium text-gray-800">{data.subject}</p>
              <p className="text-xs text-black/50 md:block hidden">
                {data.classes.length} lectures
              </p>
            </div>
          </div>

          {/* Section 2: Stats (Mobile par Grid ban jayega, Desktop par Row) */}
          <div className="grid grid-cols-3 md:flex md:flex-1 items-center gap-2 border-t md:border-none pt-3 md:pt-0">
            <div className="flex flex-col md:flex-1 md:items-center">
              <span className="text-[10px] uppercase text-gray-400 md:hidden font-bold">Class</span>
              <p className="text-sm font-medium md:font-normal">{data.name}</p>
            </div>
            <div className="flex flex-col md:flex-1 md:items-center text-center">
              <span className="text-[10px] uppercase text-gray-400 md:hidden font-bold">Lectures</span>
              <p className="text-sm font-medium md:font-normal">{data.classes.length}</p>
            </div>
            <div className="flex flex-col md:flex-1 md:items-center text-right md:text-center">
              <span className="text-[10px] uppercase text-gray-400 md:hidden font-bold">Students</span>
              <p className="text-sm font-medium md:font-normal">{data.students.length}</p>
            </div>
          </div>

        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-1 p-3 md:p-6">
      <div className="flex flex-col flex-1 gap-4">
        <div className="flex">
          <p className="text-xl font-bold md:font-medium">My Classes</p>
        </div>

        <div className="flex flex-col gap-3">
          {/* Header: Sirf Desktop (md) par dikhega */}
          <div className="hidden md:flex items-center px-6 py-3 text-gray-500 text-sm font-semibold bg-gray-50 rounded-lg">
            <div className="w-[30%] pl-14">
              <p>Subject</p>
            </div>
            <div className="flex flex-1">
              <div className="flex-1 text-center"><p>Class</p></div>
              <div className="flex-1 text-center"><p>Lectures Taken</p></div>
              <div className="flex-1 text-center"><p>Students</p></div>
            </div>
          </div>

          {/* List of Classes */}
          <div className="flex flex-col gap-4 md:gap-2">
            {allClassrooms.map((item, index) => (
              <SubjectComponent key={index} data={item} />
            ))}

            {allClassrooms?.length === 0 && (
              <div className="text-center py-10 text-gray-400 text-lg bg-white rounded-lg">
                No classes to display!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyClasses;