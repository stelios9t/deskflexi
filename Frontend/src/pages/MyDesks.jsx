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

  const { data, error, isLoading, isError } = useQuery(
    ["fetchMyDesks", currentPage],
    () => apiClient.fetchMyDesks(currentPage),
    {
      keepPreviousData: true,
      onSuccess: () => setIsPageLoading(false),
      onError: () => setIsPageLoading(false),
    }
  );

  // Combine global and local loading states for smoother UX
  const loading = isLoading || isPageLoading;

  // Enhance page change handler
  const handlePageChange = (newPage) => {
    setIsPageLoading(true); // Set local loading state
    setCurrentPage(newPage);
  };

  if (loading) {
    // Check the combined loading state
    return <LoadingSpinner />;
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  if (!data || !data.data || data.data.length === 0) {
    return <span>No desks found</span>;
  }
  return (
    <div className="space-y-5">
      <span className="flex justify-between">
        <h1 className="text-3xl font-bold">Desks</h1>
        <Link
          to="/add-desk"
          className="flex bg-black text-white text-xl font-bold p-2 hover:bg-gray-800"
        >
          Add Desk
        </Link>
      </span>
      <div className="grid grid-cols-2 gap-8">
        {data.data.map((desk) => (
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
                className="flex bg-black text-white text-xl font-bold p-2 hover:bg-black"
                to={`/edit-desk/${desk._id}`}
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

export default MyDesks;
