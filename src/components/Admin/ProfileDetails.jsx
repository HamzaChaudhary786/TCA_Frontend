import React, { useEffect, useRef, useState } from "react";
import Loader from "../../utils/Loader";
import { toast } from "react-toastify";
import { FiEdit } from "react-icons/fi";
import { IoClose, IoMailOutline, IoCalendarOutline } from "react-icons/io5";
import { GoPerson } from "react-icons/go";
import { FiPhone } from "react-icons/fi";
import profile from "../../assets/images/profilepic.png"
import { RiGraduationCapLine } from "react-icons/ri";
import { useUser } from "../../context/UserContext";
import { useMutation } from "@tanstack/react-query";
import { updateUser, updateSelfProfile } from "../../api/Admin/UsersApi";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { useBlur } from "../../context/BlurContext";
import useClickOutside from "../../hooks/useClickOutlise";
import { uploadFile } from "../../utils/FileUpload";
import { handleProfileImageUpdate } from "../../utils/Admin/profileImageUtils";


const CustomInput = ({ label, value, status, icon, name, valuesObj, setValuesObj, isEmail }) => (


  <div className="my-1 text-sm w-full">
    <div className="flex items-center gap-4 w-full">
      <div className="p-3 bg-white rounded-md border border-gray-300">
        {icon}
      </div>
      <input
        type="text"
        value={value}
        readOnly={!status}
        disabled={isEmail}
        placeholder={label}
        className={`flex-1 px-2 py-2 border rounded-md outline-none w-full ${isEmail ? 'opacity-50 cursor-not-allowed' : ''}`}
        onChange={(e) => setValuesObj({ ...valuesObj, [name]: e.target.value })}
      />
    </div>
  </div>
);


const ProfileDetails = ({ onClose }) => {
  const { userData, setUserData } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [userDataObj, setUserDataObj] = useState({
    name: userData?.name || "",
    email: userData?.email || "",
    phoneNumber: userData?.phoneNumber || "",
    bio: userData?.bio || "",
    profilePic: userData?.profilePic || "",
  });

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);

      // Use the separated utility to handle the upload to Cloudinary
      await handleProfileImageUpdate(file, (url) => {
        console.log("Uploaded Image URL:", url);
        setUserDataObj(prev => ({ ...prev, profilePic: url }));
      }, setLoading);
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);



  const ref = useRef(null); // Reference to the modal container
  const { toggleBlur } = useBlur(); // Access toggleBlur from the context

  // Use the hook with the modal's reference and callback function
  useClickOutside(ref, () => {
    onClose()
  });

  const updateUserMutation = useMutation({
    mutationFn: async (data) => {
      return updateSelfProfile(data);
    },
    onSuccess: (data) => {
      setUserData(data)
      toast.success("Profile updated successfully!");
      onClose();
    },
    onError: () => toast.error("Failed to update profile"),
  });

  useEffect(() => {
    if (userData) {
      localStorage.setItem("tcauser", JSON.stringify(userData));
    }
  }, [userData]);



  const [loading, setLoading] = useState(false); // Move it here, top-level



  return (
    <div className="absolute top-0 right-0 z-10 flex bg-white h-full rounded-md shadow-lg sm:w-96 w-72" ref={ref}>
      <div className="flex flex-col w-full p-5">
        <div className="flex justify-between border-b pb-3">
          <p className="text-xl font-medium">My Profile</p>
          <IoClose onClick={() => onClose()} className="cursor-pointer" />
        </div>

        <div className="flex flex-col items-center py-4">
          <label 
            htmlFor={isEditing ? "profile" : ""} 
            className={`relative ${isEditing ? "cursor-pointer" : "cursor-default"}`}
          >
            <img 
              src={previewUrl || userData.profilePic || profile} 
              alt="Profile" 
              className={`w-28 h-28 rounded-full object-cover ${loading ? 'opacity-50' : ''} ${isEditing ? 'ring-2 ring-[#0B1053] ring-offset-2' : ''}`} 
            />
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-[#0B1053] border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            {isEditing && !loading && (
              <div className="absolute bottom-0 right-0 bg-[#0B1053] p-1.5 rounded-full text-white shadow-md">
                <FiEdit size={12} />
              </div>
            )}
          </label>
          <input 
            id="profile" 
            type="file" 
            className="hidden" 
            onChange={handleFileChange} 
            accept="image/*" 
            disabled={!isEditing || loading} 
          />
          <p className="mt-2 font-medium">{userData.name}</p>
          <p className="text-sm text-gray-500">{userData.bio || "No bio available"}</p>
        </div>

        <div className="flex flex-col gap-2 overflow-auto py-6 h-auto">
          <div className="w-full">
            <CustomInput label="Name" name="name" value={userDataObj.name} status={isEditing} valuesObj={userDataObj} setValuesObj={setUserDataObj} icon={<GoPerson />} />
          </div>
          <CustomInput label="Email" name="email" value={userDataObj.email} status={false} valuesObj={userDataObj} setValuesObj={setUserDataObj} icon={<IoMailOutline />} isEmail />
          <CustomInput label="Phone No." name="phoneNumber" value={userDataObj.phoneNumber} status={isEditing} valuesObj={userDataObj} setValuesObj={setUserDataObj} icon={<FiPhone />} />
        </div>

        <div className="flex justify-between">
          {!isEditing ? (
            <div className="top-24 right-10 absolute">
              <FiEdit className="cursor-pointer " onClick={() => setIsEditing(true)} />
            </div>
          ) : (
            <button 
              onClick={() => updateUserMutation.mutate(userDataObj)} 
              disabled={updateUserMutation.isPending || loading}
              className={`px-8 py-2 text-white bg-[#0B1053] rounded-md flex items-center justify-center min-w-[100px] ${(updateUserMutation.isPending || loading) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-opacity-90 transition-all'}`}
            >
              {updateUserMutation.isPending ? <Loader /> : loading ? "Uploading..." : "Save"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileDetails;
