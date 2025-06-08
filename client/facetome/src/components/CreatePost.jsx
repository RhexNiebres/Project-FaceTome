import { useState, useEffect, useRef } from "react";
import { createPost } from "../apiServices/posts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";

const CreatePost = ({ onPostCreated }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const formRef = useRef(null);

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (formRef.current && !formRef.current.contains(event.target)) {
        setShowForm(false);
      }
    };

    if (showForm) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showForm]);

  return (
    <div
      ref={formRef}
      className="bg-2 p-4 m-4 text-white rounded-xl w-1/2 shadow-xl"
    >
      <form onSubmit={handleSubmit}>
        {!showForm ? (
          <input
            id="title"
            type="text"
            value={title}
            onClick={() => setShowForm(true)}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What's on your mind?"
            required
            className="p-2 rounded-xl w-full text-4 bg-gray-100"
          />
        ) : (
          <>
            <label htmlFor="title" className="text-l font-bold pl-3">
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="p-2 m-2 rounded-xl w-full text-4 bg-gray-100"
            />
            <label htmlFor="content" className="text-l font-bold pl-3">
              Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows="1"
              required
              className="p-2 m-2 rounded-xl w-full text-4 bg-gray-100"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="p-2 m-2 bg-gray-200 text-2 hover:bg-1 hover:text-gray-100 rounded-xl transition duration-300 ease-in-out"
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
