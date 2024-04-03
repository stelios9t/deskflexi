import React, { useState, useEffect } from "react";
import { Transition } from "@headlessui/react";
import * as apiClient from "../api-client.js";
import { useParams } from "react-router-dom";
import { useMutation } from "react-query";
import { useAppContext } from "../contexts/AppContext.jsx";
import roomIcon from "../room.webp";
const BookingSideBarCroom = ({ croom, closeModal }) => {
  const { croomId } = useParams();
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const { showToast } = useAppContext();
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

  return (
    <>
      <Transition
        show={croom !== null}
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
                <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                  <img
                    src={roomIcon}
                    alt="Room Icon"
                    className="mr-2"
                    style={{ width: "48px", height: "48px" }}
                  />
                  C-1
                </h3>

                <button
                  className="text-gray-500 hover:text-gray-700 focus:outline-none"
                  onClick={() => closeModal("closeIcon")}
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
                <p className="text-base text-gray-700">Loading</p>
              </div>
              <div className="flex justify-between mb-4">
                <p className="text-base text-gray-700">Status:</p>
                <p> Loading</p>
              </div>
              <div className="flex justify-between mb-4">
                <p className="text-base text-gray-700">Floor:</p>
                <p className="text-base text-gray-700">LOADING</p>
              </div>
              <div className="flex justify-between mb-4">
                <p className="text-base text-gray-700 mr-4">Amenities:</p>
              </div>
            </div>
          </div>
          <div className="p-4">
            <button>Loading</button>
          </div>
        </div>
      </Transition>
    </>
  );
};

export default BookingSideBarCroom;
