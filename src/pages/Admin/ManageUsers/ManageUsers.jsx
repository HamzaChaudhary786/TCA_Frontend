import React, { useEffect, useState } from "react";
import Loader from "../../../utils/Loader";
import Navbar from "../../../components/Admin/Navbar";
import DotsMenu from "../../../components/Admin/ManageUsers/DotsMenu";
import DataRows from "../../../components/Admin/ManageUsers/DataRows";
import RequestModal from "../../../components/Admin/ManageUsers/RequestModal";
import AddUserModal from "../../../components/Admin/ManageUsers/AddUserModal";
import EditUserModal from "../../../components/Admin/ManageUsers/EditUserModal";

import { toast } from "react-toastify";
import { IoSearch } from "react-icons/io5";
import { useMutation } from "@tanstack/react-query";
import { useBlur } from "../../../context/BlurContext";
import { useAdmin } from "../../../context/AdminContext";
import { deleteUser, updateUser } from "../../../api/Admin/UsersApi";

const ManageUsers = () => {

  const { isBlurred, toggleBlur } = useBlur();

  const [isMenu, setIsMenu] = useState(false);
  const [editData, setEditData] = useState({});
  const [requestCount, setReqCount] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [selectText, setSelectText] = useState("student");
  const [requestsModal, setRequestsModal] = useState(false);
  const [isAddUserModal, setIsAddUserModal] = useState(false);
  const [isEditUserModal, setIsEditUserModal] = useState(false);
  const { adminUsersDataPending, adminUsersData, adminUsersRefecth } = useAdmin();


  const toggleRequestModal = () => {
    setRequestsModal(!requestsModal);
  }

  const toggleAddUserModal = () => {
    setIsAddUserModal(!isAddUserModal);
    // toggleBlur();
  }

  const toggleEditUserModal = () => {
    setIsEditUserModal(!isEditUserModal);
    toggleBlur();
    setIsMenu(false);
  }

  const accessMutation = useMutation({
    mutationKey: ["access", "fees"], mutationFn: async () => {
      let result;
      if (!editData.isBlocked && editData.feesPaid) {
        result = await updateUser({ isBlocked: true, feesPaid: false }, editData._id);
      } else {
        result = await updateUser({ isBlocked: false, feesPaid: true }, editData._id);
      }
      await adminUsersRefecth();
      return result;
    },
    onSettled: async (data, error) => {
      setIsMenu(false);
      if (error) {
        console.log("error in toggle access : ", error)
        return;
      }
      console.log(" data after toggle access is : ", data);
      return;
    }
  })

  const toggleMenu = (data) => {
    console.log("user data is : ", data);
    setEditData(data);
    setIsMenu(!isMenu);
  }

  const handleFunctionClick = (usr) => { };

  useEffect(() => {
    let count = 0;
    adminUsersData.allUsers.map((item) => {
      if (item.isAccepted == false) {
        count++;
      }
    })
    setReqCount(count);
  }, [adminUsersData.allUsers])

  const handleDeleteUser = async () => {
    userDellMutation.mutate(editData._id);
  }

  const userDellMutation = useMutation({
    mutationKey: ["deleteuser"],
    mutationFn: async (id) => {
      const result = await deleteUser(id);
      await adminUsersRefecth();
      return result
    },
    onSettled: async (data) => {
      toast.success("user deleted successfully");
      setIsMenu(false);
      console.log(data);
    }
  })

  return (
    accessMutation.isPending || adminUsersDataPending || userDellMutation.isPending ? <div className="flex flex-1"> <Loader /> </div> :
      <>
        <div className="flex flex-1 bg-[#F9F9F9] font-poppins">
          <div className="flex flex-1">
            <div
              className={`w-full h-screen lg:px-10 sm:px-6 px-3 flex-grow lg:ml-72`}
            >
              <div className="h-screen md:pt-4">
                <Navbar heading={"Manage Users"} />
                <div className={`${isBlurred ? "blur" : ""}`}>
                  <div className="flex flex-row-reverse my-4">
                    <div className="flex items-center flex-wrap gap-4">
                      <div className="flex items-center gap-4 border bg-white border-[#00000020] px-4 py-2 rounded-3xl w-full lg:w-fit">
                        <IoSearch />
                        <input
                          type="text"
                          className="bg-transparent outline-none"
                          placeholder="Search Users"
                          value={searchText}
                          onChange={(e) => setSearchText(e.target.value)}
                        />
                      </div>

                      <div className="flex items-center gap-4 border bg-white border-[#00000020] px-4 py-2 rounded-xl w-full lg:w-fit">
                        <select name="" id="" className="px-2 " onChange={(e) => setSelectText(e.target.value)}  >
                          <option value="student" className="px-2 py-1">Student</option>
                          <option value="teacher" className="px-2 py-1">Teacher</option>
                          <option value="parent" className="px-2 py-1">Parent</option>
                        </select>
                      </div>

                      {
                        console.log(selectText, "selected Text")

                      }

                      <div>
                        {requestsModal && <RequestModal onclose={() => setRequestsModal(false)} refetch={adminUsersRefecth} data={adminUsersData.allUsers} />}
                      </div>

                      <div className="flex items-center gap-2">
                        <p onClick={toggleRequestModal} className={`cursor-pointer flex py-2 px-4 rounded-3xl bg-[#cccffa] text-[#0B1053] text-sm  items-center justify-center gap-2`}>Requests <span className="text-xs px-2 py-1 bg-[#a5aaf3] text-[#0B1053] rounded-3xl">{requestCount}</span> </p>
                        <p onClick={toggleAddUserModal} className={`cursor-pointer flex py-2 px-4 rounded-3xl bg-[#6A00FF] text-white text-sm `}>Add User</p>
                      </div>

                    </div>
                  </div>
                  <div className="my-2 h-[70%] overflow-auto">

                    <DataRows
                      header={true}
                      role={"Role"}
                      userId={selectText === "teacher" || selectText === "parent" ? "Reaference No" : "Roll No"}
                      index={"Sr No"}
                      userName={"Name"}
                      userclass={"Class"}
                      contact={"Contact"}
                      bgColor={"#F9F9F9"}
                    />

                    {adminUsersData?.allUsers
                      ?.filter((usr) => {
                        // Always consider both `searchText` and `selectText` dynamically
                        const matchesName =
                          searchText && usr.name.toLocaleLowerCase().includes(searchText.toLocaleLowerCase());
                        const matchesRollNo =
                          searchText && usr.rollNo && usr.rollNo.includes(searchText);
                        const matchesUserType =
                          selectText && usr.userType === selectText.toLocaleLowerCase();

                        // Apply combined logic:
                        // If only `selectText` is provided, filter by userType
                        if (!searchText && selectText) {
                          return matchesUserType;
                        }

                        // If only `searchText` is provided, filter by name or rollNo
                        if (searchText && !selectText) {
                          return matchesName || matchesRollNo;
                        }

                        // If both are provided, apply all filters
                        if (searchText && selectText) {
                          return matchesUserType && (matchesName || matchesRollNo);
                        }

                        // Default to showing all users when no filters are applied
                        return true;
                      })
                      .map((usr, index) => (
                        <DataRows
                          data={usr}
                          key={usr._id}
                          header={false}
                          index={index + 1}
                          bgColor={"#FFFFFF"}
                          userName={usr.name}
                          role={usr.userType}
                          userclass={usr?.class}
                          contact={usr.phoneNumber}
                          userId={
                            usr?.userType === "teacher"
                              ? `${usr.referenceNo}`
                              : usr?.userType === "parent"
                                ? usr?._id.slice(0, 5)
                                : usr?.rollNo || "not assign"
                          }
                          toggleClassMenu={(e) => toggleMenu(e)}
                          onClickFunction={handleFunctionClick(usr)}
                        />
                      ))}

                    {adminUsersData.allUsers.length == 0 && <div className="text-center py-4 text-3xl font-medium">No users to display!</div>}

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <DotsMenu
          isopen={isMenu}
          data={editData}
          toggleAccess={accessMutation.mutate}
          setIsOpen={setIsMenu}
          deleteUser={handleDeleteUser}
          editUser={toggleEditUserModal}
        />
        {isAddUserModal && <AddUserModal refetch={adminUsersRefecth} closeModal={toggleAddUserModal} />}
        {isEditUserModal && <EditUserModal refetch={adminUsersRefecth} closeModal={toggleEditUserModal} data={editData} />}
      </>
  );
}

export default ManageUsers
