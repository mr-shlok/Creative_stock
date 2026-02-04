import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { AlertCircle } from 'lucide-react';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const logoRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAdmin, logout, loading: authLoading } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const scrollToSection = (sectionId) => {
    if (location.pathname !== '/') {
      navigate('/#' + sectionId);
      return;
    }
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Animation for the logo
  useEffect(() => {
    if (logoRef.current) {
      // Initial animation when component loads
      gsap.fromTo(logoRef.current,
        { rotation: -10, scale: 0.8, opacity: 0 },
        { rotation: 0, scale: 1, opacity: 1, duration: 1, ease: "back.out(1.7)" }
      );

      // Add hover effect
      const el = logoRef.current;
      const handleMouseEnter = () => {
        gsap.to(el, { scale: 1.1, rotation: 5, duration: 0.3, ease: "power2.out" });
      };

      const handleMouseLeave = () => {
        gsap.to(el, { scale: 1, rotation: 0, duration: 0.3, ease: "power2.out" });
      };

      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const isSearchVisible = !!user;

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully!");
      setShowLogoutModal(false);
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error("Failed to log out");
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white z-50 shadow-sm border-b border-gray-100">
      <div className="flex items-center justify-between px-4 py-3 max-w-[1920px] mx-auto">
        {/* Logo */}
        <Link to="/" className="flex-shrink-0">
          <div className="flex items-center">
            <h1
              ref={logoRef}
              className="text-2xl font-bold text-red-600 cursor-pointer select-none"
              style={{ fontFamily: "'Arial Black', 'Arial Bold', Gadget, sans-serif" }}
            >
              Creative Stock
            </h1>
          </div>
        </Link>

        {/* Navigation Links or Search Bar */}
        <div className="flex-1 flex justify-center px-4 max-w-3xl">
          {isSearchVisible ? (
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative group">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by title or #tags..."
                  className="w-full px-6 py-2.5 pl-14 rounded-full bg-gray-50 border-2 border-transparent focus:border-red-500 focus:bg-white outline-none transition-all shadow-sm group-hover:bg-gray-100 focus:group-hover:bg-white"
                />
                <div className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-red-500 transition-colors">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>
            </form>
          ) : (
            <nav className="hidden md:flex items-center space-x-10">
              <Link to="/" className="text-gray-700 hover:text-red-600 font-bold transition-colors">Home</Link>
              <button
                onClick={() => scrollToSection('about')}
                className="text-gray-700 hover:text-red-600 font-bold transition-colors cursor-pointer"
              >
                About
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="text-gray-700 hover:text-red-600 font-bold transition-colors cursor-pointer"
              >
                Contact Us
              </button>
            </nav>
          )}
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center space-x-3 flex-shrink-0">
          {!user ? (
            <>
              <Link
                to="/login"
                className="px-6 py-2.5 text-gray-700 font-bold hover:bg-gray-50 rounded-full transition-all"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="px-6 py-2.5 bg-red-600 text-white font-bold rounded-full hover:bg-red-700 shadow-md hover:shadow-lg transition-all"
              >
                Sign up
              </Link>
            </>
          ) : (
            <>
              <Link
                to={isAdmin ? "/admin" : "/dashboard"}
                className="px-6 py-2.5 bg-red-50 text-red-600 font-bold rounded-full hover:bg-red-100 transition-all text-center min-w-[130px] border border-red-100 flex items-center justify-center"
              >
                Dashboard
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="px-6 py-2.5 bg-red-600 text-white font-bold rounded-full hover:bg-red-700 shadow-md hover:shadow-lg transition-all"
              >
                Log out
              </button>
            </>
          )}
        </div>
      </div>

      {/* Custom Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 transform transition-all animate-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">Wait a second!</h3>
              <p className="text-gray-500 font-medium mb-8">Are you sure you want to log out of your creative space?</p>

              <div className="flex flex-col w-full gap-3">
                <button
                  onClick={handleConfirmLogout}
                  className="w-full py-4 bg-red-600 text-white rounded-2xl font-bold text-lg hover:bg-red-700 shadow-lg shadow-red-100 transition-all transform hover:-translate-y-1"
                >
                  Yes, Logout
                </button>
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="w-full py-4 bg-gray-50 text-gray-700 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;