export const toggleLikePost = async (postId) => {
  try {
    const response = await fetch(
      import.meta.env.VITE_HOST + `/posts/${postId}/like`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData || "Failed to toggle like");
    }
    const data = await response.json();
    return { success: true, message: data.message, like: data.like || null };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
