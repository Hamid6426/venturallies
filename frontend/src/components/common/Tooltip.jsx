import { useState } from "react";

export default function Tooltip({ children, message }) {
  const [visible, setVisible] = useState(false);

  return (
    <div
      className="relative inline-block cursor-pointer"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div className="absolute z-10 w-48 py-2 px-4 text-xs bg-gray-800 text-white rounded shadow-lg mt-2 right-0 transition-opacity duration-200">
          {message}
        </div>
      )}
    </div>
  );
}
