const RightSection = () => {
  return (
    <div className="relative hidden w-[35%] flex-col justify-center overflow-hidden bg-[#0d2d8a] px-10 text-white lg:flex">
      <div className="relative z-10 max-w-[420px]">
        <h3 className="text-3xl font-medium leading-tight">
          We&apos;re making changes based on your feedback
        </h3>
        <p className="mt-6 text-base leading-relaxed text-blue-200">
          We&apos;ve been diligently working behind the scenes to enhance the
          products you rely on daily, helping to drive your business forward
          while striving to become the leading all-in-one fulfillment platform
          for small to medium-sized businesses.
        </p>
      </div>
      <div className="pointer-events-none absolute -bottom-28 -right-24 h-[280px] w-[280px] rounded-full bg-[#a8c4f0] opacity-40" />
      <div className="pointer-events-none absolute -bottom-40 -right-2 h-[360px] w-[360px] rounded-full bg-[#a8c4f0] opacity-30" />
    </div>
  );
};

export default RightSection;
