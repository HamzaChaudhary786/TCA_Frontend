import React, { useEffect } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";

const DataRow = (props) => {
  useEffect(() => {}, []);

  return (
    <div
      style={{ backgroundColor: props.bgColor }}
      className="flex items-center border-b border-grey w-full"
    >
      {/* Index */}
      <div className={`w-[8%] min-w-[50px] text-center px-2 py-3`}>
        <p className={`text-[13px] truncate ${props.header ? "font-semibold" : ""}`}>
          {props.index}
        </p>
      </div>

      {/* Classroom */}
      <div className="w-[22%] min-w-[110px] text-center px-2 py-3">
        <p className={`text-[13px] truncate ${props.header ? "font-semibold" : ""}`}>
          {props.classname}
        </p>
      </div>

      {/* Classes Scheduled */}
      <div className="w-[18%] min-w-[100px] text-center px-2 py-3">
        <p className={`text-[13px] truncate ${props.header ? "font-semibold" : ""}`}>
          {props.classesSchedualled}
        </p>
      </div>

      {/* Students */}
      <div className="w-[18%] min-w-[80px] text-center px-2 py-3">
        <p className={`text-[13px] truncate ${props.header ? "font-semibold" : ""}`}>
          {props.students}
        </p>
      </div>

      {/* Teachers */}
      <div className="w-[18%] min-w-[80px] text-center px-2 py-3">
        <p className={`text-[13px] truncate ${props.header ? "font-semibold" : ""}`}>
          {props.teachers}
        </p>
      </div>

      {/* Created By */}
      <div className="w-[16%] min-w-[90px] text-center px-2 py-3">
        <p className={`text-[13px] truncate ${props.header ? "font-semibold" : ""}`}>
          {props.createdBy}
        </p>
      </div>

      {/* Actions */}
      <div className="w-[5%] min-w-[40px] flex justify-center py-3">
        {!props.header && (
          <p
            onClick={() => props.toggleClassMenu(props.data)}
            className="text-[18px] text-gray-500 hover:text-gray-800 cursor-pointer transition-colors"
          >
            <BsThreeDotsVertical />
          </p>
        )}
      </div>
    </div>
  );
};

export default DataRow;