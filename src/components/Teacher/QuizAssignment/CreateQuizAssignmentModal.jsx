import React, { useEffect, useRef, useState } from "react";
import Loader from "../../../utils/Loader";
import IMAGES from "../../../assets/images";

import { toast } from "react-toastify";
import { FiUploadCloud } from "react-icons/fi";
import { IoCloseCircle } from "react-icons/io5";
import { useMutation, useQuery } from "@tanstack/react-query";
import { uploadFile } from "../../../utils/FileUpload";
import { useBlur } from "../../../context/BlurContext";
import { useUser } from "../../../context/UserContext";
import { useTeacher } from "../../../context/TeacherContext";
import { createQuiz, editQuiz } from "../../../api/Teacher/Quiz";
import { createAssignment, editAssignment, } from "../../../api/Teacher/Assignments";
import useClickOutside from "../../../hooks/useClickOutlise";
import { getTeacherSubjectsOfClassroom } from "../../../api/Teacher/TeacherSubjectApi";


const CreateQuizAssignmentModal = ({
  open,
  setopen,
  isQuiz,
  isEditTrue,
  refetch,
  data
}) => {
  const { userData } = useUser();
  const { allClassrooms } = useTeacher();
  const ref = useRef(null);
  const { toggleBlur } = useBlur();

  useClickOutside(ref, () => {
    setopen(false)
    if (open) {
      toggleBlur();
    }
  });

  const [QADate, setQADate] = useState("");
  const [QATime, setQATime] = useState("");

  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [quizAssignmentDataObj, setQuizAssignmentDataObj] = useState({
    canSubmitAfterTime: false,
    title: isEditTrue ? data?.title : "",
    text: isEditTrue ? data.text : "",
    dueDate: isEditTrue ? data?.dueDate : "",
    subjectID: isEditTrue ? data?.subjectID : "",
    totalMarks: isEditTrue ? data?.totalMarks : 0,
    classroomID: isEditTrue ? data?.classroomID : "",
    files: "",
  })
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedClassroom, setSelectedClassroom] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");


  // Just updating the key parts of your component. Keep the rest of your original code structure.



  console.log(selectedClassroom, "selected classroom");
  console.log(selectedSubject, "selected subject");




  const handleCreateAssignment = async () => {
    setLoading(true);

    const hasText = !!quizAssignmentDataObj?.text?.trim();
    const hasFile = !!selectedFile?.name;
    if (!hasText && !hasFile) {
      toast.error("Please provide text or a file.");
      setLoading(false);
      return;
    }

    try {
      // 1) upload file if needed
      let filesArr = [];
      if (hasFile) {
        const url = await uploadFile(selectedFile, "deliverable");
        filesArr.push({ name: selectedFile.name, url });
      }

      // 2) compute dueDate
      const dueDate = QADate && QATime
        ? `${QADate}T${QATime}:00.000Z`
        : new Date().toISOString();

      // 3) loop sequentially
      for (const classroom of selectedClassroom) {
        const classroomID = classroom._id;

        // pick the right subject for this teacher + classroom
        let subjectID = selectedSubject;
        // const teachEntry = classroom.teachers.find(
        //   t => t.teacher === userData._id
        // );
        // if (teachEntry) subjectID = teachEntry.subject;

        const payload = {
          ...quizAssignmentDataObj,
          classroomID,
          subjectID,
          files: filesArr,
          dueDate
        };

        // direct API call (so each gets its own request)
        await createAssignment(payload);
      }

      toast.success("Assignments created for all selected classrooms!");
      toggleBlur();
      setopen(false)
      await refetch();

    } catch (err) {
      console.error("Error during assignment creation:", err);
      // If you want to see exactly which classroom failed:
      // console.error(err.config.data, err.response?.status);
      toast.error("Something went wrong creating the assignments.");
    } finally {
      setLoading(false);
    }
  };





  const handleCreateQuiz = async () => {
    setLoading(true);

    const hasText = !!quizAssignmentDataObj?.text?.trim();
    const hasFile = !!selectedFile?.name;

    if (!hasText && !hasFile) {
      toast.error("Please provide either text or a file before creating the quiz.");
      setLoading(false);
      return;
    }

    try {
      let filesArr = [];

      if (hasFile) {
        const fileUrl = await uploadFile(selectedFile, "deliverable");
        filesArr.push({ name: selectedFile.name, url: fileUrl });
      }

      const dueDate = QADate && QATime
        ? `${QADate}T${QATime}:00.000Z`
        : new Date().toISOString();

      if (isEditTrue) {
        const sendingObj = {
          ...quizAssignmentDataObj,
          dueDate,
          files: filesArr,
        };

        quizEditMutate.mutate(sendingObj);
      } else {
        // Loop through all selected classrooms for quiz creation
        for (const classroom of selectedClassroom) {
          const classroomID = classroom._id;

          let subjectID = selectedSubject;

          // (Optional) Dynamic subject detection based on teacher
          // const teachEntry = classroom.teachers.find(
          //   t => t.teacher === userData._id
          // );
          // if (teachEntry) subjectID = teachEntry.subject;

          const sendingObj = {
            ...quizAssignmentDataObj,
            classroomID,
            subjectID,
            files: filesArr,
            dueDate
          };

          await createQuiz(sendingObj); // replace with your direct API or mutation call
        }

        toast.success("Quizzes created for all selected classrooms!");
        toggleBlur();
        setopen(false);
        await refetch();
      }
    } catch (err) {
      console.error("Error during quiz creation:", err);
      toast.error("Something went wrong while creating the quiz.");
    } finally {
      setLoading(false);
    }
  };





  const assignmentUpdateMutate = useMutation({
    mutationFn: async (dataobj) => await editAssignment(dataobj, data?._id),
    onSettled: async (data, error) => {
      console.log("after updation data is : ", data);
      await refetch();
      toggleBlur();
      setopen(false);
      if (error) { } {
        return toast.success("Assignment updated successfully");
      }
    }
  });


  const assignmentCreateMutate = useMutation({
    mutationFn: async (data) => await createAssignment(data),
    onSettled: async (data, error) => {
      console.log("after cration data is : ", data);
      await refetch();
      toggleBlur();
      setopen(false);
      if (error) {
      } else {
        return toast.success("Assignment created successfully");
      }
    }
  });


  const quizEditMutate = useMutation({
    mutationFn: async (dataobj) => await editQuiz(dataobj, data._id),
    onSettled: async (data, error) => {
      console.log("after updation data is : ", data);
      await refetch();
      toggleBlur();
      setopen(false);
      if (error) { } else {
        return toast.success("Quiz updated successfully");
      }
    }
  });

  const quizCreateMutate = useMutation({
    mutationFn: async (data) => await createQuiz(data),
    onSettled: async (data, error) => {
      console.log("after cration data is : ", data);
      await refetch();
      toggleBlur();
      setopen(false);
      if (error) { } else {
        return toast.success("Quiz created successfully");
      }
    }
  });


  const {
    data: teacherSubjectOfClassroom,
    isSuccess: teacherIsSuccess,
    isPending: teacherSubjectPending
  } = useQuery({
    queryKey: ["teacherSubjectsOfClassrooms", selectedClassroom.map(c => c._id)],
    queryFn: async () => {
      const classroomIDs = selectedClassroom.map(c => c._id);
      return await getTeacherSubjectsOfClassroom({ classroomIDs });
    },
    enabled: selectedClassroom.length > 0,
  });






  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);

    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };




  return (
    <div
      className={`fixed z-10 mt-10 bg-white max-h-[85vh] overflow-y-auto custom-scrollbar  p-8 w-[90%] ml-[5%] md:w-[600px] px-5 sm:px-16 text-black rounded-xl md:ml-96 ${open ? "" : "hidden"
        }`}

      ref={ref}

    >
      <div className="flex gap-2">
        <div className="flex flex-col w-full gap-4">
          <div className="flex items-center justify-between">
            <div className="flex justify-center flex-1 w-[fit] gap-2 items-center">
              <p className="text-xl sm:text-2xl font-medium sm:font-semibold cursor-text">
                Create new {isQuiz ? "Quiz" : "Assignment"}
              </p>
            </div>
            <div className="flex items-center gap-2 cursor-pointer">
              <img
                src={IMAGES.CloseIcon}
                className="w-[15px] h-[15px]"
                onClick={(e) => {
                  e.stopPropagation();
                  setopen(false);
                  toggleBlur()
                }}
              />
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ display: "flex", flexDirection: "column", flex: 1, gap: "4px" }}>
              <p style={{ fontSize: "12px", fontWeight: "600", color: "#4B5563" }}>Select Classroom</p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  // padding: "4px 16px",
                  borderRadius: "8px",
                  width: "100%",
                  alignItems: "center",
                  // border: "1px solid #d1d5db",
                  backgroundColor: "#ffffff",
                }}
              >
                <div style={{ position: "relative", width: "100%" }}>
                  <div
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    style={{
                      border: "1px solid #d1d5db",
                      borderRadius: "8px",
                      padding: "8px 12px",
                      backgroundColor: "#fff",
                      cursor: "pointer",
                      fontSize: "14px",
                      color: "#1f2937",
                    }}
                  >
                    {selectedClassroom.length > 0
                      ? selectedClassroom.map(item => item.name).join(", ")
                      : "Select Classroom"}
                  </div>

                  {dropdownOpen && (
                    <div
                      style={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        width: "100%",
                        maxHeight: "100px",
                        overflowY: "auto",
                        border: "1px solid #d1d5db",
                        borderRadius: "8px",
                        backgroundColor: "#fff",
                        marginTop: "4px",
                        zIndex: 10,
                      }}
                    >
                      {allClassrooms?.map(item => {
                        const isChecked = selectedClassroom.some(selected => selected._id === item._id);
                        return (
                          <label
                            key={item._id}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              padding: "8px 12px",
                              cursor: "pointer",
                              fontSize: "14px",
                              backgroundColor: isChecked ? "#f0f9ff" : "#fff",
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {
                                const exists = selectedClassroom.some(c => c._id === item._id);
                                if (exists) {
                                  setSelectedClassroom(prev =>
                                    prev.filter(c => c._id !== item._id)
                                  );
                                } else {
                                  setSelectedClassroom(prev => [...prev, item]);
                                }
                              }}
                              style={{ marginRight: "8px" }}
                            />
                            {item.name}
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>

              </div>
            </div>
          </div>


          <div className="flex items-center gap-3">
            <div className="flex flex-col flex-1 gap-1">
              <p className="text-xs font-semibold text-grey_700">Select Subject</p>
              <div className="flex justify-between border-[1px] py-1 px-4 rounded-lg w-full items-center border-grey/50">
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="text-sm outline-none text-custom-gray-3 w-full"
                >
                  <option value="">Select Subject</option>
                  {teacherSubjectOfClassroom?.subjects?.map((item) => (
                    <option key={item.subjectId} value={item.subjectId}>
                      {item.subjectName}
                    </option>
                  ))}
                </select>

              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex flex-col flex-1 gap-1">
              <p className="text-xs font-semibold text-grey_700">Title</p>
              <div className="flex justify-between border-[1px] py-1 px-4 rounded-lg w-full items-center border-grey/50">
                <input
                  className="text-sm outline-none text-custom-gray-3 w-full"
                  placeholder="Enter title"
                  value={quizAssignmentDataObj.title}
                  onChange={(e) => setQuizAssignmentDataObj({ ...quizAssignmentDataObj, title: e.target.value })}
                />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex flex-col flex-1 gap-1">
              <p className="text-xs font-semibold text-grey_700">{isQuiz ? "Text Quiz" : "Text Assignment"}</p>
              <div className="flex justify-between border-[1px] py-1 px-4 rounded-lg w-full items-center border-grey/50">
                <textarea
                  className="text-sm outline-none text-custom-gray-3 w-full"
                  placeholder="Enter title"
                  value={quizAssignmentDataObj.text}
                  onChange={(e) => setQuizAssignmentDataObj({ ...quizAssignmentDataObj, text: e.target.value })}
                />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex flex-col flex-1 gap-1">
              <p className="text-xs font-semibold text-grey_700">Total Makrs</p>
              <div className="flex justify-between border-[1px] py-1 px-4 rounded-lg w-full items-center border-grey/50">
                <input
                  className="text-sm outline-none text-custom-gray-3 w-full"
                  placeholder="Enter marks"
                  value={quizAssignmentDataObj.totalMarks}
                  onChange={(e) => setQuizAssignmentDataObj({ ...quizAssignmentDataObj, totalMarks: e.target.value })}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col flex-1 gap-1">
            <p className="text-xs font-semibold text-grey_700">Deadline</p>
            <div className="flex items-center gap-3 ">
              <div className="flex flex-col flex-1 gap-1 ">
                <div className="flex items-center flex-1 justify-between gap-3 px-3 py-1 border-[1.5px] rounded-lg border-grey/30">
                  <input
                    id="date"
                    type="date"
                    className="text-sm outline-none text-custom-gray-3 w-full"
                    placeholder="Enter date"
                    value={QADate}
                    onChange={(e) => setQADate(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex flex-col flex-1 gap-1">
                <div className="flex flex-1 items-center justify-between gap-3 px-3 py-1 border-[1.5px] rounded-lg border-grey/30">
                  <input
                    type="time"
                    className="text-sm outline-none text-custom-gray-3 w-full"
                    placeholder="Enter time"
                    value={QATime}
                    onChange={(e) => setQATime(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
          {isQuiz &&
            <div className="flex items-center gap-3">
              <div className="flex flex-col flex-1 gap-1">
                <p className="text-xs font-semibold text-grey_700">Can Submit after deadline</p>
                <div className="flex justify-between border-[1px] py-1 px-4 rounded-lg w-full items-center border-grey/50">
                  <select
                    value={quizAssignmentDataObj.canSubmitAfterTime}
                    className="text-sm outline-none text-custom-gray-3 w-full"
                    onChange={(e) => { setQuizAssignmentDataObj({ ...quizAssignmentDataObj, canSubmitAfterTime: e.target.value }) }} >
                    <option value={false}>No</option>
                    <option value={true}>Yes</option>
                  </select>
                </div>
              </div>
            </div>
          }
          <div className="flex flex-1 border-2 rounded-lg border-[#00000010] py-6 px-16">
            <div className="flex flex-col items-center justify-center flex-1 gap-2">
              {/* Upload Button */}
              <label htmlFor="assignmentQuiz">
                <div className="flex p-4 rounded-lg shadow-sm border border-[#00000010] cursor-pointer">
                  <FiUploadCloud />
                </div>
              </label>

              {/* Hidden Input */}
              <input
                type="file"
                id="assignmentQuiz"
                className="hidden"
                onChange={handleFileChange}
              />

              {/* Upload Instructions */}
              <div className="flex">
                <p className="flex flex-wrap items-center justify-center text-sm text-center">
                  <span className="text-[#0B1053] font-medium">Click to upload </span>
                  <span>or drag and drop Files</span>
                  <span> PNG, JPG, Word or PDF</span>
                </p>
              </div>

              {/* Preview Section */}
              {selectedFile && (
                <div className="mt-2 text-center">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-lg mx-auto"
                    />
                  ) : (
                    <p className="text-sm text-gray-600">{selectedFile?.name}</p>
                  )}
                  <p
                    onClick={handleRemoveFile}
                    className="text-red-500 text-xs mt-1 cursor-pointer hover:underline"
                  >
                    Remove File
                  </p>
                </div>
              )}

              {/* Existing File for Edit */}
              {isEditTrue && !selectedFile && (
                <div className="flex justify-between px-2 py-2 border rounded-lg w-60 border-black/20">
                  <div className="flex items-center gap-2">
                    <img src={IMAGES.pdf} alt="pdf icon" className="w-8 h-8" />
                    <div className="text-xs">
                      <p>Assignment 1.pdf</p>
                      <p>200 KB</p>
                    </div>
                  </div>
                  <div>
                    <p onClick={() => { }} className="cursor-pointer">
                      <IoCloseCircle size={16} />
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
          {(loading || quizCreateMutate.isPending || quizEditMutate.isPending || assignmentCreateMutate.isPending || assignmentUpdateMutate.isPending) && <div><Loader /> </div>}
          {
            (!loading && !quizCreateMutate.isPending && !quizEditMutate.isPending && !assignmentCreateMutate.isPending && !assignmentUpdateMutate.isPending) &&
            <div className="flex items-center gap-3">
              <div
                onClick={() => { isQuiz ? handleCreateQuiz() : handleCreateAssignment() }}
                className="flex items-center justify-center w-full py-2 text-center rounded-md cursor-pointer bg-[#6A00FF]"
              >
                <p className="text-sm text-white">{isEditTrue ? "Update" : "Create"}</p>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  );
};

export default CreateQuizAssignmentModal;
