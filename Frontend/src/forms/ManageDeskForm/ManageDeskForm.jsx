import React, { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import DetailsSection from "./DetailsSection";
import AmenitiesSection from "./AmenitiesSection";
import { useNavigate } from "react-router-dom";

const ManageDeskForm = ({ onSave, isLoading, desk }) => {
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
    <FormProvider {...formMethods}>
      <form onSubmit={onSubmit} className="flex flex-col gap-10">
        <DetailsSection />
        <AmenitiesSection />
        <span className="flex justify-end gap-4">
          <button
            type="button"
            className="bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded"
            onClick={() => navigate("/my-desks")}
          >
            Back
          </button>

          <button
            disabled={isLoading}
            type="submit"
            className="bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded"
          >
            {isLoading ? "Updating..." : "Update Desk"}
          </button>
        </span>
      </form>
    </FormProvider>
  );
};

export default ManageDeskForm;
