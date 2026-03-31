import React from 'react'
import Sidebar from '../components/SuperAdmin/Sidebar/Sidebar';

const SuperAdminLayout = ({children}) => {
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

export default SuperAdminLayout;
