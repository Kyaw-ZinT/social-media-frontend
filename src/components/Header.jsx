import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SearchBar from "./SearchBar";
export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout(), navigate("/login");
  };
  return (
    <header className="bg-white shadow-md">
      <nav className="p-4 container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600 hover:text-blue-800 transition duration-300">
          MySocial
        </Link>
        <div className="flex-1 max-w-lg mx-4">
          {" "}
          {/* SearchBar အတွက် နေရာပေးမယ် */}
          {user && <SearchBar />}
        </div>
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <span className="text-gray-700">Welcome,{user.username}!</span>
              <Link
                to={`/profile/${user.username}`}
                className="text-gray-700 hover:text-blue-600 transition duration-300"
              >
                Profile
              </Link>

              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 rounded-lg shadow-md text-white font-semibold hover:bg-red-600 transition duration-300"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-700 hover:text-blue-600 transition duration-300">
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-blue-600 rounded-lg text-white shadow-md hover:bg-blue-700 font-bold transition duration-300"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
