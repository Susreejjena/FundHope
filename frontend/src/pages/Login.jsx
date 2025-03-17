import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc"; // Google Icon
import { authAPI } from "../api";

const Login = () => {
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // Clear error when user types
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isSignup) {
        // Handle signup
        if (formData.password !== formData.confirmPassword) {
          setError("Passwords do not match.");
          setLoading(false);
          return;
        }

        console.log("Attempting to register with:", { 
          name: formData.name,
          email: formData.email,
          passwordLength: formData.password.length
        });

        const userData = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        };

        const { data } = await authAPI.register(userData);
        console.log("Registration successful:", data);
        
        localStorage.setItem("userInfo", JSON.stringify(data));
        
        // Notify components that login status has changed
        window.dispatchEvent(new Event('userLoginStatusChanged'));
        
        navigate("/");
      } else {
        // Handle login
        console.log("Attempting to login with email:", formData.email);
        
        const { data } = await authAPI.login(formData.email, formData.password);
        console.log("Login successful:", data);
        
        localStorage.setItem("userInfo", JSON.stringify(data));
        
        // Notify components that login status has changed
        window.dispatchEvent(new Event('userLoginStatusChanged'));
        
        navigate("/");
      }
    } catch (err) {
      console.error("Authentication error:", err);
      
      if (err.response) {
        console.error("Error response data:", err.response.data);
        console.error("Error response status:", err.response.status);
        setError(
          err.response.data.message || 
          "Authentication failed. Please check your credentials."
        );
      } else if (err.request) {
        console.error("No response received:", err.request);
        setError("No response from server. Please check your internet connection.");
      } else {
        console.error("Error message:", err.message);
        setError("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4 dark:text-white">{isSignup ? "Sign Up" : "Login"}</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {isSignup && (
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded mb-2 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              required
            />
          )}

          <input
            type="email"
            name="email"
            placeholder="Email ID"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2 dark:bg-gray-700 dark:text-white dark:border-gray-600"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2 dark:bg-gray-700 dark:text-white dark:border-gray-600"
            required
          />

          {isSignup && (
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full p-2 border rounded mb-2 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              required
            />
          )}

          <button 
            type="submit" 
            className="w-full bg-purple-600 text-white p-2 rounded hover:bg-purple-700 transition-colors"
            disabled={loading}
          >
            {loading ? "Processing..." : isSignup ? "Sign Up" : "Login"}
          </button>
        </form>

        <button className="w-full flex items-center justify-center gap-2 bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-400 border border-purple-600 dark:border-purple-400 p-2 rounded mt-2 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
          <FcGoogle size={20} /> Sign in with Google
        </button>

        {!isSignup && (
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            <Link to="/forgot-password" className="hover:text-purple-600 dark:hover:text-purple-400">Forgot Password?</Link>
          </div>
        )}

        <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
          {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
          <span className="text-purple-600 dark:text-purple-400 cursor-pointer" onClick={() => setIsSignup(!isSignup)}>
            {isSignup ? "Login" : "Sign Up"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
