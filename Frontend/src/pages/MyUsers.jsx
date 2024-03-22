import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "react-query";
import * as apiClient from "../api-client.js";
import { MdEmail } from "react-icons/md";
import { BsPersonVcardFill } from "react-icons/bs";
import defaultImage from "../images/default-image.jpg";
import Pagination from "../components/Pagination";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
const MyUsers = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isPageLoading, setIsPageLoading] = useState(false); // Local loading state

  const { data, error, isLoading, isError } = useQuery(
    ["fetchMyUsers", currentPage],
    () => apiClient.fetchMyUsers(currentPage),
    {
      keepPreviousData: true,
      onSuccess: () => setIsPageLoading(false),
      onError: () => setIsPageLoading(false),
    }
  );

  const loading = isLoading || isPageLoading;

  const handlePageChange = (newPage) => {
    setIsPageLoading(true);
    setCurrentPage(newPage);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  if (!data || !data.data || data.data.length === 0) {
    return <span>No users found</span>;
  }

  return (
    <div className="space-y-5">
      <span className="flex justify-between">
        <h1 className="text-3xl font-bold">Users</h1>
        <Link
          to="/register"
          className="flex bg-black text-white text-xl font-bold p-2 hover:bg-gray-800"
        >
          Add User
        </Link>
      </span>
      <div className="grid grid-cols-1 gap-8">
        {data.data.map((user) => (
          <div
            key={user._id}
            className="flex flex-col border border-slate-300 rounded-lg p-8 gap-5"
          >
            <div className="flex items-center">
              {user.imageUrl ? (
                <img
                  src={user.imageUrl}
                  alt={`${user.firstName} ${user.lastName}`}
                  className="w-60 h-60 rounded-full mr-4"
                />
              ) : (
                <img
                  src={defaultImage}
                  alt="Default Image"
                  className="w-60 h-60 rounded-full mr-4"
                />
              )}
              <div>
                <h2 className="text-2xl font-bold">
                  {user.firstName} {user.lastName}
                </h2>
                <div className="rounded-sm p-3 flex items-center">
                  <BsPersonVcardFill className="mr-1" />
                  Role: {user.role}
                </div>
                <div className="rounded-sm p-3 flex items-center">
                  <MdEmail className="mr-1" />
                  Email: {user.email}
                </div>
              </div>
            </div>
            <span className="flex justify-end">
              <Link
                className="flex bg-black text-white text-xl font-bold p-2 hover:bg-gray-800"
                to={`/edit-user/${user._id}`}
              >
                View Details
              </Link>
            </span>
          </div>
        ))}
      </div>
      <Pagination
        page={currentPage}
        pages={data.pagination.pages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default MyUsers;
