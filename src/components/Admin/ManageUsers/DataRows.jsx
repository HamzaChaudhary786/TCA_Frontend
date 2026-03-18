import React from "react";
import { BsThreeDotsVertical } from "react-icons/bs";

const DataRows = ({
  data,
  index,
  bgColor,
  header,
  userName,
  role,
  userId,
  userclass,
  contact,
  onClickFunction,
  toggleClassMenu
}) => {
  return (
    <div
      style={{ backgroundColor: bgColor, cursor: "pointer" }}
      className="flex flex-row gap-1 items-center border-b border-grey custom-shadow my-1 px-3 min-w-[600px]"
    >
      {/* Index */}
      <div className="w-[5%] min-w-[40px] text-center py-3">
        <p className={`text-sm ${header ? "font-semibold" : "text-gray-700"}`}>
          {index}
        </p>
      </div>

      {/* Name */}
      <div className="w-[25%] min-w-[120px] text-center py-3">
        <p className={`text-sm truncate ${header ? "font-semibold" : "text-gray-700"}`}>
          {userName}
        </p>
      </div>

      {/* Role */}
      <div className="w-[15%] min-w-[80px] text-center py-3">
        <p className={`text-sm truncate ${header ? "font-semibold" : "text-gray-700"}`}>
          {role}
        </p>
      </div>

      {/* User ID */}
      <div className="w-[20%] min-w-[100px] text-center py-3">
        <p className={`text-sm truncate ${header ? "font-semibold" : "text-gray-700"}`}>
          {userId}
        </p>
      </div>

      {/* Contact */}
      <div className="w-[30%] min-w-[120px] text-center py-3">
        <p className={`text-sm truncate ${header ? "font-semibold" : "text-gray-700"}`}>
          {contact}
        </p>
      </div>

      {/* Actions */}
      <div className="w-[5%] min-w-[40px] flex justify-center py-3">
        {!header && (
          <p
            onClick={() => toggleClassMenu(data)}
            className="text-[18px] text-gray-500 hover:text-gray-800 transition-colors"
          >
            <BsThreeDotsVertical />
          </p>
        )}
      </div>
    </div>
  );
};

export default DataRows;