import React, { useState } from "react";
import IMAGES from "../../../assets/images";
import Navbar from "../../../components/Admin/Navbar";
import FeedbackCard from "../../../components/Admin/Teachers/FeedbackCard";
import AttendanceTable from "../../../components/Admin/Teachers/AttendanceTable";
import ActivityCard from "../../../components/Admin/StudentReports/ActivityCard";
import SystemOverView from "../../../components/Admin/StudentReports/SystemOverview"

import { LuPhone } from "react-icons/lu";
import { useLocation } from "react-router-dom";
import { IoMailOutline } from "react-icons/io5";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserFeedback, acceptFeedback, rejectFeedback, deleteFeedback } from "../../../api/Admin/FeedbackApi";
import { toast } from "react-toastify";
import ConfirmModal from "../../../components/Admin/TimeTable/ConfirmModal";


const TeacherDetails = () => {

  const location = useLocation();
  const [reportActive, setReportActive] = useState(true);
  const [feedbackActive, setFeedbackActive] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedFeedbackId, setSelectedFeedbackId] = useState(null);

  console.log("location is : ", location.state);

  const teacherId = location?.state?.teacher?._id;
  console.log("--- FRONTEND DEBUG ---");
  console.log("TeacherDetails teacherId:", teacherId);
  console.log("location.state:", location.state);

  const { data: feedbackData = [], isPending } = useQuery({
    queryKey: ["feedback", teacherId],
    queryFn: () => getUserFeedback(teacherId),
    enabled: !!teacherId,
  });

  const queryClient = useQueryClient();

  const acceptMutation = useMutation({
    mutationFn: acceptFeedback,
    onSuccess: () => {
      queryClient.invalidateQueries(["feedback", teacherId]);
      toast.success("Feedback accepted");
    },
    onError: () => {
      toast.error("Failed to accept feedback");
    },
  });

  const rejectMutation = useMutation({
    mutationFn: rejectFeedback,
    onSuccess: () => {
      queryClient.invalidateQueries(["feedback", teacherId]);
      toast.success("Feedback rejected");
    },
    onError: () => {
      toast.error("Failed to reject feedback");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteFeedback,
    onSuccess: () => {
      queryClient.invalidateQueries(["feedback", teacherId]);
      toast.success("Feedback deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete feedback");
    },
  });

  const handleAccept = (feedbackID) => {
    acceptMutation.mutate(feedbackID);
  };

  const handleReject = (feedbackID) => {
    setSelectedFeedbackId(feedbackID);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedFeedbackId) {
      deleteMutation.mutate(selectedFeedbackId);
      setIsDeleteModalOpen(false);
      setSelectedFeedbackId(null);
    }
  };

  const handleDelete = (feedbackID) => {
    // This is now redundant as handleReject handles deletion, 
    // but keeping it for compatibility with FeedbackCard props if needed.
    setSelectedFeedbackId(feedbackID);
    setIsDeleteModalOpen(true);
  };

  console.log("Feedback data from query:", feedbackData);
  console.log("-----------------------");

  const onReportClick = () => {
    setReportActive(true);
    setFeedbackActive(false);
  }

  const onFeedbackClick = () => {
    setReportActive(false);
    setFeedbackActive(true);
  }

  const attendanceData = [
    {
      status: "Present",
      date: "8th Jan, 2022",
      time: "8:30am - 9:30am",
    },
    {
      status: "Present",
      date: "8th Jan, 2022",
      time: "8:30am - 9:30am",
    },
    {
      status: "Present",
      date: "8th Jan, 2022",
      time: "8:30am - 9:30am",
    },
    {
      status: "Present",
      date: "8th Jan, 2022",
      time: "8:30am - 9:30am",
    },
    {
      status: "Present",
      date: "8th Jan, 2022",
      time: "8:30am - 9:30am",
    },
  ];

  return (
    <div className="flex flex-1 bg-[#F9F9F9] font-poppins">
      <div className="flex flex-1">
        <div className="flex-grow w-full px-5 lg:px-10 sm:px-6 lg:ml-72">
          <div className="pt-6 ">
            <Navbar heading={"Teacher Reports"} />
            <div className="mt-7">
              <div className="flex flex-col items-center justify-center gap-1">
                <img src={location.state.teacher.profilePic || IMAGES.Profile} alt="" className="sm:w-40 sm:h-40 w-20 h-20 rounded-full object-cover" />
                <p className="text-lg font-semibold">{location.state.teacher.name}</p>
                <div className="flex items-center gap-2 text-xs">
                  <LuPhone />
                  <p>{location.state.teacher.phoneNumber}</p>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <IoMailOutline />
                  <p>{location.state.teacher.email}</p>
                </div>
                {/* <div className="">
                  <p className="text-maroon text-lg">Class Average: 88 Marks / A+ Grade</p>
                </div> */}
              </div>
            </div>
            <div className="flex gap-2">
              <p onClick={onReportClick} className={`cursor-pointer py-2 font-medium px-2 ${reportActive ? "border-b-2 border-[#0B1053]" : "text-black/50"} `}>Report</p>
              <p onClick={onFeedbackClick} className={`cursor-pointer py-2 font-medium px-2 ${reportActive ? "text-black/50" : "border-b-2 border-[#0B1053]"} `}>Feedback</p>
            </div>

            {reportActive ?
              <>
                <div className="mt-7">
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between">
                      <p className="md:text-2xl">Attendance <span className="text-[8px]">10/12 days Present</span></p>
                    </div>
                    <div className="flex flex-col items-center flex-1 gap-2 sm:flex-row">
                      <AttendanceTable data={location?.state?.attendence} />
                    </div>
                  </div>
                </div>
                <div className="mt-7">
                  <div className="flex flex-col gap-2">
                    <p className="md:text-[20px]">System Usage Report</p>
                    <div className="flex">
                      <SystemOverView />
                      {/* <QuizAssignmentsTable data={assignmentData} /> */}
                      {/* <img src={IMAGES.deviceGraph} alt="" className="w-full h-full" /> */}
                    </div>
                  </div>
                </div>
                {/* <div className="mt-7">
                  <div className="flex flex-col gap-4">
                    <p className="md:text-[20px]">Activity History</p>
                    <div className="flex flex-col gap-2">
                      <ActivityCard />
                      <ActivityCard />
                      <ActivityCard />
                    </div>
                  </div>
                </div> */}
              </>
              : <>
                <div className="flex py-4">
                  <div className="flex flex-col gap-4">
                    <div className="flex text-lg font-medium">
                      <p>Feedback</p>
                    </div>
                    <div className="grid sm:grid-cols-2 grid-cols-1 lg:gap-16 mt">
                      {isPending ? (
                        <p>Loading feedbacks...</p>
                      ) : feedbackData?.feedbacks?.length > 0 ? (
                        feedbackData.feedbacks.map((feedback, index) => (
                          <FeedbackCard
                            key={index}
                            feedback={feedback}
                            onAccept={handleAccept}
                            onReject={handleReject}
                            onDelete={handleDelete}
                          />
                        ))
                      ) : (
                        <div className="py-2 text-2xl font-medium">
                          <p>No feedbacks to display for this user</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>}
            <div className="mt-7">
            </div>
          </div>
        </div>
      </div>
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Delete Feedback"
        description="Are you want to delete this feedback?"
        onconfirm={handleConfirmDelete}
        onclose={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
};

export default TeacherDetails;
