import React, { useState } from "react";
import * as apiClient from "../api-client.js";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook
import booked from "../images/booked.jpg";
const MyBookings = () => {
  const { data: desks } = useQuery(
    "fetchMyBookings",
    apiClient.fetchMyBookings
  );
  const navigate = useNavigate(); // Initialize the navigate function

  if (!desks || desks.length === 0) {
    return <span>No bookings found</span>;
  }

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Bookings</h1>{" "}
      </div>
      {desks.map((desk) => (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_3fr] border border-slate-300 rounded-lg p-8 gap-5">
          <div className="lg:w-full lg:h-[250px]">
            <img
              src={booked}
              className="w-full h-full object-cover object-center"
            />
          </div>
          <div key={desk.deskNumber} className="mt-4">
            <div className="font-bold text-lg mb-2">
              Desk Number: {desk.deskNumber}
            </div>
            <div className="text-sm font-normal">Floor: {desk.floor}</div>
            {desk.bookings.map((booking, index) => (
              <div key={index} className="mt-2 bg-gray-100 p-2 rounded">
                <div>
                  Date: {new Date(booking.checkIn).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyBookings;
