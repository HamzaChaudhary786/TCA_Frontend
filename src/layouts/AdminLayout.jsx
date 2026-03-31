import React from 'react'
import Sidebar from '../components/Admin/Sidebar/Sidebar';

const AdminLayout = ({ children }) => {
  return (
    <>
      <div className="flex max-w-full">
        <div className="fixed flex z-20">
          <Sidebar />
        </div>
        {children}
      </div>
    </>
  )
}

export default AdminLayout
