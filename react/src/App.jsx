import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Layouts
import RootLayout from "./components/layouts/RootLayout";
import DashboardLayout from "./components/layouts/DashboardLayout";

// Auth Pages
import Register from "./pages/Register";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

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
import VerifyEmail from "./pages/VerifyEmail";

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
      <Route path="" element={<DashboardLayout />}>
        <Route path="overview" element={<AccountOverview />} />
        <Route path="investments" element={<AccountInvestments />} />
        <Route path="statement" element={<AccountStatement />} />
        <Route path="funding" element={<AccountFunding />} />
        <Route path="profile" element={<AccountProfile />} />
      </Route>
    </Routes>
  );
}

export default App;
