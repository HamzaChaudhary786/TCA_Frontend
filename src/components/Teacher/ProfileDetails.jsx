import React, { useRef, useState } from "react";
import IMAGES from "../../assets/images";
import profile from "../../assets/images/profilepic.png";

import { toast } from "react-toastify";
import { BsCake } from "react-icons/bs";
import { FiEdit } from "react-icons/fi";
import { FiPhone } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { GoPerson } from "react-icons/go";
import { GoDownload } from "react-icons/go";
import { IoCloseCircle } from "react-icons/io5";
import { IoMailOutline } from "react-icons/io5";
import { IoCalendarOutline } from "react-icons/io5";
import { useUser } from "../../context/UserContext";
import { useMutation } from "@tanstack/react-query";
import { RiGraduationCapLine } from "react-icons/ri";
import { updateTeacher } from "../../api/Teacher/TeacherApi";
import { uploadFile } from "../../utils/FileUpload";
import { handleProfileImageUpdate } from "../../utils/Admin/profileImageUtils";

import Loader from "../../utils/Loader";
import { useBlur } from "../../context/BlurContext";
import useClickOutside from "../../hooks/useClickOutlise";


const CusotmInput = ({ value, type, status, icon, name, valuesObj, setValuesObj }) => {
  return (
    <div className="my-1 text-sm flex-1 w-full">
      <div className="flex items-center gap-4 ">
        <div className="p-3 bg-white rounded-md border-1 border border-[#00000030]">
          {icon == "person" ?
            <GoPerson />
            : icon == "mail" ? <IoMailOutline /> : icon == "phone" ? <FiPhone /> : icon == "cap" ? <RiGraduationCapLine /> : icon == "calendar" ? <IoCalendarOutline /> : <BsCake />}
        </div>
        <div
          className={`flex px-2 py-1 w-full border justify-between rounded-md items-center border-grey/70 ${status ? "text-black" : "text-grey"
            }`}
        >
          <input
            value={value}
            placeholder={name}
            type={type || "text"}
            className="flex flex-1 w-full py-1 outline-none"
            onChange={(e) => { setValuesObj({ ...valuesObj, [name]: e.target.value }) }}
          />
        </div>
      </div>
    </div>
  );
};

const ProfileDetails = ({ onclose }) => {

  const { userData, setUserData } = useUser();
  const [allowedEdit, setAllowedEdit] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState(userData.cv || "");
  const [selectedProfile, setSelectedProfile] = useState(userData.profilePic || "");
  const [previewUrl, setPreviewUrl] = useState(null);

  // State for profile picture URL (will be updated after Cloudinary upload)
  const [profilePic, setProfilePic] = useState(userData.profilePic || "");
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleProfileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedProfile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);

      // Use the separated utility to handle the upload to Cloudinary
      await handleProfileImageUpdate(file, (url) => {
        console.log("Uploaded Image URL:", url);
        // UPDATED: Store the new Cloudinary URL in the local state variable
        setProfilePic(url);
      }, setLoading);
    }
  };



  const ref = useRef(null);

  const { toggleBlur } = useBlur(); // Using toggleBlur for blur control



  useClickOutside(ref, () => {
    onclose()
  });

  const [userDataObj, setUserDataOjb] = useState({
    bio: userData.bio,
    dob: userData.dob,
    userType: "teacher",
    name: userData.name,
    email: userData.email,
    experience: userData.experience,
    phoneNumber: userData.phoneNumber,
    qualification: userData.qualification,
    // UPDATED: Added profilePic to the initial state object
    profilePic: userData.profilePic || "",
  });

  const handleEditClick = () => {
    setAllowedEdit(true);
  };

  const handleSaveDetails = async () => {
    // UPDATED: Ensure the most recent profilePic (from Cloudinary) is included in the update
    const updatedData = { ...userDataObj, profilePic: profilePic };
    updateuserMutation.mutate(updatedData);
    // onclose();
  };

  const updateuserMutation = useMutation({
    mutationFn: async (data) => {
      // UPDATED: Now sending the consolidated data object directly to the API
      const result = await updateTeacher(data);
      return result;
    },

    onError: (error) => {
      console.log(error);
      toast.error("User cannot be updated successfully!");
    },

    onSettled: (data, error) => {
      // UPDATED: Use spread operator to merge existing userData with updated fields
      setUserData({ ...userData, ...data });
      onclose();
      if (!error) {
        toast.success("User Update successfully!");
      }
    }
  });

  return (
    <div className=" relative w-full justify-end items-end" ref={ref}>
      <div className="absolute top-0 right-0 z-10 flex bg-white rounded-md shadow-lg sm:w-96 w-80 md:w-full">
        <div className="flex flex-col flex-1 w-full my-5">
          <div className="flex justify-between px-5 py-5 border-b border-b-black/10">
            <p className="text-xl font-medium">My Profile</p>
            <IoClose onClick={onclose} className="cursor-pointer" />
          </div>
          <div className="flex flex-col flex-1 w-full">
            <div className="flex flex-col justify-center px-8 my-5 w-full flex-1 ">
              <div className="flex justify-end mt-3">
                <div className="p-2 border-grey/10">
                  <FiEdit onClick={handleEditClick} className="cursor-pointer" />
                </div>
              </div>
              <div className="flex flex-col items-center justify-center text-center">
                <label className="cursor-pointer" htmlFor="profile">
                  <img src={previewUrl || userData.profilePic || profile} alt="" className="w-28 h-28 rounded-full" />
                </label>
                <input type="file" onChange={handleProfileChange} id={"profile"} className="hidden" />
                <p>{userData.name}</p>
                <p>Bio</p>
                <p className="text-xs">
                  {!allowedEdit && userData.bio}
                </p>
              </div>
              <div className="flex flex-col gap-1 px-2 py-7 w-full h-[75vh] overflow-auto register-scrollbar">
                {allowedEdit &&
                  <CusotmInput
                    name={"bio"}
                    label={"Bio"}
                    icon={"person"}
                    status={allowedEdit}
                    value={userDataObj.bio}
                    valuesObj={userDataObj}
                    setValuesObj={setUserDataOjb}
                  />
                }
                <CusotmInput
                  name={"name"}
                  label={"Name"}
                  icon={"person"}
                  status={allowedEdit}
                  valuesObj={userDataObj}
                  value={userDataObj.name}
                  setValuesObj={setUserDataOjb}
                />
                <CusotmInput
                  icon={"mail"}
                  name={"email"}
                  label={"Email"}
                  status={allowedEdit}
                  valuesObj={userDataObj}
                  value={userDataObj.email}
                  setValuesObj={setUserDataOjb}
                />
                <CusotmInput
                  icon={"phone"}
                  label={"Phone No."}
                  name={"phoneNumber"}
                  status={allowedEdit}
                  valuesObj={userDataObj}
                  setValuesObj={setUserDataOjb}
                  value={userDataObj.phoneNumber}
                />
                <CusotmInput
                  icon={"cap"}
                  status={allowedEdit}
                  name={"qualification"}
                  label={"Qualification"}
                  valuesObj={userDataObj}
                  setValuesObj={setUserDataOjb}
                  value={userDataObj.qualification}
                />
                <CusotmInput
                  icon={"calendar"}
                  name={"experience"}
                  label={"Experience"}
                  status={allowedEdit}
                  valuesObj={userDataObj}
                  setValuesObj={setUserDataOjb}
                  value={userDataObj.experience}
                />
                <CusotmInput
                  name={"dob"}
                  label={"DOB"}
                  type={"date"}
                  icon={"cake"}
                  status={allowedEdit}
                  value={userDataObj.dob}
                  valuesObj={userDataObj}
                  setValuesObj={setUserDataOjb}
                />

                <div>
                  <p className="flex font-semibold ">Resume: </p>
                  <div className="flex items-center gap-2">
                    <div className="border-2 flex py-2 w-full rounded-md px-4 justify-between gap-4 border-[#00000020]">
                      <div className="flex gap-2">
                        <img src={IMAGES.pdf} alt="" className="w-8 h-8" />
                        <div className="">
                          <p className="flex text-sm font-medium">Resume.pdf</p>
                          <p className="flex text-xs">200 KB</p>
                        </div>
                      </div>
                      <div className="cursor-pointer">
                        <IoCloseCircle />
                      </div>
                    </div>
                    <label
                      for="file"
                      className="p-4 text-white rounded-sm cursor-pointer bg-[#0B1053]"
                    >
                      <div className="">
                        <GoDownload />
                      </div>
                    </label>
                    <input type="file" id="file" onChange={(e) => { setSelectedPdf(e.target.files[0]) }} hidden />
                  </div>
                </div>

                {updateuserMutation.isPending && <div className="mb-4"><Loader /></div>}

                {!updateuserMutation.isPending && allowedEdit &&
                  <div className="flex justify-center my-4">
                    <p
                      onClick={handleSaveDetails}
                      className="flex items-center justify-center w-1/2 px-1 py-2 text-center text-white cursor-pointer rounded-3xl bg-[#0B1053]"
                    >
                      Save
                    </p>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>


  );
};

export default ProfileDetails;
