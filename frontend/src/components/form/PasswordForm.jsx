import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { changePasswordSchema } from "../../validations/user.validation";
import { toast } from "sonner";
import { changePassword, getUserProfile } from "../../services/user.api";
import { useEffect, useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useParams } from "react-router-dom";
import { formatDate } from "../../utils/formatDate";

const inputClass =
  "w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500";

export default function PasswordForm() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [lastPasswordChange, setLastPasswordChange] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(changePasswordSchema),
    shouldFocusError: false,
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  //! Fetch user profile
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await getUserProfile(userId);
        const data = response?.data?.data || {};
        setUser(data);
        setLastPasswordChange(formatDate(data?.lastPasswordChange));
      } catch (error) {
        const message =
          error?.response?.data?.message || "Failed to fetch user profile";
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId]);

  //! Handle submit
  const handleSubmitClick = async (data) => {
    try {
      setLoading(true);
      const response = await changePassword(userId, data);
      if (response.status === 200) {
        toast.success(response?.data?.message);
        setLastPasswordChange(
          formatDate(response?.data?.data?.lastPasswordChange),
        );
        reset();
      }
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Failed to change password";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-md border border-gray-200 shadow-sm ">
      <form onSubmit={handleSubmit(handleSubmitClick)} className="space-y-4">
        <div className="px-6 pt-6">
          <label className="block text-sm text-slate-700 mb-1">
            Current Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showCurrentPassword ? "text" : "password"}
              placeholder="Enter your current password "
              {...register("currentPassword")}
              className={inputClass}
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="cursor-pointer absolute right-3   top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
              tabIndex={-1}
              aria-label={
                showCurrentPassword
                  ? "Hide current password"
                  : "Show current password"
              }
            >
              {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.currentPassword && (
            <p className="text-red-500 text-xs mt-1">
              {errors.currentPassword.message}
            </p>
          )}
        </div>

        <div className="px-6">
          <label className="block text-sm text-slate-700 mb-1">
            New Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showNewPassword ? "text" : "password"}
              placeholder="Enter your new password "
              {...register("newPassword")}
              className={inputClass}
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="cursor-pointer absolute right-3   top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
              tabIndex={-1}
              aria-label={
                showNewPassword ? "Hide new password" : "Show new password"
              }
            >
              {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {errors.newPassword && (
            <p className="text-red-500 text-xs mt-1">
              {errors.newPassword.message}
            </p>
          )}
        </div>
        <div className="px-6">
          <label className="block text-sm text-slate-700 mb-1">
            Confirm New Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your new password "
              {...register("confirmPassword")}
              className={inputClass}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="cursor-pointer absolute right-3   top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
              tabIndex={-1}
              aria-label={
                showConfirmPassword
                  ? "Hide confirm password"
                  : "Show confirm password"
              }
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {errors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <div className="flex justify-between items-center gap-4 bg-slate-100 px-6 py-3 border-t border-gray-200 mt-6">
          <p className="text-sm text-slate-700">
            Last change: {lastPasswordChange ? lastPasswordChange : "N/A"}
          </p>
          <button
            type="submit"
            disabled={loading}
            className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white text-sm px-6 py-2 rounded transition-colors"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 inline-block mr-2 animate-spin" />
            ) : (
              "Save"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
