import { useState } from "react";
import { createComment } from "../apiRequests/comments";

const AddComment = ({ postId, onCommentAdded }) => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await createComment(postId, content);

    if (result.success) {
      setContent("");
      if (onCommentAdded) onCommentAdded(result.comment);
    }
    setLoading(false);
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col md:flex-row gap-2 p-2"
    >
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your comment..."
        rows={1}
        required
        className="p-2 w-full rounded text-black resize-none md:flex-1"
      ></textarea>

      <button
        className="bg-green-500 p-2 rounded text-white font-semibold hover:bg-green-400 disabled:opacity-55"
        type="submit"
        disabled={loading || content === ""}
      >
        {loading ? "Adding..." : "Add Comment"}
      </button>
    </form>
  );
};

export default AddComment;
