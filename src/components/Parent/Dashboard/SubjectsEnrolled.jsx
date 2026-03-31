import React, { useEffect, useState } from "react";
import TeacherMessageDialog from "./TeacherMessageDialog";
import { useParent } from "../../../context/ParentContext";
import { useQuery } from "@tanstack/react-query";
import { getAllSubjects } from "../../../api/Parent/ParentApi";
import Loader from "../../../utils/Loader";

const SubjectsEnrolled = () => {
  const [popup, setPopup] = useState(false);
  const [clickedItem, setClickedItem] = useState(null);
  const [enableQuery, setEnableQuery] = useState(false);

  const { allSubjects, setAllSubjects, selectedChild } = useParent();

  const toggleClickTeacher = (item) => {
    setPopup(!popup);
    setClickedItem(item);
  };

  const handleFeedback = () => {
    toggleClickTeacher();
  };

  const subjectQuery = useQuery({
    queryKey: ["subjects", selectedChild?.id],
    queryFn: async () => {
      const results = await getAllSubjects(selectedChild?.id);
      setAllSubjects(results);
      return results;
    },
    staleTime: 300000,
    enabled: enableQuery && !!selectedChild?.id,
  });

  useEffect(() => {
    if (allSubjects.length === 0 && selectedChild?.id) {
      setEnableQuery(true);
    }
  }, [allSubjects, selectedChild]);

  const thClass = "flex justify-center items-center text-center min-w-0 break-words text-sm sm:text-lg font-medium";
  const tdClass = "flex justify-center items-center text-center px-[2px] md:px-[4px] text-[10px] md:text-[14px] py-2 lg:py-3 border-l border-l-black/10 min-w-0 break-words leading-tight";

  return (
    <div className="flex flex-1">
      <div className="flex flex-col flex-1 gap-2">
        <div>
          <p className="text-lg font-medium">Subjects Enrolled</p>
        </div>
        <div className="flex flex-1 overflow-x-auto">
          <table className="flex flex-col flex-1 bg-white rounded-lg w-full">
            <thead className="flex px-2 py-3 border-t-4 rounded-tl-lg rounded-tr-lg border-t-[#007EEA] bg-[#c7cafd]">
              <tr className="flex flex-1 w-full">
                <td className={`flex-[1] ${thClass}`}>Sr No.</td>
                <td className={`flex-[3] ${thClass}`}>Subject Name</td>
                <td className={`flex-[3] ${thClass}`}>Instructor</td>
                <td className={`flex-[3] ${thClass}`}>Attendance</td>
              </tr>
            </thead>

            {subjectQuery.isPending ? (
              <tbody className="flex flex-1">
                <tr className="flex flex-1 justify-center py-5">
                  <td colSpan="4">
                    <Loader />
                  </td>
                </tr>
              </tbody>
            ) : subjectQuery.isError ? (
              <tbody className="flex flex-1">
                <tr className="flex flex-1 justify-center py-5">
                  <td colSpan="4" className="text-red-500">
                    Error fetching subjects. Please try again later.
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody className="flex flex-col w-full">
                {subjectQuery?.data?.subjects?.length > 0 ? (
                  subjectQuery.data.subjects.map((item, index) => (
                    <tr key={index} className="flex flex-1 w-full border-t border-t-black/10 items-stretch">
                      <td className="flex-[1] py-2 lg:py-3 flex justify-center items-center text-[10px] md:text-[14px] min-w-0">
                        {index + 1}
                      </td>
                      <td className={`flex-[3] ${tdClass}`}>
                        {item.subject.name}
                      </td>
                      <td
                        onClick={() => toggleClickTeacher(item)}
                        style={{ cursor: "pointer" }}
                        className={`flex-[3] ${tdClass}`}
                      >
                        {item.teacher.name}
                      </td>
                      <td className="flex-[3] py-2 lg:py-3 border-l border-l-black/10 flex items-center justify-center min-w-0 px-[4px]">
                        <div className="flex w-[90%] h-4 bg-grey/50 rounded-3xl">
                          <div
                            style={{ width: `${item.avgAttendancePer || 0}%` }}
                            className="text-xs h-4 bg-gradient-to-r from-[#0B1053] to-[#007EEA] rounded-3xl flex justify-center text-white"
                          >
                            <span className="ml-[1.26rem]">
                              {item?.avgAttendancePer || 0}%
                            </span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="py-4 text-center">
                      No subjects are found.
                    </td>
                  </tr>
                )}
                {popup && <TeacherMessageDialog handleFeedback={handleFeedback} item={clickedItem} />}
              </tbody>
            )}
          </table>
        </div>
      </div>
    </div>
  );
};

export default SubjectsEnrolled;
