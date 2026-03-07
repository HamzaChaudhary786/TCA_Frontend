import React from "react";
import { SlArrowRight } from "react-icons/sl";
import IMAGES from "../../../assets/images";

const DataRows = ({
  index,
  teacherName,
  teacherProfile,
  teacherId,
  subject,
  classAvg,
  attendance,
  bgColor,
  header,
  onClickFunction,
}) => {
  return (
    <div className="min-w-full">
      <div
        style={{ backgroundColor: bgColor, cursor: "pointer" }}
        onClick={onClickFunction}
        className={`  py-1 md:pl-5 md:pr-10 space-x-5 flex flex-row items-center justify-around border-b border-grey mt-1`}
      >
        <p
          className={`w-full md:flex-[1] flex-[1] text-sm text-center md:text-left ${header ? "font-semibold" : ""
            }`}
        >
          {index + "."}
        </p>
        <p
          className={`w-full md:flex-[1] flex-[1] text-sm  text-center md:text-left ${header ? "hidden" : "flex"
            }`}
        >
          <img
            className=" rounded-full h-10 w-10 object-cover"
            src={teacherProfile || IMAGES.Profile}
            alt="Teacher Profile"
          />{" "}
        </p>
        <p
          className={`w-full ml-2 md:flex-[3] my-1 md:my-0 text-center text-sm md:text-left ${header ? "font-semibold ml-14 text-center" : ""
            }`}
        >
          {teacherName}
        </p>
        <p
          className={`w-full md:flex-[3] my-1 md:my-0 text-center md:text-left text-sm   text-[14px] ${header ? "font-semibold" : ""
            }`}
        >
          {teacherId}
        </p>
        <p
          className={`w-full md:flex-[3] my-1 md:my-0 text-center md:text-left text-sm ${header ? "font-semibold" : ""
            }`}
        >
          {subject}
        </p>
        {/* <p
          className={`w-full md:flex-[3] my-1 md:my-0 text-center md:text-left text-sm ${header ? "font-semibold" : ""
            }`}
        >
          {classAvg}
        </p> */}
        {header ? (
          <p
            className={`w-full md:flex-[3] my-1 md:my-0 text-center md:text-left text-sm ${header ? "font-semibold" : ""
              }`}
          >
            {attendance}
          </p>
        ) : (
          <div className="flex md:flex-[3] w-full justify-between items-center flex-1">

            <div className="md:flex-[3] w-full bg-grey/50 rounded-3xl overflow-hidden">
              <div style={{ width: `${attendance}%` }} className={` px-4 text-xs h-4 items-center bg-gradient-to-r from-[#0B1053] to-[#0B1053] rounded-3xl flex justify-center text-white`}>
                {attendance.toFixed(0)}
              </div>
            </div>
            <div>
              <SlArrowRight size={20} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataRows;
