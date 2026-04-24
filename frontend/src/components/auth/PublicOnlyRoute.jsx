import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const PublicOnlyRoute = () => {
  const { isLoggedIn, loading, user } = useAuth();

  if (loading) return <div>Checking session...</div>;

  if (!isLoggedIn) return <Outlet />;

  if (user?.role === "ADMIN") {
    const activeStoreId = localStorage.getItem("activeStoreId");
    return (
      <Navigate
        to={
          activeStoreId
            ? `/admin/woocommerce/${activeStoreId}/orders`
            : "/admin/stores"
        }
        replace
      />
    );
  }

  return <Navigate to="/platform-select" replace />;
};

export default PublicOnlyRoute;