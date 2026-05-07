import EditProfileForm from "../../components/form/EditProfileForm";
import PasswordForm from "../../components/form/PasswordForm";
import TwoFactorForm from "../../components/form/TwoFactorForm";

export default function EditUserProfile() {
  return (
    <div className="min-h-screen p-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* left */}
        <div className="lg:col-span-7 w-full">
          <h2 className="text-xl font-semibold text-gray-700 mb-3">
            Edit Profile
          </h2>
          <EditProfileForm />
        </div>

        {/* right */}
        <div className="lg:col-span-5 space-y-20">
          <div>
            <h2 className="text-xl font-semibold text-gray-700 mb-3">
              Change Password
            </h2>
            <PasswordForm />
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-700 mb-3">
              Two Factor Authentication
            </h2>
            <TwoFactorForm />
          </div>
        </div>
      </div>
    </div>
  );
}
