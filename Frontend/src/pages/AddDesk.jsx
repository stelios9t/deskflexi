import React from "react";
import ManageDeskForm from "../forms/ManageDeskForm/ManageDeskForm";
import { useMutation } from "react-query";
import { useAppContext } from "../contexts/AppContext";
import * as apiClient from "../api-client";
const AddDesk = () => {
  const { showToast } = useAppContext();
  const { mutate, isLoading } = useMutation(apiClient.addMyDesk, {
    onSuccess: () => {
      showToast({ message: "Desk Saved!", type: "SUCCESS" });
    },
    onError: () => {
      showToast({ message: "Error saving desk", type: "ERROR" });
    },
  });

  const handleSave = (deskFormData) => {
    mutate(deskFormData);
  };
  return (
    <ManageDeskForm onSave={handleSave} isLoading={isLoading}></ManageDeskForm>
  );
};

export default AddDesk;
