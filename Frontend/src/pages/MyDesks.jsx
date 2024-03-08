import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import { FaRegBuilding } from "react-icons/fa";

const MyDesks = () => {
  const { data } = useQuery("fetchMyDesks", apiClient.fetchMyDesks, {
    onError: () => {},
  });

  if (!data) {
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
        {data.map((desk) => (
          <div
            key={desk._id}
            className="flex flex-col justify-betyween border border-slate-300 rounded-lg p-8 gap-5"
          >
            <h2 className="text-2xl font-bold">
              Desk Number: {desk.deskNumber}
            </h2>
            <div className="grid grid-cols-5 gap-2">
              <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                <FaRegBuilding className="mr-1" />
                Floor: {desk.floor}
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
    </div>
  );
};

export default MyDesks;
