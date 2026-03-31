import React, { useEffect, useRef, useState } from "react";

import moment from "moment/moment";
import Loader from "../../../utils/Loader";
import IMAGES from "../../../assets/images";
import profile from "../../../assets/profile.png";

import { io } from "socket.io-client";
import { toast } from "react-toastify";
import { IoClose } from "react-icons/io5";
import { RiAttachment2 } from "react-icons/ri";
import { BsFillSendFill } from "react-icons/bs";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "../../../context/UserContext";
import { BACKEND_URL_SOCKET } from "../../../constants/api";
import { getChatsRoomData, getMyChats, getTeachersForChat } from "../../../api/UserApis";
import { useBlur } from "../../../context/BlurContext";
import useClickOutside from "../../../hooks/useClickOutlise";


const RecentMessages = ({ onclose, dashboard }) => {


  const ref = useRef(null);

  const { toggleBlur } = useBlur(); // Using toggleBlur for blur control



  useClickOutside(ref, () => {
    onclose()
  });

  const [loading, setLoading] = useState(false);
  const [queryData, setQueryData] = useState(null);
  const [groupActive, setGroupActive] = useState(false);
  const [enableChatQuery, setEnableChatQuery] = useState(true);
  const [individualActive, setIndividualActive] = useState(true);
  const [selectedChatParticipants, setSelectedChatParticipants] = useState([]);

  const [msgArray, setMsgArray] = useState([]);
  const [msgArrayDirect, setMsgArrayDirect] = useState([]);
  const [localSocket, setLocalSocket] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);
  const [showDirectChat, setShowDirectChat] = useState(false);
  const [subTab, setSubTab] = useState("recent"); // "recent" or "teachers"


  const { socketContext, setSocketContext, userData } = useUser();

  const toggleGroupActive = () => {
    setGroupActive(!groupActive);
    setIndividualActive(false);
  };

  const toggleIndividualActive = () => {
    setIndividualActive(!individualActive);
    setGroupActive(false);
  };

  const handleSendMessage = (msgstr) => {
    if (msgstr == "") {
      toast.error("Cannot send empty message!")
    } else {
      const messageObj = {
        sentBy: userData.id,
        time: new Date(),
        type: "text",
        message: msgstr,
      };

      // Optimistic update
      if (showFullChat) {
         setMsgArray((prev) => [...prev, { ...messageObj, sentBy: userData }]);
      } else if (showDirectChat) {
         setMsgArrayDirect((prev) => [...prev, { ...messageObj, sentBy: userData }]);
      }
      
      if (localSocket) {
        if (showFullChat) {
          localSocket.emit("message", { room: selectedChat?.id, message: messageObj });
        } else if (showDirectChat) {
          localSocket.emit("message", { members: [userData?.id, selectedChat?.id], message: messageObj });
        }
      }
    }
  }

  const [showFullChat, setShowFullChat] = useState(false);

  const handleShowFullChat = () => {
    // close full chat modal
    console.log("clicking full chat");
    setShowFullChat(!showFullChat);
  }

  const openFullchat = async (data) => {
    setLoading(true);
    setShowDirectChat(false);
    setShowFullChat(true);
    let conn = io(`${BACKEND_URL_SOCKET}/chatroom`);
    setSocketContext(conn);
    setLocalSocket(conn);
    setSelectedChat(data);
    setSelectedChatParticipants(data.participants);
    conn.emit("join", { room: data.id });
    const result = await getChatsRoomData(data.id);
    //console.log("result form sever is : ", result);
    setMsgArray(result.messages);
    setLoading(false);
  }

  const openDirectChat = async (data) => {
    setLoading(true);
    setShowFullChat(false);
    setShowDirectChat(true);
    const conn = io(`${BACKEND_URL_SOCKET}/one-to-one`);
    setLocalSocket(conn);
    setSelectedChat(data);
    conn.emit("join", [userData.id, data.id]);
    conn.emit("get-chats", [userData.id, data.id]);
    conn.on("chat-history", (chats) => {
      setSelectedChatParticipants(chats?.participants);
      setMsgArrayDirect(chats?.messages);
    });
    setLoading(false);
  }

  const getParticipantData = (pid) => {
    if (pid === userData.id) return userData;
    let user = {};
    selectedChatParticipants.forEach((item) => {
      if (item.id === pid) {
        user = item;
      }
    })
    return user;
  }



  useEffect(() => {
    if (localSocket) {
      localSocket.on("message", (data) => {
        // If the message is from us, we already added it optimistically
        if (data.message.sentBy === userData.id) return;
        
        let user = getParticipantData(data.message.sentBy);
        
        if (showFullChat) {
          setMsgArray((prev) => [...prev, { ...data.message, sentBy: user }]);
        } else if (showDirectChat) {
          setMsgArrayDirect((prev) => [...prev, { ...data.message, sentBy: user }]);
        }
      })
    }
  }, [localSocket, showFullChat, showDirectChat, userData.id]);

  const Message = ({ data, onpress }) => {
    return (
      <div className={`flex flex-col gap-2 py-2 `} onClick={onpress}>
        <div className="flex gap-2">
          <img src={profile} alt="" className="h-10 w-11" />
          <div
            className="flex flex-col flex-1 cursor-pointer"
            onClick={() => { }}
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
        {msg?.sentBy?.id !== userData.id ?
          <div className="flex items-start gap-4 py-2">
            <div>
              <img src={msg.sentBy.profilePic || IMAGES.ProfilePic} alt="alt" className="w-10 h-10 rounded-full object-cover" />
            </div>
            <div className="flex flex-col gap-1 w-72">
              <div className="flex justify-between items-center text-sm">
                <p className="font-medium ">{msg.sentBy.name} </p>
                <p className="">{moment(msg.time).format("hh:mm a")} </p>
              </div>
              <div className="text-sm text-[#101828] flex font-medium  bg-[#F2F4F7] flex-wrap px-2 py-3 rounded-tr-lg rounded-br-lg rounded-bl-lg">
                <p>{msg.message}</p>
              </div>
            </div>
          </div>
          :
          <div className="py-2">
            <div className="flex items-start gap-4 justify-end">
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center text-sm">
                  <p className="font-medium ">You</p>
                  <p className="">{moment(msg.time).format("dddd hh:mm a")} </p>
                </div>
                <div className="text-sm text-white flex font-medium w-60 bg-[#0B1053] flex-wrap px-2 py-3 rounded-br-lg rounded-bl-lg rounded-tl-lg">
                  <p>{msg.message} </p>
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    </>
  }

  const FullChat = ({ onclose, data, type }) => {
    const [msgstr, setmsgStr] = useState("");


    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleSendMessage(msgstr);
        setmsgStr("");
      }
    }

    const currentMsgArray = type === "group" ? msgArray : msgArrayDirect;

    return <>
      <div className="w-72 sm:w-96 flex flex-col justify-between pb-5 bg-white shadow-xl z-50 pointer-events-auto" >

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
              {currentMsgArray.map((item, index) => {
                return <GroupMsg key={index} msg={item} />
              })}
            </div>
          }

        </div>
        <div className="px-5 sm:px-10">
          <div className="flex items-center gap-2">
            <input type="text" value={msgstr} onChange={(e) => { setmsgStr(e.target.value) }} onKeyDown={handleKeyDown} placeholder="Message" className="flex-1 border-black/20 border rounded-lg py-2 px-2 outline-none w-full" />
            <RiAttachment2 className=" text-[#0B1053] cursor-pointer shrink-0" size={24} />
            <BsFillSendFill className="bg-[#0B1053] text-white p-2 rounded-md cursor-pointer shrink-0" size={34} onClick={() => { handleSendMessage(msgstr); setmsgStr(""); }} />
          </div>
        </div>

      </div>
    </>
  }

  const chatquery = useQuery({ queryKey: ["chat"], queryFn: getMyChats, staleTime: 30000, enabled: enableChatQuery });
  const teacherquery = useQuery({ queryKey: ["teachers-for-chat"], queryFn: getTeachersForChat, staleTime: 30000, enabled: individualActive });

  useEffect(() => {
    console.log("now rendering navbar")
    if (!queryData) {
      setEnableChatQuery(true);
    }
    if (!chatquery.isPending) {
      setQueryData(chatquery?.data);
      //console.log("query data is : ", chatquery.data);
      setEnableChatQuery(false);
    }
  }, [chatquery.isPending])

  return (
    <div ref={ref} className="fixed  right-0 z-50 flex flex-row-reverse items-start pointer-events-none h-screen">
      <div
        className={` ${!dashboard ? "mt-10" : "mt-0"
          } flex flex-col px-5 overflow-auto bg-white border-l border-black/20 shadow-xl sm:w-96 w-72 pointer-events-auto h-full`}
      >
        <div className={`flex flex-col flex-1 font-poppins`}>
          <div className="flex justify-between py-5 ">
            <p className="text-lg font-semibold">Recent Messages</p>
            <IoClose onClick={onclose} className="cursor-pointer" />
          </div>
          <div className="pb-2 border-b rounded-sm border-black/10">
            <div className="flex justify-between gap-2 p-1 rounded-md bg-[#EAECF0] border-2 border-[#00000010]">
              <div
                onClick={() => { }}
                className={`cursor-pointer flex items-center justify-center flex-1 gap-2 ${individualActive ? "bg-white" : "transparent"
                  } rounded-md`}
              >
                <p className="">Recent</p>
              </div>
            </div>
          </div>
          {individualActive && (
             <div className="flex gap-4 py-2 border-b border-black/5 justify-around">
               <p 
                className={`text-sm cursor-pointer ${subTab === "recent" ? "text-[#0B1053] font-bold border-b-2 border-[#0B1053]" : "text-grey"}`}
                onClick={() => setSubTab("recent")}
               >Group Chats</p>
               <p 
                className={`text-sm cursor-pointer ${subTab === "teachers" ? "text-[#0B1053] font-bold border-b-2 border-[#0B1053]" : "text-grey"}`}
                onClick={() => setSubTab("teachers")}
               >Teachers</p>
            </div>
          )}

          {chatquery.isPending && subTab === "recent" && <div className=""> <Loader /> </div>}
          {teacherquery.isPending && subTab === "teachers" && <div className=""> <Loader /> </div>}

          {!chatquery.isPending && subTab === "recent" &&
            <div className="py-2">
              {chatquery?.data?.map((item) => {
                return <Message data={item} onpress={() => { openFullchat(item) }} />;
              })}
            </div>
          }

          {!teacherquery.isPending && subTab === "teachers" &&
            <div className="py-2">
              {teacherquery?.data?.map((item) => {
                return <Message data={item} onpress={() => { openDirectChat(item) }} />;
              })}
            </div>
          }

        </div>
      </div>
      {showFullChat && <FullChat onclose={() => setShowFullChat(false)} data={selectedChat} type="group" />}
      {showDirectChat && <FullChat onclose={() => setShowDirectChat(false)} data={selectedChat} type="direct" />}
    </div>
  );
};

export default RecentMessages;
