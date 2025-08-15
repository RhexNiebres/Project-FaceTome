import { useState } from "react";
import { deleteComment } from "../apiRequests/comments";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

const DeleteComment = ({ commentId, onDelete }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDelete = async () => {
    setLoading(true);
    setError(null);

    const result = await deleteComment(commentId);

    setLoading(false);
    if (result.success) {
      if (onDelete) {
        onDelete(commentId);
      }
      alert("Comment Deleted");
    } else {
      setError(result.error);
    }
  };

  return (
    <div>
      <button
        onClick={handleDelete}
        disabled={loading}
        aria-label="Delete comment"
        className={`text-sm flex items-center gap-1 transition-colors duration-200 ${
          loading ? "text-gray-400 cursor-not-allowed" : "hover:text-red-500"
        }`}
      >
        {loading ? (
          "Deleting..."
        ) : (
          <>
            <FontAwesomeIcon icon={faTrash} className="hover:text-red-500" />
          </>
        )}
      </button>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default DeleteComment;
