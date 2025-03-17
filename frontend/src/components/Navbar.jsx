import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, PlusCircle, Menu, X, User, ChevronDown, LogOut, Settings, LayoutDashboard, Sun, Moon } from 'lucide-react';

const Navbar = ({ toggleTheme, darkMode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Function to check user login status
  const checkUserLogin = () => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      try {
        const parsedUser = JSON.parse(userInfo);
        setIsLoggedIn(true);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user info:', error);
        localStorage.removeItem('userInfo');
        setIsLoggedIn(false);
        setUser(null);
      }
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
  };

  useEffect(() => {
    // Check login status on component mount
    checkUserLogin();
    
    // Create a storage event listener to detect changes to localStorage
    const handleStorageChange = (e) => {
      if (e.key === 'userInfo') {
        checkUserLogin();
      }
    };
    
    // Add event listener for storage changes
    window.addEventListener('storage', handleStorageChange);
    
    // Define a custom event for local changes
    window.addEventListener('userLoginStatusChanged', checkUserLogin);
    
    return () => {
      // Clean up event listeners on component unmount
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userLoginStatusChanged', checkUserLogin);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    setIsLoggedIn(false);
    setUser(null);
    setShowDropdown(false);
    navigate('/');
    
    // Dispatch a custom event to notify other components
    window.dispatchEvent(new Event('userLoginStatusChanged'));
  };

  const closeDropdown = () => {
    setShowDropdown(false);
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-purple-600" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">FundHope</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleTheme}
              className="mr-4 text-gray-700 dark:text-gray-300 hover:text-purple-600"
              aria-label="Toggle Dark Mode"
            >
              {darkMode ? (
                <Sun className="h-5 w-5 text-yellow-500" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 dark:text-gray-300 hover:text-purple-600"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="text-gray-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400">Home</Link>
            <Link to="/discover" className="text-gray-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400">Discover</Link>
            <Link to="/about" className="text-gray-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400">About</Link>
            <Link to="/contact" className="text-gray-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400">Contact</Link>
            <Link to="/create-campaign" className="flex items-center space-x-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
              <PlusCircle className="h-5 w-5" />
              <span>Start a campaign</span>
            </Link>

            {/* Theme Toggle Button (Desktop) */}
            <button
              onClick={toggleTheme}
              className="text-gray-700 dark:text-gray-300 hover:text-purple-600"
              aria-label="Toggle Dark Mode"
            >
              {darkMode ? (
                <Sun className="h-5 w-5 text-yellow-500" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>

            {/* User Profile Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setShowDropdown(!showDropdown)} 
                className="text-gray-700 dark:text-gray-300 hover:text-purple-600 flex items-center gap-1"
              >
                {isLoggedIn && user ? (
                  <>
                    <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white overflow-hidden">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user?.name || 'User'} className="w-full h-full object-cover" />
                      ) : (
                        <span>{user?.name?.charAt(0)?.toUpperCase() || 'U'}</span>
                      )}
                    </div>
                    <ChevronDown className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    <User className="h-6 w-6" />
                    <ChevronDown className="h-4 w-4" />
                  </>
                )}
              </button>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 shadow-lg rounded-lg z-50">
                  {isLoggedIn ? (
                    <>
                      <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-600">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{user?.name || 'User'}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email || ''}</p>
                      </div>
                      <Link to="/dashboard" className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600" onClick={closeDropdown}>
                        <LayoutDashboard className="h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                      <Link to="/profile" className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600" onClick={closeDropdown}>
                        <User className="h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                      <Link to="/settings" className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600" onClick={closeDropdown}>
                        <Settings className="h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <Link to="/login" className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600" onClick={closeDropdown}>Login</Link>
                      <Link to="/register" className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600" onClick={closeDropdown}>Register</Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden py-4 space-y-4 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4`}>
          <Link to="/" className="block text-gray-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400">Home</Link>
          <Link to="/discover" className="block text-gray-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400">Discover</Link>
          <Link to="/about" className="block text-gray-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400">About</Link>
          <Link to="/contact" className="block text-gray-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400">Contact</Link>
          <Link to="/create-campaign" className="block bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 text-center">
            Start a campaign
          </Link>

          {/* User Dropdown in Mobile Menu */}
          <div className="relative">
            <button 
              onClick={() => setShowDropdown(!showDropdown)} 
              className="w-full text-gray-700 dark:text-gray-300 hover:text-purple-600 flex justify-between items-center py-2"
            >
              <span>Account</span>
              <ChevronDown className="h-4 w-4" />
            </button>
            {showDropdown && (
              <div className="mt-2 bg-white dark:bg-gray-700 shadow-lg rounded-lg z-50">
                {isLoggedIn ? (
                  <>
                    <Link to="/dashboard" className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600" onClick={closeDropdown}>Dashboard</Link>
                    <Link to="/profile" className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600" onClick={closeDropdown}>Profile</Link>
                    <Link to="/settings" className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600" onClick={closeDropdown}>Settings</Link>
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600" onClick={closeDropdown}>Login</Link>
                    <Link to="/register" className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600" onClick={closeDropdown}>Register</Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

Navbar.propTypes = {
  toggleTheme: PropTypes.func.isRequired,
  darkMode: PropTypes.bool.isRequired,
};

export default Navbar;