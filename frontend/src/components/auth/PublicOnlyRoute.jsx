import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const PublicOnlyRoute = () => {
  const { isLoggedIn, loading } = useAuth();

  if (loading) return <div>Checking session...</div>;

  return isLoggedIn ? <Navigate to="/platform-select" replace /> : <Outlet />;
};

export default PublicOnlyRoute;