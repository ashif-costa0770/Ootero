import ImageLogo from "../common/ImageLogo";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema } from "../../validations/auth.validation";
import { toast } from "sonner";
import { resetPassword } from "../../services/auth.api";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useSearchParams } from "react-router-dom";

export default function ResetPasswordForm() {
  const [loading, setLoading] = useState(false);

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    shouldFocusError: false,
    defaultValues: {
      token: token || "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const borderClass =
    errors.newPassword || errors.confirmPassword
      ? "border-red-500"
      : "border-gray-300";

  const handleSubmitClick = async (data) => {
    try {
      setLoading(true);
      const response = await resetPassword(data);
      if (response.status === 200) {
        toast.success("Password reset successful");
        reset();
      }
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Failed to reset password";
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
          <h2 className="text-xl font-semibold text-blue-700">
            Reset Password?
          </h2>
        </div>

        <form onSubmit={handleSubmit(handleSubmitClick)} className="space-y-4">
          <div>
            <label className="block text-sm text-slate-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              placeholder="Enter your new password "
              {...register("newPassword")}
              className={`w-full border ${borderClass} rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            />
            {errors.newPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm text-slate-700 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="Confirm your new password "
              {...register("confirmPassword")}
              className={`w-full border ${borderClass} rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
          {/* Hidden token field */}
          <input type="hidden" {...register("token")} value={token ?? ""} />
          {errors.token && (
            <p className="text-red-500 text-sm">{errors.token.message}</p>
          )}

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
