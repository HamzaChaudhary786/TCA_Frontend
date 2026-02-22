import React, { useEffect, useState } from "react";
import ProfileMenu from "./ProfileMenu";
import Notifications from "./Notifications";
import IMAGES from "../../../assets/images";
import RecentMessages from "./RecentMessages";
import ProfileDetails from "./ProfileDetails";
import profile from "../../../assets/images/profilepic.png";
import { toast } from "react-toastify";
import { CiBellOn } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { IoMailOutline } from "react-icons/io5";
import { FaChevronDown } from "react-icons/fa6";
import { useQuery } from "@tanstack/react-query";
import { logout } from "../../../api/User/UserApi";
import { useBlur } from "../../../context/BlurContext";
import { useUser } from "../../../context/UserContext";
import { getAllNotifications } from "../../../api/ForAllAPIs";


const Navbar = ({ heading }) => {

  const [mail, setmail] = useState(false);
  const [bell, setBell] = useState(false);
  const [isProfileMenu, setIsProfileMenu] = useState(false);
  const [isProfileDetails, setIsProfileDetails] = useState(false);

  const navigate = useNavigate();

  const { isBlurred, toggleBlur } = useBlur();
  const { userData } = useUser();

  const toggleProfielMenu = () => {
    setIsProfileMenu(!isProfileMenu);
    setmail(false);
    setBell(false);
  };

  const toggleMail = () => {
    toggleBlur();
    setmail(!mail);
    setIsProfileMenu(false);
    setBell(false);
  };

  const togglebell = () => {
    setBell(!bell);
    setmail(false);
    setIsProfileMenu(false);
  };

  const toggleProfileDetails = () => {
    toggleBlur();
    setIsProfileDetails(!isProfileDetails);
  };

  const onProfileClick = () => {
    toggleProfielMenu();
    toggleProfileDetails();
  };
  const onSettingsClick = () => { };

  const onLogoutClick = async () => {

    const response = await logout();
    if (response == "error") {
      navigate("/login")
    } else {
      localStorage.clear()
      toast.success("Logged out successfully!");
      navigate("/login")
    }
    //console.log(response)
  };

  const notifyQuery = useQuery({
    queryKey: ["notifications"],
    queryFn: getAllNotifications,
    staleTime: 300000, enabled: false
  })

  const [allNotfications, setAllNotifications] = useState([]);

  useEffect(() => {
    if (notifyQuery.isSuccess) {
      setAllNotifications(notifyQuery.data);
    }
  }, [notifyQuery.isSuccess, notifyQuery.data])

  return (
    <div className="flex flex-1 h-20">
      <div className={`flex justify-end md:justify-between flex-1 py-3 ${isBlurred ? "blur" : ""}`}>
        <div className="hidden md:flex flex-col">
          {heading ? <div className="font-medium text-2xl">{heading} </div> :
            <div className="flex flex-col">
              <p className="text-xl font-semibold">Hello {userData.name} </p>
              <p className="">Welcome to your learning space!</p>
            </div>
          }
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-4">
            <div
              className={`p-2 border cursor-pointer  rounded-md border-black/50 transition-all duration-500 ${mail ? "bg-[#0B1053] text-white" : ""
                }`}
              onClick={toggleMail}
            >
              <IoMailOutline />
            </div>
            <div
              className={`p-2 border cursor-pointer rounded-md border-black/50 transition-all duration-500 ${bell ? "bg-[#0B1053] text-white" : ""
                }`}
              onClick={togglebell}
            >
              <CiBellOn />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <p className="font-medium hidden md:block">{userData?.name}</p>
            <img
              src={userData.profilePic || profile}
              alt="profile"
              className="w-10 h-10 cursor-pointer rounded-full"
              onClick={toggleProfielMenu}
            />
            <FaChevronDown
              className="cursor-pointer"
              onClick={toggleProfielMenu}
            />
          </div>

          {bell && <Notifications data={allNotfications} dashboard={true} onclose={togglebell} />}
          {isProfileMenu && <ProfileMenu
            dashboard={true}
            userData={userData}
            onLogoutClick={onLogoutClick}
            onProfileClick={onProfileClick}
            onSettingsClick={onSettingsClick}
            onClose={() => setIsProfileMenu(false)}
          />}
        </div>
      </div>
      {mail && <RecentMessages dashboard={true} onclose={toggleMail} />}
      {isProfileDetails && <ProfileDetails onclose={toggleProfileDetails} />}
    </div>
  );
};

export default Navbar;
