import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import AOS from 'aos';
import 'aos/dist/aos.css';
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Discover from "./pages/Discover";
import CampaignDetail from "./pages/CampaignDetail";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import ProfilePage from "./pages/Profile";
import CreateCampaignPage from "./pages/CreateCampaign";
import EditCampaignPage from "./pages/EditCampaign";
import DonationPage from "./pages/Donation";
import ForgotPasswordPage from "./pages/ForgotPassword";
import ResetPasswordPage from "./pages/ResetPassword";
import VerifyEmailPage from "./pages/VerifyEmail";
import SettingsPage from "./pages/Settings";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

function App() {
  // Initialize dark mode state from localStorage or default to false
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode === "true";
  });

  // Setup effects for dark mode and AOS
  useEffect(() => {
    // Initialize AOS animations
    AOS.init({ duration: 1000 });
  }, []);

  // Update the body's data-theme attribute and localStorage when darkMode changes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      document.body.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.body.setAttribute("data-theme", "light");
    }
    localStorage.setItem("darkMode", darkMode.toString());
  }, [darkMode]);

  // Toggle dark mode
  const toggleTheme = () => setDarkMode((prev) => !prev);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Navbar */}
      <Navbar toggleTheme={toggleTheme} darkMode={darkMode} />

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/campaign/:id" element={<CampaignDetail />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/create-campaign" element={<CreateCampaignPage />} />
        <Route path="/campaign/:id/edit" element={<EditCampaignPage />} />
        <Route path="/donate/:campaignId" element={<DonationPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="/verify/:token" element={<VerifyEmailPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;