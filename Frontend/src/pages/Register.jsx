import React from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api-client";
import { useAppContext } from "../contexts/AppContext";
import { useNavigate } from "react-router-dom";
import ProfileImageSection from "../components/ProfileImageSection";

const Register = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { showToast } = useAppContext();
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      imageFile: null,
    },
  });
  const mutation = useMutation(apiClient.register, {
    onSuccess: async () => {
      showToast({ message: "Registration Success", type: "SUCCESS" });
      await queryClient.invalidateQueries("validateToken");
      navigate("/my-users");
    },
    onError: (error) => {
      showToast({ message: error.message, type: "ERROR" });
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    const formData = new FormData();
    formData.append("firstName", data.firstName);
    formData.append("lastName", data.lastName);
    formData.append("email", data.email);
    formData.append("role", data.role);
    formData.append("password", data.password);
    formData.append("confirmPassword", data.confirmPassword);

    if (data.imageFile && data.imageFile[0]) {
      formData.append("imageFile", data.imageFile[0]);
    }

    try {
      await mutation.mutateAsync(formData);
      // Handle success, navigate or show message
    } catch (error) {
      // Handle error, show error message
    }
  });
  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
      <h2 className="text-3xl font-bold">Create an Account</h2>
      <div className="flex flex-col md:flex-row gap-5">
        <div className="flex-1">
          <label className="text-gray-700 text-sm font-bold">
            First Name
            <input
              className="border rounded w-full py-1 px-2 font-normal"
              {...register("firstName", { required: "This field is required" })}
            />
            {errors.firstName && (
              <span className="text-red-500">{errors.firstName.message}</span>
            )}
          </label>
        </div>
        <div className="flex-1">
          <label className="text-gray-700 text-sm font-bold">
            Last Name
            <input
              className="border rounded w-full py-1 px-2 font-normal"
              {...register("lastName", { required: "This field is required" })}
            />
            {errors.lastName && (
              <span className="text-red-500">{errors.lastName.message}</span>
            )}
          </label>
        </div>
      </div>
      <div className="flex flex-col gap-5">
        <label className="text-gray-700 text-sm font-bold">
          Email Address
          <input
            type="email"
            className="border rounded w-full py-1 px-2 font-normal"
            {...register("email", { required: "This field is required" })}
          />
          {errors.email && (
            <span className="text-red-500">{errors.email.message}</span>
          )}
        </label>
        <label className="text-gray-700 text-sm font-bold">
          Role
          <select
            className="border rounded w-full py-1 px-2 font-normal"
            {...register("role", { required: "This field is required" })}
          >
            <option value="">Select Role</option>
            <option value="IT Admin">IT Admin</option>
            <option value="Manager">Manager</option>
            <option value="Software Engineer">Software Engineer</option>
          </select>
          {errors.role && (
            <span className="text-red-500">{errors.role.message}</span>
          )}
        </label>
        <label className="text-gray-700 text-sm font-bold">
          Password
          <input
            type="password"
            className="border rounded w-full py-1 px-2 font-normal"
            {...register("password", {
              required: "This field is required",
              minLength: {
                value: 6,
                message: "Password must be minimum 6 characters",
              },
            })}
          />
          {errors.password && (
            <span className="text-red-500">{errors.password.message}</span>
          )}
        </label>
        <label className="text-gray-700 text-sm font-bold">
          Confirm Password
          <input
            type="password"
            className="border rounded w-full py-1 px-2 font-normal"
            {...register("confirmPassword", {
              validate: (val) => {
                if (!val) {
                  return "This field is required";
                } else if (watch("password") !== val) {
                  return "Passwords do not match";
                }
              },
            })}
          />
          {errors.confirmPassword && (
            <span className="text-red-500">
              {errors.confirmPassword.message}
            </span>
          )}
        </label>
        <ProfileImageSection register={register} />
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-black text-white p-2 font-bold hover:bg-blue-500 text-xl rounded"
        >
          Create Account
        </button>
      </div>
    </form>
  );
};

export default Register;
