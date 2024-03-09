import React, { useState, useEffect } from "react";
import { Transition } from "@headlessui/react";
import * as apiClient from "../api-client.js";
import { useParams } from "react-router-dom";

const BookingSideBar = ({ desk, closeModal }) => {
  const { deskId } = useParams();
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const userData = await apiClient.fetchCurrentUser();
        setCurrentUser(userData);
        setLoadingUser(false);
      } catch (error) {
        console.error("Error fetching current user:", error.message);
      }
    };

    fetchCurrentUser();
  }, []);

  // Filter out the "on" value from amenities
  const filteredAmenities = desk.amenities.filter(
    (amenity) => amenity !== "on"
  );

  return (
    <Transition
      show={desk !== null}
      as="div"
      className="fixed right-0 top-0 h-full w-80 bg-white shadow-lg z-50 overflow-y-auto"
      enter="transition-transform duration-1000 ease-out"
      enterFrom="transform translate-x-full"
      enterTo="transform translate-x-0"
      leave="transition-transform duration-1000 ease-out"
      leaveFrom="transform translate-x-0"
      leaveTo="transform translate-x-full"
    >
      <div className="h-full flex flex-col justify-between">
        <div>
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">
                D-{desk.deskNumber}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
          <div className="p-4">
            <div className="flex justify-between mb-4">
              <p className="text-base text-gray-700">Book for:</p>
              <p className="text-base text-gray-700">
                {loadingUser
                  ? "Loading..."
                  : `${currentUser?.firstName} ${currentUser?.lastName}`}
              </p>
            </div>
            <div className="flex justify-between mb-4">
              <p className="text-base text-gray-700">Status:</p>
              <p className="text-base text-gray-700">
                {desk.status || "Loading..."}
              </p>
            </div>
            <div className="flex justify-between mb-4">
              <p className="text-base text-gray-700">Floor:</p>
              <p className="text-base text-gray-700">
                {desk.floor || "Loading..."}
              </p>
            </div>
            <div className="flex justify-between mb-4">
              <p className="text-base text-gray-700">Amenities:</p>
              <p className="text-base text-gray-700">
                {filteredAmenities.join(", ") || "None"}
              </p>
            </div>
          </div>
        </div>
        <div className="p-4">
          <button
            onClick={closeModal}
            className="text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 w-full"
          >
            Book this desk
          </button>
        </div>
      </div>
    </Transition>
  );
};

export default BookingSideBar;
