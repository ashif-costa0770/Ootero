import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = () => {
  const { isLoggedIn, loading } = useAuth();

  if (loading) return <div>Checking session...</div>;

  return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;