import React from "react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div
      id="dropdownHover"
      className="z-10 hidden absolute right-0 mt-2 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700"
    >
      <ul
        className="py-2 text-sm text-gray-700 dark:text-gray-200"
        aria-labelledby="dropdownHoverButton"
      >
        <li>
          <Link
            to="/dashboard"
            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
          >
            Dashboard
          </Link>
        </li>
        <li>
          <Link
            to="/settings"
            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
          >
            Settings
          </Link>
        </li>
        <li>
          <Link
            to="/earnings"
            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
          >
            Earnings
          </Link>
        </li>
        <li>
          <Link
            to="/sign-out"
            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
          >
            Sign out
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default AdminDashboard;
