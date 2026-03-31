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
import { getChatsRoomData, getMyChats } from "../../../api/UserApis";
import { getParentsForChat, getStudentsForChat } from "../../../api/Teacher/chat";
import useClickOutside from "../../../hooks/useClickOutlise";
import { useBlur } from "../../../context/BlurContext";


const RecentMessages = ({ onclose, dashboard }) => {

  const [loading, setLoading] = useState(false);
  const [queryData, setQueryData] = useState(null);
  const [parentqueryData, setParentQueryData] = useState(null);
  const [studentQueryData, setStudentQueryData] = useState(null);
  const [groupActive, setGroupActive] = useState(false);
  const [showFullChat, setShowFullChat] = useState(false);
  const [enableChatQuery, setEnableChatQuery] = useState(true);
  const [enableParentChatQuery, setEnableParentChatQuery] = useState(true);
  const [enableStudentChatQuery, setEnableStudentChatQuery] = useState(true);
  const [individualActive, setIndividualActive] = useState(true);
  const [subTab, setSubTab] = useState("parents"); // "parents" or "students"
  const [selectedChatParticipants, setSelectedChatParticipants] = useState([]);

  const [msgArray, setMsgArray] = useState([]);
  const [msgArrayParent, setMsgArrayParent] = useState([]);
  const [localSocket, setLocalSocket] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);
  const [showParentChat, setShowParentChat] = useState(false);

  const { socketContext, setSocketContext, userData } = useUser();

  const containerRef = useRef(null);
  const msgEndRef = useRef(null);

  const { toggleBlur } = useBlur(); // Using toggleBlur for blur control

  useClickOutside(containerRef, () => {
    onclose()
  });

  const scrolltobottom = () => {
    msgEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const toggleGroupActive = () => {
    setGroupActive(!groupActive);
    setIndividualActive(false);
  };

  const toggleIndividualActive = () => {
    setIndividualActive(!individualActive);
    setGroupActive(false);
  };

  const handleSendMessage = (msgstr) => {
    const messageObj = {
      sentBy: userData.id,
      time: new Date(),
      type: "text",
      message: msgstr,
    };
    localSocket.emit("message", { room: selectedChat?.id, message: messageObj });
  }

  const handleSendMessageParent = (msgstr) => {
    const messageObj = {
      sentBy: userData.id,
      time: new Date(),
      type: "text",
      message: msgstr,
    };

    // Optimistic update
    setMsgArrayParent((prev) => [...prev, { ...messageObj, sentBy: userData }]);
    
    localSocket.emit("message", { message: messageObj, members: [userData?.id, selectedChat?.id] });
  }

  // close full chat modal
  const handleShowFullChat = () => {
    console.log("clicking full chat");
    setShowFullChat(!showFullChat);
  }

  // close full chat modal
  const handleShowParentChat = () => {
    console.log("clicking full chat");
    setShowParentChat(!showParentChat);
  }

  const openFullchat = async (data) => {
    setLoading(true);
    setShowParentChat(false);
    setShowFullChat(true);
    let conn = io(`${BACKEND_URL_SOCKET}/chatroom`);
    setSocketContext(conn);
    setLocalSocket(conn);
    setSelectedChat(data);
    setSelectedChatParticipants(data.participants);
    conn.emit("join", { room: data.id });
    const result = await getChatsRoomData(data.id);
    console.log("result form sever is : ", result);
    setMsgArray(result.messages);
    setLoading(false);
  }

  const openParentChat = async (data) => {
    setLoading(true);
    setShowFullChat(false);
    setShowParentChat(true);
    const conn = io(`${BACKEND_URL_SOCKET}/one-to-one`);
    setLocalSocket(conn);
    setSelectedChat(data);
    console.log("parent data is : ", data);
    conn.emit("join", [userData.id, data.id])
    console.log("join room emit")
    conn.emit("get-chats", [userData.id, data.id]);
    conn.on("chat-history", (chats) => {
      console.log("parent full chat values is ", chats);
      setSelectedChatParticipants(chats.participants);
      setMsgArrayParent(chats.messages);
    })

    setLoading(false);
  }

  const getParticipantData = (pid) => {
    let user = {};
    console.log("pid is : ", pid)
    console.log("selected partiicapntisn : ", selectedChatParticipants);
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
        console.log("message received : ", data);
        
        // If the message is from us, we already added it optimistically
        if (data.message.sentBy === userData.id) return;

        let user = getParticipantData(data.message.sentBy);
        
        // Check if it's for the current open chat (handles both namespaces)
        if (showFullChat) {
          setMsgArray((prev) => [...prev, { ...data.message, sentBy: user }]);
        } else if (showParentChat) {
          setMsgArrayParent((prev) => [...prev, { ...data.message, sentBy: user }]);
        }
      });
    }
  }, [localSocket, showFullChat, showParentChat, userData.id])

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

  const ChatMsgParent = ({ msg }) => {
    return <>
      <div className="px-10 py-5">
        {msg?.sentBy?.id !== userData.id ?
          <div className="flex items-start gap-4 py-2">
            <div>
              <img src={msg?.sentBy?.profilePic || IMAGES.ProfilePic} alt="alt" className="w-10 h-10 rounded-full object-cover" />
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
          :
          <div className="py-2">
            <div className="flex items-start gap-4 justify-end">
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center text-sm">
                  <p className="font-medium ">You</p>
                  <p className="">{moment(msg?.time).format("dddd hh:mm a")} </p>
                </div>
                <div className="text-sm text-white flex font-medium w-60 bg-maroon flex-wrap px-2 py-3 rounded-br-lg rounded-bl-lg rounded-tl-lg">
                  <p>{msg?.message} </p>
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    </>
  }

  const GroupMsg = ({ msg }) => {
    return <>
      <div className="px-10 py-5">
        {msg?.sentBy?.id !== userData.id ?
          <div className="flex items-start gap-4 py-2">
            <div>
              <img src={msg?.sentBy?.profilePic || IMAGES.ProfilePic} alt="alt" className="w-10 h-10 rounded-full object-cover" />
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
          :
          <div className="py-2">
            <div className="flex items-start gap-4 justify-end">
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center text-sm">
                  <p className="font-medium ">You</p>
                  <p className="">{moment(msg?.time).format("dddd hh:mm a")} </p>
                </div>
                <div className="text-sm text-white flex font-medium w-60 bg-maroon flex-wrap px-2 py-3 rounded-br-lg rounded-bl-lg rounded-tl-lg">
                  <p>{msg?.message} </p>
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    </>
  }

  const FullChat = ({ onclose, data }) => {
    const [msgstr, setmsgStr] = useState("");

    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleSendMessage(msgstr);
      }
    }

    return <>
      <div className="w-96 flex flex-col justify-between pb-5 bg-white shadow-xl z-50 pointer-events-auto">
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
              {msgArray.map((item, index) => {
                return <GroupMsg key={index} msg={item} />
              })}
            </div>
          }
        </div>
        <div ref={msgEndRef} />
        <div className="px-5 sm:px-10">
          <div className="flex items-center gap-2">
            <input type="text" value={msgstr} onChange={(e) => { setmsgStr(e.target.value) }} onKeyDown={handleKeyDown} placeholder="Message" className="flex-1 border-black/20 border rounded-lg py-2 px-2 outline-none w-full" />
            <RiAttachment2 className=" text-[#0B1053] cursor-pointer shrink-0" size={24} />
            <BsFillSendFill className="bg-[#0B1053] text-white p-2 rounded-md cursor-pointer shrink-0" size={34} onClick={() => { msgstr == "" ? toast.error("Cannot send an empty message") : handleSendMessage(msgstr); setmsgStr(""); }} />
          </div>
        </div>
      </div>
    </>
  }

  const ParentCHat = ({ data, onclose }) => {
    const [msgstr, setmsgStr] = useState("");

    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleSendMessageParent(msgstr);
      }
    }

    return <>
      <div className="sm:w-96 w-72 flex flex-col justify-between pb-5 bg-white shadow-xl z-50  pointer-events-auto">
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
              {msgArrayParent.map((item, index) => {
                return <ChatMsgParent key={index} msg={item} />
              })}
            </div>}
        </div>
        <div ref={msgEndRef} />
        <div className="px-5 sm:px-10">
          <div className="flex items-center gap-2">
            <input type="text" value={msgstr} onChange={(e) => { setmsgStr(e.target.value) }} onKeyDown={handleKeyDown} placeholder="Message" className="flex-1 border-black/20 border rounded-lg py-2 px-2 outline-none w-full" />
            <RiAttachment2 className=" text-[#0B1053] cursor-pointer shrink-0" size={24} />
            <BsFillSendFill className="bg-[#0B1053] text-white p-2 rounded-md cursor-pointer shrink-0" size={34} onClick={() => { msgstr == "" ? toast.error("Cannot send an empty message") : handleSendMessageParent(msgstr); setmsgStr(""); }} />
          </div>
        </div>
      </div>
    </>
  }

  const chatquery = useQuery({ queryKey: ["chat"], queryFn: getMyChats, staleTime: 30000, enabled: enableChatQuery });

  const parentchatquery = useQuery({ queryKey: ["parent-chat"], queryFn: getParentsForChat, staleTime: 30000, enabled: enableParentChatQuery });

  const studentchatquery = useQuery({ queryKey: ["student-chat"], queryFn: getStudentsForChat, staleTime: 30000, enabled: enableStudentChatQuery });

  useEffect(() => {
    console.log("now rendering navbar")
    if (!queryData) {
      setEnableChatQuery(true);
    }
    if (!parentqueryData) {
      setEnableParentChatQuery(true);
    }
    if (!studentQueryData) {
      setEnableStudentChatQuery(true);
    }
    if (!parentchatquery.isPending) {
      setParentQueryData(parentchatquery.data);
      setEnableParentChatQuery(false);
    }
    if (!studentchatquery.isPending) {
      setStudentQueryData(studentchatquery.data);
      setEnableStudentChatQuery(false);
    }
    if (!chatquery.isPending) {
      setQueryData(chatquery?.data);
      setEnableChatQuery(false);
    }
  }, [chatquery.isPending, parentchatquery.isPending, studentchatquery.isPending])

  return (
    <div ref={containerRef} className="fixed right-0 z-50 flex flex-row-reverse items-start pointer-events-none h-screen">
      <div
        className={` ${!dashboard ? "mt-10" : "mt-0"
          } flex flex-col px-5 overflow-auto bg-white border-l border-black/20 shadow-xl sm:w-96 w-full pointer-events-auto h-full`}
      >
        <div className={`flex flex-col flex-1 font-poppins`}>
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
          {individualActive && (
            <div className="flex gap-4 py-2 border-b border-black/5 justify-around">
               <p 
                className={`text-sm cursor-pointer ${subTab === "parents" ? "text-maroon font-bold border-b-2 border-maroon" : "text-grey"}`}
                onClick={() => setSubTab("parents")}
               >Parents</p>
               <p 
                className={`text-sm cursor-pointer ${subTab === "students" ? "text-maroon font-bold border-b-2 border-maroon" : "text-grey"}`}
                onClick={() => setSubTab("students")}
               >Students</p>
            </div>
          )}
          {chatquery.isPending && <div className=""> <Loader /> </div>}
          {parentchatquery.isPending && <div className=""> <Loader /> </div>}
          {studentchatquery.isPending && <div className=""> <Loader /> </div>}
          {/* {!chatquery.isPending && !parentchatquery.isPending &&
        } */}
          <div className="py-2">
            {groupActive && !chatquery.isPending &&
              chatquery?.data?.map((item) => {
                return <Message data={item} onpress={() => { openFullchat(item) }} />
              })}
            {individualActive && subTab === "parents" && !parentchatquery.isPending &&
              parentchatquery?.data?.map((item) => {
                return <Message data={item} onpress={() => { openParentChat(item) }} />;
              })}
            {individualActive && subTab === "students" && !studentchatquery.isPending &&
              studentchatquery?.data?.map((item) => {
                return <Message data={item} onpress={() => { openParentChat(item) }} />;
              })}
          </div>
        </div>
      </div>
      {showFullChat && <FullChat onclose={handleShowFullChat} data={selectedChat} />}
      {showParentChat && <ParentCHat onclose={handleShowParentChat} data={selectedChat} />}
    </div>
  );
};

export default RecentMessages;
