import { useEffect, useState } from "react";

import moment from "moment";
import { calculateDurationHours } from "../../../../../../utils/timeUtils";
import FilterButton from "./FilterButton";
import IMAGES from "../../../../../../assets/images";
import ViewEventDetailsModal from "./viewEventDetailsModal";

import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";


export const CustomEvent = ({ event, setevents }) => {
  const [detailsModalOpen, setdetailsModalOpen] = useState(false);
  
  // Calculate event duration in hours for height scaling
  const startTime = new Date(event.startTime);
  const endTime = new Date(event.endTime);
  const durationHours = calculateDurationHours(startTime, endTime);
  const eventHeight = Math.max(100, durationHours * 100); // Minimum 100px, scale by 100px per hour

  const formatDate = (date) => {
    const latestDate = moment(new Date(date));
    if (latestDate.get("hours") == 0 && latestDate.get("minutes") == 1) {
      latestDate.set("minutes", 0);
    }

    return moment(latestDate).format("hh:mm a");
  };

  //console.log(event, "my event data");


  return (
    <div className="relative flex flex-1 w-full overflow-visible">
      <ViewEventDetailsModal
        setevents={setevents}
        event={event}
        open={detailsModalOpen}
        setopen={setdetailsModalOpen}
      />
      <div
        className={`cursor-pointer rounded-lg w-full transition-all duration-200 hover:shadow-md hover:scale-[1.02] mb-1 ${event.teacher.teacherID.name
          ? "bg-gradient-to-br from-[#38bdf8] to-[#0ea5e9] text-white border border-[#0284c7]"
          : "bg-gradient-to-br from-[#38bdf8] to-[#0ea5e9] text-white border border-[#0284c7]"
          }`}
        style={{ height: `${eventHeight - 4}px`, minHeight: `${eventHeight - 4}px` }}
        onClick={() => {
          return event.teacher.teacherID.name ? setdetailsModalOpen(true) : null;
        }}
      >
        <div className="flex flex-col h-full justify-start p-[2px] sm:p-2 space-y-1">
          <div className="text-[9.5px] sm:text-[10px] leading-tight">
            <span className="font-bold text-blue-50">Teacher:</span>
            <div className="font-semibold text-white truncate">
              {event.teacher ? event.teacher.teacherID.name : ""}
            </div>
          </div>
          <div className="text-[9.5px] sm:text-[10px] leading-tight">
            <span className="font-bold text-blue-50">Title:</span>
            <div className="font-semibold text-white truncate">
              {event.title ? event.title : ""}
            </div>
          </div>
          <div className="text-[9.5px] sm:text-[10px] leading-tight">
            <span className="font-bold text-blue-50">Subject:</span>
            <div className="font-semibold text-white truncate">
              {event.subjectID.name ? event.subjectID.name : ""}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const SideTime = (props) => {

  const times = props.slotMetrics.groups;

  return (
    <>
      <div className="flex flex-col w-[130px]">
        {times.map((time, index) => {
          const startTime = moment.utc(time[0]).tz("Asia/Karachi");
          // Calculate end time based on slot duration or use next slot start
          const endTime = index < times.length - 1 
            ? moment.utc(times[index + 1][0]).tz("Asia/Karachi")
            : startTime.clone().add(1, "hour"); // Default to 1 hour for last slot
          
          return (
            <div
              key={`${time}2`}
              className="flex w-[110px] justify-center items-center border-b border-gray-200 py-2"
              style={{ height: '100px', minHeight: '100px' }}
            >
              <div className="text-center">
                <p className="text-[10px] text-grey font-medium">
                  {startTime.format("h:mm a")}
                </p>
                <p className="text-[8px] text-grey opacity-60">-</p>
                <p className="text-[10px] text-grey font-medium">
                  {endTime.format("h:mm a")}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export const SideTimeHeader = (props) => {
  return (
    <>
      <div className="flex items-center justify-center w-full h-full">
        <p className="text-sm text-black/70 ">GTM +5</p>
      </div>
    </>
  );
};

export const Header = (props) => {
  const day = moment(props.date).format("dddd");
  const currentDate = moment(Date.now()).date();
  const currentMonth = moment(Date.now()).month();

  const date = moment(props.date).date();
  const month = moment(props.date).month();

  return (
    <div
      className={`flex flex-col items-center justify-between flex-1 w-full font-normal h-fit ${currentDate === date && currentMonth === month
        ? "text-[#0B1053]"
        : "text-grey"
        } `}
    >
      <p className="text-lg text-center">{date}</p>
      <p className="text-sm text-start">{day}</p>
    </div>
  );
};

export const CustomToolbar = ({
  toolbar,
  setaddModalOpen,
  events,
  setevents,
  activeFilteredField,
  setactiveFilteredField,
  addModalOpen,
  loading,
}) => {

  const [fields, setfields] = useState([]);

  const goToBack = () => {
    toolbar.onNavigate("PREV");
  };
  const goToNext = () => {
    toolbar.onNavigate("NEXT");
  };
  const goToCurrent = () => {
    toolbar.onNavigate("TODAY");
  };

  //   const handleGetFields = () => {
  //     getFields({ id: currentUser?.id })
  //       .then((res) => {
  //         setfields(
  //           res.map((r) => {
  //             return {
  //               name: r.fieldName,
  //               value: r.id,
  //             };
  //           })
  //         );
  //       })
  //       .catch((err) => {});
  //   };

  useEffect(() => {
    // handleGetFields();
  }, []);

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center w-full gap-2 mt-4">
            {/* <button
              className="px-3 py-1 rounded-md bg-custom-light-1"
              onClick={goToCurrent}
            >
              Today
            </button> */}
            <button
              className="w-8 h-8 p-2 bg-white border border-grey/50 rounded-2xl"
              onClick={goToBack}
            >
              <MdKeyboardArrowLeft />
            </button>

            <p className="mx-0 sm:mx-4 text-xl font-semibold text-[#6A00FF]">
              {moment(Date.now()).format("DD MMMM, YYYY")}
              <span className="ml-2 text-xs font-normal text-grey/70">Today</span>
            </p>

            <button
              className="w-8 h-8 p-2 bg-white border rounded-2xl border-grey/50"
              onClick={goToNext}
            >
              <MdKeyboardArrowRight />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <FilterButton
            className={"px-2 sm:px-8 py-1"}
            text={"Filter Classes"}
            clickHandler={() => setaddModalOpen(!addModalOpen)}
          />
        </div>
      </div>
    </>
  );
};
