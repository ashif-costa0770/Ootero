const FormField = ({
  label,
  required,
  type = "text",
  placeholder,
  options,
  name,
  colSpan = false,
  register,
  error,
}) => {
  const fieldRegister = register(name);
  const borderClass = error ? "border-red-500" : "border-gray-300";

  return (
    <div className={`${colSpan ? "col-span-2" : "col-span-1"}`}>
      <label className="text-sm font-medium text-gray-700 mb-1 block">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {type === "select" ? (
        <select
          {...fieldRegister}
          className={`w-full border ${borderClass} rounded-md px-3 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white`}
        >
          {options.map((opt, idx) => (
            <option key={idx} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          {...fieldRegister}
          placeholder={placeholder}
          className={`w-full border ${borderClass} rounded-md px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500`}
        />
      )}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default FormField;