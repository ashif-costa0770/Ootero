import ReCAPTCHA from "react-google-recaptcha";

const SITE_KEY = import.meta.env.VITE_GOOGLE_SITE_KEY;

const Recaptcha = ({ onCaptchaChange }) => {
  return (
    <div className="mt-4">
      <ReCAPTCHA
        sitekey={SITE_KEY}
        onChange={(value) => onCaptchaChange?.(value ?? "")}
      />
    </div>
  );
};

export default Recaptcha;