import React from "react";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  UserCircle2,
  Mail,
  RefreshCcw,
  Search,
  ChevronUp,
  ChevronDown,
  Phone,
  Edit,
} from "lucide-react";
import { getUserProfile } from "../../services/user.api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fullName = `${user?.firstName || "Unknown"} ${user?.lastName || "User"}`;

  //! Fetch user profile
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await getUserProfile(userId);
        const payload = res?.data?.data || {};
        setUser(payload);
      } catch (error) {
        const message =
          error?.response?.data?.message || "Failed to fetch user";
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId]);

  //! Stats
  const stats = [
    {
      title: "Total Logged Time",
      value: "00:00",
    },
    {
      title: "Last Month Logged Time",
      value: "00:00",
    },
    {
      title: "This Month Logged Time",
      value: "00:00",
    },
    {
      title: "Last Week Logged Time",
      value: "00:00",
    },
    {
      title: "This Week Logged Time",
      value: "00:00",
    },
  ];

  //! Render
  return (
    <div className="min-h-screen p-6">
      {/* header */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
        {stats.map((item, index) => (
          <div
            key={index}
            className="rounded-md border border-gray-200 bg-white px-3 py-2 shadow-sm"
          >
            <h3
              className={`text-[13px] font-medium ${index % 2 === 0 ? "text-green-600" : "text-[#0284C7]"}`}
            >
              {item.title}
            </h3>

            <p className="mt-1 text-sm font-semibold text-blue-600">
              {item.value}
            </p>
          </div>
        ))}
      </div>
      {/* content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
        {/* left side */}
        <div>
          {/* profile card */}
          <div className="rounded-md border border-gray-200 bg-white shadow-sm">
            <div className="px-6 py-4">
              {/* user */}
              <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 -ms-1">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">

                    <img src={user?.profileImage || "https://placehold.net/avatar-2.png"} alt="profile" className="w-10 h-10 rounded-full" />
                </div>

                <h2 className="text-xl font-semibold text-gray-700">
                  {fullName}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => navigate(`/admin/profile/${userId}/edit`)} className=" cursor-pointer rounded-md border border-gray-200 p-2 text-gray-700 hover:bg-slate-100">
                  <Edit size={16} />
                </button>
              </div>
              </div>

              {/* email */}
              <div className="mt-4 flex flex-col gap-2 text-sm text-blue-600">
                <div className="flex items-center gap-2">
                  <Mail size={16}  />
                  <span>{user?.email || "N/A"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={16}  />
                  <span>{user?.phone || "N/A"}</span>
                </div>
              </div>

              {/* project table */}
              <div className="mt-8">
                <h3 className="mb-4 text-xl font-semibold text-gray-700">
                  Projects
                </h3>

                {/* table controls */}
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <select className=" cursor-pointer rounded-md border border-gray-200 px-3 py-2 text-xs text-gray-700 outline-none">
                      <option value="100">100</option>
                      <option value="50">50</option>
                      <option value="25">25</option>
                    </select>

                    <button className=" cursor-pointer rounded-md border border-gray-200 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-slate-50">
                      Export
                    </button>

                    <button className=" cursor-pointer rounded-md border border-gray-200 p-2 text-xs text-gray-700 hover:bg-slate-50">
                      <RefreshCcw size={16} />
                    </button>
                  </div>

                  {/* search */}
                  <div className="flex items-center overflow-hidden rounded-md border border-gray-200">
                    <div className="border-r border-gray-200 bg-white p-2">
                      <Search size={16} className="text-gray-600" />
                    </div>

                    <input
                      type="text"
                      placeholder="Search..."
                      className="p-2 outline-none text-gray-600 text-xs "
                    />
                  </div>
                </div>

                {/* table */}
                <div className="overflow-x-auto rounded-md border border-gray-200">
                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">
                          Project Name
                        </th>

                        <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">
                          Start Date
                        </th>

                        <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">
                          Deadline
                        </th>

                        <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">
                          <div
                            className="flex items-center gap-1 cursor-pointer"
                            onClick={() => setOpen(!open)}
                          >
                            Status
                            {open ? (
                              <ChevronUp size={16} />
                            ) : (
                              <ChevronDown size={16} />
                            )}
                          </div>
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      <tr>
                        <td
                          colSpan={4}
                          className="px-4 py-6 text-sm text-slate-500"
                        >
                          No entries found
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* right side */}
        <div>
          <div className="rounded-md bg-transparent">
            <div className="flex items-center gap-2 border-b border-gray-300 pb-4">
              <h2 className="text-xl font-semibold text-gray-700">
                Notifications
              </h2>

              <button className=" cursor-pointer text-xs text-blue-600 hover:text-blue-700">
                Mark all as read
              </button>
            </div>

            <div className="mt-6">
              <button className="cursor-pointer rounded-md bg-blue-500 px-3 py-2 font-medium text-sm text-white hover:bg-blue-600">
                Load More
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
