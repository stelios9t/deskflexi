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
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const { data, error, isLoading, isError } = useQuery(
    ["fetchMyUsers", currentPage, searchTerm],
    () => apiClient.fetchMyUsers(currentPage, searchTerm),
    {
      keepPreviousData: true,
    }
  );

  const handleSearchChange = (e) => setSearchInput(e.target.value);
  const handleSearchClick = () => {
    setSearchTerm(searchInput);
    setSearchInput("");
  };
  const handlePageChange = (newPage) => setCurrentPage(newPage);

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold mr-4">Users</h1>
        <input
          type="text"
          value={searchInput}
          onChange={handleSearchChange}
          placeholder="Search by first name"
          className="input bg-white border border-slate-300 p-2 mr-2"
        />
        <button
          onClick={handleSearchClick}
          className="bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded mr-2"
        >
          Search
        </button>
        <Link
          to="/register"
          className="ml-auto flex bg-black text-white text-xl font-bold p-2 hover:bg-gray-800 rounded"
        >
          Add User
        </Link>
      </div>
      {isLoading ? (
        <LoadingSpinner />
      ) : isError ? (
        <span>Error: {error.message}</span>
      ) : (
        <>
          {data.data.length > 0 ? (
            <div className="grid grid-cols-1 gap-8">
              {data.data.map((user) => (
                <div
                  key={user._id}
                  className="flex flex-col border border-slate-300 rounded-lg p-8 gap-5"
                >
                  <div className="flex items-center">
                    <img
                      src={user.imageUrl || defaultImage}
                      alt={`${user.firstName} ${user.lastName}`}
                      className="w-60 h-60 rounded-full mr-4"
                    />
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
                      className="flex bg-black text-white text-xl font-bold p-2 hover:bg-gray-800 rounded"
                      to={`/edit-user/${user._id}`}
                    >
                      View Details
                    </Link>
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <span className="text-center mt-4">No users found</span>
          )}
        </>
      )}
      <Pagination
        page={currentPage}
        pages={data?.pagination?.pages || 1}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default MyUsers;
