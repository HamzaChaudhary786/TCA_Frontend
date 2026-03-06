import React, { useEffect, useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { formatDate } from "../../../constants/formattedDate";
import moment from "moment";

const GradeQuizAssignmentRow = React.memo((props) => {
  const [timePassed, setTimePassed] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");
  const [arrowActive, setArrowActive] = useState(false);


  const handleChange = (field) => (event) => {
    console.log("field data is : ", field, event.target.value)
    props.setInputField(props.id, field, event.target.value);
  };


  const toggleArrowActive = () => {
    setArrowActive(!arrowActive);
  };

  const compareDateAndTime = (dateTimeString) => {
    const eventDateTime = new Date(dateTimeString);
    const currentDateTime = new Date();

    if (eventDateTime < currentDateTime) {
      setTimePassed(true);
    } else {
      setTimePassed(false);
      // Calculate the difference in milliseconds
      const difference = eventDateTime - currentDateTime;
      // Convert the difference to days, hours, minutes, and seconds
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / (1000 * 60)) % 60);
      const seconds = Math.floor((difference / 1000) % 60);
      // Update the timeLeft state with days included
      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    }
  };


  useEffect(() => {
    const formattedDateTimeString = props.submission
      .replace(/(\d+)(st|nd|rd|th)/, "$1") // Removes 'st', 'nd', 'rd', 'th'
      .replace(",", "")
      .replace(
        /(\d+)([ap]m)$/i,
        (match, p1, p2) => `${p1} ${p2.toUpperCase()}`
      ); // Ensures AM/PM is capitalized and properly spaced

    compareDateAndTime(formattedDateTimeString);

    const intervalId = setInterval(() => {
      compareDateAndTime(formattedDateTimeString);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [props.deadline]);

  // const [grade, setGrade] = useState("");
  // const [marks, setMarks] = useState("");
  // const [feedback, setFeedback] = useState("");

  // useEffect(() => {

  //   let val = (props.marks / props?.dataGrade?.totalMarks) * 100;
  //   console.log(" val is : ", val);
  //   console.log("grade data : ", props?.dataGrade);
  //   console.log("marks are : ", parseFloat(props.marks))
  //   if (val >= 90) {
  //     props.setGradeStr("A+")
  //   } else if (val >= 80) {
  //     props.setGradeStr("A-")
  //   } else if (val >= 70) {
  //     props.setGradeStr("B+")
  //   } else if (val >= 60) {
  //     props.setGradeStr("B-")
  //   } else if (val >= 50) {
  //     props.setGradeStr("C+");
  //   } else {
  //     props.setGradeStr("F")
  //   }

  // }, [props.marks]);

  // useEffect(() => {
  //   props?.handleChangeData({marks, grade, feedback})
  // }, [marks, grade, feedback])

  return (
    <div className="min-w-full">
      <div
        style={{ backgroundColor: props.bgColor }}
        className={`min-w-full border-b flex flex-col border-grey justify-center`}
      >
        <div className="flex items-center min-w-full">
          <div className="flex flex-row items-center flex-1 py-2 mt-2 overflow-x-auto  md:py-5 md:pl-3 md:pr-5 space-x-5">
            <p
              className={`w-full md:flex-1 flex-1 md:text-[14px] text-[11px] text-center md:text-left ${props.header ? "font-semibold" : ""
                }`}
            >
              {props.index + "."}
            </p>
            <p
              className={`w-full md:flex-[3] my-1 md:my-0 items-center flex gap-4 text-center md:text-center md:text-[14px]  text-[11px] ${props.header ? "font-semibold" : ""
                }`}
            >
              {!props.header ? (
                <img src={props?.profileLink} alt="profile link" className="sm:w-12 w-8 h-8 sm:h-12 rounded-full object-cover" />
              ) : (
                <></>
              )}
              {props?.name}
            </p>
            <p
              className={`w-full md:flex-[3] my-1 md:my-0 text-center md:text-center  md:text-[14px]  text-[11px] ${props.header ? "font-semibold " : ""
                }`}
            >
              {props.header ? props?.submission : props?.submission == "Not Submitted Yet" ? "Not Submitted Yet" : moment(props.submission).format("Do MMM YYYY hh:mm a")}
            </p>
            <p
              className={`w-full md:flex-[3] my-1 md:my-0 text-center md:text-center  md:text-[14px]  text-[11px] ${props.header ? "font-semibold " : ""
                }`}
            >
              {!props.header ? (
                <input
                  type="number"
                  placeholder="Marks"
                  value={props.marks}
                  onChange={handleChange('marks')}
                  className="w-20 px-2 py-2 border rounded-md outline-none border-black/20"
                />
              ) : (
                props?.marksObtained
              )}
            </p>
            <p
              className={`w-full md:flex-[3] my-1 md:my-0 text-center md:text-center  md:text-[14px]  text-[11px] ${props.header ? "font-semibold " : ""
                }`}
            >
              {!props.header ? (
                <input
                  type="text"
                  value={props.grade}
                  placeholder="Grade"
                  onChange={handleChange('grade')}
                  className="w-20 px-2 py-2 border rounded-md outline-none border-black/20"
                />
              ) : (
                props?.grade
              )}
            </p>
          </div>
          <div className="flex w-4 mr-5 cursor-pointer">
            <p
              onClick={() => {
                console.log("download the resource");
              }}
              className={`w-full my-1 md:my-0 text-center md:text-center md:text-[20px] text-[14px] ${props.header ? "" : ""
                }`}
            >
              {!props.header ? (
                !arrowActive ? (
                  <IoIosArrowDown onClick={toggleArrowActive} />
                ) : (
                  <IoIosArrowUp onClick={toggleArrowActive} />
                )
              ) : (
                <></>
              )}
            </p>
          </div>
        </div>
        {arrowActive ?
          <div
            className={`${props.header
              ? "hidden"
              : "py-4 flex gap-4 items-center px-10 flex-1"
              }`}
          >
            <p>Feedback: </p>
            <input
              type="text"
              placeholder="Feedback"
              value={props.feedback}
              onChange={handleChange('feedback')}
              className="flex w-4/5 px-2 py-2 border rounded-lg outline-none border-black/20"
            />
          </div>
          : <></>}
      </div>
    </div>
  );
});

export default GradeQuizAssignmentRow;
