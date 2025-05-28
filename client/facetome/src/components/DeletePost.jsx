import { useState } from "react";
import { deletePost } from "../apiServices/posts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

const DeletePost = ({ postId, onDelete }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDelete = async () => {
    setLoading(true);
    setError(null);

    const result = await deletePost(postId);

    setLoading(false);
    if (result.success) {
      if (onDelete) {
        onDelete(postId);
      }
      alert("Post Deleted successfully");
    } else {
      setError(result.error);
    }
  };

  return (
    <div>
      <button onClick={handleDelete} disabled={loading}>
        {loading ? (
          " Deleting..."
        ) : (
          <>
            {" "}
            <FontAwesomeIcon
              icon={faTrash}
              className="hover:text-red-500"
            />{" "}
          </>
        )}
      </button>
    </div>
  );
};

export default DeletePost;
