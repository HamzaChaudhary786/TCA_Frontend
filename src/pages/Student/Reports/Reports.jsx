import React, { useEffect } from 'react'
import Navbar from '../../../components/Student/Dashboard/Navbar'
import DataRows from '../../../components/Student/Reports/DataRows'

import { useNavigate } from 'react-router-dom'
import { useBlur } from '../../../context/BlurContext'
import { useStudent } from '../../../context/StudentContext'
import { getAllSubjects } from '../../../api/Student/Subjects'
import { useQuery } from '@tanstack/react-query'
import { useUser } from '../../../context/UserContext'


const Reports = () => {

  const navigate = useNavigate();
  const { isBlurred } = useBlur();
  const { allSubjects, setAllSubjects } = useStudent();

  const { userData } = useUser();

  const handleFunctionClick = (report) => {
    console.log("i am click")
      navigate(`/reports/${report.subject.name}`, { state: report });
  };

  const subjectQuery = useQuery({
    queryKey: ["subjects"], queryFn: async () => {
      const results = await getAllSubjects(userData._id);
      console.log("inside reports")
      setAllSubjects(results);
      return results
    }, staleTime: 300000, enabled: allSubjects.length == 0
  });
  return (
    <div className="flex flex-1 bg-[#F9F9F9] font-poppins">
      <div className="flex flex-1">
        <div className={`w-full h-screen px-3 lg:px-20 sm:px-10  flex-grow lg:ml-72`}
        >
          <div className='h-screen pt-1'>
            <Navbar heading={"Reports"} />
            <div className={` ${isBlurred ? "blur" : ""}`}>
              <div className='mt-8 h-[80%] overflow-auto'>
                <DataRows index={"Sr. No"}
                  subject={"Subject"}
                  instructor={"Instructor"}
                  attendance={"Attendance"}
                  bgColor={"#F9F9F9"}
                  header={true}
                />
                {
                  allSubjects?.subjects?.length > 0 ? (
                    allSubjects.subjects.map((report, index) => (
                      <DataRows
                        index={index + 1}
                        key={index + 1}
                        subject={report.subject.name}
                        instructor={report.teacher}
                        attendance={report.avgAttendancePer}
                        bgColor={"#FFFFFF"}
                        header={false}
                        onClickFunction={() => handleFunctionClick(report)}
                      />
                    ))
                  ) : (
                    <div className='flex w-full justify-center'>
                      <p className='font-medium text-2xl py-4'>No subjects to display</p>
                    </div>
                  )
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
