// DashboardLayout.jsx
import { Outlet, Navigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../contexts/AuthContext";

export default function DashboardLayout() {
  const { currentUser, isUserLoading } = useAuth();
  const location = useLocation();

  if (isUserLoading) return <div className="p-6 text-center">Loading...</div>;

  if (!currentUser) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}
