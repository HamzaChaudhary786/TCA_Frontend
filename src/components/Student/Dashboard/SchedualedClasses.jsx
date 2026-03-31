import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import meet from "../../../assets/meet.png";
import { FiClock } from "react-icons/fi";
import { GoDotFill } from "react-icons/go";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { useStudent } from "../../../context/StudentContext";
import moment from "moment";
import { useSidebar } from "../../../context/SidebarContext";

const ScheduledClasses = () => {
  const { allClasses } = useStudent();
  const [selectedDate, setSelectedDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [filteredClasses, setFilteredClasses] = useState([]);
  const { isSidebarOpen } = useSidebar();

  useEffect(() => {
    if (allClasses.length > 0) {
      filterClasses();
    }
  }, [selectedDate, allClasses]);

  const filterClasses = () => {
    const filtered = allClasses.filter(
      (item) => moment(item.startTime).format("YYYY-MM-DD") === selectedDate
    );
    setFilteredClasses(filtered);
  };

  const EventComponent = ({ item }) => {
    const [isStarted, setIsStarted] = useState(false);

    useEffect(() => {
      const now = moment();
      const eventStart = moment(item.startTime);
      const eventEnd = moment(item.endTime);

      if (now.isBetween(eventStart, eventEnd)) {
        setIsStarted(true);
      }
    }, [item]);

    return (
      <div className="flex flex-col w-full px-6 text-xs border-l-2 gap-1 py-2 rounded-lg lg:w-60"
        style={{ borderLeftColor: item.subject?.color || item.subjectID?.color || "#6A00FF", backgroundColor: `${item.subject?.color || item.subjectID?.color || "#6A00FF"}10` }}>
        <div className="flex justify-between">
          <p>{item.subject?.name || item.subjectID?.name || "Subject"}</p>
          <p>{item.teacher?.name || item.teacher?.teacherID?.name || "Teacher"}</p>
        </div>
        <div className="text-sm font-medium">
          <p>{item.title}</p>
        </div>
        {isStarted ? (
          <div className="flex items-center justify-between">
            <p className="text-green">Class has started...</p>
            <a href={item?.meetingUrl} target="_blank" rel="noopener noreferrer">
              <div className="flex items-center px-2 sm:pr-4 py-2 bg-green text-white rounded-3xl cursor-pointer">
                <img src={meet} alt="Join" className="w-8 h-3" />
                <p className="text-xs whitespace-nowrap">Join class</p>
              </div>
            </a>
          </div>
        ) : (
          <div className="flex gap-2">
            <FiClock />
            <p>{moment(item.startTime).format("hh:mm a")}</p>
            <p>-</p>
            <p>{moment(item.endTime).format("hh:mm a")}</p>
          </div>
        )}
      </div>
    );
  };

  const CustomCalendar = ({ setSelectedDateFromChild, classesArray }) => {
    const [selectedDate, setSelectedDate] = useState(dayjs());

    const renderDays = () => {
      const startOfMonth = selectedDate.startOf("month");
      const endOfMonth = selectedDate.endOf("month");
      const days = [];
      let currentDay = startOfMonth;

      while (currentDay.isBefore(endOfMonth, "day")) {
        days.push(currentDay);
        currentDay = currentDay.add(1, "day");
      }

      return days.map((day) => {
        const formattedDate = day.format("YYYY-MM-DD");
        const eventsForDay = classesArray.filter(
          (event) => moment(event.startTime).format("YYYY-MM-DD") === formattedDate
        );

        return (
          <div key={formattedDate} className="text-center text-[12px] cursor-pointer hover:bg-gray-200 relative"
            onClick={() => {
              setSelectedDate(day);
              setSelectedDateFromChild(formattedDate);
            }}>
            <div className={`flex flex-col w-10 h-10 items-center px-5 py-1 ${selectedDate.format('YYYY-MM-DD') === formattedDate ? "bg-[#cdd0fe] text-white" : ""} text-xs group text-[#0B1053] hover:bg-[#0B1053] hover:text-white rounded-3xl`}>
              <div className="text-sm text-black group-hover:text-white">{day.format("D")}</div>
              {eventsForDay.length > 0 && <GoDotFill size={10} className="group-hover:text-white" />}
            </div>
          </div>
        );
      });
    };

    return (
      <div className="text-black">
        <div className="flex items-center justify-between mb-4">
          <p onClick={() => setSelectedDate(selectedDate.subtract(1, "month"))}><MdKeyboardArrowLeft size={20} /></p>
          <h2 className="text-sm">{selectedDate.format("MMMM YYYY")}</h2>
          <p onClick={() => setSelectedDate(selectedDate.add(1, "month"))}><MdKeyboardArrowRight size={20} /></p>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {renderDays()}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-1">
      <div className="flex flex-col flex-1 gap-2">
        <div className="flex">
          <p className="text-lg font-medium">Scheduled Classes</p>
        </div>
        <div className={`flex flex-col gap-1 p-3 bg-white rounded-lg lg:flex-row ${isSidebarOpen ? "-z-50" : "z-auto"}`}>
          <div className="flex-1 p-2">
            <CustomCalendar setSelectedDateFromChild={setSelectedDate} classesArray={allClasses} />
          </div>
          <div className="flex flex-col flex-1 gap-1">
            {filteredClasses.length > 0 ? (
              filteredClasses.map((item) => <EventComponent item={item} key={item.id} />)
            ) : (
              <p>No Scheduled classes today</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduledClasses;
