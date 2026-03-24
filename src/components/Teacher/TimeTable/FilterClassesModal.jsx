import React, { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import FilterButton from "./FilterButton";
import IMAGES from "../../../assets/images";

import { FiClock } from "react-icons/fi";
import { GoDotFill } from "react-icons/go";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { MdKeyboardArrowRight } from "react-icons/md";
import { useTeacher } from "../../../context/TeacherContext";
import moment from "moment";
import { IoClose } from "react-icons/io5";
import useClickOutside from "../../../hooks/useClickOutlise";


const FilterClassesModal = ({ setAddModalOpen, setaddModalOpen, classData, isPending, }) => {

  

  const [selectedDate, setSelectedDate] = useState(new Date(Date.now()).toDateString());
  const [filteredclasses, setFilteredClasses] = useState([]);

  const [filterEndDate, setFilterEndDate] = useState();
  const [filterActive, setFilterActive] = useState(false);
  const [filterStartDate, setFilterSatrtDate] = useState();

  const filterClasses = () => {
    console.log("selected Date is : ", selectedDate);
    let arr = [];
    arr = classData && classData.filter((item) => new Date(item.startTime).getDate() == new Date(selectedDate).getDate());
    if (filterActive) {
      arr = classData && classData.filter((item) => new Date(item.startTime).getDate() >= new Date(filterStartDate).getDate() && new Date(item.startTime).getDate() <= new Date(filterEndDate).getDate());
    }
    console.log("filtererd are is : ", arr);
    setFilteredClasses(arr);
  };

  useEffect(() => {
    filterClasses();
  }, [selectedDate, classData, filterActive]);

  const EventComponet = ({ item }) => {
    return (
      <div className={`flex flex-col text-xs gap-1 px-2 py-2 rounded-lg w-72`}>
        <div className="flex gap-2">
          <div className="">
            <img src={IMAGES.MathIcon} alt="" className="w-10 h-10 rounded-md" />
          </div>
          <div className="flex flex-col justify-between">
            <div className="flex justify-between">
              <p className="text-sm font-semibold">{item.subjectID.name}</p>
              <p className="text-[#0B1053]">Class {item.classroom.name}</p>
            </div>
            <div className="flex gap-2 text-xs font-light">
              <p className="flex items-center gap-1">
                <FiClock />
                {moment(item.startTime).format("DD-MM-YYYY")}
              </p>
              <p className="flex items-center gap-1">
                <FiClock />
                {moment(item.startTime).format("h:mm a")}-{moment(item.endTime).format("h:mm a")}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const CustomCalender = ({ setSelectedDateFromChild, selectedDateFromChild, classesArray }) => {
    const [selectedDate, setSelectedDate] = useState(dayjs());

    const [dateForEvent, setDateForEvent] = useState("");

    const renderDays = () => {
      const startOfMonth = selectedDate.startOf("month");
      const endOfMonth = selectedDate.endOf("month");

      const days = [];

      // Calculate the starting day of the week (0 = Sunday, 1 = Monday)
      let currentDay = startOfMonth.startOf("week");

      // Fill days for a complete 6-week grid (42 days)
      for (let i = 0; i < 42; i++) {
        days.push(currentDay);
        currentDay = currentDay.add(1, "day");
      }

      // Render days
      return days.map((day) => {
        const formattedDate = day.format("YYYY-MM-DD");
        const isCurrentMonth = day.month() === selectedDate.month();
        const isToday = day.isSame(new Date(), "day");

        const eventsForDay = classesArray
          ? classesArray.filter(
            (event) =>
              new Date(event.startTime).toDateString() ===
              new Date(formattedDate).toDateString()
          )
          : [];

        return (
          <div
            key={formattedDate}
            className={`text-center text-[12px] cursor-pointer hover:bg-gray-200 ${isToday ? "bg-yellow_green_light w-10 h-10 rounded-full text-white" : "text-black"} ${!isCurrentMonth ? "text-gray-400" : ""}`}
            onClick={() => {
              setSelectedDate(day);
              setDateForEvent(formattedDate);
              setSelectedDateFromChild(formattedDate);
            }}
          >
            <div
              className={`flex flex-col w-10 h-10 items-center px-5 py-1 rounded-full ${!filterActive && selectedDateFromChild == formattedDate
                ? "bg-[#0B1053] text-white"
                : ""
                } ${filterActive &&
                  (new Date(formattedDate).toDateString() ===
                    new Date(filterStartDate).toDateString() ||
                    new Date(formattedDate).toDateString() ===
                    new Date(filterEndDate).toDateString())
                  ? "bg-[#0B1053] text-white"
                  : ""
                } group hover:bg-[#0B1053] hover:text-white`}
            >
              <div className="text-sm">{day.format("D")}</div>

              {eventsForDay.length > 0 && (
                <GoDotFill
                  size={10}
                  className="text-[#0B1053] group-hover:text-white"
                />
              )}
            </div>
          </div>
        );
      });
    };

    return (
      <div className="text-black">
        <div className="flex items-center justify-between mb-4">
          <p
            className=""
            onClick={() => setSelectedDate(selectedDate.subtract(1, "month"))}
          >
            <MdKeyboardArrowLeft className="" size={20} />
          </p>
          <h2 className="text-sm">{selectedDate.format("MMMM YYYY")}</h2>
          <p
            className=""
            onClick={() => setSelectedDate(selectedDate.add(1, "month"))}
          >
            <MdKeyboardArrowRight className="" size={20} />
          </p>
        </div>
        <div className="flex w-full gap-2 my-3 text-xs">
          <div className="flex justify-around flex-1 w-full gap-1">
            <div className="flex px-4 py-2 border rounded-lg border-grey/50">
              <input type="date" value={filterStartDate} onChange={(e) => setFilterSatrtDate(e.target.value)} placeholder="Jan 19, 2024" className={"w-24 outline-none "} />
            </div>
            <p className="flex items-center">-</p>
            <div className="flex px-4 py-2 border rounded-lg border-grey/50">
              <input type="date" value={filterEndDate} onChange={(e) => setFilterEndDate(e.target.value)} placeholder="Jan 19, 2024" className={"w-24 outline-none "} />
            </div>
          </div>
        </div>
        <div className="relative grid grid-cols-7 gap-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="px-3 font-semibold text-[10px]">
              {day}
            </div>
          ))}
          {renderDays()}
        </div>
      </div>
    );
  };

  const ButtonComponent = ({ title, color, bgcolor, clickHandler }) => {
    return (
      <div className="flex-1 mx-1 my-1">
        <div
          onClick={clickHandler}
          className={`px-6 w-[19/20] justify-center flex py-1 border rounded-lg cursor-pointer border-grey/50 ${bgcolor == "ghost" ? "bg-[#6A00FF]" : "bg-white"
            }`}
        >
          <p className={`${color == "white" ? "text-white" : "text-black"}`}>
            {title}
          </p>
        </div>
      </div>
    );
  };

  const handleApplyFilters = () => {
    console.log("start date is : ", filterStartDate);
    console.log("end date is : ", filterEndDate);
    setFilterActive(true);
  }


  const ref = useRef(null);

  useClickOutside(ref, () => {
    setAddModalOpen(false);

  });

  return (
    <div className="flex flex-col flex-1 bg-white rounded-md lg:w-96" ref={ref}>

      <div className="flex justify-between px-5 pb-4 border-b border-b-black/10">
        <p className="text-xl font-medium">Filter Classes</p>
        <IoClose
          onClick={() => {
            // onclose();
            setAddModalOpen(false);
          }}
          className="cursor-pointer"
        />

      </div>


      <div className="flex flex-col flex-1 gap-2">
        <div className="flex flex-col gap-1 p-3 bg-white rounded-lg">
          <div className="flex-1 p-2 ">
            <CustomCalender
              classesArray={classData}
              selectedDateFromChild={selectedDate}
              setSelectedDateFromChild={setSelectedDate}
            />
          </div>
          <div className="flex flex-1 gap-4 py-4 border-t border-b border-t-grey/50 border-b-grey/50">
            <ButtonComponent
              title={"Cancel"}
              bgcolor={""}
              color={""}
              clickHandler={() => {
                setFilterActive(false);
                setaddModalOpen(false);
              }}
            />
            <ButtonComponent
              title={"Apply"}
              color={"white"}
              bgcolor={"ghost"}
              clickHandler={handleApplyFilters}
            />
          </div>

          <div className="flex flex-col flex-1 gap-1">
            <div className="flex flex-col items-center">
              <p className="flex justify-center text-xl font-semibold">
                Classes
              </p>
              {filteredclasses && filteredclasses.length > 0
                ? ""
                : "No Shcedualed classes at this date"}
            </div>
            {filteredclasses && filteredclasses?.map((item) => (
              <EventComponet item={item} key={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterClassesModal;
