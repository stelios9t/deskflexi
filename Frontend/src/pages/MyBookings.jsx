import React, { useState } from "react";
import * as apiClient from "../api-client.js";
import { useQuery, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook
import booked from "../images/booked.jpg";
import { useAppContext } from "../contexts/AppContext.jsx";
const MyBookings = () => {
  const queryClient = useQueryClient(); // Get the queryClient instance
  const { data: desks, refetch } = useQuery(
    "fetchMyBookings",
    apiClient.fetchMyBookings
  );
  const { showToast } = useAppContext();

  const navigate = useNavigate(); // Initialize the navigate function
  const handleCancelBooking = async (deskId, userId, checkIn) => {
    try {
      await apiClient.cancelBooking(deskId, userId, checkIn);
      showToast({ message: "Booking canceled", type: "SUCCESS" });

      // First, filter out the cancelled booking
      const tempUpdatedDesks = desks.map((desk) => {
        if (desk._id === deskId) {
          return {
            ...desk,
            bookings: desk.bookings.filter(
              (booking) =>
                !(
                  booking.userId === userId &&
                  new Date(booking.checkIn).toLocaleDateString() ===
                    new Date(checkIn).toLocaleDateString()
                )
            ),
          };
        }
        return desk;
      });

      // Then, remove any desk that no longer has any bookings
      const updatedDesks = tempUpdatedDesks.filter(
        (desk) => desk.bookings.length > 0
      );

      queryClient.setQueryData("fetchMyBookings", updatedDesks);
    } catch (error) {
      showToast({ message: "Something went wrong!", type: "Error" });
    }
  };

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
              <div
                key={index}
                className="mt-2 bg-gray-100 p-2 rounded flex justify-between"
              >
                <div>
                  Date: {new Date(booking.checkIn).toLocaleDateString()}
                </div>
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                  onClick={() =>
                    handleCancelBooking(
                      desk._id,
                      booking.userId,
                      booking.checkIn
                    )
                  }
                >
                  Cancel
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyBookings;
