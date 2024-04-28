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

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("firstName", data.firstName);
    formData.append("lastName", data.lastName);
    formData.append("email", data.email);
    formData.append("role", data.role);
    formData.append("password", data.password);

    if (data.imageFile && data.imageFile[0]) {
      formData.append("imageFile", data.imageFile[0]);
    }

    mutation.mutateAsync(formData).catch((error) => {
      console.error("Registration error:", error);
    });
  };
  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
      <h2 className="text-3xl font-bold">Create an Account</h2>
      <div className="flex flex-col md:flex-row gap-5">
        <div className="flex-1">
          <label className="text-gray-700 text-sm font-bold">
            First Name
            <input
              className="border rounded w-full py-1 px-2 font-normal"
              {...register("firstName", {
                required: "This field is required",
                minLength: {
                  value: 1,
                  message: "First name must be at least 1 character",
                },
                maxLength: {
                  value: 15,
                  message: "First name must not exceed 15 characters",
                },
                pattern: {
                  value: /^[A-Za-z]+$/,
                  message: "First name must contain only letters",
                },
              })}
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
              {...register("lastName", {
                required: "This field is required",
                minLength: {
                  value: 1,
                  message: "Last name must be at least 1 character",
                },
                maxLength: {
                  value: 15,
                  message: "Last name must not exceed 15 characters",
                },
                pattern: {
                  value: /^[A-Za-z]+$/,
                  message: "Last name must contain only letters",
                },
              })}
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
            <option value="Graduate Software Engineer">
              Graduate Software Engineer
            </option>
            <option value="Test Engineer">Test Engineer</option>
            <option value="Quality Assurance Engineer">
              Quality Assurance Engineer
            </option>
            <option value="DevOps Engineer">DevOps Engineer</option>
            <option value="Product Manager">Product Manager</option>
            <option value="UI/UX Designer">UI/UX Designer</option>
            <option value="Systems Analyst">Systems Analyst</option>
            <option value="Network Engineer">Network Engineer</option>
            <option value="Cybersecurity Specialist">
              Cybersecurity Specialist
            </option>
            <option value="Data Scientist">Data Scientist</option>
            <option value="Cloud Solutions Architect">
              Cloud Solutions Architect
            </option>
            <option value="Technical Support Specialist">
              Technical Support Specialist
            </option>
            <option value="Blockchain Developer">Blockchain Developer</option>
            <option value="AI/ML Engineer">AI/ML Engineer</option>
            <option value="Front-end Developer">Front-end Developer</option>
            <option value="Back-end Developer">Back-end Developer</option>
            <option value="Full Stack Developer">Full Stack Developer</option>
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
                message: "Password must be at least 6 characters",
              },
              maxLength: {
                value: 16,
                message: "Password must not exceed 16 characters",
              },
              pattern: {
                value: /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/,
                message:
                  "Password must contain at least one number and one symbol",
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
