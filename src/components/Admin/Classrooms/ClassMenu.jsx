import React, { useEffect, useRef } from "react";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import useClickOutside from "../../../hooks/useClickOutlise";

const ClassMenu = ({
  isopen,
  setIsOpen,
  deleteClassRoom,
  promoteStudentsPopup,
  editClassRoom
}) => {
  const ref = useRef(null);
  useClickOutside(ref, () => {
    setIsOpen(false);
  });

  return (
    <>
      <div
        ref={ref}
        className={`fixed z-10 bg-white right-0 mr-32 top-80 shadow-lg border border-[#00000010] rounded-xl ${isopen ? "" : "hidden"
          }`}
      >
        <div className="flex p-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 cursor-pointer " onClick={() => {
              editClassRoom()
              setIsOpen(false);
            }}>
              <FaRegEdit />
              <p>Edit</p>
            </div>
            <div className="flex items-center gap-2 cursor-pointer text-[#6A00FF] " onClick={() => {
              deleteClassRoom()
              setIsOpen(false);
            }}>
              <RiDeleteBin6Line />
              <p>Delete</p>
            </div>

            <div className="flex items-center gap-2 cursor-pointer text-[#6A00FF] " onClick={() => {
              promoteStudentsPopup()
              setIsOpen(false);
            }}>
              <div>🎓</div>
              <p>Promote</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};


export default ClassMenu
