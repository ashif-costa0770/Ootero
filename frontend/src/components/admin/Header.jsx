import React from "react";
import {
  Plus,
  PanelLeft,
  Bell,
  Share2,
  CheckCircle,
  User,
  Clock,
} from "lucide-react";
import SearchInput from "../common/SearchInput";
const Header = () => {
  return (
    <div className="h-full flex items-center justify-between px-4">
      {/* left side */}
      <div className="flex items-center gap-4">
        <button className=" cursor-pointer rounded-full">
          <PanelLeft size={20} className=" text-gray-600" />
        </button>
        <SearchInput placeholder="Search..." />
        {/* add button */}
        <button className="relative cursor-pointer bg-blue-500 text-white p-1.5 rounded-full group">
          <Plus size={20} />
          <span
            className="pointer-events-none absolute top-full mt-5 left-1/2 -translate-x-1/2 
               whitespace-nowrap rounded bg-gray-700 px-2 py-1 text-xs text-white 
               opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          >
            Quick Add
          </span>
        </button>
      </div>

      {/* right side profile */}
      <div className="flex items-center gap-4 pr-4 ">
        <button className="relative mr-2 cursor-pointer rounded-full group">
          <Share2 size={20} className="text-gray-600" />

          <span
            className="pointer-events-none absolute top-full mt-5 left-1/2 -translate-x-1/2 
               whitespace-nowrap rounded bg-gray-700 px-2 py-1 text-xs text-white 
               opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          >
            Share documents
          </span>
        </button>
        <button className="relative mr-2 cursor-pointer rounded-full group">
          <CheckCircle size={20} className=" text-gray-600" />
          <span
            className="pointer-events-none absolute top-full mt-5 left-1/2 -translate-x-1/2 
               whitespace-nowrap rounded bg-gray-700 px-2 py-1 text-xs text-white 
               opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          >
            Todo items
          </span>
        </button>
        <button className="relative bg-gray-200 p-2 border border-blue-400 cursor-pointer rounded-full group">
          <User size={22} className=" text-gray-500" />
          <span
            className="pointer-events-none absolute top-full mt-5 left-1/2 -translate-x-1/2 
               whitespace-nowrap rounded bg-gray-700 px-2 py-1 text-xs text-white 
               opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          >
            Profile
          </span>
        </button>
        <button className="relative border border-gray-300 p-1.5 hover:bg-gray-200 cursor-pointer rounded-full group">
          <Clock size={20} className=" text-gray-600" />
          <span
            className="pointer-events-none absolute top-full mt-5 left-1/2 -translate-x-1/2 
               whitespace-nowrap rounded bg-gray-700 px-2 py-1 text-xs text-white 
               opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          >
            My Timesheet
          </span>
        </button>
        <button className="relative border border-gray-300 p-1.5 hover:bg-gray-200 cursor-pointer rounded-full group">
          <Bell size={20} className=" text-gray-600" />
          <span
            className="pointer-events-none absolute top-full mt-5 left-1/2 -translate-x-1/2 
               whitespace-nowrap rounded bg-gray-700 px-2 py-1 text-xs text-white 
               opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          >
            Notifications
          </span>
        </button>
      </div>
    </div>
  );
};

export default Header;
