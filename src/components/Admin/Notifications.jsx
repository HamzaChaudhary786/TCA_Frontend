import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import profile from "../../assets/profile.png";
import pdf from "../../assets/pdf.png";
import { GoDotFill } from "react-icons/go";
import { useQuery } from "@tanstack/react-query";
import { getAllNotifications } from "../../api/Admin/NotificationApi";
import moment from 'moment';
const Notifications = ({ onclose, dashboard }) => {


  const { data } = useQuery({ queryKey: ["chat"], queryFn: getAllNotifications });
  console.log("notificationas in admin are : ", data);

  const Notification = ({ item }) => {

    const [moredetails, setMoredetails] = useState(false)

    const isNew = moment().diff(moment(item.createdAt), 'minutes') < 5; // Considered 'new' within 5 mins


    return (
      <div className={`flex flex-col gap-2 py-2 w-full `}>

        <div
          className={`flex items-start p-4 border-b border-gray-200 ${isNew ? 'bg-blue-50 animate-pulse' : 'bg-white'
            }`}
        >
          {/* Indicator for unread notifications */}
          {!item.isRead && (
            <div className="w-3 h-3 bg-red-500 rounded-full mt-2 mr-2"></div>
          )}

          <div className="flex-1">
            <p className="text-gray-700 text-sm">
              {item.message}
            </p>
            <span className="text-xs text-gray-500">
              {moment(item.createdAt).fromNow()} {/* e.g., "Just now" or "2 minutes ago" */}
            </span>
          </div>
        </div>


        {/* <div className="flex w-full gap-2">
          <img src={profile} alt="" className="h-10 w-11" />
          <div className="flex flex-col w-full cursor-pointer" onClick={() => setMoredetails(!moredetails)}>
            <div className="flex justify-between gap-2 text-grey_700">
              <div className="flex gap-2">
                <p className="text-sm font-medium">Phonix Baker</p>
                <p className="text-xs">Just Now</p>
              </div>
              <GoDotFill color={true ? "green" : "grey"} />
            </div>
            <div className="flex text-xs">
              <p>
                Added an Assignment{" "}
                <span className="text-maroon"> Physics class </span>{" "}
              </p>
            </div>
          </div>
        </div>
        {moredetails ? (
          <div className="flex items-center gap-2 ml-10">
            <img src={pdf} alt="" className="w-12 h-12" />
            <div className="text-grey_700">
              <p className="text-sm font-medium">Assignment 1.pdf</p>
              <p className="text-xs">720 KB</p>
            </div>
          </div>
        ) : (
          ""
        )} */}
      </div >
    );
  };

  return (
    <div className={` ${!dashboard ? "mt-10" : "mt-0"} z-10 fixed flex bottom-0 px-5 overflow-y-auto overflow-x-hidden no-scrollbar bg-white shadow-xl top-20 right-0 md:right-2 md:w-96 w-72`}>
      <div className="flex flex-col w-full font-poppins">
        <div className="flex justify-between py-5 ">
          <p className="text-lg font-semibold">Announcements</p>
          <IoClose onClick={onclose} className="cursor-pointer" />
        </div>
        <div className="w-full">
          {data && data?.map((item) => {
            return <Notification key={item._id} item={item} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
