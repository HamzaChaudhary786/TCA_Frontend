import React from "react";
import { BsThreeDotsVertical } from "react-icons/bs";

const DataRow = (props) => {
  return (
    <div
      style={{ backgroundColor: props.bgColor }}
      className="flex items-center border-b border-grey w-full min-w-[600px]"
    >
      {/* Index */}
      <div className="w-[8%] min-w-[45px] text-center px-1 py-3">
        <p className={`text-[11px] sm:text-[13px] truncate ${props.header ? "font-semibold" : ""}`}>
          {props.index}
        </p>
      </div>

      {/* Classroom */}
      <div className="w-[22%] min-w-[100px] text-center px-1 py-3">
        <p className={`text-[11px] sm:text-[13px] truncate ${props.header ? "font-semibold" : ""}`}>
          {props.classname}
        </p>
      </div>

      {/* Classes Scheduled */}
      <div className="w-[18%] min-w-[90px] text-center px-1 py-3">
        <p className={`text-[11px] sm:text-[13px] truncate ${props.header ? "font-semibold" : ""}`}>
          {props.classesSchedualled}
        </p>
      </div>

      {/* Students */}
      <div className="w-[15%] min-w-[70px] text-center px-1 py-3">
        <p className={`text-[11px] sm:text-[13px] truncate ${props.header ? "font-semibold" : ""}`}>
          {props.students}
        </p>
      </div>

      {/* Teachers */}
      <div className="w-[15%] min-w-[70px] text-center px-1 py-3">
        <p className={`text-[11px] sm:text-[13px] truncate ${props.header ? "font-semibold" : ""}`}>
          {props.teachers}
        </p>
      </div>

      {/* Created By */}
      <div className="w-[17%] min-w-[80px] text-center px-1 py-3">
        <p className={`text-[11px] sm:text-[13px] truncate ${props.header ? "font-semibold" : ""}`}>
          {props.createdBy}
        </p>
      </div>

      {/* Actions */}
      <div className="w-[5%] min-w-[35px] flex justify-center py-3">
        {!props.header && (
          <p
            onClick={() => props.toggleClassMenu(props.data)}
            className="text-[16px] sm:text-[18px] text-gray-500 hover:text-gray-800 cursor-pointer transition-colors"
          >
            <BsThreeDotsVertical />
          </p>
        )}
      </div>
    </div>
  );
};

export default DataRow;