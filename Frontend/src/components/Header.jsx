import * as React from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import SignOutButton from "./SignOutButton";
import { useState, useEffect } from "react";
import * as apiClient from "../api-client.js";

export default function Header() {
  const { isLoggedIn } = useAppContext();
  const [showDropdown, setShowDropdown] = React.useState(false);
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await apiClient.validateToken();
        setUserRole(response.role);
      } catch (error) {
        console.error("Error fetching user role:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isLoggedIn) {
      fetchUserRole();
    } else {
      setIsLoading(false);
    }
  }, [isLoggedIn]);

  const isAdmin = userRole === "IT Admin";

  const adminLinks = [
    { to: "/my-users", label: "Users" },
    { to: "/admin/buildings", label: "Buildings" },
    { to: "/my-desks", label: "Desks" },
    { to: "/admin/conference-rooms", label: "Conference Rooms" },
  ];

  const handleDropdownToggle = () => {
    setShowDropdown(!showDropdown);
  };

  const handleDropdownItemClick = () => {
    setShowDropdown(false);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-black py-6">
      <div className="container mx-auto flex justify-between items-center">
        <span className="text-3xl text-white font-bold tracking-tight">
          <Link to="/">DeskFlexi</Link>
        </span>
        <div className="flex space-x-2 items-center">
          {isLoggedIn && isAdmin && (
            <>
              <Link
                className="flex items-center text-white px-3 font-bold hover:bg-black"
                to="/my-bookings"
              >
                My Bookings
              </Link>
              <div className="relative">
                <button
                  onClick={handleDropdownToggle}
                  className="flex items-center text-white px-3 font-bold hover:bg-black"
                >
                  Admin Dashboard
                </button>
                {showDropdown && (
                  <div className="absolute z-10 bg-black text-white rounded-lg mt-1 py-2 w-40">
                    {adminLinks.map((link) => (
                      <Link
                        key={link.to}
                        to={link.to}
                        className="block px-4 py-2 hover:bg-gray-800"
                        onClick={handleDropdownItemClick}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {isLoggedIn && !isAdmin && (
            <Link
              className="flex items-center text-white px-3 font-bold hover:bg-black"
              to="/my-bookings"
            >
              My Bookings
            </Link>
          )}

          {isLoggedIn ? (
            <SignOutButton />
          ) : (
            <Link
              to="/sign-in"
              className="flex bg-white items-center text-black px-3 font-bold hover:bg-gray-100"
              style={{ padding: "8px 16px", borderRadius: "4px" }}
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
