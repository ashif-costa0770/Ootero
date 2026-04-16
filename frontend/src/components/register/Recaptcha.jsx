import ReCAPTCHA from "react-google-recaptcha";
import { useState } from "react";

const SITE_KEY = import.meta.env.VITE_GOOGLE_SITE_KEY;

const Recaptcha = () => {
  const [captchaValue, setCaptchaValue] = useState("");
  return (
    <div className="mt-4">
      <ReCAPTCHA sitekey={SITE_KEY} onChange={(value) => setCaptchaValue(value)} />
    </div>
  );
};

export default Recaptcha;