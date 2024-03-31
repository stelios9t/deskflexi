import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import { FaRegBuilding } from "react-icons/fa";
import Pagination from "../components/Pagination";
import LoadingSpinner from "../components/LoadingSpinner";

const MyDesks = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const { data, error, isLoading, isError } = useQuery(
    ["fetchMyDesks", currentPage, searchTerm],
    () => apiClient.fetchMyDesks(currentPage, searchTerm),
    {
      keepPreviousData: true,
      onSuccess: () => setIsPageLoading(false),
      onError: () => setIsPageLoading(false),
    }
  );

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const loading = isLoading || isPageLoading;

  const handlePageChange = (newPage) => {
    setIsPageLoading(true);
    setCurrentPage(newPage);
  };

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <h1 className="text-3xl font-bold mr-4">Desks</h1>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search by desk number"
            className="input bg-white border border-slate-300 p-2"
          />
        </div>
        <Link
          to="/add-desk"
          className="flex bg-black text-white text-xl font-bold p-2 hover:bg-gray-800 rounded"
        >
          Add Desk
        </Link>
      </div>
      {loading ? (
        <LoadingSpinner />
      ) : isError ? (
        <span>Error: {error.message}</span>
      ) : (
        <div className="grid grid-cols-2 gap-8">
          {data.data.length > 0 ? (
            data.data.map((desk) => (
              <div
                key={desk._id}
                className="flex flex-col justify-between border border-slate-300 rounded-lg p-8 gap-5"
              >
                <h2 className="text-2xl font-bold">
                  Desk Number: {desk.deskNumber}
                </h2>
                <div className="grid grid-cols-5 gap-2">
                  <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                    <FaRegBuilding className="mr-1" /> Floor: {desk.floor}
                  </div>
                </div>
                <span className="flex justify-end">
                  <Link
                    className="flex bg-black text-white text-xl font-bold p-2 hover:bg-black rounded"
                    to={`/edit-desk/${desk._id}`}
                  >
                    View Details
                  </Link>
                </span>
              </div>
            ))
          ) : (
            <span className="col-span-2 text-center">No desks found</span>
          )}
        </div>
      )}
      <Pagination
        page={currentPage}
        pages={data?.pagination?.pages || 1}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default MyDesks;
