import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Student/Sidebar/Sidebar";

const StudentLayout = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    console.log("layout is active");
  }, []);
  return (
    <div className="flex">
      <div className="fixed flex z-20">
        <Sidebar />
      </div>
      {children}
    </div>
  );
};

export default StudentLayout;
