// components/DeleteImage.jsx
import { useState } from "react";

export default function DeleteVentureImage({ imageUrl, onDelete }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img
        src={imageUrl}
        alt="Uploaded"
        className="w-full h-auto border rounded"
      />
      {hovered && (
        <button
          onClick={() => onDelete(imageUrl)}
          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-700"
        >
          &times;
        </button>
      )}
    </div>
  );
}
