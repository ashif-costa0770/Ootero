import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateUserSchema } from "../../validations/user.validation";
import { toast } from "sonner";
import { updateUserProfile, getUserProfile } from "../../services/user.api";
import { useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";

const inputClass =
  "w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500";

const EditProfileForm = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phone: user?.phone || "",
      direction: user?.direction || "",
      facebook: user?.facebook || "",
      linkedIn: user?.linkedIn || "",
      skype: user?.skype || "",
      emailSignature: user?.emailSignature || "",
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
        setImage(data?.profileImage || "");
        reset(data);
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
  const onSubmit = async (data) => {

    const formData = new FormData();
    formData.append("firstName", data.firstName);
    formData.append("lastName", data.lastName);
    formData.append("email", data.email);
    formData.append("phone", data.phone);
    formData.append("direction", data.direction);
    formData.append("facebook", data.facebook);
    formData.append("linkedIn", data.linkedIn);
    formData.append("skype", data.skype);
    formData.append("emailSignature", data.emailSignature);

    if (image) {
      formData.append("profileImage", image);
    }
    try {
      setLoading(true);
      const response = await updateUserProfile(userId, formData);
      
      if (response.status === 200) {
        toast.success(
          response?.data?.message || "User profile updated successfully",
        );
        console.log(response?.data?.data);
        reset(response?.data?.data || {});
        setImage(null);
      }
    } catch (error) {
      const message =
        error?.response?.data?.message || "Failed to update user profile";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-md border border-gray-200 shadow-sm p-6">
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* First Name */}
        <div className="mb-4">
          <label
            htmlFor="firstName"
            className="block text-sm text-gray-700 mb-1"
          >
            First Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="firstName"
            placeholder="Enter your first name"
            {...register("firstName")}
            className={inputClass}
          />
          {errors.firstName && (
            <p className="text-red-500 text-xs mt-1">
              {errors.firstName.message}
            </p>
          )}
        </div>
        {/* Last Name */}
        <div className="mb-4">
          <label
            htmlFor="lastName"
            className="block text-sm text-gray-700 mb-1"
          >
            Last Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="lastName"
            placeholder="Enter your last name"
            {...register("lastName")}
            className={inputClass}
          />
          {errors.lastName && (
            <p className="text-red-500 text-xs mt-1">
              {errors.lastName.message}
            </p>
          )}
        </div>
        {/* Email */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm text-gray-700 mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="email"
            disabled    
            placeholder="Enter your email"
            {...register("email")}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100"
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>
        {/* Phone */}
        <div className="mb-4">
          <label htmlFor="phone" className="block text-sm text-gray-700 mb-1">
            Phone
          </label>
          <input
            type="text"
            id="phone"
            placeholder="Enter your phone"
            {...register("phone")}
            className={inputClass}
          />
          {errors.phone && (
            <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
          )}
        </div>
        {/* image */}
        <div className="mb-4">
          <label htmlFor="image" className="block text-sm text-gray-700 mb-1">
            Profile Image
          </label>
          <input
            type="file"
            name="profileImage"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className={`cursor-pointer w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.image ? "border-red-500" : "border-gray-300"}`}
          />
        </div>
        {/* direction */}
        <div className="mb-4">
          <label
            htmlFor="direction"
            className="block text-sm text-gray-700 mb-1"
          >
            Direction
          </label>
          <select
            id="direction"
            {...register("direction")}
            className={`w-full cursor-pointer rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.direction ? "border-red-500" : "border-gray-300"}`}
          >
            <option value="">Select Direction</option>
            <option value="LTR">LTR</option>
            <option value="RTL">RTL</option>
            <option value="SYSTEM">SYSTEM</option>
          </select>
          {errors.direction && (
            <p className="text-red-500 text-xs mt-1">
              {errors.direction.message}
            </p>
          )}
        </div>
        {/* facebook */}
        <div className="mb-4">
          <label
            htmlFor="facebook"
            className="block text-sm text-gray-700 mb-1"
          >
            Facebook
          </label>
          <input
            type="text"
            id="facebook"
            placeholder="Enter your facebook"
            {...register("facebook")}
            className={inputClass}
          />
          {errors.facebook && (
            <p className="text-red-500 text-xs mt-1">
              {errors.facebook.message}
            </p>
          )}
        </div>
        {/* linkedIn */}
        <div className="mb-4">
          <label
            htmlFor="linkedIn"
            className="block text-sm text-gray-700 mb-1"
          >
            LinkedIn
          </label>
          <input
            type="text"
            id="linkedIn"
            placeholder="Enter your linkedIn"
            {...register("linkedIn")}
            className={inputClass}
          />
          {errors.linkedIn && (
            <p className="text-red-500 text-xs mt-1">
              {errors.linkedIn.message}
            </p>
          )}
        </div>
        {/* skype */}
        <div className="mb-4">
          <label htmlFor="skype" className="block text-sm text-gray-700 mb-1">
            Skype
          </label>
          <input
            type="text"
            id="skype"
            placeholder="Enter your skype"
            {...register("skype")}
            className={inputClass}
          />
          {errors.skype && (
            <p className="text-red-500 text-xs mt-1">{errors.skype.message}</p>
          )}
        </div>
        {/* email signature */}
        <div className="mb-4">
          <label
            htmlFor="emailSignature"
            className="block text-sm text-gray-700 mb-1"
          >
            Email Signature
          </label>
          <textarea
            id="emailSignature"
            rows={4}
            placeholder="Enter your email signature"
            {...register("emailSignature")}
            className={`w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.emailSignature ? "border-red-500" : "border-gray-300"}`}
          />
          {errors.emailSignature && (
            <p className="text-red-500 text-xs mt-1">
              {errors.emailSignature.message}
            </p>
          )}
        </div>
        {/* submit button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="cursor-pointer  rounded bg-blue-600 px-8 py-2 text-sm text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? <Loader2 className="w-5 h-5 inline-block mr-2 animate-spin" /> : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfileForm;
