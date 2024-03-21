import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "react-query";
import * as apiClient from "../api-client";
import ManageDeskForm from "../forms/ManageDeskForm/ManageDeskForm";
import { useAppContext } from "../contexts/AppContext";

const EditDesk = () => {
  const { deskId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useAppContext();

  const {
    data: desk,
    isError,
    error,
  } = useQuery(
    ["fetchDeskById", deskId],
    () => apiClient.fetchDeskById(deskId || ""),
    {
      enabled: !!deskId,
      onSuccess: (data) => {
        console.log("Fetched desk data for editing:", data);
      },
      onError: (error) => {
        console.error("Error fetching desk data:", error);
        showToast({
          message: `Error fetching desk: ${error.message}`,
          type: "ERROR",
        });
      },
    }
  );

  const { mutate, isLoading } = useMutation(apiClient.updateDeskById, {
    onSuccess: () => {
      showToast({ message: "Desk Saved!", type: "SUCCESS" });
      navigate("/my-desks");
    },
    onError: () => {
      showToast({ message: "Error saving desk", type: "ERROR" });
    },
  });

  const handleSave = (deskFormData) => {
    deskFormData.deskId = deskId;
    mutate(deskFormData);
  };

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  return (
    <ManageDeskForm desk={desk} onSave={handleSave} isLoading={isLoading} />
  );
};

export default EditDesk;
