import React from "react";
import { useMutation } from "react-query";
import { useAppContext } from "../contexts/AppContext";
import * as apiClient from "../api-client";
import CroomForm from "../components/CroomForm";
import { useNavigate } from "react-router-dom";

const AddCroom = () => {
  const { showToast } = useAppContext();
  const navigate = useNavigate();
  const { mutate, isLoading } = useMutation(apiClient.addMyCroom, {
    onSuccess: () => {
      showToast({ message: "Conference Room Saved!", type: "SUCCESS" });
      navigate("/my-crooms");
    },
    onError: (error) => {
      showToast({
        message: `Error saving conference room: ${error.message}`,
        type: "ERROR",
      });
    },
  });

  const handleSave = (croomFormData) => {
    mutate(croomFormData);
  };

  return <CroomForm onSave={handleSave} isLoading={isLoading} mode="add" />;
};

export default AddCroom;
