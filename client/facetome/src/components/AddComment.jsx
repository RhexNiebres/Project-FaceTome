import { useState } from "react";
import { createComment } from "../apiServices/comments";

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
    <form onSubmit={handleSubmit}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your comment..."
        rows={1}
        required
        className="p-2 w-full rounded text-black "
      ></textarea>
      <button type="submit" disabled={loading || content === ""}>
        {loading ? "Adding comment" : "Add Comment"}
      </button>
    </form>
  );
};

export default AddComment;
