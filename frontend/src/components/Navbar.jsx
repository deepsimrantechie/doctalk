import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Login from "../pages/Auth/Login";
import Signup from "../pages/Auth/Signup";

const Navbar = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [roleSelection, setRoleSelection] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Check for logged-in user on mount
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  // Handle login to make sure correct role is used
  const handleLoginSuccess = (loggedInUser) => {
    setUser(loggedInUser);
    localStorage.setItem("user", JSON.stringify(loggedInUser));

    // Navigate after state update
    setTimeout(() => {
      navigate(
        loggedInUser.role === "doctor" ? "/doctor-portal" : "/patient-profile"
      );
    }, 100);
  };

  return (
    <div>
      <div className="navbar bg-base-100 shadow-sm">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </div>
            <ul className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow">
              <li>
                <a>About</a>
              </li>
              <li>
                <Link to="/DoctorsList">
                  <a>Doctor</a>
                </Link>
              </li>
              <li>
                <a>Contact</a>
              </li>
              <li>
                <Link to="/blog">
                  {" "}
                  <a>Blog</a>
                </Link>
              </li>
            </ul>
          </div>
          <Link to="/" className="btn btn-ghost text-2xl font-bold">
            DoctTalk
          </Link>
        </div>

        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal text-xl font-semibold px-1">
            <li>
              <a>About</a>
            </li>
            <li>
              <Link to="/DoctorsList">
                <a>Doctor</a>
              </Link>
            </li>
            <li>
              <Link to="/contact">
                <a>Contact</a>
              </Link>
            </li>
            <li>
              <Link to="/blog">
                {" "}
                <a>Blog</a>
              </Link>
            </li>
          </ul>
        </div>

        <div className="navbar-end space-x-4">
          {user ? (
            <>
              <button
                className="btn btn-neutral rounded-3xl"
                onClick={() =>
                  navigate(
                    user.role === "doctor"
                      ? "/doctor-portal"
                      : "/patient-profile"
                  )
                }
              >
                Profile
              </button>
              <button
                className="btn btn-outline rounded-3xl"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                className="btn btn-outline rounded-3xl"
                onClick={() => setShowLogin(true)}
              >
                Login
              </button>
              <button
                className="btn btn-neutral rounded-3xl"
                onClick={() => setRoleSelection(true)}
              >
                Create Account
              </button>
            </>
          )}
        </div>
      </div>

      {/* Login Modal */}
      <Login
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Role Selection Modal */}
      {roleSelection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
            <h2 className="text-2xl font-semibold">Choose Your Role</h2>
            <div className="mt-4 space-y-4">
              <button
                className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                onClick={() => {
                  setSelectedRole("doctor");
                  setRoleSelection(false);
                  setShowSignup(true);
                }}
              >
                Doctor
              </button>
              <button
                className="w-full py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                onClick={() => {
                  setSelectedRole("patient");
                  setRoleSelection(false);
                  setShowSignup(true);
                }}
              >
                Patient
              </button>
            </div>
            <button
              onClick={() => setRoleSelection(false)}
              className="mt-4 text-gray-500 hover:underline"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Signup Modal */}
      <Signup
        isOpen={showSignup}
        onClose={() => setShowSignup(false)}
        selectedRole={selectedRole}
      />
    </div>
  );
};

export default Navbar;
