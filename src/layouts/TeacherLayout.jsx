import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Teacher/Sidebar/Sidebar';

const TeacherLayout = ({children}) => {
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Teacher layout is active");
  }, []);
  return (
    <>
    <div className="flex">
       <div className="fixed flex">
         <Sidebar />
       </div>
       {children}
     </div>
    </>
  )
}

export default TeacherLayout
