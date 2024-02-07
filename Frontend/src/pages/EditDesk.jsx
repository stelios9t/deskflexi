import React from "react";
import { useParams } from "react-router-dom";
import { useMutation, useQuery } from "react-query";
import * as apiClient from "../api-client";
import ManageDeskForm from "../forms/ManageDeskForm/ManageDeskForm";
import { useAppContext } from "../contexts/AppContext";
const EditDesk = () => {
  const { deskId } = useParams();
  const { showToast } = useAppContext();
  const { data: desk } = useQuery(
    "fetchDeskById",
    () => apiClient.fetchDeskById(deskId || ""),
    {
      enabled: !!deskId,
    }
  );
  const { mutate, isLoading } = useMutation(apiClient.updateDeskById, {
    onSuccess: () => {
      showToast({ message: "Desk Saved!", type: "SUCCESS" });
    },
    onError: () => {
      showToast({ message: "Error saving desk", type: "ERROR" });
    },
  });
  const handleSave = (deskFormData) => {
    deskFormData.deskId = deskId;
    mutate(deskFormData);
  };
  return (
    <ManageDeskForm desk={desk} onSave={handleSave} isLoading={isLoading} />
  );
};

export default EditDesk;
