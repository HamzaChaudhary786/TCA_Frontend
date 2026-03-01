import React from "react";
import IMAGES from "../../../assets/images";


const DataRows = ({
  index,
  subject,
  studentName,
  studentProfile,
  studentClass,
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
        className={` py-[4px] md:pl-5 md:pr-10 flex flex-row items-center justify-around border-b border-grey`}
      >
        <p
          className={`w-full md:flex-[1] flex-[1] md:text-[16px] lg:text-[14px] text-[14px] text-center md:text-left ${header ? "font-semibold" : ""
            }`}
        >
          {index + "."}
        </p>
        <p
          className={`w-full md:flex-[1] flex-[1] md:text-[16px] lg:text-[14px] text-[14px] text-center md:text-left ${header ? "hidden" : "flex"
            }`}
        >
          <img
            className=" rounded-full md:h-7 md:w-7 sm:h-5 sm:w-5 object-cover"
            src={studentProfile || IMAGES.Profile}
            alt="Student Profile"
          />
        </p>
        <p
          className={`w-full md:flex-[3] my-1 md:my-0 text-center md:text-[16px] lg:text-[14px] text-[14px] md:text-left ${header ? "font-semibold md:ml-14 text-center" : ""
            }`}
        >
          {studentName}
        </p>
        <p
          className={`w-full md:flex-[3] my-1 md:my-0 text-center md:text-left md:text-[16px] lg:text-[14px]  text-[14px] ${header ? "font-semibold" : ""
            }`}
        >
          {studentClass}
        </p>
        <p
          className={`w-full md:flex-[3] my-1 md:my-0 text-center md:text-[16px] text-[14px] lg:text-[14px] md:text-left ${header ? "font-semibold" : ""
            }`}
        >
          {subject}
        </p>
        {header ? (
          <p
            className={`w-full md:flex-[3] my-1 md:my-0 text-center md:text-left md:text-[16px] lg:text-[14px] text-[14px] ${header ? "font-semibold" : ""
              }`}
          >
            {attendance}
          </p>
        ) : (
          <div className="md:flex-[3] w-full bg-grey/50 rounded-3xl overflow-hidden">
            <div
              className="text-xs h-4 bg-gradient-to-r from-[#0B1053] to-[#007EEA] rounded-3xl flex justify-center items-center text-white md:text-[16px] text-[14px]"
              style={{ width: `${attendance}%` }}
            >
              {`${Number(attendance).toFixed(2)}%`}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataRows;
