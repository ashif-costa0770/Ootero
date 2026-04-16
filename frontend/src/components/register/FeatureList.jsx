const FeatureList = () => {
    const features = [
      { title: "Seamless Integrations, Effortless Operations", separator: " : ", desc: "Sync orders across all your eCommerce stores, tools, and couriers in one place. Simplify workflows, eliminate errors, and meet tight deadlines with ease." },
      { title: "Scale with Confidence", separator: " : ", desc: "Automate repetitive tasks, reduce shipping costs, and reinvest your savings to fuel business growth." },
      { title: "Fulfill Orders, Delight Customers", separator: " : ", desc: "Simplify order fulfillment and delivery for your online store, ensuring a seamless experience for your customers every time." },
      { title: "Easy Setup, Reliable Support", separator: " > ", desc: "Get started in minutes with an intuitive setup and enjoy local support to keep your operations running smoothly—no downtime, no stress." },
      { title: "Global Reach, Local Expertise", separator: " : ", desc: "Connect with the world's top shipping services, including DHL, FedEx, TGE, Sendle, AusPost, Royal Mail, USPS, and more. Ship anywhere, anytime." },
    ];
  
    return (
      <div className="space-y-5 mb-8">
        {features.map((feature, idx) => (
          <div key={idx} className="flex gap-4">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center mt-0.5">
              <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <p className="text-sm text-white leading-relaxed">
              <span className="font-bold">{feature.title}</span>
              {feature.separator}
              <span className="opacity-90">{feature.desc}</span>
            </p>
          </div>
        ))}
      </div>
    );
  };

export default FeatureList;