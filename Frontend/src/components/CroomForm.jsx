import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const CroomForm = ({ onSave, isLoading, croom, mode, onDelete }) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  // Pre-fill form when editing
  useEffect(() => {
    if (croom) {
      setValue("croomNumber", croom.croomNumber);
      setValue("floor", croom.floor);
    }
  }, [croom, setValue]);

  const onSubmit = (formData) => {
    onSave(formData);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          {mode === "edit" ? "Edit Conference Room" : "Add Conference Room"}
        </h1>
        {mode === "edit" && (
          <button
            type="button"
            onClick={onDelete}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Delete
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label
            htmlFor="croomNumber"
            className="text-gray-700 text-sm font-bold"
          >
            Room Number
            <input
              id="croomNumber"
              type="number"
              {...register("croomNumber", {
                required: "Room number is required",
              })}
              className="border rounded w-full py-2 px-3 mt-1 focus:outline-none focus:ring focus:border-blue-300"
            />
            {errors.croomNumber && (
              <p className="text-red-500">{errors.croomNumber.message}</p>
            )}
          </label>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="floor" className="text-gray-700 text-sm font-bold">
            Floor
            <select
              id="floor"
              type="number"
              {...register("floor", { required: "Floor is required" })}
              className="border rounded w-full py-2 px-3 mt-1 focus:outline-none focus:ring focus:border-blue-300"
            >
              <option value="" className="text-sm font-bold">
                Select a Floor
              </option>
              {[1, 2].map((num) => (
                <option value={num}>{num}</option>
              ))}
            </select>
            {errors.floor && (
              <p className="text-red-500">{errors.floor.message}</p>
            )}
          </label>
        </div>
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate("/my-crooms")}
            className="bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded"
          >
            Back
          </button>
          <button
            disabled={isLoading}
            type="submit"
            className="bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded"
          >
            {isLoading
              ? "Processing..."
              : mode === "edit"
              ? "Update Room"
              : "Add Room"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CroomForm;
