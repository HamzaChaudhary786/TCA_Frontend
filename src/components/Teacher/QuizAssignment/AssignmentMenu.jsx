import React, { useEffect, useRef } from "react";
import { IoBookOutline, IoCalendarOutline } from "react-icons/io5";
import useClickOutside from "../../../hooks/useClickOutlise";
import { useBlur } from "../../../context/BlurContext";

const AssignmentMenu = ({
  isopen,
  setIsOpen,
  isQuizz,
  onViewSubmissionClick,
  onChangeDeadlineClick,
  onGradeAssignemntClick,
  onEditGradeClick,
}) => {
  const ref = useRef(null);
  const { toggleBlur } = useBlur()
  useClickOutside(ref, () => {
    if (isopen) {
      setIsOpen(false);
      // toggleBlur()
    }
  });

  useEffect(() => { }, [isopen]);
  return (
    <>
      <div
        ref={ref}
        className={`fixed z-10 bg-white right-0 mr-20 top-64 shadow-lg border border-[#00000010] rounded-xl ${isopen ? "" : "hidden"
          }`}
      >
        <div className="flex p-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 cursor-pointer " onClick={onViewSubmissionClick}>
              <IoBookOutline />
              <p>View Submissions</p>
            </div>
            {/* <div className="flex items-center gap-2 cursor-pointer " onClick={onChangeDeadlineClick}>
              <IoCalendarOutline />
              <p>Change Deadline</p>
            </div> */}
            <div className="flex items-center gap-2 cursor-pointer " onClick={onGradeAssignemntClick}>
              <IoBookOutline />
              <p>Grade {isQuizz ? "Quizz" : "Assignment"}</p>
            </div>
            {/* <div className="flex items-center gap-2 cursor-pointer " onClick={onEditGradeClick}>
              <IoBookOutline />
              <p>Edit Grades</p>
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default AssignmentMenu;
