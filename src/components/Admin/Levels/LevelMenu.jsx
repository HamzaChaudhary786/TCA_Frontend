import React, { useEffect, useRef } from "react";
import { IoBookOutline, IoCalendarOutline } from "react-icons/io5";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import useClickOutside from "../../../hooks/useClickOutlise";

const LevelMenu = ({
  isopen,
  setIsOpen,
  deleteLevel,
  editLevel
}) => {
  const ref = useRef(null);
  useClickOutside(ref, () => {
    setIsOpen(false);
  });

  return (
    <>
      <div
        ref={ref}
        className={`fixed z-10 bg-white right-0 mr-32 top-80 shadow-lg border border-[#00000010] rounded-xl ${
          isopen ? "" : "hidden"
        }`}
      >
        <div className="flex p-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 cursor-pointer " onClick={editLevel}>
              <FaRegEdit/>
              <p>Edit</p>
            </div>
            <div className="flex items-center gap-2 cursor-pointer text-maroon " onClick={deleteLevel}>
              <RiDeleteBin6Line />
              <p>Delete</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};


export default LevelMenu
