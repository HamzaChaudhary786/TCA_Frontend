import React, { useEffect, useRef, useState } from "react";
import moment from "moment";
import ConfirmModal from "./ConfirmModal";
import meet from "../../../../../../assets/meet.png";
import IMAGES from "../../../../../../assets/images";
import useClickOutside from "../../../../../../hooks/useClickOutlise";

import { GoArrowRight } from "react-icons/go";
import { useStudent } from "../../../../../../context/StudentContext";

export default function ViewEventDetailsModal({
  open,
  setopen,
  event,
  setevents,
}) {
  const [confirmDeleteModalOpen, setconfirmDeleteModalOpen] = useState(false);
  //   const { setAlert } = useAlert();
  const ref = useRef(null);
  const eventNameRef = useRef();
  useClickOutside(ref, () => setopen(false));
  const [isOutside, setisOutside] = useState(false);
  const [editingName, seteditingName] = useState(false);
  const [isYAxisOutside, setisYAxisOutside] = useState(false);
  const [isMeetingTime, setIsMeetingTime] = useState(false);

  const handleDeleteEvent = () => {
    // deleteEvent({ eventId: event.id })
    //   .then((res) => {
    //     setAlert("Event deleted successfully", "success");
    //     setevents((eve) => eve.filter((e) => e.id != event.id));
    //   })
    //   .catch((err) => {});
    console.log("dell event method");
  };

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

  const { setMeetingStart } = useStudent();

  useEffect(() => {

    let nowTime = new Date();
    let eventTime = new Date(event.startTime);
    let eventEndTime = new Date(event.endTime);

    if (eventTime.getMonth() == nowTime.getMonth()) {
      if (eventTime.getDate() == nowTime.getDate()) {
        if (eventTime.getTime() < nowTime.getTime() && nowTime.getTime() < eventEndTime.getTime()) {
          setIsMeetingTime(true);
          setMeetingStart({ start: true, event: event })
        }
      }
    }

  }, []);

  const handleJoinMeeting = () => {
    console.log("meeting joining handler!");
  };

  return (
    <div
      onClick={() => { }}
      ref={ref}
      // w-[400px]ml-96
      className={`fixed z-10 mt-10 bg-white p-8 w-[400px] text-black rounded-xl ml-[13rem] ${open ? "" : "hidden"
        }`}
      style={
        isOutside
          ? {
            boxShadow: "0px 4px 10px 0px #0000001F",
            right: 0,
            top: isYAxisOutside ? "-150px" : "70px",
          }
          : {
            boxShadow: "0px 4px 10px 0px #0000001F",
            left: 0,
            top: isYAxisOutside ? "-150px" : "70px",
          }
      }
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
      <div className="flex gap-2">
        <div className="flex flex-col w-full gap-4">
          <div className="flex items-center justify-between">
            <div className="flex w-[fit] gap-2 items-center">
              <p
                className={`text-xl font-semibold cursor-text ${editingName ? "border p-3 bg-custom-light-1 rounded-lg" : ""
                  }`}
                onClick={(e) => e.stopPropagation()}
                ref={eventNameRef}
                contentEditable={editingName}
                dangerouslySetInnerHTML={{ __html: event.subject }}
              />
            </div>
            <div className="flex items-center gap-2">
              <img
                src={IMAGES.CloseIcon}
                className="w-[15px] h-[15px]"
                onClick={(e) => {
                  e.stopPropagation();
                  setopen(false);
                }}
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex flex-col flex-1 gap-1">
              <p className="text-xs font-semibold text-grey_700">Instructor</p>
              <div className="flex justify-between border-[1.5px] py-2 px-4 rounded-lg w-full items-center border-grey/50">
                <p className="text-sm text-custom-gray-3">{event.teacher.teacherID.name}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex flex-col flex-1 gap-1">
              <p className="text-xs font-semibold text-grey_700">Date</p>
              <div className="flex justify-between border-[1.5px] py-2 px-4 rounded-lg w-full items-center border-grey/50">
                <p className="text-sm text-custom-gray-3">
                  {moment.utc(event.start).format("DD MMMM, YYYY")}
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
          </div>
          <div className="flex items-center gap-3">
            <div className="flex flex-col gap-1">
              <p className="text-xs font-semibold text-grey_700">Start Time</p>
              <div className="flex items-center justify-between gap-3 px-3 py-2 border-[1.5px] rounded-lg w-36 border-grey/30">
                <p className="text-sm text-custom-gray-3">
                  {moment.utc(event.start).tz("Asia/Karachi").format("hh:mm a")}                </p>
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 19 19"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M9.5 18.25C4.66738 18.25 0.75 14.3326 0.75 9.5C0.75 4.66738 4.66738 0.75 9.5 0.75C14.3326 0.75 18.25 4.66738 18.25 9.5C18.25 14.3326 14.3326 18.25 9.5 18.25ZM16.5 9.5C16.5 7.64349 15.7625 5.86301 14.4497 4.55025C13.137 3.2375 11.3565 2.5 9.5 2.5C7.64349 2.5 5.86301 3.2375 4.55025 4.55025C3.2375 5.86301 2.5 7.64349 2.5 9.5C2.5 11.3565 3.2375 13.137 4.55025 14.4497C5.86301 15.7625 7.64349 16.5 9.5 16.5C11.3565 16.5 13.137 15.7625 14.4497 14.4497C15.7625 13.137 16.5 11.3565 16.5 9.5ZM13 8.625C13.2321 8.625 13.4546 8.71719 13.6187 8.88128C13.7828 9.04538 13.875 9.26794 13.875 9.5C13.875 9.73207 13.7828 9.95463 13.6187 10.1187C13.4546 10.2828 13.2321 10.375 13 10.375H10.375C9.4125 10.375 8.625 9.5875 8.625 8.625V5.125C8.625 4.89294 8.71719 4.67038 8.88128 4.50628C9.04538 4.34219 9.26794 4.25 9.5 4.25C9.73207 4.25 9.95463 4.34219 10.1187 4.50628C10.2828 4.67038 10.375 4.89294 10.375 5.125V8.625H13Z"
                    fill="#6A6A6A"
                  />
                </svg>
              </div>
            </div>
            <div className="mt-5">
              <p className="mx-1">
                <GoArrowRight className="text-grey/70" />{" "}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-xs font-semibold text-grey_700">End Time </p>
              <div className="flex items-center justify-between gap-3 px-3 py-2 border-[1.5px] rounded-lg w-36 border-grey/30">
                <p className="text-sm text-custom-gray-3">
                  {moment.utc(event.end).tz("Asia/Karachi").format("hh:mm a")}
                </p>
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 19 19"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M9.5 18.25C4.66738 18.25 0.75 14.3326 0.75 9.5C0.75 4.66738 4.66738 0.75 9.5 0.75C14.3326 0.75 18.25 4.66738 18.25 9.5C18.25 14.3326 14.3326 18.25 9.5 18.25ZM16.5 9.5C16.5 7.64349 15.7625 5.86301 14.4497 4.55025C13.137 3.2375 11.3565 2.5 9.5 2.5C7.64349 2.5 5.86301 3.2375 4.55025 4.55025C3.2375 5.86301 2.5 7.64349 2.5 9.5C2.5 11.3565 3.2375 13.137 4.55025 14.4497C5.86301 15.7625 7.64349 16.5 9.5 16.5C11.3565 16.5 13.137 15.7625 14.4497 14.4497C15.7625 13.137 16.5 11.3565 16.5 9.5ZM13 8.625C13.2321 8.625 13.4546 8.71719 13.6187 8.88128C13.7828 9.04538 13.875 9.26794 13.875 9.5C13.875 9.73207 13.7828 9.95463 13.6187 10.1187C13.4546 10.2828 13.2321 10.375 13 10.375H10.375C9.4125 10.375 8.625 9.5875 8.625 8.625V5.125C8.625 4.89294 8.71719 4.67038 8.88128 4.50628C9.04538 4.34219 9.26794 4.25 9.5 4.25C9.73207 4.25 9.95463 4.34219 10.1187 4.50628C10.2828 4.67038 10.375 4.89294 10.375 5.125V8.625H13Z"
                    fill="#6A6A6A"
                  />
                </svg>
              </div>
            </div>
          </div>
          {event?.meetingUrl && (
            <div className="flex items-center gap-3">
              <a
                href={event.meetingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full"
              >
                <button className="flex items-center justify-center w-full py-2 text-center rounded-md bg-[#6A00FF] hover:bg-[#007EEA] transition-colors">
                  <img src={meet} alt="meet img" className="w-4 h-4 mr-2" />
                  <p className="text-sm text-white">
                    Join Meeting
                  </p>
                </button>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
