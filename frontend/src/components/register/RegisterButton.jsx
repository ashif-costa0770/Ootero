import { Loader2 } from "lucide-react";

const RegisterButton = ({ loading }) => {
  return (
    <button
      type="submit"
      className="cursor-pointer w-full bg-[#2563EB] hover:bg-blue-700 text-white font-semibold py-3 rounded-lg mt-6 transition-colors"
      disabled={loading}
    >
      {loading ? <Loader2 className="w-5 h-5 inline-block mr-2 animate-spin" /> : "Register"}
    </button>
  );
  };

export default RegisterButton;