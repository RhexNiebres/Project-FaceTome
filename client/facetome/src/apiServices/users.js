export const getUserById = async (id) => {
  try {
    const response = await fetch(import.meta.env.VITE_HOST + `/users/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.error || "Failed fetching user");
    }

    const data = await response.json();
    return { success: true, user: data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const updateUser = async (id, userData) => {
  try {
    const response = await fetch(import.meta.env.VITE_HOST + `/users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.error || "Failed fetching user");
    }

    const data = await response.json();
    return { success: true, user: data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getAllUsers = async () => {
  try {
    const response = await fetch(import.meta.env.VITE_HOST + `/users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.error || "Failed to fetch users");
    }

    const users = await response.json();
    return { success: true, users };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
