import React, { useEffect, useRef } from "react";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import useClickOutside from "../../../hooks/useClickOutlise";
import { GrInsecure } from "react-icons/gr";
import { GrSecure } from "react-icons/gr";


const DotsMenu = ({
  isopen,
  setIsOpen,
  data,
  editUser,
  toggleAccess,
  deleteUser,
}) => {
  const ref = useRef(null);
  useClickOutside(ref, () => {
    setIsOpen(false);
  });

  useEffect(() => { console.log("edit menu data i s: ", data) }, [isopen]);

  const handleEditClick = () => {
    window.scrollTo({
      top: 0,  // Scrolls to the top
      behavior: "smooth",  // Smooth scrolling effect
    });

  };
  return (
    <>
      <div
        ref={ref}
        className={`fixed z-10 bg-white right-0 mr-32 top-60 shadow-lg border border-[#00000010] rounded-xl ${isopen ? "" : "hidden"
          }`}
      >
        <div className="flex p-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 cursor-pointer " onClick={() => {
              editUser()
              handleEditClick()
            }}>
              <FaRegEdit />
              <p>Edit</p>
            </div>
            <div className="flex items-center gap-2 cursor-pointer text-maroon " onClick={deleteUser}>
              <RiDeleteBin6Line />
              <p>Delete</p>
            </div>
            {data.userType == "student" &&
              <div className={`flex items-center gap-2 cursor-pointer ${(!data.isBlocked && data.feesPaid) ? "text-maroon" : "text-green"} `} onClick={toggleAccess}>
                {(!data.isBlocked && data.feesPaid) ?
                  <GrSecure />
                  :
                  <GrInsecure />
                }
                <p>Mark {(!data.isBlocked && data.feesPaid) ? "Deactivate" : "Activate"} </p>
              </div>
            }
          </div>
        </div>
      </div>
    </>
  );
};


export default DotsMenu
