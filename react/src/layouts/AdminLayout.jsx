// src/layouts/AdminLayout.jsx
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import AdminSidebar from "../components/admin-components/AdminSidebar";

export default function AdminLayout() {
  const { currentUser, isUserLoading } = useAuth();
  const location = useLocation();

  if (isUserLoading) return <div className="p-6 text-center">Loading...</div>;

  if (!currentUser || currentUser.role !== "admin") {
    return <Navigate to="/admin-login" replace state={{ from: location }} />;
  }

  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <div className="flex-1 overflow-y-auto p-6">
        <Outlet />
      </div>
    </div>
  );
}
