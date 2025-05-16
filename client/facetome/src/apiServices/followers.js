export const getFollowers = async (userId) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_HOST}/follow/${userId}/followers`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.error || "Failed to fetch followers");
    }

    const data = await response.json();
    return { success: true, followers: data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
