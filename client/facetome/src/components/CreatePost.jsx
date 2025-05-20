import { useState, useEffect } from "react";
import { createPost } from "../apiServices/posts";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await createPost({ title, content });

    if (result.success) {
      setTitle("");
      setContent("");
      if (onPostCreated) onPostCreated(result.post);
    } else {
      alert("Failed to create post");
    }
    setLoading(false);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h2>Create New Post</h2>

        <div>
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="4"
            required
          />
        </div>

        <button 
        type="submit"
        disabled={loading}
        >
            {loading ? "posting..." : "Create Post"}
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
