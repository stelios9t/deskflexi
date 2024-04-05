import React, { useState, useEffect } from "react";
import { useSearchContext } from "../contexts/SearchContext";
import { CiDesktop } from "react-icons/ci";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import { FaRegBuilding } from "react-icons/fa";

const SearchBar = () => {
  const navigate = useNavigate();
  const search = useSearchContext();
  const [deskNumber, setDeskNumber] = useState(search.deskNumber);
  const [checkIn, setCheckIn] = useState(search.checkIn);
  // Removed the useState for checkout and instead use the checkIn date for both
  const [floor, setFloor] = useState(search.floor);

  const handleSubmit = (event) => {
    event.preventDefault();

    // Use checkIn date for both checkIn and checkOut
    search.saveSearchValues(deskNumber, checkIn, checkIn, floor);
    navigate("/search");
  };

  useEffect(() => {
    setDeskNumber(search.deskNumber);
    setCheckIn(search.checkIn);
    // No need to set checkOut here since it follows checkIn
    setFloor(search.floor);
  }, [search.deskNumber, search.checkIn, search.floor]);

  const minDate = new Date();
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 9);

  const handleClear = (event) => {
    event.preventDefault();
    const today = new Date();

    setDeskNumber("");
    setCheckIn(today);
    // No separate checkOut state to update
    setFloor(1);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="-mt-8 p-3 bg-orange-400 rounded shadow-md grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 items-center gap-4"
    >
      <div className="flex flex-row items-center flex-1 bg-white p-2">
        <CiDesktop size={25} className="mr-2" />
        <input
          placeholder="Search for a specific desk"
          className="text-md w-full focus:outline-none"
          value={deskNumber}
          type="number"
          onChange={(event) => {
            setDeskNumber(event.target.value);
          }}
        />
      </div>
      <div className="flex bg-white px-2 py-1 gap-2">
        <label className="items-center flex w-full">
          <FaRegBuilding size={25} className="mr-2" />
          Floor:
          <select
            className="w-full p-1 focus:outline-none font-bold"
            value={floor}
            onChange={(event) => {
              setFloor(parseInt(event.target.value));
            }}
          >
            <option value={1}>1</option>
            <option value={2}>2</option>
          </select>
        </label>
      </div>
      <div>
        <DatePicker
          selected={checkIn}
          onChange={(date) => {
            setCheckIn(date);
          }}
          minDate={minDate}
          maxDate={maxDate}
          placeholder="Check-in Date"
          className="min-w-full bg-white p-2 focus:outline-none"
          wrapperClassName="min-w-full"
        />
      </div>
      <div className="flex gap-2">
        <button className="bg-black text-white h-full p-2 font-bold text-xl hover:bg-gray-800 rounded flex-grow">
          Search
        </button>
        <button
          onClick={handleClear}
          className="bg-red-600 text-white h-full p-2 font-bold text-xl hover:bg-red-500 rounded w-36" // Adjust the width as needed
        >
          Clear
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
