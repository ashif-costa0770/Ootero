import RegisterForm from "../form/RegisterForm";
import { Link } from "react-router-dom";

const LeftPanel = () => (
    <div className="flex-4 overflow-y-auto bg-gray-50 px-6 py-8 lg:px-10 lg:py-12">
      <div className="mx-auto max-w-xl">
        <div className="mb-4 text-center">
          <h2 className="text-gray-900 font-bold text-3xl md:text-4xl mb-3">
            Sign up for a <span className="text-[#2563EB]">free trial.</span><br/> No credit card required.
          </h2>
          <p className="text-sm text-gray-600">
            Already signed up? <Link to="/login" className="text-[#2563EB] hover:underline font-medium">Sign in</Link>
          </p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );

export default LeftPanel;