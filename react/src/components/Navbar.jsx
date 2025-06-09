import { useState, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import LanguageSwitcher from "./LanguageSwitcher";
import MainNav from "./MainNav";
import { Link } from "react-router-dom";
import LogoutButton from "./LogoutButton";

export default function Navbar() {
  const { currentUser, isUserLoading } = useAuth();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const hideTimeoutRef = useRef(null);

  const accountLinks = [
    { label: "Overview", path: "/account-overview", className: "border-t-0" },
    { label: "Investments", path: "/account-investments", className: "" },
    { label: "Statement", path: "/account-statement", className: "" },
    { label: "Funding", path: "/account-funding", className: "" },
    { label: "Profile", path: "/account-profile", className: "" },
  ];

  // Open dropdown immediately
  const handleMouseEnter = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    setDropdownOpen(true);
  };

  // Hide dropdown after 200ms delay
  const handleMouseLeave = () => {
    hideTimeoutRef.current = setTimeout(() => {
      setDropdownOpen(false);
    }, 200);
  };

  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <div className="bg-black text-white text-center py-8 text-sm md:text-lg px-4">
        Don&apos;t invest unless you&apos;re prepared to lose all the money you
        invest. This is a high-risk investment, and you are unlikely to be
        protected if something goes wrong.
      </div>

      <div className="container w-full mx-auto flex justify-between items-center py-8 px-4">
        <div className="flex items-center space-x-4">
          <Link to="/" className="text-xl font-bold">
            <img src="/logo.png" alt="Logo" className="h-6" />
          </Link>
        </div>

        <div className="flex items-center space-x-6">
          <LanguageSwitcher />
          <MainNav />

          <div
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button className="flex items-center">
              {isUserLoading ? (
                <span>Loading...</span>
              ) : currentUser ? (
                <span>Welcome, {currentUser.firstName}</span>
              ) : (
                <Link to="/login">
                  <button>Login</button>
                </Link>
              )}
            </button>

            {currentUser && isDropdownOpen && (
              <div className="absolute border-2 bor der-gray-600 left-1/2 -translate-x-1/2 top-full mt-2 bg-[#001E0E] text-white rounded shadow text-center z-50 min-w-[9rem] transition-opacity duration-200 ease-in-out opacity-100">
                {accountLinks.map(({ label, path, className }) => (
                  <Link
                    key={path}
                    to={path}
                    className={`block px-4 py-3 border-t border-gray-600 hover:text-green-500 ${
                      className || ""
                    }`}
                  >
                    {label}
                  </Link>
                ))}
                <LogoutButton />
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
