import React from "react";
import { deskAmenities } from "../config/desk-options-config";
const AmenitiesFilter = ({ selectedAmenities, onChange }) => {
  return (
    <div className="border-b border-slate-300 pb-5">
      <h4 className="text-md font-semibold mb-2">Amenities</h4>
      {deskAmenities.map((amenity) => (
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            className="rounded"
            value={amenity}
            checked={selectedAmenities.includes(amenity)}
            onChange={onChange}
          />
          <span>{amenity}</span>
        </label>
      ))}
    </div>
  );
};

export default AmenitiesFilter;
