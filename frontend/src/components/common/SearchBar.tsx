import React, { useState, useEffect } from "react";
import { FiSearch, FiX } from "react-icons/fi";

interface Props {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<Props> = ({ value, onChange, placeholder }) => {
  const [input, setInput] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => onChange(input), 300);
    return () => clearTimeout(handler);
  }, [input, onChange]);

  return (
    <div className="flex items-center bg-gray-100 rounded px-2 py-1">
      <FiSearch className="text-gray-400 mr-2" />
      <input
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        className="bg-transparent outline-none flex-1"
        placeholder={placeholder}
        aria-label="Search"
      />
      {input && (
        <button
          aria-label="Clear"
          className="ml-2 text-gray-400 hover:text-gray-600"
          onClick={() => setInput("")}
        >
          <FiX />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
