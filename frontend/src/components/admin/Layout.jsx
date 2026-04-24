import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

function Layout() {
  return (
    <div className="flex h-screen bg-gray-100">
      
      {/* Sidebar (fixed) */}
      <div className="w-58 h-full bg-slate-800 text-white">
        <Sidebar />
      </div>

      {/* Right Section */}
      <div className="flex-1 flex flex-col">
        
        {/* Header */}
        <div className="h-16 bg-white shadow-sm">
          <Header />
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