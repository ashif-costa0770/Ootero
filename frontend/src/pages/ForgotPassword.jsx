import ForgotPasswordForm from "../components/form/ForgotPasswordForm";
import RightSection from "../components/login/RightSection";

export default function ForgotPassword() {
  return (
    <div className="flex min-h-screen">
      {/* Left — form side */}
      <div className="flex flex-col justify-center flex-1 bg-slate-50">
        <ForgotPasswordForm />
      </div>

      {/* Right — your existing panel */}
      <RightSection />
    </div>
  );
}