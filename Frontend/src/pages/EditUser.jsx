import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api-client";
import { useAppContext } from "../contexts/AppContext";

const EditUser = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useAppContext();
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const { mutateAsync: updateUser, isLoading } = useMutation(
    apiClient.updateUserById,
    {
      onSuccess: async () => {
        showToast({ message: "User updated successfully", type: "SUCCESS" });
        await queryClient.invalidateQueries("fetchUserById");
        navigate("/my-users");
      },
      onError: (error) => {
        showToast({ message: error.message, type: "ERROR" });
      },
    }
  );

  const onSubmit = async (data) => {
    try {
      await updateUser({ userId, ...data });
    } catch (error) {
      showToast({ message: error.message, type: "ERROR" });
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await apiClient.fetchUserById(userId);
        if (user) {
          setValue("firstName", user.firstName);
          setValue("lastName", user.lastName);
          setValue("email", user.email);
          setValue("role", user.role);
        }
      } catch (error) {
        showToast({ message: error.message, type: "ERROR" });
      }
    };

    fetchUser();
  }, [userId, setValue, showToast]);

  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-3xl font-bold">Edit User</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 ">
        <div className="flex flex-col gap-1">
          <label
            htmlFor="firstName"
            className="text-gray-700 text-sm font-bold"
          >
            First Name
            <input
              id="firstName"
              {...register("firstName", { required: "This field is required" })}
              className="border rounded w-full py-2 px-3 mt-1 focus:outline-none focus:ring focus:border-blue-300"
            />
          </label>
          {errors.firstName && (
            <span className="text-red-500">{errors.firstName.message}</span>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="lastName" className="text-gray-700 text-sm font-bold">
            Last Name
            <input
              id="lastName"
              {...register("lastName", { required: "This field is required" })}
              className="border rounded w-full py-2 px-3 mt-1 focus:outline-none focus:ring focus:border-blue-300"
            />
          </label>
          {errors.lastName && (
            <span className="text-red-500">{errors.lastName.message}</span>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-gray-700 text-sm font-bold">
            Email Address
            <input
              id="email"
              type="email"
              {...register("email", { required: "This field is required" })}
              className="border rounded w-full py-2 px-3 mt-1 focus:outline-none focus:ring focus:border-blue-300"
            />
          </label>
          {errors.email && (
            <span className="text-red-500">{errors.email.message}</span>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="role" className="text-gray-700 text-sm font-bold">
            Role
            <select
              id="role"
              {...register("role", { required: "This field is required" })}
              className="border rounded w-full py-2 px-3 mt-1 focus:outline-none focus:ring focus:border-blue-300"
            >
              <option value="">Select Role</option>
              <option value="IT Admin">IT Admin</option>
              <option value="Manager">Manager</option>
              <option value="Software Engineer">Software Engineer</option>
            </select>
          </label>
          {errors.role && (
            <span className="text-red-500">{errors.role.message}</span>
          )}
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded"
          >
            {isLoading ? "Updating..." : "Update User"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditUser;
