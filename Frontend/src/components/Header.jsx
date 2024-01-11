import * as React from "react";
import { Link } from "react-router-dom";
import "../styles/components.css";
import { useAppContext } from "../contexts/AppContext";
import SignOutButton from "./SignOutButton";
export default function Header() {
  const { isLoggedIn } = useAppContext();
  return (
    <div className="bg-black py-6">
      <div className="container mx-auto flex justify-between">
        <span className="text-3xl text-white font-bold tracking-tight">
          <Link to="/">DeskFlexi</Link>
        </span>
        <span className="flex space-x-2">
          {isLoggedIn ? (
            <>
              <Link
                className="flex items-center text-white px-3 font-bold hover:bg-black"
                to="/my-bookings"
              >
                My Bookings
              </Link>
              {/* <Link to="/my-bookings">My Bookings</Link> */}
              <SignOutButton />
            </>
          ) : (
            <Link
              to="/sign-in"
              className="flex bg-white items-center text-black px-3 font-bold hover:bg-gray-100"
            >
              Sign In
            </Link>
          )}
        </span>
      </div>
    </div>
  );
}
