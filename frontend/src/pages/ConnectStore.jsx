import React from "react";
import { useLocation } from "react-router-dom";
import FollowSteps from "../components/FollowSteps";
import StoreForm from "../components/form/StoreForm";

const ConnectStore = () => {
  const location = useLocation();
  const selectedPlatform = location.state?.selectedPlatform || "woocommerce";

  return (
    <div className="flex flex-col lg:flex-row gap-8 p-4 sm:p-6 bg-gray-50 w-full">
      <FollowSteps />
      <StoreForm selectedPlatform={selectedPlatform} />
    </div>
  );
};

export default ConnectStore;