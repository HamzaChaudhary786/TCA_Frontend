import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import profile from "../../assets/images/profile.svg";
import pdf from "../../assets/pdf.png";
import { GoDotFill } from "react-icons/go";
import { useGetAnnoucementByUserType } from "../../api/Teacher/Annoucement";
import { useGetNotifications } from "../../api/Teacher/NotificationApi";
import moment from "moment";


const Notifications = ({ onclose, dashboard }) => {
  // State to track the active tab
  const [activeTab, setActiveTab] = useState("notification");

  const { notifications, isLoading: notificationsLoading } = useGetNotifications();


  // Notification Component
  const Notification = ({ data }) => {
    const [moredetails, setMoredetails] = useState(false);
    return (
      <div className={`flex flex-col gap-2 py-2 w-full `}>
        <div className="flex w-full gap-2">
          <img src={profile} alt="" className="h-10 w-11" />
          <div
            className="flex flex-col w-full cursor-pointer"
            onClick={() => setMoredetails(!moredetails)}
          >
            <div className="flex justify-between gap-2 text-grey_700">
              <div className="flex gap-2">
                <p className="text-sm font-medium">{data.userID?.name || "Student"}</p>
                <p className="text-xs">{moment(data.createdAt).fromNow()}</p>
              </div>
              <GoDotFill color={!data.isRead ? "green" : "grey"} />
            </div>
            <div className="flex text-xs">
              <p>
                {data.message}{" "}
                <span className="text-[#0B1053]"> {data.subjectName} {data.classroomName} </span>{" "}
              </p>
            </div>
          </div>
        </div>
        {moredetails && data.file && (
          <div className="flex items-center gap-2 ml-10">
            <img src={pdf} alt="" className="w-12 h-12" />
            <div className="text-grey_700">
              <a href={data.file.url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium hover:underline">
                {data.file.name}
              </a>
              {/* <p className="text-xs">720 KB</p> */}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Announcement Component
  const Announcement = () => {

    const { announcementByUsertype, isLoading } = useGetAnnoucementByUserType()

    const [activeAnnouncement, setActiveAnnouncement] = useState(null); // Track the active announcement ID

    const handleToggleDetails = (id) => {
      setActiveAnnouncement((prevId) => (prevId === id ? null : id)); // Toggle between opening and closing
    };

    return (
      <div className={`py-2 w-full h-full`}>
        <div className=" w-full ">
          <div className="space-y-6 p-3 bg-gray-50 rounded-lg shadow-lg max-w-4xl mx-auto"> {/* Container styles */}
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">📢 Announcements</h2>
            {announcementByUsertype && announcementByUsertype.length > 0 ? announcementByUsertype?.map((announcement) => (
              <div
                key={announcement.id}
                className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300" // Card styles
              >
                {/* Announcement Header */}
                <div
                  className="p-5 cursor-pointer flex flex-col justify-between items-center hover:bg-gray-50 transition-colors duration-200" // Header styles
                  onClick={() => handleToggleDetails(announcement.id)}
                >
                  <div>
                    <p className="text-xs text-center font-medium text-indigo-600 uppercase tracking-wide">{announcement.type}</p>
                    <h3 className="text-xl font-semibold text-gray-900 mt-1">{announcement.title}</h3>
                  </div>
                  <p className="text-sm text-gray-500 whitespace-nowrap">{new Date(announcement.date).toLocaleString()}</p>
                </div>

                {/* Announcement Details */}
                {activeAnnouncement === announcement.id && (
                  <div className="p-5 bg-gray-50 border-t border-gray-200"> {/* Details styles */}
                    <p className="text-sm text-gray-700 leading-relaxed">{announcement.description}</p>
                  </div>
                )}
              </div>
            )) : <p className="text-center text-gray-500 py-8">No announcements have been created</p>}
          </div>
        </div>

      </div>
    );
  };

  return (
    <div
      className={` ${!dashboard ? "mt-10" : "mt-0"} z-10 fixed flex h-full px-5 md:overflow-auto custom-scrollbar bg-white shadow-xl top-0 right-0 md:right-2 w-80 md:w-96`}
    >
      <div className="flex flex-col w-full font-poppins">
        <div className="flex justify-between py-5 ">
          {/* Toggle Buttons */}
          <div className="p-3 border-2 border-black/10 rounded-2xl">
            <button
              className={`px-3 py-1 ${activeTab === "notification" ? "bg-[#0B1053] text-white rounded-3xl" : "bg-gray-200"
                }`}
              onClick={() => setActiveTab("notification")}
            >
              Notification
            </button>
            <button
              className={`px-3 py-1 ${activeTab === "announcement" ? "bg-[#0B1053] text-white rounded-3xl" : "bg-gray-200"
                }`}
              onClick={() => setActiveTab("announcement")}
            >
              Announcement
            </button>
          </div>
          <IoClose onClick={onclose} className="cursor-pointer" />
        </div>
        <div className="w-full">
          {activeTab === "notification" ? (
            notificationsLoading ? (
              <p className="text-center text-gray-500 py-4">Loading notifications...</p>
            ) : notifications && notifications.length > 0 ? (
              notifications.map((notification) => (
                <Notification key={notification.id} data={notification} />
              ))
            ) : (
              <p className="text-center text-gray-500 py-4">No notifications</p>
            )
          ) : (
            <Announcement />
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
