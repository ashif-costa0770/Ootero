import React from "react";
import woocommerce from "../assets/woocommerce_logo.svg";

const FollowSteps = () => {
  return (
    <div className="flex max-w-[515px] flex-col items-start justify-start rounded-4xl border border-gray-200 px-10 py-10 shadow-md bg-white">
      <img src={woocommerce} alt="woocommerce logo" />
      <p className="py-4 font-medium">WooCommerce Connection</p>
      <h2 className="py-2 text-[25px] font-semibold leading-tight text-[#000b2b]">
        Follow these steps to get connected:
      </h2>
      <div className="mt-4 space-y-2 text-[15px] text-gray-700">
        <div className="flex items-start">
          <span className="min-w-[40px] font-semibold text-[#2463ff]">01.</span>
          <span>Login into your existing WordPress admin panel</span>
        </div>
        <div className="flex items-start">
          <span className="min-w-[40px] font-semibold text-[#2463ff]">02.</span>
          <span>
            Within your WordPress Admin dashboard, navigate to the{" "}
            <span className="font-bold">WooCommerce</span> menu, then{" "}
            <span className="font-bold">Settings &gt; Integration.</span>
          </span>
        </div>
        <div className="flex items-start">
          <span className="min-w-[40px] font-semibold text-[#2463ff]">03.</span>
          <span>
            Copy the <span className="font-bold">Authentication Key</span> from
            WooCommerce and paste it below.
          </span>
        </div>
        <div className="flex items-start">
          <span className="min-w-[40px] font-semibold text-[#2463ff]">04.</span>
          <span>
            Navigate to the{" "}
            <span className="font-bold">
              Settings &gt; Advanced &gt; REST API
            </span>{" "}
            then click the <span className="font-bold">Add Key button</span>
          </span>
        </div>
            <div className="flex items-start">
          <span className="min-w-[40px] font-semibold text-[#2463ff]">05.</span>
          <span>
            Follow the instructions found here to create a key with{" "}
            <span className="font-bold">Read/Write</span> permissions for a user
            that has access to your store information and then click{" "}
            <span className="font-bold">Generate API Key</span>
          </span>
        </div>
        <div className="flex items-start">
          <span className="min-w-[40px] font-semibold text-[#2463ff]">06.</span>
          <span>
            Locate your <span className="font-bold">Consumer Key</span> and{" "}
            <span className="font-bold">consumer Secret</span> and paste those
            below.
          </span>
        </div>
        <div className="flex items-start">
          <span className="min-w-[40px] font-semibold text-[#2463ff]">07.</span>
          <span>
            Enter your WordPress site&apos;s domain (e.g.,{" "}
            <a href="http://www.yoursite.com" className="text-[#2463ff]">
              http://www.yoursite.com
            </a>{" "}
            ) into the field below.
          </span>
        </div>
        <div className="flex items-start">
          <span className="min-w-[40px] font-semibold text-[#2463ff]">08.</span>
          <span>
            When finished, click Save Changes in WooCommerce and then the{" "}
            <span className="font-bold">Connect</span> button below.
          </span>
        </div>
      </div>
    </div>
  );
};

export default FollowSteps;
