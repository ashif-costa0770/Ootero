import { useState } from "react";
import { ChevronRight } from "lucide-react";

const AddTagButton = ({ tags = [], onTagSelect }) => {
  const [open, setOpen] = useState(false);

  const normalizedTags = tags.map((tag) =>
    typeof tag === "string" ? { label: tag, value: tag } : tag,
  );

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className="flex items-center gap-1 rounded-md border border-gray-300 bg-gray-100 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-200 cursor-pointer"
      >
        Add tag for Orders
        <ChevronRight size={14} />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-20  min-w-[170px] rounded-md border border-gray-200 bg-white shadow-lg">
          {normalizedTags.map((tag) => (
            <button
              key={tag.value}
              type="button"
              onClick={() => onTagSelect?.(tag)}
              className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
            >
              {tag.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddTagButton;