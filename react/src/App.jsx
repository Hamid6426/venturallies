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
import Projects from "./pages/Projects";
import Help from "./pages/Help";
import About from "./pages/About";
import Careers from "./pages/Careers";
import Statistics from "./pages/Statistics";
import Affiliate from "./pages/Affiliate";
import News from "./pages/News";
import StyleGuide from "./pages/StyleGuide";
import Support from "./pages/Support";
import Contact from "./pages/Contact";

// Dashboard Pages
import AccountOverview from "./pages/dashboard/AccountOverview";
import AccountInvestments from "./pages/dashboard/AccountInvestments";
import AccountStatement from "./pages/dashboard/AccountStatement";
import AccountFunding from "./pages/dashboard/AccountFunding";
import AccountProfile from "./pages/dashboard/AccountProfile";
import MyVentures from "./pages/dashboard/MyVentures";
import CreateVenture from "./pages/dashboard/CreateVenture";
import EditVenture from "./pages/dashboard/EditVenture";
import VentureImageUploader from "./pages/dashboard/VentureImageUploader";
import MyVentureDetail from "./pages/dashboard/MyVentureDetail";

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

        <Route path="projects" element={<Projects />} />
        <Route path="about" element={<About />} />
        <Route path="careers" element={<Careers />} />
        <Route path="statistics" element={<Statistics />} />
        <Route path="affiliate" element={<Affiliate />} />
        <Route path="help" element={<Help />} />
        <Route path="news" element={<News />} />
        <Route path="style-guide" element={<StyleGuide />} />
        <Route path="support" element={<Support />} />
        <Route path="contact" element={<Contact />} />
      </Route>

      {/* Dashboard Area */}
      <Route path="/account" element={<DashboardLayout />}>
        <Route path="overview" element={<AccountOverview />} />
        <Route path="investments" element={<AccountInvestments />} />
        <Route path="statement" element={<AccountStatement />} />
        <Route path="funding" element={<AccountFunding />} />
        <Route path="profile" element={<AccountProfile />} />
        <Route path="my-ventures" element={<MyVentures />} />
        <Route
          path="/account/my-ventures/:ventureId"
          element={<MyVentureDetail />}
        />
        <Route path="create-venture" element={<CreateVenture />} />
        <Route path="edit-venture" element={<EditVenture />} />
        <Route
          path="/account/create-venture/:ventureId/upload-images"
          element={<VentureImageUploader />}
        />
      </Route>
    </Routes>
  );
}

export default App;
