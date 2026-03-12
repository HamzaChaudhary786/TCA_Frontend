import React, { useRef, useState } from "react";
import moment from "moment/moment";
import Loader from "../../../utils/Loader";
import profile from "../../../assets/images/ProfilePic.png";

import { IoClose } from "react-icons/io5";
import { useQuery } from "@tanstack/react-query";
import { getAllChatrooms, getChatroomData } from "../../../api/Admin/ChatroomApi";
import { getChatsRoomData, getMyChats } from "../../../api/UserApis";
import IMAGES from "../../../assets/images";
import { useBlur } from "../../../context/BlurContext";
import useClickOutside from "../../../hooks/useClickOutlise";


const RecentMessages = ({ onclose, dashboard }) => {

  const [msgArray, setMsgArray] = useState([]);
  const [loading, setLoading] = useState(false);
  const [groupActive, setGroupActive] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const [showFullChat, setShowFullChat] = useState(false);
  const [individualActive, setIndividualActive] = useState(true);


  const { data: groupChats, isPending: groupIsPending } = useQuery({ queryKey: ["chat"], queryFn: getAllChatrooms });
  const { data: individualChats, isPending: individualIsPending } = useQuery({ queryKey: ["individualChats"], queryFn: getMyChats });

  const toggleGroupActive = () => {
    setGroupActive(!groupActive);
    setIndividualActive(false);
  };

  const toggleIndividualActive = () => {
    setIndividualActive(!individualActive);
    setGroupActive(false);
  };


  const openFullchat = async (chatData, isGroup = false) => {
    setLoading(true);
    setShowFullChat(true);
    console.log("selected data is : ", chatData);
    setSelectedChat(chatData);
    let result;
    if (isGroup) {
      result = await getChatroomData(chatData?._id);
      setMsgArray(result[0]?.messages || []);
    } else {
      result = await getChatsRoomData(chatData?._id);
      setMsgArray(result?.messages || []);
    }
    console.log("result form server is : ", result);
    setLoading(false);
  }
  // close full chat modal
  const handleShowFullChat = () => {
    console.log("clicking full chat");
    setShowFullChat(!showFullChat);
  }

  const groupData = [
    {
      id: 1,
      name: "Physics Class",
      message: "my recent message",
      time: "00:21",
      img: "profile",
    },
    {
      id: 2,
      name: "Our Class",
      message: "my recent message",
      time: "00:21",
      img: "profile",
    },
    {
      id: 3,
      name: "Grirls Class",
      message: "my recent message",
      time: "00:21",
      img: "profile",
    },
    {
      id: 4,
      name: "Chemistry Class",
      message: "my recent message",
      time: "00:21",
      img: "profile",
    },
    {
      id: 5,
      name: "Announcements",
      message: "my recent message",
      time: "00:21",
      img: "profile",
    },
  ];

  const ref = useRef(null); // Reference to the modal container
  const { toggleBlur } = useBlur(); // Access toggleBlur from the context

  // Use the hook with the modal's reference and callback function
  useClickOutside(ref, () => {
    onclose()
  });

  const Message = ({ data, onpress }) => {
    return (
      <div className={`flex flex-col gap-2 py-2 `} onClick={onpress}>
        <div className="flex gap-2">
          <img src={profile} alt="" className="h-10 w-11" />
          <div
            className="flex flex-col flex-1 cursor-pointer"
          >
            <div className="flex justify-between gap-2 text-grey_700">
              <div className="flex gap-2">
                <p className="text-sm font-medium">{data?.name}</p>
              </div>
            </div>
            <div className="flex justify-between flex-1 text-xs">
              <p>{data?.lastMsg?.message}</p>
              <p className="text-xs">{moment(data?.lastMsg?.time).format("hh:mm a")}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const GroupMsg = ({ msg }) => {
    return <>
      <div className="px-10 py-5">
        <div className="flex items-start gap-4 py-2">
          <div className="h-10 w-10 rounded-full">
            <img src={msg?.sentBy?.profilePic || IMAGES.ProfilePic} alt="alt" className="rounded-full object-cover" />
          </div>
          <div className="flex flex-col gap-1 w-72">
            <div className="flex justify-between items-center text-sm">
              <p className="font-medium ">{msg?.sentBy?.name} </p>
              <p className="">{moment(msg?.time).format("dddd hh:mm a")} </p>
            </div>
            <div className="text-sm text-[#101828] flex font-medium  bg-[#F2F4F7] flex-wrap px-2 py-3 rounded-tr-lg rounded-br-lg rounded-bl-lg">
              <p>{msg?.message}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  }

  const FullChat = ({ onclose, data }) => {
    return <>
      <div className="sm:w-96 w-72 top-20 flex flex-col justify-between pb-10 right-0 absolute bg-white z-50 h-[90vh]">

        <div className="h-full">
          <div className="shadow-xl">
            <div className="flex justify-between px-10 py-5 items-center">
              <div className="flex gap-2 items-center">
                <img src={IMAGES.ProfilePic} alt="" className="h-10 w-10 rounded-full object-cover" />
                <p>{data.name} </p>
              </div>
              <IoClose onClick={onclose} className="cursor-pointer" />
            </div>
          </div>


          {loading ? <div><Loader /></div> :
            <div className="h-[70vh] overflow-y-auto register-scrollbar">
              {msgArray.length == 0 && <div className="py-4 justify-center flex">No messages to display </div>}
              {msgArray.map((item, index) => {
                return <GroupMsg key={index} msg={item} />
              })}
            </div>
          }
        </div>
      </div>
    </>
  }


  return (
    <>
      <div
        className={` ${!dashboard ? "mt-10" : "mt-0"
          } fixed z-10 flex h-screen px-5 overflow-auto bg-white border-r border-black/20  shadow-xl top-20 ${showFullChat ? "right-96" : "right-0"} sm:w-96 w-72`}
        ref={ref}
      >
        <div className="flex flex-col flex-1 font-poppins">
          <div className="flex justify-between py-5 ">
            <p className="text-lg font-semibold">Recent Messages</p>
            <IoClose onClick={onclose} className="cursor-pointer" />
          </div>
          <div className="pb-2 border-b rounded-sm border-black/10">
            <div className="flex justify-between gap-2 p-1 rounded-md bg-[#EAECF0] border-2 border-[#00000010]">
              <div
                onClick={toggleIndividualActive}
                className={`cursor-pointer flex items-center justify-center flex-1 gap-2 ${individualActive ? "bg-white" : "transparent"
                  } rounded-md`}
              >
                <p className="">Recent</p>
              </div>
              <div
                onClick={toggleGroupActive}
                className={`cursor-pointer flex items-center justify-center flex-1 ${groupActive ? "bg-white" : "transparent"
                  } rounded-md py-1`}
              >
                <p className="">Group</p>
              </div>
            </div>
          </div>
          <div className="py-2">
            {(individualIsPending || groupIsPending) && <div><Loader /> </div>}
            {individualActive && !individualIsPending &&
              individualChats?.map((item) => {
                return <Message key={item._id} data={item} onpress={() => { openFullchat(item, false) }} />
              })}
            {groupActive && !groupIsPending &&
              groupChats?.map((item) => {
                return <Message key={item._id} data={item} onpress={() => { openFullchat(item, true) }} />
              })}
          </div>
        </div>
      </div>
      {showFullChat && <FullChat onclose={handleShowFullChat} data={selectedChat} />}
    </>
  );
};

export default RecentMessages;
