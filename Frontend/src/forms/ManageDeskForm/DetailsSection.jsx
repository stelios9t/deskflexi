import React from "react";
import { useFormContext } from "react-hook-form";

const DetailsSection = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  return (
    <div className="flex flex-col gap-4 ">
      <label className="text-gray-700 text-sm font-bold">
        Number
        <input
          type="number"
          min={1}
          className="border rounded w-full py-1 px-2 font-normal"
          {...register("deskNumber", { required: "This field is required" })}
        />
        {errors.deskNumber && (
          <span className="text-red-500">{errors.deskNumber.message}</span>
        )}
      </label>

      <label className="text-gray-700 text-sm font-bold">
        Floor
        <select
          {...register("floor", {
            required: "This field is required",
          })}
          className="border rounded w-full p-2 text-gray-700 font-normal"
        >
          <option value="" className="text-sm font-bold">
            Select a Floor
          </option>
          {[1, 2].map((num) => (
            <option value={num}>{num}</option>
          ))}
        </select>
        {errors.floor && (
          <span className="text-red-500">{errors.floor.message}</span>
        )}
      </label>
    </div>
  );
};

export default DetailsSection;
