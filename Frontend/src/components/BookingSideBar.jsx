import React, { useState, useEffect } from "react";
import { Transition } from "@headlessui/react";
import * as apiClient from "../api-client.js";
import { useParams } from "react-router-dom";
import { useMutation } from "react-query";
import { useAppContext } from "../contexts/AppContext.jsx";
import { useSearchContext } from "../contexts/SearchContext.jsx";
import BookingModal from "./BookingModal.jsx";
import deskIcon from "../images/desk-icon.avif";
const BookingSideBar = ({ desk, closeModal }) => {
  const { deskId } = useParams();
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const { showToast } = useAppContext();
  const [isBooked, setIsBooked] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [bookingUser, setBookingUser] = useState(null);

  const search = useSearchContext();

  useEffect(() => {
    const fetchCurrentUserAndDeskDetails = async () => {
      setLoadingUser(true);
      try {
        const userData = await apiClient.fetchCurrentUser();
        setCurrentUser(userData);

        const deskDetails = await apiClient.fetchDeskById(deskId);
        const requestedCheckIn = new Date(search.checkIn).setHours(0, 0, 0, 0);
        const requestedCheckOut = new Date(search.checkOut).setHours(
          0,
          0,
          0,
          0
        );

        let alreadyBooked = false;
        deskDetails.bookings.forEach((booking) => {
          const bookingStart = new Date(booking.checkIn).setHours(0, 0, 0, 0);
          const bookingEnd = new Date(booking.checkOut).setHours(0, 0, 0, 0);
          if (
            requestedCheckIn <= bookingEnd &&
            requestedCheckOut >= bookingStart
          ) {
            alreadyBooked = true;
            const bookingName = `${booking.firstName} ${booking.lastName}`;
            // Check if the current user is the one who made the booking
            if (booking.userId === userData._id) {
              setBookingUser(`${bookingName} (you)`);
            } else {
              setBookingUser(bookingName);
            }
          }
        });

        setIsBooked(alreadyBooked);
      } catch (error) {
        console.error("Error:", error.message);
      }
      setLoadingUser(false);
    };

    fetchCurrentUserAndDeskDetails();
  }, [deskId, search.checkIn, search.checkOut]);

  const { mutate: bookDesk, isLoading } = useMutation(
    apiClient.createDeskBooking,
    {
      onSuccess: () => {
        showToast({ message: "Booking Saved!", type: "SUCCESS" });
        closeModal("booking");
      },
      onError: (error) => {
        console.error("Booking error:", error); // It's helpful to log the entire error for debugging.
        // This condition checks if the error message matches.
        if (error.message === "You have already booked a desk for this date.") {
          console.log("Triggering modal due to double booking."); // Additional log for debugging.
          setShowModal(true);
        } else {
          showToast({ message: "Something went wrong!", type: "Error" });
        }
      },
    }
  );

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

  const filteredAmenities = desk.amenities.filter(
    (amenity) => amenity !== "on"
  );

  const handleBookDesk = () => {
    if (isBooked) {
      setShowModal(true);
    } else {
      bookDesk({
        deskId,
        userId: currentUser?._id,
        firstName: currentUser?.firstName,
        lastName: currentUser?.lastName,
        email: currentUser?.email,
        checkIn: search.checkIn.toISOString(),
        checkOut: search.checkOut.toISOString(),
      });
    }
  };
  return (
    <>
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
                <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                  <img
                    src={deskIcon}
                    alt="Desk Icon"
                    className="mr-2"
                    style={{ width: "48px", height: "48px" }}
                  />
                  D-{desk.deskNumber}
                </h3>

                <button
                  onClick={() => closeModal("closeIcon")}
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
                <p className="text-base text-gray-700">
                  {isBooked ? "Booked by:" : "Book for:"}
                </p>
                <p className="text-base text-gray-700">
                  {loadingUser
                    ? "Loading..."
                    : isBooked
                    ? bookingUser
                    : `${currentUser?.firstName} ${currentUser?.lastName}`}
                </p>
              </div>

              <div className="flex justify-between mb-4">
                <p className="text-base text-gray-700">Status:</p>
                <p
                  className={`text-base ${
                    isBooked ? "text-red-500" : "text-green-500"
                  }`}
                >
                  {isBooked ? "Booked" : "Available"}
                </p>
              </div>
              <div className="flex justify-between mb-4">
                <p className="text-base text-gray-700">Floor:</p>
                <p className="text-base text-gray-700">
                  {desk.floor || "Loading..."}
                </p>
              </div>
              <div className="flex justify-between mb-4">
                <p className="text-base text-gray-700 mr-4">Amenities:</p>
                <div className="flex justify-end flex-1">
                  <ul className="list-disc space-y-1 text-right">
                    {filteredAmenities.map((amenity, index) => (
                      <li key={index} className="text-base text-gray-700">
                        {amenity}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="p-4">
            <button
              onClick={handleBookDesk}
              disabled={isBooked || loadingUser}
              className={`text-white ${
                isBooked || loadingUser
                  ? "bg-gray-500"
                  : "bg-black hover:bg-gray-800"
              } focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 w-full`}
            >
              {isBooked ? "Booked" : "Book Desk"}
            </button>
          </div>
        </div>
      </Transition>
      {showModal && (
        <BookingModal isOpen={showModal} onClose={() => setShowModal(false)} />
      )}
    </>
  );
};

export default BookingSideBar;
