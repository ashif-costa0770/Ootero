import Logo from "../common/Logo";
import HeroText from "./HeroText";
import FeatureList from "./FeatureList";
import TestimonialCard from "./Testimonial";

const RightPanel = () => (
    <div className="flex-3 bg-[#2563EB] px-8 py-10  rounded-3xl lg:px-12 lg:py-6 lg:sticky lg:top-0 lg:min-h-screen lg:overflow-y-auto flex flex-col">
      <div className="max-w-xl mx-auto w-full">
        <div className="flex justify-end items-start mb-12">
          <div className="max-w-34">
            <Logo />
          </div>
        </div>
   
        <HeroText />
        <FeatureList />
        <TestimonialCard />
      </div>
    </div>
  );

  export default RightPanel;
