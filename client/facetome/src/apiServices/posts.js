export const getAllPostsForCurrentUser = async () => {
  try {
    const response = await fetch(
      import.meta.env.VITE_HOST + `/posts?isFollowingPostsInclude=false`,
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
      throw new Error(errorData?.error || "failed fetching user's posts");
    }

    const data = await response.json();
    return { success: true, posts: data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getAllPosts = async () => {
  try {
    const response = await fetch(
      import.meta.env.VITE_HOST + `/posts?isFollowingPostsInclude=true`,
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
      throw new Error(errorData?.error || "Failed to fetch posts");
    }
    const data = await response.json();
    return { success: true, posts: data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const createPost = async ({ title, content }) => {
  try {
    const response = await fetch(import.meta.env.VITE_HOST + `/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ title, content }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.error || "Failed to create post");
    }

    const data = await response.json();
    return { success: true, post: data };
  } catch(error){
    return { success: false, error: error.message };
  }
};

export const deletePost = async (postId) => {
  try {
    const response = await fetch(
      import.meta.env.VITE_HOST + `/posts/${postId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.error || "Failed to delete post");
    }
    const data = await response.json();
    return { success: true, message: data.message };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
