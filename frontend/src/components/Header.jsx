import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import gsap from 'gsap';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const logoRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

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

  const isDashboardPath = ['/dashboard', '/cart', '/profile', '/board', '/messages', '/settings'].includes(location.pathname);

  return (
    <header className="fixed top-0 left-0 right-0 bg-white z-50 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link to="/">
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
        {isDashboardPath ? (
          <form onSubmit={handleSearch} className="flex-1 max-w-xl mx-6">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for ideas..."
                className="w-full px-4 py-2 pl-12 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
              <svg
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
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
          </form>
        ) : (
          <nav className="hidden md:flex items-center space-x-10 flex-1 justify-center">
            <Link to="/" className="text-gray-700 hover:text-red-600 font-medium transition-colors">Home</Link>
            <button
              onClick={() => scrollToSection('about')}
              className="text-gray-700 hover:text-red-600 font-medium transition-colors cursor-pointer"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="text-gray-700 hover:text-red-600 font-medium transition-colors cursor-pointer"
            >
              Contact Us
            </button>
          </nav>
        )}

        {/* Auth Buttons */}
        <div className="flex items-center space-x-4">
          {!isDashboardPath && (
            <>
              <Link
                to="/login"
                className="px-6 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-full transition-all"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="px-6 py-2 bg-red-600 text-white font-medium rounded-full hover:bg-red-700 shadow-md hover:shadow-lg transition-all"
              >
                Sign up
              </Link>
            </>
          )}
        </div>

      </div>
    </header>
  );
};

export default Header;