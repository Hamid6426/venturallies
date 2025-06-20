// src/components/AdminSidebar.jsx
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { useState } from "react";

export default function AdminSidebar() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [open, setOpen] = useState(true);

  const links = [
    { to: "/admin/dashboard", label: "Dashboard" },
    { to: "/admin/users", label: "Users" },
    { to: "/admin/ventures", label: "Ventures" },
    { to: "/admin/balances", label: "Balances" },
    { to: "/admin/balance-histories", label: "Balance Histories" },
    { to: "/admin/mails", label: "Mails" },
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  return (
    <div
      className={`h-screen bg-gray-800 text-white flex flex-col ${
        open ? "w-64" : "w-20"
      } transition-all duration-300`}
    >
      {/* Toggle */}
      <div className="p-4">
        <button onClick={() => setOpen(!open)} className="text-sm">
          {open ? "Collapse" : "Expand"}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4">
        {links.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `block py-2 px-3 rounded hover:bg-gray-700 ${
                isActive ? "bg-gray-700" : ""
              }`
            }
          >
            {open ? label : label[0]}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full py-2 px-3 rounded bg-red-600 hover:bg-red-700"
        >
          {open ? "Logout" : "🚪"}
        </button>
      </div>
    </div>
  );
}
