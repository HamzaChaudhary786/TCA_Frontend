import React from "react";
import IMAGES from "../../../assets/images";
import { useTeacher } from "../../../context/TeacherContext";

const MyClasses = () => {
  const { allClassrooms } = useTeacher();
  console.log("All Classes room in dashboard are : ", allClassrooms);

  const SubjectComponent = ({ data }) => {
    console.log("data", data);

    return (
      <div className="p-2 rounded-md custom-shadow">
        <div className="flex flex-wrap items-center justify-between px-3">
          <div className="flex flex-1 gap-4">
            <img
              className="w-10 h-10 rounded-md"
              src={
                data.subject == "Maths"
                  ? IMAGES.MathIcon
                  : data.subject == "Chemistry"
                    ? IMAGES.ChemistryIcon
                    : IMAGES.MathIcon
              }
              alt="math icon"
            />
            <div>
              <p>{data.subject} sub name</p>
              <p className="text-xs text-black/50">
                {data.classes.length} lectures
              </p>
            </div>
          </div>
          <div className="flex flex-1">
            <div className="flex justify-center flex-1">
              <p>{data.name}</p>
            </div>
            <div className="flex justify-center flex-1">
              <p>{data.classes.length}</p>
            </div>
            <div className="flex justify-center flex-1">
              <p>{data.students.length}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-1">
      <div className="flex flex-col flex-1 gap-2">
        <div className="flex">
          <p className="flex text-xl font-medium">My Classes</p>
        </div>
        <div className="flex flex-col gap-1 px-3 py-8 bg-white rounded-lg custom-shadow">
          <div className="flex items-center px-2 sm:text-sm text-[8px] text-grey">
            <div className="flex items-center flex-1 ml-20 ">
              <p>Subject</p>
            </div>
            <div className="flex flex-1 gap-1 space-x-3 mt-3 md:gap-3">
              <div className="flex justify-start flex-1">
                <p className="">Class</p>
              </div>
              <div className="flex justify-center flex-2">
                <p>Lectures Taken</p>
              </div>
              <div className="flex justify-center flex-1">
                <p>Students</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col flex-1 gap-2 p-2">
            {allClassrooms.map((item) => {
              return <SubjectComponent data={item} />;
            })}

            {allClassrooms?.length == 0 && (
              <div className="text-center py-1 text-xl font-medium">
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
