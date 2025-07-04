import { useState, useRef } from "react";
import { Link } from "react-router-dom";

// const aboutLinks = [
// { label: "About Us", to: "/about" },
// { label: "Careers", to: "/careers" },
// { label: "Statistics", to: "/statistics" },
// { label: "Affiliate Programs", to: "/affiliate" },
// ];

export default function MainNav() {
  const [openDropdown, setOpenDropdown] = useState(null); // "about" | "help" | null
  const hideTimeoutRef = useRef(null);

  const handleMouseEnter = (dropdown) => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    setOpenDropdown(dropdown);
  };

  const handleMouseLeave = () => {
    hideTimeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 200);
  };

  return (
    <nav className="hidden lg:flex space-x-6">
      <Link to="/projects" className=" hover:text-green-500">
        Home
      </Link>

      <Link to="/projects" className=" hover:text-green-500">
        Invest
      </Link>

      {/* About Dropdown */}
      {/* <div
        className="relative"
        onMouseEnter={() => handleMouseEnter("about")}
        onMouseLeave={handleMouseLeave}
      >
        <button className="hover:text-green-500">About</button>

        {openDropdown === "about" && (
          <div className="absolute border-2 border-gray-600 left-1/2 -translate-x-1/2 top-full mt-2 bg-[#001E0E] text-white rounded shadow z-50 min-w-[9rem] transition-opacity duration-200 ease-in-out opacity-100 text-center">
            {aboutLinks.map(({ label, to }) => (
              <Link
                key={label}
                to={to}
                className="block px-4 text-nowrap py-3 border-t border-gray-600 hover:text-green-500"
              >
                {label}
              </Link>
            ))}
          </div>
        )}
      </div> */}
      <Link to="/about" className=" hover:text-green-500">
        About
      </Link>
      {/* <Link to="/news" className=" hover:text-green-500">
        News
      </Link> */}

      {/* <Link to="/styleguide" className=" hover:text-green-500">
        Styleguide
      </Link> */}

      {/* Help Dropdown */}
      <div
        className="relative"
        onMouseEnter={() => handleMouseEnter("help")}
        onMouseLeave={handleMouseLeave}
      >
        <Link to="/help" className=" hover:text-green-500">
          Help
        </Link>

        {openDropdown === "help" && (
          <div className="absolute left-1/2 -translate-x-1/2 top-full mt-4 bg-[#001E0E] text-white rounded shadow z-50 min-w-40 transition-opacity duration-200 ease-in-out opacity-100 text-center">
            <div className="bg-[#001E0E] z-[60] w-4 h-4 rotate-45 -top-2 left-20 absolute "/>
            <Link
              to="/help"
              className="block px-4 py-3 border-t border-gray-600 hover:text-green-500"
            >
              Support
            </Link>
            <Link
              to="/contact"
              className="block px-4 py-3 border-t border-gray-600 hover:text-green-500"
            >
              Contact
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
