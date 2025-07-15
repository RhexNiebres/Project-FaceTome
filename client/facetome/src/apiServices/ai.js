export const generatePost = async (prompt) => {
  try {
    const response = await fetch(import.meta.env.VITE_HOST + `/api/ai/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.error || "Failed to Generate post");
    }

    const data = await response.json();
    return { success: true, generatedpost: data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
