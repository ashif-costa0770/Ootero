import React, { useState } from "react";
import PlatformCard from "../components/common/PlatformCard";
import { platforms } from "../data/platforms";
import Logo from "../components/common/Logo";
import { useNavigate } from "react-router-dom";


const PlatformSelect = () => {
  const [selectedPlatform, setSelectedPlatform] = useState("woocommerce");
  const navigate = useNavigate();
  const handleSubmit = () => {
    navigate("/connect-store", { state: { selectedPlatform } });
  };

  return (
    <div className="min-h-screen flex flex-col">

    
      {/* Top Section */}
      <div className="bg-[#2563EB]  h-[280px] text-white text-center relative flex items-center justify-center pb-6 px-4">
        {/* Logo Section */}
        <div className="absolute top-5 left-9 w-1/2 lg:w-1/4">
          <Logo />
        </div>
        <h1 className="text-3xl font-bold leading-tight lg:text-5xl">
          Select Your <br /> ecommerce Platform
        </h1>
      </div>

      {/* Card Section */}
      <div className=" -mt-25 w-full flex justify-center rounded-t-3xl py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-8 max-w-4xl w-full px-4">
          {platforms.map((platform) => (
            <PlatformCard
              key={platform.id}
              data={platform}
              selected={selectedPlatform === platform.id}
              onSelect={setSelectedPlatform}
            />
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-center mt-4">
      <button
        className="cursor-pointer bg-[#2563EB] hover:bg-blue-700 active:scale-95 text-white font-semibold
                   px-14 py-3 rounded-xl transition-all duration-150"
        onClick={handleSubmit}
      >
        Submit
      </button>
    </div>
    </div>
  );
};

export default PlatformSelect;
