import { useState } from "react";
import { createPost } from "../apiServices/posts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";

const CreatePost = ({ onPostCreated }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const result = await createPost({ title, content });

    if (result.success) {
      setTitle("");
      setContent("");
      setShowForm(false);
      if (onPostCreated) onPostCreated(result.post);
    } else {
      alert(result.error || "Failed to create post");
    }
    setLoading(false);
  };

  return (
    <div className="bg-2 p-4 m-4 text-white rounded w-1/2 flex justify-center">
      <form onSubmit={handleSubmit}>
        <label htmlFor="title" className="text-l font-bold">
          Title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onClick={() => setShowForm(true)}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What's on your mind?"
          required
          className="p-2 m-2 rounded-xl w-full text-gray-500 bg-1"
        />
        {showForm && (
          <>
            <label htmlFor="content" className="text-l font-bold">
              Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows="1"
              required
              className="p-2 m-2 rounded-xl w-full text-gray-500 bg-1"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="p-2 m-2 bg-1 text-slate-200 hover:bg-2 rounded-xl "
              >
                {loading ? (
                  <div className="flex justify-center w-20">
                    <FontAwesomeIcon
                      icon={faCircleNotch}
                      spin
                      className="text-blue-500 text-2xl"
                    />
                  </div>
                ) : (
                  "Create Post"
                )}
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default CreatePost;
