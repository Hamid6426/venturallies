import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useBalance } from "../contexts/BalanceContext";
import LanguageSwitcher from "./LanguageSwitcher";
import LogoutButton from "./LogoutButton";
import { MdChevronRight } from "react-icons/md";

export default function Navbar() {
  const { currentUser, isUserLoading } = useAuth();
  const { balance, loading } = useBalance();

  const [openDropdown, setOpenDropdown] = useState(null); // 'help' | 'account' | null
  const dropdownRefs = {
    help: useRef(null),
    account: useRef(null),
  };

  // Toggle dropdown on click
  const handleDropdownToggle = (name) => {
    setOpenDropdown((prev) => (prev === name ? null : name));
  };

  // Close dropdown after mouse leaves the panel
  const handlePanelMouseLeave = (name) => {
    if (openDropdown === name) {
      setOpenDropdown(null);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const isOutside = !Object.values(dropdownRefs).some(
        (ref) => ref.current && ref.current.contains(event.target)
      );
      if (isOutside) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const dashboardLinks = [
    {
      label: "Dashboard",
      path: "/dashboard/overview",
      className: "border-t-0",
    },
    // { label: "Wallet", path: "/dashboard/wallet" },
    { label: "Investments", path: "/dashboard/investments" },
    { label: "Repayments", path: "/dashboard/repayments" },
    { label: "My Ventures", path: "/dashboard/ventures" },
    { label: "Verification", path: "/dashboard/verification" },
    { label: "Profile", path: "/dashboard/profile" },
  ];

  return (
    <header className="bg-white shadow sticky top-0 z-50">
      {/* Risk banner */}
      <div className="bg-black text-white text-center py-3 text-sm px-6">
        Don&apos;t invest unless you&apos;re prepared to lose all the money you
        invest. This is a high-risk investment, and you are unlikely to be
        protected if something goes wrong.
      </div>

      <div className="container w-full mx-auto flex justify-between items-center py-4 px-8">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold">
          <img src="/logo.png" alt="Logo" className="h-6" />
        </Link>

        <div className="flex items-center space-x-6">
          <LanguageSwitcher />

          {/* Main nav links */}
          <nav className="hidden lg:flex space-x-6">
            <Link to="/" className="hover:text-green-500">
              Home
            </Link>
            <Link to="/projects" className="hover:text-green-500">
              Invest
            </Link>
            <Link to="/about" className="hover:text-green-500">
              About
            </Link>

            {/* Help dropdown */}
            <div className="relative" ref={dropdownRefs.help}>
              <button
                onClick={() => handleDropdownToggle("help")}
                className="hover:text-green-500 cursor-pointer flex items-center gap-1"
              >
                <span>Help</span>
                <MdChevronRight
                  className={`transition-transform duration-200 ${
                    openDropdown === "help" ? "rotate-90" : "rotate-0"
                  }`}
                />
              </button>

              {openDropdown === "help" && (
                <div
                  className="absolute top-full right-0 mt-2 bg-[#001E0E] text-white rounded shadow z-50 min-w-40 text-center"
                  onMouseLeave={() => handlePanelMouseLeave("help")}
                >
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

          {/* Balance & account */}
          <div
            className="relative flex items-center gap-4"
            ref={dropdownRefs.account}
          >
            {loading ? (
              <p>Loading balance...</p>
            ) : balance ? (
              <p className="text-green-700 font-semibold">
                € {balance.balance.toFixed(2)}
              </p>
            ) : (
              <p className="text-xs text-red-500"></p>
            )}
            {isUserLoading ? (
              <span>Loading...</span>
            ) : currentUser ? (
              <button
                onClick={() => handleDropdownToggle("account")}
                className="cursor-pointer flex items-center gap-1 hover:text-green-500"
              >
                <span>Welcome, {currentUser.firstName}</span>
                <MdChevronRight
                  className={`transition-transform duration-200 ${
                    openDropdown === "account" ? "rotate-90" : "rotate-0"
                  }`}
                />
              </button>
            ) : (
              <Link to="/login">
                <button className="bg-green-500 text-white hover:-translate-y-1 px-6 py-2">
                  Login
                </button>
              </Link>
            )}
            {currentUser && openDropdown === "account" && (
              <div
                className="absolute top-full right-0 mt-2 bg-[#001E0E] text-white rounded shadow z-50 min-w-40 text-left"
                onMouseLeave={() => handlePanelMouseLeave("account")}
              >
                {dashboardLinks.map(({ label, path, className }) => (
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
