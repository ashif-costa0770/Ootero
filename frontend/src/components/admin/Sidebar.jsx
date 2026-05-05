import { NavLink, useLocation, useNavigate } from "react-router-dom";
import Logo from "../common/Logo";
import {
  LayoutDashboard, // Dashboard
  ShoppingCart,           // WooCommerce (section)
  Package,         // Orders
  PieChart,      // Manifest
  MapPin,          // Tracking
  Target,          // Payloads
  Store,           // Stores
  LogOut,          // Logout
  ChevronDown,
} from "lucide-react";
import NavItem from "./NavItem";
import SubNavItem from "./SubNavItem";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { toast } from "sonner";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [wooOpen, setWooOpen] = useState(true);
  const { logout } = useAuth();
  const matchedStoreId = location.pathname.match(/^\/admin\/woocommerce\/([^/]+)\//)?.[1];
  const activeStoreId = matchedStoreId || localStorage.getItem("activeStoreId");

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };
  return (
    <div className="py-4 px-2 flex flex-col items-start space-y-4 h-full">
      <div className="max-w-32 ml-6 my-6">
        <Logo />
      </div>

      <div className="flex flex-col justify-between space-y-2 h-full">
        <div>
          <NavItem
            icon={<LayoutDashboard size={16} />}
            label="Dashboard"
            active={location.pathname === "/admin"}
            onClick={() => navigate("/admin")}
          />

          <div>
            <button
              onClick={() => setWooOpen(!wooOpen)}
              className="cursor-pointer w-full flex items-center gap-2.5 px-4 py-2 text-gray-300
                       hover:text-white hover:bg-white/5 rounded-lg mx-2 text-sm"
            >
              <ShoppingCart size={16} />
              WooCommerce
              <ChevronDown
                size={16}
                className={`ml-auto transition-transform
              ${wooOpen ? "" : "-rotate-90"}`}
              />
            </button>

            {wooOpen && (
              <div className="pl-6">
                {["Orders", "Manifest", "Tracking", "Payloads"].map((item) => (
                  <SubNavItem
                    key={item}
                    icon={
                      item === "Orders" ? (
                        <Package size={16} />
                      ) : item === "Manifest" ? (
                        < PieChart size={16} />
                      ) : item === "Tracking" ? (
                        <MapPin size={16} />
                      ) : (
                        <Target size={16} />
                      )
                    }
                    label={
                      item === "Orders"
                        ? "Orders"
                        : item === "Manifest"
                          ? "Manifest"
                          : item === "Tracking"
                            ? "Tracking"
                            : "Payloads"
                    }
                    active={
                      location.pathname === `/admin/woocommerce/${activeStoreId}/${item.toLowerCase()}`
                    }
                    onClick={() => {
                      if (!activeStoreId) {
                        toast.error("Select a store first to continue.");
                        return;
                      }
                      navigate(`/admin/woocommerce/${activeStoreId}/${item.toLowerCase()}`);
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
        {/* bottom nav items */}
        <div >
          <NavItem
            icon={<Store size={16} />}
            label="Stores"
            active={location.pathname === "/admin/stores"}
            onClick={() => navigate("/admin/stores")}
          />
          <NavItem
            icon={<LogOut size={16} />}
            label="Logout"
            active={location.pathname === "/admin/logout"}
            onClick={handleLogout}
          />
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
