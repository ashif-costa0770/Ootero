import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

const options = [
  {
    label: "Disabled",
    value: "DISABLED",
  },
  {
    label: "Enable Email Two Factor Authentication",
    value: "EMAIL",
  },
  {
    label: "Enable Google Authenticator",
    value: "GOOGLE",
  },
];

const TwoFactorForm = () => {
  const [selected, setSelected] = useState("DISABLED");
  const [loading, setLoading] = useState(false);


  return (
    <div className="bg-white rounded-md border border-gray-200 shadow-sm ">
      <div className="space-y-4 px-6 py-6">
        {options.map((option) => (
          <label
            key={option.value}
            className="flex items-center gap-3 cursor-pointer"
          >
            <input
              type="radio"
              name="twoFactor"
              value={option.value}
              checked={selected === option.value}
              onChange={(e) => setSelected(e.target.value)}
            />

            <span className="text-sm text-slate-700">{option.label}</span>
          </label>
        ))}
      </div>
      <div className="flex justify-end items-center gap-4 bg-slate-100 px-6 py-3 border-t border-gray-200">
        <button type="submit" className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white text-sm px-6 py-2 rounded transition-colors">
          {loading ? (
            <Loader2 className="w-5 h-5 inline-block mr-2 animate-spin" />
          ) : (
            "Save"
          )}
        </button>
      </div>
    </div>
  );
};

export default TwoFactorForm;
