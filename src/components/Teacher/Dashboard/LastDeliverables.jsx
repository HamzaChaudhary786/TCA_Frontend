import { useQuery } from "@tanstack/react-query";
import { Circle } from "rc-progress";
import React from "react";
import { getAllAssignments } from "../../../api/Teacher/Assignments";
import Loader from "../../../utils/Loader";
import { useSidebar } from "../../../context/SidebarContext";

const LastDeliverables = () => {

  const { data, isPending, isSuccess, isError, refetch, isRefetching } = useQuery({ queryKey: ["assignments"], queryFn: getAllAssignments });
  const { isSidebarOpen } = useSidebar();
  console.log("deliverable is : ", data)

  const DeliverableComponent = ({deliverable}) => {
    return (
      <div className="flex flex-col items-center justify-center w-full gap-2 bg-white rounded-md md:px-8 sm:flex-1 md:py-2 md:gap-3">
        <div className="flex flex-col items-center justify-center w-24 h-24 md:flex-row">
          <Circle
            percent={(deliverable?.submissions?.length/deliverable?.classroomID?.students?.length)*100}
            strokeColor={`#0B1053`}
            strokeWidth={12}
            trailColor="#EAECF0"
            trailWidth={12}
          />
          <div className={`absolute flex flex-col items-cente ${isSidebarOpen ? "-z-50" : "z-auto"}`}>
            <span className="text-[7px] md:text-[10px] z-10">Submission</span>
            <div className="flex">
              <span className="text-[7px] text-base font-semibold">{((deliverable?.submissions?.length/deliverable?.classroomID?.students?.length)*100).toFixed(0)} %</span>
            </div>
          </div>
        </div>
        <p className="text-xs text-center">Submissions: {deliverable?.submissions?.length} / {deliverable?.classroomID?.students?.length}</p>
      </div>
    );
  };

  return (
    isPending ?  <div className="flex"> <Loader /> </div> :
    <>
    <div className="flex flex-1">
      <div className="flex flex-col flex-1 gap-2">
        <div className="flex">
          <p className="flex text-xl font-medium">Last Deliverables</p>
        </div>
        <div className="flex flex-col gap-1 px-3 py-5 bg-white rounded-lg custom-shadow">
          <div className="flex px-5 text-sm ">
            <div className="flex justify-center flex-1">
              <p>{data[0]?.title}</p>
            </div>
          </div>
          <div className="flex flex-1 gap-2 p-2">
            {data?.length > 0 &&
            <DeliverableComponent deliverable={data[0]? data[0] : {}} />
            }
            {data?.length == 0 && <div className="py-4 text-xl px-4">No latest deliverables available right now!</div>}
            {/* <DeliverableComponent /> */}
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default LastDeliverables;
