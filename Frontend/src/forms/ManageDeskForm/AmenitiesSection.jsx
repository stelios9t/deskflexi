import React from "react";
import { useFormContext } from "react-hook-form";
import { deskAmenities } from "../../config/desk-options-config";

const AmenitiesSection = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div>
      <h2 className="text-2xl font-bold mb-3">Amenities</h2>
      <div className="grid grid-cols-5 gap-3">
        {deskAmenities.map((amenity) => (
          <label className="text-sm flex gap-1 text-gray-700" key={amenity}>
            <input
              type="checkbox"
              {...register(`amenities.${amenity}`)} // Use correct name for checkbox
            />
            {amenity}
          </label>
        ))}
      </div>
      {errors.amenities && (
        <span className="text-red-500 text-sm font-bold">
          {errors.amenities.message}
        </span>
      )}
    </div>
  );
};

export default AmenitiesSection;
