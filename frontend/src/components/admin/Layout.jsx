import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useState } from "react";
function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  return (
    <div className="flex h-screen bg-gray-100">
      
      {/* Sidebar (fixed) */}
      <div className={` ${sidebarOpen ? "w-58" : "w-0"} transition-all duration-100 h-full bg-slate-800 text-white`}>
        <Sidebar />
      </div>

      {/* Right Section */}
      <div className="flex-1 flex flex-col">
        
        {/* Header */}
        <div className="h-16 bg-white shadow-sm">
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <Outlet />
        </div>

      </div>
    </div>
  );
}

export default Layout;