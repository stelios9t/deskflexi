import React from "react";
import CroomForm from "../components/CroomForm";
import { useAppContext } from "../contexts/AppContext";
import { useParams, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "react-query";
import * as apiClient from "../api-client";
const EditCroom = () => {
  const { croomId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useAppContext();
  const {
    data: croom,
    isError,
    error,
  } = useQuery(
    ["fetchCroomById", croomId],
    () => apiClient.fetchCroomById(croomId || ""),
    {
      enabled: !!croomId,
      onSuccess: (data) => {},
      onError: (error) => {
        showToast({
          message: `Error fetching desk: ${error.message}`,
          type: "ERROR",
        });
      },
    }
  );
  const { mutate, isLoading } = useMutation(apiClient.updateCroomById, {
    onSuccess: () => {
      showToast({ message: "Conference Room Saved!", type: "SUCCESS" });
      navigate("/my-crooms");
    },
    onError: () => {
      showToast({ message: "Error saving conference room", type: "ERROR" });
    },
  });
  const handleSave = (croomFormData) => {
    croomFormData.croomId = croomId;
    mutate(croomFormData);
  };
  const deleteMutation = useMutation(() => apiClient.deleteCroomById(croomId), {
    onSuccess: () => {
      showToast({
        message: "Conference room successfully deleted!",
        type: "SUCCESS",
      });
      navigate("/my-crooms");
    },
    onError: (error) => {
      showToast({
        message: "Error deleting conference room",
        type: "ERROR",
      });
    },
  });
  if (isError) {
    return <span>Error: {error.message}</span>;
  }
  const handleDelete = () => {
    deleteMutation.mutate();
  };
  return (
    <CroomForm
      croom={croom}
      mode="edit"
      onSave={handleSave}
      isLoading={isLoading}
      onDelete={handleDelete}
    />
  );
};

export default EditCroom;
