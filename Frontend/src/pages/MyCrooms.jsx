import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import { FaRegBuilding } from "react-icons/fa";
import Pagination from "../components/Pagination";
import LoadingSpinner from "../components/LoadingSpinner";
import roomIcon from "../room.webp";
const MyCrooms = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const { data, error, isLoading, isError } = useQuery(
    ["fetchMyCrooms", currentPage, searchTerm],
    () => apiClient.fetchMyCrooms(currentPage, searchTerm),
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
          <h1 className="text-3xl font-bold mr-4">Conference Rooms</h1>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search by room number"
            className="input bg-white border border-slate-300 p-2 mr-2 rounded"
          />
        </div>
        <Link
          to="/add-croom"
          className="bg-black text-white font-bold py-2 px-4 rounded"
        >
          Add Conference Room
        </Link>
      </div>
      {isLoading ? (
        <LoadingSpinner />
      ) : isError ? (
        <span>Error: {error.message}</span>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          {data.data.map((croom) => (
            <div
              key={croom._id}
              className="border border-slate-300 rounded-lg p-8"
            >
              <div className="flex items-center">
                <img
                  src={roomIcon}
                  alt="Conference Room"
                  className="w-60 h-60 rounded-full mr-4"
                />
                <div>
                  <h2 className="text-2xl font-bold">
                    Room Number: {croom.croomNumber}
                  </h2>
                  <div className="flex items-center mt-2">
                    <FaRegBuilding className="mr-2" />
                    Floor: {croom.floor}
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <Link
                  to={`/edit-croom/${croom._id}`}
                  className="bg-black text-white font-bold py-2 px-4 rounded hover:bg-gray-800"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
      <Pagination
        page={currentPage}
        totalPages={data?.pagination?.pages || 1}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default MyCrooms;
