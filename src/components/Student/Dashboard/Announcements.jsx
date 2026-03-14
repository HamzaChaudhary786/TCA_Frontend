import React from "react";
import { RxDotFilled } from "react-icons/rx";
import { useStudent } from "../../../context/StudentContext";
import { getAllAnnouncements } from "../../../api/ForAllAPIs";
import { useQuery } from "@tanstack/react-query";
import Loader from "../../../utils/Loader";
import { useGetAnnoucementByUserType } from "../../../api/Teacher/Annoucement";

const Announcements = () => {

  const { setAllAnnouncements, studentLogedIn } = useStudent();
  const { announcementByUsertype, isLoading } = useGetAnnoucementByUserType()


  const Announcement = ({ item }) => {
    return (
      <div className="flex px-2 py-1 text-xs w-full ">

        <div className="flex flex-col gap-3 bg-grey_600/10 w-full p-4 rounded-2xl">
          {/* <RxDotFilled /> */}
          <div className="flex flex-col sm:flex-row justify-between items-center w-full">
            <div className="font-bold">{item.title}  </div>
            <div>{new Date(item.date).toLocaleString()}</div>
          </div>
          <p align="center">
            {item.description}

          </p>
        </div>

      </div>
    );
  };

  return (
    <div className="flex flex-col flex-1 gap-2">
      <div className="flex w-full">
        <p className="flex text-lg font-medium mt-[0.25rem] sm:mt-[0rem]">📢Announcemnets</p>
      </div>
      <div className="flex flex-col w-full px-6 bg-white h-80 overflow-y-auto register-scrollbar border-t-4 rounded-lg md:py-4 border-t-[#0B1053">

        {announcementByUsertype?.map((item) => <Announcement item={item} />)}
        {announcementByUsertype?.length == 0 && <div>No Announcements to display</div>}

      </div>
    </div>
  );
};

export default Announcements;
