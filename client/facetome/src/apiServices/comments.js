export const createComment = async (postId, content) => {
  try {
    const response = await fetch(
      import.meta.env.VITE_HOST + `/posts/${postId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ content }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to create comment");
    }

    const data = await response.json();
    return { success: true, comment: data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const deleteComment = async (commentId) => {
  try {
    const response = await fetch(
      import.meta.env.VITE_HOST + `/comments/${commentId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to delete comment");
    }

    const data = await response.json();
    return { success: true, message: data.message };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
