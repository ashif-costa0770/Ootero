import React, { useState } from "react";
import { Search } from "lucide-react";
import { toast } from "sonner";
const SearchInput = ({ placeholder }) => {
  const [search, setSearch] = useState("");
  const handleSearch = () => {
   toast.success(`Searching for ${search}`);
  };
  return (
    <div class="flex items-center pr-3 gap-2 bg-gray-100   h-[42px] rounded-md overflow-hidden max-w-lg outline-none focus-within:ring-1 focus-within:ring-blue-300 focus-within:shadow-sm">
      <input
        type="text"
        placeholder={placeholder}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        class="w-full h-full pl-5 outline-none text-gray-500 placeholder-gray-500 text-sm focus:outline-none"
      />
      <button type="button " onClick={handleSearch}>
        <Search size={18} className=" cursor-pointer text-gray-500" />
      </button>
    </div>
  );
};

export default SearchInput;
