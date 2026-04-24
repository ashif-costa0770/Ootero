import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
// import Navbar from "./components/Navbar";
import { Toaster } from "sonner";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import PlatformSelect from "./pages/PlatformSelect";
import ConnectStore from "./pages/ConnectStore";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import PublicOnlyRoute from "./components/auth/PublicOnlyRoute";
import StoreDetails from "./pages/StoreDetails";
import Layout from "./components/admin/Layout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Orders from "./pages/admin/Orders";
import Tracking from "./pages/admin/Tracking";
import Manifest from "./pages/admin/Manifest";
import Payloads from "./pages/admin/Payloads";
import Store from "./pages/admin/Store";
function App() {
  return (
    <>
      {/* <Navbar/> */}
      <Routes>
        <Route path="/" element={<Home />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/platform-select" element={<PlatformSelect />} />
          <Route path="/connect-store" element={<ConnectStore />} />
          <Route path="/store-details/:storeId" element={<StoreDetails />} />
        </Route>

        <Route element={<PublicOnlyRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>

        {/* ADMIN ROUTES (WITH LAYOUT) */}
        <Route path="/admin" element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="woocommerce/:storeId/orders" element={<Orders />} />
            <Route path="woocommerce/manifest" element={<Manifest />} />
            <Route path="woocommerce/tracking" element={<Tracking />} />
            <Route path="woocommerce/payloads" element={<Payloads />} />
            <Route path="stores" element={<Store />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>

      <Toaster position="top-right" richColors />
    </>
  );
}

export default App;
