// Tooltip.jsx
export default function Tooltip({ message, children }) {
  return (
    <div className="relative group inline-block">
      {children}
      <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 scale-0 group-hover:scale-100 transition-all text-xs bg-gray-800 text-white rounded py-1 px-2 whitespace-normal z-50">
        {message}
      </span>
    </div>
  );
}
  