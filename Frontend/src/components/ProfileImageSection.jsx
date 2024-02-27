import React from "react";
import { useForm } from "react-hook-form";

const ProfileImageSection = ({ register }) => {
  const {
    formState: { errors },
  } = useForm();

  return (
    <div>
      <h2 className="text-2xl font-bold mb-3">Profile Image</h2>
      <div className="border rounded p-4 flex flex-col gap-4">
        <input
          type="file"
          accept="image/*"
          className="w-full text-gray-700 font-normal"
          {...register("imageFile", {
            validate: (imageFile) => {
              const totalLength = imageFile?.length || 0;
              if (totalLength > 1) {
                return "Only one image can be added";
              }
              return true;
            },
          })}
        />
      </div>
      {errors.imageFile && (
        <span className="text-red-500 text-sm font-bold">
          {errors.imageFile.message}
        </span>
      )}
    </div>
  );
};

export default ProfileImageSection;
