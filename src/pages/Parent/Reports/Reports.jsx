import React, { useEffect, useState } from 'react'
import Navbar from '../../../components/Parent/Dashboard/Navbar'
import DataRows from '../../../components/Parent/Reports/DataRows'

import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useBlur } from '../../../context/BlurContext'
import { useParent } from '../../../context/ParentContext'
import { getAllSubjects } from '../../../api/Parent/ParentApi'




const Reports = () => {
  const [mail, setmail] = useState(false);
  const [bell, setBell] = useState(false);
  const [isProfileMenu, setIsProfileMenu] = useState(false);
  const [isProfileDetails, setIsProfileDetails] = useState(false);

  const { isBlurred, toggleBlur } = useBlur();

  const toggleProfielMenu = () => {
    setIsProfileMenu(!isProfileMenu);
    setmail(false);
    setBell(false);
  };

  const toggleMail = () => {
    setmail(!mail);
    setIsProfileMenu(false);
    setBell(false);
  };

  const togglebell = () => {
    setBell(!bell);
    setmail(false);
    setIsProfileMenu(false);
  };

  const toggleProfileDetails = () => {
    toggleBlur();
    setIsProfileDetails(!isProfileDetails);
  };

  const onProfileClick = () => {
    toggleProfielMenu();
    toggleProfileDetails();
  };

  const onSettingsClick = () => { };
  const onLogoutClick = () => { };

  const navigate = useNavigate()
  const reports = [
    {
      subject: "Mathematics",
      instructor: "John Smith",
      attendance: "70%",
    },
    {
      subject: "English",
      instructor: "John Smith",
      attendance: "70%",
    },
    {
      subject: "Urdu",
      instructor: "John Smith",
      attendance: "70%",
    },
    {
      subject: "Chemistry",
      instructor: "John Smith",
      attendance: "70%",
    },
    {
      subject: "Biology",
      instructor: "John Smith",
      attendance: "70%",
    },
    {
      subject: "Islamiyat",
      instructor: "John Smith",
      attendance: "70%",
    },
    {
      subject: "History",
      instructor: "John Smith",
      attendance: "70%",
    },
  ];

  const handleFunctionClick = (report) => {
    //console.log("selected report is : ", report);
    navigate(`/parent/reports/${report.subject.name}`, { state: report });
  };

  const [enableQuery, setEnableQuery] = useState(false);


  const { allSubjects, setAllSubjects, selectedChild } = useParent();

  const subjectQuery = useQuery({
    queryKey: ["subjects"], queryFn: async () => {
      const results = await getAllSubjects(selectedChild._id);
      setAllSubjects(results);
      console.log("inside dashboard");
      //console.log("subject report data is  : ", results);
      return results
    }, staleTime: 300000, enabled: enableQuery
  });

  useEffect(() => {
    if (allSubjects.length == 0) {
      setEnableQuery(true);
    }
  }, []);

  return (
    <>
      <div className="flex flex-1 bg-[#F9F9F9] font-poppins">
        <div className="flex flex-1">
          <div className={`w-full h-screen lg:px-20 sm:px-10 px-2  flex-grow lg:ml-72`}>
            <div className='h-screen'>
              <Navbar heading={"Reports"} />
              <div className=' mt-4 sm:mt-8 h-[80%] overflow-auto'>
                <DataRows index={"Sr. No"} subject={"Subject"} instructor={"Instructor"} attendance={"Attendance"} bgColor={"#F9F9F9"} header={true} />
                {
                  allSubjects?.subjects && allSubjects?.subjects.length > 0 ? (
                    allSubjects.subjects.map((report, index) => (
                      <DataRows
                        key={index}
                        index={index + 1}
                        subject={report?.subject?.name}
                        instructor={report?.teacher?.name}
                        attendance={report?.avgAttendancePer}
                        bgColor={"#FFFFFF"}
                        header={false}
                        onClickFunction={() => handleFunctionClick(report)}
                      />
                    ))
                  ) : (
                    <div className="text-center text-2xl font-semibold text-gray-500 py-4">
                      No Reports Found
                    </div>
                  )
                }

              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Reports;
