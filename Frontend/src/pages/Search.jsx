import React, { useState, useEffect } from "react";
import { useSearchContext } from "../contexts/SearchContext";
import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import SearchResultsCard from "../components/SearchResultsCard";
import Pagination from "../components/Pagination";
import AmenitiesFilter from "../components/AmenitiesFilter";

const Search = () => {
  const search = useSearchContext();
  const [page, setPage] = useState(1);
  const [selectedAmenities, setSelectedAmenities] = useState([]);

  const searchParams = {
    deskNumber: search.deskNumber,
    checkIn: search.checkIn.toISOString(),
    checkOut: search.checkOut.toISOString(),
    floor: search.floor.toString(),
    page: page.toString(),
    amenities: selectedAmenities,
  };

  const { data: deskData, refetch } = useQuery(
    ["searchDesks", searchParams],
    () => apiClient.searchDesks(searchParams)
  );

  const handleAmenityChange = (event) => {
    const amenity = event.target.value;
    setSelectedAmenities((prevAmenities) =>
      event.target.checked
        ? [...prevAmenities, amenity]
        : prevAmenities.filter((prevAmenity) => prevAmenity !== amenity)
    );
  };

  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
    refetch(); // Fetch desks for the new page
  };

  useEffect(() => {
    // Reset page to 1 when search parameters change
    setPage(1);
  }, [search.deskNumber, search.checkIn, search.checkOut, search.floor]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-5">
      <div className="rounded-lg border border-slate-300 p-5 h-fit sticky top-10">
        <div className="space-y-5">
          <h3 className="text-lg font-semibold border-b border-slate-300 pb-5">
            Filter by:
          </h3>
        </div>
        <AmenitiesFilter
          selectedAmenities={selectedAmenities}
          onChange={handleAmenityChange}
        />
      </div>
      <div className="flex flex-col gap-5">
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold">
            {deskData?.pagination.total} Desks found
            {search.deskNumber ? ` for Desk ${search.deskNumber}` : ""}
          </span>
        </div>
        {deskData?.data.map((desk) => (
          <SearchResultsCard key={desk._id} desk={desk} />
        ))}
        <div>
          <Pagination
            page={deskData?.pagination.page || 1}
            pages={deskData?.pagination.pages || 1}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default Search;
