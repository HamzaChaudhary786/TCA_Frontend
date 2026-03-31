import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import Sidebar from "../components/Parent/Sidebar/Sidebar"

const ParentLayout = ({children}) => {
  const navigate = useNavigate();

  useEffect(() => {
    console.log("layout is active");
  }, []);
  return (
    <div className="flex">
      <div className="fixed flex">
        <Sidebar />
      </div>
      {children}
    </div>
  );
}

export default ParentLayout
