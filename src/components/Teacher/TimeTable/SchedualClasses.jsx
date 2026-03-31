import React, { useRef, useState } from "react";
import FilterButton from "./FilterButton";
import Loader from "../../../utils/Loader";
import IMAGES from "../../../assets/images";
import FilterClassesModal from "./FilterClassesModal";

import { toast } from "react-toastify";
import { IoClose } from "react-icons/io5";
import { useMutation } from "@tanstack/react-query";
import { useUser } from "../../../context/UserContext";
import { createClasses } from "../../../api/Teacher/Class";
import { useTeacher } from "../../../context/TeacherContext";
import { useGetAllTeacherSubjects } from "../../../api/Teacher/TeacherSubjectApi";
import { convertToISOWithTimezoneOffset } from "../../../utils/ConvertTimeZone";
import CustomSelectableField from '../../../commonComponents/CustomSelectableField'
import CustomMultiSelectableField from '../../../commonComponents/MultiSelectableField'

import { CusotmInputField } from "../../../commonComponents/CusotmInputField";
import useClickOutside from "../../../hooks/useClickOutlise";

const SchedualClasses = ({ refetch, data, isPending, addScheduleModalOpen, setAddScheduleModalOpen }) => {

  const SchedualClassesComponent = ({ onclose, isOpen, setIsOpen }) => {
    const [allowedEdit, setAllowedEdit] = useState(false);
    const handleEditClick = () => {
      setAllowedEdit(true);
    };

    const { allSubjects, allClassrooms, classesRefetch } = useTeacher();
    const { userData } = useUser();

    const { teacherSubjects, isLoading } = useGetAllTeacherSubjects(userData.id)

    console.log(allSubjects, "allSubjects");
    console.log(teacherSubjects, "teacher subject");


    const [selectedSubject, setSelctedSubject] = useState();
    const [selectedClassrooms, setSelectedClassrooms] = useState([]);

    const [selectedDays, setSelectedDays] = useState(["Monday"]);



    const handleDayCheckboxChange = (day) => {
      setSelectedDays((prev) =>
        prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
      );
    };

    const [classObj, setClassObj] = useState({
      title: "",
      startTime: "",
      endTime: "",
      oneTime: true,
      meetingUrl: "",
      classroomID: "",
      subjectID: "",
      startEventDate: "",
      endEventDate: "",
      teacher: { teacherID: userData.id, status: "absent" }
    })


    const handleSaveDetails = () => { };

    const handleSchedualClass = () => {
      const isoFormattedStringEndTime = new Date(
        convertToISOWithTimezoneOffset(classObj.startEventDate, classObj.endTime)
      );
      const isoFormattedStringStartTime = new Date(
        convertToISOWithTimezoneOffset(classObj.startEventDate, classObj.startTime)
      );

      selectedClassrooms.forEach((classroomID) => {
        const myobj = {
          ...classObj,
          subjectID: JSON.parse(selectedSubject).id,
          classroomID, // Send one by one
          startTime: isoFormattedStringStartTime,
          endTime: isoFormattedStringEndTime,
          selectedDays,
        };

        console.log("Sending to backend:", myobj);
        classCreateMutate.mutate(myobj);
      });
    };



    const classCreateMutate = useMutation({
      mutationFn: async (data) => await createClasses(data),
      onSettled: async (data, error) => {
        if (!error) {
          toast.success("Class created successfully");
          refetch();
          onclose();
          setaddEventModalOpen(false);

        } else {
          console.log("error: " + error);

          toast.error(error?.response?.data?.error);
        }
      }
    });


    const ref = useRef(null);

    // useClickOutside(ref, () => {
    //   setAddScheduleModalOpen(false);

    // });


    return (
      <div
        className={`absolute top-0 right-0 flex-1 z-10 flex bg-white rounded-md shadow-lg w-96 ${!isOpen ? "hidden" : "flex-1"}`}
        ref={ref}>

        <div className="flex flex-col flex-1 w-full">
          <div className="flex justify-between px-5 py-5 border-b border-b-black/10">
            <p className="text-xl font-medium">Schedule Class</p>
            <IoClose
              onClick={() => {
                onclose();
                setAddScheduleModalOpen(false);
              }}
              className="cursor-pointer"
            />

          </div>
          <div className="flex flex-col flex-1 w-full">
            <div className="flex flex-col justify-center px-8 flex-1 w-full">
              <div className="flex justify-end">
                <div className="p-2 border-grey/10"></div>
              </div>
              <div className="flex flex-col items-center justify-center text-center">
                <img src={IMAGES.classModal} alt="" className="w-28 h-28" />
              </div>
              <div className="flex flex-col w-full flex-1 gap-1 px-2 py-1 overflow-y-auto custom-scrollbar">

                <CustomSelectableField
                  options={teacherSubjects}
                  label={"Select Subject"}
                  selectedOption={selectedSubject}
                  setSelectedOption={setSelctedSubject}
                />
                <CusotmInputField
                  type={"text"}
                  icon={"mail"}
                  name={"title"}
                  title={"Topic"}
                  selectable={false}
                  status={allowedEdit}
                  value={classObj.title}
                  valuesObj={classObj}
                  setValue={setClassObj}
                />

                <CustomMultiSelectableField
                  label={"Select Classroom"}
                  options={allClassrooms}
                  selectedOption={selectedClassrooms}
                  setSelectedOption={setSelectedClassrooms}
                  isMulti={true}
                />
                <CusotmInputField
                  type={"text"}
                  name={"meetingUrl"}
                  title={"Meeting URL"}
                  valuesObj={classObj}
                  setValue={setClassObj}
                  value={classObj.meetingUrl}
                  status={allowedEdit}
                />

                <div>
                  <CusotmInputField
                    icon={"cap"}
                    type={"date"}
                    title={"Start Event Date"}
                    name={"startEventDate"}
                    selectable={false}
                    valuesObj={classObj}
                    status={allowedEdit}
                    setValue={setClassObj}
                    value={classObj.startEventDate}
                  />
                  <CusotmInputField
                    icon={"cap"}
                    type={"date"}
                    title={"End Event Date"}
                    name={"endEventDate"}
                    selectable={false}
                    valuesObj={classObj}
                    status={allowedEdit}
                    setValue={setClassObj}
                    value={classObj.endEventDate}
                  />
                </div>
                <div className="flex gap-2 my-4 flex-wrap">
                  {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                    <label key={day} className="flex items-center gap-1">
                      <input
                        type="checkbox"
                        checked={selectedDays.includes(day)}
                        onChange={() => handleDayCheckboxChange(day)}
                      />
                      {day}
                    </label>
                  ))}
                </div>

                <div className="flex gap-2">
                  <CusotmInputField
                    type={"time"}
                    icon={"calendar"}
                    name={"startTime"}
                    selectable={false}
                    title={"Start Time"}
                    valuesObj={classObj}
                    status={allowedEdit}
                    setValue={setClassObj}
                    value={classObj.startTime}
                  />
                  <CusotmInputField
                    type={"time"}
                    icon={"cake"}
                    name={"endTime"}
                    title={"End Time"}
                    selectable={false}
                    status={allowedEdit}
                    valuesObj={classObj}
                    setValue={setClassObj}
                    value={classObj.endTime}
                  />


                </div>



                <div className="py-8 border-t border-black/20">
                  <div className="flex items-center gap-2">
                    <div className="flex justify-between gap-4 w-full">
                      {!classCreateMutate.isPending && (
                        <>
                          <FilterButton text={"Schedual Class"} className={"px-4 py-2 w-full text-sm"} clickHandler={() => handleSchedualClass()} />
                          <FilterButton text={"Cancel"} className={"px-4 py-2 w-full text-sm bg-white border !text-[#0B1053]"} clickHandler={() => setaddEventModalOpen(false)} />
                        </>
                      )}
                    </div>
                  </div>
                  {classCreateMutate.isPending && <div><Loader /></div>}
                </div>

                {!classCreateMutate.isPending && allowedEdit &&
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
    );
  };

  const [classModal, setClassModal] = useState(false);

  const [isOpen, setIsOpen] = useState(addScheduleModalOpen);


  return (
    <div>
      <div>
        <div>
          <SchedualClassesComponent
            onclose={() => setAddScheduleModalOpen(false)} // Ensure parent state updates
            isOpen={addScheduleModalOpen}
          />
        </div>
      </div>
    </div>
  );
};

export default SchedualClasses;
