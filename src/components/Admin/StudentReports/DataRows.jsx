import React from "react";
import { SlArrowRight } from "react-icons/sl";
import IMAGES from "../../../assets/images";

const DataRows = ({
  index,
  subject,
  studentName,
  studentProfile,
  studentRollno,
  studentClass,
  contact,
  bgColor,
  header,
  onClickFunction,
}) => {
  return (
    <div className="min-w-full">
      <div
        style={{ backgroundColor: bgColor, cursor: "pointer" }}
        onClick={onClickFunction}
        className="w-full py-1 pl-2 pr-4 md:pl-5 md:pr-10 flex flex-row items-center border-b border-grey mt-1 gap-1 md:gap-2"
      >
        {/* Index */}
        <p
          className={`w-5 shrink-0 md:flex-[1] text-xs md:text-sm text-center md:text-left ${
            header ? "font-semibold" : ""
          }`}
        >
          {index + "."}
        </p>

        {/* Profile — fixed placeholder keeps columns aligned on both header and data rows */}
        <div className="w-8 h-8 md:w-10 md:h-10 shrink-0 flex items-center justify-center md:flex-[1]">
          {!header && (
            <img
              className="rounded-full w-8 h-8 md:w-10 md:h-10 object-cover"
              src={studentProfile || IMAGES.ProfileSvg}
              alt="Student Profile"
            />
          )}
        </div>

        {/* Student Name */}
        <p
          className={`flex-[2] md:flex-[3] text-xs md:text-sm text-left truncate ${
            header ? "font-semibold" : ""
          }`}
        >
          {studentName}
        </p>

        {/* Contact + Arrow */}
        <div
          className={`flex-[2] md:flex-[3] flex items-center justify-between text-xs md:text-sm ${
            header ? "font-semibold" : ""
          }`}
        >
          <span className="truncate">{contact}</span>
          {!header && <SlArrowRight size={14} className="shrink-0 md:w-5 md:h-5 ml-1" />}
        </div>
      </div>
    </div>
  );
};

export default DataRows;