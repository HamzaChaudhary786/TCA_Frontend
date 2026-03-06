import React, { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import { FiUploadCloud } from "react-icons/fi";
import { useMutation, useQuery } from "@tanstack/react-query";
import { uploadFile } from "../../../utils/FileUpload";
import { handleProfileImageUpdate } from "../../../utils/Admin/profileImageUtils";
import { useBlur } from "../../../context/BlurContext";
import { useUser } from "../../../context/UserContext";
import { useTeacher } from "../../../context/TeacherContext";
import { editAssignment } from "../../../api/Teacher/Assignments";
import { editQuiz } from "../../../api/Teacher/Quiz";
import useClickOutside from "../../../hooks/useClickOutlise";
import { getTeacherSubjectsOfClassroom } from "../../../api/Teacher/TeacherSubjectApi";
import { FiEdit } from "react-icons/fi";
import { IoCloseCircle } from "react-icons/io5";
import IMAGES from "../../../assets/images";

const EditQuizAssignmentModal = ({ isEditTrue, refetch, data, setIsEdit, isQuiz }) => {
  const { toggleBlur } = useBlur();
  const { userData } = useUser();
  const { allClassrooms } = useTeacher();

  // State Management
  const [formData, setFormData] = useState({
    title: "",
    text: "",
    totalMarks: 0,
    dueDate: "",
    files: "",
    canSubmitAfterTime: false,
  });
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("");
  const [selectedClassroom, setSelectedClassroom] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploadedFileUrl, setUploadedFileUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const modalRef = useRef(null);

  // Initialize form with existing data
  useEffect(() => {
    if (isEditTrue && data) {
      const { title, text, totalMarks, dueDate, files, canSubmitAfterTime, classroomID, subjectID } = data;
      const formattedDueDate = new Date(dueDate);

      setFormData({
        title,
        text,
        totalMarks,
        dueDate,
        files: files?.[0] || "",
        canSubmitAfterTime,
      });

      setDueDate(formattedDueDate.toISOString().split("T")[0]);
      setDueTime(formattedDueDate.toISOString().split("T")[1].slice(0, 5));
      setSelectedClassroom(classroomID);
      setSelectedSubject(subjectID?._id || "");
      setUploadedFileUrl(files?.[0]?.url || "");
    }
  }, [isEditTrue, data]);

  // Fetch teacher subjects for the selected classroom
  const { data: teacherSubjects, isPending: isSubjectsPending } = useQuery({
    queryKey: ["teacherSubjectsOfClassrooms", selectedClassroom?._id],
    queryFn: async () => {
      if (!selectedClassroom?._id) return null;
      return await getTeacherSubjectsOfClassroom({ classroomIDs: [selectedClassroom._id] });
    },
    enabled: !!selectedClassroom?._id,
  });

  // Close modal on outside click
  useClickOutside(modalRef, () => {
    setIsEdit(false);
    toggleBlur();
  });

  // Format due date for submission
  const formatDueDate = () => `${dueDate}T${dueTime}:00.000Z`;

  // Handle file upload
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }

    // Start Cloudinary upload immediately
    await handleProfileImageUpdate(file, (url) => {
      console.log("Uploaded File URL:", url);
      setUploadedFileUrl(url);
    }, setIsLoading, 'auto');
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setUploadedFileUrl("");
  };

  // Handle form submission
  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      const finalDueDate = formatDueDate();
      if (new Date(finalDueDate) < new Date()) {
        toast.error("Due date should be greater than current date");
        setIsLoading(false);
        return;
      }

      const files = uploadedFileUrl
        ? [{ name: selectedFile?.name || data?.files?.[0]?.name || "File", url: uploadedFileUrl }]
        : [];

      const payload = {
        ...formData,
        subjectID: selectedSubject,
        classroomID: selectedClassroom?._id,
        files,
        dueDate: finalDueDate,
      };

      const response = isQuiz
        ? await editQuiz(payload, data?._id)
        : await editAssignment(payload, data?._id);

      toast.success(`${isQuiz ? "Quiz" : "Assignment"} updated successfully!`);
      refetch();
      setIsEdit(false);
      toggleBlur();
    } catch (error) {
      toast.error("Failed to update. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div
      ref={modalRef}
      className="fixed z-10 mt-10 bg-white max-h-[85vh] overflow-y-auto p-8 w-full md:w-[600px] rounded-xl ml-5 md:ml-96 custom-scrollbar"
    >
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">{isQuiz ? "Edit Quiz" : "Edit Assignment"}</h2>
          <button
            className="text-red-500 text-xl"
            onClick={() => {
              setIsEdit(false);
              toggleBlur();
            }}
          >
            ✕
          </button>
        </div>

        {/* Classroom Selection */}
        <FieldWithLabel label="Select Classroom">
          <div className="relative">
            <div
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="border border-gray-300 rounded-lg p-2 cursor-pointer"
            >
              {selectedClassroom?.name || "Select Classroom"}
            </div>
            {isDropdownOpen && (
              <div className="absolute z-10 w-full max-h-40 overflow-y-auto border border-gray-300 rounded-lg bg-white mt-1">
                {allClassrooms?.map((classroom) => (
                  <div
                    key={classroom._id}
                    onClick={() => {
                      setSelectedClassroom(classroom);
                      setIsDropdownOpen(false);
                    }}
                    className="p-2 hover:bg-blue-50 cursor-pointer"
                  >
                    {classroom.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </FieldWithLabel>

        {/* Subject Selection */}
        <FieldWithLabel label="Select Subject">
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
            disabled={isSubjectsPending}
          >
            <option value="">Select Subject</option>
            {teacherSubjects?.subjects?.map((subject) => (
              <option key={subject.subjectId} value={subject.subjectId}>
                {subject.subjectName}
              </option>
            ))}
          </select>
        </FieldWithLabel>

        {/* Form Fields */}
        <FieldWithLabel label="Title">
          <input
            type="text"
            placeholder="Enter title"
            value={formData.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </FieldWithLabel>

        <FieldWithLabel label="Text">
          <textarea
            placeholder="Enter text"
            value={formData.text}
            onChange={(e) => handleInputChange("text", e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </FieldWithLabel>

        <FieldWithLabel label="Total Marks">
          <input
            type="number"
            placeholder="Enter marks"
            value={formData.totalMarks}
            onChange={(e) => handleInputChange("totalMarks", e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </FieldWithLabel>

        <FieldWithLabel label="Deadline">
          <div className="flex gap-3">
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-1/2 p-2 border border-gray-300 rounded-lg"
            />
            <input
              type="time"
              value={dueTime}
              onChange={(e) => setDueTime(e.target.value)}
              className="w-1/2 p-2 border border-gray-300 rounded-lg"
            />
          </div>
        </FieldWithLabel>

        {isQuiz && (
          <FieldWithLabel label="Can Submit After Deadline">
            <select
              value={formData.canSubmitAfterTime}
              onChange={(e) => handleInputChange("canSubmitAfterTime", e.target.value === "true")}
              className="w-full p-2 border border-gray-300 rounded-lg"
            >
              <option value={false}>No</option>
              <option value={true}>Yes</option>
            </select>
          </FieldWithLabel>
        )}

        <FieldWithLabel label="Upload File">
          <div className="flex flex-col gap-2">
            {!uploadedFileUrl && !selectedFile && (
              <label htmlFor="assignmentFile" className="cursor-pointer">
                <div className="flex items-center gap-2 border p-2 rounded-lg hover:border-blue-400">
                  <FiUploadCloud size={24} /> <span>Click to upload</span>
                </div>
                <span className="text-sm text-gray-500">PNG, JPG, Word, or PDF</span>
              </label>
            )}

            {uploadedFileUrl && (
              <div className="flex justify-between items-center p-3 border rounded-lg bg-gray-50 border-gray-200">
                <div className="flex items-center gap-3">
                  {previewUrl || (data?.files?.[0]?.url && data?.files?.[0]?.url.match(/\.(jpeg|jpg|gif|png)$/) != null) ? (
                    <img src={previewUrl || uploadedFileUrl} alt="preview" className="w-12 h-12 rounded object-cover" />
                  ) : (
                    <img src={IMAGES.pdf} alt="file" className="w-8 h-8" />
                  )}
                  <div className="flex flex-col overflow-hidden max-w-[200px]">
                    <span className="text-sm font-medium truncate">
                      {selectedFile?.name || data?.files?.[0]?.name || "File"}
                    </span>
                    <span className="text-xs text-gray-500">Uploaded to Cloudinary</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <label htmlFor="assignmentFile" className="cursor-pointer text-[#0B1053] hover:text-blue-600">
                    <FiEdit size={18} />
                  </label>
                  <button onClick={handleRemoveFile} className="text-red-500 hover:text-red-700">
                    <IoCloseCircle size={20} />
                  </button>
                </div>
              </div>
            )}
          </div>
          <input
            id="assignmentFile"
            type="file"
            className="hidden"
            onChange={handleFileChange}
          />
        </FieldWithLabel>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full py-2 text-white bg-[#0B1053] rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
        >
          {isLoading ? "Processing..." : "Update"}
        </button>
      </div>
    </div>
  );
};

const FieldWithLabel = ({ label, children }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-semibold text-gray-700">{label}</label>
    {children}
  </div>
);

export default EditQuizAssignmentModal;