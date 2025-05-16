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
      const errorData = await response.json;
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
    if(!response.ok){
        const errorData = await response.json;
        throw new Error(errorData?.error || "Failed to fetch posts")
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};
