import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { login } from "../services/auth.api";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../validations/auth.validation";
import ReCAPTCHA from "react-google-recaptcha";
import ImageLogo from "../components/common/ImageLogo";
import RightSection from "../components/login/RightSection";
import { useAuth } from "../context/AuthContext";

const SITE_KEY = import.meta.env.VITE_GOOGLE_SITE_KEY;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [captchaValue, setCaptchaValue] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { checkAuth } = useAuth();
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    shouldFocusError: false,
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const borderClass =
    errors.email || errors.password ? "border-red-500" : "border-gray-300";

  const handleLogin = async (data) => {
    if (!captchaValue) {
      toast.error("Please verify the captcha");
      return;
    }
    try {
      setLoading(true);
      const response = await login(data.email, data.password, captchaValue);
      if (response.status === 200) {
        toast.success("Login successful");
        await checkAuth();
        navigate("/platform-select");
        reset();
      }
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Failed to login";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden">
      <div className="flex h-full w-full">
        <section className="flex w-full items-center justify-center bg-[#f0f2f5] px-5 py-8 lg:w-[65%]">
          <div className="w-full max-w-[400px]">
            <div className="text-center">
              <ImageLogo />
            </div>

            <div className="mt-5 text-center">
              <h2 className="text-[28px] font-bold text-[#1a3caa]">
                Please login or register
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                New to ootero?{" "}
                <Link
                  to="/register"
                  className="font-medium text-blue-600 hover:underline"
                >
                  Sign up
                </Link>
              </p>
            </div>

            <div className="mt-4 rounded-xl bg-white p-6 shadow-[0_8px_24px_rgba(16,24,40,0.08)]">
              <form onSubmit={handleSubmit(handleLogin)} className="space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    {...register("email")}
                    className={`mt-2 w-full rounded-lg border ${borderClass} bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#1a6ef5] focus:ring-2 focus:ring-[#1a6ef5]/20`}
                  />
                  {errors.email && (
                    <p className="text-red-500 ms-1 text-sm">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <div className="relative mt-2">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      {...register("password")}
                      className={`w-full rounded-lg border ${borderClass} bg-white py-2.5 pl-3 pr-16 text-sm outline-none transition focus:border-[#1a6ef5] focus:ring-2 focus:ring-[#1a6ef5]/20`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="cursor-pointer absolute inset-y-0 right-0 px-4 text-xs font-semibold text-blue-600 hover:text-blue-700"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 ms-1 text-sm">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <div className="recaptcha-container">
                  <ReCAPTCHA
                    sitekey={SITE_KEY}
                    onChange={(value) => setCaptchaValue(value)}
                  />
                </div>

                <div className="flex items-center justify-between mt-6 px-1">
                  <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="cursor-pointer h-4 w-4 rounded border-gray-300 accent-[#1a6ef5]"
                    />
                    Remember me
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-sm font-medium text-blue-600 hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="cursor-pointer mt-1 w-full rounded-lg bg-[#1a6ef5] py-2.5 text-sm font-bold text-white transition hover:bg-[#1558d0] active:scale-[0.99]"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 inline-block mr-2 animate-spin" />
                  ) : (
                    "Login"
                  )}
                </button>
              </form>
            </div>
          </div>
        </section>

        <RightSection />
      </div>
    </div>
  );
};

export default Login;
