import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  console.log("user", user);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-indigo-600">
          DevConnect
        </Link>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <>
              <NavLink
                to="/feed"
                className={({ isActive }) =>
                  isActive
                    ? "text-indigo-600 font-semibold px-3"
                    : "text-gray-700 hover:text-indigo-600 px-3"
                }
              >
                Feed
              </NavLink>
              <NavLink
                to="/following"
                className={({ isActive }) =>
                  isActive
                    ? "text-indigo-600 font-semibold px-3"
                    : "text-gray-700 hover:text-indigo-600 px-3"
                }
              >
                Following
              </NavLink>

              <NavLink
                to={`/profile/${user?.email}`}
                className={({ isActive }) =>
                  isActive
                    ? "text-indigo-600 font-semibold px-3"
                    : "text-gray-700 hover:text-indigo-600 px-3"
                }
              >
                Profile
              </NavLink>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-1.5 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-700 hover:text-indigo-600">
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-indigo-600 text-white px-4 py-1.5 rounded hover:bg-indigo-700"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden">
          <button onClick={() => setMobileOpen(!mobileOpen)}>
            <svg
              className="w-6 h-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2">
          {user ? (
            <>
              <Link
                to="/feed"
                onClick={() => setMobileOpen(false)}
                className="block text-gray-700"
              >
                Feed
              </Link>
              <Link
                to="/following"
                onClick={() => setMobileOpen(false)}
                className="block text-gray-700"
              >
                Following
              </Link>
              <Link
                to={`/profile/${user?.email}`}
                onClick={() => setMobileOpen(false)}
                className="block text-gray-700"
              >
                Profile
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setMobileOpen(false);
                }}
                className="block text-red-500"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="block text-gray-700"
              >
                Login
              </Link>
              <Link
                to="/signup"
                onClick={() => setMobileOpen(false)}
                className="block text-indigo-600"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
