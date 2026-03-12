import React, { useRef, useState } from "react";
import { IoClose } from "react-icons/io5";
import { FiEdit } from "react-icons/fi";
import IMAGES from "../../../assets/images";
import { GoPerson } from "react-icons/go";
import { useParent } from "../../../context/ParentContext";
import { useBlur } from "../../../context/BlurContext";
import useClickOutside from "../../../hooks/useClickOutlise";
import { handleProfileImageUpdate } from "../../../utils/Admin/profileImageUtils";
import Loader from "../../../utils/Loader";


const ProfileDetails = ({ onclose }) => {
  const [allowedEdit, setAllowedEdit] = useState(false);
  // const { isBlurred, toggleBlur } = useBlur();
  const { allSubjects, setAllSubjects, selectedChild } = useParent();

  const [profileImage, setProfileImage] = useState(selectedChild?.profilePic || IMAGES.Profile);
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const fileInputRef = useRef(null);

  const handleImageClick = () => {
    fileInputRef.current.click(); // Opens the file dialog
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url); // Updates the preview

      // Use the separated utility to handle the upload
      await handleProfileImageUpdate(file, (uploadedUrl) => {
        console.log("Uploaded Image URL:", uploadedUrl);
        setProfileImage(uploadedUrl);
      }, setLoading);
    }
  };

  const ref = useRef(null);

  const { toggleBlur } = useBlur(); // Using toggleBlur for blur control



  useClickOutside(ref, () => {
    onclose()
  });




  //console.log(selectedChild, "curent children object");


  const handleEditClick = () => {
    setAllowedEdit(true);
  };

  const handleSaveDetails = () => {
  }

  const CusotmInput = ({ label, value, status, icon }) => {
    return (
      <div className="text-sm">
        <div className="flex flex-col ">
          <p className="">{label}</p>
          <div
            className={`flex px-2 py-1 border justify-between rounded-md items-center border-grey/70 ${status ? "text-black" : "text-grey"
              }`}
          >
            <input
              type="text"
              className="py-1 outline-none"
              placeholder={value}
              value={value}
            />
            <GoPerson />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="absolute top-0 right-0 z-10 flex bg-white border-b-black/10 rounded-md shadow-lg sm:w-96 w-72" ref={ref}>
      <div className="flex flex-col bg-white">
        <div className="flex justify-between px-5  py-5 border-b border-b-black/10">
          <p className="text-xl font-medium">My Profile</p>
          <IoClose onClick={onclose} className="cursor-pointer" />
        </div>
        <div className="flex flex-col">
          <div className="flex flex-col justify-center px-4 ">
            <div className="flex justify-end mt-3">
              <div className="p-2 border-grey/10">
                <FiEdit onClick={handleEditClick} className="cursor-pointer" />
              </div>
            </div>
            <div className="flex flex-col items-center justify-center text-center">
              <label htmlFor="profile" className="cursor-pointer">
                <img src={previewUrl || profileImage} alt="" className="sm:w-28 sm:h-28 w-20 h-20 rounded-full object-cover" />
              </label>
              <input id="profile" type="file" className="hidden" onChange={handleImageChange} accept="image/*" ref={fileInputRef} />
              <p>{selectedChild.name}</p>
              <p>Bio</p>
              <p>
                Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                Maxime, sint?
              </p>
            </div>
            <div className="flex flex-col gap-1 px-5 py-1 overflow-auto h-96 custom-scrollbar">
              <CusotmInput
                label={"Roll No."}
                value={"SP21-BCS-072"}
                status={allowedEdit}
                icon={"person"}
              />
              <CusotmInput
                label={"Name"}
                value={selectedChild.name}
                status={allowedEdit}
                icon={"person"}
              />
              <CusotmInput
                label={"Email"}
                value={selectedChild.email}
                status={allowedEdit}
                icon={"mail"}
              />
              <CusotmInput
                label={"Phone No."}
                value={selectedChild.phoneNumber}
                status={allowedEdit}
                icon={"phone"}
              />
              {/* <CusotmInput
                label={"Class"}
                value={"IG Basics"}
                status={allowedEdit}
                icon={"cap"}
              /> */}
              <CusotmInput
                label={"Parent Name"}
                value={selectedChild.guardianName}
                status={allowedEdit}
                icon={"person"}
              />
              <CusotmInput
                label={"Parent Email"}
                value={selectedChild.guardianEmail}
                status={allowedEdit}
                icon={"mail"}
              />
              <CusotmInput
                label={"Parent Phone No."}
                value={selectedChild.guardianPhoneNumber}
                status={allowedEdit}
                icon={"phone"}
              />
              {loading && <div className="flex justify-center my-2"><Loader /></div>}
              {allowedEdit && !loading ? <div className="flex justify-center my-4">
                <p onClick={handleSaveDetails} className="flex items-center justify-center w-1/2 px-1 py-2 text-center text-white cursor-pointer rounded-3xl bg-[#0B1053]">Save</p>
              </div> : ""}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetails;
