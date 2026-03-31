import React from "react";
import IMAGES from "../../../assets/images";
import { useTeacher } from "../../../context/TeacherContext";

const MyClasses = () => {
  const { allClassrooms } = useTeacher();

  const SubjectComponent = ({ data }) => {
    return (
      <div className="p-4 rounded-md custom-shadow bg-white border border-gray-100">
        {/* Same horizontal row layout on both mobile and desktop */}
        <div className="flex flex-row items-center justify-between gap-4">

          {/* Section 1: Icon and Subject Name */}
          <div className="flex items-center gap-3 w-[30%]">
            <img
              className="w-10 h-10 rounded-md shrink-0"
              src={
                data.subject === "Maths"
                  ? IMAGES.MathIcon
                  : data.subject === "Chemistry"
                    ? IMAGES.ChemistryIcon
                    : IMAGES.MathIcon
              }
              alt="icon"
            />
            <div className="min-w-0">
              <p className="font-medium text-gray-800 text-sm truncate">{data.subject}</p>
              <p className="text-xs text-black/50">
                {data.classes.length} lectures
              </p>
            </div>
          </div>

          {/* Section 2: Stats — always horizontal */}
          <div className="flex flex-1 items-center">
            <div className="flex-1 text-center">
              <p className="text-sm font-normal">{data.name}</p>
            </div>
            <div className="flex-1 text-center">
              <p className="text-sm font-normal">{data.classes.length}</p>
            </div>
            <div className="flex-1 text-center">
              <p className="text-sm font-normal">{data.students.length}</p>
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
          {/* Header — visible on all screen sizes */}
          <div className="flex items-center px-4 py-3 text-gray-500 text-xs md:text-sm font-semibold bg-gray-50 rounded-lg">
            <div className="w-[30%] pl-12">
              <p>Subject</p>
            </div>
            <div className="flex flex-1">
              <div className="flex-1 text-center"><p>Class</p></div>
              <div className="flex-1 text-center"><p>Lectures Taken</p></div>
              <div className="flex-1 text-center"><p>Students</p></div>
            </div>
          </div>

          {/* List of Classes */}
          <div className="flex flex-col gap-2">
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
