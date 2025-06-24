import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Layouts
import RootLayout from "./layouts/RootLayout";
import DashboardLayout from "./layouts/DashboardLayout";

// Auth Pages
import Register from "./pages/auth/Register";
import VerifyEmail from "./pages/auth/VerifyEmail";
import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

// Public Pages
import Home from "./pages/Home";
import Help from "./pages/Help";
import About from "./pages/About";
import Careers from "./pages/Careers";
import Statistics from "./pages/Statistics";
import Affiliate from "./pages/Affiliate";
import News from "./pages/News";
import StyleGuide from "./pages/StyleGuide";
import Support from "./pages/Support";
import Contact from "./pages/Contact";
import Ventures from "./pages/Ventures";
import VentureDetails from "./pages/VentureDetails";
import InvestmentForm from "./pages/InvestmentForm";

// Dashboard Pages
import UserDashboardOverview from "./pages/dashboard/UserDashboardOverview";
import UserInvestments from "./pages/dashboard/UserInvestments";
import UserWallet from "./pages/dashboard/UserWallet";
import UserProfile from "./pages/dashboard/UserProfile";
import UserVentures from "./pages/dashboard/UserVentures";
import UserCreateVenture from "./pages/dashboard/UserCreateVenture";
import UserEditVentureDetails from "./pages/dashboard/UserEditVentureDetails";
import VentureImageUploader from "./components/VentureImageUploader";
import UserVentureDetails from "./pages/dashboard/UserVentureDetail";
import UserRepayments from "./pages/dashboard/UserRepayments";
import UserKYCVerification from "./pages/dashboard/UserKYCVerification";

import AdminDashboardOverview from "./pages/admin/AdminDashboardOverview";
import AdminGetAllUsers from "./pages/admin/AdminGetAllUsers";
import AdminGetAllVentures from "./pages/admin/AdminGetAllVentures";
import AdminGetAllMails from "./pages/admin/AdminGetAllMails";
import AdminLayout from "./layouts/AdminLayout";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminGetVentureDetail from "./pages/admin/AdminGetVentureDetail";
import AdminGetAllBalances from "./pages/admin/AdminGetAllBalances";
import AdminGetAllBalanceHistories from "./pages/admin/AdminGetAllBalanceHistories";
import AdminAddBalance from "./pages/admin/AdminAddBalance";
import AdminGetAllInvestments from "./pages/admin/AdminGetAllInvestments";

function App() {
  return (
    <Routes>
      {/* Public Site */}
      <Route path="/" element={<RootLayout />}>
        <Route index element={<Home />} />
        <Route path="register" element={<Register />} />
        <Route path="login" element={<Login />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password" element={<ResetPassword />} />
        <Route path="verify-email" element={<VerifyEmail />} />
        <Route path="reset-password" element={<ResetPassword />} />

        <Route path="projects" element={<Ventures />} />
        <Route path="projects/:ventureId" element={<VentureDetails />} />
        <Route path="projects/:ventureId/invest" element={<InvestmentForm />} />
        <Route path="about" element={<About />} />
        <Route path="careers" element={<Careers />} />
        <Route path="statistics" element={<Statistics />} />
        <Route path="affiliate" element={<Affiliate />} />
        <Route path="help" element={<Help />} />
        <Route path="news" element={<News />} />
        <Route path="style-guide" element={<StyleGuide />} />
        <Route path="support" element={<Support />} />
        <Route path="contact" element={<Contact />} />
        <Route path="" element={<Contact />} />
      </Route>

      {/* Dashboard Area */}
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route path="overview" element={<UserDashboardOverview />} />
        <Route path="wallet" element={<UserWallet />} />
        <Route path="investments" element={<UserInvestments />} />
        <Route path="repayments" element={<UserRepayments />} />

        {/* Venture pages */}
        <Route path="ventures" element={<UserVentures />} />
        <Route path="ventures/:ventureId" element={<UserVentureDetails />} />
        <Route path="create-venture" element={<UserCreateVenture />} />
        <Route
          path="ventures/:ventureId/edit-venture-details"
          element={<UserEditVentureDetails />}
        />
        <Route
          path="ventures/:ventureId/edit-venture-images"
          element={<VentureImageUploader />}
        />
        <Route path="verification" element={<UserKYCVerification />} />

        {/* Profile */}
        <Route path="profile" element={<UserProfile />} />
      </Route>

      {/* ADMIN ROUTES */}
      <Route path="admin-login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboardOverview />} />
        <Route path="users" element={<AdminGetAllUsers />} />
        <Route path="ventures" element={<AdminGetAllVentures />} />
        <Route path="balances" element={<AdminGetAllBalances />} />
        <Route
          path="balances/add-balance/:userId"
          element={<AdminAddBalance />}
        />
        <Route
          path="balance-histories"
          element={<AdminGetAllBalanceHistories />}
        />
        <Route path="investments" element={<AdminGetAllInvestments />} />
        <Route path="mails" element={<AdminGetAllMails />} />
        <Route path="ventures/:ventureId" element={<AdminGetVentureDetail />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
