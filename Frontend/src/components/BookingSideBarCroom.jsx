import React from "react";
import { Transition } from "@headlessui/react";
import roomIcon from "../images/room.webp";

const BookingSideBarCroom = ({ croom, closeModal }) => {
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
                  C-{croom.croomNumber}
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
                <p className="text-base text-gray-700">
                  Conference room {croom.croomNumber} is available at all times
                  in a first come first served way. Ensure that a meeting does
                  not exceed 3 hours.
                </p>
              </div>
            </div>
          </div>
          <div className="p-4">
            <button
              className={`text-white ${"bg-black hover:bg-gray-800"} focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 w-full`}
              onClick={() => closeModal("closeIcon")}
            >
              Close
            </button>
          </div>
        </div>
      </Transition>
    </>
  );
};

export default BookingSideBarCroom;
