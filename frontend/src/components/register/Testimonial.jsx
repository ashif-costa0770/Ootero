import profileImage from "../../assets/profile.jpg";

const TestimonialCard = () => (
    <div className="bg-white/10 rounded-xl p-6 border border-white/10 mt-6 relative">
      {/* Decorative Quotes */}
      <div className="absolute bottom-4 right-4 text-white/70 text-6xl font-serif leading-none">
        &rdquo;
      </div>
      
      <h3 className="text-white font-bold text-base mb-2">Lorem ipsum is a dummy text</h3>
      <p className="text-white text-sm italic opacity-90 leading-relaxed mb-5">
        Lorem ipsum is a dummy or placeholder text commonly used in graphic design, publishing, and web development to fill empty spaces in a layout that does not yet have content lorem ipsum is a dummy or placeholder text commonly
      </p>
      <div className="flex items-center gap-3">
        <img 
          src={profileImage} 
          alt="Rohan Lal" 
          className="w-10 h-10 rounded-full bg-gray-300 object-cover"
        />
        <div>
          <h4 className="text-white font-bold text-sm uppercase tracking-wide">ROHAN LAL</h4>
          <p className="text-white text-xs opacity-75">Lorem ipsum text</p>
        </div>
      </div>
    </div>
  );

export default TestimonialCard;