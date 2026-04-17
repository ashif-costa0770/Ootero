import ImageLogo from "../common/ImageLogo";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema } from "../../validations/auth.validation";
import { toast } from "sonner";
import { forgotPassword } from "../../services/auth.api";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function ForgotPasswordForm() {
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(forgotPasswordSchema),
        shouldFocusError: false,
        defaultValues: {
            email: "",
        }
    })

    const borderClass =
    errors.email ? "border-red-500" : "border-gray-300";
  
    const handleSubmitClick = async (data) => {
      try {
        setLoading(true);
        const response = await forgotPassword(data.email);
        if (response.status === 200) {
          toast.success("Reset password link sent to your email");
          reset();
        }
      } catch (error) {
        const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Failed to send reset password link";
      toast.error(message);
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <div className="flex flex-col items-center justify-center flex-1 px-4">
        {/* Logo */}
        <div className="text-center mb-8 w-100">
          <ImageLogo />
        </div>
  
        {/* Card */}
        <div className="w-full max-w-sm border border-slate-200 rounded-xl p-8 bg-white">
          <div className="text-center mb-8">
            <h2 className="text-xl font-semibold text-blue-700">Forgot Password?</h2>
            <p className="text-sm text-slate-500 mt-1">
              Enter your email to reset your password.
            </p>
          </div>
  
            <form onSubmit={handleSubmit(handleSubmitClick)} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="Enter your email "
                  {...register("email")}
                  className={`w-full border ${borderClass} rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
              </div>
  
              <button
                type="submit"
                disabled={loading}
                className="cursor-pointer w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2.5 rounded-md transition-colors"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 inline-block mr-2 animate-spin" />
                ) : (
                  "Submit"
                )}
              </button>
            </form>
        </div>
      </div>
    );
  }