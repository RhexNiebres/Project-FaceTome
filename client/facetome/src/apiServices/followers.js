export const getFollowers = async (userId) => {
  try {
    const response = await fetch(
      import.meta.env.VITE_HOST + `/follow/${userId}/followers`,
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

export const getFollowing = async (userId) => {
  try {
    const response = await fetch(
      import.meta.env.VITE_HOST + `/follow/${userId}/following`,
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
      throw new Error(errorData?.error || "Failed to fetch following");
    }

    const data = await response.json();
    return { success: true, following: data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const sendFollowRequest = async (followingId) => {
  try {
    const response = await fetch(import.meta.env.VITE_HOST + `/follow`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ followingId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.error || "Failed to send follow request");
    }

    const data = await response.json();
    return { success: true, followRequest: data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
