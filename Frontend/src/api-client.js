const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
export const register = async (formData) => {
  const response = await fetch(`${API_BASE_URL}/api/users/register`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });
  const responseBody = await response.json();
  if (!response.ok) {
    throw new Error(responseBody.message);
  }
};

export const signIn = async (formData) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });
  const body = await response.json();
  if (!response.ok) {
    throw new Error(body.message);
  }
  return body;
};

export const validateToken = async () => {
  const response = await fetch(`${API_BASE_URL}/api/auth/validate-token`, {
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Token invalid");
  }
  return response.json();
};

export const signOut = async () => {
  const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
    credentials: "include",
    method: "POST",
  });
  if (!response.ok) {
    throw new Error("Error during sign out");
  }
};

export const addMyDesk = async (deskFormData) => {
  try {
    console.log("deskFormData:", deskFormData); // Log the form data for debugging

    const response = await fetch(`${API_BASE_URL}/api/my-desks`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json", // Update content type
      },
      body: JSON.stringify({
        deskNumber: deskFormData.deskNumber,
        floor: deskFormData.floor,
        amenities: deskFormData.amenities,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to add desk: ${errorData.message}`);
    }

    return response.json();
  } catch (error) {
    console.error(error);
    throw new Error("An unexpected error occurred.");
  }
};

export const fetchMyDesks = async () => {
  const response = await fetch(`${API_BASE_URL}/api/my-desks`, {
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Error fetching desks");
  }
  return response.json();
};

export const fetchDeskById = async (deskId) => {
  const response = await fetch(`${API_BASE_URL}/api/my-desks/${deskId}`, {
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Error fetching desks");
  }
  return response.json();
};

export const updateDeskById = async (deskFormData) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/my-desks/${deskFormData.deskId}`, // Assuming deskId is present in deskFormData
      {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json", // Change content type to JSON
        },
        body: JSON.stringify(deskFormData), // Convert deskFormData to JSON
      }
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to update desk: ${errorData.message}`);
    }
    return response.json();
  } catch (error) {
    console.error("Error updating desk:", error);
    throw new Error("An unexpected error occurred while updating desk.");
  }
};
