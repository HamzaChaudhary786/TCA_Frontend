import React, { useRef, useState } from "react";
import Loader from "../../../utils/Loader";

import { toast } from "react-toastify";
import { FiEdit } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { CusotmInput } from "./CustomInput";
import { useUser } from "../../../context/UserContext";
import { updateStudent } from "../../../api/Student/StudentApis";
import IMAGES from "../../../assets/images";
import { GoMail, GoPencil, GoPerson } from "react-icons/go";
import { MdPhone } from "react-icons/md";
import { FaGraduationCap } from "react-icons/fa6";

import profile from "../../../assets/images/profilepic.png"
import { useBlur } from "../../../context/BlurContext";
import useClickOutside from "../../../hooks/useClickOutlise";
import { uploadFile } from "../../../utils/FileUpload";
import { handleProfileImageUpdate } from "../../../utils/Admin/profileImageUtils";

const ProfileDetails = ({ onclose }) => {

  const { userData, setUserData } = useUser();
  //console.log("user data is : ", userData);

  const ref = useRef(null);

  const { toggleBlur } = useBlur(); // Using toggleBlur for blur control



  useClickOutside(ref, () => {
    onclose()
  });


  const [bio, setBio] = useState(userData?.bio);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(userData?.name);
  const [email, setEmail] = useState(userData?.email);
  const [rollNo, setRollNo] = useState("SP21-BCS-072");
  const [allowedEdit, setAllowedEdit] = useState(false);
  const [className, setClassName] = useState(userData.levelName);
  const [phone, setPhone] = useState(userData?.phoneNumber);
  const [parentName, setParentName] = useState(userData?.guardianName);
  const [selectedFile, setSelectedFile] = useState(userData?.profilePic || IMAGES.Profile);
  const [parentEmail, setParentEmail] = useState(userData?.guardianEmail);
  const [parentPhone, setParentPhone] = useState(userData?.guardianPhoneNumber);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [profilePic, setProfilePic] = useState(userData?.profilePic || "");

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
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);

      // Use the separated utility to handle the upload
      await handleProfileImageUpdate(file, (url) => {
        console.log("Uploaded Image URL:", url);
        setProfilePic(url);
      }, setLoading);
    }
  };


  const handleEditClick = () => {
    setAllowedEdit(true);
  };


  const handleSaveDetails = async () => {
    setLoading(true);

    // Image upload is now handled as soon as the file is selected via handleProfileImageUpdate.

    const data = {
      name, email, bio, phoneNumber: phone, guardianName: parentName, guardianEmail: parentEmail,
      guardianPhoneNumber: parentPhone, className, profilePic
    }

    //console.log("data being sent is : ", data);

    const response = await updateStudent(data);

    if (response == "error") {
      console.log("error here");
    } else {
      //console.log("updated student response is : ", response);
      toast.success("Profile Updated successfully!");
      await setUserData(response);
      onclose();
    }

    setLoading(false);
  }

  return (
    <div className="relative justify-end items-end" ref={ref}>
      <div className="absolute top-0 right-0 z-10 flex bg-white rounded-md shadow-lg sm:w-96 w-72 ">
        <div className="flex flex-col w-full">
          <div className="flex justify-between px-5 py-5 border-b border-b-black/10">
            <p className="text-xl font-medium">My Profile</p>
            <IoClose onClick={onclose} className="cursor-pointer" />
          </div>
          <div className="flex flex-col">
            <div className="flex flex-col justify-center px-10 ">
              <div className="flex justify-end mt-3">
                <div className="p-2 border-grey/10">
                  <FiEdit onClick={handleEditClick} className="cursor-pointer" />
                </div>
              </div>
              <div className="flex flex-col items-center justify-center text-center">
                <label htmlFor="profile" className="cursor-pointer">
                  <img src={previewUrl || userData.profilePic || profile} alt="" className="w-28 h-28 rounded-full" />
                </label>
                <input id="profile" type="file" onChange={handleProfileChange} className="hidden" />
                <p>{userData?.name}</p>
                {/* <p>Bio</p> */}
                <p>
                  {userData.bio ? userData.bio :
                    "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Maxime, sint?"
                  }
                </p>
              </div>
              <div className="flex flex-col gap-2 px-5 py-10 overflow-y-auto h-96 no-scrollbar">
                {allowedEdit &&
                  <CusotmInput
                    value={bio}
                    icon={<GoPencil />}
                    label={"Bio"}
                    status={allowedEdit}
                    inputChange={setBio}
                  />
                }
                {/* <CusotmInput
                value={rollNo}
                icon={"person"}
                label={"Roll No."}
                status={allowedEdit}
              // inputChange={setRollNo}
              /> */}
                <CusotmInput
                  value={name}
                  label={"Name"}
                  icon={<GoPerson />}
                  status={allowedEdit}
                  inputChange={setName}
                />
                <CusotmInput
                  value={email}
                  icon={<GoMail />}
                  label={"Email"}
                  status={allowedEdit}
                // inputChange={setEmail}
                />
                <CusotmInput
                  value={phone}
                  icon={<MdPhone />}
                  label={"Phone No."}
                  status={allowedEdit}
                  inputChange={setPhone}
                />
                <CusotmInput
                  icon={<FaGraduationCap />}
                  label={"Level"}
                  value={className}
                  status={allowedEdit}
                  inputChange={setClassName}
                />
                <CusotmInput
                  icon={<GoPerson />}
                  value={parentName}
                  status={allowedEdit}
                  label={"Parent Name"}
                  inputChange={setParentName}
                />
                <CusotmInput
                  icon={<GoMail />}
                  value={parentEmail}
                  status={allowedEdit}
                  label={"Parent Email"}
                  inputChange={setParentEmail}
                />
                <CusotmInput
                  icon={<MdPhone />}
                  value={parentPhone}
                  status={allowedEdit}
                  label={"Parent Phone No."}
                  inputChange={setParentPhone}
                />
                {loading && <div className="py-4"> <Loader /> </div>}
                {!loading && allowedEdit && <div className="flex justify-center my-4">
                  <p onClick={handleSaveDetails} className="flex items-center justify-center w-1/2 px-1 py-2 text-center text-white cursor-pointer rounded-3xl bg-[#007EEA]">Save</p>
                </div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>


  );
};

export default ProfileDetails;
