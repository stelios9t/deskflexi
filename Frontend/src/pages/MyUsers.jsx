import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "react-query";
import * as apiClient from "../api-client.js";
import { MdEmail } from "react-icons/md";
import { BsPersonVcardFill } from "react-icons/bs";
const MyUsers = () => {
  const { data } = useQuery("fetchMyUsers", apiClient.fetchMyUsers, {
    onError: () => {},
  });

  if (!data) {
    return <span>No users found</span>;
  }

  return (
    <div className="space-y-5">
      <span className="flex justify-between">
        <h1 className="text-3xl font-bold">Users</h1>
        <Link
          to="/register"
          className="flex bg-black text-white text-xl font-bold p-2 hover:bg-black"
        >
          Add User
        </Link>
      </span>
      <div className="grid grid-cols-1 gap-8">
        {data.map((user) => (
          <div
            key={user._id}
            className="flex flex-col justify-betyween border border-slate-300 rounded-lg p-8 gap-5"
          >
            <h2 className="text-2xl font-bold">
              Name: {user.firstName} {user.lastName}
            </h2>
            <div className="grid grid-cols-5 gap-2">
              <div className=" rounded-sm p-3 flex items-center">
                <BsPersonVcardFill className="mr-1" />
                Role: {user.role}
              </div>
            </div>
            <div className=" rounded-sm p-3 flex items-center">
              <MdEmail className="mr-1" />
              Email: {user.email}
            </div>
            <span className="flex justify-end">
              <Link
                className="flex bg-black text-white text-xl font-bold p-2 hover:bg-black"
                to={`/edit-user/${user._id}`}
              >
                View Details
              </Link>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyUsers;
