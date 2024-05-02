import React, { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import DetailsSection from "./DetailsSection";
import AmenitiesSection from "./AmenitiesSection";
import { useNavigate } from "react-router-dom";

const ManageDeskForm = ({ onSave, isLoading, desk, mode, onDelete }) => {
  const formMethods = useForm();
  const { handleSubmit, reset, setValue } = formMethods;
  const navigate = useNavigate();

  useEffect(() => {
    reset(desk);
  }, [desk, reset]);

  useEffect(() => {
    // When desk amenities change, update checkbox values
    if (desk && desk.amenities) {
      const selectedAmenities = {};
      desk.amenities.forEach((amenity) => {
        selectedAmenities[amenity] = true;
      });
      setValue("amenities", selectedAmenities);
    }
  }, [desk, setValue]);

  const onSubmit = handleSubmit((formDataJson) => {
    if (desk) {
      formDataJson.deskId = desk._id;
    }

    // Convert checkbox values to array of selected amenities
    const selectedAmenities = Object.keys(formDataJson.amenities).filter(
      (key) => formDataJson.amenities[key]
    );

    const deskData = {
      deskNumber: formDataJson.deskNumber,
      floor: formDataJson.floor,
      amenities: selectedAmenities, // Use selected amenities array
    };

    onSave(deskData);

    reset();
  });
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          {mode === "edit" ? "Edit Desk" : "Add Desk"}
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
      <FormProvider {...formMethods}>
        <form onSubmit={onSubmit} className="flex flex-col gap-10">
          <DetailsSection />
          <AmenitiesSection />
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate("/my-desks")}
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
                ? "Loading..."
                : mode === "edit"
                ? "Update Desk"
                : "Save Desk"}
            </button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default ManageDeskForm;
