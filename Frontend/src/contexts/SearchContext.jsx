import React, { createContext, useContext, useState } from "react";
const SearchContext = createContext(undefined);

export const SearchContextProvider = ({ children }) => {
  const [deskNumber, setDeskNumber] = useState("");
  const [checkIn, setCheckIn] = useState(new Date());
  const [checkOut, setCheckOut] = useState(new Date());
  const [floor, setFloor] = useState(1);
  const [deskId, setDeskId] = useState("");
  const saveSearchValues = (deskNumber, checkIn, checkOut, floor, deskId) => {
    setDeskNumber(deskNumber ? deskNumber : "");
    setCheckIn(checkIn);
    setCheckOut(checkOut);
    setFloor(floor);
    if (deskId) {
      setDeskId(deskId);
    }
  };
  const clearSearch = () => {
    setDeskNumber("");
    setCheckIn(new Date());
    setCheckOut(new Date());
    setFloor(1);
    setDeskId("");
  };

  return (
    <SearchContext.Provider
      value={{
        deskNumber,
        checkIn,
        checkOut,
        floor,
        deskId,
        saveSearchValues,
        clearSearch,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearchContext = () => {
  const context = useContext(SearchContext);
  return context;
};
