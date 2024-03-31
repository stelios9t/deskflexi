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
  const [checkOut, setCheckOut] = useState(search.checkOut);
  const [floor, setFloor] = useState(search.floor);
  const handleSubmit = (event) => {
    event.preventDefault();

    search.saveSearchValues(deskNumber, checkIn, checkOut, floor);
    navigate("/search");
  };
  useEffect(() => {
    setDeskNumber(search.deskNumber);
    setCheckIn(search.checkIn);
    setCheckOut(search.checkOut);
    setFloor(search.floor);
  }, [search.deskNumber, search.checkIn, search.checkOut, search.floor]);

  const minDate = new Date();
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 9);
  useEffect(() => {
    setDeskNumber(search.deskNumber);
  }, [search.deskNumber]);
  const handleClear = (event) => {
    event.preventDefault();

    setDeskNumber("");
    setCheckIn(new Date());
    setCheckOut(new Date());
    setFloor(1);
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="-mt-8 p-3 bg-orange-400 rounded shadow-md grid grid-cols-2 lg: grid-cols-3 2xl:grid-cols-5 items-center gap-4"
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
          onChange={(date) => setCheckIn(date)}
          selectStart
          startDate={checkIn}
          endDate={checkOut}
          minDate={minDate}
          maxDate={maxDate}
          placeholder="Check-in Date"
          className="min-w-full bg-white p-2 focus:outline-none"
          wrapperClassName="min-w-full"
        />
      </div>
      <div>
        <DatePicker
          selected={checkOut}
          onChange={(date) => setCheckOut(date)}
          selectStart
          startDate={checkIn}
          endDate={checkOut}
          minDate={minDate}
          maxDate={maxDate}
          placeholder="Check-in Date"
          className="min-w-full bg-white p-2 focus:outline-none"
          wrapperClassName="min-w-full"
        />
      </div>
      <div className="flex gap-1">
        <button className="w-2/3 bg-black text-white h-full p-2 font-bold text-xl hover:bg-gray-800 rounded">
          Search
        </button>
        <button
          onClick={handleClear}
          className="w-1/3 bg-red-600 text-white h-full p-2 font-bold text-xl hover:bg-red-500 rounded"
        >
          Clear
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
