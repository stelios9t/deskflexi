import React, { useState, useEffect } from "react";
import { useSearchContext } from "../contexts/SearchContext";
import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import AmenitiesFilter from "../components/AmenitiesFilter";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import Floor1 from "../components/Floor1/screens/Floor1/Floor1.jsx";
const Search = () => {
  const search = useSearchContext();
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [desks, setDesks] = useState([]);

  const searchParams = {
    deskNumber: search.deskNumber,
    checkIn: search.checkIn.toISOString(),
    checkOut: search.checkOut.toISOString(),
    floor: search.floor.toString(),
    amenities: selectedAmenities,
  };
  const {
    data: deskData,
    isLoading,
    refetch,
  } = useQuery(
    ["searchDesks", searchParams],
    () => apiClient.searchDesks(searchParams),
    {
      onSuccess: (data) => {
        setDesks(data.data); // Store desks in state
      },
    }
  );

  const handleAmenityChange = (event) => {
    const amenity = event.target.value;
    setSelectedAmenities((prevAmenities) =>
      event.target.checked
        ? [...prevAmenities, amenity]
        : prevAmenities.filter((prevAmenity) => prevAmenity !== amenity)
    );
  };

  return (
    <div className="mr-60">
      {/* amenities filter selection 
       will be implemented in the future, */}
      {/* <div className="rounded-lg border border-slate-300 p-5 h-fit sticky top-10">
        <div className="space-y-5">
          <h3 className="text-lg font-semibold border-b border-slate-300 pb-5">
            Filter by:
          </h3>
        </div>
        <AmenitiesFilter
          selectedAmenities={selectedAmenities}
          onChange={handleAmenityChange}
        />
      </div> */}
      {isLoading && (
        <div className="absolute z-10 inset-0 bg-black bg-opacity-25 flex justify-center items-center">
          <LoadingSpinner />
        </div>
      )}
      {/* This container ensures the Floor1 component is always rendered, allowing the spinner to overlay */}
      <div className="flex flex-col gap-5">
        <Floor1 />
      </div>
    </div>
  );
};

export default Search;
