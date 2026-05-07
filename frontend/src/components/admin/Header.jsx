import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { getAllStores } from "../../services/store.api";
import {
  Plus,
  PanelLeft,
  Bell,
  Share2,
  CheckCircle,
  User,
  Clock,
  Building2,
  ChevronDown,
} from "lucide-react";
import SearchInput from "../common/SearchInput";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Header = ({ sidebarOpen, setSidebarOpen }) => {
  const [stores, setStores] = useState([]);
  const [selectedStoreId, setSelectedStoreId] = useState("");
  const [loadingStores, setLoadingStores] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { storeId } = useParams();
  const showStoreDropdown = Boolean(storeId);
  const location = useLocation();
  const { user } = useAuth();
  const { logout } = useAuth();

  //! Handle logout
  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  //! Fetch stores
  useEffect(() => {
    const fetchStores = async () => {
      try {
        setLoadingStores(true);
        const res = await getAllStores();
        const fetchedStores = res?.data?.data || [];
        setStores(fetchedStores);

        // fetch active store id from local storage
        const savedStoreId = localStorage.getItem("activeStoreId");
        const pathStoreId = storeId || localStorage.getItem("activeStoreId");

        const preferredStoreId = pathStoreId || savedStoreId;

        const isPreferredValid = fetchedStores.some(
          (store) => String(store.id) === String(preferredStoreId),
        );

        const initialStoreId = isPreferredValid
          ? String(preferredStoreId)
          : String(fetchedStores[0]?.id || "");

        setSelectedStoreId(initialStoreId);

        if (initialStoreId) {
          localStorage.setItem("activeStoreId", initialStoreId);
        }
      } catch (error) {
        const message =
          error?.response?.data?.message || "Failed to fetch stores";
        toast.error(message);
      } finally {
        setLoadingStores(false);
      }
    };
    fetchStores();
  }, []);

  //! Handle store change
  const handleStoreChange = (e) => {
    const newStoreId = e.target.value;
    setSelectedStoreId(newStoreId);
    localStorage.setItem("activeStoreId", newStoreId);

    // Replace only the current route storeId segment
    if (storeId) {
      const nextPath = location.pathname.replace(
        `/${storeId}/`,
        `/${newStoreId}/`,
      );
      if (nextPath !== location.pathname) {
        navigate(nextPath);
        return;
      }
    }

    // Fallback only if current route has no replaceable storeId
    navigate(`/admin/woocommerce/${newStoreId}/orders`);
  };

  return (
    <div className="h-full flex items-center justify-between px-4">
      {/* left side */}
      <div className="flex items-center gap-4">
        <button
          className=" cursor-pointer rounded-full"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
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
      <div className="flex items-center gap-12 pr-8 ">
        {/* store selection dropdown */}
        {showStoreDropdown && (
          <div className="relative">
            <Building2
              size={15}
              className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-slate-500"
            />
            <select
              value={selectedStoreId}
              onChange={handleStoreChange}
              disabled={loadingStores || stores.length === 0}
              className="h-10 min-w-[210px] max-w-[300px] cursor-pointer appearance-none rounded-xl border border-slate-200 bg-slate-50/80 pl-9 pr-10 text-sm font-medium text-slate-700 shadow-sm outline-none transition-all duration-200 hover:border-slate-300 hover:bg-white focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
            >
              {loadingStores ? (
                <option value="">Loading stores...</option>
              ) : stores.length === 0 ? (
                <option value="">No stores found</option>
              ) : (
                stores.map((store) => (
                  <option
                    key={store.id}
                    value={String(store.id)}
                    className=" cursor-pointer text-sm font-medium text-slate-700"
                  >
                    {store.name}
                  </option>
                ))
              )}
            </select>
            <ChevronDown
              size={16}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
            />
          </div>
        )}
        <div className="flex items-center gap-4">
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
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className=" cursor-pointer w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center"
            >
              <img
                src={user?.profileImage || "https://placehold.net/avatar-2.png"}
                alt="profile"
                className="w-10 h-10 rounded-full"
              />
            </button>
            {/* dropdown */}
            {isDropdownOpen && (
              <div
                className="
          absolute top-12 right-0 w-38 rounded-lg bg-white shadow-lg border border-gray-200
          transition-all duration-200
          overflow-hidden
          z-50
        "
              >
                <button
                  onClick={() => setIsDropdownOpen(false)}
                  className=" cursor-pointer w-full px-4 py-2 text-left hover:bg-gray-100 text-sm font-medium text-gray-700"
                >
                  <Link to={`/admin/profile/${user?.id}`}>My Profile</Link>
                </button>

                <button
                  onClick={() => setIsDropdownOpen(false)}
                  className=" cursor-pointer w-full px-4 py-2 text-left hover:bg-gray-100 text-sm font-medium text-gray-700"
                >
                  My Timesheets
                </button>

                <button
                  onClick={() => setIsDropdownOpen(false)}
                  className=" cursor-pointer w-full px-4 py-2 text-left hover:bg-gray-100 text-sm font-medium text-gray-700"
                >
                  <Link to={`/admin/profile/${user?.id}/edit`}>Edit Profile</Link>
                </button>

                <button
                  onClick={handleLogout}
                  className=" cursor-pointer w-full px-4 py-2 text-left hover:bg-gray-100 text-sm font-medium text-red-500"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          <button className="relative  cursor-pointer rounded-full group">
            <Clock size={20} className=" text-gray-600" />
            <span
              className="pointer-events-none absolute top-full mt-5 left-1/2 -translate-x-1/2 
               whitespace-nowrap rounded bg-gray-700 px-2 py-1 text-xs text-white 
               opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            >
              My Timesheet
            </span>
          </button>
          <button className="relative  cursor-pointer rounded-full group">
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
    </div>
  );
};

export default Header;
