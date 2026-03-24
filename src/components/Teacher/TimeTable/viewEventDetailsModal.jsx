import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import meet from "../../../assets/meet.png";
import moment from "moment";
import ConfirmModal from "./ConfirmModal";
import { formatTimeInPKT } from "../../../utils/timeUtils";
import { GoArrowRight } from "react-icons/go";
import IMAGES from "../../../assets/images";
import useClickOutside from "../../../hooks/useClickOutlise";
import { useTeacher } from "../../../context/TeacherContext";
import { cancelClass, createClasses, updateClasses } from "../../../api/Teacher/Class";
import { toast } from "react-toastify";
import Loader from "../../../utils/Loader"
import { teacherPresent } from "../../../api/Teacher/Attendence";
import { useUser } from "../../../context/UserContext";
import { useMutation } from "@tanstack/react-query";
import { CusotmInputField } from "../../../commonComponents/CusotmInputField";
import { convertToISOWithTimezoneOffset } from "../../../utils/ConvertTimeZone";
// import { LuGalleryHorizontal } from "react-icons/lu";
import { Pencil } from "lucide-react";


const CusotmInput = ({ valuesObj, value, type, name, status, title, setValue }) => {
  return (
    <div className="my-1 text-sm flex w-full">
      <div className="flex flex-col gap-2 flex-1 w-full">
        <div className="bg-white ">
          {title}
        </div>
        <div
          className={`flex px-2 py-1 w-full flex-1 border justify-between rounded-md items-center border-grey/70 ${status ? "text-black" : "text-grey"
            }`}
        >
          <input
            type={type}
            value={value}
            placeholder={`Enter ${name}`}
            className="flex flex-1 w-full py-1 outline-none"
            min={type === "date" ? new Date().toISOString().split("T")[0] : undefined}
            onChange={(e) => setValue({ ...valuesObj, [name]: e.target.value })}

          />
        </div>
      </div>
    </div>
  );
};


export default function ViewEventDetailsModal({
  open,
  setopen,
  event,
  setevents,
  refetch
}) {

  const { classesRefetch } = useTeacher();
  const { userData } = useUser();
  const [confirmDeleteModalOpen, setconfirmDeleteModalOpen] = useState(false);
  const [eventType, setEventType] = useState(false);
  const [startDate, setStartDate] = useState(
    moment(event.startTime).format("YYYY-MM-DD") // Format for <input type="date">
  );

  let prevStartTime = formatTimeInPKT(event.startTime, 'HH:mm');
  let prevEndTime = formatTimeInPKT(event.endTime, 'HH:mm');

  const [classObj, setClassObj] = useState({
    title: event.title,
    startTime: prevStartTime, // Format to HH:mm
    endTime: prevEndTime,     // Format to HH:mm
    oneTime: true,
    meetingUrl: event.meetingUrl,
    classroomID: event.classroomID,
    subjectID: event.subjectID._id,
    startEventDate: event.startEventDate,
    endEventDate: event.endEventDate,
    teacher: { teacherID: userData._id, status: "absent" },
    updateSeries: eventType
  })

  //   const { setAlert } = useAlert();
  const ref = useRef(null);
  const eventNameRef = useRef();
  const navigate = useNavigate();
  useClickOutside(ref, () => {
    setopen(false)

  });
  const [loading, setLoading] = useState(false);
  const [isOutside, setisOutside] = useState(false);
  const [editingName, seteditingName] = useState(false);
  const [isYAxisOutside, setisYAxisOutside] = useState(false);

  const handleDeleteEvent = () => {
    // deleteEvent({ eventId: event.id })
    //   .then((res) => {
    //     setAlert("Event deleted successfully", "success");
    //     setevents((eve) => eve.filter((e) => e.id != event.id));
    //   })
    //   .catch((err) => {});
    console.log("dell event method");
  };

  const handleTeacherAttendance = async () => {
    console.log("teacher attendnece clicked");
    const respo = await teacherPresent(event._id);
    console.log("teaccher attendance result : ", respo);
  }

  useEffect(() => {
    if (open) {
      function adjustPosition() {
        const childRect = ref?.current?.getBoundingClientRect();
        setisYAxisOutside(childRect.bottom > window.innerHeight);
        if (childRect.right > window.innerWidth) {
          setisOutside(true);
        } else {
          setisOutside(false);
        }
      }

      window.addEventListener("resize", adjustPosition);
      adjustPosition();

      return () => {
        window.removeEventListener("resize", adjustPosition);
      };
    }
  }, [open]);

  useEffect(() => {
    // getField({ id: event.fieldId })
    //   .then((res) => {
    //     setfield(res);
    //   })
    //   .catch((err) => {});
  }, []);

  const handleJoinMeeting = () => {
    console.log("meeting joining handler!");
  };

  const handleCancelMeeting = async () => {
    setLoading(true);
    const response = await cancelClass(event._id);
    if (response != "error") {
      await classesRefetch();
      setLoading(false);
      toast.success("Class Cancelled successfully!");
    }
  };

  useEffect(() => {
    if (open && event) {
        const prevStartTime = formatTimeInPKT(event.startTime, 'HH:mm');
  const prevEndTime = formatTimeInPKT(event.endTime, 'HH:mm');

      setClassObj({
        title: event.title,
        startTime: prevStartTime,
        endTime: prevEndTime,
        oneTime: true,
        meetingUrl: event.meetingUrl,
        classroomID: event.classroomID,
        subjectID: event.subjectID._id,
        startEventDate: event.startEventDate,
        endEventDate: event.endEventDate,
        teacher: { teacherID: userData._id, status: "absent" },
        updateSeries: false,
      });

      setStartDate(moment(event.startTime).format("YYYY-MM-DD"));
      setEventType(false); // reset checkbox too
    }
  }, [open, event, userData._id]);



  // function convertToISOWithTimezoneOffset(startEventDate, startTime) {
  //   const dateTimeString = `${startEventDate}T${startTime}:00.000Z`;
  //   return dateTimeString;
  // }

  const convertToISOWithTimezoneOffsetEnd = (startEventDate, startTime) => {
    const dateTimeString = `${startEventDate}T${startTime}:00.000Z`;
    return dateTimeString;
  }


  const handleUpdateClass = () => {
    // Convert start and end times to ISO format
    const isoFormattedStringEndTime = new Date(convertToISOWithTimezoneOffsetEnd(startDate, classObj.endTime));
    const isoFormattedStringStartTime = new Date(convertToISOWithTimezoneOffset(startDate, classObj.startTime));

    const endEventDate = new Date(classObj.endEventDate).toISOString().split('T')[0];
    // Construct the payload object
    const obj = {
      classID: event._id,
      title: classObj.title,
      startTime: isoFormattedStringStartTime,
      endTime: isoFormattedStringEndTime,
      oneTime: true,
      meetingUrl: classObj.meetingUrl,
      classroomID: classObj.classroomID,
      subjectID: classObj.subjectID,
      startEventDate: startDate,
      endEventDate: endEventDate,
      teacher: { teacherID: userData._id, status: classObj.status },
      updateSeries: eventType,
    };


    // Send updated data to backend
    classUpdateMutate.mutate(obj);
  };


  const classUpdateMutate = useMutation({
    mutationFn: async (data) => await updateClasses(data),
    onSettled: async (data, error) => {
      if (!error) {
        toast.success("Class created successfully");
        refetch();
        setaddEventModalOpen(false);
      }
    }
  });


  const fullMeetingUrl = event?.meetingUrl?.startsWith("http")
    ? event.meetingUrl
    : `https://${event?.meetingUrl}`;



  return (
 <div
  ref={ref}
  className={`fixed z-50 top-5 left-1/2 transform -translate-x-1/2 w-full max-w-md md:max-w-lg max-h-[90vh] overflow-y-auto bg-white text-[#0B1053] p-6 rounded-xl shadow-lg ${open ? "" : "hidden"}`}
>



      
      <ConfirmModal
        isOpen={confirmDeleteModalOpen}
        title={"Confirm Delete"}
        description={"Are you sure you want to delete this event?"}
        onconfirm={(e) => {
          e.stopPropagation();
          handleDeleteEvent();
        }}
        onclose={(e) => {
          e.stopPropagation();
          setconfirmDeleteModalOpen(false);
        }}
      />
      <div className="flex justify-center items-start mt-12">
        <div className="flex flex-col w-full gap-4">
          <div className="flex items-center justify-between">
            <div className="flex w-fit gap-2 items-center">
              <p
                ref={eventNameRef}
                contentEditable={editingName}
                onClick={(e) => e.stopPropagation()}
                dangerouslySetInnerHTML={{ __html: event.subjectID.name }}
                className={`text-lg md:text-xl font-medium px-4 py-2 rounded-lg transition-all duration-200 ${editingName
                  ? "bg-[#E5E7EB] border border-[#D1D5DB] shadow-sm focus:outline-none"
                  : "hover:bg-[#EDEEF0] cursor-pointer"
                  }`}
              />
              {!editingName && <Pencil size={16} className="text-[#6B7280]" />}
            </div>
            <div className="flex items-center gap-2">
              <img
                src={IMAGES.CloseIcon}
                className="w-[15px] h-[15px]"
                onClick={(e) => {
                  e.stopPropagation();
                  setopen(false);
                  setClassObj({})

                }}
              />
            </div>
          </div>
          <div className="flex flex-col w-full items-center gap-3">
            <div className="flex flex-col w-full gap-1">
              <p className="text-xs font-semibold text-grey_700">Instructor</p>
              <div className="flex justify-between border-[1.5px] py-2 px-4 rounded-lg w-full items-center border-grey/50">
                <p className="text-sm text-custom-gray-3">{event.teacher.teacherID.name}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col w-full items-center gap-3">
            <div className="flex flex-col w-full gap-1">
              <p className="text-xs font-semibold text-grey_700">Classroom</p>
              <div className="flex justify-between border-[1.5px] py-2 px-4 rounded-lg w-full items-center border-grey/50">
                <p className="text-sm text-custom-gray-3">{event?.classroom?.name}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {
              event.groupID ? (
                <>
                  <div className="flex flex-col flex-1 gap-1">
                    <p className="text-xs font-semibold text-grey_700">Start Date</p>
                    <div className="flex justify-between border-[1.5px] py-2 px-4 rounded-lg items-center border-grey/50">
                      <p className="text-sm text-custom-gray-3">
                        {moment(event.startTime).format("DD MMMM, YYYY")}
                      </p>
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M3.375 0V2.25H2.25C1.00736 2.25 0 3.25736 0 4.5V15.75C0 16.9926 1.00736 18 2.25 18H15.75C16.9926 18 18 16.9926 18 15.75V4.5C18 3.25736 16.9926 2.25 15.75 2.25H15.1875V0H13.5V2.25H5.0625V0H3.375ZM2.25 3.9375H15.75C16.0607 3.9375 16.3125 4.18934 16.3125 4.5V5.62555L1.6875 5.62555V4.5C1.6875 4.18934 1.93934 3.9375 2.25 3.9375ZM1.6875 7.31305L16.3125 7.31305V15.75C16.3125 16.0607 16.0607 16.3125 15.75 16.3125H2.25C1.93934 16.3125 1.6875 16.0607 1.6875 15.75V7.31305Z"
                          fill="#6A6A6A"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="flex flex-col flex-1 gap-1">
                    <p className="text-xs font-semibold text-grey_700">End Date</p>
                    <div className="flex justify-between border-[1.5px] py-2 px-4 rounded-lg  items-center border-grey/50">
                      <p className="text-sm text-custom-gray-3">
                        {moment(event.endTime).format("DD MMMM, YYYY")}
                      </p>
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M3.375 0V2.25H2.25C1.00736 2.25 0 3.25736 0 4.5V15.75C0 16.9926 1.00736 18 2.25 18H15.75C16.9926 18 18 16.9926 18 15.75V4.5C18 3.25736 16.9926 2.25 15.75 2.25H15.1875V0H13.5V2.25H5.0625V0H3.375ZM2.25 3.9375H15.75C16.0607 3.9375 16.3125 4.18934 16.3125 4.5V5.62555L1.6875 5.62555V4.5C1.6875 4.18934 1.93934 3.9375 2.25 3.9375ZM1.6875 7.31305L16.3125 7.31305V15.75C16.3125 16.0607 16.0607 16.3125 15.75 16.3125H2.25C1.93934 16.3125 1.6875 16.0607 1.6875 15.75V7.31305Z"
                          fill="#6A6A6A"
                        />
                      </svg>
                    </div>
                  </div>
                </>
              ) : (<>
                <div className="flex flex-col flex-1 gap-1">
                  <p className="text-xs font-semibold text-grey_700">Date</p>
                  <div className="flex w-full justify-between border-[1.5px] py-2 px-4 rounded-lg items-center border-grey/50">
                    <input
                      type="date"
                      value={startDate} // Correctly formatted value
                      onChange={(e) => setStartDate(e.target.value)} // Updates state on change
                      placeholder="2024-12-23"
                      min={new Date().toISOString().split("T")[0]}
                      className={" outline-none w-full "}
                    />
                  </div>
                </div>
              </>)
            }

          </div>
          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="flex  gap-x-5">
              <CusotmInputField
                type={"time"}
                icon={"calendar"}
                name={"startTime"}
                selectable={false}
                title={"Start Time"}
                valuesObj={classObj}
                // status={allowedEdit}
                setValue={setClassObj}
                value={classObj.startTime}
              />
              <CusotmInputField
                type={"time"}
                icon={"cake"}
                name={"endTime"}
                title={"End Time"}
                selectable={false}
                // status={allowedEdit}
                valuesObj={classObj}
                setValue={setClassObj}
                value={classObj.endTime}
              />


            </div>
            {
              event.groupID ? (
                <div className="flex flex-2 py-1 flex-col gap-2">
                  <p className="text-sm  file: text-black">Update Series </p>
                  <div className="flex items-center justify-between gap-3 px-3 py-2 border-[1.5px] rounded-lg  border-grey/30">

                    <input
                      type="checkbox"
                      checked={eventType} // Checkbox reflects the state
                      onChange={() => setEventType(!eventType)} // Toggle state on click
                    />
                    <span className="text-xs">Check this to update all series</span>
                  </div>
                </div>
              ) : ""
            }
          </div>
                     <div className="flex items-center gap-3 flex-col">
             {event?.meetingUrl && event?.meetingUrl.trim() !== "" && (
               <a
                 href={fullMeetingUrl}
                 target="_blank"
                 rel="noopener noreferrer"
                 className="w-full"
               >
                 <div className="flex items-center justify-center w-full py-2 text-center rounded-md bg-[#6A00FF] hover:bg-[#007EEA] transition-colors duration-200">
                   <img src={meet} alt="meet img" className="w-4 h-4 mr-2" />
                   <p className="text-sm text-white">Join Meeting</p>
                 </div>
               </a>
             )}
           </div>

          {loading && <div><Loader /> </div>}

          {!loading &&
            <div className="flex items-center gap-3">
              <div
                onClick={handleUpdateClass}
                className="flex items-center justify-center w-full py-2 text-center rounded-md border border-[#0B1053]"
              >
                <p className="text-sm text-[#0B1053]">Save Changes</p>
              </div>
            </div>
          }

          {!loading &&
            <div className="flex items-center gap-3">
              <div
                onClick={handleCancelMeeting}
                className="flex items-center justify-center w-full py-2 text-center rounded-md border border-[#0B1053]"
              >
                <p className="text-sm text-[#0B1053]">Cancel Meeting</p>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  );
}
