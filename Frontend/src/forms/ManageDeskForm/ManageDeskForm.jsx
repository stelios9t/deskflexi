import React, { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import DetailsSection from "./DetailsSection";
import AmenitiesSection from "./AmenitiesSection";
const ManageDeskForm = ({ onSave, isLoading, desk }) => {
  const formMethods = useForm();
  const { handleSubmit, reset } = formMethods;
  useEffect(() => {
    reset(desk);
  }, [desk, reset]);

  const onSubmit = handleSubmit((formDataJson) => {
    if (desk) {
      formDataJson.deskId = desk._id;
    }
    const deskData = {
      deskNumber: formDataJson.deskNumber,
      floor: formDataJson.floor,
      amenities: formDataJson.amenities,
    };

    onSave(deskData);

    reset();
  });

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={onSubmit} className="flex flex-col gap-10">
        <DetailsSection />
        <AmenitiesSection />
        <span className="flex justify-end">
          <button
            disabled={isLoading}
            type="submit"
            className="bg-black text-white p-2 font-bold  text-xl disabled:bg-gray-500"
          >
            {isLoading ? "Saving..." : "Save"}
          </button>
        </span>
      </form>
    </FormProvider>
  );
};

export default ManageDeskForm;
