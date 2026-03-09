import moment from "moment";
import {
  Header,
  SideTime,
  CustomEvent,
  CustomToolbar,
  SideTimeHeader,
} from "./calendarComponents";
import { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import { useTeacher } from "../../../utils/TeacherProvider";
import FilterClassesModal from "./FilterClassesModal";
import SchedualClasses from "./SchedualClasses";
import { useQuery } from "@tanstack/react-query";
import { getAllClasses } from "../../../api/ForAllAPIs";

// import { useTeacher as useTeacherData } from "../../../utils/TeacherProvider";


const localizer = momentLocalizer(moment);

const MyCalendar = ({ data, isPending, refetch, isRefetching }) => {
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState([]);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addScheduleModalOpen, setAddScheduleModalOpen] = useState(false);

  const { teacherID, updateTeacherID } = useTeacher();


  // Current date range state
  const dayRangeHeaderFormat = ({ start, end }, culture, local) =>
    local.format(start, "MMMM DD", culture) +
    " – " +
    local.format(
      end,
      local.eq(start, end, "month") ? "DD YYYY" : "MMMM DD YYYY",
      culture
    );
  const [currentWeek, setCurrentWeek] = useState({
    start: moment().startOf("day").toDate(),
    end: moment().endOf("day").toDate(),
  });

  const handleNavigate = (newDate) => {
    const startOfWeek = moment(newDate).startOf("day").toDate();
    const endOfWeek = moment(newDate).endOf("day").toDate();

    setCurrentWeek({
      start: startOfWeek,
      end: endOfWeek,
    });
  };

  useEffect(() => {
    if (!isPending && data) {
      setEvents((prevEvents) => {
        const newEvents = data.map((item) => ({
          ...item,
          start: new Date(item.startTime),
          end: new Date(item.endTime),
        }));

        // Only update if events have changed to avoid re-renders
        return JSON.stringify(prevEvents) === JSON.stringify(newEvents)
          ? prevEvents
          : newEvents;
      });
    }
  }, [isPending, data]);


  // Custom event renderer
  const renderCustomEvent = (e) => (
    <CustomEvent
      setEvents={setEvents}
      event={e.event}
      refetch={refetch}
      isRefetching={isRefetching}
    />
  );

  const handleTeacherID = (id) => {
    if (teacherID !== id) {
      updateTeacherID(id);
    }
  };


  // Custom toolbar renderer
  // const renderCustomToolbar = (toolbar) => (
  //   <CustomToolbar loading={loading} toolbar={toolbar} onTeacherSelect={handleTeacherID} />
  // );


  const [addEventModalOpen, setaddEventModalOpen] = useState(false);


  const { data: teacherData, isPending: isPendingTeacher, refetch: refetchTeacher } = useQuery({
    queryKey: teacherID ? ["timetable", teacherID] : ["timetable"],
    queryFn: () => teacherID ? getAllClasses(teacherID) : Promise.resolve([]), // Avoids unnecessary fetches
    enabled: !!teacherID, // Ensures teacherID is valid before fetching
    refetchOnWindowFocus: false, // Stops auto-refetch on window focus
    refetchOnReconnect: false, // Stops auto-refetch on network reconnect
    staleTime: 1000 * 60 * 5, // Cache results for 5 minutes
    cacheTime: 1000 * 60 * 10, // Keeps data in cache for 10 minutes
  });




  return (
    <div className="flex">


      <div className="">
        {
          addModalOpen && (
            <>

              <div className={`absolute top-0 right-0 lg:-right-5 flex-1 z-10 flex py-4 bg-white rounded-md shadow-sm shadow-grey/25`}
              >
                <FilterClassesModal
                  setaddModalOpen={setaddEventModalOpen}
                  classData={data}
                  addModalOpen={addModalOpen}
                  setAddModalOpen={setAddModalOpen}
                />
              </div>
            </>
          )
        }
      </div>

      <div >
        {
          addScheduleModalOpen && (
            <>
              <div
                className={`absolute top-0 right-0 lg:-right-5 flex-1 z-10 flex py-4 bg-white rounded-md shadow-sm shadow-grey/25`}
              >
                <SchedualClasses
                  data={teacherData}
                  isPending={isPendingTeacher}
                  refetch={refetch}
                  addScheduleModalOpen={addScheduleModalOpen}
                  setAddScheduleModalOpen={setAddScheduleModalOpen}

                />
              </div>
            </>
          )
        }
      </div>

      {!isPending && (
        <div className="w-full h-[100vh] lg:h-[80vh] overflow-y-auto">
          <Calendar
            style={{}}
            formats={{ dayRangeHeaderFormat }}
            min={new Date(0, 0, 0, 0, 0, 0)}
            max={new Date(0, 0, 0, 23, 59, 59)}
            onNavigate={handleNavigate}
            defaultView="week"
            views={{ week: true }}
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            className="w-full"
          step={60}
          timeslots={1}
          components={{
            toolbar: (props) => <CustomToolbar
              {...props}
              onTeacherSelect={handleTeacherID}
              addModalOpen={addModalOpen}
              setAddModalOpen={setAddModalOpen}
              addScheduleModalOpen={addScheduleModalOpen}
              setAddScheduleModalOpen={setAddScheduleModalOpen}
            />,
            event: renderCustomEvent,
            timeGutterHeader: SideTimeHeader,
            timeGutterWrapper: SideTime,
            header: Header,
          }}
          dayLayoutAlgorithm="no-overlap"
          />
        </div>
      )}
    </div>
  );
};

export default MyCalendar;
