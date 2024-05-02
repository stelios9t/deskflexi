import React, { useState } from "react";
import { useSearchContext } from "../contexts/SearchContext";
import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import Floor1 from "../components/Floor1/screens/Floor1/Floor1.jsx";
import Floor2 from "../components/Floor2/screens/Floor/Floor2.jsx";
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
  const renderFloorComponent = () => {
    switch (search.floor) {
      case 1:
        return <Floor1 />;
      case 2:
        return <Floor2 />;
      default:
        return null; // Optionally handle cases where floor is not 1 or 2
    }
  };

  return (
    <div className="mr-60">
      {isLoading && (
        <div className="absolute z-10 inset-0 bg-black bg-opacity-25 flex justify-center items-center">
          <LoadingSpinner />
        </div>
      )}
      {/* This container ensures the Floor1 component is always rendered, allowing the spinner to overlay */}
      <div className="flex flex-col gap-5">{renderFloorComponent()}</div>
    </div>
  );
};

export default Search;
